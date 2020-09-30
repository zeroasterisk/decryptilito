import { HookRouter, useRoutes } from 'hookrouter';
import React from 'react';

import About from '../pages/About';
import Account from '../pages/Account';
import Admin from '../pages/Admin';
import Auth from '../pages/Auth';
import Game from '../pages/Game';
import Home from '../pages/Home';
import Lobby from '../pages/Lobby';
import NotFoundPage from '../pages/NotFoundPage';
import PendingGame from '../pages/PendingGame';

const routes = {
  '/': () => <Home />,
  '/about*': () => <About />,
  '/auth': () => <Auth />,
  '/account': () => <Account />,
  '/admin*': () => <Admin />,
  // pending game
  '/lobby': () => <Lobby />,
  '/join/:id': ({ id }: HookRouter.QueryParams) => (
    <PendingGame short_code={id} />
  ),
  // active game
  '/game/:id': ({ id }: HookRouter.QueryParams) => <Game id={id} />,
  // gotcha - storybook routes to this url :/
  '/iframe.html': () => <Home />,
};

const Router: React.FC = () => {
  const routeResult = useRoutes(routes);
  // console.log("Router", routeResult, routes);

  return routeResult || <NotFoundPage />;
};

export default Router;
