import React, { useState } from 'react';

import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Skeleton,
  Tag,
  Tooltip,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  LoadingOutlined,
  LockOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

import { getWords } from '../../logic/gameEngine';
import { getTurnData } from '../../logic/turnEngine';

import {
  GameTurnBlockProps,
  GameTurnBlockReadonlyProps,
  WarningAvertYourEyes,
} from './GameTurnBlock';

const GameTurnBlockActiveEncryptionByOther: React.FC<GameTurnBlockReadonlyProps> = ({
  turnTeamData,
}) => {
  if (!turnTeamData) return <span>No turn team data</span>;
  return (
    <Card size="small" style={{ maxWidth: 400 }}>
      <div>
        Encryption&nbsp;
        <WarningAvertYourEyes />
      </div>
      <div>Encryptor: {turnTeamData.encryptor.name}</div>
      {turnTeamData.cluesSubmitted && (
        <div>
          <CheckCircleOutlined style={{ color: 'green' }} /> Your clues have
          been submitted.
          <br />
          <LoadingOutlined /> Waiting on the other team.
        </div>
      )}
      <Skeleton title={false} paragraph={{ rows: 3, width: '100%' }} />
    </Card>
  );
};

const GameTurnBlockActiveEncryptor: React.FC<GameTurnBlockProps> = ({
  turn_number,
  game,
  user,
  myTeam,
  showTeam,
}) => {
  const [visible, setVisible] = useState(false);
  const turnData = getTurnData(game, turn_number);
  const turnTeamData = turnData[showTeam];
  const { clues = [], correctOrder = [], encryptor } = turnTeamData;

  if (!(encryptor && encryptor.id)) {
    console.error('Unable to determine the encryptor', {
      game,
      turn_number,
      showTeam,
    });
    return <span>No encryptor set</span>;
  }
  if (encryptor.id !== user.uid) {
    // you are not the encryptor, you get to wait...
    return <GameTurnBlockActiveEncryptionByOther turnTeamData={turnTeamData} />;
  }

  const words = getWords(game, user, showTeam) || [];
  const formInitialData = {
    clue_0: clues[0],
    clue_1: clues[1],
    clue_2: clues[2],
  };
  const wordIndexes = [correctOrder[0], correctOrder[1], correctOrder[2]];
  const placeholders = [
    words[correctOrder[0]],
    words[correctOrder[1]],
    words[correctOrder[2]],
  ];
  const onFinish = (values: any) => {
    // get clues from form inputs, format for storage
    const cluesToSet = [values.clue_0, values.clue_1, values.clue_2];
    // assign clues into the correct turn & team
    game.turns[turn_number - 1][showTeam].clues = cluesToSet;
    game.turns[turn_number - 1][showTeam].cluesSubmitted = true;
    game.update();
    game.tick();
    message.success('Saved');
  };
  const onFinishFailed = (values: any) => {
    console.log('failure to finish', values);
  };
  const rules = [{ required: true, message: 'Please input your clue!' }];

  const rowProps = {
    gutter: 0,
    align: 'middle' as const,
    className: 'GameTurnClues',
  };
  const colLeftProps = { xs: 21 };
  const colRightProps = { xs: 3, align: 'right' as const };

  const title = (
    <div>
      <div>
        Encryption&nbsp;
        <WarningAvertYourEyes />
      </div>
      <div>
        Encryptor: {turnTeamData.encryptor.name}
        {turnTeamData.encryptor.id === user.uid && 'you!'}
      </div>
      {turnTeamData.cluesSubmitted && (
        <div>
          <CheckCircleOutlined style={{ color: 'green' }} /> Your clues have
          been submitted.
          <br />
          <LoadingOutlined /> Waiting on the other team.
        </div>
      )}
    </div>
  );
  const actions = [];
  if (visible) {
    actions.push(
      <Button key="hide" type="dashed" onClick={() => setVisible(false)}>
        Hide Order
        <LockOutlined />
      </Button>,
    );
    actions.push(
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit Clues
          <RightOutlined />
        </Button>
      </Form.Item>,
    );
  } else {
    actions.push(
      <Button key="hide" type="primary" onClick={() => setVisible(true)}>
        Show Order
        <UnlockOutlined />
      </Button>,
    );
  }
  return (
    <Form
      layout="vertical"
      name="basic"
      initialValues={formInitialData}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Card
        size="small"
        title={title}
        actions={actions}
        style={{ maxWidth: 400 }}
      >
        {visible && (
          <div>
            <Row {...rowProps}>
              <Tooltip
                title={`Enter the clues for your words, in this order: ${placeholders.join(
                  ', ',
                )}`}
              >
                <Col {...colLeftProps} style={{ opacity: 0.4 }}>
                  Enter your clues
                </Col>
              </Tooltip>
              <Tooltip
                title={`The order of your words is: ${wordIndexes.join(', ')}`}
              >
                <Col {...colRightProps}>
                  <QuestionCircleOutlined style={{ opacity: 0.4 }} />
                </Col>
              </Tooltip>
            </Row>
            <Row {...rowProps}>
              <Col {...colLeftProps}>
                <Form.Item name="clue_0" rules={rules}>
                  <Input placeholder={placeholders[0]} />
                </Form.Item>
              </Col>
              <Col {...colRightProps}>
                <Form.Item>
                  <Tag style={{ marginRight: 0 }}>{wordIndexes[0]}</Tag>
                </Form.Item>
              </Col>
            </Row>
            <Row {...rowProps}>
              <Col {...colLeftProps}>
                <Form.Item name="clue_1" rules={rules}>
                  <Input placeholder={placeholders[1]} />
                </Form.Item>
              </Col>
              <Col {...colRightProps}>
                <Form.Item>
                  <Tag style={{ marginRight: 0 }}>{wordIndexes[1]}</Tag>
                </Form.Item>
              </Col>
            </Row>
            <Row {...rowProps}>
              <Col {...colLeftProps}>
                <Form.Item name="clue_2" rules={rules}>
                  <Input placeholder={placeholders[2]} />
                </Form.Item>
              </Col>
              <Col {...colRightProps}>
                <Form.Item>
                  <Tag style={{ marginRight: 0 }}>{wordIndexes[2]}</Tag>
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}
        {!visible && (
          <div>
            <Skeleton title={false} paragraph={{ rows: 4, width: '100%' }} />
            <div>Are you sure the coast is clear?</div>
          </div>
        )}
      </Card>
    </Form>
  );
};

export default GameTurnBlockActiveEncryptor;
