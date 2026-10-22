import React from 'react';
import { 
  Building2,
  LayoutDashboard, 
  ShieldAlert, 
  ArrowLeftRight, 
  Menu
} from 'lucide-react';
import { NavigationPage } from '../types';

interface MobileNavProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activePage,
  onNavigate,
  onOpenMenu
}) => {
  return (
    <nav className="mobile-bottom-nav">
      <button
        onClick={() => onNavigate('home')}
        className={`mobile-nav-item ${activePage === 'home' ? 'active' : ''}`}
        aria-label="Banking Home"
      >
        <Building2 size={18} />
        <span>Bank Home</span>
      </button>

      <button
        onClick={() => onNavigate('overview')}
        className={`mobile-nav-item ${activePage === 'overview' ? 'active' : ''}`}
        aria-label="Risk Operations"
      >
        <LayoutDashboard size={18} />
        <span>Risk Ops</span>
      </button>

      <button
        onClick={() => onNavigate('detection')}
        className={`mobile-nav-item ${activePage === 'detection' ? 'active' : ''}`}
        aria-label="Screening Lab"
      >
        <ShieldAlert size={18} />
        <span>Screening</span>
      </button>

      <button
        onClick={() => onNavigate('transactions')}
        className={`mobile-nav-item ${activePage === 'transactions' ? 'active' : ''}`}
        aria-label="Audit Ledger"
      >
        <ArrowLeftRight size={18} />
        <span>Ledger</span>
      </button>

      <button
        onClick={onOpenMenu}
        className="mobile-nav-item"
        aria-label="Open full menu"
      >
        <Menu size={18} />
        <span>Menu</span>
      </button>
    </nav>
  );
};
