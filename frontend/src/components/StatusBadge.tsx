import React from 'react';
import { TransactionStatus } from '../types';

interface StatusBadgeProps {
  status: TransactionStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let badgeClass = 'badge-neutral';
  let dotColor = 'var(--text-secondary)';

  switch (status) {
    case 'Legitimate':
      badgeClass = 'badge-legitimate';
      dotColor = 'var(--color-green)';
      break;
    case 'Suspicious':
      badgeClass = 'badge-suspicious';
      dotColor = 'var(--color-red)';
      break;
    case 'Under Review':
      badgeClass = 'badge-review';
      dotColor = 'var(--color-amber)';
      break;
  }

  return (
    <span 
      className={`badge ${badgeClass}`} 
      style={{ 
        fontSize: size === 'sm' ? '11px' : '12px',
        padding: size === 'sm' ? '2px 7px' : '4px 9px'
      }}
    >
      <span 
        style={{ 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          backgroundColor: dotColor,
          display: 'inline-block' 
        }} 
      />
      {status}
    </span>
  );
};
