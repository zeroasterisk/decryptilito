import { expect } from 'chai';
import { GameData, GameStatus, TeamColor, TurnStatus } from '../gameData';
import mockGameData from '../mock/mockGameData';

describe('GameData', () => {
  const gameDataInputBasic = {
    id: 'abcdefg1234567',
    status: GameStatus.ACTIVE,
    turns: [
      {
        id: 1,
        status: TurnStatus.PREPARE,
        timeoutSecondsRemaining: 0,
        whiteTeam: {
          encryptor: { name: 'Luna', id: '1111' },
          correctOrder: [1, 2, 3],
          clues: ['', '', ''],
          cluesSubmitted: false,
          guessedOrderOpponent: [],
          guessedOrderOpponentSubmitted: false,
          guessedOrderSelf: [],
          guessedOrderSelfSubmitted: false,
        },
        blackTeam: {
          encryptor: { name: 'Jerry', id: '4444' },
          correctOrder: [1, 2, 3],
          clues: ['', '', ''],
          cluesSubmitted: false,
          guessedOrderOpponent: [],
          guessedOrderOpponentSubmitted: false,
          guessedOrderSelf: [],
          guessedOrderSelfSubmitted: false,
        },
        errors: [],
      },
    ],
    activeTurnNumber: 1,
    whiteTeam: {
      teamColor: 'white',
      teamName: 'action jackson',
      teamMembers: [
        { name: 'Luna', id: '1111' },
        { name: 'Edger', id: '2222' },
        { name: 'George', id: '3333' },
      ],
      words: ['swim', 'fly', 'walk', 'run'],
    },
    blackTeam: {
      teamColor: 'black',
      teamName: 'flounder finder',
      teamMembers: [
        { name: 'Jerry', id: '4444' },
        { name: 'Gerry', id: '5555' },
        { name: 'Eggbert', id: '6666' },
      ],
      words: ['shoe', 'car', 'plane', 'boat'],
    },
  };

  it('basic input data maintained', () => {
    const game = new GameData(gameDataInputBasic);
    // console.log("in test");
    // console.log(game);
    expect(game.id).to.equal('abcdefg1234567');
    expect(game.status).to.equal('ACTIVE');
    expect(game.turns).to.deep.equal(gameDataInputBasic.turns);
    expect(game.activeTurnNumber).to.equal(1);
    expect(game.whiteTeam).to.deep.equal(gameDataInputBasic.whiteTeam);
    expect(game.blackTeam).to.deep.equal(gameDataInputBasic.blackTeam);
  });
  it('basic input data should validate', () => {
    const game = new GameData(gameDataInputBasic);
    // console.log("in test");
    // console.log(game);
    expect(game.validate()).to.equal(true);
  });
  it('new game data created, with randomly generate id', () => {
    const game = new GameData({});
    expect(game.id).to.be.a('string');
    expect(game.id.length).to.equal(15);
  });
  it('new game data created, with a correct default values', () => {
    const game = new GameData({});
    expect(game.status).to.equal('ENTRY');
    expect(game.turns).to.deep.equal([]);
    expect(game.activeTurnNumber).to.equal(0);
    expect(game.whiteTeam).to.deep.equal({
      team: 'WHITE',
      teamName: '',
      teamMembers: [],
      words: [],
      turns: [],
    });
    expect(game.blackTeam).to.deep.equal({
      team: 'BLACK',
      teamName: '',
      teamMembers: [],
      words: [],
      turns: [],
    });
  });
  it('should work with mockGameData, for stories', () => {
    const game = new GameData({ ...mockGameData });
    // todo is instance of...
    expect(game.id).to.equal('mockdata123');
    expect(game.status).to.equal('ACTIVE');
    expect(game.turns).to.deep.equal(mockGameData.turns);
    expect(game.activeTurnNumber).to.equal(2);
    expect(game.whiteTeam).to.deep.equal(mockGameData.whiteTeam);
    expect(game.blackTeam).to.deep.equal(mockGameData.blackTeam);
    expect(game.validate()).to.equal(true);
  });
});
