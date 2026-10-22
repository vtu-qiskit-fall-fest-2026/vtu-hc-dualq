import React from 'react';
import { ConfusionMatrixData } from '../types';

interface ConfusionMatrixProps {
  data: ConfusionMatrixData;
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ data }) => {
  const { truePositive, falsePositive, trueNegative, falseNegative, totalLegit, totalFraud } = data;

  const precision = (truePositive / (truePositive + falsePositive)) * 100;
  const recall = (truePositive / (truePositive + falseNegative)) * 100;
  const specificity = (trueNegative / (trueNegative + falsePositive)) * 100;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '8px', textAlign: 'center' }}>
        {/* Header row */}
        <div />
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', paddingBottom: '4px' }}>
          Predicted Legitimate
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', paddingBottom: '4px' }}>
          Predicted Fraud
        </div>

        {/* Row 1: Actual Legitimate */}
        <div 
          style={{ 
            fontSize: '12px', 
            fontWeight: 600, 
            color: 'var(--text-secondary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            paddingRight: '12px' 
          }}
        >
          Actual Legitimate
        </div>
        
        {/* True Negative (TN) */}
        <div 
          style={{ 
            backgroundColor: 'var(--color-green-subtle)', 
            border: '1px solid rgba(38, 115, 77, 0.25)', 
            borderRadius: '6px', 
            padding: '14px 8px' 
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-green)', fontWeight: 600, textTransform: 'uppercase' }}>
            True Negative (TN)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {trueNegative.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            {((trueNegative / totalLegit) * 100).toFixed(2)}% of legit
          </div>
        </div>

        {/* False Positive (FP) */}
        <div 
          style={{ 
            backgroundColor: 'var(--color-amber-subtle)', 
            border: '1px solid rgba(168, 107, 22, 0.25)', 
            borderRadius: '6px', 
            padding: '14px 8px' 
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-amber)', fontWeight: 600, textTransform: 'uppercase' }}>
            False Positive (FP)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {falsePositive.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            False alarm rate: {((falsePositive / totalLegit) * 100).toFixed(2)}%
          </div>
        </div>

        {/* Row 2: Actual Fraud */}
        <div 
          style={{ 
            fontSize: '12px', 
            fontWeight: 600, 
            color: 'var(--text-secondary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            paddingRight: '12px' 
          }}
        >
          Actual Fraud
        </div>

        {/* False Negative (FN) */}
        <div 
          style={{ 
            backgroundColor: 'var(--color-red-subtle)', 
            border: '1px solid rgba(185, 56, 56, 0.25)', 
            borderRadius: '6px', 
            padding: '14px 8px' 
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-red)', fontWeight: 600, textTransform: 'uppercase' }}>
            False Negative (FN)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-red)', marginTop: '2px' }}>
            {falseNegative.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Missed fraud: {((falseNegative / totalFraud) * 100).toFixed(1)}%
          </div>
        </div>

        {/* True Positive (TP) */}
        <div 
          style={{ 
            backgroundColor: 'var(--color-green-subtle)', 
            border: '1px solid rgba(38, 115, 77, 0.25)', 
            borderRadius: '6px', 
            padding: '14px 8px' 
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-green)', fontWeight: 600, textTransform: 'uppercase' }}>
            True Positive (TP)
          </div>
          <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-green)', marginTop: '2px' }}>
            {truePositive.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Detected fraud: {((truePositive / totalFraud) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Statistical Summary Footer */}
      <div 
        style={{ 
          marginTop: '16px', 
          paddingTop: '12px', 
          borderTop: '1px solid var(--color-border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          textAlign: 'center',
          fontSize: '12px'
        }}
      >
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>Recall (Sensitivity): </span>
          <strong style={{ color: 'var(--color-green)' }}>{recall.toFixed(1)}%</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>Precision: </span>
          <strong style={{ color: 'var(--color-blue)' }}>{precision.toFixed(1)}%</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-secondary)' }}>Specificity: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{specificity.toFixed(2)}%</strong>
        </div>
      </div>
    </div>
  );
};
