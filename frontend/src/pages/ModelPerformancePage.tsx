import React from 'react';
import { 
  CheckCircle2, 
  Target, 
  Layers, 
  Clock, 
  Cpu, 
  Info,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { ConfusionMatrix } from '../components/ConfusionMatrix';
import { PerformanceChart } from '../components/PerformanceChart';
import { 
  CONFUSION_MATRIX_DATA, 
  MODEL_COMPARISON_DATA 
} from '../data/mockData';

export const ModelPerformancePage: React.FC = () => {
  return (
    <div className="page-content">
      {/* Demo Notice */}
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--card-radius)', 
          padding: '10px 16px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Info size={15} color="var(--color-blue)" />
          <span>
            Evaluation benchmark calculated across stratified banking test partitions ($N=56,954$ validation transactions under RBI risk framework).
          </span>
        </div>
        <span className="badge badge-demo">Test Set: 20% Stratified</span>
      </div>

      {/* 4 Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <MetricCard
          title="Precision (PPV)"
          value="84.47%"
          subValue="True fraud among flagged"
          trend={{ value: "+4.47% vs RBF-SVM", isPositive: true }}
          icon={<CheckCircle2 size={18} />}
        />
        <MetricCard
          title="Recall (Sensitivity)"
          value="88.77%"
          subValue="Detected fraud captures"
          trend={{ value: "+7.14% vs RBF-SVM", isPositive: true }}
          icon={<Target size={18} />}
        />
        <MetricCard
          title="F1-Score (Harmonic Mean)"
          value="0.8656"
          subValue="Balanced measure"
          trend={{ value: "+0.057 vs RBF-SVM", isPositive: true }}
          icon={<TrendingUp size={18} />}
        />
        <MetricCard
          title="ROC-AUC Score"
          value="0.9438"
          subValue="Area under ROC curve"
          trend={{ value: "+0.035 vs RBF-SVM", isPositive: true }}
          icon={<BarChart3 size={18} />}
        />
      </div>

      {/* Row: Confusion Matrix + Precision-Recall Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Confusion Matrix Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Confusion Matrix</div>
              <div className="card-subtitle">Audited outcomes for legitimate ($N=56,856$) vs fraud ($N=98$) across Indian payment rails</div>
            </div>
            <span className="badge badge-demo">Threshold = 0.50</span>
          </div>

          <ConfusionMatrix data={CONFUSION_MATRIX_DATA} />
        </div>

        {/* PR & ROC Curves */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Performance Curves</div>
              <div className="card-subtitle">Trade-off diagnostics for QSVM against classical baseline</div>
            </div>
          </div>

          <PerformanceChart />
        </div>
      </div>

      {/* Classical SVM vs QSVM Comparison Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">Classical Machine Learning vs. QSVM Comparison</div>
            <div className="card-subtitle">Side-by-side benchmark across identical stratified transaction splits</div>
          </div>
          <span className="badge badge-demo">Comparative Study</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Architecture</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Recall (Fraud)</th>
                <th style={{ textAlign: 'right' }}>Precision</th>
                <th style={{ textAlign: 'right' }}>F1-Score</th>
                <th style={{ textAlign: 'right' }}>ROC-AUC</th>
                <th style={{ textAlign: 'right' }}>PR-AUC</th>
                <th style={{ textAlign: 'right' }}>Training Latency</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_COMPARISON_DATA.map((row, idx) => {
                const isQuantum = row.type === 'Quantum';
                const isTop = idx === 0;

                return (
                  <tr key={row.model} style={{ backgroundColor: isTop ? '#FAFBFD' : 'transparent' }}>
                    <td style={{ fontWeight: isTop ? 600 : 500, color: isQuantum ? 'var(--color-blue)' : 'var(--text-primary)' }}>
                      {row.model}
                      {isTop && (
                        <span 
                          style={{ 
                            marginLeft: '8px', 
                            fontSize: '10px', 
                            backgroundColor: 'var(--color-blue-subtle)', 
                            color: 'var(--color-blue)', 
                            padding: '2px 6px', 
                            borderRadius: '3px',
                            fontWeight: 600 
                          }}
                        >
                          Top Performer
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${isQuantum ? 'badge-legitimate' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                        {row.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.recall.toFixed(1)}%</td>
                    <td style={{ textAlign: 'right' }}>{row.precision.toFixed(1)}%</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.f1Score.toFixed(4)}</td>
                    <td style={{ textAlign: 'right' }}>{row.rocAuc.toFixed(4)}</td>
                    <td style={{ textAlign: 'right', color: isTop ? 'var(--color-blue)' : 'inherit', fontWeight: isTop ? 600 : 400 }}>
                      {row.prAuc.toFixed(4)}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                      {row.trainingTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Configuration & Training Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Cpu size={16} color="var(--color-blue)" />
              <span>Quantum Circuit Hyperparameters</span>
            </div>
          </div>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Feature Map</span>
              <strong>ZZFeatureMap (Second-Order Pauli-Z)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Qubits Allocated</span>
              <strong>4 Superconducting Qubits</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Circuit Depth / Repetitions</span>
              <strong>22 Transpiled Depth (reps = 2)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Entanglement Topology</span>
              <strong>Linear Nearest-Neighbor</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock size={16} color="var(--color-blue)" />
              <span>Training Execution Telemetry</span>
            </div>
          </div>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Kernel Evaluation Time</span>
              <strong>24.5 seconds (Statevector inner products)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>SVM Quadratic Solver</span>
              <strong>0.64 seconds (Convex boundary fit)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Inference Latency</span>
              <strong>5.57 ms / transaction</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Regularization Parameter C</span>
              <strong>1.0 (Balanced class penalty)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
