import React from 'react';

import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

interface GameProps {
  // TODO need to wrap this is a data fetcher component
  game_id?: string;
  // after fetching the game data...
  game?: GameData;
  user?: UserData;
}
const GameEntry: React.FC<GameProps> = ({ game, user }) => {
  return <div>Stub... TODO: build me</div>;
};

export default GameEntry;
