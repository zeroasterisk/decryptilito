/**
 * Add new words to the repo.
 *
 * Get words for games (and update last-used timestamp).
 *
 */
// import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// we could expand with other criteria here (hardness, user recency, etc)
export const getWords = async (limit: number) => {
  const updates: any = [];
  const output: any = [];
  await db
    .collection('Words')
    // .where('weightGuessed', '>', 0)
    .orderBy('last', 'desc')
    .limit(Math.min(limit, 20))
    .get()
    .then((snap) =>
      snap.forEach((doc: any) => {
        // TODO(alanblount): update each of these docs with updated last timestamp
        updates.push(doc.set({ last: new Date() }, { merge: true }));
        output.push(doc.data);
      }),
    );
  await Promise.all(updates);
  return output;
};

// add N words to the repo
// TODO(alanblount): secure this
export const addWords = async (wordCSV: string) => {
  return await Promise.all(
    wordCSV.split(',').map(async (word: string) => {
      if (!(word && word.length > 2)) {
        return Promise.resolve();
      }
      return db.collection('Words').doc(word).set({
        word: word,
        weightGuessed: 0.5,
        weightLike: 0.5,
        weightHard: 0.5,
        last: new Date(),
      });
    }),
  );
};
