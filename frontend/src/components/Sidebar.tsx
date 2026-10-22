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
  ShieldCheck,
  X,
  LogOut,
  Building2
} from 'lucide-react';
import { NavigationPage, UserProfile } from '../types';

interface SidebarProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Banking Portal', icon: Building2 },
  { id: 'overview', label: 'Risk Operations', icon: LayoutDashboard },
  { id: 'transactions', label: 'Audit Ledger', icon: ArrowLeftRight },
  { id: 'detection', label: 'Fraud Detection', icon: ShieldAlert },
  { id: 'performance', label: 'RBI Benchmarks', icon: ChartNoAxesCombined },
  { id: 'kernel', label: 'Quantum Kernel', icon: Network },
  { id: 'dataset', label: 'Dataset', icon: Database },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onCloseMobile,
  currentUser,
  onLogout
}) => {
  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="mobile-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          minWidth: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
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

          {/* Desktop Collapse / Mobile Close Button */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="mobile-close-btn"
              title="Close menu"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="desktop-collapse-btn"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '4px',
                color: 'var(--text-secondary)',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: isCollapsed ? 0 : '8px'
              }}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
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
                    onClick={() => handleNavClick(item.id)}
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

        {/* Mobile User Profile Section in Drawer */}
        {currentUser && (
          <div className="mobile-user-drawer-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '6px', 
                  backgroundColor: 'var(--color-blue)', 
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '12px'
                }}
              >
                {currentUser.avatarInitials}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {currentUser.roleLabel}
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={() => {
                  if (onCloseMobile) onCloseMobile();
                  onLogout();
                }}
                className="btn btn-secondary btn-sm"
                style={{ 
                  width: '100%', 
                  color: 'var(--color-red)', 
                  padding: '7px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  border: '1px solid rgba(185, 56, 56, 0.25)',
                  backgroundColor: 'var(--color-red-subtle)',
                  cursor: 'pointer'
                }}
                title="Sign out of bank session and return to Login"
              >
                <LogOut size={13} />
                <span style={{ fontSize: '11px', fontWeight: 600 }}>Sign Out</span>
              </button>
            )}
          </div>
        )}

        {/* Bottom System Status Box (Desktop) */}
        {!isCollapsed && (
          <div className="desktop-status-box" style={{ padding: '16px', borderTop: '1px solid var(--color-border-subtle)' }}>
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
                <span className="badge badge-demo">vQPU Live</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>QSVC Active (₹ INR Rails)</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
