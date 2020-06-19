/**
 * List available pending games.
 * (NOTE we may not show this... instead using short-code-sharing)
 *
 * The idea here, is that a user should be able to see pending games.
 * Whereas an ANON user should not be able to see pending games,
 * and would have to enter a shortCode.
 *
 */

import React from 'react';

import { navigate } from 'hookrouter';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Alert, Badge, Button, Card, List, Tag } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import firebase from '../../firebase';

interface ListPendingGamesProps {
  user?: firebase.User;
}

const ListPendingGames: React.FC<ListPendingGamesProps> = () => {
  const [value, loading, error] = useCollection(
    // query to list
    firebase
      .firestore()
      .collection('PendingGames')
      .where('status', 'in', ['ENTRY', 'READY']),
    // query options
    { snapshotListenOptions: { includeMetadataChanges: true } },
  );
  if (error) {
    console.error(error);
  }

  return (
    <div>
      <Card
        title="Pending Games"
        extra="Logged in users only"
        loading={loading}
        actions={[
          <Button
            icon={<PlusCircleOutlined />}
            type="primary"
            shape="round"
            onClick={() => navigate('/start_game')}
          >
            Create a new Game
          </Button>,
        ]}
      >
        {error && <Alert {...error} type="error" showIcon />}
        {value && (
          <List
            loading={loading}
            bordered
            dataSource={value.docs.map((doc) => doc.data())}
            renderItem={(doc) => (
              <List.Item>
                <Button
                  block
                  type="link"
                  onClick={() => navigate(`/join/${doc.shortCode}`)}
                >
                  <Badge
                    status={doc.status === 'READY' ? 'success' : 'default'}
                    count={(doc.uids && doc.uids.length) || 0}
                  />
                  <span>{doc.shortCode.toLocaleUpperCase()}</span>
                  <Tag>{(doc.uids && doc.uids.length) || 0} agents</Tag>
                </Button>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};
// icon={doc.status === 'READY' ?
//   <CheckCircleTwoTone twoToneColor="#52c41a" /> :
//   <ClockCircleOutlined />}

export default ListPendingGames;
