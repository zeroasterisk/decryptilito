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

import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// look for all ENTRY games, and activate them
export const activateGames = async (limit: number) => {
  const updates: any = [];
  const output: any = [];
  await db
    .collection('Games')
    .where('status', '==', 'ENTRY')
    .limit(Math.min(limit, 20))
    .get()
    .then((snap) =>
      snap.forEach((doc: any) => {
        // TODO(alanblount): update each game with words
        // TODO(alanblount): update each game with status
        updates.push(doc.set({ last: new Date() }, { merge: true }));
        output.push(doc.data().id);
      }),
    );
  await Promise.all(updates);
  return output;
};
