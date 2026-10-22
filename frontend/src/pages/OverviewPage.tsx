import React from 'react';
import { 
  CreditCard, 
  ShieldAlert, 
  Target, 
  CheckCircle2, 
  Activity, 
  Database,
  ArrowRight
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { TransactionTable } from '../components/TransactionTable';
import { INITIAL_TRANSACTIONS, HOURLY_VOLUME_DATA, DAILY_DISTRIBUTION_DATA } from '../data/mockData';
import { Transaction, NavigationPage, UserProfile } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface OverviewPageProps {
  onSelectTransaction: (txn: Transaction) => void;
  onNavigate: (page: NavigationPage) => void;
  currentUser?: UserProfile | null;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onSelectTransaction, onNavigate, currentUser }) => {
  return (
    <div className="page-content">
      {/* Officer & Institutional Terminal Banner */}
      {currentUser && (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '6px', 
                backgroundColor: 'var(--color-blue-subtle)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'var(--color-blue)',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              {currentUser.avatarInitials}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentUser.institution}
                </span>
                <span className="badge badge-legitimate" style={{ fontSize: '10px' }}>
                  {currentUser.roleLabel}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Terminal Officer: <strong style={{ color: 'var(--text-primary)' }}>{currentUser.name}</strong> &bull; Badge: <span style={{ fontFamily: 'monospace' }}>{currentUser.badgeNumber}</span> &bull; Node: <strong>{currentUser.branchCode || 'CENTRAL-CLEARING'}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-green)' }}>
              Live QPU Stream Synced
            </span>
          </div>
        </div>
      )}

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <MetricCard
          title="Total Transactions"
          value="2,84,807"
          subValue="Audited records"
          trend={{ value: "+12.4% vs last cycle", isPositive: true }}
          icon={<CreditCard size={18} />}
        />
        <MetricCard
          title="Fraud Detected"
          value="492"
          subValue="0.17% anomaly rate"
          trend={{ value: "-4.2% fraud exposure", isPositive: true }}
          icon={<ShieldAlert size={18} />}
        />
        <MetricCard
          title="Detection Recall"
          value="88.77%"
          subValue="Target: >85%"
          trend={{ value: "+7.1% over Classical SVM", isPositive: true }}
          icon={<Target size={18} />}
        />
        <MetricCard
          title="Model Precision"
          value="84.47%"
          subValue="FP rate: 0.028%"
          trend={{ value: "+4.5% specificity", isPositive: true }}
          icon={<CheckCircle2 size={18} />}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Transaction Volume Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Hourly Transaction Volume</div>
              <div className="card-subtitle">Volume distribution across a 24-hour cycle</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_VOLUME_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="#E2E6EC" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#697586' }} />
                <YAxis tick={{ fontSize: 11, fill: '#697586' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E6EC', 
                    borderRadius: '6px', 
                    fontSize: '12px' 
                  }} 
                />
                <Bar dataKey="total" name="Total Transactions" fill="#3559A6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legitimate vs Fraudulent Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Legitimate vs. Fraudulent Activity</div>
              <div className="card-subtitle">Identified suspicious incidents by day of the week</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_DISTRIBUTION_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="#E2E6EC" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#697586' }} />
                <YAxis tick={{ fontSize: 11, fill: '#697586' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E6EC', 
                    borderRadius: '6px', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar dataKey="legitimate" name="Legitimate" fill="#26734D" radius={[3, 3, 0, 0]} />
                <Bar dataKey="fraud" name="Fraud Caught" fill="#B93838" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model & Dataset Status Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Model Status */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Activity size={16} color="var(--color-blue)" />
              <span>QSVM Model State</span>
            </div>
            <span className="badge badge-legitimate">Operational</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Model Type:</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>QSVC (Projected Kernel)</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Feature Dimension:</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>4 Qubits (PCA Reduced)</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Circuit Entanglement:</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>Linear Nearest-Neighbor</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>SVM Hyperparameter C:</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>1.0 (Balanced Class Weight)</div>
            </div>
          </div>
        </div>

        {/* Dataset Status */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Database size={16} color="var(--color-blue)" />
              <span>Dataset Telemetry</span>
            </div>
            <span className="badge badge-neutral">npci_upi_fraud_ledger.csv</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Total Samples:</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>2,84,807 transactions</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Missing Values:</span>
              <div style={{ fontWeight: 600, color: 'var(--color-green)', marginTop: '2px' }}>0 (Clean / Preprocessed)</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Fraud Ratio:</span>
              <div style={{ fontWeight: 600, color: 'var(--color-red)', marginTop: '2px' }}>0.173% (Highly Imbalanced)</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Features:</span>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>30 (Time, Amount, V1-V28)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Transactions</div>
            <div className="card-subtitle">Real-time incoming payment flow evaluated against QSVM decision boundary</div>
          </div>
          <button 
            onClick={() => onNavigate('transactions')} 
            className="btn btn-secondary btn-sm"
          >
            <span>View Full Registry</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <TransactionTable
          transactions={INITIAL_TRANSACTIONS.slice(0, 5)}
          onSelectTransaction={onSelectTransaction}
          showFilters={false}
          defaultPageSize={5}
        />
      </div>
    </div>
  );
};
