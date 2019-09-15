import {
  GameData,
  TeamKey,
  TeamMember,
  TurnData,
  TurnStatus,
} from './gameData';
import { UserData } from './userData';

const teamName = (name: TeamKey) => {
  if (name === TeamKey.whiteTeam) return 'White Team';
  if (name === TeamKey.blackTeam) return 'Black Team';
  return '???? Team';
};
const teamOpposite = (name: TeamKey) =>
  name === TeamKey.whiteTeam ? TeamKey.blackTeam : TeamKey.whiteTeam;
const teamOppositeName = (name: TeamKey) => teamName(teamOpposite(name));

const getTeamData = ({ game, user }: { game: GameData; user: UserData }) => {
  const { myTeam } = user;
  return game[myTeam];
};
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
  // return default turn
  return {
    id: turnNumber,
    status: TurnStatus.DONE,
    whiteTeam: {
      encryptor: getNextEncryptor(TeamKey.whiteTeam, game),
      clues: ['', '', ''],
      correctOrder: getRandomOrder(),
      guessedOrderSelf: [],
      guessedOrderOpponent: [],
    },
    blackTeam: {
      encryptor: getNextEncryptor(TeamKey.blackTeam, game),
      clues: ['', '', ''],
      correctOrder: getRandomOrder(),
      guessedOrderSelf: [],
      guessedOrderOpponent: [],
    },
  };
};

/*
const createNextTurn = (props: GameData) => {
  const { turns } = props;
  const turn = {
    id: turns.length + 1,
    status: TurnStatus.PREPARE,
    whiteTeam: {
      encryptor: {},
      correctOrder: getRandomOrder(),
      clues: ['', '', ''],
      guessedOrderOpponent: [],
      guessedOrderSelf: [],
      interception: false,
      miscommunication: false,
    },
    blackTeam: {
      encryptor: {},
      correctOrder: getRandomOrder(),
      clues: ['', '', ''],
      guessedOrderOpponent: [],
      guessedOrderSelf: [],
      interception: false,
      miscommunication: false,
    },
  };
};
*/

const getRandomOrder = () => {
  const order = [];
  while (order.length < 3) {
    const index = Math.floor(Math.random() * 4);
    if (index >= 1 && !order.includes(index)) {
      order.push(index);
    }
  }
  return order;
};

// TODO make this more rhobust
const getNextEncryptor = (myTeam: TeamKey, game: GameData) => {
  const { turns } = game;
  if (!(myTeam && game[myTeam])) throw Error(`Invalid team data [${myTeam}]`);
  const teamMembers = game[myTeam].teamMembers;
  // { encryptorId: countTurns }
  const turnMemberIdFreqCount = turns.reduce((acc: object, turn: TurnData) => {
    const encryptorIdTemp = turn[myTeam].encryptor.id;
    if (acc[encryptorIdTemp]) {
      acc[encryptorIdTemp] = 1;
    } else {
      acc[encryptorIdTemp] += 1;
    }
    return acc;
  }, {});
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
    .sort((a, b) => {
      return turnMemberIdFreqCount[a] - turnMemberIdFreqCount[b];
    })
    .shift();
  return teamMembers
    .filter((member: TeamMember) => member.id === encryptorId)
    .pop();
};

export {
  teamName,
  teamOpposite,
  teamOppositeName,
  getTeamData,
  getTurnData,
  getRandomOrder,
  getNextEncryptor,
};
