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
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { navigate } from 'hookrouter';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Alert, Badge, Button, Card, List, Tag } from 'antd';
import {
  CheckCircleTwoTone,
  ClockCircleOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import {
  PendingGameDataInput,
  PendingGameData,
  PendingGameUser,
  fnAddUserToTeam,
} from '../../logic/pendingGameData';

import { fnAddUserToTeamAndUpdate } from '../pages/PendingGame';

// ui for each list

interface PendingGameUserListProps {
  user: firebase.User;
  users: PendingGameUser[];
  title: string;
  subtitle?: string;
  joinButton: React.ReactNode;
}

const PendingGameUserList: React.FC<PendingGameUserListProps> = ({
  title,
  subtitle,
  users,
  user,
  joinButton,
}) => {
  return (
    <List
      bordered
      dataSource={users}
      header={title}
      footer={joinButton}
      renderItem={(userInList) => (
        <List.Item>
          <Badge status={userInList.id === user.uid ? 'success' : 'default'} />
          <span>{userInList.name}</span>
        </List.Item>
      )}
    />
  );
};

// main ui, all 3 lists

interface PendingGameUserListsProps {
  user: firebase.User;
  pendingGame: PendingGameData;
  addUserToTeamAndUpdate: fnAddUserToTeamAndUpdate;
}

const PendingGameUserLists: React.FC<PendingGameUserListsProps> = ({
  user,
  pendingGame,
  addUserToTeamAndUpdate,
}) => {
  return (
    <div>
      <PendingGameUserList
        user={user}
        users={pendingGame.whiteTeam || []}
        title="White Team"
        joinButton={
          <Button
            onClick={() =>
              addUserToTeamAndUpdate('whiteTeam', user, pendingGame)
            }
          >
            Join
          </Button>
        }
      />
      <PendingGameUserList
        user={user}
        users={pendingGame.blackTeam || []}
        title="Black Team"
        joinButton={
          <Button
            onClick={() =>
              addUserToTeamAndUpdate('blackTeam', user, pendingGame)
            }
          >
            Join
          </Button>
        }
      />
      <PendingGameUserList
        user={user}
        users={pendingGame.freeAgents || []}
        title="Free Agents"
        subtitle="Will be assigned randomly to balance team numbers."
        joinButton={
          <Button
            onClick={() =>
              addUserToTeamAndUpdate('freeAgents', user, pendingGame)
            }
          >
            Wait for Assignment
          </Button>
        }
      />
    </div>
  );
};

export default PendingGameUserLists;
