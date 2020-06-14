import { TeamKey } from '../logic/enums';
import { UserData } from '../logic/userData';

const mockData = new UserData({
  uid: 'mockuser12345',
  displayName: 'jim joe bob',
  // TODO this should be a per-game.on-team
  myTeam: TeamKey.blackTeam,
});

export default mockData;
