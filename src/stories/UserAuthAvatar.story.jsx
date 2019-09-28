import React from 'react';

// import { cloneDeep } from 'lodash';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import UserAuthAvatar from '../components/app/UserAuthAvatar';

import mockUserData from '../mock/mockUserData';

storiesOf('UserAuthAvatar', module)
  .add('initialising', () => {
    return <UserAuthAvatar initialising={true} />;
  })
  .add('anon, no auth', () => {
    return <UserAuthAvatar initialising={false} />;
  })
  .add('login error', () => {
    return (
      <UserAuthAvatar initialising={false} error="Some Error from Firebase" />
    );
  })
  .add('logged in, Jim Joe Bob', () => {
    return <UserAuthAvatar initialising={false} user={mockUserData} />;
  });
