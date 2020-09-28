import * as React from 'react';

import { UserData } from './logic/userData';

interface UserContext {
  initialising?: boolean;
  // user object from firebase
  fuser?: firebase.User;
  // class UserData version of user
  user?: UserData;
}

export const userContext = React.createContext<UserContext>({
  fuser: undefined,
  user: undefined,
  initialising: false,
});
