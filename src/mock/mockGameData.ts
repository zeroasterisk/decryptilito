import { GameData, GameStatus, TeamColor, TurnStatus } from '../gameData';

const mockData = new GameData({
  id: 'mockdata123',
  status: GameStatus.ACTIVE,
  // which turn block is active, finished turn #1, about to start turn #2
  activeTurnNumber: 2,
  turns: [
    {
      id: 1,
      status: TurnStatus.DONE,
      timeoutSecondsRemaining: 0,
      whiteTeam: {
        encryptor: { name: 'Luna', id: '1111' },
        clues: ['step', 'hover', 'dive'],
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
        clues: ['tires', 'gunnel', 'tail'],
        cluesSubmitted: true,
        correctOrder: [2, 4, 3],
        guessedOrderSelf: [2, 4, 3],
        guessedOrderSelfSubmitted: true,
        guessedOrderOpponent: [3, 4, 2],
        guessedOrderOpponentSubmitted: true,
        interception: false,
        miscommunication: false,
      },
    },
    {
      id: 2,
      status: TurnStatus.PREPARE,
      timeoutSecondsRemaining: 0,
      whiteTeam: {
        encryptor: { name: 'Edger', id: '2222' },
        clues: ['', '', ''],
        cluesSubmitted: false,
        correctOrder: [2, 4, 3],
        guessedOrderSelf: [],
        guessedOrderSelfSubmitted: false,
        guessedOrderOpponent: [],
        guessedOrderOpponentSubmitted: false,
        interception: false,
        miscommunication: false,
      },
      blackTeam: {
        encryptor: { name: 'Gerry', id: '5555' },
        clues: ['', '', ''],
        cluesSubmitted: false,
        correctOrder: [4, 3, 2],
        guessedOrderSelf: [],
        guessedOrderSelfSubmitted: false,
        guessedOrderOpponent: [],
        guessedOrderOpponentSubmitted: false,
        interception: false,
        miscommunication: false,
      },
    },
  ],
  // team data
  whiteTeam: {
    teamColor: TeamColor.WHITE,
    teamName: 'action jackson',
    teamMemberNames: 'Luna, Edger, George',
    teamMembers: [
      { name: 'Luna', id: '1111' },
      { name: 'Edger', id: '2222' },
      { name: 'George', id: '3333' },
    ],
    words: ['swim', 'fly', 'walk', 'run'],
  },
  blackTeam: {
    teamColor: TeamColor.BLACK,
    teamName: 'flounder finder',
    teamMemberNames: 'Jerry, Gerry, Eggbert',
    teamMembers: [
      { name: 'Jerry', id: '4444' },
      { name: 'Gerry', id: '5555' },
      { name: 'Eggbert', id: '6666' },
    ],
    words: ['shoe', 'car', 'plane', 'boat'],
  },
});

export default mockData;
