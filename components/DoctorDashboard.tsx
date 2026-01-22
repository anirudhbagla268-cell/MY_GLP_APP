
import React from 'react';
import { PatientData, Role, User } from '../types';

interface DoctorDashboardProps {
  patients: PatientData[];
  users: User[];
  onSelectPatient: (patient: PatientData) => void;
  selectedPatientId?: string;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ patients, users, onSelectPatient, selectedPatientId }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-80 shrink-0 overflow-hidden">
      <div className="p-4 border-b bg-slate-50">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          <i className="fa-solid fa-list-check text-emerald-600"></i>
          Patient Care List
        </h2>
        <div className="relative mt-3">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-xs focus:ring-1 ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {patients.map(p => {
          // Fix: Resolve user from the users array to get the display name
          const user = users.find(u => u.id === p.userId);
          const displayName = user?.name || 'Unknown Patient';

          return (
            <button
              // Fix: Changed p.id to p.userId as per PatientData interface
              key={p.userId}
              onClick={() => onSelectPatient(p)}
              className={`w-full p-4 flex items-center gap-3 border-b border-slate-50 hover:bg-slate-50 transition-colors relative ${
                // Fix: Changed p.id to p.userId
                selectedPatientId === p.userId ? 'bg-emerald-50' : ''
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                  {/* Fix: Changed p.name to displayName */}
                  {displayName.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  // Fix: Changed p.status check to p.sosActive boolean check
                  p.sosActive ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                }`}></div>
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                  {/* Fix: Changed p.name to displayName */}
                  <h4 className="font-bold text-slate-800 text-sm truncate">{displayName}</h4>
                  <span className="text-[10px] text-slate-400">12m</span>
                </div>
                <p className="text-xs text-slate-500 truncate italic">
                  {p.messages[p.messages.length - 1]?.text || 'No messages yet'}
                </p>
              </div>
              {/* Fix: Changed p.status to p.sosActive */}
              {p.sosActive && (
                <div className="bg-red-100 text-red-600 p-1.5 rounded-lg">
                  <i className="fa-solid fa-phone-volume text-xs"></i>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4 bg-slate-50 border-t mt-auto">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          SLA Tracker
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-600">SOS Response</span>
            <span className="text-xs font-bold text-emerald-600">1.2m avg</span>
          </div>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[95%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
