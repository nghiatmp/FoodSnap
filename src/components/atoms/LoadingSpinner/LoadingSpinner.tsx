import React from 'react';
import './LoadingSpinner.scss';

interface Props {
  fullScreen?: boolean;
  text?: string;
}

export const LoadingSpinner: React.FC<Props> = ({ fullScreen = false, text }) => {
  return (
    <div className={`spinner-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="spinner-circle" />
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );
};
