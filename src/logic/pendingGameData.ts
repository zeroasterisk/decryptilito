import sortBy from 'lodash.sortby';

import {
  // Contains,
  // IsDate,
  // ArrayMaxSize,
  // ArrayMinSize,
  IsEnum,
  Length,
  validateSync,
  ValidationError,
} from 'class-validator';

import firebase, { updatePendingGame } from '../firebase';

import {
  TeamColor,
  GameStatus,
  PendingGameStatus,
  PendingGameTeamAllocation,
} from './enums';

import { GameDataInput } from './gameData';
import { UserData } from './userData';

export interface PendingGameUser {
  // public details about each team member
  id: string;
  name: string;
  // TODO store more from firebase?
}

export interface PendingGameDataInput {
  id?: string;
  shortCode?: string;
  status?: PendingGameStatus;
  uids?: string[];
  blackTeamName?: string;
  whiteTeamName?: string;
  blackTeam?: PendingGameUser[];
  whiteTeam?: PendingGameUser[];
  freeAgents?: PendingGameUser[];
  allocation?: PendingGameTeamAllocation;
}

const makeId = (length: number) =>
  (
    '' +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2) +
    Math.random().toString(16).slice(2)
  ).substring(0, length);

export class PendingGameData {
  // game id (for saving)
  @Length(10, 20)
  public id: string;
  @Length(4, 8)
  public shortCode: string;
  @IsEnum(PendingGameStatus)
  public status: PendingGameStatus;
  @IsEnum(PendingGameTeamAllocation)
  public allocation: PendingGameTeamAllocation;
  public blackTeamName: string;
  public whiteTeamName: string;
  public blackTeam: PendingGameUser[];
  public whiteTeam: PendingGameUser[];
  public freeAgents: PendingGameUser[];
  // uids of participants
  public uids: string[];
  // show error
  public errors: ValidationError[];
  public debug: boolean;

  constructor(data: PendingGameDataInput) {
    this.id = data.id || makeId(15);
    this.shortCode = data.shortCode || makeId(5);
    this.status = data.status || PendingGameStatus.ENTRY;
    this.allocation =
      data.allocation || PendingGameTeamAllocation.PICK_OR_RANDOM;
    this.whiteTeamName = data.whiteTeamName || '';
    this.blackTeamName = data.blackTeamName || '';
    this.whiteTeam = data.whiteTeam || [];
    this.blackTeam = data.blackTeam || [];
    this.freeAgents = data.freeAgents || [];
    this.uids = data.uids || [];
    this.errors = [];
    this.debug = false;
  }

  public validate() {
    this.errors = validateSync(this, { validationError: { target: false } });
    // if (this.errors.length > 0) {
    //   // TODO switch to better logging
    //   console.error(this.errors);
    // }
    return this.errors.length === 0;
  }
  public update() {
    return updatePendingGame(this);
  }
}

type toFirestoreUserListType = (list: PendingGameUser[]) => PendingGameUser[];
const toFirestoreUserList: toFirestoreUserListType = (
  list: PendingGameUser[],
) =>
  sortBy(
    list.map(({ id, name }: PendingGameUser) => ({ id, name })),
    ['name'],
  );

// Firestore data converter
// https://firebase.google.com/docs/firestore/manage-data/add-data
export const pendingGameDataConverter = {
  toFirestore: (data: PendingGameData) => {
    return {
      id: data.id,
      shortCode: data.shortCode,
      status: data.status,
      allocation: data.allocation,
      whiteTeamName: data.whiteTeamName,
      blackTeamName: data.blackTeamName,
      whiteTeam: toFirestoreUserList(data.whiteTeam),
      blackTeam: toFirestoreUserList(data.blackTeam),
      freeAgents: toFirestoreUserList(data.freeAgents),
      uids: data.uids.sort(),
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    data.id = snapshot.id;
    return new PendingGameData(data);
  },
};

// add a user to the PendingGame
export type addUserToTeamType = (
  team: string,
  user: UserData,
  data: PendingGameData,
) => PendingGameData;
export const addUserToTeam: addUserToTeamType = (
  team: string,
  user: UserData,
  data: PendingGameData,
) => {
  const withoutUser = ({ id }: { id: string }) => id !== user.uid;
  data.whiteTeam = data.whiteTeam.filter(withoutUser);
  data.blackTeam = data.blackTeam.filter(withoutUser);
  data.freeAgents = data.freeAgents.filter(withoutUser);
  if (data.uids.indexOf(user.uid) === -1) {
    data.uids.push(user.uid);
  }
  const newUser = {
    id: user.uid,
    name: user.displayName || `secret agent ${user.uid}`,
  };
  if (team === 'whiteTeam') {
    data.whiteTeam.push(newUser);
  } else if (team === 'blackTeam') {
    data.blackTeam.push(newUser);
  } else {
    data.freeAgents.push(newUser);
  }
  return data;
};

// what is the reason a game is not ready to launch (or it is READY)
export type whatElseIsNeededToLaunchType = (data: PendingGameData) => string;
export const whatElseIsNeededToLaunch: whatElseIsNeededToLaunchType = (
  data: PendingGameData,
) => {
  const validUser = ({ id }: { id: string }) => id && id.length > 1;
  const whiteTeam = data.whiteTeam.filter(validUser).length;
  const blackTeam = data.blackTeam.filter(validUser).length;
  const freeAgents = data.freeAgents.filter(validUser).length;
  if (whiteTeam + blackTeam + freeAgents < 4) {
    return 'You have less than 4 agents.  Find more players.';
  }
  if (whiteTeam > blackTeam + freeAgents + 1) {
    return 'The white team has too many agents.';
  }
  if (blackTeam > whiteTeam + freeAgents + 1) {
    return 'The black team has too many agents.';
  }
  return 'READY';
};

// convert a pending game into a real game
// relying on you to have done: data.status = PendingGameStatus.LAUNCHING;
// relying on a subsequent function to create the words and setup the 1st turn
export type buildGameType = (data: PendingGameData) => GameDataInput;
export const buildGame: buildGameType = (data: PendingGameData) => {
  const validUser = ({ id }: { id: string }) => id && id.length > 1;
  const whiteTeam = data.whiteTeam.filter(validUser);
  const blackTeam = data.blackTeam.filter(validUser);
  const freeAgents = data.freeAgents.filter(validUser);
  while (freeAgents.length > 0) {
    const agent = freeAgents.pop();
    if (agent) {
      if (whiteTeam.length < blackTeam.length) {
        whiteTeam.push(agent);
      } else {
        blackTeam.push(agent);
      }
    }
  }
  const gameData = {
    id: data.id, // must match the pendingGame.id
    shortCode: data.shortCode,
    status: GameStatus.ENTRY,
    uids: data.uids,
    activeTurnNumber: 0,
    turns: [],
    // team data
    whiteTeam: {
      uids: whiteTeam.map(({ id }) => id),
      teamColor: TeamColor.WHITE,
      teamName: data.whiteTeamName,
      teamMemberNames: whiteTeam.map(({ name }) => name).join(', '),
      teamMembers: whiteTeam,
      words: [],
    },
    blackTeam: {
      uids: blackTeam.map(({ id }) => id),
      teamColor: TeamColor.BLACK,
      teamName: data.blackTeamName,
      teamMemberNames: blackTeam.map(({ name }) => name).join(', '),
      teamMembers: blackTeam,
      words: [],
    },
  };
  return gameData;
};
