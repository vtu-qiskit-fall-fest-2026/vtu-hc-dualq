import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  RotateCcw, 
  Play, 
  HelpCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { TransactionStatus } from '../types';

export const FraudDetectionPage: React.FC = () => {
  // Form State
  const [amount, setAmount] = useState<number>(1250.00);
  const [timeSeconds, setTimeSeconds] = useState<number>(36400);
  const [channel, setChannel] = useState<string>("UPI (Google Pay / PhonePe)");
  const [v4, setV4] = useState<number>(0.24);
  const [v11, setV11] = useState<number>(-0.15);
  const [v12, setV12] = useState<number>(0.38);
  const [v14, setV14] = useState<number>(0.12);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [resultStatus, setResultStatus] = useState<TransactionStatus>("Legitimate");
  const [riskScore, setRiskScore] = useState<number>(0.07);
  const [classicalScore, setClassicalScore] = useState<number>(0.11);
  const [qsvmScore, setQsvmScore] = useState<number>(0.07);

  // Load Presets
  const loadPreset = (type: 'legit' | 'fraud' | 'borderline') => {
    if (type === 'legit') {
      setAmount(280.00);
      setTimeSeconds(42100);
      setChannel("UPI QR (Kirana / Soundbox)");
      setV4(-0.35);
      setV11(-0.20);
      setV12(0.85);
      setV14(0.45);
    } else if (type === 'fraud') {
      setAmount(285000.00);
      setTimeSeconds(11200); // 3:00 AM IST
      setChannel("Midnight IMPS Beneficiary Drain");
      setV4(3.95);
      setV11(3.40);
      setV12(-4.85);
      setV14(-6.10);
    } else {
      setAmount(49000.00);
      setTimeSeconds(74200);
      setChannel("Razorpay Payment Gateway (Flipkart)");
      setV4(1.85);
      setV11(1.20);
      setV12(-1.45);
      setV14(-1.90);
    }
    setHasAnalyzed(false);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);

    // Client-side visual heuristic for demo
    setTimeout(() => {
      // High V4, high V11, strong negative V12 & V14 are typical fraud signals in Kaggle PCA
      const anomalySum = (v4 * 1.2) + (v11 * 1.1) - (v12 * 1.5) - (v14 * 2.0);
      const isHigh = anomalySum > 10 || (v14 < -3.5);
      const isMedium = anomalySum > 5 && anomalySum <= 10;

      let score = 0.05;
      let status: TransactionStatus = "Legitimate";

      if (isHigh) {
        status = "Suspicious";
        score = Math.min(0.78 + (anomalySum * 0.02), 0.98);
      } else if (isMedium) {
        status = "Under Review";
        score = 0.50 + (anomalySum * 0.02);
      } else {
        status = "Legitimate";
        score = Math.max(0.02 + Math.abs(anomalySum) * 0.01, 0.03);
      }

      setResultStatus(status);
      setRiskScore(Number(score.toFixed(3)));
      setQsvmScore(Number(score.toFixed(3)));
      setClassicalScore(Number(Math.max(score - 0.04, 0.01).toFixed(3)));
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 600);
  };

  const handleReset = () => {
    setAmount(500.00);
    setTimeSeconds(36000);
    setChannel("UPI (Google Pay / PhonePe)");
    setV4(0.0);
    setV11(0.0);
    setV12(0.0);
    setV14(0.0);
    setHasAnalyzed(false);
  };

  // Convert to angle in [-pi, pi] for visualization
  const toAngle = (val: number) => {
    const clamped = Math.max(-10, Math.min(10, val));
    return ((clamped / 10) * Math.PI).toFixed(2);
  };

  return (
    <div className="page-content">
      {/* Top Presets Bar */}
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
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          <Layers size={16} color="var(--color-blue)" />
          <span>Load sample transaction scenario for testing:</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            type="button" 
            onClick={() => loadPreset('legit')} 
            className="btn btn-secondary btn-sm"
          >
            Scenario 1: Kirana / UPI QR (₹280)
          </button>
          <button 
            type="button" 
            onClick={() => loadPreset('fraud')} 
            className="btn btn-secondary btn-sm"
          >
            Scenario 2: Midnight High-Value IMPS Drain (₹2,85,000)
          </button>
          <button 
            type="button" 
            onClick={() => loadPreset('borderline')} 
            className="btn btn-secondary btn-sm"
          >
            Scenario 3: Borderline Flipkart Purchase (₹49,000)
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left, Results Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {/* Form Panel */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Transaction Parameters</div>
              <div className="card-subtitle">Input transaction attributes to project into the 4-qubit quantum state space</div>
            </div>
            <button onClick={handleReset} type="button" className="btn btn-secondary btn-sm">
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          <form onSubmit={handleAnalyze}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Amount */}
              <div className="form-group">
                <label className="form-label">Transaction Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              {/* Channel */}
              <div className="form-group">
                <label className="form-label">Payment Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="form-select"
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe)</option>
                  <option value="UPI QR (Kirana / Soundbox)">UPI QR (Kirana / Soundbox)</option>
                  <option value="IMPS Immediate Payment">IMPS Immediate Payment</option>
                  <option value="Midnight IMPS Beneficiary Drain">Midnight IMPS Beneficiary Drain</option>
                  <option value="NEFT / RTGS Bank Transfer">NEFT / RTGS Bank Transfer</option>
                  <option value="RuPay Debit/Credit Card (POS)">RuPay Debit/Credit Card (POS)</option>
                  <option value="Razorpay Payment Gateway (Flipkart)">Razorpay Payment Gateway (Flipkart)</option>
                  <option value="ATM Cash Dispenser (RuPay)">ATM Cash Dispenser (RuPay)</option>
                </select>
              </div>
            </div>

            {/* Time */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Elapsed Seconds in 48h Window (Time): <strong>{timeSeconds}s</strong></span>
                <span style={{ color: 'var(--text-muted)' }}>approx. {Math.floor((timeSeconds % 86400) / 3600)}:00 IST</span>
              </label>
              <input
                type="range"
                min="0"
                max="172800"
                step="600"
                value={timeSeconds}
                onChange={(e) => setTimeSeconds(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-blue)' }}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', margin: '18px 0 14px', paddingTop: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Principal Component Features (PCA Latent Vectors)
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                These four features encode the highest discriminatory variance and map directly onto qubits $q_0 \dots q_3$.
              </p>
            </div>

            {/* V4, V11, V12, V14 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Feature V4 (Positive correlation)</label>
                <input
                  type="number"
                  step="0.05"
                  value={v4}
                  onChange={(e) => setV4(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feature V11 (Positive correlation)</label>
                <input
                  type="number"
                  step="0.05"
                  value={v11}
                  onChange={(e) => setV11(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feature V12 (Negative anomaly)</label>
                <input
                  type="number"
                  step="0.05"
                  value={v12}
                  onChange={(e) => setV12(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Feature V14 (Primary fraud predictor)</label>
                <input
                  type="number"
                  step="0.05"
                  value={v14}
                  onChange={(e) => setV14(parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={isAnalyzing}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px 16px' }}
              >
                {isAnalyzing ? (
                  <span>Evaluating Quantum Kernel...</span>
                ) : (
                  <>
                    <Play size={14} />
                    <span>Analyze Transaction</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="card-header">
              <div>
                <div className="card-title">Analysis Verdict</div>
                <div className="card-subtitle">Quantum Support Vector Machine classification outcome</div>
              </div>
              <span className="badge badge-demo">Simulated Output</span>
            </div>

            {hasAnalyzed ? (
              <div>
                {/* Status Hero Card */}
                <div 
                  style={{ 
                    backgroundColor: resultStatus === 'Suspicious' 
                      ? 'var(--color-red-subtle)' 
                      : resultStatus === 'Under Review' 
                        ? 'var(--color-amber-subtle)' 
                        : 'var(--color-green-subtle)', 
                    border: `1px solid ${
                      resultStatus === 'Suspicious' 
                        ? 'rgba(185, 56, 56, 0.3)' 
                        : resultStatus === 'Under Review' 
                          ? 'rgba(168, 107, 22, 0.3)' 
                          : 'rgba(38, 115, 77, 0.3)'
                    }`,
                    borderRadius: '8px', 
                    padding: '18px 20px',
                    marginBottom: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                      Model Classification
                    </span>
                    <StatusBadge status={resultStatus} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                      {(riskScore * 100).toFixed(1)}%
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      calculated fraud risk index
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${riskScore * 100}%`, 
                        height: '100%', 
                        backgroundColor: resultStatus === 'Suspicious' ? 'var(--color-red)' : resultStatus === 'Under Review' ? 'var(--color-amber)' : 'var(--color-green)',
                        transition: 'width 0.4s ease'
                      }} 
                    />
                  </div>
                </div>

                {/* Classical vs Quantum Comparison */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Model Score Comparison
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>QSVM (Quantum Kernel)</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-blue)', marginTop: '2px' }}>
                        {(qsvmScore * 100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Geometric Margin: +0.42</div>
                    </div>

                    <div style={{ background: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '10px 12px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Classical SVM (RBF)</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {(classicalScore * 100).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>Euclidean Margin: +0.31</div>
                    </div>
                  </div>
                </div>

                {/* Qubit State Angles */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Encoded Quantum Rotation Angles [−π, +π]
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center' }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>q_0 (V4)</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>{toAngle(v4)} rad</div>
                    </div>
                    <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>q_1 (V11)</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>{toAngle(v11)} rad</div>
                    </div>
                    <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>q_2 (V12)</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>{toAngle(v12)} rad</div>
                    </div>
                    <div style={{ background: '#F8FAFC', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '6px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>q_3 (V14)</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'monospace' }}>{toAngle(v14)} rad</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Select a preset or enter transaction parameters on the left, then click <strong>Analyze Transaction</strong>.
              </div>
            )}
          </div>

          {/* Prototype Disclaimer */}
          <div 
            style={{ 
              marginTop: '24px', 
              paddingTop: '12px', 
              borderTop: '1px solid var(--color-border-subtle)', 
              fontSize: '11px', 
              color: 'var(--text-muted)' 
            }}
          >
            * Visual prototype demonstration only. This form illustrates transaction parameter normalization and quantum feature angle mapping without active live banking connection.
          </div>
        </div>
      </div>
    </div>
  );
};
