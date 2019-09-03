import { Button, Card, Col, Icon, Row, Typography, Tooltip } from 'antd';
import React from 'react';

import {
  GameClueEditGuess,
  GameClueEditClue,
  GameClueRevielClue,
  GameClueRevield,
  GameClueUnrevield,
} from './GameClue';

import {
  getTeamData,
  getTurnData,
  teamName,
  teamOppositeName,
} from './gameEngine';
const { Text } = Typography;

const GameTurnBlock: React.FC = props => {
  const { turn_number, active_turn_number, active_turn_phase } = props;
  const classActive =
    turn_number === active_turn_number ? 'GameTurnBlockActive' : '';
  // active_turn_phase: "prepare", // prepare, encrypt, guess_order_white_team, guess_order_black_team
  if (turn_number === active_turn_number) {
    return <GameTurnBlockActiveEncryptor {...props} />;
  }
  if (turn_number < active_turn_number) {
    return <GameTurnBlockPast {...props} />;
  }
  // TODO consider while typing...?
  return <GameTurnBlockFuture {...props} />;
};

// After a turn is over
const GameTurnBlockPast: React.FC = props => {
  const { team = 'blackTeam', team_ui = 'blackTeam', turn_number = 1 } = props;
  const turnData = getTurnData(props, turn_number);
  return (
    <Card
      size="small"
      className={`GameTurnBlock GameTurnBlockPast`}
      style={{ maxWidth: 400 }}
    >
      <Row className="GameTurnBlocksHeader">
        <Col xs={18}>
          #{turn_number}
          &nbsp;
          <Text disabled>
            encryptor:
            {turnData.encryptorName}
          </Text>
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
  return (
    <Card size="small" style={{ maxWidth: 400 }}>
      <Row className="GameTurnBlocksHeader">
        <Col xs={18}>#{turn_number}</Col>
      </Row>
      <GameClueUnrevield {...props} />
      <GameClueUnrevield {...props} />
      <GameClueUnrevield {...props} />
    </Card>
  );
};

const GameTurnBlockActivePrepare: React.FC = props => {
  const { turn_number, data } = props;
  const turnData = getTurnData(props, turn_number);
  return (
    <Card
      size="small"
      title={
        <div>
          Encryption&nbsp;
          <strong>(rest of team avert eyes)</strong>
          <Icon type="lock" />
          <br />
          Encryptor: {turnData.encryptorName}
        </div>
      }
      actions={[
        <Button type="primary">
          Show the Correct Order
          <Icon type="right" />
        </Button>,
      ]}
      loading
      className="PrepareEncryptor"
      style={{ maxWidth: 400 }}
    >
      ...
    </Card>
  );
};

const GameTurnBlockActiveEncryptor: React.FC = props => {
  const { turn_number, data } = props;
  const turnData = getTurnData(props, turn_number);
  return (
    <Card
      size="small"
      title={
        <div>
          Encryption&nbsp;
          <strong>(rest of team avert eyes)</strong>
          <Icon type="lock" />
          <br />
          Encryptor: {turnData.encryptorName}
        </div>
      }
      actions={[
        <Button type="secondary">
          Hide Order
          <Icon type="lock" />
        </Button>,
        <Button type="primary">
          Submit Clues
          <Icon type="right" />
        </Button>,
      ]}
      style={{ maxWidth: 400 }}
    >
      <Row className="GameTurnBlocksHeader">
        <Col xs={18}>
          #{turn_number}
          &nbsp;
          <Text disabled>(provide clues)</Text>
        </Col>
        <Tooltip title="Correct Order">
          <Col xs={3} className="Order">
            <Icon type="check-circle" />
          </Col>
        </Tooltip>
      </Row>
      <GameClueEditClue clue_number={1} {...props} {...turnData} />
      <GameClueEditClue clue_number={2} {...props} {...turnData} />
      <GameClueEditClue clue_number={3} {...props} {...turnData} />
    </Card>
  );
};

const GameTurnBlockActiveAwaitingDecryption: React.FC = props => {
  const { turn_number, data } = props;
  const turnData = getTurnData(props, turn_number);
  return (
    <Card
      size="small"
      title={
        <div>
          Awaiting Decryption <Icon type="loading" />
          <br />
          Encryptor: {turnData.encryptorName}
        </div>
      }
      style={{ maxWidth: 400 }}
    >
      <Row className="GameTurnBlocksHeader">
        <Col xs={18}>
          #{turn_number}
          &nbsp;
          <Text disabled>(both teams must complete clues)</Text>
        </Col>
      </Row>
      <GameClueRevielClue clue_number={1} {...props} {...turnData} />
      <GameClueRevielClue clue_number={2} {...props} {...turnData} />
      <GameClueRevielClue clue_number={3} {...props} {...turnData} />
    </Card>
  );
};

const GameTurnBlockActiveDecryptors: React.FC = props => {
  const { team = 'blackTeam', team_ui = 'blackTeam', turn_number = 1 } = props;
  const turnData = getTurnData(props, turn_number);
  return (
    <Card
      size="small"
      title={
        <div>
          Guess Order for {teamName(team_ui)}
          <br />
          Decryptors: {turnData.decryptorNames}
        </div>
      }
      actions={[
        <Button type="primary">
          Submit Order Guesses
          <Icon type="right" />
        </Button>,
      ]}
      style={{ maxWidth: 400 }}
    >
      <Row className="GameTurnBlocksHeader">
        <Col xs={18}>
          #{turn_number}
          &nbsp;
          <Text disabled>
            encryptor:
            {turnData.encryptorName}
          </Text>
        </Col>
        <Tooltip title={`Guessed Order for ${teamName(team_ui)}`}>
          <Col xs={4} className="Order">
            <Icon type="question-circle" />
          </Col>
        </Tooltip>
      </Row>
      <GameClueEditGuess clue_number={1} {...props} {...turnData} />
      <GameClueEditGuess clue_number={2} {...props} {...turnData} />
      <GameClueEditGuess clue_number={3} {...props} {...turnData} />
    </Card>
  );
};

export default GameTurnBlock;

export {
  GameTurnBlock,
  GameTurnBlockActivePrepare,
  GameTurnBlockActiveEncryptor,
  GameTurnBlockActiveAwaitingDecryption,
  GameTurnBlockActiveDecryptors,
  GameTurnBlockPast,
  GameTurnBlockFuture,
};
