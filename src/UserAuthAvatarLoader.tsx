import React from 'react';

import firebase from 'firebase';

import { useAuthState } from 'react-firebase-hooks/auth';

import UserAuthAvatar from './UserAuthAvatar';

type UserAuthAvatarLoaderProps = {};
const UserAuthAvatarLoader: React.FC<UserAuthAvatarLoaderProps> = () => {
  const login = () => {
    // firebase.auth().signInWithEmailAndPassword('test@test.com', 'password');
  };
  const logout = () => {
    firebase.auth().signOut();
  };
  // const { user, initialising, error } = useAuthState(firebase);
  const { user, initialising, error } = {
    user: undefined,
    initialising: true,
    error: undefined,
  };
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

export default UserAuthAvatarLoader;
