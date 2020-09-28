import React from 'react';
import { navigate } from 'hookrouter';
import { Button, Card, Typography } from 'antd';
import { SecurityScanOutlined } from '@ant-design/icons';

import { PendingGameStatus } from '../../logic/enums';
import {
  PendingGameData,
  whatElseIsNeededToLaunch,
  buildGame,
} from '../../logic/pendingGameData';
import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';
import PendingGameUserLists from './PendingGameUserLists';
import PendingGameAdminMenu from './PendingGameAdminMenu';

const { Text } = Typography;

// TODO consider allowing changing the shortCode

// launch a pending game --> game
export type launchPendingGameType = (data: PendingGameData) => void;
const launchPendingGame: launchPendingGameType = (data) => {
  // set pendingGame status to launching
  data.status = PendingGameStatus.LAUNCHING;
  data.update();
  // get the basics for a new game
  const gameData = new GameData(buildGame(data));
  gameData.update();
  // now redirect to the game...
  navigate(`/game/${gameData.id}`);
};

// load a pendingGame Card
interface PendingGameCardProps {
  user: UserData;
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
              onClick={() => launchPendingGame(pendingGame)}
            >
              Launch Game
            </Button>
          ) : (
            <Text type="warning">{nextStep}</Text>
          )
        }
      >
        <div>
          Invite other agents to join &nbsp;
          <big>
            <Text code>
              <Text copyable>{pendingGame.shortCode}</Text>
            </Text>
          </big>
        </div>
        <PendingGameUserLists user={user} pendingGame={pendingGame} />
        <hr />
        <PendingGameAdminMenu user={user} pendingGame={pendingGame} />
      </Card>
    </div>
  );
};

export default PendingGameCard;
