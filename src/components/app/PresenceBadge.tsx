/**
 * A quick and easy status for a user (connected/offline)
 */

import React from 'react';

import { Badge, Tooltip } from 'antd';
import { UserData } from '../../logic/userData';
//
// TODO make this a fancy presence badge
interface PresenceBadgeProps {
  user?: UserData;
  uid?: string;
}
const PresenceBadge: React.FC<PresenceBadgeProps> = ({ user, uid }) => {
  const userId = uid || (user && user.uid);
  if (!userId) {
    return (
      <Tooltip title="Error: no user record to lookup">
        <Badge status="error" />
      </Tooltip>
    );
  }
  const isOnline = true; // TODO https://firebase.google.com/docs/firestore/solutions/presence
  if (isOnline) {
    return (
      <Tooltip title="Connected">
        <Badge status="success" />
      </Tooltip>
    );
  }
  return (
    <Tooltip title="Offline">
      <Badge status="default" />
    </Tooltip>
  );
};

export default PresenceBadge;
