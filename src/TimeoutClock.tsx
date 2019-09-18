import React from 'react';

import { Progress, Tooltip } from 'antd';

const timeoutSeconds2Percent = (seconds: number) =>
  Math.floor((seconds / 30) * 100);
const timeoutPercent2Seconds = (percent: number) =>
  Math.min(30, Math.ceil((percent * 30) / 100));
const timeoutSeconds2Status = (seconds: number) => {
  if (seconds < 10) return 'exception';
  if (seconds > 20) return 'success';
  return 'normal';
};
const timeoutFormat = (percent?: number) =>
  percent ? `${timeoutPercent2Seconds(percent)} sec` : '';

type TimeoutClockProps = {
  timeoutSecondsRemaining: number;
};
const TimeoutClock: React.FC<TimeoutClockProps> = ({
  timeoutSecondsRemaining,
}) => {
  return (
    <div className="TimeoutClock">
      <Tooltip title={`Only ${timeoutSecondsRemaining} seconds left...`}>
        <Progress
          percent={timeoutSeconds2Percent(timeoutSecondsRemaining)}
          status={timeoutSeconds2Status(timeoutSecondsRemaining)}
          format={timeoutFormat}
        />
      </Tooltip>
    </div>
  );
};

export default TimeoutClock;
