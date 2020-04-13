import { Button, Result } from 'antd';
import { navigate, usePath } from 'hookrouter';
import { HomeOutlined } from '@ant-design/icons';
import React from 'react';

const NotFoundPage: React.FC = () => {
  const path = usePath();
  return (
    <div>
      <Result
        status="404"
        title="Bad news chum... 404 Not Found"
        subTitle="Sorry, the page does not exist."
        extra={
          <div>
            <Button
              icon={<HomeOutlined />}
              type="primary"
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
            <p>
              <code>{path}</code>
            </p>
          </div>
        }
      />
    </div>
  );
};

export default NotFoundPage;
