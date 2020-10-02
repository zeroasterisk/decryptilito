import { expect } from 'chai';
import { cloneDeep } from 'lodash';

import { TeamKey, TurnStatus } from '../logic/enums';
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

const SAVE_TO_FIREBASE = false;

describe('GameEngine turn utilities', () => {
  describe('tick', () => {
    it('does nothing if no changes', () => {
      const thisData = cloneDeep(mockGameData);
      expect(thisData.tick(SAVE_TO_FIREBASE)).to.be.undefined;
      expect(thisData).to.deep.equal(mockGameData);
    });
    it('updates the game with the new calculated status if changed', () => {
      const thisData = cloneDeep(mockGameData);
      thisData.turns[thisData.turns.length - 1].status = TurnStatus.DONE;
      expect(thisData.tick(SAVE_TO_FIREBASE)).to.be.undefined;
      expect(thisData).to.deep.equal(mockGameData);
      expect(thisData.turns[thisData.turns.length - 1].status).to.equal(
        TurnStatus.PREPARE,
      );
    });
  });
  describe('teamName', () => {
    it('returns a friendly version of the team name', () => {
      expect(teamName(TeamKey.whiteTeam)).to.equal('White Team');
      expect(teamName(TeamKey.blackTeam)).to.equal('Black Team');
    });
  });
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
