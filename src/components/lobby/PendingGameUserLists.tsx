/**
 * A pending game has 3 sets of users
 * whiteTeam
 * blackTeam
 * freeAgents
 *
 * A user could be in any of those lists or in none.
 *
 * We need to be able to list all 3, with UI/UX to select one of them.
 *
 */

import React from 'react';

import { Button, Col, Row, Tag, List, Tooltip, Typography } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';

import {
  PendingGameData,
  PendingGameUser,
  addUserToTeam,
} from '../../logic/pendingGameData';
import { UserData } from '../../logic/userData';

import SpyIcon from '../icons/spy';

import PendingGameUserItem from './PendingGameUserItem';
import PendingGameUserItemEditable from './PendingGameUserItemEditable';
import PendingGameTeamNameEdit from './PendingGameTeamNameEdit';

const { Text } = Typography;

// helper function, used to determine if a user is in a specific list
const isUserInList = (user: UserData, list: PendingGameUser[]) =>
  list.findIndex(({ id }: { id: string }) => id === user.uid) !== -1;

// used to update the name for the currently logged in use (injected into the funciton)
export type onChangeNameType = (name: string) => void;
export type onChangeNameAndTeamType = (teamKey: string, name: string) => void;

// addUserToTeam and save in firebase
export type addUserToTeamAndUpdateType = (
  team: string,
  user: UserData,
  data: PendingGameData,
) => void;

// main ui, all 3 lists
interface PendingGameUserListsProps {
  user: UserData;
  pendingGame: PendingGameData;
}
const PendingGameUserLists: React.FC<PendingGameUserListsProps> = ({
  user,
  pendingGame,
}) => {
  const addUserToTeamAndUpdate: addUserToTeamAndUpdateType = (
    team,
    user,
    data,
  ) => {
    data = addUserToTeam(team, user, data);
    data.update();
  };
  const onChangeUserDisplayName: onChangeNameType = (newName) => {
    // update references to this user...
    const mutate = ({ id, name }: PendingGameUser) => {
      if (id === user.uid) return { id, name: newName };
      return { id, name };
    };
    pendingGame.whiteTeam = pendingGame.whiteTeam.map(mutate);
    pendingGame.blackTeam = pendingGame.blackTeam.map(mutate);
    pendingGame.freeAgents = pendingGame.freeAgents.map(mutate);
    pendingGame.update();
    // update the currentUser.displayName (for next time)
    user.updateProfile({ displayName: newName });
    return;
  };
  const onChangeTeamName: onChangeNameAndTeamType = (teamKey, newName) => {
    console.log('onChangeTeamName', teamKey, newName);
    // update the team name to the new string
    if (teamKey === 'whiteTeam') {
      pendingGame.whiteTeamName = newName;
    } else {
      pendingGame.blackTeamName = newName;
    }
    pendingGame.update();
    return;
  };

  // for each item in each list, simple render function.
  const renderItem = (userInList: PendingGameUser) => (
    <List.Item>
      {userInList.id === user.uid ? (
        <PendingGameUserItemEditable
          user={user}
          userInList={userInList}
          onChangeUserDisplayName={onChangeUserDisplayName}
        />
      ) : (
        <PendingGameUserItem userInList={userInList} />
      )}
    </List.Item>
  );
  return (
    <Row gutter={16}>
      <Col sm={24} md={12} lg={8} className="WHITETeam">
        <List
          bordered
          dataSource={pendingGame.whiteTeam || []}
          header={
            <div>
              <div>
                White Team{' '}
                <Tag color="#444">{pendingGame.whiteTeam.length}</Tag>
              </div>
              {isUserInList(user, pendingGame.whiteTeam) ? (
                <PendingGameTeamNameEdit
                  onChange={onChangeTeamName.bind(null, 'whiteTeam')}
                  value={pendingGame.whiteTeamName}
                />
              ) : (
                <Tooltip title="Team name">
                  <Text type="secondary">{pendingGame.whiteTeamName}</Text>
                </Tooltip>
              )}
            </div>
          }
          footer={
            isUserInList(user, pendingGame.whiteTeam) ? (
              <Tag icon={<SpyIcon />}>You are on the White Team</Tag>
            ) : (
              <Button
                icon={<UsergroupAddOutlined />}
                onClick={() =>
                  addUserToTeamAndUpdate('whiteTeam', user, pendingGame)
                }
              >
                Join the White Team
              </Button>
            )
          }
          renderItem={renderItem}
        />
      </Col>
      <Col sm={24} md={12} lg={8} className="BLACKTeam">
        <List
          bordered
          dataSource={pendingGame.blackTeam || []}
          header={
            <div>
              <div>
                Black Team{' '}
                <Tag color="#444">{pendingGame.blackTeam.length}</Tag>
              </div>
              {isUserInList(user, pendingGame.blackTeam) ? (
                <PendingGameTeamNameEdit
                  onChange={onChangeTeamName.bind(null, 'blackTeam')}
                  value={pendingGame.blackTeamName}
                />
              ) : (
                <Tooltip title="Team name">
                  <Text type="secondary" strong>
                    {pendingGame.blackTeamName}
                  </Text>
                </Tooltip>
              )}
            </div>
          }
          footer={
            isUserInList(user, pendingGame.blackTeam) ? (
              <Tag icon={<SpyIcon />} color="#444">
                You are on the Black Team
              </Tag>
            ) : (
              <Button
                icon={<UsergroupAddOutlined />}
                onClick={() =>
                  addUserToTeamAndUpdate('blackTeam', user, pendingGame)
                }
              >
                Join the Black Team
              </Button>
            )
          }
          renderItem={renderItem}
        />
      </Col>
      <Col sm={24} md={12} lg={8} className="FREEAGENTS">
        <List
          bordered
          dataSource={pendingGame.freeAgents || []}
          header={
            <span>
              Free Agents <Tag>{pendingGame.freeAgents.length}</Tag>
              <br />
              <Text type="secondary">Will be assigned to a team</Text>
            </span>
          }
          // subtitle="Will be assigned randomly to balance team numbers."
          footer={
            isUserInList(user, pendingGame.freeAgents) ? (
              <Tag>You are on a free agent</Tag>
            ) : (
              <Button
                icon={<UsergroupAddOutlined />}
                onClick={() =>
                  addUserToTeamAndUpdate('freeAgents', user, pendingGame)
                }
              >
                Become a Free Agent
              </Button>
            )
          }
          renderItem={renderItem}
        />
      </Col>
    </Row>
  );
};

export default PendingGameUserLists;
