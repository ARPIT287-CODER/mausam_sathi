import React from 'react';
import { useWeather } from '../context/WeatherContext';
import { 
  LayoutDashboard, 
  MapPin, 
  CalendarCheck, 
  Bot, 
  AlertTriangle, 
  UserCircle 
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function BottomNav() {
  const { activeTab, setActiveTab, alerts } = useWeather();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'plan', label: 'Plan', icon: CalendarCheck },
    { id: 'ai', label: 'AI Health', icon: Bot },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: alerts?.length || 0 },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-slate-800/90 shadow-2xl sm:hidden text-slate-100">
      <div className="flex items-center justify-around h-15 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                soundManager.playChime();
              }}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
                isActive
                  ? 'text-teal-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 text-[9px] font-extrabold bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 bg-teal-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
