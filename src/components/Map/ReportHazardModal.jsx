import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  X, 
  Send, 
  MapPin, 
  Camera, 
  AlertTriangle, 
  Droplets, 
  CloudLightning, 
  Wind, 
  Trees, 
  CloudFog, 
  Flame 
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function ReportHazardModal({ isOpen, onClose, defaultLocation }) {
  const { handleAddReport, selectedLocation } = useWeather();

  const [type, setType] = useState('waterlogging');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [severity, setSeverity] = useState('high'); // low, moderate, high, extreme
  const [userBadge, setUserBadge] = useState('Community Member');

  if (!isOpen) return null;

  const hazardTypes = [
    { id: 'waterlogging', label: 'Waterlogging / Flooded Road', icon: Droplets, color: 'text-blue-500' },
    { id: 'hailstorm', label: 'Hailstorm / Ice', icon: CloudLightning, color: 'text-purple-500' },
    { id: 'tree_fallen', label: 'Tree / Pole Fallen', icon: Trees, color: 'text-amber-500' },
    { id: 'smog', label: 'Severe Smog / Dust', icon: CloudFog, color: 'text-slate-500' },
    { id: 'heavy_rain', label: 'Torrential Rain Started', icon: Droplets, color: 'text-cyan-500' },
    { id: 'heatwave', label: 'Extreme Heat Island', icon: Flame, color: 'text-red-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) {
      alert("Please provide a brief description of the condition.");
      return;
    }

    const reportObj = {
      type,
      title: title.trim() || `${hazardTypes.find(h => h.id === type)?.label} Reported`,
      description: description.trim(),
      location: {
        name: selectedLocation.name,
        lat: selectedLocation.lat + (Math.random() - 0.5) * 0.02,
        lon: selectedLocation.lon + (Math.random() - 0.5) * 0.02,
        landmark: landmark.trim() || "Near Sector Center"
      },
      severity,
      user: "You (Verified User)",
      userBadge: "Community Scout",
      tags: [type.replace('_', ' ').toUpperCase(), `${severity.toUpperCase()} Priority`]
    };

    handleAddReport(reportObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950 text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Report Micro-Climate Hazard
              </h3>
              <p className="text-xs text-slate-500">
                Help your local community stay safe with live ground updates
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Hazard Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              HAZARD CATEGORY
            </label>
            <div className="grid grid-cols-2 gap-2">
              {hazardTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = type === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setType(item.id);
                      soundManager.playChime();
                    }}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left text-xs transition ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-500 text-sky-700 dark:text-sky-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              SEVERITY LEVEL
            </label>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { id: 'low', label: 'Low', color: 'bg-emerald-500' },
                { id: 'moderate', label: 'Moderate', color: 'bg-amber-500' },
                { id: 'high', label: 'High', color: 'bg-orange-500' },
                { id: 'extreme', label: 'Extreme', color: 'bg-red-600' }
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSeverity(s.id)}
                  className={`py-1.5 rounded-lg border font-semibold capitalize transition ${
                    severity === s.id
                      ? `${s.color} text-white border-transparent shadow-sm`
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location & Landmark */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              SPECIFIC LOCATION & LANDMARK
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={`e.g. Near Electronic City Underpass, ${selectedLocation.name}`}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              DETAILS / ADVICE FOR COMMUTERS
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Water accumulated up to 1.5 feet. Two-wheelers getting stuck, suggest taking the flyover instead..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Report</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
