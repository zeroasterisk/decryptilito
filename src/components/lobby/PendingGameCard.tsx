import React from 'react';
import { Button, Card, Typography } from 'antd';
import { SecurityScanOutlined } from '@ant-design/icons';

import {
  PendingGameData,
  whatElseIsNeededToLaunch,
} from '../../logic/pendingGameData';
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
  const nextStep = whatElseIsNeededToLaunch(pendingGame);
  return (
    <div>
      <Card
        title={nextStep === 'READY' ? 'The game is ready!' : 'Get Ready...'}
        extra={
          nextStep === 'READY' ? (
            <Button
              type="primary"
              shape="round"
              size="large"
              icon={<SecurityScanOutlined />}
            >
              Launch Game
            </Button>
          ) : (
            <Text type="warning">{nextStep}</Text>
          )
        }
      >
        <p>
          Invite other agents to join &nbsp;
          <big>
            <Text code>
              <Text copyable>{pendingGame.shortCode}</Text>
            </Text>
          </big>
        </p>
        <PendingGameUserLists user={user} pendingGame={pendingGame} />
        <hr />
        <PendingGameAdminMenu user={user} pendingGame={pendingGame} />
      </Card>
    </div>
  );
};

export default PendingGameCard;
