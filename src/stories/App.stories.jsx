import React from 'react';

// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

import App from '../components/app';
import { navigate } from 'hookrouter';

import mockGameData from '../mock/mockGameData';
import mockUserData from '../mock/mockUserData';

export default {
  title: 'App',
};

export const basic = () => {
  navigate('/', true);
  return <App user={mockUserData} game={mockGameData} />;
};

export const about = () => {
  navigate('/about', true);
  return <App user={mockUserData} game={mockGameData} />;
};

export const auth = () => {
  navigate('/auth', true);
  return <App user={mockUserData} game={mockGameData} />;
};

export const lobby = () => {
  navigate('/lobby', true);
  return <App user={mockUserData} game={mockGameData} />;
};

export const gameEntry = () => {
  navigate('/game/mock_game_1', true);
  return <App user={mockUserData} game={mockGameData} />;
};

gameEntry.story = {
  name: 'game entry',
};

export const gamePlay = () => {
  navigate('/game/mock_game_1/mock_team_1', true);
  return <App user={mockUserData} game={mockGameData} />;
};

gamePlay.story = {
  name: 'game play',
};

export const notFound404 = () => {
  navigate('/404', true);
  return <App user={mockUserData} game={mockGameData} />;
};

notFound404.story = {
  name: 'not found 404',
};
