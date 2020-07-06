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
