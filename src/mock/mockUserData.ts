import { TeamKey } from '../logic/gameData';
import { UserData } from '../logic/userData';

const mockData = new UserData({
  id: 'mockuser12345',
  name: 'jim joe bob',
  myTeam: TeamKey.blackTeam,
});

export default mockData;
