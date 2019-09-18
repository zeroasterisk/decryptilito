import {
  // Contains,
  // IsDate,
  IsEnum,
  IsInt,
  Length,
  Max,
  Min,
  validateSync,
  ValidationError,
} from 'class-validator';

// https://github.com/typestack/class-validator

// export as namespace GameData;

enum TeamKey {
  blackTeam = 'blackTeam',
  whiteTeam = 'whiteTeam',
}
enum TeamColor {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
}
enum GameStatus {
  ENTRY = 'ENTRY',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
}
// active_turn_phase: "prepare", // prepare, encrypt, guess_order_white_team, guess_order_black_team

// this should cover all phases of a single turn (including pauses)
// NOTE: turn is global, so each combination must be accounted for
enum TurnStatus {
  // get the encryptor setup
  PREPARE = 'PREPARE',
  // encryptor is putting in clues
  ENCRYPT = 'ENCRYPT',
  ENCRYPT_PARTIAL = 'ENCRYPT_PARTIAL',
  // decryptors are guessing at order (one team at a time)
  DECRYPT_WHITE_CLUES = 'DECRYPT_WHITE_CLUES',
  DECRYPT_WHITE_CLUES_PARTIAL = 'DECRYPT_WHITE_CLUES_PARTIAL',
  SCORING_WHITE = 'SCORING_WHITE',
  DECRYPT_BLACK_CLUES = 'DECRYPT_BLACK_CLUES',
  DECRYPT_BLACK_CLUES_PARTIAL = 'DECRYPT_BLACK_CLUES_PARTIAL',
  SCORING_BLACK = 'SCORING_BLACK',
  // done
  DONE = 'DONE',
}

// declare interface GameUi {
//     // which team UI am I showing?
//     public team: TeamColor;
// }

export interface TeamMember {
  // public details about each team member
  name: string;
  id: string;
  // TODO store more from firebase?
}

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

class TurnData {
  @IsInt()
  @Min(0)
  @Max(10)
  public id: number;
  public status: TurnStatus;
  public timeoutSecondsRemaining: number;
  public whiteTeam: TurnTeamData;
  public blackTeam: TurnTeamData;
  constructor(data: TurnDataInput) {
    this.id = data.id || 0;
    this.status = data.status || TurnStatus.PREPARE;
    this.timeoutSecondsRemaining = data.timeoutSecondsRemaining || 0;
    this.whiteTeam = data.whiteTeam || {};
    this.blackTeam = data.blackTeam || {};
  }
}

interface TeamData {
  // team data storage block
  teamColor: TeamColor;
  teamName: string;
  // TODO, omit in favor of CSV stringify from teamMembers
  teamMemberNames: string;

  teamMembers: TeamMember[];
  words: string[]; // should be exactly 4
}

const factoryTeamData = (team: TeamColor) => {
  return {
    team,
    teamName: '',
    teamMembers: [],
    words: [],
    turns: [],
  };
};

interface GameDataInput {
  id: string;
  status: GameStatus;
  // which turn number: 0-10
  activeTurnNumber: number;
  turns: TurnData[];
  // team data for each team
  whiteTeam: TeamData;
  blackTeam: TeamData;
}

class GameData {
  // game id (for saving)
  @Length(10, 20)
  public id: string;
  @IsEnum(GameStatus)
  public status: GameStatus;
  // which turn number: 0-10
  @IsInt()
  @Min(0)
  @Max(10)
  public activeTurnNumber: number;
  public turns: TurnData[];
  // team data for each team
  public whiteTeam: TeamData;
  public blackTeam: TeamData;
  public errors: ValidationError[];
  public debug: boolean;

  constructor(data: GameDataInput) {
    this.id = data.id || this.makeId();
    this.status = data.status || 'ENTRY';
    this.activeTurnNumber = data.activeTurnNumber || 0;
    this.turns = (data.turns && data.turns.map(x => new TurnData(x))) || [];
    this.whiteTeam = data.whiteTeam || factoryTeamData(TeamColor.WHITE);
    this.blackTeam = data.blackTeam || factoryTeamData(TeamColor.BLACK);
    this.errors = [];
    this.debug = false;
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
      // TODO switch to better logging
      console.error(this.errors);
    }
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

export {
  GameData,
  TurnData,
  // enums
  TeamKey,
  TeamColor,
  TurnStatus,
  GameStatus,
};
