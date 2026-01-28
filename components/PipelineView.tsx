
import React from 'react';
import { WorkflowStage } from '../types';
import { 
  ChevronRight, 
  MoreHorizontal, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle2,
  Filter,
  ArrowRight,
  // Added missing icon
  Plus
} from 'lucide-react';

const STAGES = Object.values(WorkflowStage);

const MOCK_PIPELINE_PROJECTS = [
  { id: '1', name: 'Valley Farms Expansion', owner: 'M. Botha', stage: WorkflowStage.PIPELINE, risk: 'Low', daysInStage: 12 },
  { id: '2', name: 'Stellenbosch Agro-Hub', owner: 'S. Naidoo', stage: WorkflowStage.DUE_DILIGENCE, risk: 'High', daysInStage: 45 },
  { id: '3', name: 'Eastern Cape Cooperative', owner: 'L. Zulu', stage: WorkflowStage.APPROVAL, risk: 'Low', daysInStage: 5 },
  { id: '4', name: 'Water Management Pilot', owner: 'T. Van Wyk', stage: WorkflowStage.IMPLEMENTATION, risk: 'Medium', daysInStage: 88 },
  { id: '5', name: 'Nursery Tech Initiative', owner: 'R. Meyer', stage: WorkflowStage.MONITORING, risk: 'Low', daysInStage: 210 },
];

const PipelineView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Workflow Pipeline</h1>
          <p className="text-gray-500 mt-1">Track project progression from intake to evaluation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                 {String.fromCharCode(64 + i)}
               </div>
             ))}
             <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">+3</div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-6 -mx-6 px-6">
        <div className="flex gap-6 min-w-[1200px]">
          {STAGES.map((stage) => {
            const projectsInStage = MOCK_PIPELINE_PROJECTS.filter(p => p.stage === stage);
            
            return (
              <div key={stage} className="flex-1 min-w-[280px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stage}</span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{projectsInStage.length}</span>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  {projectsInStage.map((project) => (
                    <div 
                      key={project.id} 
                      className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group relative overflow-hidden"
                    >
                      {project.risk === 'High' && (
                        <div className="absolute top-0 right-0 w-12 h-12">
                          <div className="absolute top-2 right-2 text-red-500"><AlertTriangle size={16} /></div>
                        </div>
                      )}
                      
                      <h5 className="font-bold text-slate-900 group-hover:text-green-700 transition-colors">{project.name}</h5>
                      
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                        <User size={12} />
                        <span className="font-medium">{project.owner}</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                          <Clock size={12} />
                          {project.daysInStage}d
                        </div>
                        <div className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase ${
                          project.risk === 'High' ? 'bg-red-50 text-red-600' :
                          project.risk === 'Medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {project.risk} Risk
                        </div>
                      </div>

                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <div className="p-1 bg-green-500 text-white rounded-lg shadow-lg">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-300 font-bold text-sm hover:border-green-200 hover:text-green-400 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> Add Intake
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Pipeline Summary Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock size={28} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">18.4 Days</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Avg. Cycle Time</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">92%</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Conversion Rate</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle size={28} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">4 Projects</div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">High Risk Flagged</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineView;
