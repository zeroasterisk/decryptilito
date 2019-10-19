import {
  GameData,
  TeamKey,
  TeamMember,
  TurnData,
  TurnStatus,
} from './gameData';
// import { UserData } from './userData';

import { teamOpposite } from './gameEngine';

const getTurnData = (game: GameData, turnNumber: number) => {
  const { turns } = game;
  if (!(turns && turns.length)) {
    // TODO switch to better logging
    console.error('Unable to get Turns from Game', game);
    throw new Error('Unable to get Turn data from Game');
  }
  if (turns.length >= turnNumber - 1) {
    return turns[turnNumber - 1];
  }
  // TODO switch to better logging
  console.error('Invalid Game Turn Number', game);
  throw new Error('Invalid Game Turn Number');
  // return createNextTurn() ... ?
};

const createNextTurn = (game: GameData) => {
  const { turns } = game;
  const turn = {
    id: turns.length + 1,
    status: TurnStatus.PREPARE,
    timeoutSecondsRemaining: 0,
    whiteTeam: {
      encryptor: getNextEncryptor(TeamKey.whiteTeam, game),
      correctOrder: getRandomOrder(),
      clues: ['', '', ''],
      cluesSubmitted: false,
      guessedOrderSelf: [],
      guessedOrderSelfSubmitted: false,
      guessedOrderOpponent: [],
      guessedOrderOpponentSubmitted: false,
      interception: false,
      miscommunication: false,
    },
    blackTeam: {
      encryptor: getNextEncryptor(TeamKey.blackTeam, game),
      correctOrder: getRandomOrder(),
      clues: ['', '', ''],
      cluesSubmitted: false,
      guessedOrderSelf: [],
      guessedOrderSelfSubmitted: false,
      guessedOrderOpponent: [],
      guessedOrderOpponentSubmitted: false,
      interception: false,
      miscommunication: false,
    },
    errors: [],
  };
  return turn;
};

const getRandomOrder = () => {
  const order: number[] = [];
  while (order.length < 3) {
    const index = Math.floor(Math.random() * 4);
    if (index >= 1 && !order.includes(index)) {
      order.push(index);
    }
  }
  return order;
};

// TODO make this more rhobust
interface StringNumberMap {
  [s: string]: number;
}
const getNextEncryptor = (myTeam: TeamKey, game: GameData) => {
  const { turns } = game;
  if (!(myTeam && game[myTeam])) throw Error(`Invalid team data [${myTeam}]`);
  const teamMembers = game[myTeam].teamMembers;
  // { encryptorId: countTurns }
  const turnMemberIdFreqCount = turns.reduce(
    (acc: StringNumberMap, turn: TurnData) => {
      const encryptorIdTemp: string = turn[myTeam].encryptor.id;
      if (encryptorIdTemp in acc) {
        acc[encryptorIdTemp] += 1;
      } else {
        acc[encryptorIdTemp] = 1;
      }
      return acc;
    },
    {},
  );
  // first, if any name is not in turnMemberIdFreqCount, lets do that
  const missingTeamMembers = teamMembers.filter(
    (member: TeamMember) =>
      !Object.keys(turnMemberIdFreqCount).includes(member.id),
  );
  if (missingTeamMembers.length > 0) {
    return missingTeamMembers.shift();
  }
  // finally, return the least found name
  const encryptorId = Object.keys(turnMemberIdFreqCount)
    .sort((a: string, b: string) => {
      return turnMemberIdFreqCount[a] - turnMemberIdFreqCount[b];
    })
    .shift();
  return teamMembers
    .filter((member: TeamMember) => member.id === encryptorId)
    .shift();
};

const scoreTurn = (turn: TurnData) => {
  // interception if you guessed the opponent correct order
  turn.blackTeam.interception =
    turn.whiteTeam.correctOrder.join(',') ===
    turn.blackTeam.guessedOrderOpponent.join(',');
  turn.whiteTeam.interception =
    turn.blackTeam.correctOrder.join(',') ===
    turn.whiteTeam.guessedOrderOpponent.join(',');
  // miscommunication if you missed your own order
  turn.blackTeam.miscommunication =
    turn.blackTeam.correctOrder.join(',') !==
    turn.blackTeam.guessedOrderSelf.join(',');
  turn.whiteTeam.miscommunication =
    turn.whiteTeam.correctOrder.join(',') !==
    turn.whiteTeam.guessedOrderSelf.join(',');
  return turn;
};

