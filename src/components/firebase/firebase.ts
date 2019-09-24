// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import { FirebaseApp, FirebaseOptions } from '@firebase/app-types';
// import { FirebaseAuth } from '@firebase/auth-types'
// import { ServerValue } from '@firebase/database'
// import { DataSnapshot, Reference, FirebaseDatabase } from '@firebase/database-types'
import * as app from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';

// servervalue timestamp is here
// types are in these packages

// Chosen path: we can keep the config here and load it statically or from ENV
// not committed to git, but will be visible to browser in built JS
const config: FirebaseOptions = {
  apiKey: process.env.REACT_APP_APIKEY,
  appId: process.env.REACT_APP_APPID,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASEURL,
  locationId: process.env.REACT_APP_LOCATIONID,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
};

// Alternative: we can load firebase hosted URLs
//              https://firebase.google.com/docs/hosting/reserved-urls
// This url is provided by firebase hosting (PROD)
// This url is also provided by local $ firebase serve
// The loaded URL will run>> firebase.initializeApp(config);
// This only works if we are using the global firebase object
// fetch('/__/firebase/init.js', ....) or load it into index.html

class FirebaseClass {
  public app: FirebaseApp;
  public auth: any;
  constructor() {
    // const appName: string = 'Decryptilito';
    // this.app = app.initializeApp(config, appName);
    this.app = app.initializeApp(config);
    console.log('firebase after init', this.app);
    this.auth = app.auth();
  }
}

export default FirebaseClass;
