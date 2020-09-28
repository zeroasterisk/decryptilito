import { expect } from 'chai';

import { TeamKey } from '../logic/enums';
import { GameData } from '../logic/gameData';
import { UserData } from '../logic/userData';

import {
  getMyTeam,
  getTeamData,
  teamName,
  teamOppositeName,
} from '../logic/gameEngine';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

describe('GameEngine turn utilities', () => {
  describe('teamName', () => {
    it('returns a friendly version of the team name', () => {
      expect(teamName(TeamKey.whiteTeam)).to.equal('White Team');
      expect(teamName(TeamKey.blackTeam)).to.equal('Black Team');
    });
  });
  describe('teamOppositeName', () => {
    it('teamOppositeName returns a friendly version of the opposing team name', () => {
      expect(teamOppositeName(TeamKey.whiteTeam)).to.equal('Black Team');
      expect(teamOppositeName(TeamKey.blackTeam)).to.equal('White Team');
    });
  });
  describe('getMyTeam', () => {
    it('gets the team name for whatever "myTeam" is based on user uid', () => {
      const game = new GameData({ ...mockGameData });
      const user = new UserData({ ...mockUserData });
      const teamKey = getMyTeam(game, user);
      expect(teamKey).to.be.a('string');
      expect(teamKey).to.equal(TeamKey.whiteTeam);
    });
  });
  describe('getTeamData', () => {
    it('getTeamData gets the team data for whatever "myTeam" is', () => {
      const game = new GameData({ ...mockGameData });
      const user = new UserData({ ...mockUserData });
      const team = getTeamData({ game, user });
      expect(team).to.be.a('object');
      expect(team).to.deep.equal(game.whiteTeam);
    });
  });
});
