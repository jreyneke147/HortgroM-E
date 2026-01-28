
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { PILLAR_META } from '../constants';
import { PillarType } from '../types';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  Calendar, 
  ChevronRight,
  Target,
  FileDown,
  // Added missing icons
  TrendingUp,
  Users
} from 'lucide-react';

const MOCK_TIME_DATA = [
  { name: '2019', eco: 4000, soc: 2400, env: 2400, ins: 2000 },
  { name: '2020', eco: 3000, soc: 1398, env: 2210, ins: 2200 },
  { name: '2021', eco: 2000, soc: 9800, env: 2290, ins: 2300 },
  { name: '2022', eco: 2780, soc: 3908, env: 2000, ins: 2500 },
  { name: '2023', eco: 1890, soc: 4800, env: 2181, ins: 2600 },
  { name: '2024', eco: 2390, soc: 3800, env: 2500, ins: 2800 },
];

const DashboardView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1">Cross-programme performance across the four strategic pillars.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
            <Calendar size={16} />
            Period: 2023-2024
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-md">
            <FileDown size={16} />
            Export PDF Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(PillarType).map((pillar) => (
          <div key={pillar} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-3 opacity-10 transition-opacity group-hover:opacity-20`}>
              {PILLAR_META[pillar].icon}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${PILLAR_META[pillar].bg} ${PILLAR_META[pillar].color}`}>
                {PILLAR_META[pillar].icon}
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{pillar}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">84%</span>
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                <ArrowUpRight size={12} />
                +12%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Target Realisation Index</p>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${PILLAR_META[pillar].bg.replace('bg-', 'bg-').split('-')[0]}-${PILLAR_META[pillar].color.split('-')[1]} rounded-full`} style={{ width: '84%' }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pillar Performance Trends</h3>
              <p className="text-sm text-gray-500">Longitudinal impact analysis (2019 - 2024)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div> Economic
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div> Social
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TIME_DATA}>
                <defs>
                  <linearGradient id="colorEco" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="eco" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEco)" />
                <Area type="monotone" dataKey="soc" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorSoc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <Target size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Efficiency Scoring</span>
            </div>
            <h3 className="text-2xl font-bold">Programme Value Realisation</h3>
            <p className="text-slate-400 text-sm mt-2">Combined ROI across all active portfolios.</p>
          </div>

          <div className="my-8 flex justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="552.92" strokeDashoffset="138" className="text-green-500" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">75%</span>
                <span className="text-xs text-slate-400 font-bold uppercase">Benchmark</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-sm font-medium">Hortfin Pipeline</span>
              <span className="text-green-400 font-bold">EXCELLENT</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-sm font-medium">Skills Accelerator</span>
              <span className="text-amber-400 font-bold">AT RISK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Drilldown Table Placeholder */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-slate-800">Critical Project Status</h3>
          <button className="text-green-600 text-sm font-bold flex items-center gap-1 hover:underline">
            View All Projects <ChevronRight size={16} />
          </button>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Project Entity</th>
              <th className="px-6 py-4">Programme</th>
              <th className="px-6 py-4">Pillar Focus</th>
              <th className="px-6 py-4">KPI Health</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">Cape Valley Growers {i}</div>
                  <div className="text-xs text-gray-400">Piketberg, Western Cape</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">Commercialisation</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {/* Fixed missing icon imports */}
                    <div className="p-1 rounded bg-blue-100 text-blue-600"><TrendingUp size={12} /></div>
                    <div className="p-1 rounded bg-purple-100 text-purple-600"><Users size={12} /></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: i === 2 ? '45%' : '88%' }}></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    i === 2 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {i === 2 ? 'Behind Target' : 'On Track'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardView;
