import React from 'react';
import { X, ShieldAlert, CheckCircle2, Clock, MapPin, Tag, CreditCard } from 'lucide-react';
import { Transaction } from '../types';
import { StatusBadge } from './StatusBadge';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const isSuspicious = transaction.status === 'Suspicious';
  const riskColor = isSuspicious 
    ? 'var(--color-red)' 
    : transaction.status === 'Under Review' 
      ? 'var(--color-amber)' 
      : 'var(--color-green)';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {transaction.id}
              </span>
              <StatusBadge status={transaction.status} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Recorded on {transaction.date} at {transaction.time} UTC
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '4px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F3F6')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Amount & Risk Overview Banner */}
        <div 
          style={{ 
            backgroundColor: '#F8F9FA', 
            border: '1px solid var(--color-border)', 
            borderRadius: '6px', 
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              Transaction Amount
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
              QSVM Risk Score
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: riskColor }}>
              {(transaction.riskScore * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Risk meter bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            <span>Legitimate Margin</span>
            <span>Decision Boundary</span>
            <span>Fraud Threshold</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#E5E9F0', borderRadius: '3px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${Math.min(transaction.riskScore * 100, 100)}%`, 
                height: '100%', 
                backgroundColor: riskColor,
                transition: 'width 0.3s ease' 
              }} 
            />
          </div>
        </div>

        {/* Flag Reason if present */}
        {transaction.details.flagReason && (
          <div 
            style={{ 
              backgroundColor: 'var(--color-red-subtle)', 
              border: '1px solid rgba(185, 56, 56, 0.25)', 
              borderRadius: '6px', 
              padding: '12px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}
          >
            <ShieldAlert size={16} color="var(--color-red)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-red)' }}>
                Detection Rationale
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
                {transaction.details.flagReason}
              </div>
            </div>
          </div>
        )}

        {/* Metadata Details */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
            Transaction Context
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <CreditCard size={14} color="var(--color-blue)" />
              <span>Channel: <strong style={{ color: 'var(--text-primary)' }}>{transaction.details.channel}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <MapPin size={14} color="var(--color-blue)" />
              <span>Location: <strong style={{ color: 'var(--text-primary)' }}>{transaction.details.location}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Tag size={14} color="var(--color-blue)" />
              <span>Category: <strong style={{ color: 'var(--text-primary)' }}>{transaction.details.merchantCategory}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <Clock size={14} color="var(--color-blue)" />
              <span>Elapsed Sec: <strong style={{ color: 'var(--text-primary)' }}>{transaction.features.timeSeconds}s</strong></span>
            </div>
          </div>
        </div>

        {/* Quantum Qubit Feature Encodings */}
        <div>
          <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Quantum Feature Space Mappings (ZZFeatureMap)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {['v4', 'v11', 'v12', 'v14'].map((feat, idx) => (
              <div 
                key={feat} 
                style={{ 
                  background: '#F8F9FA', 
                  border: '1px solid var(--color-border)', 
                  borderRadius: '5px', 
                  padding: '8px', 
                  textAlign: 'center' 
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Qubit q_{idx} ({feat.toUpperCase()})
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {transaction.features[feat].toFixed(3)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
