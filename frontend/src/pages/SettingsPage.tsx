import React, { useState } from 'react';
import { 
  Settings, 
  Layers, 
  CheckCircle2, 
  Save, 
  Sliders, 
  Table, 
  Target
} from 'lucide-react';
import { AppSettings } from '../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    tableDensity: 'normal',
    defaultMetric: 'pr-auc',
    qubitCapacity: 4,
    ibmConnectionStatus: 'offline',
    readoutMitigation: true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = () => {
    setTestStatus("Testing local quantum runtime connection...");
    setTimeout(() => {
      setTestStatus("Local vQPU-Enterprise-8Q is online with 8 qubits ready. Zero cloud latency.");
      setTimeout(() => setTestStatus(null), 5000);
    }, 700);
  };

  return (
    <div className="page-content" style={{ maxWidth: '900px' }}>
      {savedSuccess && (
        <div 
          style={{ 
            backgroundColor: 'var(--color-green-subtle)', 
            border: '1px solid rgba(38, 115, 77, 0.3)', 
            borderRadius: '6px', 
            padding: '12px 16px', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--color-green)'
          }}
        >
          <CheckCircle2 size={16} />
          <span>Settings successfully updated and applied to the workspace.</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Visual & Interface Preferences */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title">
              <Table size={16} color="var(--color-blue)" />
              <span>Interface & Display Preferences</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Dashboard Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                className="form-select"
              >
                <option value="light">Enterprise Light (Default - High Contrast)</option>
                <option value="slate">Slate Neutral (Subtle Gray)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Table Row Density</label>
              <select
                value={settings.tableDensity}
                onChange={(e) => setSettings({ ...settings, tableDensity: e.target.value as any })}
                className="form-select"
              >
                <option value="compact">Compact (Dense audit view)</option>
                <option value="normal">Normal (Standard balanced padding)</option>
                <option value="spacious">Spacious (Relaxed financial log)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Model & Evaluation Defaults */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div className="card-title">
              <Target size={16} color="var(--color-blue)" />
              <span>Model & Metric Preferences</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Default Performance Metric</label>
              <select
                value={settings.defaultMetric}
                onChange={(e) => setSettings({ ...settings, defaultMetric: e.target.value as any })}
                className="form-select"
              >
                <option value="pr-auc">PR-AUC (Average Precision - Recommended for Imbalance)</option>
                <option value="recall">Recall (Fraud Catch Rate)</option>
                <option value="f1-score">F1-Score (Harmonic Mean)</option>
                <option value="roc-auc">ROC-AUC (Overall ranking)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quantum Register Allocation</label>
              <select
                value={settings.qubitCapacity}
                onChange={(e) => setSettings({ ...settings, qubitCapacity: Number(e.target.value) })}
                className="form-select"
              >
                <option value={4}>4 Qubits (Fastest - PCA components)</option>
                <option value={6}>6 Qubits (Intermediate)</option>
                <option value={8}>8 Qubits (Full vQPU capacity)</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="mitigation"
              checked={settings.readoutMitigation}
              onChange={(e) => setSettings({ ...settings, readoutMitigation: e.target.checked })}
              style={{ width: '16px', height: '16px', accentColor: 'var(--color-blue)' }}
            />
            <label htmlFor="mitigation" style={{ fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              Enable automated matrix-free Readout Error Mitigation ($M^{-1}$ unbiasing)
            </label>
          </div>
        </div>

        {/* IBM Quantum Placeholder Connection Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <div>
              <div className="card-title">
                <Layers size={16} color="var(--color-blue)" />
                <span>IBM Quantum Cloud Connection (Placeholder)</span>
              </div>
              <div className="card-subtitle">Optionally connects with real QPU backends over IBM Quantum Runtime</div>
            </div>
            <span className="badge badge-neutral">Offline / Local vQPU</span>
          </div>

          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">IBM Quantum Platform API Token</label>
            <input
              type="password"
              disabled
              placeholder="••••••••••••••••••••••••••••••••••••••••"
              value="demo_token_not_stored_locally"
              className="form-input"
              style={{ backgroundColor: '#F8FAFC', color: 'var(--text-muted)' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
              * UI Prototype Notice: Real API tokens are never requested or stored. The system operates on your internal vQPU.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={handleTestConnection}
              className="btn btn-secondary btn-sm"
            >
              Test Connection
            </button>
            {testStatus && (
              <span style={{ fontSize: '12px', color: 'var(--color-blue)' }}>
                {testStatus}
              </span>
            )}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={14} />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
