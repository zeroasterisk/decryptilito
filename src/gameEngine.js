
const teamName = (name) => {
  if (name === 'whiteTeam') return 'White Team';
  if (name === 'blackTeam') return 'Black Team';
  return '???? Team';
};
const teamOppositeName = (name) => {
  if (name === 'whiteTeam') return teamName('blackTeam');
  if (name === 'blackTeam') return teamName('whiteTeam');
  return '???? Team';
};

const getTeamData = (props) => {
  // TODO what team am I on
  const { team } = props.data;
  return props.data[team];
}
const getTurnData = (props, turn_number) => {
  // TODO what team am I on
  const { team } = props.data;
  const turns = props.data[team]["turns"];
  if (turns.length > (turn_number-1)) {
    return turns[(turn_number-1)];
  }
  // return default turn
  return {
    phase: "prompt",
    encryptorName:  "",
    clues: ["", "", ""],
    correctOrder: [],
    guessedOrderSelf: [],
    guessedOrderOpponent: [],
  };
};

export {
  teamName,
  teamOppositeName,
  getTeamData,
  getTurnData,
}
