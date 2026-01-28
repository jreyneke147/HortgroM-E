
import React, { useMemo, useState } from 'react';
import { WorkflowStage } from '../types';
import { 
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
const PIPELINE_STORAGE_KEY = 'hortgro-pipeline-projects';

const INITIAL_PIPELINE_PROJECTS = [
  { id: '1', name: 'Valley Farms Expansion', owner: 'M. Botha', stage: WorkflowStage.PIPELINE, risk: 'Low', daysInStage: 12 },
  { id: '2', name: 'Stellenbosch Agro-Hub', owner: 'S. Naidoo', stage: WorkflowStage.DUE_DILIGENCE, risk: 'High', daysInStage: 45 },
  { id: '3', name: 'Eastern Cape Cooperative', owner: 'L. Zulu', stage: WorkflowStage.APPROVAL, risk: 'Low', daysInStage: 5 },
  { id: '4', name: 'Water Management Pilot', owner: 'T. Van Wyk', stage: WorkflowStage.IMPLEMENTATION, risk: 'Medium', daysInStage: 88 },
  { id: '5', name: 'Nursery Tech Initiative', owner: 'R. Meyer', stage: WorkflowStage.MONITORING, risk: 'Low', daysInStage: 210 },
];

interface PipelineProject {
  id: string;
  name: string;
  owner: string;
  stage: WorkflowStage;
  risk: 'Low' | 'Medium' | 'High';
  daysInStage: number;
}

interface PipelineViewProps {
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const PipelineView: React.FC<PipelineViewProps> = ({ onToast }) => {
  const [projects, setProjects] = useState<PipelineProject[]>(() => {
    const stored = localStorage.getItem(PIPELINE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : INITIAL_PIPELINE_PROJECTS;
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [riskFilter, setRiskFilter] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [searchValue, setSearchValue] = useState('');
  const [openStageMenu, setOpenStageMenu] = useState<WorkflowStage | null>(null);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [intakeForm, setIntakeForm] = useState({ name: '', owner: '', stage: WorkflowStage.PIPELINE, risk: 'Low' as PipelineProject['risk'] });
  const [intakeErrors, setIntakeErrors] = useState<{ name?: string; owner?: string }>({});
  const [activeProject, setActiveProject] = useState<PipelineProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    localStorage.setItem(PIPELINE_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchesRisk = riskFilter === 'All' || project.risk === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [projects, searchValue, riskFilter]);

  const handleIntakeSave = async () => {
    const errors: { name?: string; owner?: string } = {};
    if (!intakeForm.name.trim()) {
      errors.name = 'Project name is required.';
    }
    if (!intakeForm.owner.trim()) {
      errors.owner = 'Owner is required.';
    }
    setIntakeErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setIsSaving(true);
    try {
      const newProject: PipelineProject = {
        id: `pipe-${crypto.randomUUID()}`,
        name: intakeForm.name.trim(),
        owner: intakeForm.owner.trim(),
        stage: intakeForm.stage,
        risk: intakeForm.risk,
        daysInStage: 0
      };
      setProjects((prev) => [newProject, ...prev]);
      setIsIntakeOpen(false);
      setIntakeForm({ name: '', owner: '', stage: WorkflowStage.PIPELINE, risk: 'Low' });
      onToast?.('Intake added to pipeline.', 'success');
    } catch (error) {
      onToast?.('Unable to add intake.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdvanceStage = () => {
    if (!activeProject) return;
    const currentIndex = STAGES.indexOf(activeProject.stage);
    const nextStage = STAGES[currentIndex + 1];
    if (!nextStage) {
      onToast?.('Project is already in the final stage.', 'info');
      return;
    }
    setProjects((prev) =>
      prev.map((project) =>
        project.id === activeProject.id ? { ...project, stage: nextStage, daysInStage: 0 } : project
      )
    );
    setActiveProject((prev) => (prev ? { ...prev, stage: nextStage, daysInStage: 0 } : prev));
    onToast?.(`Project advanced to ${nextStage}.`, 'success');
  };

  const handleRemoveProject = () => {
    if (!activeProject) return;
    if (!confirm('Remove this project from the pipeline?')) {
      return;
    }
    setProjects((prev) => prev.filter((project) => project.id !== activeProject.id));
    setActiveProject(null);
    onToast?.('Project removed from pipeline.', 'success');
  };

  const handleClearStage = (stage: WorkflowStage) => {
    if (!confirm(`Remove all projects in ${stage}?`)) {
      return;
    }
    setProjects((prev) => prev.filter((project) => project.stage !== stage));
    onToast?.(`Cleared ${stage} stage.`, 'success');
  };

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
          <button
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50"
          >
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase text-gray-400">Risk</label>
            <select
              value={riskFilter}
              onChange={(event) => setRiskFilter(event.target.value as typeof riskFilter)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            >
              {['All', 'Low', 'Medium', 'High'].map((risk) => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3 flex-1">
            <label className="text-xs font-bold uppercase text-gray-400">Search</label>
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search by project name"
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => {
              setRiskFilter('All');
              setSearchValue('');
              onToast?.('Filters reset.', 'info');
            }}
            className="text-xs font-bold text-gray-500 hover:text-gray-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      <div className="overflow-x-auto pb-6 -mx-6 px-6">
        <div className="flex gap-6 min-w-[1200px]">
          {STAGES.map((stage) => {
            const projectsInStage = filteredProjects.filter(p => p.stage === stage);
            
            return (
              <div key={stage} className="flex-1 min-w-[280px]">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stage}</span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{projectsInStage.length}</span>
                  </div>
                  <button
                    onClick={() => setOpenStageMenu((prev) => (prev === stage ? null : stage))}
                    className="text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                {openStageMenu === stage && (
                  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-3 mb-4 space-y-2">
                    <button
                      onClick={() => {
                        setIsIntakeOpen(true);
                        setIntakeForm((prev) => ({ ...prev, stage }));
                        setOpenStageMenu(null);
                      }}
                      className="w-full text-left text-sm font-semibold text-slate-700 hover:text-green-600"
                    >
                      Add intake to {stage}
                    </button>
                    <button
                      onClick={() => {
                        handleClearStage(stage);
                        setOpenStageMenu(null);
                      }}
                      className="w-full text-left text-sm font-semibold text-red-500 hover:text-red-600"
                    >
                      Clear stage
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {projectsInStage.map((project) => (
                    <div 
                      key={project.id} 
                      onClick={() => setActiveProject(project)}
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
                  
                  <button
                    onClick={() => setIsIntakeOpen(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-300 font-bold text-sm hover:border-green-200 hover:text-green-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Intake
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isIntakeOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">New Intake</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Project name</label>
                <input
                  value={intakeForm.name}
                  onChange={(event) => setIntakeForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                />
                {intakeErrors.name && <p className="text-xs text-red-500 mt-1">{intakeErrors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Owner</label>
                <input
                  value={intakeForm.owner}
                  onChange={(event) => setIntakeForm((prev) => ({ ...prev, owner: event.target.value }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                />
                {intakeErrors.owner && <p className="text-xs text-red-500 mt-1">{intakeErrors.owner}</p>}
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Stage</label>
                <select
                  value={intakeForm.stage}
                  onChange={(event) => setIntakeForm((prev) => ({ ...prev, stage: event.target.value as WorkflowStage }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Risk</label>
                <select
                  value={intakeForm.risk}
                  onChange={(event) => setIntakeForm((prev) => ({ ...prev, risk: event.target.value as PipelineProject['risk'] }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  {['Low', 'Medium', 'High'].map((risk) => (
                    <option key={risk} value={risk}>{risk}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setIsIntakeOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleIntakeSave}
                disabled={isSaving}
                className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Add Intake'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">{activeProject.name}</h3>
              <button onClick={() => setActiveProject(null)} className="text-gray-400 hover:text-gray-600">Close</button>
            </div>
            <div className="space-y-3 text-sm text-gray-500">
              <div><span className="font-semibold text-slate-700">Owner:</span> {activeProject.owner}</div>
              <div><span className="font-semibold text-slate-700">Stage:</span> {activeProject.stage}</div>
              <div><span className="font-semibold text-slate-700">Risk:</span> {activeProject.risk}</div>
              <div><span className="font-semibold text-slate-700">Days in stage:</span> {activeProject.daysInStage} days</div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={handleAdvanceStage}
                className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded-xl hover:bg-green-700"
              >
                Advance Stage
              </button>
              <button
                onClick={handleRemoveProject}
                className="px-4 py-2 text-sm font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      
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
