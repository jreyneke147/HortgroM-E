
import React, { useState, useMemo } from 'react';
import { 
  Bell, 
  Search, 
  User as UserIcon, 
  Menu, 
  X,
  Plus,
  Download,
  Filter,
  RefreshCw,
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'programmes': return <ProgrammeView programmes={MOCK_PROGRAMMES} />;
      case 'pipelines': return <PipelineView />;
      case 'geospatial': return <GeospatialView />;
      case 'governance': return <GovernanceView />;
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
          <button className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all">
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
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-1.5 w-96">
              <Search size={16} className="text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search indicators, projects, or reports..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-full"
              />
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
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
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
    </div>
  );
};

export default App;
