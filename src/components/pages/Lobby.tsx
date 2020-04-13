import React from 'react';
import { navigate } from 'hookrouter';
import { Button, Card, PageHeader } from 'antd';
import { LoginOutlined } from '@ant-design/icons';

import { useSession } from '../../auth';

// Lobby if authenticated
// Lobby if anon

interface LobbyProps {
  user?: firebase.User;
}

const LobbyAuthenticated: React.FC<LobbyProps> = ({ user }) => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/', true)}
        title="Lobby"
        subTitle="Active Games"
      />
      <Card title="You are not logged in">
        <p>TODO: list of open games</p>
        <p>TODO: create a game</p>
      </Card>
    </div>
  );
};
/*
const LobbyGuest: React.FC<LobbyProps> = () => {
  return (
    <div>
      <h1>Lobby <small>You are a Guest</small></h1>
      <p>TODO: list of open games</p>
      <p>TODO: create a game</p>
    </div>
  );
};
*/

const LobbyAnon: React.FC<LobbyProps> = () => {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/', true)}
        title="Lobby"
        subTitle="Active Games"
      />
      <Card title="You are not logged in">
        <p>You must first login or put in a guest name.</p>
        <p>
          <Button
            icon={<LoginOutlined />}
            type="primary"
            shape="round"
            onClick={() => navigate('/auth')}
          >
            Login
          </Button>
          and then come back.
        </p>
      </Card>
    </div>
  );
};
const Lobby: React.FC<LobbyProps> = () => {
  const user = useSession();
  if (!user) return <LobbyAnon />;
  return <LobbyAuthenticated user={user} />;
};

export default Lobby;
