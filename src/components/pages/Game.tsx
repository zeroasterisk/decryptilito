/**
 * Show a single Game (get ready...)
 *
 * The idea here, is that a user is already in a game and the game is ready to go.
 *
 * This is a "loading" screen...
 *
 *
 */
import React from 'react';
import { classToPlain } from 'class-transformer';
import { navigate } from 'hookrouter';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import firebase from '../../firebase';

import { Card, PageHeader, Tag } from 'antd';

import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

import { userContext } from '../../user-context';

import GameNotFound from '../lobby/PendingGameNotFound';
import GameUI from '../game/GameUI';

// lookup the game, route to different renderings based on Game status
interface GameProps {
  id: string;
}
const Game: React.FC<GameProps> = ({ id }) => {
  return <div>Stub... TODO: build me</div>;
};

// placeholder ui while loading
interface GameLoadingProps {
  reason: string;
}
const GameLoading: React.FC<GameLoadingProps> = ({ reason }) => (
  <div>
    <PageHeader
      className="site-page-header"
      onBack={() => navigate('/lobby', true)}
      title="Loading..."
    />
    <Card title="Game getting ready..." loading={true}>
      <Card.Meta title="Pending Game" description="..." />
    </Card>
    <Tag>{reason}</Tag>
  </div>
);

// load a single Game by id (After search by shortCode returned the ID)
interface GameLoadDocProps {
  id: string;
}
const GameLoadDoc: React.FC<GameLoadDocProps> = ({ id }) => {
  const [value, loading, error] = useDocument(
    firebase.firestore().doc(`Games/${id}`),
    { snapshotListenOptions: { includeMetadataChanges: true } },
  );
  if (error) {
    console.error(error);
    return <GameNotFound />;
  }
  if (loading) {
    return <GameLoading reason="Loading Pending Game" />;
  }
  if (!(value && value.id)) {
    console.log('Did not return Games doc value', value, loading, error);
    return <GameNotFound />;
  }
  const gameData = value.data();
  if (!(gameData && gameData.shortCode)) {
    return <GameLoading reason="Loading Game, still don't have valid data" />;
  }
  gameData.id = id;
  // const game = new GameData(classToPlain(gameData));
  const game = new GameData(gameData);
  if (!(game && game.id)) {
    console.log('Unable to load GameData into Game class', gameData, id);
    return <GameNotFound />;
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/lobby', true)}
        title={`Game: ${gameData.shortCode}`}
        // TODO(alanblount): consider changing based on status
      />
      <userContext.Consumer>
        {({ user }) =>
          user ? (
            <GameUI game={game} user={user} />
          ) : (
            <GameLoading reason="Loading User Conext" />
          )
        }
      </userContext.Consumer>
    </div>
  );
};

// quick-fail if invalid id
interface GamePageProps {
  id: string;
}
const GamePage: React.FC<GamePageProps> = ({ id }) => {
  if (
    id &&
    id.length > 4 &&
    id.length < 20 &&
    id.match(/^[a-zA-Z0-9]{4,20}$/)
  ) {
    return <GameLoadDoc id={id} />;
  }
  return <GameNotFound />;
};

export default GamePage;
