// import React from 'react';

// import { FirebaseClass, FirebaseContext /* withFirebase */ } from '../firebase';

// import { AuthStateHook, useAuthState } from 'react-firebase-hooks/auth';

import Alerts from './Alerts';

export default Alerts;

/*
interface AlertsLoadedProps {
  // firebase: FirebaseClass;
  firebase: FirebaseClass;
}
const AlertsLoaded: React.FC<AlertsLoadedProps> = ({ firebase }) => {
  // TODO figure out why a change in firebase.err isn't triggering a re-rendering of this component
  //   maybe extract err in AlertsLoader ?
  console.log('AlertsLoaded', firebase.err);
  // const [user, initialising, error]: AuthStateHook = useAuthState(
  //   firebase.auth,
  // );
  // console.log({ user, initialising, error }, firebase);
  return (
    <Alerts
      err={firebase.err && firebase.err.code}
      clearError={firebase.clearError}
    />
  );
};

interface AlertsLoaderProps {}
const AlertsLoader: React.FC<AlertsLoaderProps> = props => (
  <FirebaseContext.Consumer>
    {(firebase: FirebaseClass | null) =>
      firebase ? <AlertsLoaded firebase={firebase} {...props} /> : '!!!'
    }
  </FirebaseContext.Consumer>
);
//
export default AlertsLoader;
*/
