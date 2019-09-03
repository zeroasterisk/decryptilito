const mockData = {
  // based on UI state (may be able to toggle this)
  team_ui: 'blackTeam',
  // based on logged in user
  team: 'blackTeam',
  // which turn block is active
  active_turn_number: 2,
  active_turn_phase: 'prepare', // prepare, encrypt, guess_order_white_team, guess_order_black_team
  // team data
  whiteTeam: {
    teamColor: 'white',
    teamName: 'action jackson',
    teamMemberNames: 'Luna, Edger, George',
    teamMembers: [
      { name: 'Luna', id: '1111' },
      { name: 'Edger', id: '2222' },
      { name: 'George', id: '3333' },
    ],
    words: ['swim', 'fly', 'walk', 'run'],
    turns: [
      {
        phase: 'complete',
        encryptorName: 'Luna',
        clues: ['step', 'hover', 'dive'],
        correctOrder: [3, 2, 1],
        guessedOrderSelf: [3, 2, 1],
        guessedOrderOpponent: [3, 4, 2],
      },
    ],
  },
  blackTeam: {
    teamColor: 'black',
    teamName: 'flounder finder',
    teamMemberNames: 'Jerry, Gerry, Eggbert',
    teamMembers: [
      { name: 'Jerry', id: '4444' },
      { name: 'Gerry', id: '5555' },
      { name: 'Eggbert', id: '6666' },
    ],
    words: ['shoe', 'car', 'plane', 'boat'],
    turns: [
      {
        phase: 'complete',
        encryptorName: 'Jerry',
        clues: ['tires', 'gunnel', 'tail'],
        correctOrder: [2, 4, 3],
        guessedOrderSelf: [2, 4, 3],
        guessedOrderOpponent: [3, 4, 2],
      },
    ],
  },
};

export default mockData;
