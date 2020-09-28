import React from 'react';

import { Card, List, Tooltip } from 'antd';

import { TeamData } from '../../logic/teamData';

import { getTeamData } from '../../logic/gameEngine';

interface GameProps {
  teamData: TeamData;
}

const Words: React.FC<GameProps> = ({ teamData }) => {
  if (!(teamData && teamData.words)) {
    return <Tooltip title="No words">?</Tooltip>;
  }
  const words = teamData.words.map((word: string, i: number) => {
    return { index: i + 1, title: word };
  });
  return (
    <div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={words}
        renderItem={(item: { title: string }) => (
          <List.Item>
            <Card className="Word">{item.title}</Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Words;
