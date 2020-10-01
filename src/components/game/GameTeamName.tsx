import React from 'react';

import { Col, Input, Row, Tooltip, Typography } from 'antd';

import { TeamData } from '../../logic/teamData';

import { teamName } from '../../logic/gameEngine';

import EditInModalInput, { onChangeType } from '../editables/EditInModalInput';

const { Title, Text } = Typography;
const InputGroup = Input.Group;

// TODO consider making this read only, with a Modal to edit
interface GameTeamNameProps {
  teamData: TeamData;
  editable: boolean;
  onChangeMemberNames: onChangeType;
  onChangeTeamName: onChangeType;
}
const GameTeamName: React.FC<GameTeamNameProps> = ({
  teamData,
  editable,
  onChangeMemberNames,
  onChangeTeamName,
}) => {
  if (!teamData) {
    return <Tooltip title="Unable to get Team Name">?</Tooltip>;
  }
  return (
    <div>
      <InputGroup size="large">
        <Row gutter={8}>
          <Col md={8} xs={24}>
            <Title level={2}>{teamName(teamData.teamColor)} team</Title>
          </Col>

          <Col md={8} xs={12}>
            <Text type="secondary">Team Name: </Text>
            <EditInModalInput
              onChange={onChangeTeamName}
              value={teamData.teamName}
              label="Team Name"
              placeholder="name of team"
            />
          </Col>
          <Col md={8} xs={12}>
            <Text type="secondary">Agents: </Text>
            <EditInModalInput
              onChange={onChangeMemberNames}
              value={teamData.teamMemberNames}
              label="Agents on the team"
              placeholder="name of individuals on the team"
            />
          </Col>
        </Row>
      </InputGroup>
    </div>
  );
};

export default GameTeamName;
