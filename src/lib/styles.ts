import { CSSProperties } from 'react';

export const createMainStyle = (sidebarOpen: boolean): CSSProperties => ({
  marginLeft: sidebarOpen ? '250px' : '60px',
  transition: 'margin-left 0.3s ease',
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  width: `calc(100vw - ${sidebarOpen ? '250px' : '60px'})`
});

export const headerStyle: CSSProperties = {
  height: '64px',
  borderBottom: '1px solid #e5e7eb',
  display: 'flex',
  alignItems: 'center',
  padding: '0 16px',
  gap: '8px'
};

export const menuButtonStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '8px',
  cursor: 'pointer',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  color: '#6b7280'
};

export const dashboardContainerStyle: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto'
};

export const dashboardHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px'
};

export const overviewSectionStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px'
};

export const dashboardCardsStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px',
  marginBottom: '32px'
};

export const bottomSectionStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '24px',
  marginBottom: '32px'
};
