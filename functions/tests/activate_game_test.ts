// copied from firebase rules walkthrough project
// https://github.com/firebase/quickstart-testing
import { getWords } from '../src/activate_game';

import { expect } from 'chai';

import 'mocha';

import * as firebase from '@firebase/rules-unit-testing';

const TEST_FIREBASE_PROJECT_ID = 'test-firestore-rules-project';

const words = ['fire', 'earth', 'wind', 'water', 'hard', 'stale', 'worn out'];
const Jan1 = new Date('2020-01-01 00:00:00');
const Jan2 = new Date('2020-01-02 00:00:00');
const Jan3 = new Date('2020-01-03 00:00:00');

const buildWordDoc = (word: string) => {
  if (word === 'hard') {
    return {
      word: word,
      weightGuessed: 0.5,
      weightLike: 0.5,
      weightHard: 0.5,
      last: Jan2,
    };
  }
  if (word === 'stale') {
    return {
      word: word,
      weightGuessed: 0.5,
      weightLike: 0.5,
      weightHard: 0.5,
      last: Jan1,
    };
  }
  if (word === 'worn out') {
    return {
      word: word,
      weightGuessed: 0.5,
      weightLike: 0.5,
      weightHard: 0.5,
      last: Jan3,
    };
  }
  return {
    word: word,
    weightGuessed: 0.5,
    weightLike: 0.5,
    weightHard: 0.5,
    last: Jan2,
  };
};

describe('activate game', () => {
  const admin = firebase
    .initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
    })
    .firestore();

  before(async () => {
    await Promise.all(
      words.map((word) =>
        firebase.assertSucceeds(
          admin.doc(`Words/${word.replace(' ', '')}`).set(buildWordDoc(word)),
        ),
      ),
    );
  });

  after(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  describe('word setup', () => {
    it('can find a word record', async () => {
      await firebase.assertSucceeds(admin.doc('Words/fire').get());
    });
    it('can read a word record, and get all deatails', async () => {
      await firebase.assertSucceeds(
        admin
          .doc('Words/fire')
          .get()
          .then(async (doc) => {
            const data = await doc.data();
            expect(data).to.not.be.undefined;
            if (data) {
              expect(data.word).to.deep.equal('fire');
              expect(data.weightLike).to.deep.equal(0.5);
            }
          }),
      );
    });
  });
  describe('getWords', () => {
    it('should return without error', async () => {
      await firebase.assertSucceeds(getWords(1));
    });
    it('should return 1 word if that is the limit', async () => {
      await firebase.assertSucceeds(getWords(1));
    });
  });
});
