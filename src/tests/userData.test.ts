import { expect } from 'chai';
import { TeamKey } from '../logic/gameData';
import { UserData } from '../logic/userData';

describe('UserData', () => {
  const userDataInputBasic = {
    id: 'user12345678',
    name: 'jim joe bob',
    myTeam: TeamKey.blackTeam,
  };
  it('basic input data maintained', () => {
    const user = new UserData(userDataInputBasic);
    // console.log("in test");
    // console.log(user);
    expect(user.id).to.equal('user12345678');
    expect(user.name).to.equal('jim joe bob');
    expect(user.myTeam).to.equal(TeamKey.blackTeam);
    expect(user.errors).to.deep.equal([]);
  });
});
