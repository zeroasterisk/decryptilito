import React from 'react';

import { cloneDeep } from 'lodash';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import {
  GameTurnBlock,
  GameTurnBlockPast,
  GameTurnBlockFuture,
  GameTurnBlockActivePrepare,
  GameTurnBlockActiveEncryptor,
  GameTurnBlockActiveAwaitingDecryption,
  GameTurnBlockActiveDecryptors,
} from '../GameTurnBlock.tsx';

import mockData from './mock_data';

storiesOf('GameTurnBlock', module)
  // After a turn is over
  .add('Past', () => {
    return <GameTurnBlockPast turn_number={1} {...mockData} />;
  })
  // Before a turn is begun
  .add('Future', () => {
    return <GameTurnBlockFuture turn_number={3} {...mockData} />;
  })
  // Current turn
  .add('Active:prepare, before oder given to encryptor', () => {
    const thisData = cloneDeep(mockData);
    thisData.blackTeam.turns.push({
      phase: 'prepare',
      encryptorName: 'Eggbert',
      clues: ['', '', ''],
      correctOrder: [2, 4, 3],
      guessedOrderSelf: [],
      guessedOrderOpponent: [],
    });
    return <GameTurnBlockActivePrepare turn_number={2} {...thisData} />;
  })
  .add('Active:encryptor, order given to encryptor', () => {
    const thisData = cloneDeep(mockData);
    thisData.blackTeam.turns.push({
      phase: 'encrypt',
      encryptorName: 'Eggbert',
      decryptorNames: 'Jerry, Gerry',
      clues: ['', '', ''],
      correctOrder: [2, 4, 3],
      guessedOrderSelf: [],
      guessedOrderOpponent: [],
    });
    return <GameTurnBlockActiveEncryptor turn_number={2} {...thisData} />;
  })
  .add(
    'Active:awaitingDecryption, waiting on both encryptors to finish',
    () => {
      const thisData = cloneDeep(mockData);
      thisData.blackTeam.turns.push({
        phase: 'awaitingDecryption',
        encryptorName: 'Eggbert',
        decryptorNames: 'Jerry, Gerry',
        clues: ['trunk', 'sail', 'wing'],
        correctOrder: [2, 4, 3],
        guessedOrderSelf: [],
        guessedOrderOpponent: [],
      });
      return (
        <GameTurnBlockActiveAwaitingDecryption turn_number={2} {...thisData} />
      );
    },
  )
  .add('Active:decryptors, black team guessing white', () => {
    const thisData = cloneDeep(mockData);
    thisData.blackTeam.turns.push({
      phase: 'decrypt',
      encryptorName: 'Eggbert',
      decryptorNames: 'Jerry, Gerry',
      clues: ['trunk', 'sail', 'wing'],
      correctOrder: [2, 4, 3],
      guessedOrderSelf: [],
      guessedOrderOpponent: [],
    });
    thisData.team_ui = 'whiteTeam';
    return <GameTurnBlockActiveDecryptors turn_number={2} {...thisData} />;
  })
  .add('Active:decryptors, black team guessing black', () => {
    const thisData = cloneDeep(mockData);
    thisData.blackTeam.turns.push({
      phase: 'decrypt',
      encryptorName: 'Eggbert',
      decryptorNames: 'Jerry, Gerry',
      clues: ['trunk', 'sail', 'wing'],
      correctOrder: [2, 4, 3],
      guessedOrderSelf: [],
      guessedOrderOpponent: [],
    });
    thisData.team_ui = 'blackTeam';
    return <GameTurnBlockActiveDecryptors turn_number={2} {...thisData} />;
  });
