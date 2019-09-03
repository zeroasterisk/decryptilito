import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Game from '../Game.tsx';
import {navigate} from 'hookrouter';

import mockData from './mock_data';

storiesOf('Game', module)
  .add('basic', () => {
    return (<Game data={mockData} />);
  })
  .add('turn 2, prepare', () => {
    const turn2data = {
      active_turn_number: 2,
      active_turn_phase: "prepare",
    };
    const data = {...mockData, ...turn2data};

    return (<Game data={data} />);
  })
  .add('turn 2, encrypt', () => {
    const turn2data = {
      // game data
      active_turn_number: 2,
      active_turn_phase: "encrypt",
    };
    const data = {...mockData, ...turn2data};

    return (<Game data={data} />);
  })
;

