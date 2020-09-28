import React from 'react';

import './Game.css';

import { Result } from 'antd';

import GameUIPending from './GameUIPending';
import GameTeamName from './GameTeamName';
import GameTurnBlocks from './GameTurnBlocks';
import Words from './Words';

import { getMyTeam, getTeamData } from '../../logic/gameEngine';

import { GameStatus } from '../../logic/enums';
import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

interface GameUIProps {
  // after fetching the game data...
  game: GameData;
  user: UserData;
}
const GameUI: React.FC<GameUIProps> = ({ game, user }) => {
  if (game.status === GameStatus.ENTRY) {
    return <GameUIPending game={game} user={user} />;
  }
  const myTeam = getMyTeam(game, user);
  if (!myTeam) {
    console.log(game, user, myTeam);
    return (
      <Result status="warning" title="Unable to determine team assignment" />
    );
  }
  const showTeam = myTeam;
  const teamData = getTeamData({ game, user });
  if (!teamData) {
    return <Result status="warning" title="Unable to determine team data" />;
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
