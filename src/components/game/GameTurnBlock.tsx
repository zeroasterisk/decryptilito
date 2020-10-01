/**
 * One of the most complex parts of the game, is what you can do on a turn.
 * This component has each state-of-turn identified and a variation of UI for it.
 */
import React from 'react';

import { Button, Card, Tag, Tooltip, Typography, message } from 'antd';
import {
  LoadingOutlined,
  LockOutlined,
  RightOutlined,
} from '@ant-design/icons';

import {
  GameClueEditClue,
  GameClueEditOpponentGuess,
  GameClueEditOwnGuess,
  GameClueHeader,
  GameClueReveiled,
  GameClueShowOnlyClue,
  GameClueUnreveiled,
} from './GameClue';

import TimeoutClock from '../timeout/TimeoutClock';

import { TeamKey, TurnStatus } from '../../logic/enums';
import { GameData } from '../../logic/gameData';
import { UserData } from '../../logic/userData';

import { teamName, teamOppositeName } from '../../logic/gameEngine';
import { getTurnData } from '../../logic/turnEngine';

const { Text } = Typography;

/**
 * The GameTurnBlocks is our main component.
 * It is really a status-router for the variations which are setup as their own sub-components.
 */
interface GameTurnBlockProps {
  game: GameData;
  turn_number: number;
  user: UserData;
  myTeam: TeamKey;
  showTeam: TeamKey;
}
const GameTurnBlock: React.FC<GameTurnBlockProps> = ({
  turn_number,
  game,
  user,
  myTeam,
  showTeam,
}) => {
  const props = { game, user, turn_number, myTeam, showTeam };
  const { activeTurnNumber } = game;
  if (turn_number < activeTurnNumber) {
    return <GameTurnBlockPast {...props} />;
  }
  if (turn_number > activeTurnNumber) {
    return <GameTurnBlockFuture {...props} />;
  }
  const turnData = getTurnData(game, turn_number);
  const status = turnData.status;
  if (status === TurnStatus.PREPARE) {
    return <GameTurnBlockActivePrepare {...props} />;
  }
  if (status === TurnStatus.ENCRYPT || status === TurnStatus.ENCRYPT_PARTIAL) {
    return <GameTurnBlockActiveEncryptor {...props} />;
  }
  if (
    status === TurnStatus.DECRYPT_WHITE_CLUES ||
    status === TurnStatus.DECRYPT_WHITE_CLUES_PARTIAL ||
    status === TurnStatus.DECRYPT_BLACK_CLUES ||
    status === TurnStatus.DECRYPT_BLACK_CLUES_PARTIAL
  ) {
    return <GameTurnBlockActiveDecryptors {...props} />;
  }
  // SCORING_WHITE = 'SCORING_WHITE',
  // SCORING_BLACK = 'SCORING_BLACK',
  // DONE = 'DONE',
  return <p>Error, unknown GameTurnBlock status {status}</p>;
};

// After a turn is over
const GameTurnBlockPast: React.FC<GameTurnBlockProps> = ({
  turn_number,
  game,
  user,
  myTeam,
  showTeam,
}) => {
  const turnData = getTurnData(game, turn_number);
  const turnTeamData = turnData[showTeam];
  const clueProps = {
    turnTeamData,
    showTeam,
  };
  return (
    <Card
      size="small"
      className={`GameTurnBlock GameTurnBlockPast`}
      style={{ maxWidth: 400 }}
    >
      <GameClueHeader showTeam={showTeam}>
        <div>
          #{turn_number}
          &nbsp;
          <Text disabled>encryptor: {turnTeamData.encryptor.name}</Text>
        </div>
      </GameClueHeader>
      <GameClueReveiled clue_number={1} {...clueProps} />
      <GameClueReveiled clue_number={2} {...clueProps} />
      <GameClueReveiled clue_number={3} {...clueProps} />
    </Card>
  );
};

const GameTurnBlockFuture: React.FC<GameTurnBlockProps> = ({
  turn_number,
  game,
  user,
  myTeam,
  showTeam,
}) => (
  <Card
    size="small"
    className={`GameTurnBlock GameTurnBlockFuture`}
    style={{ maxWidth: 400 }}
  >
    <GameClueHeader showTeam={showTeam}>
      <div>#{turn_number}</div>
    </GameClueHeader>
    <GameClueUnreveiled />
    <GameClueUnreveiled />
    <GameClueUnreveiled />
  </Card>
);

