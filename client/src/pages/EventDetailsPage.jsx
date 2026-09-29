import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import RegistrationModal from '../components/events/RegistrationModal';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Share2, 
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await api.getEventById(id);
        if (res.success && res.event) {
          setEvent(res.event);
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading opportunity details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Event Not Found</h2>
        <p className="text-sm text-slate-500">The event you are looking for does not exist or has been removed.</p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Events
        </Link>
      </div>
    );
  }

  const isPast = new Date(event.date) < new Date(new Date().toISOString().split('T')[0]);
  const isFull = event.maxSeats > 0 && event.registrationCount >= event.maxSeats;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </button>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-xl">
        
        {/* Banner */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-slate-900">
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Category Pill Tag */}
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 text-brand-700 dark:text-brand-300 backdrop-blur-md shadow-md">
              {event.category}
            </span>
            {event.isFeatured && (
              <span className="flex items-center gap-1 text-xs font-black px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-accent-500 text-white shadow-md uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                Featured
              </span>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 backdrop-blur-md transition-colors"
            title="Copy event link"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {event.title}
            </h1>

            {/* Quick Grid Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
                <span className="font-semibold">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="truncate">{event.organizer || 'ClubHub Council'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overview & Details
            </h3>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Eligibility & Seats Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Eligibility
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{event.eligibility || 'Open to all students'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Registration Capacity
              </span>
              <div className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-500 shrink-0" />
                  {event.maxSeats > 0 ? `${event.registrationCount || 0} / ${event.maxSeats} filled` : `${event.registrationCount || 0} registered`}
                </span>
                {isPast ? (
                  <span className="text-xs text-slate-400 font-bold">Ended</span>
                ) : isFull ? (
                  <span className="text-xs text-rose-500 font-bold">Capacity Full</span>
                ) : (
                  <span className="text-xs text-emerald-500 font-bold">Open</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              to="/events"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Explore Other Opportunities
            </Link>

            {isPast ? (
              <button
                disabled
                className="px-8 py-3 rounded-2xl text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 cursor-not-allowed border border-slate-200 dark:border-slate-700"
              >
                Event Ended
              </button>
            ) : isFull ? (
              <button
                disabled
                className="px-8 py-3 rounded-2xl text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 cursor-not-allowed border border-rose-200 dark:border-rose-900"
              >
                Capacity Full
              </button>
            ) : (
              <button
                onClick={() => setRegisterOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-700 hover:via-indigo-700 hover:to-accent-700 shadow-xl shadow-brand-500/25 transition-all"
              >
                <span>Register Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>

      <RegistrationModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        event={event}
        onRegisteredSuccess={() => {
          setEvent(prev => ({
            ...prev,
            registrationCount: (prev.registrationCount || 0) + 1
          }));
        }}
      />

    </div>
  );
}
