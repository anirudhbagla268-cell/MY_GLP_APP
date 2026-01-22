
import React, { useState } from 'react';
import { User, Role, PatientData, AppConfig } from '../types';

interface AdminDashboardProps {
  users: User[];
  patients: PatientData[];
  config: AppConfig;
  onAssign: (patientId: string, doctorId: string, coachId: string) => void;
  onUpdateAI: (instruction: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, patients, config, onAssign, onUpdateAI }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'ai'>('users');
  const [editingAI, setEditingAI] = useState(config.aiSystemInstruction);

  const doctors = users.filter(u => u.role === Role.DOCTOR);
  const coaches = users.filter(u => u.role === Role.FITNESS_COACH);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">ADMIN COMMAND CENTER</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">System Management & AI Training</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border'}`}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'ai' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-slate-600 border'}`}
          >
            AI Training Lab
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'users' ? (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-700">PATIENT TRIAGE & ASSIGNMENT</h3>
                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-bold">
                  {patients.length} Registered
                </span>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-6 py-4">Patient Name</th>
                    <th className="px-6 py-4">Medication</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Assigned Doctor</th>
                    <th className="px-6 py-4">Fitness Coach</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map(p => {
                    const user = users.find(u => u.id === p.userId);
                    if (!user) return null;
                    return (
                      <tr key={p.userId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800 text-sm">{user.name}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{p.profile?.medication || 'In Onboarding'}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.sosActive ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {p.sosActive ? 'SOS ACTIVE' : 'STABLE'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            className="text-xs border p-1 rounded bg-white w-full"
                            value={user.assignedDoctorId || ''}
                            onChange={(e) => onAssign(p.userId, e.target.value, user.assignedCoachId || '')}
                          >
                            <option value="">Unassigned</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            className="text-xs border p-1 rounded bg-white w-full"
                            value={user.assignedCoachId || ''}
                            onChange={(e) => onAssign(p.userId, user.assignedDoctorId || '', e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {coaches.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-blue-600"><i className="fa-solid fa-eye"></i></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-purple-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-2xl">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">AI PROTOCOL TRAINING</h3>
                  <p className="text-sm text-slate-500">Fine-tune how the Gemini model responds to all patients.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Base System Instruction</label>
                <textarea 
                  className="w-full h-80 p-4 border-2 border-slate-100 rounded-xl font-mono text-sm focus:border-purple-300 focus:outline-none bg-slate-50"
                  value={editingAI}
                  onChange={(e) => setEditingAI(e.target.value)}
                  placeholder="Enter the core rules for the AI Care Assistant..."
                />
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setEditingAI(config.aiSystemInstruction)}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                  >
                    Reset Changes
                  </button>
                  <button 
                    onClick={() => onUpdateAI(editingAI)}
                    className="px-6 py-2 rounded-xl text-sm font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-lg transition-all"
                  >
                    Deploy AI Update
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
              <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
              <div className="text-xs text-blue-800 leading-relaxed">
                <p className="font-bold mb-1 uppercase tracking-widest">Pro Tip</p>
                Changes to the System Instruction are applied instantly. Test prompts by chatting as a patient in a separate window to observe updated behavior.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
