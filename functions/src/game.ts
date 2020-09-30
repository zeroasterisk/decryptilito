/**
 * When a game is created, it is in the status ENTRY.
 *
 * We need to update it and ensure it's ready to be ACTIVE.
 *
 * Possible outcomes:
 * - happy path
 *   - words are assigned for each teams
 *   - team balance is reviewed
 *   - status updated to ACTIVE
 * - error path
 *   - error message populated in game
 *   - status updated to ERROR
 */
// https://firebase.google.com/docs/functions/typescript
// import * as functions from 'firebase-functions';

import shuffle from 'lodash.shuffle';
import intersection from 'lodash.intersection';

import { getWords } from './word';
import admin from './admin';
const db = admin.firestore();

// look for known errors for game.teamData
export const getGameErrorForTeam = (gameData: any, team: string) => {
  const teamData = gameData[team];
  if (!teamData) return `Invalid team data, missing ${team}`;
  // verify words
  if (!teamData.words) return `Invalid team data, missing ${team}.words`;
  if (teamData.words.length !== 4)
    return `Invalid team data, should be 4 ${team}.words`;
  // verify members on each team
  if (!teamData.teamMembers)
    return `Invalid team data, missing ${team} members`;
  if (teamData.teamMembers.length < 2)
    return `Invalid team data, need at least 2 ${team} members`;
  if (teamData.teamMembers.length > 10)
    return `Invalid team data, max of 10 ${team} members`;
  if (!teamData.uids) return `Invalid team data, missing ${team} uids`;
  if (teamData.uids.length < 2)
    return `Invalid team data, need at least 2 ${team} uids`;
  if (teamData.teamMembers.length > 10)
    return `Invalid team data, max of 10 ${team} uids`;
  // no error
  return null;
};

// look for known errors for games
export const getGameError = (gameData: any) => {
  if (!gameData) return 'Missing game data';
  const error1 = getGameErrorForTeam(gameData, 'blackTeam');
  if (error1) return error1;
  const error2 = getGameErrorForTeam(gameData, 'whiteTeam');
  if (error2) return error2;
  // should never have the same word for both teams
  const sharedWords = intersection(
    gameData.blackTeam.words,
    gameData.whiteTeam.words,
  );
  if (sharedWords && sharedWords.length > 0)
    return `Invalid game data, both teams have the same words ${sharedWords.join(
      ', ',
    )}`;
  // should never have the same uid for both teams
  const sharedUids = intersection(
    gameData.blackTeam.uids,
    gameData.whiteTeam.uids,
  );
  if (sharedUids && sharedUids.length > 0)
    return `Invalid game data, both teams have the same uids ${sharedUids.join(
      ', ',
    )}`;
  // no error
  return null;
};

interface GameUpdateBlock {
  blackTeam: any;
  whiteTeam: any;
  status: string;
  error: string | null;
}

// look for all ENTRY games, and activate them
export const activateGames = async () => {
  const updates: any = [];
  const output: any = [];
  await db
    .collection('Games')
    // .where('status', '==', 'ENTRY') // TODO MUST UNCOMMENT
    .limit(10)
    .get()
    .then((snap: any /*QuerySnapshot*/) =>
      snap.forEach(async (docSnap: any) => {
        // get the data of the game, right now...
        const gameData = docSnap.data();
        // update each game with words
        const words = await getWords(8);
        if (!(words && words.length === 8)) {
          console.log(`Error, unable to get words for ${docSnap.ref.path}`);
          console.log(words);
          output.push(`Error, unable to get words for ${docSnap.ref.path}`);
          return;
        }
        const wordsShuffled = shuffle(words);
        gameData.blackTeam.words = wordsShuffled.slice(0, 4);
        gameData.whiteTeam.words = wordsShuffled.slice(4, 8);
        const docUpdate: GameUpdateBlock = {
          blackTeam: gameData.blackTeam,
          whiteTeam: gameData.whiteTeam,
          status: 'ACTIVE',
          error: null,
        };
        // verify that the game is ready to play
        const error = getGameError(gameData);
        if (error) {
          docUpdate.status = 'ERROR';
          docUpdate.error = error;
        }
        // update the doc with the new changes
        const docRef = db.doc(docSnap.ref.path);
        updates.push(docRef.update(docUpdate));
        // will return the ID for each game
        output.push(`${docSnap.ref.path} -> ${docUpdate.status}`);
      }),
    );
  await Promise.all(updates);
  return output.join('\n');
};
