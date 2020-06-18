import React from 'react';
import { Button, Card, Form, Input, PageHeader, Tag, Result } from 'antd';
import { PendingGameData } from '../../logic/pendingGameData';
import PendingGameUserLists from './PendingGameUserLists';
import {
  fnUpdatePendingGame,
  fnAddUserToTeamAndUpdate,
} from '../pages/PendingGame';

// load a pendingGame Card
interface PendingGameCardProps {
  user: firebase.User;
  pendingGame: PendingGameData;
  updatePendingGame: fnUpdatePendingGame;
  addUserToTeamAndUpdate: fnAddUserToTeamAndUpdate;
}
const PendingGameCard: React.FC<PendingGameCardProps> = ({
  user,
  pendingGame,
  updatePendingGame,
  addUserToTeamAndUpdate,
}) => {
  return (
    <div>
      <Card title="Game getting ready...">
        <p>
          Invite other agents to join <Tag>{pendingGame.shortCode}</Tag>
        </p>
        <p>TODO edit shortCode</p>
        <p>TODO join game if not already joined / edit name</p>
        <p>TODO list users, group by allocation</p>
        <PendingGameUserLists
          user={user}
          pendingGame={pendingGame}
          addUserToTeamAndUpdate={addUserToTeamAndUpdate}
        />
        <p>TODO status: pending, ready --> action button</p>
        <Button>todo</Button>
      </Card>
    </div>
  );
};

export default PendingGameCard;
