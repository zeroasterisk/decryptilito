import React from 'react';

import { Card, List } from 'antd';

import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

import { getTeamData } from '../../logic/gameEngine';

interface GameProps {
  // after fetching the game data...
  game: GameData;
  user: UserData;
}

const Words: React.FC<GameProps> = props => {
  const teamData = getTeamData(props);
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
