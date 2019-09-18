import { TeamKey } from '../gameData';
import { UserData } from '../userData';

const mockData = new UserData({
  id: 'mockuser12345',
  name: 'jim joe bob',
  myTeam: TeamKey.blackTeam,
});

export default mockData;
