/**
 * Bundled up firebase admin package,
 * as a singleton, so we only initializeApp one time.
 *
 * TODO determin mockability
 */
import * as admin from 'firebase-admin';

admin.initializeApp();

export default admin;
