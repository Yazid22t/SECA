import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginView } from './components/LoginView';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { FileScannerView } from './components/FileScannerView';
import { URLScannerView } from './components/URLScannerView';
import { HashCheckerView } from './components/HashCheckerView';
import { AuditLogsView } from './components/AuditLogsView';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'file-scanner':
        return <FileScannerView />;
      case 'url-scanner':
        return <URLScannerView />;
      case 'hash-checker':
        return <HashCheckerView />;
      case 'audit-logs':
        return <AuditLogsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      {renderView()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
