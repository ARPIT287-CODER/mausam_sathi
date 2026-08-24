import React, { useState } from 'react';
import { useWeather, PROFILES } from '../../context/WeatherContext';
import WeatherHeroCard from './WeatherHeroCard';
import HealthScoreCard from './HealthScoreCard';
import AqiCard from './AqiCard';
import RunningHoursCard from './RunningHoursCard';
import UvCard from './UvCard';
import HumidityComfortCard from './HumidityComfortCard';
import PollenCard from './PollenCard';
import HourlyForecastCard from './HourlyForecastCard';
import AiAssistantTeaser from './AiAssistantTeaser';
import WidgetsCustomizerModal from './WidgetsCustomizerModal';
import { 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  MapPin, 
  CalendarCheck, 
  ShieldAlert, 
  ChevronRight 
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function DashboardView() {
  const { profile, widgetConfig, alerts, setActiveTab } = useWeather();
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const activeProfileData = PROFILES[profile] || PROFILES.general;

  // Active top alert if any
  const topAlert = alerts?.find(a => a.level === 'orange' || a.level === 'red') || alerts?.[0];

  return (
    <div className="space-y-5 pb-16 sm:pb-8 animate-in fade-in">
      
      {/* Top Banner: Profile context & Customize Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent p-4 rounded-2xl border border-sky-200/60 dark:border-sky-800/60">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            {profile === 'fitness' ? '🏃' : profile === 'health_conscious' ? '❤️' : profile === 'traveler' ? '🧳' : profile === 'commuter' ? '🚆' : '🌤️'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                {activeProfileData.name} Dashboard
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
                Dynamic Priority
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {activeProfileData.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={() => {
              soundManager.playChime();
              setCustomizerOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 shadow-sm transition"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-500" />
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* Emergency Alert Notification Bar if exists */}
      {topAlert && (
        <div 
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl cursor-pointer border shadow-sm transition ${
            topAlert.level === 'orange' || topAlert.level === 'red'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200 hover:bg-amber-500/15'
              : 'bg-sky-500/10 border-sky-500/30 text-sky-900 dark:text-sky-200 hover:bg-sky-500/15'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold block">
                ⚠️ {topAlert.title}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                {topAlert.summary}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs font-semibold text-amber-600 dark:text-amber-400 shrink-0 ml-2">
            <span className="hidden sm:inline">View Protocols</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Primary Weather Hero Card */}
      <WeatherHeroCard />

      {/* Dynamic Profile-Tailored Widget Grid */}
      
      {/* 1. HEALTH-CONSCIOUS PROFILE PRIORITY */}
      {profile === 'health_conscious' && (
        <>
          {widgetConfig.safetyScore !== false && <HealthScoreCard />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.aqi !== false && <AqiCard />}
            {widgetConfig.pollen !== false && <PollenCard />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.uv !== false && <UvCard />}
            {widgetConfig.humidity !== false && <HumidityComfortCard />}
          </div>
          {widgetConfig.aiTeaser !== false && <AiAssistantTeaser />}
          {widgetConfig.hourly !== false && <HourlyForecastCard />}
          {widgetConfig.runningHours !== false && <RunningHoursCard />}
        </>
      )}

      {/* 2. OUTDOOR FITNESS PROFILE PRIORITY */}
      {profile === 'fitness' && (
        <>
          {widgetConfig.runningHours !== false && <RunningHoursCard />}
          {widgetConfig.safetyScore !== false && <HealthScoreCard />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.aqi !== false && <AqiCard />}
            {widgetConfig.uv !== false && <UvCard />}
          </div>
          {widgetConfig.hourly !== false && <HourlyForecastCard />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.humidity !== false && <HumidityComfortCard />}
            {widgetConfig.pollen !== false && <PollenCard />}
          </div>
          {widgetConfig.aiTeaser !== false && <AiAssistantTeaser />}
        </>
      )}

      {/* 3. TRAVELER PROFILE PRIORITY */}
      {profile === 'traveler' && (
        <>
          {widgetConfig.hourly !== false && <HourlyForecastCard />}
          {widgetConfig.safetyScore !== false && <HealthScoreCard />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.uv !== false && <UvCard />}
            {widgetConfig.humidity !== false && <HumidityComfortCard />}
          </div>
          {widgetConfig.aiTeaser !== false && <AiAssistantTeaser />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.aqi !== false && <AqiCard />}
            {widgetConfig.runningHours !== false && <RunningHoursCard />}
          </div>
        </>
      )}

      {/* 4. DAILY COMMUTER PROFILE PRIORITY */}
      {profile === 'commuter' && (
        <>
          {widgetConfig.safetyScore !== false && <HealthScoreCard />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.aqi !== false && <AqiCard />}
            {widgetConfig.humidity !== false && <HumidityComfortCard />}
          </div>
          {widgetConfig.hourly !== false && <HourlyForecastCard />}
          {widgetConfig.aiTeaser !== false && <AiAssistantTeaser />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.uv !== false && <UvCard />}
            {widgetConfig.pollen !== false && <PollenCard />}
          </div>
        </>
      )}

      {/* 5. GENERAL USER PROFILE (BALANCED) */}
      {profile === 'general' && (
        <>
          {widgetConfig.safetyScore !== false && <HealthScoreCard />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.aqi !== false && <AqiCard />}
            {widgetConfig.runningHours !== false && <RunningHoursCard />}
          </div>
          {widgetConfig.hourly !== false && <HourlyForecastCard />}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {widgetConfig.uv !== false && <UvCard />}
            {widgetConfig.humidity !== false && <HumidityComfortCard />}
          </div>
          {widgetConfig.pollen !== false && <PollenCard />}
          {widgetConfig.aiTeaser !== false && <AiAssistantTeaser />}
        </>
      )}

      {/* Quick Action Dock */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
        <button
          onClick={() => {
            soundManager.playChime();
            setActiveTab('plan');
          }}
          className="flex items-center space-x-2.5 p-3.5 rounded-xl glass-card-interactive text-left"
        >
          <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold block text-slate-800 dark:text-slate-100">Mausam Plan</span>
            <span className="text-[10px] text-slate-500">Plan activity & trip</span>
          </div>
        </button>

        <button
          onClick={() => {
            soundManager.playChime();
            setActiveTab('map');
          }}
          className="flex items-center space-x-2.5 p-3.5 rounded-xl glass-card-interactive text-left"
        >
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold block text-slate-800 dark:text-slate-100">Live Map</span>
            <span className="text-[10px] text-slate-500">Micro-climate reports</span>
          </div>
        </button>

        <button
          onClick={() => {
            soundManager.playChime();
            setActiveTab('alerts');
          }}
          className="flex items-center space-x-2.5 p-3.5 rounded-xl glass-card-interactive text-left col-span-2 sm:col-span-1"
        >
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold block text-slate-800 dark:text-slate-100">Alerts & Safety</span>
            <span className="text-[10px] text-slate-500">Emergency & Helplines</span>
          </div>
        </button>
      </div>

      {/* Widget Customizer Modal */}
      <WidgetsCustomizerModal
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
      />

    </div>
  );
}
