import { expect } from 'chai';

import {
  PendingGameData,
  pendingGameDataConverter,
  addUserToTeam,
  whatElseIsNeededToLaunch,
  buildGame,
} from '../logic/pendingGameData';

import mockPendingGameData from '../mock/mockPendingGameData';

describe('PendingGameData utilities', () => {
  const agent = { id: 'mockagent', name: 'mock agent' };
  // mock firebase user
  const user = { uid: 'pretenduid', displayName: 'pretend name' };
  describe('pendingGameDataConverter', () => {
    it('it should convert mockPendingGameData without mutation', () => {
      const data = new PendingGameData(mockPendingGameData);
      const out = pendingGameDataConverter.fromFirestore(
        // mock snapshot from firestore
        {
          data: () => pendingGameDataConverter.toFirestore(data),
          id: data.id,
        },
        // mock options from firestore
        {},
      );
      expect(out).to.deep.equal(data);
    });
  });
  describe('addUserToTeam', () => {
    it('updates pending game data with a new user added to the white team', () => {
      const data = new PendingGameData(mockPendingGameData);
      expect(data.whiteTeam.length).to.equal(2);
      const out = addUserToTeam('whiteTeam', user, data);
      expect(out.whiteTeam.length).to.equal(3);
      const last = out.whiteTeam[out.whiteTeam.length - 1];
      expect(last.id).to.equal('pretenduid');
      expect(last.name).to.equal('pretend name');
    });
    it('updates pending game data with a new user added to the black team', () => {
      const data = new PendingGameData(mockPendingGameData);
      expect(data.blackTeam.length).to.equal(2);
      const out = addUserToTeam('blackTeam', user, data);
      expect(out.blackTeam.length).to.equal(3);
      const last = out.blackTeam[out.blackTeam.length - 1];
      expect(last.id).to.equal('pretenduid');
      expect(last.name).to.equal('pretend name');
    });
    it('updates pending game data with an existing user added to a team (1 copy)', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.blackTeam = [agent, { id: 'pretenduid', name: 'whatever' }];
      expect(data.whiteTeam.length).to.equal(2);
      const out = addUserToTeam('whiteTeam', user, data);
      expect(out.whiteTeam.length).to.equal(3);
      const last = out.whiteTeam[out.whiteTeam.length - 1];
      expect(last.id).to.equal('pretenduid');
      // verify that the name was pulled from the user's displayName
      expect(last.name).to.equal('pretend name');
      // verify that it was removed from the black team as well as added to the white
      expect(out.blackTeam.length).to.equal(1);
      expect(out.blackTeam.map(({ id }) => id)).to.deep.equal(['mockagent']);
    });
  });
  describe('whatElseIsNeededToLaunch', () => {
    it('returns READY for unaltered mockPendingGameData', () => {
      expect(whatElseIsNeededToLaunch(mockPendingGameData)).to.equal('READY');
    });
    it('returns error when no agents', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [];
      data.whiteTeam = [];
      data.blackTeam = [];
      expect(whatElseIsNeededToLaunch(data)).to.equal(
        'You have less than 4 agents.  Find more players.',
      );
    });
    it('returns error when only 3 agents total', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [agent];
      data.whiteTeam = [agent];
      data.blackTeam = [agent];
      expect(whatElseIsNeededToLaunch(data)).to.equal(
        'You have less than 4 agents.  Find more players.',
      );
    });
    it('returns error when all 4 agents are on white', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [];
      data.whiteTeam = [agent, agent, agent, agent];
      data.blackTeam = [];
      expect(whatElseIsNeededToLaunch(data)).to.equal(
        'The white team has too many agents.',
      );
    });
    it('returns error when all 4 agents are on black', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [];
      data.whiteTeam = [];
      data.blackTeam = [agent, agent, agent, agent];
      expect(whatElseIsNeededToLaunch(data)).to.equal(
        'The black team has too many agents.',
      );
    });
    it('returns error when 3/4 agents are on black', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [];
      data.whiteTeam = [agent];
      data.blackTeam = [agent, agent, agent];
      expect(whatElseIsNeededToLaunch(data)).to.equal(
        'The black team has too many agents.',
      );
    });
    it('returns error when 5/8 agents are on black', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [];
      data.whiteTeam = [agent, agent, agent];
      data.blackTeam = [agent, agent, agent, agent, agent];
      expect(whatElseIsNeededToLaunch(data)).to.equal(
        'The black team has too many agents.',
      );
    });
    it('returns READY if 4/7 agents are on black', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [];
      data.whiteTeam = [agent, agent, agent];
      data.blackTeam = [agent, agent, agent, agent];
      expect(whatElseIsNeededToLaunch(data)).to.equal('READY');
    });
    it('returns READY if 4/7 agents are on black and the rest are free-agents', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [agent, agent, agent];
      data.whiteTeam = [];
      data.blackTeam = [agent, agent, agent, agent];
      expect(whatElseIsNeededToLaunch(data)).to.equal('READY');
    });
  });
  describe('buildGame', () => {
    it('will create most of the data needed to start a game, allocating all free agents to white team in an effort to balance', () => {
      const data = new PendingGameData(mockPendingGameData);
      data.freeAgents = [agent, agent, agent];
      data.whiteTeam = [];
      data.blackTeam = [agent, agent, agent, agent];
      const out = buildGame(data);
      expect(out.id).to.equal(data.id);
      expect(out.shortCode).to.equal(data.shortCode);
      expect(out.uids).to.deep.equal(data.uids);
      expect(out.whiteTeam.uids.length).to.equal(3);
      expect(out.blackTeam.uids.length).to.equal(4);
      expect(out.whiteTeam.teamMembers.length).to.equal(3);
      expect(out.blackTeam.teamMembers.length).to.equal(4);
      expect(out.whiteTeam.teamName).to.equal(data.whiteTeamName);
      expect(out.blackTeam.teamName).to.equal(data.blackTeamName);
    });
  });
});
