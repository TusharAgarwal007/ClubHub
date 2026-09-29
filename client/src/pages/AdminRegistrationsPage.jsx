import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/common/DataTable';
import { 
  Download, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Ticket, 
  Users, 
  Building2, 
  Calendar,
  Phone,
  Mail,
  GraduationCap
} from 'lucide-react';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load events for filter dropdown
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.getEvents({ status: 'all' });
        if (res.success && res.events) {
          setEvents(res.events);
        }
      } catch (err) {
        console.error('Failed to load events for filter:', err);
      }
    }
    loadEvents();
  }, []);

  // Fetch registrations
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.getRegistrations({
        search: searchTerm,
        eventId: selectedEventId,
        yearOfStudy: selectedYear,
        page: currentPage,
        limit: 10
      });

      if (res.success) {
        setRegistrations(res.registrations || []);
        if (res.pagination) {
          setTotalPages(res.pagination.totalPages || 1);
          setTotalCount(res.pagination.totalCount || 0);
        }
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [searchTerm, selectedEventId, selectedYear, currentPage]);

  const handleExportCSV = () => {
    const exportUrl = api.getExportCsvUrl({
      search: searchTerm,
      eventId: selectedEventId,
      yearOfStudy: selectedYear
    });
    // Trigger download
    window.open(exportUrl, '_blank');
  };

  const columns = [
    {
      header: 'Ticket & Student',
      className: 'min-w-[220px]',
      render: (row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
            <span>{row.fullName}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] text-brand-600 dark:text-brand-400">
            <Ticket className="w-3 h-3" />
            <span>{row.ticketId}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Contact Info',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{row.phoneNumber}</span>
          </div>
        </div>
      )
    },
    {
      header: 'College & Year',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
            {row.collegeName}
          </div>
          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
            {row.yearOfStudy}
          </span>
        </div>
      )
    },
    {
      header: 'Event',
      className: 'min-w-[200px]',
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold text-brand-700 dark:text-brand-300 line-clamp-1">
            {row.event?.title || 'Unknown Event'}
          </span>
          <span className="text-[11px] text-slate-400">
            {row.event?.date ? new Date(row.event.date).toLocaleDateString() : ''}
          </span>
        </div>
      )
    },
    {
      header: 'Registered On',
      render: (row) => (
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {row.registeredAt ? new Date(row.registeredAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A'}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Student Registrations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse, search, filter and export registered students.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-500" />
          <span>Export Filtered to CSV</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by student name, email, college, or ticket..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Event Filter */}
        <select
          value={selectedEventId}
          onChange={(e) => {
            setSelectedEventId(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none max-w-[200px]"
        >
          <option value="All">All Events</option>
          {events.map((e) => (
            <option key={e._id || e.id} value={e._id || e.id}>
              {e.title}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => {
            setSelectedYear(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="All">All Years</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Registrations Table */}
      <DataTable
        columns={columns}
        data={registrations}
        isLoading={loading}
        emptyMessage="No registrations found for the selected criteria."
        keyField="_id"
      />

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing <strong>{registrations.length}</strong> of <strong>{totalCount}</strong> total entries
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1 || loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages || loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
