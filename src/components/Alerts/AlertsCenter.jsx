import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  CheckCircle2, 
  Share2, 
  Flame, 
  CloudRain, 
  Wind, 
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function AlertsCenter() {
  const { alerts, selectedLocation } = useWeather();
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);

  const toggleSiren = () => {
    const running = soundManager.toggleEmergencySiren(
      () => setIsSirenOn(true),
      () => setIsSirenOn(false)
    );
    setIsSirenOn(running);
  };

  const emergencyContacts = [
    { name: "National Emergency Service", number: "112", role: "Police / Fire / Ambulance Integrated" },
    { name: "NDRF Disaster Relief", number: "1078", role: "Cyclone, Flood, Heavy Storm Support" },
    { name: "Ambulance / Medical Response", number: "108", role: "24x7 Emergency Medical Transport" },
    { name: "Women Safety Cell", number: "1090", role: "Immediate Helpline for Women" },
    { name: "Traffic Control Room", number: "1095", role: "Live Road Blockages & Underpass Updates" }
  ];

  const handleCopySms = () => {
    soundManager.playChime();
    const smsPayload = `[EMERGENCY WEATHER ALERT - MAUSAM SATHI]\nLocation: ${selectedLocation.name}\nAlert: Extreme Heat & High AQI Alert active.\nAdvice: Stay indoors 12-4 PM, hydrate with ORS, call 112 if experiencing heat exhaustion.\nSource: IMD / MoES / NDMA`;
    navigator.clipboard.writeText(smsPayload);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2500);
  };

  return (
    <div className="space-y-5 pb-16 sm:pb-8 animate-in fade-in max-w-5xl mx-auto">
      
      {/* Header & Siren Test Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>WEATHER & EMERGENCY ALERTS</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                NDMA / IMD Certified
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Government advisories, severe meteorological warnings & safety checklists
            </p>
          </div>
        </div>

        {/* Siren Sound Synthesizer Button */}
        <button
          onClick={toggleSiren}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md ${
            isSirenOn
              ? 'bg-red-600 text-white animate-pulse shadow-red-600/40 ring-4 ring-red-300 dark:ring-red-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
          }`}
        >
          {isSirenOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-500" />}
          <span>{isSirenOn ? 'Stop Emergency Siren' : 'Test Warning Siren'}</span>
        </button>
      </div>

      {/* Active Alerts Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Active Bulletins & Advisories for {selectedLocation.name}
        </h3>

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border shadow-sm space-y-3 ${
              alert.level === 'orange' || alert.level === 'red'
                ? 'bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-orange-300 dark:border-orange-900/60'
                : 'bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border-sky-300 dark:border-sky-900/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase text-white ${
                  alert.level === 'red' ? 'bg-red-600' : alert.level === 'orange' ? 'bg-orange-500' : 'bg-amber-500'
                }`}>
                  {alert.level} ALERT
                </span>
                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                  {alert.title}
                </h4>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Issued by {alert.issuingAuthority}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {alert.summary}
            </p>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ACTIONABLE NDMA SAFETY PROTOCOLS
              </span>
              <ul className="space-y-1">
                {alert.actionableChecklist?.map((item, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Emergency SMS Broadcast Generator & Helplines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* SMS Broadcast Generator */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Emergency SMS Broadcast Payload
            </span>
            <button
              onClick={handleCopySms}
              className="flex items-center space-x-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              {copiedSms ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSms ? 'Copied!' : 'Copy SMS'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Pre-formatted 160-character emergency bulletin for offline cell-broadcast or family SMS during power cuts.
          </p>
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            [EMERGENCY WEATHER ALERT - MAUSAM SATHI]<br/>
            Location: {selectedLocation.name}<br/>
            Alert: Extreme Heat & High AQI Alert active.<br/>
            Advice: Stay indoors 12-4 PM, hydrate with ORS, call 112 if experiencing heat exhaustion.<br/>
            Source: IMD / MoES / NDMA
          </div>
        </div>

        {/* Emergency Helpline Numbers */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            National Disaster & Emergency Helplines
          </span>
          <div className="space-y-2">
            {emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                    {contact.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {contact.role}
                  </span>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call {contact.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
