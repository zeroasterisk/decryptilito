import React from 'react';

import './Game.css';

import { Tooltip } from 'antd';

import GameTeamName from './GameTeamName';
import GameTurnBlocks from './GameTurnBlocks';
import Words from './Words';

import { getMyTeam, getTeamData } from '../../logic/gameEngine';

import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

interface GameUIProps {
  // after fetching the game data...
  game: GameData;
  user: UserData;
}
const GameUI: React.FC<GameUIProps> = ({ game, user }) => {
  const myTeam = getMyTeam(game, user);
  if (!myTeam) {
    return <Tooltip title="Unable to determine team assignment">?</Tooltip>;
  }
  const showTeam = myTeam;
  const teamData = getTeamData({ game, user });
  if (!teamData) {
    return <Tooltip title="Unable to determine team data">?</Tooltip>;
  }

  return (
    <div className={`Game ${teamData.teamColor}Team`}>
      <GameTeamName teamData={teamData} />
      <Words teamData={teamData} />
      <GameTurnBlocks
        game={game}
        user={user}
        myTeam={myTeam}
        showTeam={showTeam}
      />
      <h4>TODO: build this out</h4>
      <pre>
        - GameClues (unrevieled, editable, revieled) - OrderGuess (unrevieled,
        editable, revieled, scratch) - List "GameClue Logs"
      </pre>
    </div>
  );
};

export default GameUI;
