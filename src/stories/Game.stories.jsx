import React from 'react';

import { cloneDeep } from 'lodash';

// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import Game from '../components/game/Game';
import { TurnStatus } from '../logic/gameData';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

export default {
  title: 'Game',
};

export const turn2BlackTeamPrepare = () => {
  return <Game user={mockUserData} game={mockGameData} />;
};

turn2BlackTeamPrepare.story = {
  name: 'turn 2, black team, prepare',
};

export const turn2Encrypt = () => {
  const thisData = cloneDeep(mockGameData);
  thisData.turns[1].status = TurnStatus.ENCRYPT;
  return <Game user={mockUserData} game={thisData} />;
};

turn2Encrypt.story = {
  name: 'turn 2, encrypt',
};
