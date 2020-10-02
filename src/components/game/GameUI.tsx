import React, { useEffect } from 'react';

import './Game.css';

import { Result } from 'antd';

import GameUIPending from './GameUIPending';
import GameTeamName from './GameTeamName';
import GameTurnBlocks from './GameTurnBlocks';
import Words from './Words';

import { getMyTeam, getTeamData } from '../../logic/gameEngine';

import { GameStatus, TeamKey } from '../../logic/enums';
import { GameData } from '../../logic/gameData';
import { TeamData } from '../../logic/teamData';
import { UserData } from '../../logic/userData';

import { onChangeType } from '../editables/EditInModalInput';

interface GameUIProps {
  // after fetching the game data...
  game: GameData;
  user: UserData;
}
const GameUI: React.FC<GameUIProps> = ({ game, user }) => {
  // when the component mounts, tick every X seconds
  // when the component unmountes, clear the interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (game) {
        game.tick();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  // ensure we have stuff
  if (!(game && user)) return <p>Loading...</p>;
  // determine what to show based on game status
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
  const teamData = getTeamData(game, user, showTeam);
  if (!teamData) {
    return <Result status="warning" title="Unable to determine team data" />;
  }

  // update function for team data
  const setTeamData = (teamKey: TeamKey, newTeamData: TeamData) => {
    if (teamKey === TeamKey.blackTeam) {
      game.blackTeam = newTeamData;
    } else {
      game.whiteTeam = newTeamData;
    }
    game.update();
    return 'Saved';
  };
  const onChangeTeamName: onChangeType = (newName: string) => {
    teamData.teamName = newName;
    return setTeamData(showTeam, teamData);
  };
  const onChangeMemberNames: onChangeType = (newName: string) => {
    teamData.teamMemberNames = newName;
    return setTeamData(showTeam, teamData);
  };

  return (
    <div className={`Game ${teamData.teamColor}Team`}>
      <GameTeamName
        teamData={teamData}
        editable={showTeam === myTeam}
        onChangeTeamName={onChangeTeamName}
        onChangeMemberNames={onChangeMemberNames}
      />
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
