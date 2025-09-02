import React from 'react';
import { Sidebar } from './Sidebar';
import { mainStyle, headerStyle, backdropStyle } from '../lib/styles';

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
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
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
        <header style={headerStyle}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Welcome to MindSpace
          </span>
        </header>
        
        {children}
      </div>
    </div>
  );
};
