import React from "react";
import { Typography, List, Avatar } from "antd";
const { Title } = Typography;

const HowToPlaySection: React.FC = ({
  steps,
  title
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
  const steps_setup = [
    {
      title: "You need 2 teams",
      desc: "This is on you... each team should have 2+ people",
      icon: "usergroup-add"
    },
    {
      title: "You need 2+ devices",
      desc: "Each team needs their own device, laptop, etc. (more=ok)",
      icon: "laptop"
    },
    {
      title: "You need to communicate with your team",
      desc:
        "If your team is not in the same room, you need some way to collaborate with your team (IM, phone, whatever)",
      icon: "phone"
    }
  ];
  const steps_lobby = [
    {
      title: "TODO",
      desc: "TODO",
      icon: "loading"
    }
  ];
  const steps_encryptor = [
    {
      title: "TODO",
      desc: "TODO",
      icon: "loading"
    }
  ];
  const steps_decryptors = [
    {
      title: "TODO",
      desc: "TODO",
      icon: "loading"
    }
  ];
  const steps_winning = [
    {
      title: "TODO",
      desc: "TODO",
      icon: "loading"
    }
  ];
  return (
    <div className="wrap">
      <div className="content">
        <HowToPlaySection title="Setup" steps={steps_setup} />
        <HowToPlaySection
          title="Join or Create a game in the Lobby"
          steps={steps_lobby}
        />
        <HowToPlaySection
          title="Gameplay: Encryptor (clue giver)"
          steps={steps_encryptor}
        />
        <HowToPlaySection
          title="Gameplay: Decryptors (clue guessers)"
          steps={steps_decryptors}
        />
        <HowToPlaySection
          title="Gameplay: Scoring / Winning"
          steps={steps_winning}
        />
      </div>
    </div>
  );
};

export default HowToPlay;
