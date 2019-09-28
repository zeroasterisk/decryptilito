import { expect } from 'chai';
import { cloneDeep } from 'lodash';

import { GameData, TurnData, TurnStatus } from '../logic/gameData';
// import { UserData } from '../logic/userData';

import mockGameData from '../mock/mockGameData';
// import mockUserData from '../mock/mockUserData';

import {
  calculateTurnStatus,
  createNextTurn,
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
    const turn = getTurnData(game, 1);
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.DONE);
    turn.status = TurnStatus.PREPARE;
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.DONE);
  });
  it('calculateTurnStatus returns turn status PREPARE if no clues', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const turn = getTurnData(game, 2);
    expect(calculateTurnStatus(turn)).to.equal(TurnStatus.PREPARE);
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
  it('getNextEncryptor gets the next "turn order" encryptor who has "least answers"', () => {
    const game = new GameData(cloneDeep(mockGameData));
    const member = getNextEncryptor('blackTeam', game);
    expect(member).to.be.a('object');
    expect(member.id).to.equal('6666');
    expect(member.name).to.equal('Eggbert');
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
