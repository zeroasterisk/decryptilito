import React from 'react';

import { Menu, PageHeader, Card } from 'antd';
import { A, usePath, useRoutes } from 'hookrouter';
import {
  BorderlessTableOutlined,
  FileWordOutlined,
  HourglassOutlined,
} from '@ant-design/icons';

import AdminWords from './AdminWords';

const routes = {
  '/words': () => <AdminWords />,
  '/pendingGames': () => <div>Sorry... stub</div>,
  '/games': () => <div>Sorry... stub</div>,
};

// hackery to get the menu tabs to like hooksrouter
const getSelectedRoute = (path: string) => {
  if (path === '/admin/words') return 'words';
  if (path === '/admin/pendingGames') return 'pendingGames';
  if (path === '/admin/games') return 'games';
  return 'overview';
};

const AdminMenu: React.FC = () => {
  return (
    <Menu selectedKeys={[getSelectedRoute(usePath())]} mode="horizontal">
      <Menu.Item key="overview">
        <A href="/admin">
          <BorderlessTableOutlined /> Admin
        </A>
      </Menu.Item>
      <Menu.Item key="words">
        <A href="/admin/words">
          <FileWordOutlined /> Words
        </A>
      </Menu.Item>
      <Menu.Item key="pendingGames">
        <A href="/admin/pendingGames">
          <HourglassOutlined /> PendingGames
        </A>
      </Menu.Item>
      <Menu.Item key="games">
        <A href="/admin/games">
          <HourglassOutlined /> Games
        </A>
      </Menu.Item>
    </Menu>
  );
};

const AdminOverview: React.FC = () => (
  <Card title="Admin Overview">
    Are you Alan? If not, what are you doing here?
  </Card>
);

const Admin: React.FC = () => {
  const routeResult = useRoutes(routes);

  return (
    <PageHeader title="Decryptilito Admin Page">
      <AdminMenu />
      {routeResult || <AdminOverview />}
    </PageHeader>
  );
};

export default Admin;
