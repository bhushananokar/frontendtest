import React from 'react';
import { Sidebar } from './Sidebar';
import { createMainStyle, headerStyle } from '../lib/styles';

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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar 
        sidebarOpen={sidebarOpen}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div style={createMainStyle(sidebarOpen)}>
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
