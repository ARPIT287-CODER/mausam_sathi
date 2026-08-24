import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  Sun, 
  CloudSun, 
  CloudRain, 
  CloudLightning, 
  Cloud, 
  CloudFog, 
  Wind, 
  Droplets, 
  Sunrise, 
  Sunset,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function WeatherHeroCard() {
  const { weatherData, selectedLocation, loading } = useWeather();

  if (loading || !weatherData) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse bg-slate-900 h-64 flex items-center justify-center border border-slate-800">
        <p className="text-slate-400 font-medium text-xs">Fetching real-time environmental data...</p>
      </div>
    );
  }

  const { current, daily } = weatherData;
  const today = daily?.[0] || { maxTemp: current.temp + 4, minTemp: current.temp - 4 };

  const getWeatherIcon = (category) => {
    switch (category) {
      case 'rain': return <CloudRain className="w-12 h-12 text-teal-400" />;
      case 'heavy_rain': return <CloudRain className="w-12 h-12 text-sky-400 animate-bounce" />;
      case 'storm': return <CloudLightning className="w-12 h-12 text-amber-400" />;
      case 'fog': return <CloudFog className="w-12 h-12 text-slate-400" />;
      case 'cloudy': return <Cloud className="w-12 h-12 text-teal-300" />;
      default: return current.isDay ? <Sun className="w-12 h-12 text-amber-400 animate-pulse-slow" /> : <CloudSun className="w-12 h-12 text-indigo-300" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-navy-950 text-white p-5 sm:p-7 border border-slate-800/90 shadow-xl">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Location & Big Temp */}
        <div>
          <div className="flex items-center space-x-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <span>{selectedLocation.name}</span>
          </div>

          <div className="flex items-baseline space-x-3 mt-2">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white">
              {current.temp}°
              <span className="text-2xl sm:text-3xl font-light text-slate-400">C</span>
            </h1>
            <div className="space-y-0.5">
              <span className="text-base sm:text-lg font-bold block text-slate-100">
                {current.condition}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                Feels like <strong className="font-semibold text-slate-200">{current.feelsLike}°C</strong>
              </span>
            </div>
          </div>

          {/* Min / Max & Rain probability */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs font-medium">
            <div className="flex items-center space-x-1 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-200">
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
              <span>H: {today.maxTemp}°C</span>
              <ArrowDown className="w-3.5 h-3.5 text-teal-400 ml-1" />
              <span>L: {today.minTemp}°C</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-200">
              <Droplets className="w-3.5 h-3.5 text-teal-400" />
              <span>Rain: {current.rainProbability}%</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-200">
              <Wind className="w-3.5 h-3.5 text-slate-400" />
              <span>Wind: {current.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Right: Icon & Daylight Solar Stats */}
        <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
            {getWeatherIcon(current.conditionCategory)}
          </div>

          <div className="space-y-1.5 text-right mt-0 md:mt-4 text-xs">
            <div className="flex items-center space-x-2 justify-end text-slate-300">
              <Sunrise className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sunrise: <strong className="text-white">{current.sunrise}</strong></span>
            </div>
            <div className="flex items-center space-x-2 justify-end text-slate-300">
              <Sunset className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Sunset: <strong className="text-white">{current.sunset}</strong></span>
            </div>
            <div className="flex items-center space-x-2 justify-end text-slate-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Daylight: {current.daylightDuration}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
