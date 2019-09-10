import { expect } from 'chai';

import { GameData, TeamKey } from '../gameData';
import { UserData } from '../userData';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

import {
  getNextEncryptor,
  getRandomOrder,
  getTeamData,
  getTurnData,
  teamName,
  teamOppositeName,
} from '../gameEngine';

describe('GameEngine turn utilities', () => {
  it('teamName returns a friendly version of the team name', () => {
    expect(teamName(TeamKey.whiteTeam)).to.equal('White Team');
    expect(teamName(TeamKey.blackTeam)).to.equal('Black Team');
  });
  it('teamOppositeName returns a friendly version of the opposing team name', () => {
    expect(teamOppositeName(TeamKey.whiteTeam)).to.equal('Black Team');
    expect(teamOppositeName(TeamKey.blackTeam)).to.equal('White Team');
  });
  it('getTeamData gets the team data for whatever "myTeam" is', () => {
    const game = new GameData({ ...mockGameData });
    const user = new UserData({ ...mockUserData });
    user.myTeam = TeamKey.blackTeam;
    const team = getTeamData({ game, user });
    expect(team).to.be.a('object');
    expect(team).to.equal(game.blackTeam);
  });
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
  it('getTurnData gets current turn data', () => {
    const game = new GameData({ ...mockGameData });
    const turn = getTurnData({ game }, 1);
    expect(turn).to.be.a('object');
    expect(turn).to.equal(game.turns[0]);
  });
});
