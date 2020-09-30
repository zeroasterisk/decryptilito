// copied from firebase rules walkthrough project
// https://github.com/firebase/quickstart-testing
// import { getWords } from '../src/game_admin';
import { getWords } from '../src/word_admin';

import { expect } from 'chai';

// import 'mocha';

import * as firebaseSource from 'firebase-functions-test';
// admin is used in the functions to interact with the database, we need to hijack that.
import * as admin from 'firebase-admin';

// online
const test = firebaseSource({
  authDomain: 'decryptilito2.firebaseapp.com',
  databaseURL: 'https://decryptilito2.firebaseio.com',
  projectId: 'decryptilito2',
  storageBucket: 'decryptilito2.appspot.com',
});

// offline
const test = firebaseSource();

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

describe('game admin', () => {
  const admin = firebase
    .initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
    })
    .firestore();

  before(() => {
    // [START stubAdminInit]
    // If index.js calls admin.initializeApp at the top of the file,
    // we need to stub it out before requiring index.js. This is because the
    // functions will be executed as a part of the require process.
    // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
    adminInitStub = sinon.stub(admin, 'initializeApp');
    // Now we can require index.js and save the exports inside a namespace called myFunctions.
    myFunctions = require('../index');
    // [END stubAdminInit]
  });

  after(() => {
    // Restore admin.initializeApp() to its original method.
    adminInitStub.restore();
    // Do other cleanup tasks.
    test.cleanup();
  });

  describe('activate game', () => {
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
      await firebase.clearFirestoreData({
        projectId: TEST_FIREBASE_PROJECT_ID,
      });
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
});
