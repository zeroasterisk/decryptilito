import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import debug from 'debug';

import 'antd/dist/antd.css';
import './App.css';

import Router from './Router';

import { Layout } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { useAuthState } from 'react-firebase-hooks/auth';
import { userContext } from '../../user-context';

import UserAuthAvatar from './UserAuthAvatar';

import firebaseConfig from '../../firebase';

const log = debug('app:App');

const { Header, Footer, Content } = Layout;

interface PrivateRouteProps {
  component: any;
  path?: string;
}

/*
const PrivateRoute = ({
  component: Component,
  path,
  ...other
}: PrivateRouteProps) => {
  const user = firebase.auth().currentUser;
  const [match, params] = useRoute(path);

  if (!user && params.rest) {
    return <Redirect to="login" />;
  }

  if (!user) {
    return null;
  }

  return <Component />;
}; */

function App() {
  console.log('firebase', firebase);
  const [user, initialising, error] = useAuthState(firebase.auth());
  // console.log('user', user, 'initialising', initialising, 'error', error);

  if (initialising) {
    return (
      <div
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '3rem',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <userContext.Provider
      value={{
        user: user,
        initialising,
      }}
    >
      <div className="App">
        {/*
          <Helmet titleTemplate="%s | Julienne" defaultTitle="Julienne" />
          {!user && <Route path="/" component={Branding} />}
          <Route path="/login" component={Login} />
          <PrivateRoute path="/:rest*" component={Main} />
          */}
        <Layout>
          <Header className="AppHeader">
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
            <UserAuthAvatar {...{ initialising, user, error }} />
          </Header>
          <Content>
            <Router />
          </Content>
          <Footer>
            <p className="Footer-desc">This is a fun project. Don't sue me.</p>
          </Footer>
        </Layout>
      </div>
    </userContext.Provider>
  );
}

export default App;
