import React, { useState } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  AlertCircle, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { DatasetUploader } from '../components/DatasetUploader';
import { MOCK_DATASET_STATS } from '../data/mockData';
import { DatasetStatistics } from '../types';

const SAMPLE_CSV_PREVIEW = [
  { index: 0, time: 0.0, amount: 1496.00, v1: -1.3598, v2: -0.0728, v3: 2.5363, v4: 1.3782, targetClass: 0 },
  { index: 1, time: 0.0, amount: 250.00, v1: 1.1918, v2: 0.2662, v3: 0.1665, v4: 0.4482, targetClass: 0 },
  { index: 2, time: 1.0, amount: 37860.00, v1: -1.3584, v2: -1.3402, v3: 1.7732, v4: 0.3798, targetClass: 0 },
  { index: 3, time: 1.0, amount: 1235.00, v1: -0.9663, v2: -0.1852, v3: 1.7930, v4: -0.8633, targetClass: 0 },
  { index: 4, time: 2.0, amount: 699.00, v1: -1.1582, v2: 0.8777, v3: 1.5487, v4: 0.4030, targetClass: 0 },
  { index: 541, time: 406.0, amount: 1.00, v1: -2.3122, v2: 1.9520, v3: -1.6098, v4: 3.9979, targetClass: 1 },
  { index: 623, time: 472.0, amount: 52900.00, v1: -3.0435, v2: -3.1573, v3: 1.0885, v4: 2.2886, targetClass: 1 },
];

export const DatasetPage: React.FC = () => {
  const [stats, setStats] = useState<DatasetStatistics>(MOCK_DATASET_STATS);

  const handleFileUploaded = (fileName: string, rowCount: number) => {
    setStats({
      ...stats,
      name: fileName,
      totalRows: rowCount > 1000 ? rowCount : 284807,
      lastUpdated: "Just now (Client Preview)"
    });
  };

  return (
    <div className="page-content">
      {/* Top Banner */}
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--card-radius)', 
          padding: '12px 18px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Database size={16} color="var(--color-blue)" />
          <span>
            Active dataset: <strong style={{ color: 'var(--text-primary)' }}>{stats.name}</strong>. 
            Contains anonymized transactions collected during European cardholder transactions over 48 hours.
          </span>
        </div>
        <span className="badge badge-demo">Demo File Loaded</span>
      </div>

      {/* Upload Drop Zone Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Dataset Ingestion</div>
            <div className="card-subtitle">Upload a local credit card CSV or verify the currently loaded sample data</div>
          </div>
          <span className="badge badge-neutral">Client-Side Parser</span>
        </div>

        <DatasetUploader onFileUploaded={handleFileUploaded} />
      </div>

      {/* Dataset Summary Statistics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Transaction Records
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            {stats.totalRows.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Across 2 days of activity
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Dimensionality
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-blue)', marginTop: '4px' }}>
            {stats.totalFeatures} Features
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Time, Amount, V1–V28 + Class
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Missing Values
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-green)', marginTop: '4px' }}>
            {stats.missingValues} (0.0%)
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            No imputation needed
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>
            Fraudulent Ratio
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-red)', marginTop: '4px' }}>
            {stats.fraudRatioPercent}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {stats.fraudulentCount.toLocaleString()} confirmed fraud cases
          </div>
        </div>
      </div>

      {/* Class Distribution Visualizer */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Class Imbalance Distribution</div>
            <div className="card-subtitle">Severe imbalance ratio requires stratified sampling and class-weighted penalty margins</div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
            <span>
              <strong style={{ color: 'var(--color-green)' }}>● Legitimate:</strong>{' '}
              {stats.legitimateCount.toLocaleString()} ({((stats.legitimateCount / stats.totalRows) * 100).toFixed(2)}%)
            </span>
            <span>
              <strong style={{ color: 'var(--color-red)' }}>● Fraudulent:</strong>{' '}
              {stats.fraudulentCount.toLocaleString()} ({((stats.fraudulentCount / stats.totalRows) * 100).toFixed(3)}%)
            </span>
          </div>

          {/* Visual Bar */}
          <div style={{ width: '100%', height: '14px', backgroundColor: '#E2E8F0', borderRadius: '4px', display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '99.83%', height: '100%', backgroundColor: 'var(--color-green)' }} title="99.83% Legitimate" />
            <div style={{ width: '0.17%', height: '100%', backgroundColor: 'var(--color-red)' }} title="0.17% Fraudulent" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            <span>284,315 Transactions</span>
            <span>492 Fraud Transactions</span>
          </div>
        </div>
      </div>

      {/* Dataset Preview Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Dataset Preview (Head & Anomaly Samples)</div>
            <div className="card-subtitle">Sample rows from the raw schema before PCA reduction and quantum angle scaling</div>
          </div>
          <span className="badge badge-neutral">Showing 7 Sample Rows</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Row ID</th>
                <th>Time (sec)</th>
                <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                <th style={{ textAlign: 'right' }}>Feature V1</th>
                <th style={{ textAlign: 'right' }}>Feature V2</th>
                <th style={{ textAlign: 'right' }}>Feature V3</th>
                <th style={{ textAlign: 'right' }}>Feature V4</th>
                <th>Target (Class)</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_CSV_PREVIEW.map((row) => (
                <tr key={row.index}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    #{row.index}
                  </td>
                  <td>{row.time.toFixed(1)}s</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    ₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{row.v1.toFixed(4)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{row.v2.toFixed(4)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{row.v3.toFixed(4)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: row.v4 > 2.0 ? 'var(--color-red)' : 'inherit' }}>
                    {row.v4.toFixed(4)}
                  </td>
                  <td>
                    {row.targetClass === 1 ? (
                      <span className="badge badge-suspicious">Class 1 (Fraud)</span>
                    ) : (
                      <span className="badge badge-legitimate">Class 0 (Legit)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
