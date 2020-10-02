import { expect } from 'chai';
import { cloneDeep } from 'lodash';

import { TeamKey, TurnStatus } from '../logic/enums';
import { GameData } from '../logic/gameData';
import { TurnData } from '../logic/turnData';
// import { UserData } from '../logic/userData';

import mockGameData from '../mock/mockGameData';
import mockGameDataTurn4 from '../mock/mockGameDataTurn4';
// import mockUserData from '../mock/mockUserData';

import {
  calculateTurnStatus,
  createNextTurn,
  getCluesDetails,
  getNextEncryptor,
  getRandomOrder,
  getTurnData,
  scoreTurn,
} from '../logic/turnEngine';

describe('TurnEngine turn utilities', () => {
  it('getTurnData gets current turn data', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = getTurnData(game, 1);
    expect(turn).to.be.a('object');
    expect(turn).to.equal(game.turns[0]);
  });
});
describe('TurnEngine turn scoring utilities', () => {
  it('scoreTurn returns turn data without changes if none needed', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = getTurnData(game, 1);
    const turnScored = scoreTurn(turn);
    expect(turnScored).to.deep.equal(turn);
  });
  it('scoreTurn gets interception for blackTeam guessing the whiteTeam order', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = getTurnData(game, 1);
    expect(turn.blackTeam.interception).to.equal(false);
    expect(turn.whiteTeam.interception).to.equal(false);
    expect(turn.blackTeam.miscommunication).to.equal(false);
    expect(turn.whiteTeam.miscommunication).to.equal(false);
    turn.whiteTeam.correctOrder = [1, 2, 3];
    turn.blackTeam.guessedOrderOpponent = [1, 2, 3];
    const turnScored = scoreTurn(turn);
    expect(turnScored.blackTeam.interception).to.equal(true);
  });
  it('scoreTurn gets interception for whiteTeam guessing the blackTeam order', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = getTurnData(game, 1);
    expect(turn.blackTeam.interception).to.equal(false);
    expect(turn.whiteTeam.interception).to.equal(false);
    expect(turn.blackTeam.miscommunication).to.equal(false);
    expect(turn.whiteTeam.miscommunication).to.equal(false);
    turn.blackTeam.correctOrder = [1, 2, 3];
    turn.blackTeam.guessedOrderOpponent = [1, 2, 4]; // guessed white wrong
    turn.blackTeam.guessedOrderSelf = [1, 2, 3];
    turn.whiteTeam.correctOrder = [1, 2, 3];
    turn.whiteTeam.guessedOrderOpponent = [1, 2, 3]; // guessed black correctly
    turn.whiteTeam.guessedOrderSelf = [1, 2, 3];
    const turnScored = scoreTurn(turn);
    expect(turnScored.blackTeam.interception).to.equal(false);
    expect(turnScored.whiteTeam.interception).to.equal(true); // <-- this
    expect(turnScored.blackTeam.miscommunication).to.equal(false);
    expect(turnScored.whiteTeam.miscommunication).to.equal(false);
  });
  it('scoreTurn gets miscommunication for guessing your own teams order, wrong', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = getTurnData(game, 1);
    expect(turn.blackTeam.interception).to.equal(false);
    expect(turn.whiteTeam.interception).to.equal(false);
    expect(turn.blackTeam.miscommunication).to.equal(false);
    expect(turn.whiteTeam.miscommunication).to.equal(false);
    turn.whiteTeam.correctOrder = [1, 2, 3];
    turn.whiteTeam.guessedOrderSelf = [1, 2, 4];
    turn.blackTeam.correctOrder = [1, 2, 3];
    turn.blackTeam.guessedOrderSelf = [1, 2, 4];
    const turnScored = scoreTurn(turn);
    expect(turnScored.blackTeam.interception).to.equal(false);
    expect(turnScored.whiteTeam.interception).to.equal(false);
    expect(turnScored.blackTeam.miscommunication).to.equal(true); // <-- this
    expect(turnScored.whiteTeam.miscommunication).to.equal(true); // <-- this
  });
});
describe('TurnEngine turn phase calculation utilities', () => {
  it('calculateTurnStatus returns turn status DONE if all submitted', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = game.turns[0]; // turn 1, done
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.DONE);
    // and it doesn't care about about you setting a status
    turn.status = TurnStatus.PREPARE;
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.DONE);
  });
  it('calculateTurnStatus returns turn status PREPARE if not ready', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = game.turns[1]; // turn 2, just setup
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.PREPARE);
  });
  it('calculateTurnStatus returns turn status PREPARE only 1 encryptor is ready', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = game.turns[1]; // turn 2, just setup
    turn.whiteTeam.encryptorReady = true;
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.PREPARE);
  });
  it('calculateTurnStatus returns turn status ENCRYPT if both teams are READY, but no clues for either team', () => {
    // this is kinda a failure of data, but I've seen it in development
    const game = new GameData(cloneDeep(mockGameData));
    const turn = game.turns[1]; // turn 2, just setup
    turn.blackTeam.encryptorReady = true;
    turn.whiteTeam.encryptorReady = true;
    turn.blackTeam.clues = ['', '', ''];
    turn.blackTeam.cluesSubmitted = false;
    turn.whiteTeam.clues = ['', '', ''];
    turn.whiteTeam.cluesSubmitted = false;
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.ENCRYPT);
  });
  it('calculateTurnStatus returns turn status ENCRYPT_PARTIAL if 1 of the clues are submitted', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = game.turns[1]; // turn 2, just setup
    turn.blackTeam.encryptorReady = true;
    turn.whiteTeam.encryptorReady = true;
    turn.blackTeam.clues = ['a', 'b', 'c'];
    turn.blackTeam.cluesSubmitted = true;
    turn.whiteTeam.clues = ['', '', ''];
    turn.whiteTeam.cluesSubmitted = false;
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.ENCRYPT_PARTIAL);
  });
  it('calculateTurnStatus returns turn status DECRYPT_WHITE_CLUES if both clues are submitted', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = game.turns[1]; // turn 2, just setup
    turn.blackTeam.encryptorReady = true;
    turn.whiteTeam.encryptorReady = true;
    turn.blackTeam.clues = ['a', 'b', 'c'];
    turn.blackTeam.cluesSubmitted = true;
    turn.whiteTeam.clues = ['a', 'b', 'c'];
    turn.whiteTeam.cluesSubmitted = true;
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.DECRYPT_WHITE_CLUES);
  });
  it('calculateTurnStatus returns turn status DECRYPT_WHITE_CLUES from mock', () => {
    const game = new GameData(cloneDeep(mockGameDataTurn4));
    const turn = game.turns[3]; // turn 4, DECRYPT_WHITE_CLUES
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.DECRYPT_WHITE_CLUES);
  });
  it('calculateTurnStatus returns turn status DECRYPT_WHITE_CLUES_PARTIAL guessedOrderOpponentSubmitted', () => {
    const game = new GameData(cloneDeep(mockGameDataTurn4));
    const turn = game.turns[3]; // turn 4, DECRYPT_WHITE_CLUES
    turn.blackTeam.guessedOrderOpponent = [1, 2, 3];
    turn.blackTeam.guessedOrderOpponentSubmitted = true;
    expect(calculateTurnStatus(turn)).to.equal(
      TurnStatus.DECRYPT_WHITE_CLUES_PARTIAL,
    );
  });
  it('calculateTurnStatus returns turn status DECRYPT_WHITE_CLUES_PARTIAL guessedOrderSelfSubmitted', () => {
    const game = new GameData(cloneDeep(mockGameDataTurn4));
    const turn = game.turns[3]; // turn 4, DECRYPT_WHITE_CLUES
    turn.whiteTeam.guessedOrderSelf = [1, 2, 3];
    turn.whiteTeam.guessedOrderSelfSubmitted = true;
    expect(calculateTurnStatus(turn)).to.equal(
      TurnStatus.DECRYPT_WHITE_CLUES_PARTIAL,
    );
  });
  // TODO fill in more status calculations here
});
describe('TurnEngine create next turn', () => {
  it('getRandomOrder creates 3 random numbers between 1-4', () => {
    const order = getRandomOrder();
    expect(order).to.be.a('array');
    expect(order.length).to.equal(3);
    if (order.includes(1) && order.includes(2) && order.includes(3)) {
      expect(!order.includes(4));
    }
    if (order.includes(1) && order.includes(2) && order.includes(4)) {
      expect(!order.includes(3));
    }
    expect(new Set(order).size).to.equal(3);
  });
  it('getRandomOrder creates 3 random numbers with no duplicates', () => {
    const order = getRandomOrder();
    expect(order).to.be.a('array');
    expect(order.length).to.equal(3);
    expect(new Set(order).size).to.equal(3);
  });
  it('getNextEncryptor gets the next "turn order" encryptor', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const member = getNextEncryptor(TeamKey.blackTeam, game);
    expect(member).to.be.a('object');
    expect(member.id).to.equal('6666');
    expect(member.name).to.equal('Eggbert');
  });
  it('getNextEncryptor gets the next "least answers" encryptor', () => {
    // fake all encryptors as Jerry for the black team
    const game = new GameData(cloneDeep(mockGameDataTurn4));
    game.turns = game.turns.map((t) => {
      t.blackTeam.encryptor = { name: 'Jerry', id: '4444' };
      return t;
    });
    const member = getNextEncryptor(TeamKey.blackTeam, game);
    expect(member).to.be.a('object');
    expect(member.id).to.equal('5555');
    expect(member.name).to.equal('Gerry');
    game.turns[1].blackTeam.encryptor = { name: 'Gerry', id: '5555' };
    const member2 = getNextEncryptor(TeamKey.blackTeam, game);
    expect(member2).to.be.a('object');
    expect(member2.id).to.equal('6666');
    expect(member2.name).to.equal('Eggbert');
  });
  it('createNextTurn gets a new, blank, next turn data', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turnData = createNextTurn(game);
    expect(turnData).to.be.a('object');
    // gets a random encryptor
    expect(turnData.whiteTeam.encryptor).to.be.a('object');
    expect(turnData.whiteTeam.encryptor.id).to.be.a('string');
    expect(turnData.whiteTeam.encryptor.name).to.be.a('string');
    expect(turnData.whiteTeam.correctOrder).to.be.a('array');
    expect(turnData.whiteTeam.correctOrder.length).to.equal(3);
    expect(turnData.blackTeam.encryptor).to.be.a('object');
    expect(turnData.blackTeam.encryptor.id).to.be.a('string');
    expect(turnData.blackTeam.encryptor.name).to.be.a('string');
    expect(turnData.blackTeam.correctOrder).to.be.a('array');
    expect(turnData.blackTeam.correctOrder.length).to.equal(3);
    const turn = new TurnData(turnData);
    expect(turn).to.be.a('object');
    expect(turn.whiteTeam.encryptor).to.be.a('object');
    expect(turn.whiteTeam.encryptor.id).to.be.a('string');
    expect(turn.whiteTeam.encryptor.name).to.be.a('string');
    expect(turn.whiteTeam.correctOrder).to.be.a('array');
    expect(turn.whiteTeam.correctOrder.length).to.equal(3);
    expect(turn.blackTeam.encryptor).to.be.a('object');
    expect(turn.blackTeam.encryptor.id).to.be.a('string');
    expect(turn.blackTeam.encryptor.name).to.be.a('string');
    expect(turn.blackTeam.correctOrder).to.be.a('array');
    expect(turn.blackTeam.correctOrder.length).to.equal(3);
    // TODO validate turn data
    // expect(turn.validate()).to.equal(true);
  });
});
describe('TurnEngine get clue details', () => {
  it('getCluesDetails for prior turn clues for either team', () => {
    // this should get each position, and fill in the clues and guesses
    const game = new GameData(cloneDeep(mockGameData));
    const clueDetailsWhite = getCluesDetails(game.turns[0], TeamKey.whiteTeam);
    expect(clueDetailsWhite).to.deep.equal([
      {
        index: 0,
        position: 1,
        clue: 'dive',
        guessedOrderSelf: 1,
        guessedOrderOpponent: 2,
      },
      {
        index: 1,
        position: 2,
        clue: 'hover',
        guessedOrderSelf: 2,
        guessedOrderOpponent: 4,
      },
      {
        index: 2,
        position: 3,
        clue: 'step',
        guessedOrderSelf: 3,
        guessedOrderOpponent: 3,
      },
      {
        index: 3,
        position: 4,
        clue: null,
        guessedOrderSelf: null,
        guessedOrderOpponent: null,
      },
    ]);
    const clueDetailsBlack = getCluesDetails(game.turns[0], TeamKey.blackTeam);
    expect(clueDetailsBlack).to.deep.equal([
      {
        index: 0,
        position: 1,
        clue: null,
        guessedOrderSelf: null,
        guessedOrderOpponent: null,
      },
      {
        index: 1,
        position: 2,
        clue: 'tires',
        guessedOrderSelf: 2,
        guessedOrderOpponent: 3,
      },
      {
        index: 2,
        position: 3,
        clue: 'tail',
        guessedOrderSelf: 3,
        guessedOrderOpponent: 2,
      },
      {
        index: 3,
        position: 4,
        clue: 'gunnel',
        guessedOrderSelf: 4,
        guessedOrderOpponent: 4,
      },
    ]);
  });
});
