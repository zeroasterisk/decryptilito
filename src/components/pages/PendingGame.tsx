/**
 * Show a single PendingGame
 *
 * The idea here, is that a user should be able to join a pending game.
 *
 * if we knew the ID, we could load the document, like so:
 * console.log(`firebase.firestore().doc("PendingGames/${shortCode}")`);
 * but we don't know the ID, only the shortCode... so this is a specialized search...
 *
 */
import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { navigate } from 'hookrouter';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Button, Card, Form, Input, PageHeader, Tag, Result } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

// TODO get the pendinggame from firebase
// TODO PendingGameNotFound if not found
import PendingGameNotFound from '../lobby/PendingGameNotFound';

interface PendingGameProps {
  short_code: string;
}

const PendingGame: React.FC<PendingGameProps> = ({ short_code }) => {
  const [value, loading, error] = useCollection(
    // query to list
    firebase
      .firestore()
      .collection('PendingGames')
      .where('status', 'in', ['ENTRY', 'READY', 'LAUNCHING'])
      .where('shortCode', '==', short_code)
      .limit(1),
    // query options
    { snapshotListenOptions: { includeMetadataChanges: true } },
  );
  // console.log(value, loading, error, firebase.auth().currentUser.uid);
  if (error) {
    console.error(error);
    return <PendingGameNotFound />;
  }
  if (loading) {
    return (
      <div>
        <PageHeader
          className="site-page-header"
          onBack={() => navigate('/', true)}
          title="New Game"
        />
        <Card title="Game getting ready..." loading={true}>
          <Card.Meta title="Pending Game" description="..." />
        </Card>
      </div>
    );
  }
  if (!(value && value.size && value.size === 1)) {
    console.log('Did not return PendingGames count=1', value, loading, error);
    return <PendingGameNotFound />;
  }
  // we only care about the first, single PendingGames found with this short code.
  const pendingGameId = value.docs[0].id;
  const pendingGameData = value.docs[0].data();
  console.log({ id: pendingGameId, ...pendingGameData });
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/lobby', true)}
        title={`Preparing Game: ${pendingGameData.shortCode}`}
      />
      <Card title="Game getting ready...">
        <p>
          Invite other agents to join <Tag>{pendingGameData.shortCode}</Tag>
        </p>
        <p>TODO edit shortCode</p>
        <p>TODO join game if not already joined / edit name</p>
        <p>TODO list users, group by allocation</p>
        <p>TODO status: pending, ready --> action button</p>
        <Button>todo</Button>
      </Card>
    </div>
  );
};

// quick-fail if invalid short_code
const PendingGameSafeguard: React.FC<PendingGameProps> = ({ short_code }) => {
  if (
    short_code &&
    short_code.length > 4 &&
    short_code.length < 20 &&
    short_code.match(/^[a-zA-Z0-9]{4,20}$/)
  ) {
    return <PendingGame short_code={short_code} />;
  }
  return <PendingGameNotFound />;
};

export default PendingGameSafeguard;
