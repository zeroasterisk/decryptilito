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
  // encryptor is done putting in clues, waiting on the other team
  WHITE_ENCRYPTED_WAITING_ON_BLACK = 'WHITE_ENCRYPTED_WAITING_ON_BLACK',
  BLACK_ENCRYPTED_WAITING_ON_WHITE = 'BLACK_ENCRYPTED_WAITING_ON_WHITE',
  // white reads out clues, black team guesses
  BLACK_DECRYPT_WHITE_CLUES = 'BLACK_DECRYPT_WHITE_CLUES',
  // white reads out clues, white team guesses
  WHITE_DECRYPT_WHITE_CLUES = 'WHITE_DECRYPT_WHITE_CLUES',
  // black reads out clues, white team guesses
  WHITE_DECRYPT_BLACK_CLUES = 'WHITE_DECRYPT_BLACK_CLUES',
  // black reads out clues, black team guesses
  BLACK_DECRYPT_BLACK_CLUES = 'BLACK_DECRYPT_BLACK_CLUES',
  // done
  DONE = 'DONE',
}

// declare interface GameUi {
//     // which team UI am I showing?
//     public team: TeamColor;
// }

interface TeamMember {
  // public details about each team member
  name: string;
  id: string;
  // TODO store more from firebase?
}

interface TurnTeamData {
  encryptor: TeamMember;
  correctOrder: number[];
  clues: string[];
  guessedOrderOpponent: number[];
  guessedOrderSelf: number[];
  interception: boolean;
  miscommunication: boolean;
}
interface TurnDataInput {
  id: number;
  status: TurnStatus;
  whiteTeam: TurnTeamData;
  blackTeam: TurnTeamData;
}
class TurnData {
  @IsInt()
  @Min(0)
  @Max(10)
  public id: number;
  public status: TurnStatus;
  public whiteTeam: TurnTeamData;
  public blackTeam: TurnTeamData;
  constructor(data: TurnDataInput) {
    this.id = data.id || 0;
    this.status = data.status || TurnStatus.PREPARE;
    this.whiteTeam = data.whiteTeam || {};
    this.blackTeam = data.blackTeam || {};
  }
}

interface TeamData {
  // team data storage block
  team: TeamColor;
  teamName: string;
  // TODO, omit in favor of CSV stringify from teamMembers
  teamMemberNames: string;

  teamMembers: TeamMember[];
  words: string[]; // should be exactly 4
  turns: TurnData[];
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

  constructor(data: GameDataInput) {
    this.id = data.id || this.makeId();
    this.status = data.status || 'ENTRY';
    this.activeTurnNumber = data.activeTurnNumber || 0;
    this.turns = (data.turns && data.turns.map(x => new TurnData(x))) || [];
    this.whiteTeam = data.whiteTeam || factoryTeamData(TeamColor.WHITE);
    this.blackTeam = data.blackTeam || factoryTeamData(TeamColor.BLACK);
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
  TurnTeamData,
  TeamMember,
  // enums
  TeamKey,
  TeamColor,
  TurnStatus,
  GameStatus,
};
