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
    return <GameLoading reason="Loading Pending Game x2" />;
  }
  gameData.id = id;
  // TODO instead of forcing the firebase data into the PendingGameData class,
  //      should be able to rely on converter
  const game = new GameData(classToPlain(gameData));
  if (!(game && game.id)) {
    console.log('Unable to load GameData into Game class', gameData, id);
    return <GameNotFound />;
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/lobby', true)}
        title={`Preparing Game: ${gameData.shortCode}`}
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

export default Game;
