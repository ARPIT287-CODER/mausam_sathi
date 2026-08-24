import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  CalendarDays, 
  Clock, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain, 
  CloudSun,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export default function HourlyForecastCard() {
  const { weatherData } = useWeather();
  const [activeView, setActiveView] = useState('hourly'); // 'hourly' | 'rain' | 'aqi' | '7day'

  if (!weatherData) return null;

  const { hourly, daily } = weatherData;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800">
      
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 border border-indigo-200 dark:border-indigo-800">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              WEATHER & AQI TRENDS
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              24-hour continuous timeline & multi-day outlook
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveView('hourly')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeView === 'hourly'
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Hourly Temp
          </button>
          <button
            onClick={() => setActiveView('rain')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeView === 'rain'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Rain %
          </button>
          <button
            onClick={() => setActiveView('aqi')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeView === 'aqi'
                ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            AQI Trend
          </button>
          <button
            onClick={() => setActiveView('7day')}
            className={`px-2.5 py-1 rounded-lg transition ${
              activeView === '7day'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            7-Day
          </button>
        </div>
      </div>

      {/* 1. Hourly Temperature Chart View */}
      {activeView === 'hourly' && (
        <div className="mt-4">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly.slice(0, 16)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis unit="°" domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  formatter={(val) => [`${val}°C`, 'Temperature']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-2 overflow-x-auto pt-3 pb-1 scrollbar-thin">
            {hourly.slice(0, 14).map((h, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 min-w-[64px] text-center">
                <span className="text-[10px] text-slate-400 font-medium">{h.time}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 my-1">{h.temp}°C</span>
                <span className="text-[9px] text-sky-500 font-semibold">{h.condition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Rain Probability View */}
      {activeView === 'rain' && (
        <div className="mt-4">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly.slice(0, 16)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Rain Probability']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="rainProb" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#rainGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-2 overflow-x-auto pt-3 pb-1 scrollbar-thin">
            {hourly.slice(0, 14).map((h, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center p-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 min-w-[64px] text-center">
                <span className="text-[10px] text-slate-400 font-medium">{h.time}</span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 my-1">{h.rainProb}%</span>
                <span className="text-[9px] text-slate-500 font-semibold">{h.rainMm > 0 ? `${h.rainMm}mm` : 'Dry'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Hourly AQI Trend */}
      {activeView === 'aqi' && (
        <div className="mt-4">
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly.slice(0, 16)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  formatter={(val) => [`${val}`, 'AQI']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="aqi" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#aqiGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-2 overflow-x-auto pt-3 pb-1 scrollbar-thin">
            {hourly.slice(0, 14).map((h, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center p-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 min-w-[64px] text-center">
                <span className="text-[10px] text-slate-400 font-medium">{h.time}</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 my-1">{h.aqi}</span>
                <span className="text-[9px] text-slate-500 font-semibold">{h.aqi > 150 ? 'Poor' : 'Moderate'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. 7-Day Multi-day Outlook */}
      {activeView === '7day' && (
        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
          {daily.map((day, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
              <div className="w-24 font-bold text-slate-700 dark:text-slate-200">
                {day.dayName}
              </div>
              <div className="flex items-center space-x-1.5 text-blue-500 text-xs font-semibold w-20">
                <Droplets className="w-3.5 h-3.5" />
                <span>{day.rainProb}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-slate-400 text-xs">L: {day.minTemp}°</span>
                <div className="w-20 sm:w-28 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${Math.min(100, (day.maxTemp / 45) * 100)}%` }} />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-100">H: {day.maxTemp}°C</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
