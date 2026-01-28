
import React, { useState } from 'react';
import { Programme, PillarType } from '../types';
import { PILLAR_META } from '../constants';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Search, 
  Settings2,
  AlertCircle,
  Database,
  History,
  TrendingUp,
  Target
} from 'lucide-react';

interface Props {
  programmes: Programme[];
}

const ProgrammeView: React.FC<Props> = ({ programmes }) => {
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(programmes[0].id);

  const activeProg = programmes.find(p => p.id === selectedProgramme);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Programme Inventory</h1>
          <p className="text-gray-500 mt-1">Manage organisational programmes and cross-industry indicators.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg">
          <Plus size={20} />
          Define New Programme
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Programme Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter programmes..." 
              className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            {programmes.map((prog) => (
              <button
                key={prog.id}
                onClick={() => setSelectedProgramme(prog.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all border ${
                  selectedProgramme === prog.id 
                  ? 'bg-white border-green-500 shadow-md ring-1 ring-green-500' 
                  : 'bg-white border-transparent hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{prog.name}</h4>
                  <ChevronRight size={14} className={selectedProgramme === prog.id ? 'text-green-500' : 'text-gray-300'} />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white text-[8px] flex items-center justify-center font-bold text-gray-400">P{i}</div>
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">KPI Pillar Reach</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Programme Detail Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeProg ? (
            <>
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <Database size={18} />
                      <span className="text-xs font-bold uppercase tracking-widest">Active Programme</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">{activeProg.name}</h2>
                    <p className="text-gray-500 max-w-xl mt-3 leading-relaxed">{activeProg.description}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 min-w-[200px]">
                    <div className="text-xs text-gray-400 font-bold uppercase mb-1">Total Budget</div>
                    <div className="text-2xl font-black text-slate-900">R {(activeProg.budget / 1000000).toFixed(1)}M</div>
                    <div className="mt-2 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded inline-block">72% Allocated</div>
                  </div>
                </div>
              </div>

              {/* KPI Section */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Settings2 size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Indicator Monitoring Framework</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-50 text-gray-400 rounded-lg"><History size={20} /></button>
                    <button className="px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-xl hover:bg-green-100 transition-colors">
                      Edit Framework
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {activeProg.projects[0]?.kpis.map((kpi) => (
                      <div key={kpi.id} className="group p-6 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 p-2 rounded-xl ${PILLAR_META[kpi.pillar].bg} ${PILLAR_META[kpi.pillar].color}`}>
                              {PILLAR_META[kpi.pillar].icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900 text-lg">{kpi.name}</h4>
                                <span className="text-[10px] font-black bg-white text-gray-400 border border-gray-100 px-1.5 py-0.5 rounded uppercase">{kpi.pillar}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Measured in {kpi.unit} per annum.</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black text-slate-900">
                              {kpi.current.toLocaleString()} {kpi.unit}
                            </div>
                            <div className="text-xs text-gray-400 font-medium">Target: {kpi.target.toLocaleString()} {kpi.unit}</div>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-tighter mb-2">
                            <span>Baseline ({kpi.baseline})</span>
                            <span className="text-green-600">Progress ({(kpi.current / kpi.target * 100).toFixed(0)}%)</span>
                            <span>Target ({kpi.target})</span>
                          </div>
                          <div className="h-3 w-full bg-white border border-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className={`h-full ${PILLAR_META[kpi.pillar].bg.replace('bg-', 'bg-').split('-')[0]}-${PILLAR_META[kpi.pillar].color.split('-')[1]} rounded-full transition-all duration-1000`} 
                              style={{ width: `${Math.min(100, (kpi.current / kpi.target * 100))}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <TrendingUp size={14} className="text-green-500" />
                              Trajectory: Optimistic
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                              <History size={14} className="text-blue-500" />
                              Last Data Entry: 2 days ago
                            </div>
                          </div>
                          <button className="text-xs font-bold text-slate-400 group-hover:text-green-600 transition-colors uppercase tracking-widest flex items-center gap-1">
                            Drill Down Analysis <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {activeProg.projects.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <AlertCircle size={40} className="text-gray-300 mb-4" />
                        <h4 className="font-bold text-gray-500">No projects linked to this programme</h4>
                        <button className="mt-4 text-green-600 font-bold hover:underline">Link Existing Project</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Select a programme from the list to view performance details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgrammeView;
