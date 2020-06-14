/**
 * My Data is the user-specific data object
 * This is not a part of the game data
 * But instead it is composed of the logged in user
 */
import {
  // Contains,
  // IsDate,
  IsEnum,
  Length,
  validateSync,
  ValidationError,
} from 'class-validator';

import { TeamKey } from './enums';

interface UserDataInput {
  // from firebase
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  // TODO change to current team / current game
  myTeam?: TeamKey;
  errors?: ValidationError[];
}

class UserData {
  // game id (for saving)
  @Length(10, 20)
  public uid: string;
  public displayName: string;
  public photoURL?: string;
  public email?: string;
  // TODO should this be on the game?
  @IsEnum(TeamKey)
  public myTeam: TeamKey;
  public errors?: ValidationError[];

  constructor(data: UserDataInput) {
    this.uid = data.uid || this.makeId();
    this.displayName = data.displayName || 'Unnamed';
    this.photoURL = data.photoURL;
    this.email = data.email;
    this.myTeam = data.myTeam || this.assignTeam();
    this.errors = [];
  }

  public assignTeam() {
    if (Math.random() % 1) {
      return TeamKey.blackTeam;
    } else {
      return TeamKey.whiteTeam;
    }
  }

  public makeId() {
    return (
      'rnd' +
      Math.random().toString(16).slice(2) +
      Math.random().toString(16).slice(2)
    ).substring(0, 15);
  }

  public validate() {
    this.errors = validateSync(this, { validationError: { target: false } });
    if (this.errors.length > 0) {
      console.error(this.errors);
    }
    return this.errors.length === 0;
  }

  // public myMethod(opts: UserData.MyClassMethodOptions): number;
}

export { UserData };
