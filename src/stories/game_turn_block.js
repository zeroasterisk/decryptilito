import React from 'react';

import { cloneDeep } from 'lodash';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import {
  // GameTurnBlock, (automatic router... probably should be tested)
  GameTurnBlockPast,
  GameTurnBlockFuture,
  GameTurnBlockActivePrepare,
  GameTurnBlockActiveEncryptor,
  GameTurnBlockActiveEncryptedWaiting,
  GameTurnBlockActiveDecryptors,
} from '../GameTurnBlock.tsx';
import { TeamKey, TurnStatus } from '../gameData';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

// setup data for Decryptors step
const mockGameDataDecrypting = cloneDeep(mockGameData);
mockGameDataDecrypting.turns[1].status = TurnStatus.DECRYPT_WHITE_CLUES;
mockGameDataDecrypting.turns[1].whiteTeam.clues = [
  'joggers',
  'loafers',
  'flapers',
];
mockGameDataDecrypting.turns[1].blackTeam.clues = ['trunk', 'sail', 'wing'];

storiesOf('GameTurnBlock (on blackTeam)', module)
  // After a turn is over
  .add('Past', () => {
    return (
      <GameTurnBlockPast
        team={TeamKey.blackTeam}
        turn_number={1}
        user={mockUserData}
        game={mockGameData}
      />
    );
  })
  // Before a turn is begun
  .add('Future', () => {
    return (
      <GameTurnBlockFuture
        team={TeamKey.blackTeam}
        turn_number={3}
        user={mockUserData}
        game={mockGameData}
      />
    );
  })
  // Current turn
  .add('Active:prepare, before oder given to encryptor', () => {
    return (
      <GameTurnBlockActivePrepare
        turn_number={2}
        user={mockUserData}
        game={mockGameData}
      />
    );
  })

  // encryptor active
  .add('Active:ENCRYPT, order given to encryptor', () => {
    //{{{}}}
    const thisData = cloneDeep(mockGameData);
    thisData.turns[1].status = TurnStatus.ENCRYPT;
    thisData.turns[1].blackTeam.clues = ['', '', ''];
    return (
      <GameTurnBlockActiveEncryptor
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })
  .add('Active:ENCRYPT (need to submit)', () => {
    const thisData = cloneDeep(mockGameData);
    thisData.turns[1].status = TurnStatus.ENCRYPT;
    thisData.turns[1].blackTeam.clues = ['trunk', 'sail', 'wing'];
    return (
      <GameTurnBlockActiveEncryptor
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })
  .add('Active:ENCRYPT (hidden order)', () => {
    // the encryptor decided to hide the correct order
    const thisData = cloneDeep(mockGameData);
    thisData.turns[1].status = TurnStatus.ENCRYPT;
    thisData.turns[1].blackTeam.correctOrderHidden = true;
    thisData.turns[1].blackTeam.clues = ['trunk', 'sail', 'wing'];
    return (
      <GameTurnBlockActiveEncryptor
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })
  .add('Active:ENCRYPT_PARTIAL (28 sec left)', () => {
    const thisData = cloneDeep(mockGameData);
    thisData.turns[1].status = TurnStatus.ENCRYPT_PARTIAL;
    thisData.turns[1].timeoutSecondsRemaining = 28;
    thisData.turns[1].blackTeam.clues = ['trunk', 'sail', 'wing'];
    return (
      <GameTurnBlockActiveEncryptor
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })
  .add('Active:ENCRYPT_PARTIAL (18 sec left)', () => {
    const thisData = cloneDeep(mockGameData);
    thisData.turns[1].status = TurnStatus.ENCRYPT_PARTIAL;
    thisData.turns[1].timeoutSecondsRemaining = 18;
    thisData.turns[1].blackTeam.clues = ['trunk', 'sail', 'wing'];
    return (
      <GameTurnBlockActiveEncryptor
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })
  .add('Active:ENCRYPT_PARTIAL (8 sec left)', () => {
    const thisData = cloneDeep(mockGameData);
    thisData.turns[1].status = TurnStatus.ENCRYPT_PARTIAL;
    thisData.turns[1].timeoutSecondsRemaining = 8;
    thisData.turns[1].blackTeam.clues = ['trunk', 'sail', 'wing'];
    return (
      <GameTurnBlockActiveEncryptor
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })
  .add('Active:ENCRYPT_PARTIAL (waiting on other team, 8 sec left)', () => {
    const thisData = cloneDeep(mockGameData);
    thisData.turns[1].status = TurnStatus.ENCRYPT_PARTIAL;
    thisData.turns[1].blackTeam.clues = ['trunk', 'sail', 'wing'];
    thisData.turns[1].timeoutSecondsRemaining = 8;
    return (
      <GameTurnBlockActiveEncryptedWaiting
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })

  // decryptors active
  .add('Active:DECRYPT_WHITE_CLUES', () => {
    const thisData = cloneDeep(mockGameDataDecrypting);
    thisData.turns[1].status = TurnStatus.DECRYPT_WHITE_CLUES;
    return (
      <GameTurnBlockActiveDecryptors
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })
  .add(
    'Active:DECRYPT_WHITE_CLUES_PARTIAL (white team has guessed already)',
    () => {
      const thisData = cloneDeep(mockGameDataDecrypting);
      thisData.turns[1].status = TurnStatus.DECRYPT_WHITE_CLUES_PARTIAL;
      thisData.turns[1].whiteTeam.guessedOrderSelf = [2, 4, 3];
      thisData.turns[1].whiteTeam.guessedOrderSelfSubmitted = true;
      return (
        <GameTurnBlockActiveDecryptors
          turn_number={2}
          user={mockUserData}
          game={thisData}
        />
      );
    },
  )
  .add(
    'Active:DECRYPT_WHITE_CLUES_PARTIAL (black team has guessed already)',
    () => {
      const thisData = cloneDeep(mockGameDataDecrypting);
      thisData.turns[1].status = TurnStatus.DECRYPT_WHITE_CLUES_PARTIAL;
      thisData.turns[1].whiteTeam.guessedOrderOpponent = [2, 4, 3];
      thisData.turns[1].whiteTeam.guessedOrderOpponentSubmitted = true;
      return (
        <GameTurnBlockActiveDecryptors
          turn_number={2}
          user={mockUserData}
          game={thisData}
        />
      );
    },
  )
  // TODO put some stuff about the "scratch" area here...
  .add('Active:DECRYPT_BLACK_CLUES', () => {
    const thisData = cloneDeep(mockGameDataDecrypting);
    thisData.turns[1].status = TurnStatus.DECRYPT_BLACK_CLUES;
    thisData.turns[1].whiteTeam.guessedOrderSelf = [2, 4, 3];
    thisData.turns[1].whiteTeam.guessedOrderSelfSubmitted = true;
    thisData.turns[1].whiteTeam.guessedOrderOpponent = [2, 4, 3];
    thisData.turns[1].whiteTeam.guessedOrderOpponentSubmitted = true;
    return (
      <GameTurnBlockActiveDecryptors
        turn_number={2}
        user={mockUserData}
        game={thisData}
      />
    );
  })
  .add(
    'Active:DECRYPT_BLACK_CLUES_PARTIAL (white team has guessed already)',
    () => {
      const thisData = cloneDeep(mockGameDataDecrypting);
      thisData.turns[1].status = TurnStatus.DECRYPT_BLACK_CLUES_PARTIAL;
      thisData.turns[1].whiteTeam.guessedOrderSelf = [2, 4, 3];
      thisData.turns[1].whiteTeam.guessedOrderSelfSubmitted = true;
      thisData.turns[1].whiteTeam.guessedOrderOpponent = [2, 4, 3];
      thisData.turns[1].whiteTeam.guessedOrderOpponentSubmitted = true;
      thisData.turns[1].blackTeam.guessedOrderOpponent = [4, 3, 2];
      thisData.turns[1].blackTeam.guessedOrderOpponentSubmitted = true;
      return (
        <GameTurnBlockActiveDecryptors
          turn_number={2}
          user={mockUserData}
          game={thisData}
        />
      );
    },
  )
  .add(
    'Active:DECRYPT_BLACK_CLUES_PARTIAL (black team has guessed already)',
    () => {
      const thisData = cloneDeep(mockGameDataDecrypting);
      thisData.turns[1].status = TurnStatus.DECRYPT_BLACK_CLUES_PARTIAL;
      thisData.turns[1].whiteTeam.guessedOrderSelf = [2, 4, 3];
      thisData.turns[1].whiteTeam.guessedOrderSelfSubmitted = true;
      thisData.turns[1].whiteTeam.guessedOrderOpponent = [2, 4, 3];
      thisData.turns[1].whiteTeam.guessedOrderOpponentSubmitted = true;
      thisData.turns[1].blackTeam.guessedOrderSelf = [4, 3, 2];
      thisData.turns[1].blackTeam.guessedOrderSelfSubmitted = true;
      return (
        <GameTurnBlockActiveDecryptors
          turn_number={2}
          user={mockUserData}
          game={thisData}
        />
      );
    },
  );

/*
  // encryptor is putting in clues
  ENCRYPT = 'ENCRYPT',
  ENCRYPT_PARTIAL = 'ENCRYPT_PARTIAL',
  ENCRYPT_PARTIAL = 'ENCRYPT_PARTIAL',
  // decryptors are guessing at order (one team at a time)
  DECRYPT_WHITE_CLUES = 'DECRYPT_WHITE_CLUES',
  DECRYPT_WHITE_CLUES_PARTIAL = 'DECRYPT_WHITE_CLUES_PARTIAL',
  DECRYPT_WHITE_CLUES_PARTIAL = 'DECRYPT_WHITE_CLUES_PARTIAL',
  SCORING_WHITE = 'SCORING_WHITE',
  DECRYPT_BLACK_CLUES = 'DECRYPT_BLACK_CLUES',
  DECRYPT_BLACK_CLUES_PARTIAL = 'DECRYPT_BLACK_CLUES_PARTIAL',
  DECRYPT_BLACK_CLUES_PARTIAL = 'DECRYPT_BLACK_CLUES_PARTIAL',
  SCORING_BLACK = 'SCORING_BLACK',
}
*/
