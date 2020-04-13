import { HookRouter, useRoutes } from 'hookrouter';
import React from 'react';

import About from '../pages/About';
import GameLoader from '../pages/GameLoader';
import GameEntry from '../pages/GameEntry';
import Home from '../pages/Home';
import Lobby from '../pages/Lobby';
import Auth from '../pages/Auth';
import Account from '../pages/Account';
// import MustLogin from '../pages/MustLogin';
import NotFoundPage from '../pages/NotFoundPage';

const routes = {
  '/': () => <Home />,
  '/about*': () => <About />,
  '/game/:game_id': ({ game_id }: HookRouter.QueryParams) => (
    <GameEntry game_id={game_id} />
  ),
  '/game/:game_id/:team_id': ({ game_id, team_id }: HookRouter.QueryParams) => (
    <GameLoader game_id={game_id} team_id={team_id} />
  ),
  '/auth': () => <Auth />,
  '/account': () => <Account />,
  // gotcha - storybook routes to this url :/
  '/iframe.html': () => <Home />,
  '/lobby': () => <Lobby />,
};

const Router: React.FC = () => {
  const routeResult = useRoutes(routes);
  // console.log("Router", routeResult, routes);

  return routeResult || <NotFoundPage />;
};

export default Router;
