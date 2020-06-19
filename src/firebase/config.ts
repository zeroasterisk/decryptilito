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
// this config will be used to initialize firebase app
// firebase.initializeApp(config);

export default config;
