import React from 'react';

import { cloneDeep } from 'lodash';

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
} from '../components/game/GameTurnBlock.tsx';
import { TeamKey, TurnStatus } from '../logic/gameData';

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

export default {
  title: 'GameTurnBlock (on blackTeam)',
};

export const past = () => {
  return (
    <GameTurnBlockPast
      team={TeamKey.blackTeam}
      turn_number={1}
      user={mockUserData}
      game={mockGameData}
    />
  );
};

past.story = {
  name: 'Past',
};

export const future = () => {
  return (
    <GameTurnBlockFuture
      team={TeamKey.blackTeam}
      turn_number={3}
      user={mockUserData}
      game={mockGameData}
    />
  );
};

future.story = {
  name: 'Future',
};

export const activePrepareBeforeOderGivenToEncryptor = () => {
  return (
    <GameTurnBlockActivePrepare
      turn_number={2}
      user={mockUserData}
      game={mockGameData}
    />
  );
};

activePrepareBeforeOderGivenToEncryptor.story = {
  name: 'Active:prepare, before oder given to encryptor',
};

export const activeEncryptOrderGivenToEncryptor = () => {
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
};

activeEncryptOrderGivenToEncryptor.story = {
  name: 'Active:ENCRYPT, order given to encryptor',
};

export const activeEncryptNeedToSubmit = () => {
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
};

activeEncryptNeedToSubmit.story = {
  name: 'Active:ENCRYPT (need to submit)',
};

export const activeEncryptHiddenOrder = () => {
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
};

activeEncryptHiddenOrder.story = {
  name: 'Active:ENCRYPT (hidden order)',
};

export const activeEncryptPartial28SecLeft = () => {
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
};

activeEncryptPartial28SecLeft.story = {
  name: 'Active:ENCRYPT_PARTIAL (28 sec left)',
};

export const activeEncryptPartial18SecLeft = () => {
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
};

activeEncryptPartial18SecLeft.story = {
  name: 'Active:ENCRYPT_PARTIAL (18 sec left)',
};

export const activeEncryptPartial8SecLeft = () => {
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
};

activeEncryptPartial8SecLeft.story = {
  name: 'Active:ENCRYPT_PARTIAL (8 sec left)',
};

export const activeEncryptPartialWaitingOnOtherTeam8SecLeft = () => {
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
};

activeEncryptPartialWaitingOnOtherTeam8SecLeft.story = {
  name: 'Active:ENCRYPT_PARTIAL (waiting on other team, 8 sec left)',
};

export const activeDecryptWhiteClues = () => {
  const thisData = cloneDeep(mockGameDataDecrypting);
  thisData.turns[1].status = TurnStatus.DECRYPT_WHITE_CLUES;
  return (
    <GameTurnBlockActiveDecryptors
      turn_number={2}
      user={mockUserData}
      game={thisData}
    />
  );
};

activeDecryptWhiteClues.story = {
  name: 'Active:DECRYPT_WHITE_CLUES',
};

export const activeDecryptWhiteCluesPartialWhiteTeamHasGuessedAlready = () => {
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
};

activeDecryptWhiteCluesPartialWhiteTeamHasGuessedAlready.story = {
  name: 'Active:DECRYPT_WHITE_CLUES_PARTIAL (white team has guessed already)',
};

export const activeDecryptWhiteCluesPartialBlackTeamHasGuessedAlready = () => {
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
};

activeDecryptWhiteCluesPartialBlackTeamHasGuessedAlready.story = {
  name: 'Active:DECRYPT_WHITE_CLUES_PARTIAL (black team has guessed already)',
};

export const activeDecryptBlackClues = () => {
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
};

activeDecryptBlackClues.story = {
  name: 'Active:DECRYPT_BLACK_CLUES',
};

export const activeDecryptBlackCluesPartialWhiteTeamHasGuessedAlready = () => {
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
};

activeDecryptBlackCluesPartialWhiteTeamHasGuessedAlready.story = {
  name: 'Active:DECRYPT_BLACK_CLUES_PARTIAL (white team has guessed already)',
};

export const activeDecryptBlackCluesPartialBlackTeamHasGuessedAlready = () => {
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
};

activeDecryptBlackCluesPartialBlackTeamHasGuessedAlready.story = {
  name: 'Active:DECRYPT_BLACK_CLUES_PARTIAL (black team has guessed already)',
};
