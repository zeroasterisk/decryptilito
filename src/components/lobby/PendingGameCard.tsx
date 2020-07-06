import React from 'react';
import { Button, Card, Tag, Typography } from 'antd';

import { PendingGameData } from '../../logic/pendingGameData';
import PendingGameUserLists from './PendingGameUserLists';
import PendingGameAdminMenu from './PendingGameAdminMenu';

const { Text } = Typography;

// TODO consider allowing changing the shortCode

// load a pendingGame Card
interface PendingGameCardProps {
  user: firebase.User;
  pendingGame: PendingGameData;
}
const PendingGameCard: React.FC<PendingGameCardProps> = ({
  user,
  pendingGame,
}) => {
  return (
    <div>
      <Card title="Game getting ready...">
        <p>
          Invite other agents to join &nbsp;
          <big>
            <Text code>
              <Text copyable>{pendingGame.shortCode}</Text>
            </Text>
          </big>
        </p>
        <PendingGameUserLists user={user} pendingGame={pendingGame} />
        <p>TODO status: pending, ready --> action button</p>
        <Button>todo</Button>

        <hr />
        <PendingGameAdminMenu user={user} pendingGame={pendingGame} />
      </Card>
    </div>
  );
};

export default PendingGameCard;
