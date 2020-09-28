import React from 'react';
import { navigate } from 'hookrouter';
import { Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import { UserData } from '../../logic/userData';

interface PendingGameNotFoundProps {
  user?: UserData;
}

const PendingGameNotFound: React.FC<PendingGameNotFoundProps> = () => {
  return (
    <div>
      <Result
        status="404"
        title="No game for you!"
        subTitle="Sorry, the game code you entered is not available."
        extra={
          <div>
            <Button
              icon={<HomeOutlined />}
              type="primary"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
            <p>TODO or try again</p>
          </div>
        }
      />
    </div>
  );
};

export default PendingGameNotFound;
