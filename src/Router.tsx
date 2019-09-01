import React from 'react';
import {useRoutes} from 'hookrouter';

import Home from './Home';
import About from './About';
import Lobby from './Lobby';
import GameEntry from './GameEntry';
import Game from './Game';
//import MustLogin from './MustLogin';
import NotFoundPage from './NotFoundPage';

const routes = {
    '/': () => <Home />,
    '/about': () => <About />,
    '/lobby': () => <Lobby />,
    '/game/:game_id': ({game_id}: {game_id: string}) => <GameEntry game_id={game_id} />,
    '/game/:game_id/:team_id': ({game_id, team_id}: {game_id: string, team_id: string}) => <Game game_id={game_id} team_id={team_id} />,
    // gotcha - storybook routes to this url :/
    '/iframe.html': () => <Home />,
};

const Router: React.FC = () => {
    const routeResult = useRoutes(routes);
    console.log('Router', routeResult, routes);

    return routeResult || <NotFoundPage />;
};

export default Router;

