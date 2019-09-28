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

import { TeamKey } from './gameData';

interface UserDataInput {
  id: string;
  name: string;
  myTeam: TeamKey;
  errors?: ValidationError[];
}

class UserData {
  // game id (for saving)
  @Length(10, 20)
  public id: string;
  public name: string;
  @IsEnum(TeamKey)
  public myTeam: TeamKey;
  public errors?: ValidationError[];

  constructor(data: UserDataInput) {
    this.id = data.id || this.makeId();
    this.name = data.name || 'Unnamed';
    this.myTeam = data.myTeam;
    this.errors = [];
  }

  public makeId() {
    return (
      '' +
      Math.random()
        .toString(16)
        .slice(2) +
      Math.random()
        .toString(16)
        .slice(2)
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
