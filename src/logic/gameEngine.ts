import { TeamColor, TeamKey } from './enums';
import { GameData } from './gameData';
import { UserData } from './userData';

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
  if (!(game && game.uids && game.uids.indexOf(uid))) return null;
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
const getTeamData = ({ game, user }: { game: GameData; user: UserData }) => {
  const myTeam = getMyTeam(game, user);
  if (myTeam && game[myTeam]) {
    return game[myTeam];
  }
  console.error(`getTeamData not found for team: ${myTeam}`);
  console.dir(game);
  return null;
};

export { teamName, teamOpposite, teamOppositeName, getMyTeam, getTeamData };
