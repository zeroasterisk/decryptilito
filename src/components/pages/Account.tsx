import React from 'react';
import { navigate } from 'hookrouter';

import {
  Avatar,
  Button,
  Card,
  Col,
  PageHeader,
  Result,
  Row,
  Popconfirm,
} from 'antd';
import {
  // LoadingOutlined,
  LogoutOutlined,
  LoginOutlined,
  // WarningOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { useSession, signOut } from '../../auth';

import { UserData } from '../../logic/userData';

// Auth if authenticated
// Auth if anon

interface AccountProps {
  user?: UserData;
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
            <Button
              onClick={() => navigate('/auth')}
              type="primary"
              icon={<LoginOutlined />}
            >
              Get Signed In
            </Button>
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
              <Popconfirm
                title="Are you sure you want to logout?"
                onConfirm={() => {
                  signOut();
                  navigate('/auth');
                }}
                onCancel={() => null}
                okText="Yes, logout"
                cancelText="No"
              >
                <Button href="#" type="ghost" icon={<LogoutOutlined />}>
                  Logout
                </Button>
              </Popconfirm>
            </p>
          </Card>
        </Col>
        <Col span={12}>TODO: Stats</Col>
      </Row>
    </div>
  );
};

export default Account;
