import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../components/app';
import { navigate } from 'hookrouter';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

// TODO figure out a better way to set navigation

storiesOf('App', module)
  .add('basic', () => {
    navigate('/', true);
    return <App user={mockUserData} game={mockGameData} />;
  })
  .add('about', () => {
    navigate('/about', true);
    return <App user={mockUserData} game={mockGameData} />;
  })
  .add('lobby', () => {
    navigate('/lobby', true);
    return <App user={mockUserData} game={mockGameData} />;
  })
  .add('game entry', () => {
    navigate('/game/mock_game_1', true);
    return <App user={mockUserData} game={mockGameData} />;
  })
  .add('game play', () => {
    navigate('/game/mock_game_1/mock_team_1', true);
    return <App user={mockUserData} game={mockGameData} />;
  })
  .add('404', () => {
    navigate('/404', true);
    return <App user={mockUserData} game={mockGameData} />;
  });
