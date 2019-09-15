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

import { TeamKey } from './gameData';
import { teamName, teamOppositeName } from './gameEngine';

const { Text } = Typography;
const { Option } = Select;

const GameClueUnrevield: React.FC = () => {
  return <Skeleton title={false} paragraph={{ rows: 1, width: '100%' }} />;
};

const ColClue: React.FC = ({ clue, children }) => (
  <Tooltip title="Given GameClue">
    <Col xs={15}>{clue ? <Text>{clue}</Text> : children}</Col>
  </Tooltip>
);

const ColOpponentGuess: React.FC = ({ future, lock, children, showTeam }) => (
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

const ColOwnGuess: React.FC = ({ future, children, showTeam }) => (
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

const ColCorrect: React.FC = ({ lock, children, showTeam }) => (
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

const OrderSelect: React.FC = ({
  disabled,
  value,
}: {
  disabled: boolean;
  value: number;
}) => {
  // TODO consider reducing options to omit already guessed numbers
  //      until then, we will just have to validate before submit...
  if (disabled) {
    return (
      <Input
        style={{ width: '100%', textAlign: 'center' }}
        size="small"
        disabled={disabled}
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

const GameClueHeader: React.FC = ({ children, showTeam }) => (
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

const GameClueRevield: React.FC = props => {
  const {
    showTeam = 'blackTeam',
    clue_number = 1,
    clues = [],
    guessedOrderSelf = [],
    guessedOrderOpponent = [],
    correctOrder = [],
  } = props;
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
      <ColCorrect>
        <Text strong>{valueOrderCorrect}</Text>
      </ColCorrect>
    </Row>
  );
};
const GameClueEditClue: React.FC = ({
  clues,
  clue_number,
  correctOrder,
  correctOrderHidden,
  showTeam,
}: {
  clues: string[];
  clue_number: number;
  correctOrder: number[];
  correctOrderHidden: boolean;
  showTeam: TeamKey;
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
      <ColCorrect lock={correctOrderHidden}>
        <Text strong>{valueOrderCorrect}</Text>
      </ColCorrect>
    </Row>
  );
};

const GameClueShowOnlyClue: React.FC = ({
  clues,
  clue_number,
  showTeam,
}: {
  clues: string[];
  clue_number: number;
  showTeam: TeamKey;
}) => {
  const clue = clues[clue_number - 1];
  return (
    <Row gutter={8} className="GameTurnClues">
      <ColClue clue={clue} />
      <ColOpponentGuess showTeam={showTeam} future />
      <ColOwnGuess showTeam={showTeam} future />
      <ColCorrect lock />
    </Row>
  );
};

// TODO need to be able to guess for my team and also for the opposing team
const GameClueEditOpponentGuess: React.FC = ({
  clues,
  clue_number,
  guessedOrderOpponent,
  showTeam,
  disabled,
}: {
  clues: string[];
  clue_number: number;
  guessedOrderOpponent: number[];
  showTeam: TeamKey;
  disabled: boolean;
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
      <ColCorrect lock />
    </Row>
  );
};

const GameClueEditOwnGuess: React.FC = ({
  clues,
  clue_number,
  guessedOrderSelf,
  showTeam,
  disabled,
}: {
  clues: string[];
  clue_number: number;
  guessedOrderSelf: number[];
  showTeam: TeamKey;
  disabled: boolean;
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
      <ColCorrect lock />
    </Row>
  );
};

export {
  GameClueHeader,
  GameClueRevield,
  GameClueUnrevield,
  GameClueEditClue,
  GameClueShowOnlyClue,
  GameClueEditOpponentGuess,
  GameClueEditOwnGuess,
};
