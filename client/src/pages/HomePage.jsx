import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import EventCard from '../components/common/EventCard';
import WinnersSection from '../components/winners/WinnersSection';
import RegistrationModal from '../components/events/RegistrationModal';
import EventDetailsModal from '../components/events/EventDetailsModal';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Users, 
  Trophy, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Compass,
  Rocket,
  Shield,
  Layers
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registerEvent, setRegisterEvent] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getEvents({ status: 'upcoming' });
        if (res.success && res.events) {
          setEvents(res.events);
        }
      } catch (err) {
        console.error('Failed to load home events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Find the featured event (or fall back to first event)
  const featuredEvent = events.find(e => e.isFeatured) || events[0];
  // Next 4-6 upcoming events
  const upcomingEvents = events.slice(0, 6);

  // Strictly the 5 allowed categories
  const categories = [
    { name: 'Workshop', icon: '🛠️', count: '5+' },
    { name: 'Competition', icon: '🏆', count: '8+' },
    { name: 'Seminar', icon: '🎙️', count: '4+' },
    { name: 'Cultural', icon: '🎸', count: '3+' },
    { name: 'Sports', icon: '🎮', count: '4+' }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
        {/* Ambient Gradient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-indigo-500/15 to-accent-500/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Live Urgency Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/80 border border-brand-200/80 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-bold shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-accent-500 fill-accent-500" />
              Over 1,200+ students registered this semester!
            </span>
          </div>

          {/* Catchy Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Discover, Compete & Elevate Your{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-500 dark:from-brand-400 dark:via-indigo-300 dark:to-accent-400 bg-clip-text text-transparent">
              College Journey
            </span>
          </h1>

          {/* Club Introduction */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The unified campus hub for flagship competitions, technical workshops, cultural festivals, esports arenas, and academic seminars.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 hover:from-brand-700 hover:via-indigo-700 hover:to-accent-700 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/35 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/winners"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-extrabold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Hall of Fame (Winners)</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. Featured Event Banner Card */}
      {featuredEvent && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-accent-600 dark:text-accent-400">
                <Sparkles className="w-4 h-4 fill-accent-500 text-accent-500" />
                Spotlight Opportunity
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                Featured Flagship Event
              </h2>
            </div>
            <Link
              to="/events"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>See all events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-2xl border border-slate-800/80">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              
              {/* Image Col */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[420px] w-full overflow-hidden">
                <img
                  src={featuredEvent.bannerImage}
                  alt={featuredEvent.title}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 lg:bg-gradient-to-r lg:from-transparent lg:to-indigo-950/90 pointer-events-none" />
                
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/90 text-brand-700 backdrop-blur-md shadow-md">
                    {featuredEvent.category}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-accent-500 text-white shadow-md flex items-center gap-1 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 fill-white" />
                    Featured
                  </span>
                </div>
              </div>

              {/* Text Info Col */}
              <div className="lg:col-span-5 p-6 sm:p-10 space-y-6">
                <div>
                  <span className="text-xs font-bold text-accent-400 tracking-wider uppercase">
                    {featuredEvent.organizer || 'ClubHub Council'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mt-1">
                    {featuredEvent.title}
                  </h3>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {featuredEvent.description}
                </p>

                {/* Event Highlights */}
                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-accent-400 shrink-0" />
                    <span className="font-semibold">
                      {new Date(featuredEvent.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-accent-400 shrink-0" />
                    <span>{featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-accent-400 shrink-0" />
                    <span className="truncate">{featuredEvent.venue}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setRegisterEvent(featuredEvent)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs font-extrabold text-white bg-gradient-to-r from-accent-500 to-amber-500 hover:from-accent-600 hover:to-amber-600 shadow-lg shadow-accent-500/30 hover:-translate-y-0.5 transition-all"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setSelectedEvent(featuredEvent)}
                    className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. OUR WINNERS / HALL OF FAME SECTION */}
      <WinnersSection />

      {/* 4. Category Chips Explorer (Only the 5 valid categories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Browse By Category
          </h3>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Explore Opportunities Across Campus
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/events?category=${cat.name}`)}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                {cat.name}
              </span>
              <span className="text-xs text-slate-400 font-medium mt-1">
                {cat.count} Events
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. Upcoming Events Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              Calendar Highlights
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              Upcoming Campus Events
            </h2>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors"
          >
            <span>View All ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <EventCard
                key={event._id || event.id}
                event={event}
                onSelect={(ev) => setSelectedEvent(ev)}
                onRegister={(ev) => setRegisterEvent(ev)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. About the Club & Stats Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-700 to-brand-800 text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-accent-300">
              About The ClubHub Initiative
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Fueling Innovation, Creativity & Campus Spirit
            </h2>
            <p className="text-sm sm:text-base text-brand-100 leading-relaxed">
              ClubHub connects passionate collegiate minds with hands-on competitions, industry masterclasses, and vibrant cultural showcases. Our student-led council works year-round to bring premier competitions and community events to campus.
            </p>
          </div>

          {/* Stats Strip */}
          <div className="relative z-10 mt-10 pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">50+</div>
              <div className="text-xs font-semibold text-brand-200 mt-1">Events Hosted</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">1,200+</div>
              <div className="text-xs font-semibold text-brand-200 mt-1">Active Members</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">15+</div>
              <div className="text-xs font-semibold text-brand-200 mt-1">Campus Chapters</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white">₹5 Lakhs+</div>
              <div className="text-xs font-semibold text-brand-200 mt-1">Prizes Awarded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <EventDetailsModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        onRegisterClick={(ev) => setRegisterEvent(ev)}
      />

      <RegistrationModal
        isOpen={!!registerEvent}
        onClose={() => setRegisterEvent(null)}
        event={registerEvent}
        onRegisteredSuccess={() => {}}
      />

    </div>
  );
}
