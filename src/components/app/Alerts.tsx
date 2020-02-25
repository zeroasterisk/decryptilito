import React from 'react';

interface AlertsProps {
  err: any; // TODO { code, message }
  clearError?: () => void; // function
}
const Alerts: React.FC<AlertsProps> = ({ err, clearError }) => {
  if (err) return <span>Has Err</span>;
  return <span>No Alerts</span>;
};

export default Alerts;
