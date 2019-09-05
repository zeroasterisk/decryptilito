import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import Game from '../Game.tsx';

import mockData from './mock_data';

storiesOf('Game', module)
  .add('basic', () => {
    return <Game {...mockData} />;
  })
  .add('turn 2, black team, prepare', () => {
    const turn2data = {
      activeTurnNumber: 2,
      active_turn_phase: 'prepare',
    };
    return <Game {...mockData} {...turn2data} />;
  })
  .add('turn 2, encrypt', () => {
    const turn2data = {
      // game data
      activeTurnNumber: 2,
      active_turn_phase: 'encrypt',
    };
    return <Game {...mockData} {...turn2data} />;
  });
