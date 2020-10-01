import * as functions from 'firebase-functions';

import cors from 'cors';

import { addWords, updateAllWords } from './word';
import { activateGames } from './game';

// initalize firebase connection, etc

const corsHandler = cors({ origin: true });

// helper to get the input values from query, body, message.json.
const getFromRequest = (request: any, field: string) => {
  if (request.query && typeof request.query[field] === 'string') {
    return request.query[field];
  }
  if (request.body && typeof request.body[field] === 'string') {
    return request.body[field];
  }
  if (request.json && typeof request.json[field] === 'string') {
    return request.json[field];
  }
  return null;
};

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

// TODO(alanblount): get words from database
// TODO(alanblount): get words not recently used by anyone
// TODO(alanblount): get words not recently used by people in this game
export const addWordsHttps = functions.https.onRequest(
  async (request, response) => {
    corsHandler(request, response, async () => {
      const text =
        getFromRequest(request, 'text') || getFromRequest(request, 'word');
      if (text && text.length > 2) {
        // support line break or ", " split words
        const textNice = text.trim().replace(/(\n|,\s+)/g, ',');
        console.log('Adding words:', textNice);
        const result = addWords(textNice);
        response.send(result);
      } else {
        console.log('No text on request', request);
        response.send('Nope... no words');
      }
    });
  },
);

export const addWordsPubSub = functions.pubsub
  .topic('add-words')
  .onPublish((message) => {
    // Get the `name` attribute of the PubSub message JSON body.
    const text =
      getFromRequest(message, 'text') || getFromRequest(message, 'word');
    if (text && text.length > 2) {
      // support line break or ", " split words
      const textNice = text.trim().replace(/(\n|,\s+)/g, ',');
      console.log('Adding words:', textNice);
      const result = addWords(textNice);
      console.log(result);
    } else {
      console.log('No text on request', message.json);
    }
  });

// export const getWords = functions.https.onRequest(
//   async (request, response) => {
//     corsHandler(request, response, async () => {
//       const result = await getWords(4);
//       response.send(result);
//     });
//   }
// );

export const activateGamesHttps = functions.https.onRequest(
  async (request, response) => {
    corsHandler(request, response, async () => {
      console.log('Activate Games (search for ENTRY games)');
      const result = await activateGames();
      response.send(result);
    });
  },
);

export const activateGamesPubSub = functions.pubsub
  .topic('activate-games')
  .onPublish(async (message) => {
    console.log('Activate Games (search for ENTRY games)');
    const result = await activateGames();
    console.log(result);
  });

export const updateAllWordsHttps = functions.https.onRequest(
  async (request, response) => {
    corsHandler(request, response, async () => {
      console.log(
        'Update all Words (review all words and cleanup details, rand refresh)',
      );
      const result = await updateAllWords();
      console.log(`Update all Words done [${result.length}]`);
      response.send(`Update all Words done [${result.length}]`);
    });
  },
);

export const updateAllWordsPubSub = functions.pubsub
  .topic('update-all-words')
  .onPublish(async (message) => {
    console.log(
      'Update all Words (review all words and cleanup details, rand refresh)',
    );
    const result = await updateAllWords();
    console.log(`Update all Words done [${result.length}]`);
  });