const calculateTurnStatus = (turn: TurnData) => {
  // all submitted = DONE
  if (
    turn.whiteTeam.guessedOrderSelfSubmitted &&
    turn.whiteTeam.guessedOrderOpponentSubmitted &&
    turn.blackTeam.guessedOrderSelfSubmitted &&
    turn.blackTeam.guessedOrderOpponentSubmitted
  ) {
    return TurnStatus.DONE;
  }
  const enteredCluesBothTeams = [
    ...turn.whiteTeam.clues,
    ...turn.blackTeam.clues,
  ].filter(x => x.length > 0);
  const submittedClues = [
    turn.whiteTeam.cluesSubmitted,
    turn.blackTeam.cluesSubmitted,
  ].filter(x => x);
  // no clues, we are in PREPARE -- or ENcryptor have not yet started :/
  if (enteredCluesBothTeams.length === 0) {
    return TurnStatus.PREPARE;
  }
  // some clues entered, we are in ENCRYPT_PARTIAL
  if (enteredCluesBothTeams.length > 0 && submittedClues.length === 1) {
    return TurnStatus.ENCRYPT_PARTIAL;
  }
  if (enteredCluesBothTeams.length > 0 && submittedClues.length === 0) {
    return TurnStatus.ENCRYPT;
  }

  // whiteTeam decrypt
  const submittedGuessWhite = [
    turn.blackTeam.guessedOrderOpponentSubmitted,
    turn.whiteTeam.guessedOrderSelfSubmitted,
  ].filter(x => x);
  if (submittedGuessWhite.length === 0) {
    return TurnStatus.DECRYPT_WHITE_CLUES;
  }
  if (submittedGuessWhite.length === 1) {
    return TurnStatus.DECRYPT_WHITE_CLUES_PARTIAL;
  }
  if (
    submittedGuessWhite.length === 2 &&
    turn.status in
      [TurnStatus.DECRYPT_WHITE_CLUES, TurnStatus.DECRYPT_WHITE_CLUES_PARTIAL]
  ) {
    return TurnStatus.SCORING_WHITE;
  }

  // blackTeam decrypt
  const submittedGuessBlack = [
    turn.blackTeam.guessedOrderOpponentSubmitted,
    turn.blackTeam.guessedOrderSelfSubmitted,
  ].filter(x => x);
  if (submittedGuessBlack.length === 0) {
    return TurnStatus.DECRYPT_BLACK_CLUES;
  }
  if (submittedGuessBlack.length === 1) {
    return TurnStatus.DECRYPT_BLACK_CLUES_PARTIAL;
  }
  if (
    submittedGuessBlack.length === 2 &&
    turn.status in
      [TurnStatus.DECRYPT_BLACK_CLUES, TurnStatus.DECRYPT_BLACK_CLUES_PARTIAL]
  ) {
    return TurnStatus.SCORING_BLACK;
  }
  return 'NOPE';
};

// get clue details, re-organized into more human-useful form
// index = position
//   correctOrderIndex = correctOrder[index]
interface CluesDetails {
  index: number;
  position: number; // always index + 1
  clue: string | null;
  guessedOrderSelf: number | null;
  guessedOrderOpponent: number | null;
}
const getCluesDetails = (turn: TurnData, teamkey: TeamKey) => {
  // translate correctOrder into clues
  return [0, 1, 2, 3].map(index => {
    const position = index + 1;
    // is this position in correctOrder?
    const orderIndex = turn[teamkey].correctOrder.indexOf(position);
    const clue = orderIndex > -1 ? turn[teamkey].clues[orderIndex] : null;
    const guessedOrderSelf =
      orderIndex > -1 ? turn[teamkey].guessedOrderSelf[orderIndex] : null;
    const guessedOrderOpponent =
      orderIndex > -1
        ? turn[teamOpposite(teamkey)].guessedOrderOpponent[orderIndex]
        : null;

    const node = {
      index,
      position, // always index + 1
      clue,
      guessedOrderSelf,
      guessedOrderOpponent,
    };
    return node;
  });
};

export {
  calculateTurnStatus,
  createNextTurn,
  getTurnData,
  getRandomOrder,
  getNextEncryptor,
  scoreTurn,
  getCluesDetails,
};
