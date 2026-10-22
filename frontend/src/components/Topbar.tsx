import React from 'react';
import { Bell, RefreshCw, Layers, LogOut, UserCheck, Menu } from 'lucide-react';
import { NavigationPage, UserProfile } from '../types';

interface TopbarProps {
  activePage: NavigationPage;
  onRefresh?: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onSwitchRole?: () => void;
  onOpenMobileMenu?: () => void;
}

const PAGE_TITLES: Record<NavigationPage, { title: string; subtitle: string; shortTitle: string }> = {
  overview: { 
    title: "National Banking Fraud Telemetry", 
    shortTitle: "DualQ Overview",
    subtitle: "Real-time UPI, IMPS, and RuPay transaction telemetry evaluated by Quantum SVM" 
  },
  transactions: { 
    title: "Unified Payment Audit Ledger", 
    shortTitle: "Audit Ledger",
    subtitle: "Audited records across Indian payment rails with quantum risk scoring" 
  },
  detection: { 
    title: "Quantum Fraud Screening Engine", 
    shortTitle: "Screening Engine",
    subtitle: "Real-time simulation of transactions in Indian Rupees (₹) across quantum state space" 
  },
  performance: { 
    title: "RBI Benchmarks & Statistical Performance", 
    shortTitle: "Performance",
    subtitle: "Empirical comparison of QSVM vs Classical ML across stratified banking partitions" 
  },
  kernel: { 
    title: "Quantum Hilbert Space & Kernel Topologies", 
    shortTitle: "Quantum Kernel",
    subtitle: "Fidelity Gram matrix similarity distribution and feature map circuit architecture" 
  },
  dataset: { 
    title: "NPCI / RBI Schema Dataset Management", 
    shortTitle: "Dataset Telemetry",
    subtitle: "Core banking fraud dataset audit, class imbalance distribution, and feature scaling" 
  },
  settings: { 
    title: "Platform Settings & Runtime", 
    shortTitle: "Settings",
    subtitle: "Interface preferences, display density, and on-premise vQPU execution parameters" 
  }
};

export const Topbar: React.FC<TopbarProps> = ({ 
  activePage, 
  onRefresh, 
  currentUser, 
  onLogout,
  onSwitchRole,
  onOpenMobileMenu
}) => {
  const current = PAGE_TITLES[activePage];

  return (
    <header className="app-topbar">
      {/* Left: Mobile Hamburger & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {/* Mobile Hamburger Button */}
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="mobile-hamburger-btn"
            title="Open navigation menu"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Title & Context */}
        <div style={{ minWidth: 0 }}>
          <h1 className="topbar-title desktop-only" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {current.title}
          </h1>
          <h1 className="topbar-title mobile-only" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {current.shortTitle}
          </h1>
          <p className="desktop-only" style={{ fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Environment Badge (Desktop) */}
        <div 
          className="desktop-only"
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
          <span className="desktop-only">Refresh</span>
        </button>

        {/* User Profile & Role Info */}
        {currentUser && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '2px 6px', 
              borderLeft: '1px solid var(--color-border)',
              marginLeft: '2px'
            }}
          >
            {/* Avatar Circle (Tap to switch role on mobile) */}
            <button
              onClick={onSwitchRole}
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
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title={`Logged in as ${currentUser.name} - Tap to switch persona`}
            >
              {currentUser.avatarInitials}
            </button>

            {/* Officer Details (Desktop) */}
            <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column' }}>
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

            {/* Switch Role Button (Desktop) */}
            {onSwitchRole && (
              <button
                type="button"
                onClick={onSwitchRole}
                className="btn btn-secondary btn-sm desktop-only"
                title="Switch institutional role / banking persona"
                style={{ padding: '3px 6px', fontSize: '11px' }}
              >
                <UserCheck size={12} />
                <span>Switch</span>
              </button>
            )}

            {/* Sign Out Button (Desktop) */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-secondary btn-sm desktop-only"
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
