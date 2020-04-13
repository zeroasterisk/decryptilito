import React from 'react';

import { navigate } from 'hookrouter';

import { Avatar, Card, Col, PageHeader, Result, Row } from 'antd';
import {
  // LoadingOutlined,
  LogoutOutlined,
  LoginOutlined,
  // WarningOutlined,
  UserOutlined,
} from '@ant-design/icons';

import Btn from '../btn';

import { useSession, signOut } from '../../auth';

// Auth if authenticated
// Auth if anon

interface AccountProps {
  user?: firebase.User;
}

const Anon: React.FC = () => {
  return (
    <div>
      <Result
        status="403"
        title="You are not yet logged in"
        subTitle="sign in please"
        extra={
          <div>
            <Btn href="/auth" type="primary" icon={<LoginOutlined />}>
              Get Signed In
            </Btn>
          </div>
        }
      />
    </div>
  );
};

const Account: React.FC<AccountProps> = () => {
  const user = useSession();
  if (!user) return <Anon />;
  const userIcon = user.photoURL ? (
    <Avatar src={user.photoURL} />
  ) : (
    <Avatar icon={<UserOutlined />} />
  );
  const userName = user.displayName || user.email || `User: ${user.uid}`;
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/lobby', true)}
        title="Account Detail"
        subTitle="Decryptilito details about your account"
      />
      <Row gutter={16}>
        <Col span={12}>
          <Card title={userName} extra={userIcon}>
            TODO: Details &amp; Stats
            <p>
              <Btn onClick={signOut} icon={<LogoutOutlined />}>
                Logout
              </Btn>
            </p>
          </Card>
        </Col>
        <Col span={12}>TODO: Stats</Col>
      </Row>
    </div>
  );
};

export default Account;
