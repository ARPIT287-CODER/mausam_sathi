import React, { useState } from 'react';
import { useWeather, POPULAR_LOCATIONS } from '../../context/WeatherContext';
import { 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Footprints, 
  Car, 
  Bike, 
  Shirt, 
  Tent, 
  Trophy,
  ArrowRight,
  Sun,
  Wind,
  Droplets
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function MausamPlanView() {
  const { weatherData, selectedLocation, setActiveTab } = useWeather();

  const [activity, setActivity] = useState('running');
  const [targetDate, setTargetDate] = useState('today');
  const [targetTime, setTargetTime] = useState('18:00');
  const [targetLocation, setTargetLocation] = useState(selectedLocation.name);
  const [customPlanResult, setCustomPlanResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const activities = [
    { id: 'running', label: 'Outdoor Running', icon: Footprints, desc: '5k/10k run, jogging, sprint workouts' },
    { id: 'travel', label: 'Travel / Road Trip', icon: Car, desc: 'Weekend getaway, highway driving, tours' },
    { id: 'cycling', label: 'Cycling / Long Ride', icon: Bike, desc: 'Road cycling, morning ride, trail bike' },
    { id: 'laundry', label: 'Laundry Outside', icon: Shirt, desc: 'Drying clothes outdoors on balcony/lawn' },
    { id: 'outdoor_event', label: 'Outdoor Event / Picnic', icon: Tent, desc: 'College festival, picnic, open-air meet' },
    { id: 'sports', label: 'Cricket / Sports', icon: Trophy, desc: 'Football, cricket, tennis match' }
  ];

  const handleEvaluate = (e) => {
    e?.preventDefault();
    setAnalyzing(true);
    soundManager.playChime();

    setTimeout(() => {
      const currentAqi = weatherData?.aqi?.value || 135;
      const currentTemp = weatherData?.current?.temp || 31;
      const currentUv = weatherData?.current?.uvIndex || 6;
      const rainProb = weatherData?.current?.rainProbability || 20;

      let verdict = "recommended";
      let score = 88;
      let reasons = [];
      let alternativeWindow = "7:15 PM – 8:30 PM";

      if (activity === 'running' || activity === 'cycling' || activity === 'sports') {
        const hour = parseInt(targetTime.split(':')[0], 10);
        const isMidDay = hour >= 11 && hour <= 16;

        if (isMidDay && (currentTemp > 32 || currentUv > 6)) {
          verdict = "not_recommended";
          score = 38;
          reasons.push(`High midday temperature (${currentTemp}°C) and intense UV (${currentUv}) increase dehydration & thermal stress.`);
          reasons.push(`Air quality (AQI ${currentAqi}) is not suitable for high-intensity cardiovascular exertion at this hour.`);
          alternativeWindow = "6:45 PM – 7:45 PM";
        } else if (currentAqi > 160) {
          verdict = "not_recommended";
          score = 42;
          reasons.push(`Elevated AQI (${currentAqi}) poses respiratory risk for prolonged aerobic exercise.`);
          alternativeWindow = "7:30 PM – 8:30 PM";
        } else if (currentAqi > 100 || currentTemp > 29) {
          verdict = "caution";
          score = 68;
          reasons.push("Moderate conditions: Keep hydration high, pace conservative, and wear breathable gear.");
          alternativeWindow = "6:30 PM – 7:30 PM";
        } else {
          verdict = "recommended";
          score = 92;
          reasons.push("Ideal ambient temperature, low rain probability, and safe respiratory conditions.");
        }
      } else if (activity === 'travel' || activity === 'outdoor_event') {
        if (rainProb > 50) {
          verdict = "caution";
          score = 56;
          reasons.push("High probability of rain showers during transit. Road slickness and slow traffic likely.");
          reasons.push("Check live micro-climate crowd reports for waterlogged sectors.");
          alternativeWindow = "Tomorrow Morning 8:00 AM – 11:30 AM";
        } else {
          verdict = "recommended";
          score = 86;
          reasons.push("Clear roads and pleasant weather anticipated for travel.");
        }
      } else if (activity === 'laundry') {
        if (rainProb > 30 || weatherData?.current?.humidity > 70) {
          verdict = "not_recommended";
          score = 32;
          reasons.push("High atmospheric humidity will prevent clothes from drying effectively.");
          alternativeWindow = "Tomorrow 10:30 AM – 2:30 PM";
        } else {
          verdict = "recommended";
          score = 95;
          reasons.push("Strong sunlight and brisk breeze will dry fabric quickly.");
        }
      }

      setCustomPlanResult({
        activity,
        targetTime,
        targetDate,
        targetLocation,
        verdict,
        score,
        reasons,
        recommendedWindow: alternativeWindow,
        checklist: [
          "Hydrate adequately (at least 400ml water) prior to departure",
          "Check micro-climate map for localized waterlogging or smog",
          "Carry gear suited for the recommended timeframe"
        ]
      });

      setAnalyzing(false);
      soundManager.playSuccess();
    }, 450);
  };

  return (
    <div className="space-y-5 pb-16 sm:pb-8 animate-in fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>MAUSAM PLAN</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold">
                Smart Activity & Trip Planner
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform environmental forecasts into go / no-go decisions and optimized time windows
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Form: Plan Configuration */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">
              1. What activity are you planning?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {activities.map((act) => {
                const Icon = act.icon;
                const isSelected = activity === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivity(act.id)}
                    className={`flex items-start space-x-2.5 p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-sky-950/70 border-sky-500 text-sky-700 dark:text-sky-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">{act.label}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">{act.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                2. Target Date
              </label>
              <select
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="weekend">This Weekend</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
                3. Planned Time
              </label>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
              4. Location / Destination
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={targetLocation}
                onChange={(e) => setTargetLocation(e.target.value)}
                placeholder="e.g. Noida, Lonavala, Shimla..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <button
            onClick={handleEvaluate}
            disabled={analyzing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 flex items-center justify-center space-x-2 transition"
          >
            <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Analyzing Environmental Risks...' : 'Evaluate Activity Suitability'}</span>
          </button>

        </div>

        {/* Right: Recommendation Verdict Card */}
        <div className="lg:col-span-6 space-y-4">
          
          {customPlanResult ? (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 animate-in fade-in">
              
              {/* Verdict Header */}
              <div className={`p-4 rounded-xl border flex items-start space-x-3 ${
                customPlanResult.verdict === 'recommended'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : customPlanResult.verdict === 'caution'
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              }`}>
                {customPlanResult.verdict === 'recommended' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                ) : customPlanResult.verdict === 'caution' ? (
                  <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold capitalize">
                      {customPlanResult.verdict.replace('_', ' ')}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-white/70 dark:bg-slate-900/70 rounded-full font-bold">
                      {customPlanResult.score}/100 Suitability
                    </span>
                  </div>
                  <p className="text-xs mt-1 font-medium">
                    Activity analysis for <strong>{customPlanResult.activity.toUpperCase()}</strong> at <strong>{customPlanResult.targetTime}</strong> in {customPlanResult.targetLocation}.
                  </p>
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  ENVIRONMENTAL ASSESSMENT
                </span>
                {customPlanResult.reasons.map((r, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-600 dark:text-slate-300">
                    <span className="text-sky-500 font-bold">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Alternative Window */}
              {customPlanResult.recommendedWindow && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/60 dark:to-indigo-950/60 border border-sky-200 dark:border-sky-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
                        RECOMMENDED ALTERNATIVE WINDOW
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
                        {customPlanResult.recommendedWindow}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        soundManager.playChime();
                        setActiveTab('ai');
                      }}
                      className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>Ask AI Why</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  PRE-ACTIVITY CHECKLIST
                </span>
                <div className="space-y-1">
                  {customPlanResult.checklist.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center text-slate-400 space-y-3 h-full min-h-[300px]">
              <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                <CalendarCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Ready to evaluate your schedule
                </h4>
                <p className="text-xs max-w-xs mt-1">
                  Select your planned activity and time on the left to receive an immediate environmental safety analysis and alternative time slots.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
