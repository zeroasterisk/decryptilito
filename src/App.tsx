import React from 'react';

import 'antd/dist/antd.css';
import './App.css';

import Router from './Router';

import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

const App: React.FC = () => {
  return (
    <div className="App">
      <Layout>
        <Header>
          <img src="/logo-marching.jpg" className="App-logo" alt="logo" />
          <p className="Header-desc">
            Decryptalito - A variation on{' '}
            <a
              href="https://boardgamegeek.com/boardgame/225694/decrypto"
              rel="noopener"
            >
              Decrypto
            </a>
            , allowing web-based access and remote teams.
          </p>
        </Header>
        <Content>
          <Router />
        </Content>
        <Footer>
          <p className="Footer-desc">This is a fun project. Don't sue me.</p>
        </Footer>
      </Layout>
    </div>
  );
};

export default App;
