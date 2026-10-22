import React from 'react';
import { 
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
        onClick={() => onNavigate('overview')}
        className={`mobile-nav-item ${activePage === 'overview' ? 'active' : ''}`}
        aria-label="Overview"
      >
        <LayoutDashboard size={19} />
        <span>Home</span>
      </button>

      <button
        onClick={() => onNavigate('detection')}
        className={`mobile-nav-item ${activePage === 'detection' ? 'active' : ''}`}
        aria-label="Screening Lab"
      >
        <ShieldAlert size={19} />
        <span>Screening</span>
      </button>

      <button
        onClick={() => onNavigate('transactions')}
        className={`mobile-nav-item ${activePage === 'transactions' ? 'active' : ''}`}
        aria-label="Transactions Ledger"
      >
        <ArrowLeftRight size={19} />
        <span>Ledger</span>
      </button>

      <button
        onClick={onOpenMenu}
        className="mobile-nav-item"
        aria-label="Open full menu"
      >
        <Menu size={19} />
        <span>Menu</span>
      </button>
    </nav>
  );
};
