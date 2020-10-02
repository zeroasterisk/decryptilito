// import sortBy from 'lodash.sortby';
import { classToPlain } from 'class-transformer';
import {
  // Contains,
  // IsDate,
  IsEnum,
  IsInt,
  Length,
  Max,
  Min,
  // MinLength,
  // MaxLength,
  // ArrayMinSize,
  // ArrayMaxSize,
  ValidateNested,
  validateSync,
  ValidationError,
} from 'class-validator';

// https://github.com/typestack/class-validator

import { GameStatus, TeamColor } from './enums';

import { TeamData } from './teamData';

import { TurnData } from './turnData';

import { updateGame } from '../firebase';

import { tick } from './gameEngine';

export interface GameDataInput {
  id?: string;
  shortCode?: string;
  status?: GameStatus;
  // participants
  uids?: string[];
  // which turn number: 0-10
  activeTurnNumber?: number;
  turns?: TurnData[];
  // team data for each team
  whiteTeam?: TeamData;
  blackTeam?: TeamData;
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
    this.status = data.status || GameStatus.ENTRY;
    this.uids = data.uids || [];
    this.activeTurnNumber = data.activeTurnNumber || 0;
    this.turns = (data.turns && data.turns.map((x) => new TurnData(x))) || [];
    // this.whiteTeam = new TeamData(classToPlain(data.whiteTeam)) || factoryTeamData(TeamColor.WHITE);
    // this.blackTeam = new TeamData(classToPlain(data.blackTeam)) || factoryTeamData(TeamColor.BLACK);
    this.whiteTeam =
      (data.whiteTeam && new TeamData(data.whiteTeam)) ||
      new TeamData({
        teamColor: TeamColor.WHITE,
      });
    this.blackTeam =
      (data.blackTeam && new TeamData(data.blackTeam)) ||
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

  // updates the record in firebase to match "this" insteance of the game
  public update() {
    return updateGame(this);
  }

  // tick, check the game to see if there should be any changes
  // progresses the game through turns and scoring
  // updates the game if needed
  public tick(saveAfterChange: boolean = true) {
    return tick(this, saveAfterChange);
  }
}

// type toFirestoreTurnsType = (list: TurnData[]) => TurnData[];
// const toFirestoreTurns: toFirestoreTurnsType = (list: TurnData[]) =>
//   sortBy(
//     list.map((turn: TurnData) => classToPlain(turn)),
//     ['id'],
//   );

// Firestore data converter
// https://firebase.google.com/docs/firestore/manage-data/add-data
export const gameDataConverter = {
  toFirestore: (data: GameData) => {
    return {
      id: data.id,
      shortCode: data.shortCode,
      status: data.status,
      activeTurnNumber: data.activeTurnNumber,
      uids: data.uids.sort(),
      turns: classToPlain(data.turns),
      whiteTeam: classToPlain(data.whiteTeam),
      blackTeam: classToPlain(data.blackTeam),
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    data.id = snapshot.id;
    return new GameData(data);
  },
};
