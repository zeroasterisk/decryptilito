import { GameData, GameStatus, TeamColor, TurnStatus } from '../gameData';

const mockData = new GameData({
  id: 'mockdata123',
  status: GameStatus.ACTIVE,
  // which turn block is active, finished turn #1, about to start turn #2
  activeTurnNumber: 2,
  active_turn_phase: 'prepare', // prepare, encrypt, guess_order_white_team, guess_order_black_team
  turns: [
    {
      id: 1,
      status: TurnStatus.DONE,
      whiteTeam: {
        encryptor: { name: 'Luna', id: '1111' },
        clues: ['step', 'hover', 'dive'],
        correctOrder: [3, 2, 1],
        guessedOrderSelf: [3, 2, 1],
        guessedOrderOpponent: [3, 4, 2],
      },
      blackTeam: {
        encryptor: { name: 'Jerry', id: '4444' },
        clues: ['tires', 'gunnel', 'tail'],
        correctOrder: [2, 4, 3],
        guessedOrderOpponent: [3, 4, 2],
        guessedOrderSelf: [2, 4, 3],
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
