import React from 'react';
import GameTurnBlock from './GameTurnBlock';

import { TeamKey } from '../../logic/enums';
import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

interface GameProps {
  // after fetching the game data...
  game: GameData;
  user: UserData;
  myTeam: TeamKey;
  showTeam: TeamKey;
}
// TODO make this dynamic
const GameTurnBlocks: React.FC<GameProps> = (props) => {
  return (
    <div>
      <GameTurnBlock turn_number={1} {...props} />
      <GameTurnBlock turn_number={2} {...props} />
      <GameTurnBlock turn_number={3} {...props} />
      <GameTurnBlock turn_number={4} {...props} />
    </div>
  );
};

export default GameTurnBlocks;
