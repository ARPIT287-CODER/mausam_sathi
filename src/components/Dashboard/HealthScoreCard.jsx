import React from 'react';
import { useWeather, PROFILES } from '../../context/WeatherContext';
import { 
  Heart, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  Wind, 
  Sun, 
  Thermometer, 
  Flower2,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function HealthScoreCard() {
  const { safetyScoreData, profile, setActiveTab } = useWeather();

  const { score, level, badgeColor, statusEmoji, summary, recommendations, subScores } = safetyScoreData;
  const activeProfile = PROFILES[profile] || PROFILES.general;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 relative overflow-hidden border border-slate-800/90 shadow-xl bg-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Heart className="w-5 h-5 fill-rose-500/20" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>YOUR SAFETY SCORE</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {activeProfile.name}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized multi-pollutant & thermal risk index
            </p>
          </div>
        </div>

        {/* Level Pill */}
        <div 
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
          style={{ backgroundColor: `${badgeColor}22`, color: badgeColor, border: `1px solid ${badgeColor}50` }}
        >
          <span>{statusEmoji}</span>
          <span>{level.toUpperCase()}</span>
        </div>
      </div>

      {/* Score Big Display & Summary */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Big Score Meter */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 text-center">
          <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${score}, 100`}
                strokeLinecap="round"
                stroke={badgeColor}
                fill="none"
                className="transition-all duration-1000 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black tracking-tight text-white">
                {score}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-300 mt-1">
            Environmental Safety
          </span>
        </div>

        {/* Contextual Summary & Recommendations */}
        <div className="md:col-span-8 space-y-3">
          <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
            {summary}
          </p>

          <div className="space-y-1.5">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                <span className="text-teal-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>

          {/* Quick AI Trigger */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundManager.playChime();
                setActiveTab('ai');
              }}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-300 hover:text-teal-200 bg-teal-500/10 hover:bg-teal-500/20 px-3 py-1.5 rounded-lg border border-teal-500/30 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI: “Why is my score {score} today?”</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 4 Core Sub-Scores Matrix */}
      <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Respiratory */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>Respiratory</span>
            </span>
            <span className="font-bold text-slate-200">{subScores.respiratory}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full" style={{ width: `${subScores.respiratory}%` }} />
          </div>
        </div>

        {/* UV Safety */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>UV Safety</span>
            </span>
            <span className="font-bold text-slate-200">{subScores.uv}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${subScores.uv}%` }} />
          </div>
        </div>

        {/* Thermal Comfort */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span>Thermal</span>
            </span>
            <span className="font-bold text-slate-200">{subScores.thermal}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-rose-400 rounded-full" style={{ width: `${subScores.thermal}%` }} />
          </div>
        </div>

        {/* Allergy Index */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center space-x-1">
              <Flower2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Allergy Safe</span>
            </span>
            <span className="font-bold text-slate-200">{subScores.allergy}%</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${subScores.allergy}%` }} />
          </div>
        </div>

      </div>

    </div>
  );
}
