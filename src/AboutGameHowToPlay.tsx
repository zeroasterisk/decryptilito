import { Avatar, List, Typography } from 'antd';
import React from 'react';
import aboutSteps from './about_steps';

const { Title } = Typography;

const HowToPlaySection: React.FC = ({
  steps,
  title,
}: {
  steps: [object];
  title: string;
}) => {
  return (
    <div className="wrap">
      <div className="content">
        <Title level={3}>{title}</Title>
        <List
          itemLayout="horizontal"
          dataSource={steps}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar {...item} />}
                title={item.title}
                description={item.desc}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

const HowToPlay: React.FC = () => {
  return (
    <div className="wrap">
      <div className="content">
        <HowToPlaySection title="Setup" steps={aboutSteps.setup} />
        <HowToPlaySection
          title="Join or Create a game in the Lobby"
          steps={aboutSteps.lobby}
        />
        <HowToPlaySection
          title="Gameplay: Encryptor (clue giver)"
          steps={aboutSteps.encryptor}
        />
        <HowToPlaySection
          title="Gameplay: Decryptors (clue guessers)"
          steps={aboutSteps.decryptors}
        />
        <HowToPlaySection
          title="Gameplay: Scoring / Winning"
          steps={aboutSteps.winning}
        />
      </div>
    </div>
  );
};

export default HowToPlay;
