import React from 'react';
import { navigate } from 'hookrouter';

import { Avatar, Button, Tag, Tooltip } from 'antd';
import {
  LoadingOutlined,
  // LogoutOutlined,
  LoginOutlined,
  WarningOutlined,
  UserOutlined,
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
          <Button type="dashed" onClick={() => navigate('/auth')}>
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
    const userIcon = user.photoURL ? (
      <Avatar src={user.photoURL} />
    ) : (
      <Avatar icon={<UserOutlined />} />
    );
    const userName = user.displayName || user.email || `User: ${user.uid}`;
    return (
      <div className="UserAuthAvatar LoggedIn">
        <Button
          type="dashed"
          shape="round"
          onClick={() => navigate('/account')}
        >
          &nbsp;
          {userName}
        </Button>
        {userIcon}
      </div>
    );
  }
  return (
    <div className="UserAuthAvatar LogIn">
      <Button
        icon={<LoginOutlined />}
        type="primary"
        shape="round"
        onClick={() => navigate('/auth')}
      >
        Log in
      </Button>
    </div>
  );
};

export default UserAuthAvatar;
