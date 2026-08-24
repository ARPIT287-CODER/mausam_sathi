import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Droplets, Wind, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HumidityComfortCard() {
  const { weatherData } = useWeather();
  if (!weatherData) return null;

  const humidity = weatherData.current?.humidity || 50;
  const temp = weatherData.current?.temp || 28;

  let comfort = "Comfortable";
  let color = "#10b981";
  let explanation = "Optimal moisture level. Normal perspiration evaporation.";

  if (humidity > 75) {
    comfort = "Oppressive / Muggy";
    color = "#ef4444";
    explanation = "High moisture traps sweat on skin, making it feel much hotter. High dehydration risk.";
  } else if (humidity > 60) {
    comfort = "Slightly Humid";
    color = "#f59e0b";
    explanation = "Noticeable stickiness during physical exertion. Drink regular fluids.";
  } else if (humidity < 30) {
    comfort = "Dry Air";
    color = "#38bdf8";
    explanation = "Low moisture may cause dry throat, chapped lips, and static electricity.";
  }

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-500 border border-blue-200 dark:border-blue-800">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              HUMIDITY & COMFORT
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Atmospheric moisture & thermal sweat efficiency
            </p>
          </div>
        </div>

        <span 
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: `${color}18`, color: color, border: `1px solid ${color}40` }}
        >
          {comfort}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-4">
          <div 
            className="flex items-center justify-center w-14 h-14 rounded-2xl text-white font-black text-2xl shadow-md shrink-0"
            style={{ backgroundColor: color }}
          >
            {humidity}%
          </div>
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
              {comfort}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Moisture gauge */}
      <div className="mt-3">
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 via-emerald-400 to-blue-600 rounded-full transition-all duration-700"
            style={{ width: `${humidity}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
          <span>0% (Dry)</span>
          <span>40-60% (Ideal)</span>
          <span>100% (Saturated)</span>
        </div>
      </div>

    </div>
  );
}
