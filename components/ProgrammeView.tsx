
import React, { useMemo, useState } from 'react';
import { Programme, PillarType, Project, WorkflowStage } from '../types';
import { PILLAR_META } from '../constants';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  Settings2,
  AlertCircle,
  Database,
  History,
  TrendingUp
} from 'lucide-react';

interface Props {
  programmes: Programme[];
  onProgrammesChange: (programmes: Programme[]) => void;
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ProgrammeView: React.FC<Props> = ({ programmes, onProgrammesChange, onToast }) => {
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(programmes[0]?.id ?? null);
  const [searchValue, setSearchValue] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', budget: '' });
  const [createErrors, setCreateErrors] = useState<{ name?: string; budget?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isFrameworkEditing, setIsFrameworkEditing] = useState(false);
  const [activeKpiId, setActiveKpiId] = useState<string | null>(null);
  const [isLinkingProject, setIsLinkingProject] = useState(false);
  const [linkProjectForm, setLinkProjectForm] = useState({ name: '', stage: WorkflowStage.PIPELINE, riskLevel: 'Low' as Project['riskLevel'] });
  const [linkErrors, setLinkErrors] = useState<{ name?: string }>({});

  const activeProg = programmes.find(p => p.id === selectedProgramme);
  const kpis = useMemo(() => activeProg?.projects.flatMap((project) => project.kpis) ?? [], [activeProg]);
  const activeKpi = kpis.find((kpi) => kpi.id === activeKpiId) ?? null;
  const filteredProgrammes = programmes.filter((programme) =>
    programme.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleCreateProgramme = async () => {
    const errors: { name?: string; budget?: string } = {};
    if (!createForm.name.trim()) {
      errors.name = 'Programme name is required.';
    }
    if (!createForm.budget || Number.isNaN(Number(createForm.budget))) {
      errors.budget = 'Budget must be a number.';
    }
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setIsSaving(true);
    try {
      const newProgramme: Programme = {
        id: `prog-${crypto.randomUUID()}`,
        name: createForm.name.trim(),
        description: createForm.description.trim() || 'New programme description pending.',
        budget: Number(createForm.budget),
        projects: []
      };
      onProgrammesChange([newProgramme, ...programmes]);
      setSelectedProgramme(newProgramme.id);
      setCreateForm({ name: '', description: '', budget: '' });
      setIsCreateOpen(false);
      onToast?.('Programme created successfully.', 'success');
    } catch (error) {
      onToast?.('Unable to create programme. Please retry.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFrameworkSave = async () => {
    setIsFrameworkEditing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      onToast?.('Indicator framework saved.', 'success');
    } catch (error) {
      onToast?.('Failed to save framework.', 'error');
    } finally {
      setIsFrameworkEditing(false);
    }
  };

  const handleLinkProject = async () => {
    if (!activeProg) return;
    const errors: { name?: string } = {};
    if (!linkProjectForm.name.trim()) {
      errors.name = 'Project name is required.';
    }
    setLinkErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setIsSaving(true);
    try {
      const newProject: Project = {
        id: `proj-${crypto.randomUUID()}`,
        name: linkProjectForm.name.trim(),
        programme: activeProg.name,
        stage: linkProjectForm.stage,
        riskLevel: linkProjectForm.riskLevel,
        location: { lat: -33.9, lng: 18.4, region: 'Western Cape' },
        lastSync: new Date().toISOString(),
        kpis: []
      };
      const updatedProgrammes = programmes.map((programme) =>
        programme.id === activeProg.id
          ? { ...programme, projects: [...programme.projects, newProject] }
          : programme
      );
      onProgrammesChange(updatedProgrammes);
      setLinkProjectForm({ name: '', stage: WorkflowStage.PIPELINE, riskLevel: 'Low' });
      setIsLinkingProject(false);
      onToast?.('Project linked to programme.', 'success');
    } catch (error) {
      onToast?.('Unable to link project.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Programme Inventory</h1>
          <p className="text-gray-500 mt-1">Manage organisational programmes and cross-industry indicators.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
        >
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
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            {filteredProgrammes.map((prog) => (
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
            {filteredProgrammes.length === 0 && (
              <div className="text-xs text-gray-400 px-4 py-3 bg-white rounded-2xl border border-dashed border-gray-200">
                No programmes match that search.
              </div>
            )}
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
                    <button
                      onClick={() => onToast?.('Framework history opened.', 'info')}
                      className="p-2 hover:bg-gray-50 text-gray-400 rounded-lg"
                    >
                      <History size={20} />
                    </button>
                    <button
                      onClick={handleFrameworkSave}
                      disabled={isFrameworkEditing}
                      className="px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-xl hover:bg-green-100 transition-colors disabled:opacity-60"
                    >
                      {isFrameworkEditing ? 'Saving...' : 'Edit Framework'}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {kpis.map((kpi) => (
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
                          <button
                            onClick={() => setActiveKpiId(kpi.id)}
                            className="text-xs font-bold text-slate-400 group-hover:text-green-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                          >
                            Drill Down Analysis <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {kpis.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <AlertCircle size={40} className="text-gray-300 mb-4" />
                        <h4 className="font-bold text-gray-500">No projects linked to this programme</h4>
                        <button
                          onClick={() => setIsLinkingProject(true)}
                          className="mt-4 text-green-600 font-bold hover:underline"
                        >
                          Link Existing Project
                        </button>
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

      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create Programme</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Programme name</label>
                <input
                  value={createForm.name}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                />
                {createErrors.name && <p className="text-xs text-red-500 mt-1">{createErrors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Budget (ZAR)</label>
                <input
                  value={createForm.budget}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, budget: event.target.value }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                />
                {createErrors.budget && <p className="text-xs text-red-500 mt-1">{createErrors.budget}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProgramme}
                disabled={isSaving}
                className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Create Programme'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isLinkingProject && activeProg && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Link Project</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Project name</label>
                <input
                  value={linkProjectForm.name}
                  onChange={(event) => setLinkProjectForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                />
                {linkErrors.name && <p className="text-xs text-red-500 mt-1">{linkErrors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Stage</label>
                <select
                  value={linkProjectForm.stage}
                  onChange={(event) => setLinkProjectForm((prev) => ({ ...prev, stage: event.target.value as WorkflowStage }))}
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-green-500"
                >
                  {Object.values(WorkflowStage).map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400">Risk level</label>
                <select
                  value={linkProjectForm.riskLevel}
                  onChange={(event) => setLinkProjectForm((prev) => ({ ...prev, riskLevel: event.target.value as Project['riskLevel'] }))}
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
                onClick={() => setIsLinkingProject(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkProject}
                disabled={isSaving}
                className="px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-60"
              >
                {isSaving ? 'Linking...' : 'Link Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeKpi && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-4">KPI Detail</h3>
            <div className="space-y-3 text-sm text-gray-500">
              <div><span className="font-semibold text-slate-700">Indicator:</span> {activeKpi.name}</div>
              <div><span className="font-semibold text-slate-700">Pillar:</span> {activeKpi.pillar}</div>
              <div><span className="font-semibold text-slate-700">Baseline:</span> {activeKpi.baseline} {activeKpi.unit}</div>
              <div><span className="font-semibold text-slate-700">Current:</span> {activeKpi.current} {activeKpi.unit}</div>
              <div><span className="font-semibold text-slate-700">Target:</span> {activeKpi.target} {activeKpi.unit}</div>
            </div>
            <div className="flex items-center justify-end mt-6">
              <button
                onClick={() => setActiveKpiId(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammeView;
