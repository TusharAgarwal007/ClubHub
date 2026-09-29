import React from 'react';
import Modal from '../common/Modal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Share2, 
  ArrowRight, 
  Building2, 
  Sparkles,
  Award
} from 'lucide-react';

export default function EventDetailsModal({ isOpen, onClose, event, onRegisterClick }) {
  if (!event) return null;

  const isPast = new Date(event.date) < new Date(new Date().toISOString().split('T')[0]);
  const isFull = event.maxSeats > 0 && event.registrationCount >= event.maxSeats;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Banner with Badges */}
        <div className="relative -mx-6 -mt-6 h-56 sm:h-64 overflow-hidden rounded-t-3xl bg-slate-900">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-brand-700 dark:text-brand-300 backdrop-blur-md shadow-sm">
              {event.category}
            </span>
            {event.isFeatured && (
              <span className="flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-accent-500 text-white shadow-md uppercase tracking-wider">
                <Sparkles className="w-3 h-3 fill-white" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Title & Key Meta */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-snug">
            {event.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
              <span className="truncate">{event.organizer || 'ClubHub Council'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            About This Opportunity
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Eligibility & Seats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Eligibility
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>{event.eligibility || 'Open to all college students'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Seat Availability
            </span>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-500" />
                {event.maxSeats > 0 ? `${event.registrationCount || 0} / ${event.maxSeats} registered` : `${event.registrationCount || 0} registered`}
              </span>
              {isPast ? (
                <span className="text-slate-400">Ended</span>
              ) : isFull ? (
                <span className="text-rose-500">Full</span>
              ) : (
                <span className="text-emerald-500">Seats Open</span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          {isPast ? (
            <button
              disabled
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
            >
              Event Concluded
            </button>
          ) : isFull ? (
            <button
              disabled
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 cursor-not-allowed"
            >
              Capacity Full
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onRegisterClick && onRegisterClick(event);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-700 hover:via-indigo-700 hover:to-accent-700 shadow-md shadow-brand-500/25 transition-all"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
