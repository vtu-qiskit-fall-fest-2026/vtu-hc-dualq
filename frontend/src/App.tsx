import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MobileNav } from './components/MobileNav';
import { TransactionDetails } from './components/TransactionDetails';
import { HomePage } from './pages/HomePage';
import { OverviewPage } from './pages/OverviewPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { FraudDetectionPage } from './pages/FraudDetectionPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { QuantumKernelPage } from './pages/QuantumKernelPage';
import { DatasetPage } from './pages/DatasetPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { NavigationPage, Transaction, UserProfile } from './types';
import { getStoredUser, setStoredUser } from './data/authData';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser);
  const [activePage, setActivePage] = useState<NavigationPage>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // If not authenticated, require login through the official Banking Portal Login Page
  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setStoredUser(user);
        }} 
      />
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return (
          <HomePage
            onNavigate={setActivePage}
            currentUser={currentUser}
            onUserChange={(user) => {
              setCurrentUser(user);
              setStoredUser(user);
            }}
          />
        );
      case 'overview':
        return (
          <OverviewPage
            onSelectTransaction={setSelectedTransaction}
            onNavigate={setActivePage}
            currentUser={currentUser}
            onUserChange={(user) => {
              setCurrentUser(user);
              setStoredUser(user);
            }}
          />
        );
      case 'transactions':
        return (
          <TransactionsPage
            onSelectTransaction={setSelectedTransaction}
          />
        );
      case 'detection':
        return <FraudDetectionPage />;
      case 'performance':
        return <ModelPerformancePage />;
      case 'kernel':
        return <QuantumKernelPage />;
      case 'dataset':
        return <DatasetPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <OverviewPage
            onSelectTransaction={setSelectedTransaction}
            onNavigate={setActivePage}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Left Sidebar (Desktop Sticky + Mobile Off-Canvas Drawer) */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          setStoredUser(null);
        }}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar
          activePage={activePage}
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setStoredUser(null);
          }}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onRefresh={() => {
            const el = document.querySelector('.main-wrapper') as HTMLElement | null;
            if (el) {
              el.style.opacity = '0.7';
              setTimeout(() => {
                el.style.opacity = '1';
              }, 200);
            }
          }}
        />

        <main style={{ flex: 1 }}>
          {renderActivePage()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        activePage={activePage}
        onNavigate={setActivePage}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Transaction Details Modal */}
      <TransactionDetails
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default App;
