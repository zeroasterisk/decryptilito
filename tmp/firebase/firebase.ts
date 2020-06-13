// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
//!! import { FirebaseApp, FirebaseOptions } from '@firebase/app-types';
// import { FirebaseAuth } from '@firebase/auth-types'
// import { ServerValue } from '@firebase/database'
/*
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
import 'firebase/firestore';
import 'firebase/auth';

// servervalue timestamp is here
// types are in these packages


// Chosen path: we can keep the config here and load it statically or from ENV
// not committed to git, but will be visible to browser in built JS
const config: FirebaseOptions = {
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_APP_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  // automaticDataCollectionEnabled: TRUE,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
};

const appName: string = 'Decryptilito';
const fbApp: firebase.app.App = firebase.initializeApp(config, appName);

/*
// Alternative: we can load firebase hosted URLs
//              https://firebase.google.com/docs/hosting/reserved-urls
// This url is provided by firebase hosting (PROD)
// This url is also provided by local $ firebase serve
// The loaded URL will run>> firebase.initializeApp(config);
// This only works if we are using the global firebase object
// fetch('/__/firebase/init.js', ....) or load it into index.html

class FirebaseClass {
  public app: FirebaseApp;
  public fb: any;
  public err: any;
  // auth stuff
  public auth: any;
  public provider: any;
  // login stuff
  public user: any;
  public token: any;
  constructor() {
    console.log('firebase fb', fb);
    this.fb = fb;
    // const appName: string = 'Decryptilito';
    // this.app = app.initializeApp(config, appName);
    this.app = fb.initializeApp(config);
    console.log('firebase after init', this.app);
    // setup this.auth as shortcut
    this.auth = fb.auth();
    this.auth.useDeviceLanguage();
    // setup provider for Google OAuth
    this.provider = new fb.auth.GoogleAuthProvider();
    this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    this.provider.setCustomParameters({
      login_hint: 'yourname@gmail.com',
    });
  }
  public clearError() {
    this.err = null;
  }
  public login() {
    this.auth
      .signInWithPopup(this.provider)
      .then((result: any) => {
        console.log('logged in', result);
        // This gives you a Google Access Token. You can use it to access the Google API.
        this.token = result.credential.accessToken;
        // The signed-in user info.
        this.user = result.user;
      })
      .catch((error: any) => {
        console.log('login error', error);
        this.err = error;
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
      });
  }
}

export default FirebaseClass;
 */

export default null;
