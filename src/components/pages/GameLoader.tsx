import React from 'react';

// import { GameData } from './gameData';
import { UserData } from '../../logic/userData';

// import Game from '../game/Game';

interface GameLoaderProps {
  game_id?: string;
  team_id?: string;
  user?: UserData;
}
const GameLoader: React.FC<GameLoaderProps> = ({ game_id, team_id, user }) => {
  if (!game_id) {
    return <p>GameLoader.Lobby not yet built</p>;
  }
  if (!team_id) {
    return <p>GameLoader.GameEntry not yet built</p>;
  }
  // TODO load data from game_id and team_id info...
  return <p>GameLoader not yet built</p>;
  // return (<Game user={user} game={game} game={game} />);
};

export default GameLoader;
