import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { X, Check, Sliders, RotateCcw } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function WidgetsCustomizerModal({ isOpen, onClose }) {
  const { widgetConfig, setWidgetConfig } = useWeather();

  if (!isOpen) return null;

  const widgetDefinitions = [
    { key: 'safetyScore', label: 'Health & Safety Score (0-100)', desc: 'Multi-factor risk index & sub-scores' },
    { key: 'runningHours', label: 'Best Outdoor / Running Hours', desc: 'Optimal workout timing window' },
    { key: 'aqi', label: 'Air Quality Index (AQI)', desc: 'Live PM2.5, PM10 and gas breakdown' },
    { key: 'uv', label: 'UV Index & Sun Safety', desc: 'Solar radiation & sun gear checklist' },
    { key: 'humidity', label: 'Humidity & Thermal Comfort', desc: 'Moisture level & sweat efficiency' },
    { key: 'pollen', label: 'Pollen & Allergy Risk', desc: 'Allergen levels and outdoor exposure' },
    { key: 'hourly', label: 'Hourly Forecast & AQI Trends', desc: '24-hour visual charts & 7-day outlook' },
    { key: 'aiTeaser', label: 'AI Health Assistant Prompt Card', desc: 'Conversational assistant quick-access' }
  ];

  const handleToggle = (key) => {
    soundManager.playChime();
    setWidgetConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReset = () => {
    soundManager.playChime();
    setWidgetConfig({
      safetyScore: true,
      runningHours: true,
      aqi: true,
      uv: true,
      humidity: true,
      pollen: true,
      hourly: true,
      aiTeaser: true,
      mausamPlanTeaser: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Customize Dashboard Cards
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-4">
          Enable or disable specific weather, health, and activity widgets according to your preferences.
        </p>

        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {widgetDefinitions.map((w) => {
            const isEnabled = widgetConfig[w.key] !== false;
            return (
              <div
                key={w.key}
                onClick={() => handleToggle(w.key)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                  isEnabled
                    ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60'
                }`}
              >
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 block">
                    {w.label}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {w.desc}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                  isEnabled ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isEnabled && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to default</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
