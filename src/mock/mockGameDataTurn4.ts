import { cloneDeep } from 'lodash';

import { GameData, GameStatus, TeamColor, TurnStatus } from '../logic/gameData';

import mockGameData from './mockGameData';

const mockGameDataTurn4 = cloneDeep(mockGameData);

const turn2 = {
  id: 1,
  status: TurnStatus.DONE,
  timeoutSecondsRemaining: 0,
  whiteTeam: {
    encryptor: { name: 'Luna', id: '1111' },
    clues: ['joggers', 'loafers', 'flapers'],
    cluesSubmitted: true,
    correctOrder: [3, 2, 1],
    guessedOrderSelf: [3, 2, 1],
    guessedOrderSelfSubmitted: true,
    guessedOrderOpponent: [3, 4, 2],
    guessedOrderOpponentSubmitted: true,
    interception: false,
    miscommunication: false,
  },
  blackTeam: {
    encryptor: { name: 'Jerry', id: '4444' },
    clues: ['trunk', 'sail', 'wing'],
    cluesSubmitted: true,
    correctOrder: [2, 4, 3],
    guessedOrderSelf: [2, 4, 3],
    guessedOrderSelfSubmitted: true,
    guessedOrderOpponent: [3, 4, 2],
    guessedOrderOpponentSubmitted: true,
    interception: false,
    miscommunication: false,
  },
  errors: [],
};

const turn3 = {
  id: 2,
  status: TurnStatus.DONE,
  timeoutSecondsRemaining: 0,
  whiteTeam: {
    encryptor: { name: 'George', id: '3333' },
    clues: ['flapper', "save me i'm...", '... a simulation'],
    cluesSubmitted: true,
    correctOrder: [2, 1, 4],
    guessedOrderSelf: [2, 1, 4],
    guessedOrderSelfSubmitted: true,
    guessedOrderOpponent: [4, 3, 2],
    guessedOrderOpponentSubmitted: true,
    interception: true,
    miscommunication: false,
  },
  blackTeam: {
    encryptor: { name: 'Eggbert', id: '6666' },
    clues: ['sail', 'tail', 'beemer'],
    cluesSubmitted: true,
    correctOrder: [4, 3, 2],
    guessedOrderSelf: [4, 1, 2],
    guessedOrderSelfSubmitted: true,
    guessedOrderOpponent: [2, 1, 4],
    guessedOrderOpponentSubmitted: true,
    interception: true,
    miscommunication: true,
  },
  errors: [],
};

const turn4 = {
  id: 3,
  status: TurnStatus.DECRYPT_WHITE_CLUES,
  timeoutSecondsRemaining: 0,
  whiteTeam: {
    encryptor: { name: 'Luna', id: '1111' },
    clues: ['loco', 'skipper', 'dance from the 70s'],
    cluesSubmitted: true,
    correctOrder: [3, 2, 1],
    guessedOrderSelf: [2, 4, 1],
    guessedOrderSelfSubmitted: false,
    guessedOrderOpponent: [],
    guessedOrderOpponentSubmitted: false,
    interception: false,
    miscommunication: false,
  },
  blackTeam: {
    encryptor: { name: 'Jerry', id: '4444' },
    clues: ['never with windows', 'windows wont open', 'windows optional'],
    cluesSubmitted: true,
    correctOrder: [1, 3, 4],
    guessedOrderSelf: [],
    guessedOrderSelfSubmitted: false,
    guessedOrderOpponent: [],
    guessedOrderOpponentSubmitted: false,
    interception: false,
    miscommunication: false,
  },
  errors: [],
};

mockGameDataTurn4.turns[1] = turn2;
mockGameDataTurn4.turns[2] = turn3;
mockGameDataTurn4.turns[3] = turn4;

const mockData = new GameData(mockGameDataTurn4);

export default mockData;
