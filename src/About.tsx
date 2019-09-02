import React from 'react';
import { Menu, Icon, Row, Col, Typography, PageHeader } from 'antd';
import AboutGameHowToPlay from './AboutGameHowToPlay';
import AboutTech from './AboutTech';

import {useRoutes, A, usePath} from 'hookrouter';
const { Paragraph, Title } = Typography;

const routes = {
    '/game': () => <AboutGameHowToPlay />,
    '/tech': () => <AboutTech />,
};

const handleClick = (r) => {
  console.log(r);
};



const AboutMenu: React.FC = () => {
  // hackery to get the menu tabs to like hooksrouter
  const getSelectedRoute = () => {
    // const path = usePath();
    // if (path == '/about/game') return 'game';
    // if (path == '/about/tech') return 'tech';
    return 'overview';
  }
  return (
    <Menu onClick={handleClick} selectedKeys={[getSelectedRoute()]} mode="horizontal">
      <Menu.Item key="overview">
        <Icon type="loading" />
        Overview
      </Menu.Item>
      <Menu.Item key="game">
        <Icon type="loading" />
        Playing the Game
      </Menu.Item>
      <Menu.Item key="tech">
        <Icon type="loading" />
        About the Tech
      </Menu.Item>
    </Menu>
  );
};


const About: React.FC = () => {
  const routeResult = useRoutes(routes);

  return (
    <PageHeader title="Decryptilito About Page">
      <AboutMenu />
      {routeResult}
    </PageHeader>
  );
};

export default About;
