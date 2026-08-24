import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import WelcomeScreen from './components/Auth/WelcomeScreen';
import AuthScreen from './components/Auth/AuthScreen';
import ProfileSetupScreen from './components/Auth/ProfileSetupScreen';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import DashboardView from './components/Dashboard/DashboardView';
import MicroClimateMap from './components/Map/MicroClimateMap';
import MausamPlanView from './components/Planner/MausamPlanView';
import AiHealthAssistant from './components/AI/AiHealthAssistant';
import AlertsCenter from './components/Alerts/AlertsCenter';
import ProfileView from './components/Profile/ProfileView';
import LowBandwidthView from './components/LowBandwidth/LowBandwidthView';
import { 
  Bot, 
  Smartphone, 
  Monitor, 
  Wifi, 
  BatteryMedium, 
  Signal 
} from 'lucide-react';
import { soundManager } from './utils/soundEffects';

function AppContent() {
  const { 
    user, 
    authStep, 
    setAuthStep, 
    login, 
    register, 
    continueAsGuest, 
    completeProfileSetup,
    activeTab, 
    setActiveTab, 
    isLowBandwidthMode,
    isMobileFrameView,
    setIsMobileFrameView
  } = useWeather();

  // 1. Welcome Screen
  if (authStep === 'welcome') {
    return (
      <WelcomeScreen
        onGetStarted={() => setAuthStep('auth')}
        onSkip={() => {
          continueAsGuest();
        }}
      />
    );
  }

  // 2. Auth Screen (Login / Signup / Continue as Guest)
  if (authStep === 'auth') {
    return (
      <AuthScreen
        onLogin={(email, password, displayName) => login(email, password, displayName)}
        onRegister={(name, email, password) => register(name, email, password)}
        onContinueAsGuest={() => continueAsGuest()}
        onBackToWelcome={() => setAuthStep('welcome')}
      />
    );
  }

  // 3. Profile Onboarding Questionnaire
  if (authStep === 'setup') {
    return (
      <ProfileSetupScreen
        userName={user?.name}
        onCompleteSetup={(persona, vulnerabilities) => {
          completeProfileSetup(persona, vulnerabilities);
        }}
      />
    );
  }

  // 4. Low-Bandwidth Mode View
  if (isLowBandwidthMode) {
    return <LowBandwidthView />;
  }

  // Main App Shell
  const MainContent = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main Tabbed Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        
        {/* Desktop Tab Pills (hidden on mobile, visible on tablet/desktop) */}
        <div className="hidden sm:flex items-center space-x-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6 shadow-sm w-fit">
          {[
            { id: 'dashboard', label: '🏠 Dashboard' },
            { id: 'map', label: '🗺️ Micro-Climate Map' },
            { id: 'plan', label: '🗓️ Mausam Plan' },
            { id: 'ai', label: '🤖 AI Health Assistant' },
            { id: 'alerts', label: '🚨 Alerts & Safety' },
            { id: 'profile', label: '👤 Profile & Health' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundManager.playChime();
                setActiveTab(tab.id);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Views */}
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'map' && <MicroClimateMap />}
        {activeTab === 'plan' && <MausamPlanView />}
        {activeTab === 'ai' && <AiHealthAssistant />}
        {activeTab === 'alerts' && <AlertsCenter />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Floating AI Assistant Quick Trigger Bubble */}
      {activeTab !== 'ai' && (
        <button
          onClick={() => {
            soundManager.playChime();
            setActiveTab('ai');
          }}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-30 flex items-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-xl shadow-sky-600/30 hover:scale-105 transition-all border border-sky-400/40"
          title="Open AI Health Assistant"
        >
          <Bot className="w-5 h-5 animate-bounce" />
          <span className="hidden sm:inline">Ask AI Assistant</span>
        </button>
      )}

      {/* Mobile Native Bottom Navigation */}
      <BottomNav />

    </div>
  );

  // If mobile frame view is toggled on desktop, wrap in an iPhone-style frame
  if (isMobileFrameView) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 select-none">
        
        {/* Toggle Bar */}
        <div className="mb-3 flex items-center space-x-3 text-xs text-slate-400">
          <span>Mobile App Frame Mode</span>
          <button
            onClick={() => setIsMobileFrameView(false)}
            className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Switch to Full Responsive</span>
          </button>
        </div>

        {/* Device Frame */}
        <div className="relative w-full max-w-[420px] h-[860px] bg-slate-900 rounded-[48px] border-[10px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          
          {/* Mock Status Bar */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-2 flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 z-50 shrink-0 border-b border-slate-200/50 dark:border-slate-800/50">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center space-x-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* App Window Inside Frame */}
          <div className="flex-1 overflow-y-auto">
            {MainContent}
          </div>

        </div>

      </div>
    );
  }

  return (
    <>
      {MainContent}
      
      {/* Desktop Helper Toggle in bottom-left */}
      <div className="hidden lg:block fixed bottom-4 left-4 z-40">
        <button
          onClick={() => {
            soundManager.playChime();
            setIsMobileFrameView(true);
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-semibold shadow-sm transition"
          title="Preview App in Mobile Frame"
        >
          <Smartphone className="w-3.5 h-3.5 text-sky-500" />
          <span>Mobile Frame View</span>
        </button>
      </div>
    </>
  );
}

export default function App() {
  return (
    <WeatherProvider>
      <AppContent />
    </WeatherProvider>
  );
}
