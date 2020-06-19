import firebase from './index';
import config from './config';

// TODO can we initialize the app somewhere else?
firebase.initializeApp(config);

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
