import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../App.tsx';
import { navigate } from 'hookrouter';

import mockGameData from '../mock/mockGameData';

storiesOf('App', module)
  .add('basic', () => {
    navigate('/', true);
    return <App data={mockData} />;
  })
  .add('about', () => {
    navigate('/about', true);
    return <App data={mockData} />;
  })
  .add('lobby', () => {
    navigate('/lobby', true);
    return <App data={mockData} />;
  })
  .add('game entry', () => {
    navigate('/game/mock_game_1', true);
    return <App data={mockData} />;
  })
  .add('game play', () => {
    navigate('/game/mock_game_1/mock_team_1', true);
    return <App data={mockData} />;
  })
  .add('404', () => {
    navigate('/404', true);
    return <App data={mockData} />;
  });
