import * as functions from 'firebase-functions';

import { addWords, getWords } from './word_admin';
// import { activateGames } from './game_admin';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// TODO(alanblount): get words from database
// TODO(alanblount): get words not recently used by anyone
// TODO(alanblount): get words not recently used by people in this game
export const adminAddWords = functions.https.onRequest(
  async (request, response) => {
    if (typeof request.query.text === 'string') {
      const result = await addWords(request.query.text);
      response.send(result);
    } else {
      response.send('Nope... no words');
    }
  },
);

export const adminGetWords = functions.https.onRequest((request, response) => {
  const result = await getWords(4);
  response.send(result);
});

export const adminActiveGames = functions.https.onRequest(
  (request, response) => {
    response.send("Sorry, don't know this");
  },
);
