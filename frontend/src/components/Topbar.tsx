import React from 'react';
import { Bell, RefreshCw, Layers, LogOut, UserCheck } from 'lucide-react';
import { NavigationPage, UserProfile } from '../types';

interface TopbarProps {
  activePage: NavigationPage;
  onRefresh?: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onSwitchRole?: () => void;
}

const PAGE_TITLES: Record<NavigationPage, { title: string; subtitle: string }> = {
  overview: { title: "National Banking Fraud Telemetry", subtitle: "Real-time UPI, IMPS, and RuPay transaction telemetry evaluated by Quantum SVM" },
  transactions: { title: "Unified Payment Audit Ledger", subtitle: "Audited records across Indian payment rails with quantum risk scoring" },
  detection: { title: "Quantum Fraud Screening Engine", subtitle: "Real-time simulation of transactions in Indian Rupees (₹) across quantum state space" },
  performance: { title: "RBI Benchmarks & Statistical Performance", subtitle: "Empirical comparison of QSVM vs Classical ML across stratified banking partitions" },
  kernel: { title: "Quantum Hilbert Space & Kernel Topologies", subtitle: "Fidelity Gram matrix similarity distribution and feature map circuit architecture" },
  dataset: { title: "NPCI / RBI Schema Dataset Management", subtitle: "Core banking fraud dataset audit, class imbalance distribution, and feature scaling" },
  settings: { title: "Platform Settings & Runtime", subtitle: "Interface preferences, display density, and on-premise vQPU execution parameters" }
};

export const Topbar: React.FC<TopbarProps> = ({ 
  activePage, 
  onRefresh, 
  currentUser, 
  onLogout,
  onSwitchRole 
}) => {
  const current = PAGE_TITLES[activePage];

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* Title & Context */}
      <div>
        <h1 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {current.title}
        </h1>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {current.subtitle}
        </p>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Environment Badge */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '4px 8px', 
            backgroundColor: '#F8F9FA', 
            border: '1px solid var(--color-border)', 
            borderRadius: '4px',
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}
        >
          <Layers size={13} color="var(--color-blue)" />
          <span>Node: <strong style={{ color: 'var(--text-primary)' }}>vQPU-01</strong></span>
        </div>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          className="btn btn-secondary btn-sm"
          title="Refresh view data"
          style={{ padding: '4px 8px' }}
        >
          <RefreshCw size={12} />
          <span>Refresh</span>
        </button>

        {/* User Profile & Role Info */}
        {currentUser && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '3px 8px', 
              borderLeft: '1px solid var(--color-border)',
              marginLeft: '4px'
            }}
          >
            {/* Avatar Circle */}
            <div 
              style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--color-blue)', 
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 700,
                flexShrink: 0
              }}
              title={`${currentUser.name} (${currentUser.roleLabel})`}
            >
              {currentUser.avatarInitials}
            </div>

            {/* Officer Details */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {currentUser.name}
                </span>
                <span 
                  className={`badge ${
                    currentUser.role === 'bank_risk_officer' 
                      ? 'badge-legitimate' 
                      : currentUser.role === 'npci_auditor' 
                        ? 'badge-neutral' 
                        : 'badge-demo'
                  }`}
                  style={{ fontSize: '9px', padding: '1px 5px' }}
                >
                  {currentUser.roleLabel}
                </span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                {currentUser.institution}
              </span>
            </div>

            {/* Switch Role Button */}
            {onSwitchRole && (
              <button
                type="button"
                onClick={onSwitchRole}
                className="btn btn-secondary btn-sm"
                title="Switch institutional role / banking persona"
                style={{ padding: '3px 6px', fontSize: '11px' }}
              >
                <UserCheck size={12} />
                <span>Switch Role</span>
              </button>
            )}

            {/* Sign Out Button */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-secondary btn-sm"
                title="Sign out of bank session"
                style={{ padding: '3px 6px', color: 'var(--color-red)' }}
              >
                <LogOut size={12} />
              </button>
            )}
          </div>
        )}

        {/* Notifications Icon */}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '50%',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          title="System notifications"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F3F6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Bell size={15} />
          <span 
            style={{ 
              position: 'absolute', 
              top: '4px', 
              right: '4px', 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--color-blue)' 
            }} 
          />
        </button>
      </div>
    </header>
  );
};
