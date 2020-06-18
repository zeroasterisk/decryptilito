export enum TeamKey {
  blackTeam = 'blackTeam',
  whiteTeam = 'whiteTeam',
}
export enum TeamColor {
  BLACK = 'BLACK',
  WHITE = 'WHITE',
}
export enum GameStatus {
  ENTRY = 'ENTRY',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
}
// active_turn_phase: "prepare", // prepare, encrypt, guess_order_white_team, guess_order_black_team

// this should cover all phases of a single turn (including pauses)
// NOTE: turn is global, so each combination must be accounted for
export enum TurnStatus {
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

export enum PendingGameStatus {
  ENTRY = 'ENTRY',
  READY = 'READY',
  LAUNCHING = 'LAUNCHING',
  EXPIRED = 'EXPIRED',
}

export enum PendingGameTeamAllocation {
  PICK_OR_RANDOM = 'Pick if you wish, Random Balance from Free Agents',
  FORCED_PICK = 'Players Must Pick Teams',
  FORCED_RANDOM = 'Forced Random',
}

export enum NextGameTeamAllocation {
  RANDOM = 'Random',
  PICK = 'Each Player Picks',
  CHANGETEAMS = 'Random (avoid repeat teams)',
  SAMETEAMS = 'Keep same teams (if possible, otherwise random balance)',
}
