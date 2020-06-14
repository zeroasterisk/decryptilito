import { classToPlain } from 'class-transformer';
import { expect } from 'chai';
import { GameStatus, TurnStatus } from '../logic/enums';
import { GameData } from '../logic/gameData';
import { TeamData } from '../logic/teamData';
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
      teamColor: 'WHITE',
      teamName: 'action jackson',
      teamMembers: [
        { name: 'Luna', id: '1111' },
        { name: 'Edger', id: '2222' },
        { name: 'George', id: '3333' },
      ],
      words: ['swim', 'fly', 'walk', 'run'],
    },
    blackTeam: {
      teamColor: 'BLACK',
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
    expect(game.whiteTeam).to.deep.equal(
      new TeamData(gameDataInputBasic.whiteTeam),
    );
    expect(game.blackTeam).to.deep.equal(
      new TeamData(gameDataInputBasic.blackTeam),
    );
  });
  it('basic input data should validate', () => {
    const game = new GameData(gameDataInputBasic);
    // console.log("in test");
    // console.log(game);
    expect(game.validate()).to.equal(true);
  });
  // it('new game data created, with randomly generate id', () => {
  //   const game = new GameData({});
  //   expect(game.id).to.be.a('string');
  //   expect(game.id.length).to.equal(15);
  // });
  // it('new game data created, with randomly generate shortCode', () => {
  //   const game = new GameData({});
  //   expect(game.shortCode).to.be.a('string');
  //   expect(game.shortCode.length).to.equal(5);
  // });
  // it('new game data created, with a correct default values', () => {
  //   const game = new GameData({});
  //   expect(game.status).to.equal('ENTRY');
  //   expect(game.turns).to.deep.equal([]);
  //   expect(game.activeTurnNumber).to.equal(0);
  //   expect(game.whiteTeam).to.deep.equal(new TeamData({
  //     teamColor: 'WHITE',
  //     teamName: '',
  //     teamMembers: [],
  //     words: [],
  //     turns: [],
  //   }));
  //   expect(game.blackTeam).to.deep.equal(new TeamData({
  //     teamColor: 'BLACK',
  //     teamName: '',
  //     teamMembers: [],
  //     words: [],
  //     turns: [],
  //   }));
  // });
  it('should work with mockGameData, for stories', () => {
    const game = new GameData({ ...mockGameData });
    // todo is instance of...
    expect(game.id).to.equal('mockdata123');
    expect(game.status).to.equal('ACTIVE');
    expect(game.turns).to.deep.equal(mockGameData.turns);
    expect(game.activeTurnNumber).to.equal(2);
    expect(game.whiteTeam).to.deep.equal(new TeamData(mockGameData.whiteTeam));
    expect(game.blackTeam).to.deep.equal(new TeamData(mockGameData.blackTeam));
    expect(game.validate()).to.equal(true);
  });
  // it('should not have validation error for TeamData for mockGameData,whiteTeam', () => {
  //   const teamData = new TeamData({ ...mockGameData.whiteTeam });
  //   expect(teamData.validate()).to.equal(true);
  // });
  // it('should have validation error for TeamData for mockGameData,whiteTeam if we remove players', () => {
  //   const teamData = new TeamData({ ...mockGameData.whiteTeam });
  //   teamData.teamMembers = [{ id: 'a', name: 'a' }];
  //   expect(teamData.validate()).to.equal(false);
  //   expect(classToPlain(teamData.errors)).to.deep.equal([
  //     {
  //       children: [],
  //       constraints: { arrayMinSize: 'You need at least 2 players per team.' },
  //       property: 'teamMembers',
  //       value: [{ id: 'a', name: 'a' }],
  //     },
  //   ]);
  // });
  it('should have validation error when changing status to ACTIVE without enough players', () => {
    const game = new GameData({ ...mockGameData });
    game.whiteTeam.teamMembers = [{ id: 'b', name: 'b' }];
    expect(game.validate()).to.equal(false);
    // expect(game.whiteTeam.validate()).to.equal(false);
  });
  it('should have validation error when a turn is invalid', () => {
    const game = new GameData({ ...mockGameData });
    game.turns[0].status = 'foo';
    expect(game.validate()).to.equal(false);
    // expect(game.turns[0].validate()).to.equal(false);
  });
});
