import firebase from './index';

import {
  PendingGameData,
  pendingGameDataConverter,
} from '../logic/pendingGameData';

// helper to update a pending game, saving up to firebase
export type fnUpdatePendingGame = (pendingGame: PendingGameData) => void;
export const updatePendingGame: fnUpdatePendingGame = (
  pendingGame: PendingGameData,
) => {
  console.dir(pendingGame);
  firebase
    .firestore()
    .collection('PendingGames')
    .doc(pendingGame.id)
    .withConverter(pendingGameDataConverter)
    .set(pendingGame)
    // .then(() => console.log('updated', pendingGame))
    .catch((error: any) => console.error('update failed', error, pendingGame));
};
