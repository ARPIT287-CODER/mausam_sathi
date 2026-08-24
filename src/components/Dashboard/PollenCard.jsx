import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Flower2, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export default function PollenCard() {
  const { weatherData } = useWeather();
  if (!weatherData || !weatherData.pollen) return null;

  const { pollen } = weatherData;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-pink-50 dark:bg-pink-950/50 text-pink-500 border border-pink-200 dark:border-pink-800">
            <Flower2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              POLLEN & ALLERGY RISK
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Seasonal botanical allergen concentrations
            </p>
          </div>
        </div>

        <span 
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: `${pollen.color}18`, color: pollen.color, border: `1px solid ${pollen.color}40` }}
        >
          {pollen.level}
        </span>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
        <span className="text-2xl">🌼</span>
        <div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
            {pollen.level}
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {pollen.exposure}
          </p>
        </div>
      </div>

      {/* 3 Allergen Types */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block">Grass Pollen</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{pollen.grass}%</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block">Tree Pollen</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{pollen.tree}%</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <span className="text-[10px] text-slate-400 font-semibold block">Weed Pollen</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">{pollen.weed}%</span>
        </div>
      </div>

    </div>
  );
}
