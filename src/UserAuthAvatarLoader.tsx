import React from 'react';

import {
  FirebaseClass,
  FirebaseContext /* withFirebase */,
} from './components/firebase';

import { AuthStateHook, useAuthState } from 'react-firebase-hooks/auth';

import UserAuthAvatar from './UserAuthAvatar';

interface UserAuthAvatarLoadedProps {
  firebase: FirebaseClass;
}
const UserAuthAvatarLoaded: React.FC<UserAuthAvatarLoadedProps> = ({
  firebase,
}) => {
  const login = () => {
    // firebase.auth().signInWithEmailAndPassword('test@test.com', 'password');
  };
  const logout = () => {
    firebase.auth.signOut();
  };
  const [user, initialising, error]: AuthStateHook = useAuthState(
    firebase.auth,
  );
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
