import React from 'react';

import { GameData } from './gameData';
import { UserData } from './userData';

import Game from './Game';

type GameLoaderProps = {
  game_id?: string;
  team_id?: string;
  user?: UserData;
};
const GameLoader: React.FC<GameLoaderProps> = ({ game_id, team_id, user }) => {
  // TODO load data from game_id and team_id info...
  return <p>GameLoader not yet built</p>;
  // return (<Game user={user} game={game} game={game} />);
};

export default GameLoader;
