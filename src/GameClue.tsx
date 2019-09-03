import {
  Col,
  Input,
  InputNumber,
  Row,
  Skeleton,
  Tooltip,
  Typography,
} from 'antd';
import React from 'react';
import { teamName, teamOppositeName } from './gameEngine';
const { Text } = Typography;

const GameClue: React.FC = props => {
  const { turn_number, active_turn_number, active_turn_phase } = props.data;
  // active_turn_phase: "prepare", // prepare, encrypt, guess_order_white_team, guess_order_black_team
  if (turn_number === active_turn_number && active_turn_phase === 'encrypt') {
    return <GameClueEditable {...props} />;
  }
  if (turn_number < active_turn_number) {
    return <GameClueRevield {...props} />;
  }
  // TODO consider while typing...?
  return <GameClueUnrevield {...props} />;
};
const GameClueUnrevield: React.FC = () => {
  return <Skeleton title={false} paragraph={{ rows: 1 }} />;
};
const GameClueRevield: React.FC = props => {
  const {
    team = 'blackTeam',
    team_ui = 'blackTeam',
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
    <Row>
      <Tooltip title="Given GameClue">
        <Col xs={18}>
          <Text>{clue}</Text>
        </Col>
      </Tooltip>
      <Tooltip title={`Guessed Order for ${teamName(team_ui)}`}>
        <Col xs={2} className="Order">
          <Text
            delete={valueOrderSelf !== valueOrderCorrect}
            disabled={valueOrderSelf !== valueOrderCorrect}
          >
            {valueOrderSelf}
          </Text>
        </Col>
      </Tooltip>
      <Tooltip title={`Guessed Order for ${teamOppositeName(team_ui)}`}>
        <Col xs={2} className="Order teamOpposite">
          <Text
            delete={valueOrderOpponent !== valueOrderCorrect}
            disabled={valueOrderOpponent !== valueOrderCorrect}
          >
            {valueOrderOpponent}
          </Text>
        </Col>
      </Tooltip>
      <Tooltip title={`Correct Order for ${teamName(team_ui)}`}>
        <Col xs={2} className="Order">
          <Text strong>{valueOrderCorrect}</Text>
        </Col>
      </Tooltip>
    </Row>
  );
};
const GameClueEditable: React.FC = () => {
  return (
    <Row>
      <Col xs={16}>
        <Input style={{ width: '100%' }} />
      </Col>
      <Col xs={4}>
        <InputNumber min={1} max={4} style={{ width: '100%' }} />
      </Col>
      <Col xs={4}>
        <InputNumber
          min={1}
          max={4}
          style={{ width: '100%' }}
          readonly
          disabled
        />
      </Col>
    </Row>
  );
};

export default GameClue;
export { GameClueRevield, GameClueUnrevield, GameClueEditable };
