// copied from firebase rules walkthrough project
// https://github.com/firebase/quickstart-testing
const fs = require('fs');
const path = require('path');
var chai = require('chai');
const expect = chai.expect;

const TEST_FIREBASE_PROJECT_ID = 'test-firestore-rules-project';

const firebase = require('@firebase/rules-unit-testing');

const pendingGameEntry = {
  id: 'pendingGameEntry',
  status: 'ENTRY',
  uids: ['alice'],
};
const pendingGameLaunched = {
  id: 'pendingGameLaunched',
  status: 'LAUNCHED',
  uids: ['alice'],
};

const gameLaunchable = {
  id: 'gameLaunchable',
  status: 'ENTRY',
  uids: ['alice'],
};

const gameActive = {
  id: 'gameActive',
  status: 'ACTIVE',
  uids: ['alice', 'bob', 'carol', 'dave'],
  // team data
  whiteTeam: {
    uids: ['alice', 'bob'],
    teamColor: 'WHITE',
    teamName: 'action jackson',
    teamMemberNames: 'Luna, Edger, George',
    teamMembers: [
      { name: 'Luna', id: '1111' },
      { name: 'Edger', id: '2222' },
      { name: 'George', id: '3333' },
    ],
    words: ['swim', 'fly', 'walk', 'run'],
  },
  blackTeam: {
    uids: ['carol', 'dave'],
    teamColor: 'BLACK',
    teamName: 'flounder finder',
    teamMemberNames: 'Jerry, Gerry, Eggbert',
    teamMembers: [
      { name: 'Jerry', id: '4444' },
      { name: 'Gerry', id: '5555' },
      { name: 'Eggbert', id: '6666' },
    ],
    words: ['shoe', 'car', 'plane', 'boat'],
  },
};

/*
// TODO(alanblount): could move words into a subcollection and make actually private
const gameActiveWords = [
  {
    id: 'whiteTeamWords',
    "uids": ["alice", "bob"],
    teamColor: "WHITE",
    words: ['swim', 'fly', 'walk', 'run'],
  },
  {
    id: 'blackTeamWords',
    "uids": ["carol", "dave"],
    teamColor: "BLACK",
    words: ['shoe', 'car', 'plane', 'boat'],
  },
];
*/

const aliceAuth = {
  uid: 'alice',
  email: 'alice@example.com',
};

after(() => {
  firebase.apps().forEach((app) => app.delete());
});

before(async () => {
  // Load the content of the "firestore.rules" file into the emulator before running the
  // test suite. This is necessary because we are using a fake Project ID in the tests,
  // so the rules "hot reloading" behavior which works in the Web App does not apply here.
  const rulesContent = fs.readFileSync(
    path.resolve(__dirname, '../../firestore.rules'),
    'utf-8',
  );
  await firebase.loadFirestoreRules({
    projectId: TEST_FIREBASE_PROJECT_ID,
    rules: rulesContent,
  });
});

describe('pending game creation', () => {
  const db = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: aliceAuth,
    })
    .firestore();
  const dbAnon = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
    })
    .firestore();

  after(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it('cannot be created by an anon user', async () => {
    await firebase.assertFails(
      dbAnon.doc('PendingGames/pendingGameEntry').set(pendingGameEntry),
    );
  });

  it('can be created by an authenticated user', async () => {
    await firebase.assertSucceeds(
      db.doc('PendingGames/pendingGameEntry').set(pendingGameEntry),
    );
  });
  it('can be read', async () => {
    await firebase.assertSucceeds(
      db.doc('PendingGames/pendingGameEntry').get(),
    );
  });
});

describe('pending game reading', () => {
  const db = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: aliceAuth,
    })
    .firestore();
  const dbAnon = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
    })
    .firestore();

  before(async () => {
    const admin = firebase
      .initializeAdminApp({
        projectId: TEST_FIREBASE_PROJECT_ID,
      })
      .firestore();
    await firebase.assertSucceeds(
      admin.doc('PendingGames/pendingGameEntry').set(pendingGameEntry),
    );
    await firebase.assertSucceeds(
      admin.doc('PendingGames/pendingGameLaunched').set(pendingGameLaunched),
    );
  });

  after(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it('can be read by an authenticated user, if active', async () => {
    await firebase.assertSucceeds(
      db.doc('PendingGames/pendingGameEntry').get(),
    );
  });
  it('can be read by an anon user, if active', async () => {
    await firebase.assertSucceeds(
      dbAnon.doc('PendingGames/pendingGameEntry').get(),
    );
  });
  it('cannot be read by an authenticated user, if not active', async () => {
    await firebase.assertFails(
      db.doc('PendingGames/pendingGameLaunched').get(),
    );
  });
  it('cannot be read by an anon user, if not active', async () => {
    await firebase.assertFails(
      dbAnon.doc('PendingGames/pendingGameLaunched').get(),
    );
  });
});

