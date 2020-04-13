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

firebase.initializeApp(config);
log('firebase initialized: %s', firebase);

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_API_KEY,
//   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASE_URL,
//   projectId: process.env.REACT_APP_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_APP_ID,
//   measurementId: process.env.REACT_APP_MEASUREMENT_ID,
// };
//
// firebase.initializeApp(firebaseConfig);
//
export default config;
