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

import { Button, Col, Row, Tag, List } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';

import {
  PendingGameData,
  PendingGameUser,
  addUserToTeam,
} from '../../logic/pendingGameData';

import SpyIcon from '../icons/spy';

import firebase from '../../firebase';

import PendingGameUserItem from './PendingGameUserItem';
import PendingGameUserItemEditable from './PendingGameUserItemEditable';

// helper function, used to determine if a user is in a specific list
const isUserInList = (user: firebase.User, list: PendingGameUser[]) =>
  list.findIndex(({ id }: { id: string }) => id === user.uid) !== -1;

// used to update the name for the currently logged in use (injected into the funciton)
export type onChangeUserDisplayNameType = (name: string) => void;
// addUserToTeam and save in firebase
export type addUserToTeamAndUpdateType = (
  team: string,
  user: firebase.User,
  data: PendingGameData,
) => void;

// main ui, all 3 lists
interface PendingGameUserListsProps {
  user: firebase.User;
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
  const onChangeUserDisplayName: onChangeUserDisplayNameType = (newName) => {
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
          header="White Team"
          footer={
            isUserInList(user, pendingGame.whiteTeam) ? (
              <Tag icon={<SpyIcon />} color="#444">
                You are on the White Team
              </Tag>
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
          header="Black Team"
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
          header="Free Agents"
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
                Join the Black Team
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
