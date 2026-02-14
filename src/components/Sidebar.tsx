import { Shield, LayoutDashboard, FileSearch, Link2, Hash, ScrollText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type SidebarProps = {
  activeView: string;
  onNavigate: (view: string) => void;
};

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  const { signOut, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'file-scanner', label: 'File Scanner', icon: FileSearch },
    { id: 'url-scanner', label: 'URL Scanner', icon: Link2 },
    { id: 'hash-checker', label: 'Hash Checker', icon: Hash },
    { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">SecAnalyzer</h1>
            <p className="text-slate-400 text-xs">SOC Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
          <p className="text-xs text-slate-500 mb-1">Logged in as</p>
          <p className="text-sm text-slate-300 truncate">{user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
