import React from 'react';

import { Col, Row, Skeleton, Tooltip, Typography } from 'antd';

import { TeamKey } from '../../logic/enums';
import { GameData } from '../../logic/gameData';
import { TurnData } from '../../logic/turnData';
import { teamName, teamOppositeName } from '../../logic/gameEngine';
import { getCluesDetails } from '../../logic/turnEngine';
import { UserData } from '../../logic/userData';

const { Text } = Typography;

interface GameScratchProps {
  game: GameData;
  turn_number: number;
  showTeamClues: TeamKey;
  user: UserData;
}
const GameScratch: React.FC<GameScratchProps> = ({
  game,
  turn_number,
  showTeamClues,
  user,
}) => (
  <div className="GameScratch">
    <GameScratchHeader
      showTeamClues={showTeamClues}
      turn_number={turn_number}
      myTeam={user.myTeam}
    />
    {game.turns.map((turn, index) =>
      turn_number < index ? (
        <Skeleton />
      ) : (
        <GameScratchRow
          key={`turnScratchRow${showTeamClues}${index}`}
          game={game}
          turn={turn}
          myTeam={user.myTeam}
          showTeamClues={showTeamClues}
        />
      ),
    )}
  </div>
);

interface GameScratchHeaderProps {
  turn_number: number;
  showTeamClues: TeamKey;
  myTeam: TeamKey;
}
const GameScratchHeader: React.FC<GameScratchHeaderProps> = ({
  turn_number,
  showTeamClues,
  myTeam,
}) => (
  <Row gutter={8} className="GameScratchHeader">
    <Col xs={24} className="GameScratchTitle">
      {myTeam === showTeamClues ? (
        <Text>Clues we have leaked to {teamOppositeName(showTeamClues)}</Text>
      ) : (
        <Text>Clues {teamName(showTeamClues)} has leaked to us</Text>
      )}
    </Col>
    <Col xs={6} className="Word">
      word #1
    </Col>
    <Col xs={6} className="Word">
      word #2
    </Col>
    <Col xs={6} className="Word">
      word #3
    </Col>
    <Col xs={6} className="Word">
      word #4
    </Col>
  </Row>
);

interface GameScratchRowProps {
  game: GameData;
  myTeam: TeamKey;
  showTeamClues: TeamKey;
  turn: TurnData;
}
const GameScratchRow: React.FC<GameScratchRowProps> = ({
  game,
  myTeam,
  showTeamClues,
  turn,
}) => {
  const clueDetails = getCluesDetails(turn, showTeamClues);
  if (!(clueDetails && clueDetails.length > 0)) return null;
  return (
    <Row gutter={8} className="GameScratchRow">
      {clueDetails.map((p) => (
        <GameScratchCol
          key={`c${p.index}`}
          showTeamClues={showTeamClues}
          myTeam={myTeam}
          {...p}
        />
      ))}
    </Row>
  );
};
// <GameScratchCol clue_number={0} turn={turn} showTeamClues={showTeamClues} />

interface GameScratchColProps {
  clue: string | null;
  guessedOrderOpponent: number | null; // may be better as a bool?
  guessedOrderSelf: number | null; // may be better a bool?
  index: number;
  myTeam: TeamKey;
  position: number; // always index + 1
  showTeamClues: TeamKey;
}
const GameScratchCol: React.FC<GameScratchColProps> = ({
  clue,
  guessedOrderOpponent,
  guessedOrderSelf,
  index,
  myTeam,
  position,
  showTeamClues,
}) => {
  // if showing my team, this area it the clues we've given and their guess outcomes
  const showingMyTeam = showTeamClues === myTeam;
  if (showingMyTeam) {
    // showing my own given clues (while encrypting)
    const theyGuessedCorrectly = guessedOrderOpponent === position;
    return (
      <Col xs={6} className="Word">
        {theyGuessedCorrectly ? (
          <Tooltip
            title={`${teamOppositeName(showTeamClues)} guessed correctly`}
          >
            <Text type="danger">{clue}</Text>
          </Tooltip>
        ) : (
          <Tooltip
            title={`${teamOppositeName(showTeamClues)} did not guess correctly`}
          >
            <Text type="warning">{clue}</Text>
          </Tooltip>
        )}
      </Col>
    );
  }
  // showing other team's prior cluse (while decrypting)
  const weGuessedCorrectly = guessedOrderSelf === position;
  return (
    <Col xs={6} className="Word">
      {weGuessedCorrectly ? (
        <Tooltip title="we guessed correctly">
          <Text>{clue}</Text>
        </Tooltip>
      ) : (
        <Tooltip title="we did not guess correctly">
          <Text type="warning">{clue}</Text>
        </Tooltip>
      )}
    </Col>
  );
};

export default GameScratch;
