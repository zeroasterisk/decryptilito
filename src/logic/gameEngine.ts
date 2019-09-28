import { GameData, TeamColor, TeamKey } from './gameData';
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

const getTeamData = ({ game, user }: { game: GameData; user: UserData }) => {
  const { myTeam } = user;
  return game[myTeam];
};

export { teamName, teamOpposite, teamOppositeName, getTeamData };
