import React from 'react';
import { PendingGameUser } from '../../logic/pendingGameData';
import PresenceBadge from '../app/PresenceBadge';

interface PendingGameUserItemProps {
  userInList: PendingGameUser;
}
const PendingGameUserItem: React.FC<PendingGameUserItemProps> = ({
  userInList,
}) => {
  return (
    <div>
      <span>
        <PresenceBadge uid={userInList.id} />
        <span>{userInList.name}</span>
      </span>
    </div>
  );
};

export default PendingGameUserItem;
