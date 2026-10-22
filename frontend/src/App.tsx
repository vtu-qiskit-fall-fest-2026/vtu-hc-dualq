import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { TransactionDetails } from './components/TransactionDetails';
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
  const [isSwitchingRole, setIsSwitchingRole] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<NavigationPage>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // If not logged in or in the middle of switching accounts/roles, show LoginPage
  if (!currentUser || isSwitchingRole) {
    return (
      <LoginPage 
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setStoredUser(user);
          setIsSwitchingRole(false);
        }} 
      />
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'overview':
        return (
          <OverviewPage
            onSelectTransaction={setSelectedTransaction}
            onNavigate={setActivePage}
            currentUser={currentUser}
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
      {/* Left Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
          onSwitchRole={() => setIsSwitchingRole(true)}
          onRefresh={() => {
            // Instant visual feedback for user
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

      {/* Transaction Details Modal */}
      <TransactionDetails
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default App;
