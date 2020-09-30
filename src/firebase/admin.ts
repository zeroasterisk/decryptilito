/**
 * Firebase admin functions
 *
 */
import firebase from './index';

// should add words to the list of global words available (if not already there)
// https://console.cloud.google.com/functions/details/us-central1/adminAddWords?project=decryptilito
export type adminAddWordsType = (words: string) => string;
export const adminAddWords = async (words: string) => {
  const addWords = await firebase.functions().httpsCallable('addWords');
  return addWords({ text: words })
    .then((result) => {
      // Read result of the Cloud Function.
      return result.data.text;
    })
    .catch((error) => {
      // Getting the Error details.
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.error(`adminAddWords ${code} ${message}`, details);
      return `Error: unable to addWords via function. ${message}`;
    });
};
