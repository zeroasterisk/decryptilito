import React from 'react';

import './Game.css';

import GameTeamName from './GameTeamName';
import GameTurnBlocks from './GameTurnBlocks';
import Words from './Words';

import { getTeamData } from './gameEngine';

import { GameData } from './gameData';
import { UserData } from './userData';

type GameProps = {
  // after fetching the game data...
  game: GameData;
  user: UserData;
};
const Game: React.FC<GameProps> = ({ game, user }) => {
  const teamData = getTeamData({ game, user });
  return (
    <div className={`Game ${teamData.teamColor}Team`}>
      <GameTeamName game={game} user={user} />
      <Words game={game} user={user} />
      <GameTurnBlocks game={game} user={user} />
      <h4>TODO: build this out</h4>
      <pre>
        - GameClues (unrevieled, editable, revieled) - OrderGuess (unrevieled,
        editable, revieled, scratch) - List "GameClue Logs"
      </pre>
    </div>
  );
};

export default Game;
