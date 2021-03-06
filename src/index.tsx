import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import './index.css';
import * as serviceWorker from './serviceWorker';

// TODO consider moving into App
// import fb from './firebaseInit';
// console.log('fbInit', fb);
import Firebase, { FirebaseContext } from './components/firebase';

const fb = new Firebase();
console.log('fb', fb);

ReactDOM.render(
  <FirebaseContext.Provider value={fb}>
    <App />
  </FirebaseContext.Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