const GameTurnBlockActivePrepare: React.FC<GameTurnBlockProps> = ({
  turn_number,
  game,
  user,
  myTeam,
  showTeam,
}) => {
  const onChangeMarkReady = () => {
    game.turns[turn_number - 1][showTeam].encryptorReady = true;
    game.update();
    message.success('Marked as ready...');
  };
  const turnData = getTurnData(game, turn_number);
  const turnTeamData = turnData[showTeam];
  return (
    <Card
      size="small"
      title={
        <div>
          Encryption&nbsp;
          <WarningAvertYourEyes />
          <div>Encryptor: {turnTeamData.encryptor.name}</div>
        </div>
      }
      actions={[
        turnTeamData.encryptorReady ? (
          <Tooltip title="You are ready... waiting on other team">
            <Tag>
              Waiting on other team <LoadingOutlined />
            </Tag>
          </Tooltip>
        ) : (
          <Button key="ready" type="primary" onClick={onChangeMarkReady}>
            Show the Correct Order
            <RightOutlined />
          </Button>
        ),
      ]}
      loading
      className="PrepareEncryptor"
      style={{ maxWidth: 400 }}
    >
      ...
    </Card>
  );
};

const GameTurnBlockActiveEncryptor: React.FC<GameTurnBlockProps> = ({
  turn_number,
  game,
  user,
  myTeam,
  showTeam,
}) => {
  const turnData = getTurnData(game, turn_number);
  const turnTeamData = turnData[showTeam];
  const clueProps = {
    turnTeamData,
    showTeam,
  };
  return (
    <Card
      size="small"
      title={
        <div>
          Encryption&nbsp;
          <WarningAvertYourEyes />
          <br />
          Encryptor: {turnTeamData.encryptor.name}
        </div>
      }
      actions={[
        <Button key="hide" type="dashed">
          Hide Order
          <LockOutlined />
        </Button>,
        <Button key="submit" type="primary">
          Submit Clues
          <RightOutlined />
        </Button>,
      ]}
      style={{ maxWidth: 400 }}
    >
      <GameClueHeader showTeam={showTeam}>
        <div>
          #{turn_number}
          &nbsp;
          <Text disabled>(provide clues)</Text>
        </div>
      </GameClueHeader>
      <GameClueEditClue clue_number={1} {...clueProps} />
      <GameClueEditClue clue_number={2} {...clueProps} />
      <GameClueEditClue clue_number={3} {...clueProps} />
      {turnData.timeoutSecondsRemaining > 0 ? (
        <TimeoutClock
          timeoutSecondsRemaining={turnData.timeoutSecondsRemaining}
        />
      ) : (
        ''
      )}
    </Card>
  );
};

// my team has submitted clues, but the opposing team has not yet...
const GameTurnBlockActiveEncryptedWaiting: React.FC<GameTurnBlockProps> = ({
  turn_number,
  game,
  user,
  myTeam,
  showTeam,
}) => {
  const turnData = getTurnData(game, turn_number);
  const turnTeamData = turnData[showTeam];
  const clueProps = {
    turnTeamData,
    showTeam,
  };
  return (
    <Card
      size="small"
      title={
        <div>
          Encryption&nbsp;
          <WarningAvertYourEyes />
          <br />
          Encryptor: {turnTeamData.encryptor.name}
        </div>
      }
      actions={[
        // TODO consider allowing a team to go back and edit...?
        <Button key="waiting" type="dashed" disabled>
          Waiting on {teamOppositeName(showTeam)}
          <LoadingOutlined />
        </Button>,
      ]}
      style={{ maxWidth: 400 }}
    >
      <GameClueHeader showTeam={showTeam}>
        <div>
          #{turn_number}
          &nbsp;
          <Text disabled>(provide clues)</Text>
        </div>
      </GameClueHeader>
      <GameClueShowOnlyClue clue_number={1} {...clueProps} {...turnData} />
      <GameClueShowOnlyClue clue_number={2} {...clueProps} {...turnData} />
      <GameClueShowOnlyClue clue_number={3} {...clueProps} {...turnData} />
      {turnData.timeoutSecondsRemaining > 0 ? (
        <TimeoutClock
          timeoutSecondsRemaining={turnData.timeoutSecondsRemaining}
        />
      ) : (
        ''
      )}
    </Card>
  );
};

