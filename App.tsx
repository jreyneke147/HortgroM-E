
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  Menu, 
  X,
  LogOut,
  // Added missing icons
  Settings,
  Leaf
} from 'lucide-react';
import { NAV_ITEMS, MOCK_PROGRAMMES } from './constants';
import DashboardView from './components/DashboardView';
import ProgrammeView from './components/ProgrammeView';
import PipelineView from './components/PipelineView';
import GeospatialView from './components/GeospatialView';
import GovernanceView from './components/GovernanceView';
import Toast, { ToastMessage, ToastType } from './components/Toast';
import { Programme } from './types';

const PROGRAMME_STORAGE_KEY = 'hortgro-programmes';
const NOTIFICATION_STORAGE_KEY = 'hortgro-notifications';

const initialNotifications = [
  { id: 'note-1', title: 'KPI upload completed', detail: 'Western Cape Fruit Hub KPIs synced.', time: '5m ago', unread: true },
  { id: 'note-2', title: 'Pipeline risk alert', detail: 'Stellenbosch Agro-Hub flagged as high risk.', time: '1h ago', unread: true },
  { id: 'note-3', title: 'Compliance audit ready', detail: 'POPIA audit report generated.', time: 'Yesterday', unread: false }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>(() => {
    const stored = localStorage.getItem(PROGRAMME_STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_PROGRAMMES;
  });
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isNotificationUpdating, setIsNotificationUpdating] = useState(false);

  useEffect(() => {
    localStorage.setItem(PROGRAMME_STORAGE_KEY, JSON.stringify(programmes));
  }, [programmes]);

  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (stored) {
      setNotifications(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const pushToast = (message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleLogout = () => {
    if (!confirm('Are you sure you want to log out?')) {
      return;
    }
    pushToast('You have been logged out.', 'success');
  };

  const handleMarkAllRead = () => {
    setIsNotificationUpdating(true);
    setTimeout(() => {
      setNotifications((prev) => prev.map((note) => ({ ...note, unread: false })));
      pushToast('All notifications marked as read.', 'success');
      setIsNotificationUpdating(false);
    }, 400);
  };

  const handleClearNotifications = () => {
    if (!confirm('Clear all notifications?')) {
      return;
    }
    setIsNotificationUpdating(true);
    setTimeout(() => {
      setNotifications([]);
      pushToast('Notifications cleared.', 'success');
      setIsNotificationUpdating(false);
    }, 400);
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const query = searchQuery.toLowerCase();
    const moduleMatches = NAV_ITEMS.filter((item) => item.label.toLowerCase().includes(query)).map((item) => ({
      id: `module-${item.id}`,
      label: item.label,
      type: 'Module',
      tab: item.id
    }));

    const programmeMatches = programmes.filter((programme) => programme.name.toLowerCase().includes(query)).map((programme) => ({
      id: programme.id,
      label: programme.name,
      type: 'Programme',
      tab: 'programmes'
    }));

    const projectMatches = programmes.flatMap((programme) =>
      programme.projects
        .filter((project) => project.name.toLowerCase().includes(query))
        .map((project) => ({ id: project.id, label: project.name, type: 'Project', tab: 'programmes' }))
    );

    const kpiMatches = programmes.flatMap((programme) =>
      programme.projects.flatMap((project) =>
        project.kpis
          .filter((kpi) => kpi.name.toLowerCase().includes(query))
          .map((kpi) => ({ id: kpi.id, label: kpi.name, type: 'KPI', tab: 'programmes' }))
      )
    );

    return [...moduleMatches, ...programmeMatches, ...projectMatches, ...kpiMatches].slice(0, 8);
  }, [searchQuery, programmes]);

  const handleSearchSelect = (tab: string, label: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    pushToast(`Navigated to ${label}.`, 'info');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView onNavigate={setActiveTab} onToast={pushToast} programmes={programmes} />;
      case 'programmes':
        return (
          <ProgrammeView
            programmes={programmes}
            onProgrammesChange={setProgrammes}
            onNavigate={setActiveTab}
            onToast={pushToast}
          />
        );
      case 'pipelines': return <PipelineView onToast={pushToast} />;
      case 'geospatial': return <GeospatialView onNavigate={setActiveTab} onToast={pushToast} />;
      case 'governance': return <GovernanceView onToast={pushToast} />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full p-12 text-gray-500">
          <Settings size={48} className="mb-4 opacity-20" />
          <h2 className="text-xl font-medium">Feature Coming Soon</h2>
          <p>The {activeTab} module is currently under active development.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-green-500 p-1.5 rounded-lg">
            <Leaf size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-tight">HORTGRO M&E</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-green-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 w-96 relative">
              <Search size={16} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search indicators, projects, or reports..." 
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}

              {searchQuery && (
                <div className="absolute left-0 right-0 top-12 bg-white border border-gray-100 rounded-2xl shadow-xl p-3 z-30">
                  {searchResults.length === 0 ? (
                    <div className="text-sm text-gray-400 px-3 py-2">No matches found.</div>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => handleSearchSelect(result.tab, result.label)}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 text-left"
                        >
                          <span className="text-sm font-semibold text-slate-700">{result.label}</span>
                          <span className="text-[10px] font-bold uppercase text-gray-400">{result.type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4 text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Live Sync Active
            </div>
            
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              <Bell size={20} />
              {notifications.some((note) => note.unread) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
            
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">Sarah Jenkins</p>
                <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-tighter">Director of M&E</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <UserIcon size={20} className="text-green-700" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Module Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {renderContent()}
          </div>
        </div>
      </main>

      {isNotificationsOpen && (
        <div className="absolute top-20 right-8 w-80 bg-white border border-gray-100 shadow-2xl rounded-3xl z-40 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h4 className="font-bold text-slate-900">Notifications</h4>
            <button onClick={() => setIsNotificationsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-sm text-gray-400">You are all caught up.</div>
            ) : (
              notifications.map((note) => (
                <div key={note.id} className="px-5 py-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-800">{note.title}</div>
                    {note.unread && <span className="text-[10px] font-bold text-red-500 uppercase">New</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{note.detail}</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase mt-2">{note.time}</div>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
            <button
              onClick={handleMarkAllRead}
              disabled={isNotificationUpdating}
              className="text-xs font-bold text-green-600 hover:underline disabled:opacity-60"
            >
              {isNotificationUpdating ? 'Updating...' : 'Mark all read'}
            </button>
            <button
              onClick={handleClearNotifications}
              disabled={isNotificationUpdating}
              className="text-xs font-bold text-red-500 hover:underline disabled:opacity-60"
            >
              {isNotificationUpdating ? 'Clearing...' : 'Clear'}
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 space-y-3 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </div>
  );
};

export default App;
