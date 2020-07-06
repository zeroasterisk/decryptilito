import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

export type { updateGameType, updatePendingGameType } from './updateHelpers';
export { updateGame, updatePendingGame } from './updateHelpers';

export default firebase;
