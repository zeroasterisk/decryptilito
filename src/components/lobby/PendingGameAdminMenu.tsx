import React from 'react';
import { Button, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { UserData } from '../../logic/userData';
import { PendingGameData, PendingGameUser } from '../../logic/pendingGameData';
import { PendingGameStatus } from '../../logic/enums';

export type basicFunctionType = () => void;

// ADMIN only functionality for a pending game
interface PendingGameAdminMenuProps {
  user: UserData;
  pendingGame: PendingGameData;
}
const PendingGameAdminMenu: React.FC<PendingGameAdminMenuProps> = ({
  user,
  pendingGame,
}) => {
  // reset the game to only self being allowed
  // reset the game to only self being allowed
  const resetToOnlySelf: basicFunctionType = () => {
    const onlySelf = ({ id, name }: PendingGameUser) => {
      return id === user.uid;
    };
    pendingGame.whiteTeam = pendingGame.whiteTeam.filter(onlySelf);
    pendingGame.blackTeam = pendingGame.blackTeam.filter(onlySelf);
    pendingGame.freeAgents = pendingGame.freeAgents.filter(onlySelf);
    pendingGame.status = PendingGameStatus.ENTRY;
    pendingGame.blackTeamName = '';
    pendingGame.whiteTeamName = '';
    pendingGame.update();
    return;
  };
  const resetToReady: basicFunctionType = () => {
    const onlySelf = ({ id, name }: PendingGameUser) => {
      return id === user.uid;
    };
    pendingGame.whiteTeam = pendingGame.whiteTeam.filter(onlySelf);
    pendingGame.blackTeam = pendingGame.blackTeam.filter(onlySelf);
    pendingGame.freeAgents = pendingGame.freeAgents.filter(onlySelf);
    pendingGame.freeAgents.push({ id: 'fake1', name: 'Fake One' });
    pendingGame.freeAgents.push({ id: 'fake2', name: 'Fake Two' });
    pendingGame.freeAgents.push({ id: 'fake3', name: 'Fake Three' });
    pendingGame.status = PendingGameStatus.ENTRY;
    pendingGame.blackTeamName = 'Go Black';
    pendingGame.whiteTeamName = 'Go White';
    pendingGame.update();
    return;
  };
  const menu = (
    <Menu>
      <Menu.Item>
        <Button onClick={resetToOnlySelf}>Reset to only self</Button>
      </Menu.Item>
      <Menu.Item>
        <Button onClick={resetToReady}>Reset to ready</Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu}>
      <Button>
        Admin <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default PendingGameAdminMenu;
