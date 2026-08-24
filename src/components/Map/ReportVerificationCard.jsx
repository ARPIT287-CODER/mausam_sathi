import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { 
  CheckCircle2, 
  XCircle, 
  ThumbsUp, 
  ThumbsDown, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  User,
  Filter
} from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function ReportVerificationCard({ onSelectReport }) {
  const { communityReports, handleVoteReport } = useWeather();
  const [filterType, setFilterType] = useState('all');

  const filteredReports = filterType === 'all'
    ? communityReports
    : communityReports.filter(r => r.type === filterType);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'extreme': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-white">EXTREME</span>;
      case 'high': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-500 text-white">HIGH RISK</span>;
      case 'moderate': return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white">MODERATE</span>;
      default: return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white">LOW</span>;
    }
  };

  return (
    <div className="space-y-3">
      
      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'all', label: 'All Hazards' },
          { id: 'waterlogging', label: 'Waterlogging' },
          { id: 'hailstorm', label: 'Hailstorm' },
          { id: 'tree_fallen', label: 'Obstructions' },
          { id: 'smog', label: 'Smog' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              filterType === f.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => onSelectReport && onSelectReport(report)}
            className="p-4 rounded-2xl glass-card-interactive border border-slate-200/80 dark:border-slate-800 space-y-2.5 cursor-pointer"
          >
            
            {/* Top Row: Title, Severity & Verified Badge */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  {getSeverityBadge(report.severity)}
                  {report.verified ? (
                    <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Community Verified</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
                      ⏳ Pending Verification
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {report.title}
                </h4>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {report.description}
            </p>

            {/* Location & Landmark */}
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="truncate">{report.location.landmark || report.location.name}</span>
            </div>

            {/* Bottom Row: Reporter info & Confirmation Voting */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
                <User className="w-3 h-3" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{report.user}</span>
                <span className="text-slate-400">• {report.userBadge}</span>
              </div>

              {/* Confirm / Reject Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVoteReport(report.id, 'confirm');
                  }}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 transition"
                  title="Confirm this hazard report"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Confirm ({report.confirmations})</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVoteReport(report.id, 'reject');
                  }}
                  className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800 transition"
                  title="Reject / Report as cleared"
                >
                  <ThumbsDown className="w-3 h-3" />
                  <span>✕ ({report.rejections})</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
