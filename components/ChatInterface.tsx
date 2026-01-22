
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role, User, PatientProfile } from '../types';
import { ROLE_ICONS } from '../constants';

interface ChatInterfaceProps {
  currentUser: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onTriggerSOS: () => void;
  sosActive: boolean;
  profile: PatientProfile;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  currentUser, 
  messages, 
  onSendMessage, 
  onTriggerSOS, 
  sosActive,
  profile
}) => {
  const [inputText, setInputText] = useState('');
  const [showSOSModal, setShowSOSModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const confirmSOS = () => {
    setShowSOSModal(false);
    onTriggerSOS();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xl relative">
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b shrink-0 z-10 ${sosActive ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${sosActive ? 'bg-red-600' : 'bg-purple-600'}`}>
              <i className={`fa-solid ${sosActive ? 'fa-triangle-exclamation text-white' : 'fa-robot text-white'} text-[10px]`}></i>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white shadow-sm">
              <i className="fa-solid fa-user-md text-white text-[10px]"></i>
            </div>
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-wider">
              {sosActive ? 'EMERGENCY CHANNEL' : 'CARE LOOP ACTIVE'}
            </h3>
            <div className="flex items-center gap-1.5">
               <span className={`w-1.5 h-1.5 rounded-full ${sosActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">AI + CLINICAL TEAM ONLINE</p>
            </div>
          </div>
        </div>
        
        {currentUser.role === Role.PATIENT && !sosActive && (
          <button 
            onClick={() => setShowSOSModal(true)}
            className="px-3 py-1.5 rounded-lg text-[10px] font-black bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            <i className="fa-solid fa-bolt mr-1"></i> SOS
          </button>
        )}
      </div>

      {/* SOS Active Banner */}
      {sosActive && (
        <div className="bg-red-600 text-white py-1.5 px-4 text-[9px] font-black text-center uppercase tracking-[0.2em] animate-pulse shrink-0 z-10">
          Priority Mode • Clinical Team Notified • AI Paused
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-hide">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm relative ${
              msg.senderId === currentUser.id 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : msg.senderRole === 'AI'
                ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                : 'bg-emerald-50 border border-emerald-100 text-slate-800 rounded-tl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-black opacity-60 flex items-center gap-1 uppercase tracking-widest">
                  {ROLE_ICONS[msg.senderRole] || <i className="fa-solid fa-user"></i>}
                  {msg.senderName}
                </span>
                {msg.senderRole === 'AI' && (
                  <span className="text-[8px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-black tracking-tighter">AI AGENT</span>
                )}
                {msg.senderRole === Role.DOCTOR && (
                  <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black tracking-tighter">VERIFIED DOCTOR</span>
                )}
              </div>
              <p className="text-[12px] leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
              <div className="flex justify-end mt-1.5">
                <span className="text-[8px] opacity-40 font-bold">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2.5 border border-slate-200 focus-within:ring-2 ring-slate-900 ring-opacity-10 transition-all">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={sosActive ? "Type urgent message..." : "Ask your care team..."}
            className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium py-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-xl disabled:opacity-20 hover:scale-105 transition-transform"
          >
            <i className="fa-solid fa-paper-plane text-[10px]"></i>
          </button>
        </div>
      </div>

      {/* SOS Confirmation Modal */}
      {showSOSModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            </div>
            <h4 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Trigger SOS?</h4>
            <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
              This will immediately notify your assigned medical doctor and nutritionist. AI responses will be paused.
            </p>
            <div className="space-y-3">
              <button 
                onClick={confirmSOS}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-200"
              >
                Yes, Notify Team
              </button>
              <button 
                onClick={() => setShowSOSModal(false)}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
