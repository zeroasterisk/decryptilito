import { expect } from 'chai';

import { GameData, TeamKey, TurnData } from '../gameData';
import { UserData } from '../userData';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

import { getTeamData, teamName, teamOppositeName } from '../gameEngine';

import {
  createNextTurn,
  getNextEncryptor,
  getRandomOrder,
  getTurnData,
} from '../turnEngine';

describe('TurnEngine turn utilities', () => {
  it('getTurnData gets current turn data', () => {
    const game = new GameData({ ...mockGameData });
    const turn = getTurnData(game, 1);
    expect(turn).to.be.a('object');
    expect(turn).to.equal(game.turns[0]);
  });
});
describe('TurnEngine turn scoring utilities', () => {
  it('scoreTurn returns turn data adding interception or miscommunication', () => {
    expect('stub').to.equal('stub');
  });
});
describe('TurnEngine turn phase calculation utilities', () => {
  it('getTurnPhase returns turn phase based on details', () => {
    expect('stub').to.equal('stub');
  });
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
    const game = new GameData({ ...mockGameData });
    const member = getNextEncryptor('blackTeam', game);
    expect(member).to.be.a('object');
    expect(member.id).to.equal('6666');
    expect(member.name).to.equal('Eggbert');
  });
  it('createNextTurn gets a new, blank, next turn data', () => {
    const game = new GameData({ ...mockGameData });
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
