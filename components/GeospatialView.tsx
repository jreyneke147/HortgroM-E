
import React, { useState } from 'react';
import { 
  Maximize2, 
  Layers, 
  Navigation,
  Globe,
  Sun,
  Droplets,
  // Added missing icon
  X
} from 'lucide-react';

interface GeospatialViewProps {
  onNavigate?: (tab: string) => void;
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const GeospatialView: React.FC<GeospatialViewProps> = ({ onNavigate, onToast }) => {
  const [activeMode, setActiveMode] = useState<'map' | 'satellite' | 'environmental'>('map');
  const [layers, setLayers] = useState({
    farms: true,
    irrigation: true,
    pests: false
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(true);

  const handleModeChange = (mode: 'map' | 'satellite' | 'environmental') => {
    setActiveMode(mode);
    onToast?.(`Switched to ${mode} view.`, 'info');
  };

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
    onToast?.('Map layers updated.', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Geo-Spatial Analysis</h1>
          <p className="text-gray-500 mt-1">Farm-level monitoring and environmental layer mapping.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-gray-200 rounded-xl p-1 flex shadow-sm">
            <button
              onClick={() => handleModeChange('map')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${activeMode === 'map' ? 'bg-green-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Map View
            </button>
            <button
              onClick={() => handleModeChange('satellite')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg ${activeMode === 'satellite' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => handleModeChange('environmental')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg ${activeMode === 'environmental' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Environmental
            </button>
          </div>
        </div>
      </div>

      <div className={`flex-1 min-h-[600px] bg-slate-100 rounded-[2.5rem] relative overflow-hidden shadow-2xl border-8 border-white ${isFullscreen ? 'ring-4 ring-green-500' : ''}`}>
        {/* Placeholder for Interactive Map */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/id/11/1600/1200')] bg-cover bg-center grayscale opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full p-12 relative">
            {/* SVG Illustration of Region Mapping */}
            <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-2xl">
              <path d="M150,100 L300,80 L450,120 L550,100 L650,150 L600,300 L400,350 L200,320 L150,200 Z" fill="rgba(34, 197, 94, 0.2)" stroke="#22c55e" strokeWidth="4" />
              <circle cx="300" cy="180" r="8" fill="#ef4444" className="animate-pulse">
                <title>High Risk Farm</title>
              </circle>
              <circle cx="450" cy="250" r="12" fill="#22c55e" />
              <circle cx="550" cy="200" r="10" fill="#22c55e" />
              <circle cx="380" cy="300" r="10" fill="#3b82f6" />
            </svg>
            
            {/* Legend Overlay */}
            <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-white shadow-2xl max-w-xs">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers size={18} className="text-green-600" /> Layer Selection
              </h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-slate-900 transition-colors">Commercial Farms</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.farms}
                    onChange={() => toggleLayer('farms')}
                    className="rounded text-green-600 focus:ring-green-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-slate-900 transition-colors">Irrigation Infrastructure</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.irrigation}
                    onChange={() => toggleLayer('irrigation')}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-slate-900 transition-colors">Pest Outbreaks</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={layers.pests}
                    onChange={() => toggleLayer('pests')}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                </label>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-10 right-10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsFullscreen((prev) => !prev);
                  onToast?.('Map viewport updated.', 'info');
                }}
                className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-gray-500 hover:text-green-600 transition-all"
              >
                <Maximize2 size={20} />
              </button>
              <button
                onClick={() => onToast?.('Navigation reset to primary cluster.', 'success')}
                className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-gray-500 hover:text-green-600 transition-all"
              >
                <Navigation size={20} />
              </button>
              <button
                onClick={() => onToast?.('Global overlay toggled.', 'info')}
                className="bg-white p-3 rounded-2xl shadow-xl border border-gray-100 text-gray-500 hover:text-green-600 transition-all"
              >
                <Globe size={20} />
              </button>
            </div>

            {/* Entity Popover (Mock) */}
            {isPopoverOpen && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full mb-4 bg-white p-6 rounded-3xl shadow-2xl border border-green-100 w-72 transform hover:scale-105 transition-transform">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">Piketberg Cluster</span>
                  <button onClick={() => setIsPopoverOpen(false)} className="text-gray-300 hover:text-gray-500"><X size={16} /></button>
                </div>
                <h5 className="font-bold text-lg text-slate-900">Cape Valley Orchards</h5>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      <Sun size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Production</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">82.1%</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 text-blue-500 mb-1">
                      <Droplets size={14} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Water Index</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">0.94</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onNavigate?.('programmes');
                    onToast?.('Opening entity dashboard in Programmes.', 'info');
                  }}
                  className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all"
                >
                  View Entity Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Map Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Farm Entities', value: '1,422', detail: 'Across 9 Regions' },
          { label: 'Active Geofences', value: '458', detail: 'Real-time monitoring' },
          { label: 'Spatial Risk Factor', value: 'Moderate', detail: 'Heatwave warning' },
          { label: 'Satellite Coverage', value: '100%', detail: 'Sentinel-2 Daily' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs text-green-600 mt-2 font-medium">{stat.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeospatialView;
