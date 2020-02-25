import React from 'react';

import { FirebaseClass, FirebaseContext /* withFirebase */ } from '../firebase';

import { AuthStateHook, useAuthState } from 'react-firebase-hooks/auth';

import UserAuthAvatar from './UserAuthAvatar';

interface UserAuthAvatarLoadedProps {
  firebase: FirebaseClass;
}
const UserAuthAvatarLoaded: React.FC<UserAuthAvatarLoadedProps> = ({
  firebase,
}) => {
  const login = () => {
    console.log('login', firebase, FirebaseClass, FirebaseContext);
    // firebase.auth().signInWithEmailAndPassword('test@test.com', 'password');
    firebase.login();
  };
  const logout = () => {
    firebase.auth.signOut();
  };
  const [user, initialising, error]: AuthStateHook = useAuthState(
    firebase.auth,
  );
  // temp logging debugging (because I'm lazy apparently)
  console.log({ user, initialising, error }, firebase);
  return (
    <UserAuthAvatar
      {...{
        login,
        logout,
        user,
        initialising,
        error,
      }}
    />
  );
};

interface UserAuthAvatarLoaderProps {}
const UserAuthAvatarLoader: React.FC<UserAuthAvatarLoaderProps> = props => (
  <FirebaseContext.Consumer>
    {(firebase: FirebaseClass | null) =>
      firebase ? <UserAuthAvatarLoaded firebase={firebase} {...props} /> : '!!!'
    }
  </FirebaseContext.Consumer>
);
//
export default UserAuthAvatarLoader;
