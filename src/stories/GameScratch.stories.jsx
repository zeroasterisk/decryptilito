import React from 'react';

import { cloneDeep } from 'lodash';

import { TeamKey } from '../logic/gameData';

import mockGameData from '../mock/mockGameData';
import mockGameDataTurn4 from '../mock/mockGameDataTurn4';
import mockUserData from '../mock/mockUserData';

import GameScratch from '../components/game/GameScratch';

export default {
  title: 'GameScratch (on blackTeam)',
};

export const turn2encrypting = () => {
  return (
    <div style={{ maxWidth: 400 }}>
      <GameScratch
        showTeamClues={TeamKey.blackTeam}
        turn_number={2}
        user={mockUserData}
        game={mockGameData}
      />
    </div>
  );
};
turn2encrypting.story = {
  name: 'Showing black team clues, while encrypting',
};

export const turn2decrypting = () => {
  return (
    <div style={{ maxWidth: 400 }}>
      <GameScratch
        showTeamClues={TeamKey.whiteTeam}
        turn_number={2}
        user={mockUserData}
        game={mockGameData}
      />
    </div>
  );
};
turn2decrypting.story = {
  name: 'Showing black team clues, while decrypting',
};

export const turn4 = () => {
  return (
    <div style={{ maxWidth: 400 }}>
      <GameScratch
        showTeamClues={TeamKey.blackTeam}
        turn_number={4}
        user={mockUserData}
        game={mockGameDataTurn4}
      />
    </div>
  );
};
