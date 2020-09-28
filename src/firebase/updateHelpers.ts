import firebase from './index';

import { GameData, gameDataConverter } from '../logic/gameData';

import {
  PendingGameData,
  pendingGameDataConverter,
} from '../logic/pendingGameData';

// helper to update a pending game, saving up to firebase
export type updatePendingGameType = (pendingGame: PendingGameData) => void;
export const updatePendingGame: updatePendingGameType = (
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

// helper to update a game, saving up to firebase
export type updateGameType = (game: GameData) => void;
export const updateGame: updateGameType = (game: GameData) => {
  console.dir(game);
  firebase
    .firestore()
    .collection('Games')
    .doc(game.id)
    .withConverter(gameDataConverter)
    .set(game)
    // .then(() => console.log('updated', game))
    .catch((error: any) => console.error('update failed', error, game));
};

// helper to update a firebase auth currentUser profile, saving up to firebase
export interface UserProfileInput {
  displayName?: string;
}
export type updateUserProfileType = (profile: UserProfileInput) => void;
export const updateUserProfile: updateUserProfileType = (
  profile: UserProfileInput,
) => {
  console.dir(profile);
  const auth = firebase.auth();
  if (!auth)
    throw new Error('Unable to updateUserProfileType, no auth() object');
  const currentUser = auth.currentUser;
  if (!currentUser)
    throw new Error('Unable to updateUserProfileType, no currentUser() object');
  currentUser
    .updateProfile(profile)
    .catch((error: any) => console.error('update failed', error, profile));
};
