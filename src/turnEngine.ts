import {
  GameData,
  TeamKey,
  TeamMember,
  TurnData,
  TurnStatus,
} from './gameData';
// import { UserData } from './userData';

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
    return missingTeamMembers.pop();
  }
  // finally, return the least found name
  const encryptorId = Object.keys(turnMemberIdFreqCount)
    .sort((a: string, b: string) => {
      return turnMemberIdFreqCount[a] - turnMemberIdFreqCount[b];
    })
    .shift();
  return teamMembers
    .filter((member: TeamMember) => member.id === encryptorId)
    .pop();
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

export {
  createNextTurn,
  getTurnData,
  getRandomOrder,
  getNextEncryptor,
  scoreTurn,
};
