const teamName = name => {
  if (name === 'whiteTeam') return 'White Team';
  if (name === 'blackTeam') return 'Black Team';
  return '???? Team';
};
const teamOppositeName = name => {
  if (name === 'whiteTeam') return teamName('blackTeam');
  if (name === 'blackTeam') return teamName('whiteTeam');
  return '???? Team';
};

const getTeamData = props => {
  // TODO what team am I on
  const { team } = props;
  return props[team];
};
const getTurnData = (props, turn_number) => {
  // TODO what team am I on
  const { team } = props;
  const turns = props[team].turns;
  if (turns.length > turn_number - 1) {
    return turns[turn_number - 1];
  }
  // return default turn
  return {
    phase: 'prompt',
    encryptorName: getNextEncryptor(props),
    clues: ['', '', ''],
    correctOrder: getRandomOrder(),
    guessedOrderSelf: [],
    guessedOrderOpponent: [],
  };
};

const getRandomOrder = () => {
  const order = [];
  while (order.length < 3) {
    const index = Math.floor(Math.random() * 4);
    if (index >= 1 && !order.includes(index)) {
      order.push(index);
    }
  }
  return order;
};

// TODO make this more rhobust
const getNextEncryptor = props => {
  const { team } = props;
  const teamMemberNames = props[team].teamMembers.map(({ name }) => name);
  const turnNameFreqCount = props[team].turns.reduce((acc, turn) => {
    if (acc[turn.encryptorName]) {
      acc[turn.encryptorName] = 1;
    } else {
      acc[turn.encryptorName] += 1;
    }
    return acc;
  }, {});
  // first, if any name is not in turnNameFreqCount, lets do that
  const missingMemberNames = teamMemberNames.filter(
    x => !Object.keys(turnNameFreqCount).includes(x),
  );
  if (missingMemberNames.length > 0) {
    return missingMemberNames.pop();
  }
  // finally, return the least found name
  return Object.keys(turnNameFreqCount)
    .sort((a, b) => {
      return turnNameFreqCount[a] - turnNameFreqCount[b];
    })
    .shift();
};

export { teamName, teamOppositeName, getTeamData, getTurnData, getRandomOrder };
