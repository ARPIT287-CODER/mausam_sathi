import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Footprints, 
  Clock, 
  Flame, 
  Wind, 
  Sun, 
  Droplets,
  CalendarCheck
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function RunningHoursCard() {
  const { fitnessData, setActiveTab } = useWeather();

  if (!fitnessData) return null;

  const { bestWindow, bestScore, currentStatus, currentVerdict, badgeColor, bestDetails, hourlyScores } = fitnessData;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-xl bg-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              BEST OUTDOOR & RUNNING HOURS
            </h2>
            <p className="text-xs text-slate-400">
              Optimal workout window calculated from 6 weather factors
            </p>
          </div>
        </div>

        <span 
          className="px-2.5 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}50` }}
        >
          {currentStatus}
        </span>
      </div>

      {/* Best Window Highlight Box */}
      <div className="mt-4 p-4 rounded-xl bg-slate-800/60 border border-slate-700/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div>
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              RECOMMENDED RUNNING WINDOW TODAY
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              {bestWindow}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {currentVerdict}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center sm:border-l border-slate-700/80 sm:pl-5 shrink-0">
            <span className="text-2xl font-black text-teal-400">
              {bestScore}%
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">
              Fitness Index
            </span>
          </div>

        </div>

        {/* Expected Conditions at that time */}
        {bestDetails && (
          <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap gap-3 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              UV: {bestDetails.uv <= 2 ? 'Low' : 'Moderate'}
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Temp: {bestDetails.temp}°C
            </span>
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              Wind: {bestDetails.windSpeed} km/h
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-teal-400" />
              Rain: {bestDetails.rainProb}%
            </span>
          </div>
        )}
      </div>

      {/* Hourly Timeline Mini-Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>HOURLY FITNESS SUITABILITY (NEXT 12H)</span>
          <button 
            onClick={() => {
              soundManager.playChime();
              setActiveTab('plan');
            }}
            className="text-teal-400 hover:underline flex items-center space-x-1"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Plan Activity</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {hourlyScores.slice(0, 12).map((item, idx) => {
            const isTop = item.fitnessScore >= 75;
            return (
              <div 
                key={idx}
                className={`flex-shrink-0 flex flex-col items-center justify-between p-2 rounded-xl text-center min-w-[62px] border transition ${
                  isTop 
                    ? 'bg-slate-800 border-teal-500/50' 
                    : 'bg-slate-800/40 border-slate-700/60'
                }`}
              >
                <span className="text-[10px] font-medium text-slate-400">
                  {item.time}
                </span>
                <span className={`text-xs font-bold my-1 ${isTop ? 'text-teal-400' : 'text-slate-300'}`}>
                  {item.temp}°C
                </span>
                <div 
                  className={`w-full py-0.5 rounded text-[9px] font-bold ${
                    isTop ? 'bg-teal-500 text-slate-950' : item.fitnessScore >= 55 ? 'bg-amber-500 text-slate-950' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.fitnessScore}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
