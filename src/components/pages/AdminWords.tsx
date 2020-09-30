import React from 'react';
import { Card } from 'antd';

import AdminWordsAdd from './AdminWordsAdd';

const AdminWords: React.FC = () => {
  return (
    <Card title="Words Admin">
      <AdminWordsAdd />
      <p>TODO: List, Edit...</p>
    </Card>
  );
};

export default AdminWords;
