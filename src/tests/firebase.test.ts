import cloneDeep from 'lodash.clonedeep';
import toPlainObject from 'lodash.toplainobject';
import { expect } from 'chai';
import { GameData, GameStatus, TurnStatus } from '../logic/gameData';
import mockGameData from '../mock/mockGameData';

// import * as firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';
import firebase from '../firebase';
import firebaseConfig from '../firebase/config';

beforeAll(() => {
  return firebase.initializeApp(firebaseConfig);
});

describe('Firebase Config', () => {
  it('exposes databaseURL', () => {
    expect(firebaseConfig).to.have.property('databaseURL');
    expect(firebaseConfig.databaseURL).to.equal(
      'https://decryptilito.firebaseio.com',
    );
  });
  it('exposes storageBucket', () => {
    expect(firebaseConfig).to.have.property('storageBucket');
    expect(firebaseConfig.storageBucket).to.equal('decryptilito.appspot.com');
  });
});

describe('Firebase Core Integration', () => {
  it('exposes auth', () => {
    expect(firebase).to.have.property('auth');
  });
  it('exposes firestore', () => {
    expect(firebase).to.have.property('firestore');
  });
  it('exposes firestore collection', () => {
    expect(firebase.firestore()).to.have.property('collection');
  });
});

// doesn't seem to work :(
// describe('Firebase Game Collection', () => {
// test('should be able to add mockGameData', () => {
//   const { id, ...gameDataWithoutId } = mockGameData;
//   delete gameDataWithoutId.turns;
//   console.log(gameDataWithoutId);
//   return firebase.firestore().collection('Game')
//     .doc(id)
//     .set(cloneDeep(gameDataWithoutId, toPlainObject));
// .then(() => expect(true).to.equal(true))
// .catch((error) => expect(error).to.equal(null));
// });
// test('should be able to find game "1qaz" test data', () => {
// firebase.firestore().collection('Game').where("shortCode", "==", "1qaz").get().then((querySnapshot) => {
//   querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//     expect(doc.id).to.equal('?');
//   });
// })
// .catch((error) =>  {
//     console.log("Error getting documents: ", error);
//     expect(error).to.equal('?');
// });
// });
// });
