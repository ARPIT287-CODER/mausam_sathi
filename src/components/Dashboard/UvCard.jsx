import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Sun, Shield, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function UvCard() {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const uv = weatherData.current?.uvIndex || 0;

  let category = "Low";
  let color = "#10b981";
  let advice = "No protection required for general outdoor tasks.";
  let gear = ["Sunglasses optional"];

  if (uv >= 11) {
    category = "Extreme";
    color = "#881337";
    advice = "Take full precautions! Unprotected skin can burn in minutes.";
    gear = ["SPF 50+ Sunscreen", "UV Sunglasses", "Wide-Brim Hat", "Stay in shade"];
  } else if (uv >= 8) {
    category = "Very High";
    color = "#ef4444";
    advice = "Extra protection needed. Avoid direct sun between 11 AM - 4 PM.";
    gear = ["SPF 50+ Sunscreen", "UV-400 Sunglasses", "Protective Clothing"];
  } else if (uv >= 6) {
    category = "High";
    color = "#f97316";
    advice = "Protection essential. Reduce prolonged mid-day exposure.";
    gear = ["SPF 30+ Sunscreen", "Sunglasses", "Cap / Umbrella"];
  } else if (uv >= 3) {
    category = "Moderate";
    color = "#eab308";
    advice = "Moderate sun exposure risk during mid-day hours.";
    gear = ["Sunscreen if staying > 45 mins", "Sunglasses"];
  }

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 border border-amber-200 dark:border-amber-800">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              UV INDEX & SUN SAFETY
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Solar ultraviolet radiation & burn risk indicator
            </p>
          </div>
        </div>

        <span 
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: `${color}18`, color: color, border: `1px solid ${color}40` }}
        >
          {category.toUpperCase()}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <div 
            className="flex items-center justify-center w-14 h-14 rounded-2xl text-white font-black text-2xl shadow-md shrink-0"
            style={{ backgroundColor: color }}
          >
            {uv}
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
              {category} Radiation
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {advice}
            </p>
          </div>
        </div>
      </div>

      {/* Sun Gear Checklist */}
      <div className="mt-3">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
          SUN PROTECTION GEAR
        </span>
        <div className="flex flex-wrap gap-1.5">
          {gear.map((item, idx) => (
            <span 
              key={idx}
              className="inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 font-medium"
            >
              <CheckCircle2 className="w-3 h-3 text-amber-500" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
