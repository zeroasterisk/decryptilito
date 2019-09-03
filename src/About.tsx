import React from 'react';

import { Icon, Menu, PageHeader } from 'antd';
import { A, usePath, useRoutes } from 'hookrouter';

import AboutGameHowToPlay from './AboutGameHowToPlay';
import AboutOverview from './AboutOverview';
import AboutTech from './AboutTech';

const routes = {
  '/game': () => <AboutGameHowToPlay />,
  '/tech': () => <AboutTech />,
};

// hackery to get the menu tabs to like hooksrouter
const getSelectedRoute = path => {
  if (path === '/about/game') return 'game';
  if (path === '/about/tech') return 'tech';
  return 'overview';
};

const AboutMenu: React.FC = () => {
  return (
    <Menu selectedKeys={[getSelectedRoute(usePath())]} mode="horizontal">
      <Menu.Item key="overview">
        <A href="/about">
          <Icon type="loading" /> Overview
        </A>
      </Menu.Item>
      <Menu.Item key="game">
        <A href="/about/game">
          <Icon type="loading" /> Playing the Game
        </A>
      </Menu.Item>
      <Menu.Item key="tech">
        <A href="/about/tech">
          <Icon type="loading" /> About the Tech
        </A>
      </Menu.Item>
    </Menu>
  );
};

const About: React.FC = () => {
  const routeResult = useRoutes(routes);

  return (
    <PageHeader title="Decryptilito About Page">
      <AboutMenu />
      {routeResult || <AboutOverview />}
    </PageHeader>
  );
};

export default About;
