import { classToPlain } from 'class-transformer';
import {
  // Contains,
  // IsDate,
  IsEnum,
  IsInt,
  Length,
  Max,
  Min,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  validateSync,
  ValidationError,
} from 'class-validator';

// https://github.com/typestack/class-validator

import { GameStatus, TeamColor } from './enums';

import { TeamData } from './teamData';

import { TurnData } from './turnData';

interface GameDataInput {
  id: string;
  shortCode: string;
  status: GameStatus;
  // participants
  uids: string[];
  // which turn number: 0-10
  activeTurnNumber: number;
  turns: TurnData[];
  // team data for each team
  whiteTeam: TeamData;
  blackTeam: TeamData;
}

export class GameData {
  // game id (for saving)
  @Length(10, 20)
  public id: string;
  @Length(4, 8)
  public shortCode: string;
  @IsEnum(GameStatus)
  public status: GameStatus;
  // participants
  public uids: string[];
  // which turn number: 0-10
  @IsInt()
  @Min(0)
  @Max(10)
  public activeTurnNumber: number;
  @ValidateNested({ each: true })
  public turns: TurnData[];
  // team data for each team
  @ValidateNested()
  public whiteTeam: TeamData;
  @ValidateNested()
  public blackTeam: TeamData;
  // show error
  public errors: ValidationError[];
  public debug: boolean;

  constructor(data: GameDataInput) {
    this.id = data.id || this.makeId(15);
    this.shortCode = data.shortCode || this.makeId(5);
    this.status = data.status || 'ENTRY';
    this.uids = data.uids || [];
    this.activeTurnNumber = data.activeTurnNumber || 0;
    this.turns = (data.turns && data.turns.map((x) => new TurnData(x))) || [];
    // this.whiteTeam = new TeamData(classToPlain(data.whiteTeam)) || factoryTeamData(TeamColor.WHITE);
    // this.blackTeam = new TeamData(classToPlain(data.blackTeam)) || factoryTeamData(TeamColor.BLACK);
    this.whiteTeam =
      new TeamData(data.whiteTeam) ||
      new TeamData({
        teamColor: TeamColor.WHITE,
      });
    this.blackTeam =
      new TeamData(data.blackTeam) ||
      new TeamData({
        teamColor: TeamColor.BLACK,
      });

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

  // public myMethod(opts: GameData.MyClassMethodOptions): number;
}
// declare namespace GameData {
//     export interface MyClassMethodOptions {
//         width?: number;
//         height?: number;
//     }
// }
