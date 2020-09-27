import {
  IsEnum,
  IsInt,
  Min,
  Max,
  // validateSync,
  ValidationError,
} from 'class-validator';

import { TurnStatus } from './enums';

import { TeamMember } from './teamData';

export interface TurnTeamData {
  encryptor: TeamMember;
  correctOrder: number[];
  correctOrderHidden?: boolean; // only matter while encrypting
  clues: string[];
  cluesSubmitted?: boolean;
  guessedOrderOpponent: number[];
  guessedOrderOpponentSubmitted?: boolean;
  guessedOrderSelf: number[];
  guessedOrderSelfSubmitted?: boolean;
  interception?: boolean;
  miscommunication?: boolean;
}
export interface TurnDataInput {
  id: number;
  status: TurnStatus;
  timeoutSecondsRemaining: number;
  whiteTeam: TurnTeamData;
  blackTeam: TurnTeamData;
}

export class TurnData {
  @IsInt()
  @Min(0)
  @Max(10)
  public id: number;
  @IsEnum(TurnStatus)
  public status: TurnStatus;
  @IsInt()
  @Min(0)
  @Max(60)
  public timeoutSecondsRemaining: number;
  public whiteTeam: TurnTeamData;
  public blackTeam: TurnTeamData;
  public errors: ValidationError[];
  constructor(data: TurnDataInput) {
    this.id = data.id || 0;
    this.status = data.status || TurnStatus.PREPARE;
    this.timeoutSecondsRemaining = data.timeoutSecondsRemaining || 0;
    this.whiteTeam = data.whiteTeam || {};
    this.blackTeam = data.blackTeam || {};
    this.errors = [];
  }
  // public validate() {
  //   this.errors = validateSync(this, { validationError: { target: false } });
  //   return this.errors.length === 0;
  // }
}
