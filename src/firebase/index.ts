import * as firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

export type { fnUpdatePendingGame } from './updateHelpers';
export { updatePendingGame } from './updateHelpers';

export default firebase;