describe('pending game writing', () => {
  const db = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: aliceAuth,
    })
    .firestore();
  const dbAnon = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
    })
    .firestore();

  before(async () => {
    const admin = firebase
      .initializeAdminApp({
        projectId: TEST_FIREBASE_PROJECT_ID,
      })
      .firestore();
    await admin.doc('PendingGames/pendingGameEntry').set(pendingGameEntry);
    await admin
      .doc('PendingGames/pendingGameLaunched')
      .set(pendingGameLaunched);
  });

  after(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it('can be written by an anon user, if active', async () => {
    await firebase.assertSucceeds(
      dbAnon
        .doc('PendingGames/pendingGameEntry')
        .set({ lastUpdated: 'by anon' }, { merge: true }),
    );
  });
  it('can be written by an authenticated user, if active', async () => {
    await firebase.assertSucceeds(
      db
        .doc('PendingGames/pendingGameEntry')
        .set({ lastUpdated: 'by alice' }, { merge: true }),
    );
  });
  it('cannot be written by an anon user, if not active', async () => {
    await firebase.assertFails(
      dbAnon
        .doc('PendingGames/pendingGameLaunched')
        .set({ lastUpdated: 'nope' }, { merge: true }),
    );
  });
  it('cannot be written by an authenticated user, if not active', async () => {
    await firebase.assertFails(
      db
        .doc('PendingGames/pendingGameLaunched')
        .set({ lastUpdated: 'nope' }, { merge: true }),
    );
  });
});

describe('actual game creation', () => {
  const db = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: aliceAuth,
    })
    .firestore();
  const dbAnon = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
    })
    .firestore();

  after(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it('cannot be created by an anon user', async () => {
    await firebase.assertFails(dbAnon.doc('Games/nope').set(gameLaunchable));
  });
  it('cannot be created by an authenticated user', async () => {
    await firebase.assertFails(db.doc('Games/nope').set(gameLaunchable));
  });
});

describe('pending game converted to actual game, if LAUNCHING', () => {
  const db = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: aliceAuth,
    })
    .firestore();

  before(async () => {
    const admin = firebase
      .initializeAdminApp({
        projectId: TEST_FIREBASE_PROJECT_ID,
      })
      .firestore();
    await admin.doc('PendingGames/gameLaunchable').set({
      id: 'gameLaunchable',
      status: 'LAUNCHING',
    });
  });

  after(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it('can be created by an authenticated user, if launched from an active PendingGame', async () => {
    await firebase.assertSucceeds(
      db.doc('Games/gameLaunchable').set(gameLaunchable),
    );
  });
});

describe('pending game can not converted to actual game, if not LAUNCHING', () => {
  const db = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: aliceAuth,
    })
    .firestore();

  before(async () => {
    const admin = firebase
      .initializeAdminApp({
        projectId: TEST_FIREBASE_PROJECT_ID,
      })
      .firestore();
    await admin.doc('PendingGames/gameLaunchable').set({
      id: 'gameLaunchable',
      status: 'LAUNCHED',
    });
  });

  after(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it('can be created by an authenticated user, if launched from an active PendingGame', async () => {
    await firebase.assertFails(
      db.doc('Games/gameLaunchable').set(gameLaunchable),
    );
  });
});

describe('game can be viewed only by users in it', () => {
  const db = firebase
    .initializeTestApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
      auth: aliceAuth,
    })
    .firestore();

  before(async () => {
    const admin = firebase
      .initializeAdminApp({
        projectId: TEST_FIREBASE_PROJECT_ID,
      })
      .firestore();
    await admin.doc('Games/gameActive').set(gameActive);
    const gameActiveNoAlice = Object.assign({}, gameActive, {
      uids: ['a', 'b', 'c', 'd'],
    });
    await admin.doc('Games/gameActiveNoAlice').set(gameActiveNoAlice);
  });

  after(async () => {
    await firebase.clearFirestoreData({ projectId: TEST_FIREBASE_PROJECT_ID });
  });

  it('can be viewed by a user in the uids list', async () => {
    await firebase.assertSucceeds(db.doc('Games/gameActive').get());
  });
  it('cannot be viewed by a user who is not in the uids list', async () => {
    await firebase.assertFails(db.doc('Games/gameActiveNoAlice').get());
  });
});

/*
// TODO(alanblount): could move words into a subcollection and make actually private
describe("game words", () => {
  const db = firebase.initializeTestApp({
    projectId: TEST_FIREBASE_PROJECT_ID,
    auth: aliceAuth
  }).firestore();

  before(async () => {
    const admin = firebase.initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID
    }).firestore();
    await admin.doc("Games/gameActive").set(gameActive);
    await admin.doc("Games/gameActive").collection('words').doc(gameActiveWords[0].id).set(gameActiveWords[0]);
    await admin.doc("Games/gameActive").collection('words').doc(gameActiveWords[1].id).set(gameActiveWords[1]);
  });

  after(async () => {
    await firebase.clearFirestoreData({projectId: TEST_FIREBASE_PROJECT_ID});
  });

  it('can be viewed by a user on the correct team', async () => {
    const doc = await db.doc("Games/gameActive").get();
    const wordSets = await doc.ref.collection('words').orderBy('teamColor', 'asc').get();
    console.log(wordSets);
  });
  it('cannot be viewed by a user on the other team', async () => {
    await firebase.assertFails(db.doc("Games/gameActive/words/blackTeamWords").get().then(
      doc => expect(doc.data().words).to.deep.equal(gameActiveWords[1].words)
    ));
  });
});
*/
