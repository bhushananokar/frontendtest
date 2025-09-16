import React, { useState, useEffect, lazy, Suspense } from 'react';
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
  // Global journal editor state
  const [editorOpenForDate, setEditorOpenForDate] = useState<Date | null>(null)
  const [editorEntryId, setEditorEntryId] = useState<string | null>(null)

  // Lazy-load journal editor component
  const LazyJournalEditor = lazy(() => import('@/components/JournalEditor').then(mod => ({ default: mod.JournalEditor })))

  // Global event listener for opening journal editor from any page
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      try {
        const { dateIso, entryId } = e?.detail || {}
        const date = dateIso ? new Date(dateIso) : new Date()
        setEditorOpenForDate(date)
        setEditorEntryId(entryId || null)
        console.log('🎯 Layout received editor open event:', { dateIso, entryId, hasEntryId: !!entryId })
      } catch {
        setEditorOpenForDate(new Date())
        setEditorEntryId(null)
      }
    }

    window.addEventListener('open-journal-editor', handler as EventListener)
    return () => window.removeEventListener('open-journal-editor', handler as EventListener)
  }, [])
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

      {/* Global Journal Editor - can be opened from any page */}
      {editorOpenForDate && (
        <Suspense fallback={<div style={{ color: '#6b7280', textAlign: 'center', padding: 20 }}>Loading editor…</div>}>
          <LazyJournalEditor 
            date={editorOpenForDate} 
            entryId={editorEntryId}
            onClose={() => {
              setEditorOpenForDate(null)
              setEditorEntryId(null)
            }} 
          />
        </Suspense>
      )}
    </div>
  );
};
