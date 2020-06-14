import { expect } from 'chai';

import { TeamKey } from '../logic/enums';
import { GameData } from '../logic/gameData';
import { UserData } from '../logic/userData';

import { getTeamData, teamName, teamOppositeName } from '../logic/gameEngine';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

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
});
