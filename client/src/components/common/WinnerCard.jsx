import React from 'react';
import { Trophy, Medal, Award, Sparkles, Building2, Calendar, Gift } from 'lucide-react';

const categoryColors = {
  Workshop: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Competition: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Seminar: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  Cultural: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Sports: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
};

export default function WinnerCard({ winner }) {
  const is1st = winner.position === 1;
  const is2nd = winner.position === 2;
  const is3rd = winner.position === 3;

  const positionBadge = is1st ? {
    label: '1st Place',
    badgeClass: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/25 border-amber-300',
    icon: Trophy
  } : is2nd ? {
    label: '2nd Place',
    badgeClass: 'bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-black shadow-md shadow-slate-400/20 border-slate-300',
    icon: Medal
  } : {
    label: '3rd Place',
    badgeClass: 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white font-black shadow-md shadow-amber-800/20 border-amber-600',
    icon: Award
  };

  const PositionIcon = positionBadge.icon;
  const categoryStyle = categoryColors[winner.category] || categoryColors.Default;

  // Initials generator
  const initials = winner.name
    ? winner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'W';

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 overflow-hidden">
      
      {/* Top Header: Position Badge & Category */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border ${positionBadge.badgeClass}`}>
          <PositionIcon className="w-3.5 h-3.5" />
          <span>{positionBadge.label}</span>
        </span>

        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${categoryStyle}`}>
          {winner.category}
        </span>
      </div>

      {/* Avatar & Winner Info */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="relative">
          {winner.photo ? (
            <img
              src={winner.photo}
              alt={winner.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/20 shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            style={{ display: winner.photo ? 'none' : 'flex' }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-500 items-center justify-center text-white font-black text-lg shadow-sm"
          >
            {initials}
          </div>

          {is1st && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-sm ring-2 ring-white dark:ring-slate-900">
              👑
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {winner.name}
          </h4>
          {winner.teamName && (
            <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold truncate">
              {winner.teamName}
            </p>
          )}
          <p className="text-[11px] text-slate-400 truncate">
            {winner.department || 'Campus Department'} {winner.year ? `• ${winner.year}` : ''}
          </p>
        </div>
      </div>

      {/* Event Details */}
      <div className="flex-1 space-y-2 py-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="text-slate-700 dark:text-slate-300 font-medium">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Event</span>
          <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
            {winner.eventName || winner.event?.title || 'Annual College Championship'}
          </span>
        </div>

        {/* Prize Tag */}
        {winner.prize && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-50 dark:bg-accent-950/50 text-accent-700 dark:text-accent-300 border border-accent-200/80 dark:border-accent-900/60 font-bold text-xs">
            <Gift className="w-3.5 h-3.5 text-accent-500 shrink-0" />
            <span className="truncate">{winner.prize}</span>
          </div>
        )}
      </div>

      {/* Footer Tag */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Building2 className="w-3 h-3 text-slate-400" />
          <span className="truncate max-w-[130px]">{winner.department}</span>
        </span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
          <Sparkles className="w-3 h-3 fill-emerald-500 text-emerald-500" />
          Verified
        </span>
      </div>

    </div>
  );
}
