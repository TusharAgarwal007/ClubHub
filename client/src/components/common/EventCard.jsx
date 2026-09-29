import React from 'react';
import { Calendar, Clock, MapPin, Users, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const categoryColors = {
  Workshop: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Competition: 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Seminar: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  Cultural: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Sports: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
};

export default function EventCard({ event, onRegister, onSelect }) {
  const isPast = new Date(event.date) < new Date(new Date().toISOString().split('T')[0]);
  const isFull = event.maxSeats > 0 && event.registrationCount >= event.maxSeats;

  // Format Date: e.g. "Sat, Oct 18, 2026"
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const categoryStyle = categoryColors[event.category] || categoryColors.Default;

  return (
    <div 
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
      onClick={() => onSelect && onSelect(event)}
    >
      {/* Banner Image Container */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Category & Department Pill Tags */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${categoryStyle}`}>
            {event.category}
          </span>
          {event.department && event.department !== 'All Departments' && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-white/10 shadow-sm">
              {event.department}
            </span>
          )}
          {event.isFeatured && (
            <span className="flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-accent-500 text-white shadow-md shadow-accent-500/30 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 fill-white" />
              Featured
            </span>
          )}
        </div>

        {/* Date Ribbon Badge */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-2 text-white text-xs font-semibold backdrop-blur-md bg-slate-950/60 px-3 py-1 rounded-lg border border-white/10">
          <Calendar className="w-3.5 h-3.5 text-accent-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Seat / Status Badge */}
        <div className="absolute bottom-3 right-3.5">
          {isPast ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-900/80 text-slate-300 backdrop-blur-md border border-slate-700">
              Ended
            </span>
          ) : isFull ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-600/90 text-white backdrop-blur-md">
              Housefull
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Open
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Metadata details */}
          <div className="space-y-1.5 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-brand-500 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-accent-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Footer info & CTA Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          {/* Seats Info */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Users className="w-4 h-4 text-brand-500" />
            <span>
              {event.maxSeats > 0 ? (
                <>
                  <strong className="text-slate-900 dark:text-slate-200">{event.registrationCount || 0}</strong>
                  <span>/{event.maxSeats} filled</span>
                </>
              ) : (
                <>
                  <strong className="text-slate-900 dark:text-slate-200">{event.registrationCount || 0}</strong> registered
                </>
              )}
            </span>
          </div>

          {/* Action button */}
          {isPast ? (
            <button
              disabled
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 cursor-not-allowed border border-slate-200 dark:border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              Event Ended
            </button>
          ) : isFull ? (
            <button
              disabled
              className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 cursor-not-allowed border border-rose-200 dark:border-rose-900"
              onClick={(e) => e.stopPropagation()}
            >
              Capacity Full
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRegister && onRegister(event);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-sm shadow-brand-500/20 hover:shadow-md hover:shadow-brand-500/30 transition-all duration-200"
            >
              <span>Register</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
