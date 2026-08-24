import React, { useState } from 'react';
import { 
  Heart, 
  Footprints, 
  Compass, 
  TrainTrack, 
  Sparkles, 
  Check, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function ProfileSetupScreen({ userName, onCompleteSetup }) {
  const [selectedProfile, setSelectedProfile] = useState('general');
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState(['asthma']);

  const profiles = [
    {
      id: 'health_conscious',
      name: 'Health-Conscious',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      tagline: 'Focus on AQI, Pollen & Health Safety'
    },
    {
      id: 'fitness',
      name: 'Outdoor Fitness',
      icon: Footprints,
      color: 'from-emerald-500 to-teal-600',
      tagline: 'Best Running Hours & Thermal Stress'
    },
    {
      id: 'traveler',
      name: 'Traveler & Tourist',
      icon: Compass,
      color: 'from-purple-500 to-indigo-600',
      tagline: 'Destination Forecasts & Rain Chance'
    },
    {
      id: 'commuter',
      name: 'Daily Commuter',
      icon: TrainTrack,
      color: 'from-amber-500 to-orange-600',
      tagline: 'Waterlogging & Route Conditions'
    },
    {
      id: 'general',
      name: 'General User',
      icon: Sparkles,
      color: 'from-sky-500 to-cyan-600',
      tagline: 'Balanced Overview & Recommendations'
    }
  ];

  const vulnerabilities = [
    { id: 'asthma', label: 'Asthma / Bronchial Sensitivity' },
    { id: 'dust_allergy', label: 'Dust & Pollen Allergies' },
    { id: 'elderly', label: 'Senior Citizen in Household' },
    { id: 'child', label: 'Young Children in Household' }
  ];

  const handleToggleVulnerability = (id) => {
    soundManager.playChime();
    setSelectedVulnerabilities(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    soundManager.playSuccess();
    onCompleteSetup(selectedProfile, selectedVulnerabilities);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-5 sm:p-8 relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-lg mx-auto w-full text-center space-y-2 pt-2">
        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider bg-white/10 text-cyan-300 border border-white/10 uppercase">
          STEP 2 OF 2: PERSONALIZATION
        </span>
        <h1 className="text-2xl font-black text-white">
          Welcome, {userName || 'Friend'}! 👋
        </h1>
        <p className="text-xs text-slate-300 font-medium">
          Choose your primary daily persona so Mausam Sathi can customize your safety algorithm and home dashboard.
        </p>
      </div>

      {/* Center Persona Selector */}
      <div className="relative z-10 max-w-lg mx-auto w-full space-y-4 my-auto py-4">
        
        {/* Persona Options */}
        <div className="space-y-2.5">
          {profiles.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedProfile === p.id;
            return (
              <div
                key={p.id}
                onClick={() => {
                  soundManager.playChime();
                  setSelectedProfile(p.id);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-white/15 border-cyan-400 shadow-lg ring-2 ring-cyan-400/30 transform scale-[1.01]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${p.color} flex items-center justify-center text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold block text-white">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-slate-300">
                      {p.tagline}
                    </span>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                  isSelected ? 'bg-cyan-400 border-cyan-400 text-slate-900' : 'border-slate-500'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Health Traits */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
            Any health sensitivities to account for? (Optional)
          </span>
          <div className="grid grid-cols-2 gap-2">
            {vulnerabilities.map((v) => {
              const isChecked = selectedVulnerabilities.includes(v.id);
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleToggleVulnerability(v.id)}
                  className={`p-2 rounded-xl text-left text-[11px] font-medium border transition ${
                    isChecked
                      ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isChecked ? '✓ ' : '+ '} {v.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Launch Button */}
      <div className="relative z-10 max-w-lg mx-auto w-full">
        <button
          onClick={handleFinish}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-sky-600/30 flex items-center justify-center space-x-2 transition transform active:scale-[0.98]"
        >
          <span>Launch Mausam Sathi App</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
