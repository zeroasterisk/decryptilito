import React from 'react';
import Btn from '../btn';

const AboutOverview: React.FC = () => {
  return (
    <div className="wrap">
      <div className="content">
        <p>TL;DR: 2 teams, each with devices, can play Decrypto.</p>
        <p>
          Ready to go?
          <Btn href="/lobby" type="primary" size="large" icon="play-square">
            Play Now
          </Btn>
        </p>
      </div>
    </div>
  );
};

export default AboutOverview;
