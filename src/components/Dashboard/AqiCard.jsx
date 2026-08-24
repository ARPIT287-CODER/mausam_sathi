import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Wind, 
  Info, 
  ShieldCheck, 
  AlertTriangle, 
  Layers
} from 'lucide-react';

export default function AqiCard() {
  const { weatherData } = useWeather();
  const [showPollutants, setShowPollutants] = useState(false);

  if (!weatherData || !weatherData.aqi) return null;

  const { aqi } = weatherData;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-800/90 shadow-xl bg-slate-900">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>AIR QUALITY INDEX</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded border border-slate-700">
                CPCB
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live particulate matter and gas concentrations
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPollutants(!showPollutants)}
          className="text-xs font-semibold text-teal-400 hover:underline flex items-center space-x-1"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showPollutants ? 'Hide Breakdown' : 'Pollutants'}</span>
        </button>
      </div>

      {/* Main AQI Value & Status */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
        <div className="flex items-center space-x-4">
          <div 
            className="flex items-center justify-center w-16 h-16 rounded-2xl text-white font-black text-2xl shadow-md shrink-0 border border-white/10"
            style={{ backgroundColor: aqi.color }}
          >
            {aqi.value}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base sm:text-lg font-bold text-white">
                {aqi.category}
              </span>
              <span className="text-base">{aqi.emoji}</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {aqi.description}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Multi-tier Bar */}
      <div className="mt-4">
        <div className="relative w-full h-2.5 rounded-full bg-slate-800 overflow-hidden flex border border-slate-700/60">
          <div className="h-full bg-emerald-500 w-[16.6%]" title="Good (0-50)" />
          <div className="h-full bg-amber-500 w-[16.6%]" title="Moderate (51-100)" />
          <div className="h-full bg-orange-500 w-[16.6%]" title="Sensitive (101-150)" />
          <div className="h-full bg-red-500 w-[16.6%]" title="Unhealthy (151-200)" />
          <div className="h-full bg-purple-600 w-[33.3%]" title="Very Unhealthy (201-300)" />
          <div className="h-full bg-rose-950 w-[16.9%]" title="Hazardous (301+)" />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
          <span>0 (Good)</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
          <span>300+</span>
        </div>
      </div>

      {/* Detailed Pollutants Matrix */}
      {showPollutants && (
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center animate-in fade-in">
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold block">PM2.5</span>
            <span className="text-xs sm:text-sm font-bold text-white">{aqi.pm2_5}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold block">PM10</span>
            <span className="text-xs sm:text-sm font-bold text-white">{aqi.pm10}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold block">NO₂</span>
            <span className="text-xs sm:text-sm font-bold text-white">{aqi.no2}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold block">O₃ (Ozone)</span>
            <span className="text-xs sm:text-sm font-bold text-white">{aqi.o3}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold block">SO₂</span>
            <span className="text-xs sm:text-sm font-bold text-white">{aqi.so2}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <span className="text-[10px] text-slate-400 font-bold block">CO</span>
            <span className="text-xs sm:text-sm font-bold text-white">{aqi.co}</span>
            <span className="text-[9px] text-slate-500 block">µg/m³</span>
          </div>
        </div>
      )}

      {/* Practical Action Recommendation */}
      <div className="mt-3 flex items-start space-x-2 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/60">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <span>
          {aqi.value > 150 
            ? "⚠️ Sensitive individuals, children, and elderly should avoid prolonged outdoor exposure. Keep windows closed."
            : aqi.value > 100
            ? "🟡 Moderate pollution: General public can carry out normal outdoor tasks; sensitive individuals should monitor symptoms."
            : "🟢 Great air quality! Ideal for outdoor ventilation, jogging, and walking."}
        </span>
      </div>

    </div>
  );
}
