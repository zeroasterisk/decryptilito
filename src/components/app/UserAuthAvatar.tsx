import React from 'react';

import { Button, Icon, Tag, Tooltip } from 'antd';

// smart component, can figure out if we have a user or not
type UserAuthAvatarProps = {
  user?: any; // firebase.User
  initialising: boolean;
  error?: any; // firebase.auth.Error
  login?: () => void; // function
  logout?: () => void; // function
};

const UserAuthAvatar: React.FC<UserAuthAvatarProps> = ({
  user,
  initialising,
  error,
  login,
  logout,
}) => {
  if (initialising) {
    return (
      <div className="UserAuthAvatar initialising">
        <Tooltip title="Connecting to our top-secret servers...">
          <Tag>
            <Icon type="loading" />
          </Tag>
        </Tooltip>
      </div>
    );
  }
  if (error) {
    return (
      <div className="UserAuthAvatar Error">
        <Tooltip title={error}>
          <Button type="dashed" onClick={login}>
            <Icon type="warning" />
            Not Authenticated
          </Button>
        </Tooltip>
      </div>
    );
  }
  if (user) {
    // TODO style w/ user avatar data
    // TODO make button a ConfirmButton action (new component?)
    return (
      <div className="UserAuthAvatar LoggedIn">
        <p>Current User: {user.name}</p>
        <Button type="dashed" onClick={logout}>
          <Icon type="logout" />
          Log Out
        </Button>
      </div>
    );
  }
  return (
    <div className="UserAuthAvatar LogIn">
      <Button type="primary" onClick={login}>
        <Icon type="login" />
        Log in
      </Button>
    </div>
  );
};

export default UserAuthAvatar;
