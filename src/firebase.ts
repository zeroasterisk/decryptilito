// firebase.ts
import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

import debug from 'debug';

const log = debug('app:firebase');

// import { config as dotconfig } from 'dotenv';

// convert .env configurations to process.env.key=val.
// dotconfig();

// Chosen path: we can keep the config here and load it statically or from ENV
// not committed to git, but will be visible to browser in built JS
const config = {
  appName: 'Decryptilito',
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_APP_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  // automaticDataCollectionEnabled: TRUE,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
};

log('firebase config: %s', config);

// TODO can we initialize the app somewhere else?
firebase.initializeApp(config);
log('firebase initialized: %s', firebase);

if (window && window.name && window.name !== 'nodejs') {
  // Enable offline persistance of data... only available in a browser
  // https://cloud.google.com/firestore/docs/manage-data/enable-offline
  firebase
    .firestore()
    .enablePersistence()
    .catch(function (err) {
      if (err.code === 'failed-precondition') {
        console.error(
          'Offline Storage not available, do you have multiple tabs open?  Can only be active in 1 at a time for offline persistance.',
        );
      } else if (err.code === 'unimplemented') {
        console.error(
          'Offline Storage not available, are you in a modern browser?  Consider google chrome.',
        );
      } else {
        console.error('Offline Storage not available.', err);
      }
    });
}

export default config;
