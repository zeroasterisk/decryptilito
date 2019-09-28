import React from 'react';

// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import UserAuthAvatar from '../components/app/UserAuthAvatar';

import mockUserData from '../mock/mockUserData';

export default {
  title: 'UserAuthAvatar',
};

export const initialising = () => {
  return <UserAuthAvatar initialising={true} />;
};

export const anonNoAuth = () => {
  return <UserAuthAvatar initialising={false} />;
};

anonNoAuth.story = {
  name: 'anon, no auth',
};

export const loginError = () => {
  return (
    <UserAuthAvatar initialising={false} error="Some Error from Firebase" />
  );
};

loginError.story = {
  name: 'login error',
};

export const loggedInJimJoeBob = () => {
  return <UserAuthAvatar initialising={false} user={mockUserData} />;
};

loggedInJimJoeBob.story = {
  name: 'logged in, Jim Joe Bob',
};
