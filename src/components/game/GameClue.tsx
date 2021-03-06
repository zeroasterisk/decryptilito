import React from 'react';

import {
  Col,
  Icon,
  Input,
  Row,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from 'antd';

import { TeamKey, TurnTeamData } from '../../logic/gameData';
import { teamName, teamOppositeName } from '../../logic/gameEngine';

const { Text } = Typography;
const { Option } = Select;

const GameClueUnreveiled: React.FC = () => {
  return <Skeleton title={false} paragraph={{ rows: 1, width: '100%' }} />;
};

type ColClueProps = {
  clue?: string;
};
const ColClue: React.FC<ColClueProps> = ({ clue, children }) => (
  <Tooltip title="Given GameClue">
    <Col xs={15}>{clue ? <Text>{clue}</Text> : children}</Col>
  </Tooltip>
);

type ColOpponentGuessProps = {
  future?: boolean;
  lock?: boolean;
  showTeam: TeamKey;
};
const ColOpponentGuess: React.FC<ColOpponentGuessProps> = ({
  future,
  lock,
  children,
  showTeam,
}) => (
  <Tooltip title={`Guessed Order for ${teamName(showTeam)}`}>
    <Col xs={3} className="Order teamOwn">
      {future || lock ? (
        <Text disabled>
          <Icon type={lock ? 'lock' : 'clock-circle'} />
        </Text>
      ) : (
        children
      )}
    </Col>
  </Tooltip>
);

type ColOwnGuessProps = {
  future?: boolean;
  showTeam: TeamKey;
};
const ColOwnGuess: React.FC<ColOwnGuessProps> = ({
  future,
  children,
  showTeam,
}) => (
  <Tooltip title={`Guessed Order for ${teamOppositeName(showTeam)}`}>
    <Col xs={3} className="Order teamOpposite">
      {future ? (
        <Text disabled>
          <Icon type="clock-circle" />
        </Text>
      ) : (
        children
      )}
    </Col>
  </Tooltip>
);

type ColCorrectProps = {
  lock?: boolean;
  showTeam: TeamKey;
};
const ColCorrect: React.FC<ColCorrectProps> = ({
  lock,
  children,
  showTeam,
}) => (
  <Tooltip title={`Correct Order for ${teamName(showTeam)}`}>
    <Col xs={3} className="Order">
      {lock ? (
        <Text disabled>
          <Icon type="lock" />
        </Text>
      ) : (
        children
      )}
    </Col>
  </Tooltip>
);

type OrderSelectProps = {
  disabled?: boolean;
  value: number;
};
const OrderSelect: React.FC<OrderSelectProps> = ({ disabled, value }) => {
  // TODO consider reducing options to omit already guessed numbers
  //      until then, we will just have to validate before submit...
  if (disabled) {
    return (
      <Input
        style={{ width: '100%', textAlign: 'center' }}
        size="small"
        disabled={!!disabled}
        value={value || '?'}
      />
    );
  }
  const options = [1, 2, 3, 4];
  return (
    <Select
      style={{ width: '100%' }}
      size="small"
      disabled={disabled}
      value={value || '?'}
      defaultValue="?"
    >
      <Option value="?">
        <Text type="warning">
          <small>?</small>
        </Text>
      </Option>
      {options.map((val, index) => (
        <Option key={`option${val}`}>{val}</Option>
      ))}
    </Select>
  );
};

type GameClueHeaderProps = {
  showTeam: TeamKey;
};

const GameClueHeader: React.FC<GameClueHeaderProps> = ({
  children,
  showTeam,
}) => (
  <Row gutter={8} className="GameTurnCluesHeader">
    <Col xs={15}>{children}</Col>
    <Tooltip title={`Guessed Order for ${teamName(showTeam)}`}>
      <Col xs={3} className="Order">
        <Icon type="question-circle" />
      </Col>
    </Tooltip>
    <Tooltip title={`Guessed Order for ${teamOppositeName(showTeam)}`}>
      <Col xs={3} className="Order teamOpposite">
        <Icon type="question-circle" />
      </Col>
    </Tooltip>
    <Tooltip title={`Correct Order for ${teamName(showTeam)}`}>
      <Col xs={3} className="Order">
        <Icon type="check-circle" />
      </Col>
    </Tooltip>
  </Row>
);

type GameClueProps = {
  showTeam: TeamKey;
  clue_number: number;
  turnTeamData: TurnTeamData;
  disabled?: boolean;
};

const GameClueReveiled: React.FC<GameClueProps> = ({
  showTeam = TeamKey.blackTeam,
  clue_number = 1,
  turnTeamData: {
    clues = [],
    guessedOrderSelf = [],
    guessedOrderOpponent = [],
    correctOrder = [],
  },
}) => {
  const clue = clues[clue_number - 1] || '';
  // TODO need to determine if we are displaying our info or the opponnent
  const valueOrderSelf = guessedOrderSelf[clue_number - 1] || 0;
  const valueOrderOpponent = guessedOrderOpponent[clue_number - 1] || 0;
  const valueOrderCorrect = correctOrder[clue_number - 1] || 0;
  return (
    <Row gutter={8} className="GameTurnClues">
      <ColClue clue={clue} />
      <ColOpponentGuess showTeam={showTeam}>
        <Text
          delete={valueOrderSelf !== valueOrderCorrect}
          disabled={valueOrderSelf !== valueOrderCorrect}
        >
          {valueOrderSelf}
        </Text>
      </ColOpponentGuess>
      <ColOwnGuess showTeam={showTeam}>
        <Text
          delete={valueOrderOpponent !== valueOrderCorrect}
          disabled={valueOrderOpponent !== valueOrderCorrect}
        >
          {valueOrderOpponent}
        </Text>
      </ColOwnGuess>
      <ColCorrect showTeam={showTeam}>
        <Text strong>{valueOrderCorrect}</Text>
      </ColCorrect>
    </Row>
  );
};
const GameClueEditClue: React.FC<GameClueProps> = ({
  clue_number,
  showTeam,
  turnTeamData: { clues = [], correctOrder = [], correctOrderHidden = false },
}) => {
  const valueOrderCorrect = correctOrder[clue_number - 1] || 0;
  const clue = clues[clue_number - 1];
  return (
    <Row gutter={8} className="GameTurnClues">
      <ColClue>
        <Input style={{ width: '100%' }} value={clue} />
      </ColClue>
      <ColOpponentGuess showTeam={showTeam} future />
      <ColOwnGuess showTeam={showTeam} future />
      <ColCorrect showTeam={showTeam} lock={correctOrderHidden}>
        <Text strong>{valueOrderCorrect}</Text>
      </ColCorrect>
    </Row>
  );
};

const GameClueShowOnlyClue: React.FC<GameClueProps> = ({
  clue_number,
  showTeam,
  turnTeamData: { clues = [] },
}) => {
  const clue = clues[clue_number - 1];
  return (
    <Row gutter={8} className="GameTurnClues">
      <ColClue clue={clue} />
      <ColOpponentGuess showTeam={showTeam} future />
      <ColOwnGuess showTeam={showTeam} future />
      <ColCorrect showTeam={showTeam} lock />
    </Row>
  );
};

// TODO need to be able to guess for my team and also for the opposing team
const GameClueEditOpponentGuess: React.FC<GameClueProps> = ({
  clue_number,
  showTeam,
  disabled,
  turnTeamData: { clues = [], guessedOrderOpponent = [] },
}) => {
  const clue = clues[clue_number - 1];
  const value = guessedOrderOpponent[clue_number - 1];
  return (
    <Row gutter={8} className="GameTurnClues">
      <ColClue clue={clue} />
      <ColOpponentGuess showTeam={showTeam}>
        <OrderSelect value={value} disabled={disabled} />
      </ColOpponentGuess>
      <ColOwnGuess showTeam={showTeam} future />
      <ColCorrect showTeam={showTeam} lock />
    </Row>
  );
};

const GameClueEditOwnGuess: React.FC<GameClueProps> = ({
  clue_number,
  showTeam,
  disabled,
  turnTeamData: { clues = [], guessedOrderSelf = [] },
}) => {
  const clue = clues[clue_number - 1];
  const value = guessedOrderSelf[clue_number - 1];
  return (
    <Row gutter={8} className="GameTurnClues">
      <ColClue clue={clue} />
      <ColOpponentGuess showTeam={showTeam} lock />
      <ColOwnGuess showTeam={showTeam}>
        <OrderSelect value={value} disabled={disabled} />
      </ColOwnGuess>
      <ColCorrect showTeam={showTeam} lock />
    </Row>
  );
};

export {
  GameClueHeader,
  GameClueReveiled,
  GameClueUnreveiled,
  GameClueEditClue,
  GameClueShowOnlyClue,
  GameClueEditOpponentGuess,
  GameClueEditOwnGuess,
};
