import React, { useState, useEffect } from 'react';
import { TransactionTable } from '../components/TransactionTable';
import { INITIAL_TRANSACTIONS } from '../data/mockData';
import { Transaction } from '../types';
import { Download, ShieldCheck, ShieldAlert, Clock, RefreshCw, Database } from 'lucide-react';
import { fetchTransactions } from '../services/api';

interface TransactionsPageProps {
  onSelectTransaction: (txn: Transaction) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onSelectTransaction }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isLiveFromDb, setIsLiveFromDb] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadLiveTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await fetchTransactions();
      if (data && Array.isArray(data) && data.length > 0) {
        setTransactions(data);
        setIsLiveFromDb(true);
      }
    } catch (e) {
      console.warn('Failed to fetch PostgreSQL transactions, using mock fallback', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLiveTransactions();
  }, []);

  const totalCount = transactions.length;
  const suspiciousCount = transactions.filter(t => t.status === 'Suspicious').length;
  const reviewCount = transactions.filter(t => t.status === 'Under Review').length;
  const legitCount = transactions.filter(t => t.status === 'Legitimate').length;

  const handleExport = () => {
    alert("Export initiated: npci_upi_transactions_audit_qsvm_log.csv has been prepared for download (demonstration).");
  };

  return (
    <div className="page-content">
      {/* Top Telemetry Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Filtered</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{totalCount}</div>
          </div>
          <span className="badge badge-neutral">Audited</span>
        </div>

        <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Legitimate</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-green)' }}>{legitCount}</div>
          </div>
          <ShieldCheck size={18} color="var(--color-green)" />
        </div>

        <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Suspicious (Fraud)</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-red)' }}>{suspiciousCount}</div>
          </div>
          <ShieldAlert size={18} color="var(--color-red)" />
        </div>

        <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Under Review</div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-amber)' }}>{reviewCount}</div>
          </div>
          <Clock size={18} color="var(--color-amber)" />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Audited Transactions Database</div>
            <div className="card-subtitle">
              Filter by predictive classification, search transaction identifiers, or click a row to inspect quantum feature angles
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              className="badge" 
              style={{ 
                backgroundColor: isLiveFromDb ? 'var(--color-green-subtle)' : '#F1F3F5',
                color: isLiveFromDb ? 'var(--color-green)' : 'var(--text-secondary)',
                border: `1px solid ${isLiveFromDb ? 'var(--color-green)' : 'var(--color-border)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                padding: '3px 8px'
              }}
            >
              <Database size={11} />
              {isLiveFromDb ? 'PostgreSQL dualq_db (Live)' : 'Mock Ledger (Offline)'}
            </span>

            <button 
              onClick={loadLiveTransactions} 
              disabled={isLoading}
              className="btn btn-secondary btn-sm"
              title="Sync latest records from local PostgreSQL database"
            >
              <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Syncing...' : 'Sync DB'}</span>
            </button>

            <button onClick={handleExport} className="btn btn-secondary btn-sm">
              <Download size={13} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <TransactionTable
          transactions={transactions}
          onSelectTransaction={onSelectTransaction}
          showFilters={true}
          defaultPageSize={8}
        />
      </div>
    </div>
  );
};
