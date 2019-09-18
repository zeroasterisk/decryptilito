import React from 'react';

import { Card, List } from 'antd';

import './Game.css';

import GameTeamName from './GameTeamName';
import GameTurnBlock from './GameTurnBlock';

import { getTeamData } from './gameEngine';

const Words: React.FC = props => {
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

// TODO make this dynamic
const GameTurnBlocks: React.FC = props => {
  return (
    <div>
      <GameTurnBlock turn_number={1} {...props} />
      <GameTurnBlock turn_number={2} {...props} />
      <GameTurnBlock turn_number={3} {...props} />
      <GameTurnBlock turn_number={4} {...props} />
    </div>
  );
};

const Game: React.FC = ({ game, user }: { game: GameData; user: UserData }) => {
  const teamData = getTeamData({ game, user });
  return (
    <div className={`Game ${teamData.teamColor}Team`}>
      <GameTeamName game={game} user={user} />
      <Words game={game} user={user} />
      <GameTurnBlocks game={game} user={user} />
      <h4>TODO: build this out</h4>
      <pre>
        - GameClues (unrevieled, editable, revieled) - OrderGuess (unrevieled,
        editable, revieled, scratch) - List "GameClue Logs"
      </pre>
    </div>
  );
};

export default Game;