// guessing order (opponent's clues, or own clues)
const GameTurnBlockActiveDecryptors: React.FC<GameTurnBlockProps> = ({
  turn_number,
  game,
  user,
  // what team am I on (logged in user)
  myTeam,
  // which team clues are we showing?
  showTeam,
}: {
  turn_number: number;
  game: GameData;
  user: UserData;
  myTeam: TeamKey;
  showTeam: TeamKey;
}) => {
  const { debug } = game;
  // TODO should we allow rendering the other team intentionally?
  const turnData = getTurnData(game, turn_number);
  const isWhiteTeamClues =
    turnData.status === TurnStatus.DECRYPT_WHITE_CLUES ||
    turnData.status === TurnStatus.DECRYPT_WHITE_CLUES_PARTIAL;
  const cluesTeam = isWhiteTeamClues ? TeamKey.whiteTeam : TeamKey.blackTeam;
  // we always get clues for the cluesTeam
  const cluesTeamTurnData = turnData[cluesTeam]; // {{{}}}

  // logic to control UI
  const myTeamCluesAreShown = myTeam === cluesTeam;
  // has opponent guessed already?
  const opposingTeamHasGuessed = myTeamCluesAreShown
    ? cluesTeamTurnData.guessedOrderOpponentSubmitted
    : cluesTeamTurnData.guessedOrderSelfSubmitted;
  // have we guessed already?
  const ownTeamHasGuessed = myTeamCluesAreShown
    ? cluesTeamTurnData.guessedOrderSelfSubmitted
    : cluesTeamTurnData.guessedOrderOpponentSubmitted;
  // disable editing if guessing team has already submitted
  const disabled = ownTeamHasGuessed;
  // we always get decryptors for the guessingTeam (if same as clues team, omit encryptor)
  // TODO verify this always works
  // const decryptorNames = getDecryptorNames(game, turn_number, showTeam, myTeam);
  const decryptorNames = 'TODO GET NAMES';
  const clueProps = {
    showTeam,
    turnTeamData: cluesTeamTurnData,
    disabled,
  };
  return (
    <Card
      size="small"
      title={
        <div>
          {myTeamCluesAreShown ? (
            <div className="GuessingwnClues">
              <strong>{teamName(myTeam)} </strong>
              guessing our own Order.
              <br />
              Decryptors: {decryptorNames}
            </div>
          ) : (
            <div className="GuessingwnClues">
              <strong>{teamName(myTeam)} </strong>
              guessing
              <strong> {teamName(cluesTeam)} </strong>
              Order.
              <br />
              Decryptors: {decryptorNames}
            </div>
          )}
        </div>
      }
      actions={
        disabled
          ? [
              // TODO consider allowing a team to go back and edit...?
              <Button key="waiting" type="dashed" disabled>
                Waiting on {teamOppositeName(showTeam)}
                <LoadingOutlined />
              </Button>,
            ]
          : [
              <Button key="submit" type="primary">
                Submit Order Guesses
                <RightOutlined />
              </Button>,
            ]
      }
      style={{ maxWidth: 400 }}
    >
      <GameClueHeader showTeam={showTeam}>
        <div>
          #{turn_number}
          &nbsp;
          <Text disabled>
            Encryptor:{' '}
            {cluesTeamTurnData.encryptor && cluesTeamTurnData.encryptor.name}
          </Text>
        </div>
      </GameClueHeader>
      {myTeamCluesAreShown ? (
        <div>
          <GameClueEditOwnGuess clue_number={1} {...clueProps} />
          <GameClueEditOwnGuess clue_number={2} {...clueProps} />
          <GameClueEditOwnGuess clue_number={3} {...clueProps} />
        </div>
      ) : (
        <div>
          <GameClueEditOpponentGuess clue_number={1} {...clueProps} />
          <GameClueEditOpponentGuess clue_number={2} {...clueProps} />
          <GameClueEditOpponentGuess clue_number={3} {...clueProps} />
        </div>
      )}
      {opposingTeamHasGuessed ? (
        <div>
          <Text disabled>
            <LoadingOutlined />
            The {teamOppositeName(myTeam)} is ready.
          </Text>
        </div>
      ) : (
        ''
      )}
      {debug ? (
        <div className="debug">
          <small>
            <Text disabled>
              myTeam: {myTeam}
              <br />
              cluesTeam: {cluesTeam}
              <br />
              {myTeamCluesAreShown ? "my team's clues" : "opponent's clues"}
              <br />
              {opposingTeamHasGuessed
                ? 'opponent has guessed, waiting on me'
                : ''}
              <br />
              {ownTeamHasGuessed ? 'we have guessed, waiting on opponent' : ''}
              <br />
              {disabled ? 'inputs disabled' : ''}
              <br />
            </Text>
          </small>
        </div>
      ) : (
        ''
      )}
    </Card>
  );
};

const WarningAvertYourEyes: React.FC = () => (
  <Text type="warning" strong>
    (rest of team avert eyes)
    <LockOutlined />
  </Text>
);

export default GameTurnBlock;

export {
  GameTurnBlock,
  GameTurnBlockActivePrepare,
  GameTurnBlockActiveEncryptor,
  GameTurnBlockActiveEncryptedWaiting,
  GameTurnBlockActiveDecryptors,
  GameTurnBlockPast,
  GameTurnBlockFuture,
};
