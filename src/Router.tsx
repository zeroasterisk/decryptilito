import { HookRouter, useRoutes } from 'hookrouter';
import React from 'react';

import About from './About';
import GameLoader from './GameLoader';
import GameEntry from './GameEntry';
import Home from './Home';
import Lobby from './Lobby';
// import MustLogin from './MustLogin';
import NotFoundPage from './NotFoundPage';

const routes = {
  '/': () => <Home />,
  '/about*': () => <About />,
  '/game/:game_id': ({ game_id }: HookRouter.QueryParams) => (
    <GameEntry game_id={game_id} />
  ),
  '/game/:game_id/:team_id': ({ game_id, team_id }: HookRouter.QueryParams) => (
    <GameLoader game_id={game_id} team_id={team_id} />
  ),
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
