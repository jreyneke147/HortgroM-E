
import React, { useMemo, useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  Search, 
  Download, 
  UserCheck, 
  FileCheck,
  Server
} from 'lucide-react';

interface GovernanceViewProps {
  onToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AUDIT_LOGS = [
  { id: 'log-1', action: 'KPI Modification', user: 'Sarah Jenkins', time: '10 mins ago', resource: 'Commercialisation Framework' },
  { id: 'log-2', action: 'Bulk Data Upload', user: 'James Van Wyk', time: '1 hour ago', resource: 'Western Cape Entities' },
  { id: 'log-3', action: 'Role Update', user: 'System Administrator', time: '3 hours ago', resource: 'L. Zulu (Field Officer)' },
  { id: 'log-4', action: 'GIS Export', user: 'M. Botha', time: '1 day ago', resource: 'National Map Layers' }
];

const GovernanceView: React.FC<GovernanceViewProps> = ({ onToast }) => {
  const [activeMatrix, setActiveMatrix] = useState<'roles' | 'permissions'>('roles');
  const [auditSearch, setAuditSearch] = useState('');
  const [isKeysOpen, setIsKeysOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keys, setKeys] = useState([
    { id: 'key-1', label: 'Primary Encryption Key', status: 'Active', rotated: '2024-02-14' },
    { id: 'key-2', label: 'Backup Encryption Key', status: 'Standby', rotated: '2023-12-01' }
  ]);

  const filteredLogs = useMemo(() => {
    return AUDIT_LOGS.filter((log) =>
      [log.action, log.user, log.resource].some((value) => value.toLowerCase().includes(auditSearch.toLowerCase()))
    );
  }, [auditSearch]);

  const handleAuditDownload = () => {
    const blob = new Blob(
      [
        filteredLogs
          .map((log) => `${log.time},${log.user},${log.action},${log.resource}`)
          .join('\n')
      ],
      { type: 'text/csv' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'audit-log.csv';
    link.click();
    URL.revokeObjectURL(url);
    onToast?.('Audit log exported.', 'success');
  };

  const handleGenerateAudit = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      onToast?.('Compliance audit generated.', 'success');
    } catch (error) {
      onToast?.('Unable to generate audit.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRotateKey = (id: string) => {
    if (!confirm('Rotate this key? Existing sessions will be re-encrypted.')) {
      return;
    }
    setKeys((prev) =>
      prev.map((key) => (key.id === id ? { ...key, rotated: new Date().toISOString().split('T')[0], status: 'Active' } : key))
    );
    onToast?.('Key rotation completed.', 'success');
  };

  const handleDisableKey = (id: string) => {
    if (!confirm('Disable this key? This action is reversible.')) {
      return;
    }
    setKeys((prev) => prev.map((key) => (key.id === id ? { ...key, status: 'Disabled' } : key)));
    onToast?.('Key disabled.', 'info');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Governance & POPIA</h1>
          <p className="text-gray-500 mt-1">Manage data privacy, user permissions, and audit compliance.</p>
        </div>
        <div className="flex gap-3">
           <button
             onClick={() => setIsKeysOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all"
           >
            <Lock size={18} /> Manage Keys
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance Score */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-green-400 to-blue-500"></div>
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={40} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">POPIA Compliance Score</h3>
          <div className="text-5xl font-black text-green-600 my-4">98.4%</div>
          <p className="text-sm text-gray-500 mb-8">All data modules are currently encrypted and anonymized according to South African regulations.</p>
          <button
            onClick={handleGenerateAudit}
            disabled={isGenerating}
            className="w-full py-4 border-2 border-green-100 rounded-2xl text-green-600 font-bold text-sm hover:bg-green-50 transition-all disabled:opacity-60"
          >
            {isGenerating ? 'Generating audit...' : 'Generate Compliance Audit'}
          </button>
        </div>

        {/* Access Control Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-lg">System Access Matrix</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveMatrix('roles')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg ${activeMatrix === 'roles' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                Roles
              </button>
              <button
                onClick={() => setActiveMatrix('permissions')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg ${activeMatrix === 'permissions' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                Permissions
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {(activeMatrix === 'roles'
              ? [
                  { role: 'Administrator', users: 3, access: 'Full Access', color: 'bg-red-50 text-red-600' },
                  { role: 'Programme Manager', users: 12, access: 'Assigned Programs Only', color: 'bg-blue-50 text-blue-600' },
                  { role: 'Field Officer', users: 45, access: 'Write Only / Specific Regions', color: 'bg-green-50 text-green-600' },
                  { role: 'Industry Evaluator', users: 8, access: 'Read-Only / Aggregate Only', color: 'bg-purple-50 text-purple-600' }
                ]
              : [
                  { role: 'Data Collection', users: 45, access: 'Capture + Validate', color: 'bg-green-50 text-green-600' },
                  { role: 'Strategic Planning', users: 12, access: 'Read + Export', color: 'bg-blue-50 text-blue-600' },
                  { role: 'Executive Oversight', users: 3, access: 'Full Audit', color: 'bg-red-50 text-red-600' },
                  { role: 'External Review', users: 8, access: 'Read-Only', color: 'bg-purple-50 text-purple-600' }
                ]
            ).map((role, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${role.color.replace('text-', 'bg-').split('-')[0]}-${role.color.split('-')[1]} ${role.color}`}>
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{role.role}</h5>
                    <div className="text-xs text-gray-400">{role.users} active accounts</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${role.color}`}>
                    {role.access}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 text-slate-400 rounded-xl">
              <Eye size={20} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Real-time Audit Trail</h3>
              <p className="text-slate-400 text-xs mt-1">Transparent log of all sensitive data modifications.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2 text-slate-500" size={14} />
              <input
                type="text"
                value={auditSearch}
                onChange={(event) => setAuditSearch(event.target.value)}
                placeholder="Filter audit logs..."
                className="bg-slate-800 border-none text-xs text-white rounded-lg pl-9 pr-4 py-2 w-64 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <button
              onClick={handleAuditDownload}
              className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
        
        <div className="p-8">
          <div className="space-y-4">
            {filteredLogs.length === 0 && (
              <div className="text-slate-500 text-sm">No audit entries match that filter.</div>
            )}
            {filteredLogs.map((log, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0 group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-500 group-hover:text-green-400 transition-colors">
                    <FileCheck size={16} />
                  </div>
                  <div>
                    <div className="text-slate-200 text-sm font-bold">{log.action}</div>
                    <div className="text-slate-500 text-xs">Target: <span className="text-slate-400">{log.resource}</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-slate-300 text-xs font-medium">{log.user}</div>
                  <div className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">{log.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-slate-950/50 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <Server size={14} />
            Data Hosting: Cape Town (AWS-af-south-1)
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
            Encryption: AES-256 Bit
          </div>
        </div>
      </div>

      {isKeysOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Key Management</h3>
              <button onClick={() => setIsKeysOpen(false)} className="text-gray-400 hover:text-gray-600">Close</button>
            </div>
            <div className="space-y-4">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                  <div>
                    <div className="font-semibold text-slate-900">{key.label}</div>
                    <div className="text-xs text-gray-400">Last rotated: {key.rotated}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase text-slate-500">{key.status}</span>
                    <button
                      onClick={() => handleRotateKey(key.id)}
                      className="text-xs font-bold text-green-600 hover:underline"
                    >
                      Rotate
                    </button>
                    <button
                      onClick={() => handleDisableKey(key.id)}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Disable
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end mt-6">
              <button
                onClick={() => {
                  setKeys((prev) => [
                    { id: `key-${crypto.randomUUID()}`, label: 'New Encryption Key', status: 'Standby', rotated: new Date().toISOString().split('T')[0] },
                    ...prev
                  ]);
                  onToast?.('New key generated.', 'success');
                }}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800"
              >
                Generate New Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernanceView;
