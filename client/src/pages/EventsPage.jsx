import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import EventCard from '../components/common/EventCard';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import RegistrationModal from '../components/events/RegistrationModal';
import EventDetailsModal from '../components/events/EventDetailsModal';
import { Compass, CalendarX, RotateCcw } from 'lucide-react';

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & filter state initialized from URL or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [department, setDepartment] = useState(searchParams.get('department') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registerEvent, setRegisterEvent] = useState(null);

  // Synchronize state with URL search params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory && urlCategory !== category) {
      setCategory(urlCategory);
    }
  }, [searchParams]);

  // Fetch events on filter/search change
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents({
        search: searchTerm,
        category: category,
        department: department !== 'All' ? department : '',
        status: status,
        sort: sort
      });
      if (res.success && res.events) {
        setEvents(res.events);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, category, department, status, sort]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setDepartment('All');
    setStatus('all');
    setSort('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          Campus Event Directory
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Explore All Club Events
          </h1>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
            {events.length} {events.length === 1 ? 'Opportunity' : 'Opportunities'} Available
          </span>
        </div>
      </div>

      {/* Search & Filter Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
        <SearchBar
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
          placeholder="Search by event title, tags, or campus venue..."
        />

        <FilterBar
          selectedCategory={category}
          onSelectCategory={(cat) => setCategory(cat)}
          selectedDepartment={department}
          onSelectDepartment={(dept) => setDepartment(dept)}
          selectedStatus={status}
          onSelectStatus={(st) => setStatus(st)}
          selectedSort={sort}
          onSelectSort={(st) => setSort(st)}
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 dark:bg-brand-950/80 text-brand-500 flex items-center justify-center">
            <CalendarX className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              No Events Found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              We couldn't find any events matching your selected criteria. Try adjusting your search query or reset your filters.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/80 dark:text-brand-300 dark:hover:bg-brand-900/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event._id || event.id}
              event={event}
              onSelect={(ev) => setSelectedEvent(ev)}
              onRegister={(ev) => setRegisterEvent(ev)}
            />
          ))}
        </div>
      )}

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
        onRegisteredSuccess={() => {
          fetchEvents();
        }}
      />

    </div>
  );
}
