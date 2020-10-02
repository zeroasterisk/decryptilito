import { TeamColor, TeamKey } from './enums';
import { GameData } from './gameData';
import { UserData } from './userData';
import { calculateTurnStatus, createNextTurn } from './turnEngine';

// tick to see if there are any changes in the turn status
// - progress through turns
const tick = (game: GameData, saveAfterChange: boolean = true) => {
  let changed = false;
  // console.log('tick', game);
  if (!(game.turns && game.turns.length)) {
    console.log(`tick: createTurn turn#1`);
    game.turns = [createNextTurn(game)];
    changed = true;
  }
  const activeTurnNumber = game.turns.length;
  if (game.activeTurnNumber < activeTurnNumber) {
    console.log(`tick: activate turn#${activeTurnNumber}`);
    game.activeTurnNumber = activeTurnNumber;
    changed = true;
  }
  const turn = game.turns[activeTurnNumber - 1];
  const turnStatus = calculateTurnStatus(turn);
  if (turn.status !== turnStatus) {
    console.log(`tick: turn#${activeTurnNumber} = ${turnStatus}`);
    turn.status = turnStatus;
    changed = true;
  }
  // TODO score turn
  // TODO score game
  // TODO end game
  if (changed && saveAfterChange) {
    console.log('game changed... updating');
    game.update();
  }
};

const teamName = (name: TeamKey | TeamColor) => {
  if (name === TeamKey.whiteTeam) return 'White Team';
  if (name === TeamColor.WHITE) return 'White Team';
  if (name === TeamKey.blackTeam) return 'Black Team';
  if (name === TeamColor.BLACK) return 'Black Team';
  return '???? Team';
};
const teamOpposite = (name: TeamKey) =>
  name === TeamKey.whiteTeam ? TeamKey.blackTeam : TeamKey.whiteTeam;
const teamOppositeName = (name: TeamKey) => teamName(teamOpposite(name));

const getMyTeam = (game: GameData, user: UserData) => {
  if (!(user && user.uid)) return null;
  const uid = user.uid;
  if (!(game && game.uids && game.uids.indexOf(uid) !== -1)) return null;
  // should be in the data of the uids
  if (
    game.whiteTeam &&
    game.whiteTeam.uids &&
    game.whiteTeam.uids.indexOf(uid)
  ) {
    return TeamKey.whiteTeam;
    // return 'whiteTeam';
  }
  if (
    game.blackTeam &&
    game.blackTeam.uids &&
    game.blackTeam.uids.indexOf(uid)
  ) {
    return TeamKey.blackTeam;
    // return 'blackTeam';
  }
  // fallback plan... look at the all the teamMembers
  if (game.whiteTeam.teamMembers.filter(({ id }) => id === uid).length > 0) {
    return TeamKey.whiteTeam;
    // return 'whiteTeam';
  }
  if (game.blackTeam.teamMembers.filter(({ id }) => id === uid).length > 0) {
    return TeamKey.blackTeam;
    // return 'blackTeam';
  }
  return null;
};
const getTeamData = (
  game: GameData,
  user: UserData,
  showTeam: TeamKey | null = null,
) => {
  const teamKey = showTeam || getMyTeam(game, user);
  if (teamKey && game[teamKey]) {
    return game[teamKey];
  }
  console.error(`getTeamData not found for team: ${teamKey}`);
  console.dir(game);
  return null;
};
const getWords = (
  game: GameData,
  user: UserData,
  showTeam: TeamKey | null = null,
) => {
  const teamData = getTeamData(game, user, showTeam);
  if (teamData && teamData.words) {
    return teamData.words;
  }
  return null;
};

export {
  tick,
  teamName,
  teamOpposite,
  teamOppositeName,
  getMyTeam,
  getTeamData,
  getWords,
};
