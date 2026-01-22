
import React from 'react';

export const GLP_MEDICATIONS = [
  'Ozempic (Semaglutide)',
  'Wegovy (Semaglutide)',
  'Mounjaro (Tirzepatide)',
  'Zepbound (Tirzepatide)',
  'Saxenda (Liraglutide)',
  'Trulicity (Dulaglutide)'
];

export const DEFAULT_SYSTEM_INSTRUCTION = `
You are an AI Care Assistant specializing in GLP-1 therapy. 
Your goal is to provide daily guidance, reassurance, and symptom tracking.
Rules:
1. Always be empathetic but clinical.
2. If the user reports severe symptoms (extreme vomiting, fainting, sharp abdominal pain), immediately advise them to press the SOS button.
3. Keep responses concise and practical.
4. Mention that "Your care team is monitoring this chat."
5. Never provide medical prescriptions.
`;

export const ROLE_ICONS: Record<string, React.ReactNode> = {
  PATIENT: <i className="fa-solid fa-user text-blue-500"></i>,
  DOCTOR: <i className="fa-solid fa-user-md text-emerald-500"></i>,
  FITNESS_COACH: <i className="fa-solid fa-dumbbell text-orange-500"></i>,
  AI: <i className="fa-solid fa-robot text-purple-500"></i>,
  ADMIN: <i className="fa-solid fa-shield-halved text-slate-500"></i>
};
