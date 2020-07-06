import { PendingGameStatus } from '../logic/enums';
import { PendingGameData } from '../logic/pendingGameData';

const mockPendingData = new PendingGameData({
  id: 'mockdata123',
  shortCode: '1qaz',
  status: PendingGameStatus.ENTRY,
  uids: ['uid1', 'uid2', 'uid3', 'uid4', 'uid5'],
  whiteTeamName: 'Go White',
  whiteTeam: [
    { id: 'uid1', name: 'display name 1' },
    { id: 'uid3', name: 'display name 3' },
  ],
  blackTeamName: 'Go Black',
  blackTeam: [
    { id: 'uid5', name: 'display name 5' },
    { id: 'uid2', name: 'display name 2' },
  ],
  freeAgents: [{ id: 'uid4', name: 'display name 4' }],
});

export default mockPendingData;
