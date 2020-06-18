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
import { classToPlain } from 'class-transformer';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { navigate } from 'hookrouter';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
// import { useAuthState } from 'react-firebase-hooks/auth';
import { Card, PageHeader, Tag } from 'antd';

import {
  PendingGameData,
  pendingGameDataConverter,
  addUserToTeam,
  fnAddUserToTeam,
} from '../../logic/pendingGameData';

import { userContext } from '../../user-context';
import PendingGameNotFound from '../lobby/PendingGameNotFound';
import PendingGameCard from '../lobby/PendingGameCard';

// helper to update a pending game, saving up to firebase
export type fnUpdatePendingGame = (pendingGame: PendingGameData) => void;
const updatePendingGame: fnUpdatePendingGame = (
  pendingGame: PendingGameData,
) => {
  console.log('about to updatePendingGame', pendingGame);
  console.dir(pendingGame);
  firebase
    .firestore()
    .collection('PendingGames')
    .doc(pendingGame.id)
    .withConverter(pendingGameDataConverter)
    .set(pendingGame)
    .then(() => console.log('updated', pendingGame))
    .catch((error: any) => console.error('update failed', error, pendingGame));
};
export type fnAddUserToTeamAndUpdate = (
  team: string,
  user: firebase.User,
  data: PendingGameData,
) => void;
// functional version of addUserToTeamAndUpdate
export const addUserToTeamAndUpdate: fnAddUserToTeamAndUpdate = (
  team: string,
  user: firebase.User,
  data: PendingGameData,
) => {
  updatePendingGame(addUserToTeam(team, user, data));
};

// placeholder ui while loading
interface PendingGameLoadingProps {
  reason: string;
}
const PendingGameLoading: React.FC<PendingGameLoadingProps> = ({ reason }) => (
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

// search through a list of pending games by shortCode
interface PendingGameSearchByShortCodeProps {
  short_code: string;
}
const PendingGameSearchByShortCode: React.FC<PendingGameSearchByShortCodeProps> = ({
  short_code,
}) => {
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
  if (error) {
    console.error(error);
    return <PendingGameNotFound />;
  }
  if (loading) {
    return <PendingGameLoading reason="Searching by short_code" />;
  }
  if (!(value && value.size && value.size === 1)) {
    console.log('Did not return PendingGames count=1', value, loading, error);
    return <PendingGameNotFound />;
  }
  if (!(value.docs && value.docs[0] && value.docs[0].id)) {
    console.log('Did not return PendingGames docs[0]', value, loading, error);
    return <PendingGameNotFound />;
  }
  // we only care about the first, single PendingGames found with this short code.
  const id = value.docs[0].id;
  // console.log('found by shortCode', 'about to load by doc', `firebase.firestore().doc('PendingGames/${id}')`);
  return <PendingGameLoadDoc id={id} />;
};

// functionality
// const updateDocWithPendingGame = (user: firebase.User, doc: firebase.DocumentData, pendingGame: PendingGameData)  => {
//
// };
//
// // update the PendingGame to set the user in question, into the correct slot
// const updateDocSelfToUserList = (user: firebase.User, doc: firebase.DocumentData, userListDestination: string) => {
//   // doc.set()
// };

// load a single PendingGame by id (After search by shortCode returned the ID)
interface PendingGameLoadDocProps {
  id: string;
}
const PendingGameLoadDoc: React.FC<PendingGameLoadDocProps> = ({ id }) => {
  const [value, loading, error] = useDocument(
    firebase.firestore().doc(`PendingGames/${id}`),
    { snapshotListenOptions: { includeMetadataChanges: true } },
  );
  if (error) {
    console.error(error);
    return <PendingGameNotFound />;
  }
  if (loading) {
    return <PendingGameLoading reason="Loading Pending Game" />;
  }
  if (!(value && value.id)) {
    console.log('Did not return PendingGames doc value', value, loading, error);
    return <PendingGameNotFound />;
  }
  console.log('doc', value);
  const pendingGameData = value.data();
  if (!(pendingGameData && pendingGameData.shortCode)) {
    return <PendingGameLoading reason="Loading Pending Game x2" />;
  }
  pendingGameData.id = id;
  const pendingGame = new PendingGameData(classToPlain(pendingGameData));
  if (!(pendingGame && pendingGame.id)) {
    console.log(
      'Unable to load PendingGameData into PendingGame class',
      pendingGameData,
      id,
    );
    return <PendingGameNotFound />;
  }
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/lobby', true)}
        title={`Preparing Game: ${pendingGameData.shortCode}`}
      />
      <userContext.Consumer>
        {({ user }) =>
          user ? (
            <PendingGameCard
              pendingGame={pendingGame}
              user={user}
              updatePendingGame={updatePendingGame}
              addUserToTeamAndUpdate={addUserToTeamAndUpdate}
            />
          ) : (
            <PendingGameLoading reason="Loading User Conext" />
          )
        }
      </userContext.Consumer>
    </div>
  );
};

// quick-fail if invalid short_code
interface PendingGamePageProps {
  short_code: string;
}
const PendingGamePage: React.FC<PendingGamePageProps> = ({ short_code }) => {
  if (
    short_code &&
    short_code.length > 4 &&
    short_code.length < 20 &&
    short_code.match(/^[a-zA-Z0-9]{4,20}$/)
  ) {
    return <PendingGameSearchByShortCode short_code={short_code} />;
  }
  return <PendingGameNotFound />;
};

export default PendingGamePage;
