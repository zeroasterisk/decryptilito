import React from "react";
import {
  Icon,
  Card,
  Row,
  Col,
  PageHeader,
  Typography,
  Tooltip,
  List,
  Avatar,
  Skeleton
} from "antd";
import { InputNumber, Input } from "antd";
import "./Game.css";
import GameTurnBlock from "./GameTurnBlock";

import {
  teamName,
  teamOppositeName,
  getTeamData,
  getTurnData
} from "./gameEngine";

const { Title, Text } = Typography;
const InputGroup = Input.Group;

const Words: React.FC = props => {
  const teamData = getTeamData(props);
  const words = teamData.words.map((word, i) => {
    return { index: i + 1, title: word };
  });
  return (
    <div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={words}
        renderItem={item => (
          <List.Item>
            <Card className="Word">{item.title}</Card>
          </List.Item>
        )}
      />
    </div>
  );
};
const TeamName: React.FC = props => {
  const teamData = getTeamData(props);
  const { teamColor = "", teamName = "", teamMemberNames = "" } = teamData;
  return (
    <div>
      <InputGroup size="large">
        <Row gutter={8}>
          <Col span={8}>
            <Title level={2}>{teamColor} team</Title>
          </Col>
          <Col span={8}>
            <Input placeholder="name of team" value={teamName} />
          </Col>
          <Col span={8}>
            <Input
              placeholder="names of people on team"
              value={teamMemberNames}
            />
          </Col>
        </Row>
      </InputGroup>
    </div>
  );
};
const GameTurnBlocks: React.FC = props => {
  return (
    <div>
      <GameTurnBlock turn_number={1} {...props} />
      <GameTurnBlock turn_number={2} {...props} />
      <GameTurnBlock turn_number={3} {...props} />
      <GameTurnBlock turn_number={4} {...props} />
    </div>
  );
};

const Game: React.FC = props => {
  const teamData = getTeamData(props);
  const { teamColor } = teamData;
  return (
    <div className={`Game ${teamColor}Team`}>
      <TeamName {...props} />
      <Words {...props} />
      <GameTurnBlocks {...props} />
      <h4>TODO: build this out</h4>
      <pre>
        - GameClues (unrevieled, editable, revieled) - OrderGuess (unrevieled,
        editable, revieled, scratch) - List "GameClue Logs"
      </pre>
    </div>
  );
};

export default Game;
