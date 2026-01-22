
import React from 'react';
import { PatientData } from '../types';

interface NutritionistSidebarProps {
  selectedPatient: PatientData;
}

const NutritionistSidebar: React.FC<NutritionistSidebarProps> = ({ selectedPatient }) => {
  return (
    <div className="space-y-4 shrink-0">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Health Targets</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Daily Protein (90g target)</span>
              <span className="font-bold text-orange-600">72g</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full w-[80%] rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600">Water Intake (3L target)</span>
              <span className="font-bold text-blue-600">1.8L</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[60%] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <i className="fa-solid fa-person-walking text-blue-500 mb-1"></i>
          <span className="block text-[10px] text-slate-400 font-bold uppercase">Steps</span>
          <span className="text-lg font-black text-slate-800">6,432</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm text-center">
          <i className="fa-solid fa-bed text-purple-500 mb-1"></i>
          <span className="block text-[10px] text-slate-400 font-bold uppercase">Sleep</span>
          <span className="text-lg font-black text-slate-800">7.2h</span>
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
         <h5 className="text-[10px] font-black text-orange-800 uppercase mb-1">Coach Note</h5>
         <p className="text-[11px] text-orange-700 leading-tight">
           Patient weight is stable at {selectedPatient.profile.weight}kg. Suggest increasing fiber to mitigate GLP-1 related constipation.
         </p>
      </div>
    </div>
  );
};

export default NutritionistSidebar;
