/**
 * Add new words to the repo.
 *
 * Get words for games (and update last-used timestamp).
 *
 */
// import * as functions from 'firebase-functions';

import admin from './admin';
const db = admin.firestore();

// we could expand with other criteria here (hardness, user recency, etc)
export const getWords = async (limit: number) => {
  const updates: any = [];
  const output: any = [];
  await db
    .collection('Words')
    // .where('weightGuessed', '>', 0)
    .orderBy('usageCount', 'asc')
    .orderBy('last', 'asc')
    .orderBy('rand', 'asc')
    .limit(Math.min(limit * 2, 50))
    .get()
    .then((snap: any /*QuerySnapshot*/) =>
      snap.forEach((docSnap: any) => {
        // if we have already returned enough... skip the rest
        if (updates.length >= limit) return;
        // read details from the word
        const docData = docSnap.data();
        if (!(docData.word && docData.word.length > 2)) {
          console.error(`Skipping bad word data for ${docSnap.ref.path}`);
          return;
        }
        output.push(docData.word);
        // update word to cycle through them and get fewer repeats
        // last used timestamp
        const last = new Date();
        last.setHours(0, 0, 0, 0); // simplify to just the date
        if (
          docData.last &&
          docData.last.toDateString &&
          docData.last.toDateString() === last.toDateString()
        ) {
          console.log(
            `WARNING getWords returned a word [${docData.word}] last returned today... time to add more words`,
          );
        }
        // how many times has this word ever been used?
        const usageCount = (docData.usageCount || 0) + 1;
        // random number, for tie-breaker in sorting
        const rand = Math.round(Math.random() * (9999 - 0 + 1));
        // TODO(alanblount): consider how individuals should cycle vs. everyone should cycle
        const docUpdate = {
          last,
          usageCount,
          rand,
        };
        const docRef = db.doc(docSnap.ref.path);
        updates.push(docRef.update(docUpdate));
      }),
    );
  await Promise.all(updates);
  console.log(`getWords returning: ${output.join(', ')}`);
  return output
    .map((w: string) => w.trim())
    .filter((w: string) => w && w.length > 2);
};

// review and update all words
export const updateAllWords = async () => {
  const updates: any = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0); // simplify to just the date
  await db
    .collection('Words')
    .orderBy('word', 'asc')
    .get()
    .then((snap: any /*QuerySnapshot*/) =>
      snap.forEach((docSnap: any) => {
        // get a document reference with-which we can make changes
        const docRef = db.doc(docSnap.ref.path);
        // read details from the word
        const docData = docSnap.data();
        if (!(docData.word && docData.word.length > 2)) {
          console.error(`Deleting word which is too small ${docSnap.ref.path}`);
          return updates.push(docRef.delete());
        }
        // how many times has this word ever been used?
        const usageCount = docData.usageCount || 0;
        // random number, for tie-breaker in sorting
        const rand = Math.round(Math.random() * (9999 - 0 + 1));
        // last used date
        const last = docData.last || today;
        const docUpdate = {
          last,
          usageCount,
          rand,
        };
        console.error(
          `Updating ${docData.word} {rand: ${docUpdate.rand}, usageCount: ${docUpdate.usageCount}, last: ${docUpdate.last}`,
        );
        return updates.push(docRef.update(docUpdate));
      }),
    );
  await Promise.all(updates);
  return `Completed updating ${updates.length} words`;
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
