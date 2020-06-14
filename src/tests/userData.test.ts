import { expect } from 'chai';
import { TeamKey } from '../logic/enums';
import { UserData } from '../logic/userData';

describe('UserData', () => {
  const userDataInputBasic = {
    uid: 'user12345678',
    displayName: 'jim joe bob',
    myTeam: TeamKey.blackTeam,
  };
  it('basic input data maintained', () => {
    const user = new UserData(userDataInputBasic);
    // console.log("in test");
    // console.log(user);
    expect(user.uid).to.equal('user12345678');
    expect(user.displayName).to.equal('jim joe bob');
    expect(user.myTeam).to.equal(TeamKey.blackTeam);
    expect(user.errors).to.deep.equal([]);
  });
});
