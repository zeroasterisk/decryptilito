import React from 'react';
import { navigate } from 'hookrouter';
import { Button } from 'antd';
import { PlaySquareOutlined } from '@ant-design/icons';

const AboutOverview: React.FC = () => {
  return (
    <div className="wrap">
      <div className="content">
        <p>TL;DR: 2 teams, each with devices, can play Decrypto.</p>
        <p>
          Ready to go?
          <Button
            onClick={() => navigate('/lobby')}
            type="primary"
            size="large"
            icon={<PlaySquareOutlined />}
          >
            Play Now
          </Button>
        </p>
      </div>
    </div>
  );
};

export default AboutOverview;
