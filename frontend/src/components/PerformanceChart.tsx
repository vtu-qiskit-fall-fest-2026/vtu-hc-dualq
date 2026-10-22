import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { PR_CURVE_DATA, ROC_CURVE_DATA } from '../data/mockData';

export const PerformanceChart: React.FC = () => {
  const [curveType, setCurveType] = useState<'pr' | 'roc'>('pr');

  const data = curveType === 'pr' ? PR_CURVE_DATA : ROC_CURVE_DATA;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {curveType === 'pr' 
            ? "Precision-Recall trade-off across varying decision thresholds" 
            : "Receiver Operating Characteristic (ROC) True Positive vs False Positive Rate"}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setCurveType('pr')}
            className={`btn btn-sm ${curveType === 'pr' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Precision-Recall
          </button>
          <button
            onClick={() => setCurveType('roc')}
            className={`btn btn-sm ${curveType === 'roc' ? 'btn-primary' : 'btn-secondary'}`}
          >
            ROC Curve
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          {curveType === 'pr' ? (
            <LineChart data={PR_CURVE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#E2E6EC" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="recall" 
                tick={{ fontSize: 11, fill: '#697586' }} 
                label={{ value: 'Recall', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#697586' }}
              />
              <YAxis 
                domain={[0, 1]} 
                tick={{ fontSize: 11, fill: '#697586' }} 
                label={{ value: 'Precision', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#697586' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E6EC', 
                  borderRadius: '6px', 
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line 
                type="monotone" 
                dataKey="quantumPrecision" 
                name="QSVC (Projected Quantum Kernel)" 
                stroke="#3559A6" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
              />
              <Line 
                type="monotone" 
                dataKey="classicalPrecision" 
                name="Classical SVM (RBF)" 
                stroke="#697586" 
                strokeWidth={1.8} 
                strokeDasharray="4 4"
                dot={{ r: 2 }} 
              />
            </LineChart>
          ) : (
            <LineChart data={ROC_CURVE_DATA} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#E2E6EC" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="fpr" 
                tick={{ fontSize: 11, fill: '#697586' }} 
                label={{ value: 'False Positive Rate (FPR)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#697586' }}
              />
              <YAxis 
                domain={[0, 1]} 
                tick={{ fontSize: 11, fill: '#697586' }} 
                label={{ value: 'True Positive Rate (Recall)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#697586' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E6EC', 
                  borderRadius: '6px', 
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Line 
                type="monotone" 
                dataKey="quantumTpr" 
                name="QSVC (AUC: 0.944)" 
                stroke="#3559A6" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
              />
              <Line 
                type="monotone" 
                dataKey="classicalTpr" 
                name="Classical SVM (AUC: 0.908)" 
                stroke="#697586" 
                strokeWidth={1.8} 
                strokeDasharray="4 4"
                dot={{ r: 2 }} 
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
