import React, { useState } from 'react';
import { useWeather, PROFILES, POPULAR_LOCATIONS } from '../../context/WeatherContext';
import { 
  UserCircle, 
  Heart, 
  Footprints, 
  Compass, 
  TrainTrack, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Plus, 
  Trash2, 
  Check,
  CheckCircle2,
  LogOut,
  UserCheck,
  Zap,
  Mail
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function ProfileView() {
  const { 
    user,
    logout,
    profile, 
    setProfile, 
    vulnerabilities, 
    setVulnerabilities, 
    savedLocations, 
    setSavedLocations,
    selectedLocation,
    setSelectedLocation,
    setActiveTab
  } = useWeather();

  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationTag, setNewLocationTag] = useState('Custom');

  const profileList = [
    {
      id: 'health_conscious',
      name: 'Health-Conscious',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      badge: 'Prioritizes AQI, UV, Pollen & Health Safety Score',
      details: 'Tailored for individuals sensitive to air pollutants, seasonal pollen, and UV exposure. Emphasizes respiratory precautions, indoor air advice, and protective gear.'
    },
    {
      id: 'fitness',
      name: 'Outdoor Fitness Enthusiast',
      icon: Footprints,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Prioritizes Best Running Hours & Thermal Stress',
      details: 'Calculates the optimal 1-2 hour training window for running, cycling, and distance cardio based on temperature curves, wind gusts, AQI, and sunrise/sunset.'
    },
    {
      id: 'traveler',
      name: 'Traveler & Tourist',
      icon: Compass,
      color: 'from-purple-500 to-indigo-600',
      badge: 'Prioritizes Destination Forecasts & Rain Chance',
      details: 'Optimized for weekend getaways, sightseeing, and scenic road trips. Provides transit alerts, packing checklists, and rain probability forecasts.'
    },
    {
      id: 'commuter',
      name: 'Daily Commuter',
      icon: TrainTrack,
      color: 'from-amber-500 to-orange-600',
      badge: 'Prioritizes Underpass Waterlogging & Transit Timing',
      details: 'Focuses on peak morning/evening commute hours, road waterlogging warnings from community reports, visibility drops, and monsoon advisories.'
    },
    {
      id: 'general',
      name: 'General User',
      icon: Sparkles,
      color: 'from-sky-500 to-cyan-600',
      badge: 'Balanced Overview & Daily Recommendations',
      details: 'All-round clean dashboard balancing temperature, feels-like, air quality, solar radiation, and everyday lifestyle guidance.'
    }
  ];

  const vulnerabilityOptions = [
    { id: 'asthma', label: 'Asthma / Bronchial Sensitivity', desc: 'Increases sensitivity penalties for PM2.5 & NO₂' },
    { id: 'dust_allergy', label: 'Dust & Pollen Allergy', desc: 'Alerts for sudden pollen spikes and dust storms' },
    { id: 'elderly', label: 'Senior Citizen in Family', desc: 'Heightens heatwave & thermal stress warnings' },
    { id: 'child', label: 'Young Children', desc: 'Highlights UV burn times & outdoor play safety' },
    { id: 'cardio', label: 'Cardiovascular Condition', desc: 'Strict warnings against intense cold/heat exertion' }
  ];

  const handleProfileSelect = (pId) => {
    soundManager.playSuccess();
    setProfile(pId);
  };

  const handleToggleVulnerability = (vId) => {
    soundManager.playChime();
    setVulnerabilities(prev => 
      prev.includes(vId) ? prev.filter(x => x !== vId) : [...prev, vId]
    );
  };

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;

    soundManager.playSuccess();
    const newLoc = {
      name: newLocationName.trim(),
      lat: 28.5355 + (Math.random() - 0.5) * 0.1,
      lon: 77.3910 + (Math.random() - 0.5) * 0.1,
      state: "India",
      tag: newLocationTag
    };

    setSavedLocations(prev => [...prev, newLoc]);
    setNewLocationName('');
  };

  const handleDeleteLocation = (nameToDelete) => {
    soundManager.playChime();
    setSavedLocations(prev => prev.filter(l => l.name !== nameToDelete));
  };

  return (
    <div className="space-y-6 pb-16 sm:pb-8 animate-in fade-in max-w-5xl mx-auto">
      
      {/* User Account Card */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-indigo-950 text-white p-5 sm:p-6 rounded-3xl border border-sky-800/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-sky-500/20 shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'G'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-white">
                {user?.name || 'Guest User'}
              </h2>
              {user?.isGuest ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Guest Mode
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Member
                </span>
              )}
            </div>
            <p className="text-xs text-sky-200/80 mt-0.5 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              <span>{user?.email || 'guest@mausamsathi.in'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-xs font-bold border border-white/15 transition self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{user?.isGuest ? 'Log In / Switch Account' : 'Sign Out'}</span>
        </button>
      </div>

      {/* 1. Profile Switcher Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          1. Select Your Active Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileList.map((p) => {
            const Icon = p.icon;
            const isSelected = profile === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleProfileSelect(p.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-50/90 dark:bg-sky-950/70 border-sky-500 shadow-md ring-2 ring-sky-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="flex items-center space-x-1 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-3">
                    {p.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 block mt-0.5">
                    {p.badge}
                  </span>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {p.details}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {isSelected ? 'Currently Applied' : 'Click to Switch'}
                  </span>
                  {isSelected && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab('dashboard');
                      }}
                      className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
                    >
                      View Dashboard →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Health Sensitivities & Vulnerabilities */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          2. Personal & Household Health Sensitivities
        </h3>
        <p className="text-xs text-slate-500">
          Enabling these calibrates the Dynamic Health Risk Index to apply additional safety margins for your profile.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {vulnerabilityOptions.map((v) => {
            const isChecked = vulnerabilities.includes(v.id);
            return (
              <div
                key={v.id}
                onClick={() => handleToggleVulnerability(v.id)}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  isChecked
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm font-bold block text-slate-800 dark:text-slate-100">
                    {v.label}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {v.desc}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 ml-3 ${
                  isChecked ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isChecked && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Saved Locations Manager */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          3. Saved Locations (Home, Work, Travel)
        </h3>

        {/* Existing Saved Locations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {savedLocations.map((loc) => {
            const isSelected = selectedLocation.name === loc.name;
            return (
              <div
                key={loc.name}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div 
                  className="cursor-pointer flex-1"
                  onClick={() => {
                    setSelectedLocation(loc);
                    soundManager.playSuccess();
                  }}
                >
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate block">
                      {loc.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {loc.tag || 'Saved Place'} {isSelected ? '• (Active)' : ''}
                  </span>
                </div>

                {savedLocations.length > 1 && (
                  <button
                    onClick={() => handleDeleteLocation(loc.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 ml-2"
                    title="Remove location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Location Form */}
        <form onSubmit={handleAddLocation} className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="Add new location (e.g. Sector 18 Noida, Cyber City Gurugram)..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <select
            value={newLocationTag}
            onChange={(e) => setNewLocationTag(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            <option value="Home">Home</option>
            <option value="Work / Office">Work / Office</option>
            <option value="College">College</option>
            <option value="Travel Destination">Travel Destination</option>
          </select>
          <button
            type="submit"
            className="flex items-center justify-center space-x-1 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Place</span>
          </button>
        </form>
      </div>

    </div>
  );
}
