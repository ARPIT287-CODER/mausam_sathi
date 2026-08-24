import React, { useState } from 'react';
import { useWeather, POPULAR_LOCATIONS, PROFILES } from '../context/WeatherContext';
import { 
  CloudSun, 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Moon, 
  Sun, 
  Zap, 
  WifiOff, 
  ChevronDown,
  Check,
  User
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function Navbar() {
  const {
    user,
    activeTab,
    setActiveTab,
    selectedLocation,
    setSelectedLocation,
    profile,
    darkMode,
    setDarkMode,
    isLowBandwidthMode,
    setIsLowBandwidthMode,
    isOffline,
    refreshWeather,
    loading,
    detectUserGpsLocation,
    alerts
  } = useWeather();

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const activeProfileData = PROFILES[profile] || PROFILES.general;

  const handleRefresh = () => {
    soundManager.playChime();
    refreshWeather();
  };

  const hasHighAlerts = alerts?.some(a => a.level === 'orange' || a.level === 'red');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/90 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 text-teal-400 shadow-sm group-hover:border-slate-600 transition shrink-0">
              <CloudSun className="w-5 h-5" />
              {hasHighAlerts && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base tracking-tight text-white">
                  MAUSAM SATHI
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-800/80 rounded-md border border-slate-700/60 uppercase tracking-wider">
                  Environmental Intelligence
                </span>
              </div>
            </div>
          </div>

          {/* Location Picker with GPS */}
          <div className="relative">
            <button
              onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700/70 transition shadow-sm"
              title="Change Location"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="max-w-[120px] sm:max-w-[180px] truncate">{selectedLocation.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${locationDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Location Dropdown Modal */}
            {locationDropdownOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 sm:w-80 bg-[#131B2E] rounded-xl shadow-2xl border border-slate-700/80 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800 text-[11px] font-semibold text-slate-400 tracking-wider">
                  <span>SELECT LOCATION</span>
                  <button 
                    onClick={() => { detectUserGpsLocation(); setLocationDropdownOpen(false); }}
                    className="flex items-center space-x-1 text-teal-400 hover:underline"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Live GPS</span>
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 mt-1">
                  {POPULAR_LOCATIONS.map((loc) => {
                    const isSelected = selectedLocation.name === loc.name;
                    return (
                      <button
                        key={loc.name}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setLocationDropdownOpen(false);
                          soundManager.playChime();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs rounded-lg transition ${
                          isSelected ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                          <div>
                            <p className="truncate">{loc.name}</p>
                            <span className="text-[10px] text-slate-500 font-normal">{loc.tag}</span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            
            {/* User Account / Profile Pill */}
            <button
              onClick={() => {
                soundManager.playChime();
                setActiveTab('profile');
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 text-xs font-medium transition"
              title="User Account & Persona Preferences"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">{user?.name || activeProfileData.name}</span>
              <span className="md:hidden text-[11px]">{user?.isGuest ? 'Guest' : 'Profile'}</span>
            </button>

            {/* Offline indicator */}
            {isOffline && (
              <span className="flex items-center space-x-1 px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-medium" title="Operating in offline mode">
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Offline</span>
              </span>
            )}

            {/* Low-Bandwidth Mode Toggle */}
            <button
              onClick={() => {
                setIsLowBandwidthMode(!isLowBandwidthMode);
                soundManager.playChime();
              }}
              className={`p-2 rounded-xl border transition ${
                isLowBandwidthMode 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/70 hover:bg-slate-800'
              }`}
              title={isLowBandwidthMode ? "Data Saver: ON (Minimalist Text)" : "Toggle 2G Data Saver Mode"}
            >
              <Zap className="w-3.5 h-3.5" />
            </button>

            {/* Refresh Live Weather */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700/70 transition ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              title="Refresh Live Weather & AQI"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
