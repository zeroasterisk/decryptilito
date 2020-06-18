import fromPairs from 'lodash.frompairs';
import sortBy from 'lodash.sortby';

import {
  // Contains,
  // IsDate,
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  Length,
  validateSync,
  ValidationError,
} from 'class-validator';

import {
  TeamColor,
  PendingGameStatus,
  PendingGameTeamAllocation,
} from './enums';

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
  blackTeam?: PendingGameUser[];
  whiteTeam?: PendingGameUser[];
  freeAgents?: PendingGameUser[];
  allocation?: PendingGameTeamAllocation;
}

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
  public blackTeam: PendingGameUser[];
  public whiteTeam: PendingGameUser[];
  public freeAgents: PendingGameUser[];
  // uids of participants
  public uids: string[];
  // show error
  public errors: ValidationError[];
  public debug: boolean;

  constructor(data: PendingGameDataInput) {
    this.id = data.id || this.makeId(15);
    this.shortCode = data.shortCode || this.makeId(5);
    this.status = data.status || PendingGameStatus.ENTRY;
    this.allocation =
      data.allocation || PendingGameTeamAllocation.PICK_OR_RANDOM;
    this.whiteTeam = data.whiteTeam || [];
    this.blackTeam = data.blackTeam || [];
    this.freeAgents = data.freeAgents || [];
    this.uids = data.uids || [];
    this.errors = [];
    this.debug = false;
  }

  public makeId(length: number) {
    return (
      '' +
      Math.random().toString(16).slice(2) +
      Math.random().toString(16).slice(2)
    ).substring(0, length);
  }

  public validate() {
    this.errors = validateSync(this, { validationError: { target: false } });
    // if (this.errors.length > 0) {
    //   // TODO switch to better logging
    //   console.error(this.errors);
    // }
    return this.errors.length === 0;
  }
}

// Firestore data converter
// https://firebase.google.com/docs/firestore/manage-data/add-data
type fnToFirestoreUserList = (list: PendingGameUser[]) => PendingGameUser[];
const toFirestoreUserList: fnToFirestoreUserList = (list: PendingGameUser[]) =>
  sortBy(
    list.map(({ id, name }: PendingGameUser) => ({ id, name })),
    ['name'],
  );
export const pendingGameDataConverter = {
  toFirestore: (data: PendingGameData) => {
    console.log('toFirestore trigger...', {
      id: data.id,
      shortCode: data.shortCode,
      status: data.status,
      allocation: data.allocation,
      whiteTeam: toFirestoreUserList(data.whiteTeam),
      blackTeam: toFirestoreUserList(data.blackTeam),
      freeAgents: toFirestoreUserList(data.freeAgents),
      uids: data.uids.sort(),
    });
    return {
      id: data.id,
      shortCode: data.shortCode,
      status: data.status,
      allocation: data.allocation,
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
export type fnAddUserToTeam = (
  team: string,
  user: firebase.User,
  data: PendingGameData,
) => PendingGameData;
export const addUserToTeam: fnAddUserToTeam = (
  team: string,
  user: firebase.User,
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
