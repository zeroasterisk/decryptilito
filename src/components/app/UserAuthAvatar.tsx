import React from 'react';

import { Avatar, Button, Tag, Tooltip } from 'antd';
import {
  LoadingOutlined,
  LogoutOutlined,
  LoginOutlined,
  WarningOutlined,
  UserOutlined,
} from '@ant-design/icons';

import Btn from '../btn';

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
          <Btn type="dashed" href="/auth">
            <WarningOutlined />
            Not Authenticated
          </Btn>
        </Tooltip>
      </div>
    );
  }
  if (user) {
    // TODO style w/ user avatar data
    // TODO make button a ConfirmButton action (new component?)
    const userIcon = user.photoURL ? (
      <Avatar src={user.photoURL} />
    ) : (
      <Avatar icon={<UserOutlined />} />
    );
    const userName = user.displayName || user.email || `User: ${user.uid}`;
    return (
      <div className="UserAuthAvatar LoggedIn">
        <Btn icon={userIcon} type="dashed" shape="round" href="/account">
          &nbsp;
          {userName}
        </Btn>
      </div>
    );
  }
  return (
    <div className="UserAuthAvatar LogIn">
      <Btn type="primary" href="/auth">
        <LoginOutlined />
        Log in
      </Btn>
    </div>
  );
};

export default UserAuthAvatar;
