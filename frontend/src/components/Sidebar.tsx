import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  ShieldAlert, 
  ChartNoAxesCombined, 
  Network, 
  Database, 
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { NavigationPage } from '../types';

interface SidebarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'detection', label: 'Fraud Detection', icon: ShieldAlert },
  { id: 'performance', label: 'Model Performance', icon: ChartNoAxesCombined },
  { id: 'kernel', label: 'Quantum Kernel', icon: Network },
  { id: 'dataset', label: 'Dataset', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse
}) => {
  return (
    <aside 
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        minWidth: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'width 0.2s ease, min-width 0.2s ease',
        zIndex: 50,
        userSelect: 'none'
      }}
    >
      {/* Brand Header */}
      <div 
        style={{
          height: 'var(--topbar-height)',
          padding: isCollapsed ? '0 12px' : '0 20px',
          borderBottom: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          overflow: 'hidden'
        }}
      >
        {!isCollapsed ? (
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              DualQ
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontStyle: 'italic', letterSpacing: '0.02em' }}>
              Quantum Fraud Analytics
            </div>
          </div>
        ) : (
          <ShieldCheck size={24} color="var(--color-blue)" />
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '4px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: isCollapsed ? 0 : '8px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F3F6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <li key={item.id} style={{ marginBottom: '4px' }}>
                <button
                  onClick={() => onNavigate(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: isCollapsed ? '10px 0' : '10px 14px',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    borderRadius: 'var(--btn-radius)',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--color-blue)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--color-blue-subtle)' : 'transparent',
                    transition: 'all 0.15s ease',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <Icon 
                    size={18} 
                    color={isActive ? 'var(--color-blue)' : 'var(--text-secondary)'} 
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Status Box */}
      {!isCollapsed && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
          <div 
            style={{ 
              background: '#F8F9FA', 
              border: '1px solid var(--color-border)', 
              borderRadius: '6px', 
              padding: '10px 12px' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>System State</span>
              <span className="badge badge-demo">Demo</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>QSVC Active (UPI / RuPay Rail)</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
