import React from 'react';

import { Button, Tag, Tooltip } from 'antd';
import {
  LoadingOutlined,
  LogoutOutlined,
  LoginOutlined,
  WarningOutlined,
} from '@ant-design/icons';

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
            <LoadingOutlined />
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
            <WarningOutlined />
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
          <LogoutOutlined />
          Log Out
        </Button>
      </div>
    );
  }
  return (
    <div className="UserAuthAvatar LogIn">
      <Button type="primary" onClick={login}>
        <LoginOutlined />
        Log in
      </Button>
    </div>
  );
};

export default UserAuthAvatar;
