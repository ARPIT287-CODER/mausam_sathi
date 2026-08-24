import React, { useState, useEffect } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import ReportHazardModal from './ReportHazardModal';
import ReportVerificationCard from './ReportVerificationCard';
import { 
  PlusCircle, 
  MapPin, 
  Layers, 
  Navigation, 
  AlertTriangle, 
  ShieldCheck, 
  Droplets,
  CloudLightning,
  Trees,
  CloudFog,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

// Helper component to center map on coordinates
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MicroClimateMap() {
  const { 
    selectedLocation, 
    communityReports, 
    handleVoteReport, 
    darkMode,
    detectUserGpsLocation 
  } = useWeather();

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState([selectedLocation.lat, selectedLocation.lon]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    setMapCenter([selectedLocation.lat, selectedLocation.lon]);
  }, [selectedLocation]);

  // Custom marker icon creator
  const createHazardIcon = (type, severity, verified) => {
    let color = severity === 'extreme' ? '#e11d48' : severity === 'high' ? '#f97316' : '#3b82f6';
    let iconChar = type === 'waterlogging' ? '🌊' : type === 'hailstorm' ? '⛈️' : type === 'tree_fallen' ? '🌳' : type === 'smog' ? '🌫️' : '⚠️';

    return L.divIcon({
      className: 'custom-hazard-marker',
      html: `
        <div style="
          position: relative;
          background: ${color};
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        ">
          ${iconChar}
          ${verified ? '<div style="position:absolute;bottom:-2px;right:-2px;background:#10b981;width:14px;height:14px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;color:white;font-size:8px;font-weight:bold;">✓</div>' : ''}
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });
  };

  const userLocationIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        background: #0284c7;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 0 15px #0284c7;
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const handleSelectReportFromList = (report) => {
    setMapCenter([report.location.lat, report.location.lon]);
    setSelectedReport(report);
  };

  const tileUrl = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="space-y-4 pb-16 sm:pb-8 animate-in fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>SMART MICRO-CLIMATE MAP</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Live Crowd Layer
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Real-time citizen-verified micro-climate hazard warnings
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={() => {
              soundManager.playChime();
              detectUserGpsLocation();
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-500" />
            <span>Locate Me</span>
          </button>

          <button
            onClick={() => {
              soundManager.playChime();
              setReportModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-red-600/20 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Hazard</span>
          </button>
        </div>
      </div>

      {/* Grid: Map on Left/Top + Community Verification Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Map Container */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm h-[480px] sm:h-[540px] relative">
          
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            <ChangeView center={mapCenter} zoom={13} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url={tileUrl}
            />

            {/* User GPS Pin */}
            <Marker position={[selectedLocation.lat, selectedLocation.lon]} icon={userLocationIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <strong className="text-sky-600 font-bold block">{selectedLocation.name}</strong>
                  <span className="text-slate-500">Your Current Anchor Location</span>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[selectedLocation.lat, selectedLocation.lon]}
              radius={3500}
              pathOptions={{ color: '#0284c7', fillColor: '#0284c7', fillOpacity: 0.08 }}
            />

            {/* Community Reports Pins */}
            {communityReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.location.lat, report.location.lon]}
                icon={createHazardIcon(report.type, report.severity, report.verified)}
              >
                <Popup>
                  <div className="p-1 space-y-2 text-xs max-w-xs">
                    <div className="flex items-center justify-between gap-2 border-b pb-1">
                      <span className="font-bold text-slate-800">{report.title}</span>
                      {report.verified && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-600 leading-snug">
                      {report.description}
                    </p>

                    <div className="text-[10px] text-slate-500">
                      📍 {report.location.landmark || report.location.name}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t">
                      <button
                        onClick={() => handleVoteReport(report.id, 'confirm')}
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-bold text-[11px] border border-emerald-200"
                      >
                        Confirm ({report.confirmations})
                      </button>
                      <button
                        onClick={() => handleVoteReport(report.id, 'reject')}
                        className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-bold text-[11px] border border-rose-200"
                      >
                        Reject ({report.rejections})
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Map legend overlay */}
          <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-1 shadow-md">
            <div className="font-bold text-slate-700 dark:text-slate-200 text-[10px] uppercase">
              Micro-Climate Legend
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">🌊 Waterlogging</span>
              <span className="flex items-center gap-1">⛈️ Hailstorm</span>
              <span className="flex items-center gap-1">🌳 Tree Fallen</span>
              <span className="flex items-center gap-1">🌫️ Smog</span>
            </div>
          </div>

        </div>

        {/* Verification & Reports Feed on Right */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Community Reports Feed
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {communityReports.length} Active
            </span>
          </div>

          <ReportVerificationCard onSelectReport={handleSelectReportFromList} />
        </div>

      </div>

      {/* Modal */}
      <ReportHazardModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        defaultLocation={selectedLocation}
      />

    </div>
  );
}
