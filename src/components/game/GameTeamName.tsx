import React from 'react';

import { Col, Input, Row, Tooltip, Typography } from 'antd';

import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

import { getTeamData, teamName } from '../../logic/gameEngine';

const { Title } = Typography;
const InputGroup = Input.Group;

// TODO consider making this read only, with a Modal to edit
interface GameTeamNameProps {
  game: GameData;
  user: UserData;
}
const GameTeamName: React.FC<GameTeamNameProps> = ({ game, user }) => {
  const teamData = getTeamData({ game, user });
  return (
    <div>
      <InputGroup size="large">
        <Row gutter={8}>
          <Col md={8} xs={24}>
            <Title level={2}>{teamName(teamData.teamColor)} team</Title>
          </Col>

          <Col md={8} xs={12}>
            <Tooltip title="Team Name...">
              <Input placeholder="name of team" value={teamData.teamName} />
            </Tooltip>
          </Col>
          <Col md={8} xs={12}>
            <Tooltip title="Team Member Names.  Separate with a comma: Adam, Alice, Ava...">
              <Input
                placeholder="names of people on team"
                value={teamData.teamMemberNames}
              />
            </Tooltip>
          </Col>
        </Row>
      </InputGroup>
    </div>
  );
};

export default GameTeamName;
