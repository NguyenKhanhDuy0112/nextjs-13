import React, { useState } from 'react';

interface AlertProps {
  type: 'error' | 'success' | 'info' | 'warning';
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const [visible, setVisible] = useState(true);

  const hideAlert = () => {
    setVisible(false);
  };

  const getAlertClass = () => {
    switch (type) {
      case 'error':
        return 'alert-error';
      case 'success':
        return 'alert-success';
      case 'info':
        return 'alert-info';
      case 'warning':
        return 'alert-warning';
      default:
        return '';
    }
  };

  return message ? (
    <div className={`alert ${getAlertClass()}`}>
      <p>{message}</p>
    </div>
  ) : null;
};

export default Alert;
