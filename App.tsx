
import React, { useState, useEffect, useCallback } from 'react';
import { User, Role, Message, PatientProfile, PatientData, AppConfig } from './types';
import { DEFAULT_SYSTEM_INSTRUCTION } from './constants';
import ChatInterface from './components/ChatInterface';
import PatientOnboarding from './components/PatientOnboarding';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { getAIResponse } from './services/geminiService';

const App: React.FC = () => {
  // Persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('glp_users');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [patients, setPatients] = useState<PatientData[]>(() => {
    const saved = localStorage.getItem('glp_patients');
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('glp_config');
    return saved ? JSON.parse(saved) : { aiSystemInstruction: DEFAULT_SYSTEM_INSTRUCTION };
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [form, setForm] = useState({ name: '', email: '', role: Role.PATIENT });
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // Auto-save to localStorage
  useEffect(() => { localStorage.setItem('glp_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('glp_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('glp_config', JSON.stringify(config)); }, [config]);

  const handleAuth = () => {
    if (authMode === 'signup') {
      const newUser: User = { id: Math.random().toString(36).substr(2, 9), ...form };
      setUsers([...users, newUser]);
      if (form.role === Role.PATIENT) {
        setPatients([...patients, { 
          userId: newUser.id, 
          profile: { age: 0, gender: '', height: 0, weight: 0, medication: '', dosage: '', conditions: [] },
          messages: [],
          sosActive: false,
          onboarded: false
        }]);
      }
      setCurrentUser(newUser);
    } else {
      const user = users.find(u => u.email === form.email);
      if (user) setCurrentUser(user);
      else alert("User not found");
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!currentUser) return;

    const targetPatientId = (currentUser.role === Role.PATIENT) ? currentUser.id : selectedPatientId;
    if (!targetPatientId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toISOString()
    };

    setPatients(prev => prev.map(p => {
      if (p.userId === targetPatientId) {
        const updatedMessages = [...p.messages, newMessage];
        
        // Trigger AI if it's the patient and no SOS
        if (currentUser.role === Role.PATIENT && !p.sosActive) {
          getAIResponse(text, updatedMessages, p.profile, config.aiSystemInstruction).then(res => {
             const aiMsg: Message = {
               id: 'ai-' + Date.now(),
               senderId: 'ai',
               senderName: 'Assistant',
               senderRole: 'AI',
               text: res,
               timestamp: new Date().toISOString()
             };
             setPatients(curr => curr.map(cp => cp.userId === targetPatientId ? { ...cp, messages: [...cp.messages, aiMsg] } : cp));
          });
        }
        return { ...p, messages: updatedMessages };
      }
      return p;
    }));
  }, [currentUser, selectedPatientId, config]);

  const handleTriggerSOS = () => {
    if (currentUser?.role !== Role.PATIENT) return;
    setPatients(prev => prev.map(p => p.userId === currentUser.id ? { ...p, sosActive: true } : p));
  };

  const handleAssign = (patientId: string, doctorId: string, coachId: string) => {
    setUsers(prev => prev.map(u => u.id === patientId ? { ...u, assignedDoctorId: doctorId, assignedCoachId: coachId } : u));
  };

  // Auth Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-slate-900 font-sans relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-50 rounded-full translate-y-1/2 -translate-x-1/2 -z-10"></div>
        
        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
          <i className="fa-solid fa-heart-pulse text-white text-3xl"></i>
        </div>
        
        <h1 className="text-3xl font-black mb-1 tracking-tighter uppercase">CARE LOOP</h1>
        <p className="text-slate-400 mb-10 text-[10px] font-black tracking-[0.2em] uppercase">AI-First Clinical Oversight</p>
        
        <div className="w-full max-w-sm">
          <div className="bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-2xl">
            <h2 className="text-xl font-black mb-6 uppercase tracking-tight">{authMode}</h2>
            <div className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:outline-none font-bold text-sm"
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Role</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:outline-none font-bold text-sm appearance-none"
                      onChange={e => setForm({...form, role: e.target.value as Role})}
                    >
                      <option value={Role.PATIENT}>Patient</option>
                      <option value={Role.DOCTOR}>Medical Doctor</option>
                      <option value={Role.FITNESS_COACH}>Fitness Coach</option>
                      <option value={Role.ADMIN}>Administrator</option>
                    </select>
                  </div>
                </>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-slate-900 focus:outline-none font-bold text-sm"
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
              <button 
                onClick={handleAuth} 
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg hover:bg-black transition-all uppercase tracking-[0.15em] text-xs mt-4"
              >
                {authMode}
              </button>
              <button 
                className="w-full text-center text-[10px] font-black text-slate-400 mt-4 uppercase tracking-widest hover:text-slate-900 transition-colors" 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              >
                {authMode === 'login' ? "Need an account? Sign Up" : "Back to Log In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  if (currentUser.role === Role.ADMIN) {
    return <AdminDashboard users={users} patients={patients} config={config} onAssign={handleAssign} onUpdateAI={(s) => setConfig({aiSystemInstruction: s})} />;
  }

  // Patient View
  if (currentUser.role === Role.PATIENT) {
    const patientData = patients.find(p => p.userId === currentUser.id);
    if (!patientData?.onboarded) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col p-8">
          <PatientOnboarding onComplete={(profile) => {
            setPatients(prev => prev.map(p => p.userId === currentUser.id ? { ...p, profile, onboarded: true } : p));
          }} />
        </div>
      );
    }
    return (
      <div className="h-screen flex flex-col bg-slate-50 p-4">
        <div className="max-w-md mx-auto w-full h-full flex flex-col gap-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold">
                 {currentUser.name[0]}
               </div>
               <div>
                 <h4 className="text-sm font-black text-slate-800">{currentUser.name}</h4>
                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-tight">{patientData.profile.medication}</p>
               </div>
             </div>
             <button onClick={() => setCurrentUser(null)} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 transition-colors">
               <i className="fa-solid fa-power-off text-xs"></i>
             </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatInterface 
              currentUser={currentUser}
              messages={patientData.messages}
              onSendMessage={handleSendMessage}
              onTriggerSOS={handleTriggerSOS}
              sosActive={patientData.sosActive}
              profile={patientData.profile}
            />
          </div>
        </div>
      </div>
    );
  }

  // Provider View (Doctor / Coach)
  const myPatientsData = patients.filter(p => {
    const u = users.find(user => user.id === p.userId);
    return currentUser.role === Role.DOCTOR ? u?.assignedDoctorId === currentUser.id : u?.assignedCoachId === currentUser.id;
  });

  const activeChatPatient = myPatientsData.find(p => p.userId === selectedPatientId) || myPatientsData[0];

  return (
    <div className="h-screen flex bg-white overflow-hidden font-sans">
      <div className="w-80 bg-slate-50 border-r flex flex-col shrink-0">
        <div className="p-8 border-b bg-white">
           <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">CLINICAL PANEL</h2>
           <p className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">{currentUser.role.replace('_', ' ')}</p>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-6 mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <i className="fa-solid fa-users-viewfinder"></i> Active Caseload
            </h3>
          </div>
          <div className="space-y-1">
            {myPatientsData.map(p => (
              <button 
                key={p.userId}
                onClick={() => setSelectedPatientId(p.userId)}
                className={`w-full px-6 py-4 text-left transition-all flex items-center gap-4 relative group ${selectedPatientId === p.userId ? 'bg-white' : 'hover:bg-slate-100'}`}
              >
                {selectedPatientId === p.userId && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900 rounded-r-full"></div>}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold relative ${p.sosActive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'}`}>
                  {users.find(u => u.id === p.userId)?.name[0]}
                  {p.sosActive && <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-600 rounded-full border-2 border-red-600 flex items-center justify-center text-[8px] font-black italic">!</span>}
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-black text-slate-800 truncate">{users.find(u => u.id === p.userId)?.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-black tracking-tighter truncate">{p.profile.medication}</div>
                </div>
              </button>
            ))}
            {myPatientsData.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <i className="fa-solid fa-folder-open text-xl"></i>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No assigned patients</p>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 border-t bg-white">
          <button 
            onClick={() => setCurrentUser(null)} 
            className="w-full py-3 border-2 border-slate-100 text-[10px] font-black text-slate-400 hover:text-red-500 hover:border-red-100 rounded-2xl transition-all uppercase tracking-widest"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-slate-50/50 p-8 overflow-hidden">
        {activeChatPatient ? (
          <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-end shrink-0">
               <div>
                 <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">
                   {users.find(u => u.id === activeChatPatient.userId)?.name}
                 </h1>
                 <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Patient ID: {activeChatPatient.userId}</span>
                   <span className={`w-1 h-1 rounded-full bg-slate-300`}></span>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{activeChatPatient.profile.medication}</span>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 {activeChatPatient.sosActive && (
                   <div className="bg-red-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black animate-pulse flex items-center gap-3 shadow-xl shadow-red-200 uppercase tracking-widest">
                     <i className="fa-solid fa-phone-volume"></i> Priority Intervention Active
                   </div>
                 )}
                 <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest">
                   <i className="fa-solid fa-circle-check text-emerald-500"></i> Clinical Loop Secured
                 </div>
               </div>
            </div>
            
            <div className="flex-1 min-h-0">
               <ChatInterface 
                 currentUser={currentUser}
                 messages={activeChatPatient.messages}
                 onSendMessage={handleSendMessage}
                 onTriggerSOS={() => {}}
                 sosActive={activeChatPatient.sosActive}
                 profile={activeChatPatient.profile}
               />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-white rounded-[2rem] border-2 border-slate-100 flex items-center justify-center mb-6 shadow-xl text-slate-200">
               <i className="fa-solid fa-message text-3xl"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Awaiting Case Selection</h3>
            <p className="text-xs text-slate-400 font-medium max-w-xs uppercase tracking-widest">Select a patient from your caseload to begin oversight.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
