import { Card, Col, Icon, Row, Tooltip } from 'antd';
import React from 'react';

import {
  GameClueEditable,
  GameClueRevield,
  GameClueUnrevield,
} from './GameClue';

import {
  getTeamData,
  getTurnData,
  teamName,
  teamOppositeName,
} from './gameEngine';

const GameTurnBlock: React.FC = props => {
  const { turn_number, data } = props;
  const { active_turn_number, active_turn_phase } = data;
  const classActive =
    turn_number === active_turn_number ? 'GameTurnBlockActive' : '';
  // active_turn_phase: "prepare", // prepare, encrypt, guess_order_white_team, guess_order_black_team
  if (turn_number === active_turn_number && active_turn_phase === 'encrypt') {
    return <GameTurnBlockActive {...props} />;
  }
  if (turn_number < active_turn_number) {
    return <GameTurnBlockPast {...props} />;
  }
  // TODO consider while typing...?
  return <GameTurnBlockFuture {...props} />;
};
const GameTurnBlockPast: React.FC = props => {
  const {
    team = 'blackTeam',
    team_ui = 'blackTeam',
    turn_number = 1,
    data,
  } = props;
  const { active_turn_number, active_turn_phase } = data;
  const classActive =
    turn_number === active_turn_number ? 'GameTurnBlockActive' : '';
  const turnData = getTurnData(props, turn_number);
  return (
    <Card
      size="small"
      className={`GameTurnBlock GameTurnBlockPast ${classActive}`}
      style={{ maxWidth: 400 }}
    >
      <Row className="GameTurnBlocksHeader">
        <Col xs={18}>
          #{turn_number}
          &nbsp;
          <strong>
            encryptor:
            {turnData.encryptorName}
          </strong>
        </Col>
        <Tooltip title={`Guessed Order for ${teamName(team_ui)}`}>
          <Col xs={2} className="Order">
            <Icon type="question-circle" />
          </Col>
        </Tooltip>
        <Tooltip title={`Guessed Order for ${teamOppositeName(team_ui)}`}>
          <Col xs={2} className="Order teamOpposite">
            <Icon type="question-circle" />
          </Col>
        </Tooltip>
        <Tooltip title={`Correct Order for ${teamName(team_ui)}`}>
          <Col xs={2} className="Order">
            <Icon type="check-circle" />
          </Col>
        </Tooltip>
      </Row>
      <GameClueRevield clue_number={1} {...props} {...turnData} />
      <GameClueRevield clue_number={2} {...props} {...turnData} />
      <GameClueRevield clue_number={3} {...props} {...turnData} />
    </Card>
  );
};
const GameTurnBlockFuture: React.FC = props => {
  const { turn_number, data } = props;
  const { active_turn_number, active_turn_phase } = data;
  const classActive =
    turn_number === active_turn_number ? 'GameTurnBlockActive' : '';
  return (
    <Card size="small" className={classActive} style={{ maxWidth: 400 }}>
      <Row className="GameTurnBlocksHeader">
        <Col xs={16}>#{turn_number}</Col>
        <Col xs={4} className="OrderGuess">
          ?
        </Col>
        <Col xs={4} className="OrderActual">
          !
        </Col>
      </Row>
      <GameClueUnrevield {...props} />
      <GameClueUnrevield {...props} />
      <GameClueUnrevield {...props} />
    </Card>
  );
};
const GameTurnBlockActive: React.FC = props => {
  const { turn_number, data } = props;
  const { active_turn_number, active_turn_phase } = data;
  const classActive =
    turn_number === active_turn_number ? 'GameTurnBlockActive' : '';
  return (
    <Card size="small" className={classActive} style={{ maxWidth: 400 }}>
      <Row className="GameTurnBlocksHeader">
        <Col xs={16}>#{turn_number}</Col>
        <Col xs={4} className="OrderGuess">
          ?
        </Col>
        <Col xs={4} className="OrderActual">
          !
        </Col>
      </Row>
      <GameClueEditable clue_number={1} {...props} />
      <GameClueEditable clue_number={2} {...props} />
      <GameClueEditable clue_number={3} {...props} />
    </Card>
  );
};

export default GameTurnBlock;

export {
  GameTurnBlock,
  GameTurnBlockActive,
  GameTurnBlockPast,
  GameTurnBlockFuture,
};
