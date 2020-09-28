/**
 * Game is here, it's loaded, but all the required details aren't in place yet (words, etc).
 *
 * Need the cloud function to run (should we ping it from the client?)
 *
 */
import React from 'react';

import './Game.css';

import { Card, Carousel, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import GameTeamName from './GameTeamName';

import { getMyTeam, getTeamData } from '../../logic/gameEngine';

import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

const { Title } = Typography;

const contentStyle = {
  height: '160px',
  color: '#333',
  background: '#ccc',
  textAlign: 'center' as const,
  padding: '1em',
};

type Funny = {
  title: string;
  sub: string;
};

const funnies = [
  {
    title: 'Secret words are being assigned',
    sub: 'Our top quartermaster is giving you top-notch words, right now.',
  },
  {
    title: 'You chief weapons are...',
    sub: 'Not "surprise"... "clever clues"',
  },
  {
    title: 'Less is more',
    sub: 'Reducing your clue may be a valid strategy... give away less.',
  },
  {
    title: 'Mission objectives being reviewed',
    sub: 'This is a joke, you are just playing a game.',
  },
  {
    title: 'Miscommunication will ruin us',
    sub: 'It only takes 2 miscommunications for our mission to be lost',
  },
  {
    title: 'Interception is crucial',
    sub:
      'If you can intercept the communications for the other team, twice, then you will acquire precious information.',
  },
  {
    title: 'The microfilm is in the potted plant',
    sub:
      'Um... we do not use microfilm anymore - but secret codes are still cool.',
  },
  {
    title: 'Loose lips',
    sub: 'might drool',
  },
];

// mutate, shuffle an array in place
const shuffle = (array: Funny[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

interface GameUIProps {
  // after fetching the game data...
  game: GameData;
  user: UserData;
}
const GameUIPending: React.FC<GameUIProps> = ({ game, user }) => {
  shuffle(funnies);
  return (
    <div className={`Game GamePending`}>
      <Card
        title={
          <span>
            <LoadingOutlined /> Preparing to launch game...{' '}
            <small>sit tight</small>
          </span>
        }
      >
        <Carousel autoplay>
          {funnies.map(({ title, sub }, i) => (
            <div key={`pane${i}`}>
              <div style={contentStyle}>
                <h3>{title}</h3>
                <p>{sub}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </Card>
    </div>
  );
};

export default GameUIPending;
