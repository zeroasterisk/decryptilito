import React from 'react';

import { cloneDeep } from 'lodash';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import Game from '../Game';
import { TeamKey, TurnStatus } from '../gameData';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

storiesOf('Game', module)
  .add('turn 2, black team, prepare', () => {
    return <Game user={mockUserData} game={mockGameData} />;
  })
  .add('turn 2, encrypt', () => {
    const thisData = cloneDeep(mockGameData);
    thisData.turns[1].status = TurnStatus.ENCRYPT;
    return <Game user={mockUserData} game={thisData} />;
  });
