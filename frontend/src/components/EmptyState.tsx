import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No records found",
  description = "No transactions match your current search and filter criteria.",
  actionText = "Reset filters",
  onAction
}) => {
  return (
    <div 
      style={{ 
        padding: '48px 24px', 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <div 
        style={{ 
          width: '44px', 
          height: '44px', 
          borderRadius: '50%', 
          backgroundColor: '#F1F3F6', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          marginBottom: '14px'
        }}
      >
        <SearchX size={22} />
      </div>

      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
        {title}
      </h3>
      
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '360px', marginBottom: onAction ? '16px' : 0 }}>
        {description}
      </p>

      {onAction && (
        <button onClick={onAction} className="btn btn-secondary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
