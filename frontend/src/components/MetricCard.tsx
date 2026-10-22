import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  trend,
  description,
  icon
}) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            {title}
          </span>
          {icon && (
            <div style={{ color: 'var(--color-blue)', opacity: 0.85 }}>
              {icon}
            </div>
          )}
        </div>

        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          {value}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
        {trend && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              fontWeight: 600,
              color: trend.isPositive ? 'var(--color-green)' : 'var(--color-red)'
            }}
          >
            {trend.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend.value}
          </span>
        )}

        {subValue && (
          <span style={{ color: 'var(--text-secondary)' }}>
            {subValue}
          </span>
        )}

        {description && !subValue && (
          <span style={{ color: 'var(--text-muted)' }}>
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
