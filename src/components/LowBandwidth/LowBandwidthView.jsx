import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Zap, WifiOff, RefreshCw, PhoneCall, ShieldAlert, Heart, ArrowLeft } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function LowBandwidthView() {
  const { 
    weatherData, 
    safetyScoreData, 
    selectedLocation, 
    isLowBandwidthMode, 
    setIsLowBandwidthMode,
    isOffline,
    refreshWeather,
    loading 
  } = useWeather();

  const handleDisableDataSaver = () => {
    soundManager.playChime();
    setIsLowBandwidthMode(false);
  };

  const current = weatherData?.current || { temp: 28, condition: "Partly Cloudy", humidity: 62, uvIndex: 5 };
  const aqi = weatherData?.aqi || { value: 128, category: "Moderate" };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 pb-20 font-mono text-xs sm:text-sm animate-in fade-in">
      
      {/* Top Banner */}
      <div className="p-3 bg-amber-500 text-slate-900 rounded-lg flex items-center justify-between font-bold">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>ULTRA LOW-BANDWIDTH MODE ACTIVE (2G / EMERGENCY)</span>
        </div>
        <button
          onClick={handleDisableDataSaver}
          className="bg-black text-white px-2.5 py-1 rounded text-xs hover:bg-slate-800"
        >
          Exit
        </button>
      </div>

      {/* Offline Status */}
      {isOffline && (
        <div className="p-2.5 bg-red-600 text-white rounded-lg flex items-center space-x-2 font-bold">
          <WifiOff className="w-4 h-4" />
          <span>NETWORK OFFLINE: DISPLAYING PERSISTENT LOCAL CACHE</span>
        </div>
      )}

      {/* Primary Data Table */}
      <div className="border-2 border-slate-700 dark:border-slate-300 p-4 rounded-lg bg-white dark:bg-black text-slate-900 dark:text-slate-100 space-y-3">
        <div className="flex justify-between border-b pb-2 border-slate-400">
          <span className="font-bold uppercase">LOCATION: {selectedLocation.name}</span>
          <button onClick={refreshWeather} className="underline text-sky-600 dark:text-sky-400">
            [REFRESH]
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>TEMPERATURE: <strong>{current.temp}°C ({current.condition})</strong></div>
          <div>FEELS LIKE: <strong>{current.feelsLike || current.temp + 2}°C</strong></div>
          <div>AIR QUALITY: <strong>AQI {aqi.value} ({aqi.category})</strong></div>
          <div>UV RADIATION: <strong>{current.uvIndex} (Scale 0-12)</strong></div>
          <div>HUMIDITY: <strong>{current.humidity}%</strong></div>
          <div>RAIN CHANCE: <strong>{current.rainProbability || 15}%</strong></div>
        </div>

        <div className="pt-2 border-t border-slate-400">
          <div className="font-bold text-sm">
            ❤️ PERSONAL SAFETY SCORE: {safetyScoreData.score} / 100 ({safetyScoreData.level.toUpperCase()})
          </div>
          <p className="mt-1 text-xs">
            {safetyScoreData.summary}
          </p>
        </div>
      </div>

      {/* Offline Emergency First-Aid Guidelines */}
      <div className="border border-slate-400 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 space-y-2">
        <div className="font-bold flex items-center space-x-1 text-red-600 dark:text-red-400">
          <ShieldAlert className="w-4 h-4" />
          <span>CRITICAL OFFLINE FIRST-AID PROTOCOLS</span>
        </div>
        
        <div className="space-y-1.5 text-xs">
          <div>
            <strong>1. HEAT EXHAUSTION:</strong> Move to shade, loosen clothing, sip salted water or ORS, apply cool wet towels to neck/armpits.
          </div>
          <div>
            <strong>2. FLASH FLOOD / WATERLOGGING:</strong> Do not walk or drive through flowing water. Stay clear of submerged electrical transformers.
          </div>
          <div>
            <strong>3. SEVERE SMOG SPIKE:</strong> Stay indoors, seal door cracks with damp towels, avoid physical exertion.
          </div>
        </div>
      </div>

      {/* Quick Helplines */}
      <div className="border border-slate-400 p-3 rounded-lg bg-white dark:bg-black text-xs space-y-1">
        <div className="font-bold mb-1">EMERGENCY DIAL DIRECTORY:</div>
        <div className="flex justify-between">
          <span>National Integrated Helpline:</span>
          <a href="tel:112" className="font-bold underline text-red-600">112</a>
        </div>
        <div className="flex justify-between">
          <span>Disaster Management NDRF:</span>
          <a href="tel:1078" className="font-bold underline text-red-600">1078</a>
        </div>
        <div className="flex justify-between">
          <span>Medical Ambulance:</span>
          <a href="tel:108" className="font-bold underline text-red-600">108</a>
        </div>
      </div>

    </div>
  );
}
