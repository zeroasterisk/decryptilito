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

interface PendingGameUser {
  // public details about each team member
  id: string;
  name: string;
  preferedTeamColor: TeamColor;
  // TODO store more from firebase?
}

export interface PendingGameDataInput {
  id: string;
  shortCode: string;
  status: PendingGameStatus;
  uids: string[];
  users: PendingGameUser[];
  allocation: PendingGameTeamAllocation;
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
  @ArrayMinSize(2, { message: 'You need at least 2 players per team.' })
  @ArrayMaxSize(10, { message: 'With 10 players on a team, it is too crazy.' })
  public users: PendingGameUser[];
  // uids of participants
  public uids: string[];
  // show error
  public errors: ValidationError[];
  public debug: boolean;

  constructor(data: PendingGameDataInput) {
    this.id = data.id || this.makeId(15);
    this.shortCode = data.shortCode || this.makeId(5);
    this.status = data.status || PendingGameStatus.ENTRY;
    this.allocation = data.allocation || PendingGameTeamAllocation.RANDOM;
    this.users = data.users || [];
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
