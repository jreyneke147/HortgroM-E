
import React from 'react';
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

const GovernanceView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Governance & POPIA</h1>
          <p className="text-gray-500 mt-1">Manage data privacy, user permissions, and audit compliance.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all">
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
          <button className="w-full py-4 border-2 border-green-100 rounded-2xl text-green-600 font-bold text-sm hover:bg-green-50 transition-all">
            Generate Compliance Audit
          </button>
        </div>

        {/* Access Control Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-lg">System Access Matrix</h3>
            <div className="flex gap-2">
              <button className="text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100">Roles</button>
              <button className="text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100">Permissions</button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { role: 'Administrator', users: 3, access: 'Full Access', color: 'bg-red-50 text-red-600' },
              { role: 'Programme Manager', users: 12, access: 'Assigned Programs Only', color: 'bg-blue-50 text-blue-600' },
              { role: 'Field Officer', users: 45, access: 'Write Only / Specific Regions', color: 'bg-green-50 text-green-600' },
              { role: 'Industry Evaluator', users: 8, access: 'Read-Only / Aggregate Only', color: 'bg-purple-50 text-purple-600' }
            ].map((role, i) => (
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
              <input type="text" placeholder="Filter audit logs..." className="bg-slate-800 border-none text-xs text-white rounded-lg pl-9 pr-4 py-2 w-64 focus:ring-1 focus:ring-green-500" />
            </div>
            <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"><Download size={18} /></button>
          </div>
        </div>
        
        <div className="p-8">
          <div className="space-y-4">
            {[
              { action: 'KPI Modification', user: 'Sarah Jenkins', time: '10 mins ago', resource: 'Commercialisation Framework' },
              { action: 'Bulk Data Upload', user: 'James Van Wyk', time: '1 hour ago', resource: 'Western Cape Entities' },
              { action: 'Role Update', user: 'System Administrator', time: '3 hours ago', resource: 'L. Zulu (Field Officer)' },
              { action: 'GIS Export', user: 'M. Botha', time: '1 day ago', resource: 'National Map Layers' }
            ].map((log, i) => (
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
    </div>
  );
};

export default GovernanceView;
