
import React, { useState } from 'react';
import { GLP_MEDICATIONS } from '../constants';
import { PatientProfile } from '../types';

interface PatientOnboardingProps {
  onComplete: (profile: PatientProfile) => void;
}

const PatientOnboarding: React.FC<PatientOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<PatientProfile>({
    age: 30,
    gender: 'Other',
    height: 170,
    weight: 85,
    medication: GLP_MEDICATIONS[0],
    dosage: '0.25mg',
    conditions: []
  });

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 mx-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          ))}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          {step === 1 && "Basic Profile"}
          {step === 2 && "Medication Details"}
          {step === 3 && "Health History"}
        </h2>
        <p className="text-slate-500 text-sm">Help us personalize your care loop.</p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                type="number" 
                value={profile.age} 
                onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                <input 
                  type="number" 
                  value={profile.height} 
                  onChange={e => setProfile({...profile, height: parseInt(e.target.value)})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg)</label>
                <input 
                  type="number" 
                  value={profile.weight} 
                  onChange={e => setProfile({...profile, weight: parseInt(e.target.value)})}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Medication</label>
              <select 
                value={profile.medication}
                onChange={e => setProfile({...profile, medication: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 ring-blue-500 focus:outline-none"
              >
                {GLP_MEDICATIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Dosage</label>
              <input 
                type="text" 
                value={profile.dosage} 
                onChange={e => setProfile({...profile, dosage: e.target.value})}
                placeholder="e.g. 0.25mg"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 ring-blue-500 focus:outline-none"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Known Conditions (Optional)</label>
              <textarea 
                placeholder="e.g. Type 2 Diabetes, High Blood Pressure"
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 ring-blue-500 focus:outline-none"
                onChange={e => setProfile({...profile, conditions: e.target.value.split(',').map(s => s.trim())})}
              />
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
              <i className="fa-solid fa-shield-halved text-blue-600 mt-1"></i>
              <p className="text-xs text-blue-800 leading-relaxed">
                Your data is stored securely and is only accessible by your assigned doctor and nutritionist.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        {step > 1 && (
          <button onClick={prev} className="flex-1 py-3 px-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Back
          </button>
        )}
        <button 
          onClick={step === 3 ? () => onComplete(profile) : next}
          className="flex-[2] py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-shadow shadow-lg"
        >
          {step === 3 ? "Complete Setup" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default PatientOnboarding;
