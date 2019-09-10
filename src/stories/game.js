import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import Game from '../Game.tsx';

import mockGameData from '../mock/mockGameData';

storiesOf('Game', module)
  .add('basic', () => {
    return <Game game={mockGameData} />;
  })
  .add('turn 2, black team, prepare', () => {
    const turn2data = {
      activeTurnNumber: 2,
      active_turn_phase: 'prepare',
    };
    return <Game game={mockGameData} {...turn2data} />;
  })
  .add('turn 2, encrypt', () => {
    const turn2data = {
      // game data
      activeTurnNumber: 2,
      active_turn_phase: 'encrypt',
    };
    return <Game game={mockGameData} {...turn2data} />;
  });
