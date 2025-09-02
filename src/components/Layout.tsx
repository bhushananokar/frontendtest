import React from 'react';
import { Sidebar } from './Sidebar';
import { mainStyle, backdropStyle } from '../lib/styles';

interface LayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  onPageChange
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      margin: 0, 
      padding: 0 
    }}>
      {/* Backdrop - shown when sidebar is open to create overlay effect */}
      {sidebarOpen && (
        <div 
          style={backdropStyle}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        sidebarOpen={sidebarOpen}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div style={mainStyle}>
        {children}
      </div>
    </div>
  );
};
