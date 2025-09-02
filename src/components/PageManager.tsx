import React from 'react';
import { Dashboard } from '../pages/Dashboard';
import { Journaling } from '../pages/Journaling';
import { Therapy } from '../pages/Therapy';
import { useAppState } from '../hooks/useAppState';

interface PageManagerProps {
  currentPage: string;
  appState: ReturnType<typeof useAppState>;
}

export const PageManager: React.FC<PageManagerProps> = ({ currentPage, appState }) => {

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            showAccountDropdown={appState.showAccountDropdown}
            setShowAccountDropdown={appState.setShowAccountDropdown}
            selectedTimeRange={appState.selectedTimeRange}
            setSelectedTimeRange={appState.setSelectedTimeRange}
            showTimeRangeDropdown={appState.showTimeRangeDropdown}
            setShowTimeRangeDropdown={appState.setShowTimeRangeDropdown}
            tasks={appState.tasks}
            toggleTask={appState.toggleTask}
          />
        );
      case 'journaling':
        return <Journaling />;
      case 'therapy':
        return <Therapy />;
      case 'meditation':
        return (
          <div style={{ 
            padding: '32px', 
            textAlign: 'center', 
            color: '#6b7280',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧘‍♀️</div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
              Meditation Page
            </h2>
            <p style={{ fontSize: '16px', margin: 0 }}>
              Coming Soon - Guided meditation and mindfulness exercises
            </p>
          </div>
        );
      case 'settings':
        return (
          <div style={{ 
            padding: '32px', 
            textAlign: 'center', 
            color: '#6b7280',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
              Settings
            </h2>
            <p style={{ fontSize: '16px', margin: 0 }}>
              Coming Soon - App preferences and account settings
            </p>
          </div>
        );
      default:
        return (
          <Dashboard 
            showAccountDropdown={appState.showAccountDropdown}
            setShowAccountDropdown={appState.setShowAccountDropdown}
            selectedTimeRange={appState.selectedTimeRange}
            setSelectedTimeRange={appState.setSelectedTimeRange}
            showTimeRangeDropdown={appState.showTimeRangeDropdown}
            setShowTimeRangeDropdown={appState.setShowTimeRangeDropdown}
            tasks={appState.tasks}
            toggleTask={appState.toggleTask}
          />
        );
    }
  };

  return (
    <main style={{ 
      padding: ['therapy', 'journaling'].includes(currentPage) ? '0' : undefined
    }}>
      {renderPage()}
    </main>
  );
};
