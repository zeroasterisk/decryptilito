import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';

export type { updateGameType, updatePendingGameType } from './updateHelpers';
export {
  updateGame,
  updatePendingGame,
  updateUserProfile,
} from './updateHelpers';

export type { adminAddWordsType } from './admin';
export { adminAddWords } from './admin';

export default firebase;
