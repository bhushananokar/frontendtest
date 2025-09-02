import { Layout } from './components/Layout';
import { PageManager } from './components/PageManager';
import { useAppState } from './hooks/useAppState';
import './App.css';

function App() {
  const appState = useAppState();

  return (
    <Layout
      sidebarOpen={appState.sidebarOpen}
      setSidebarOpen={appState.setSidebarOpen}
      currentPage={appState.currentPage}
      onPageChange={appState.setCurrentPage}
    >
      <PageManager 
        currentPage={appState.currentPage} 
        appState={appState}
      />
    </Layout>
  );
}

export default App;
