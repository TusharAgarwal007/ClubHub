import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/common/DataTable';
import EventFormModal from '../components/admin/EventFormModal';
import Modal from '../components/common/Modal';
import { CATEGORIES, DEPARTMENTS } from '../constants';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Users, 
  AlertTriangle,
  Loader2,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  // Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents({
        search: searchTerm,
        category: categoryFilter !== 'All' ? categoryFilter : '',
        department: departmentFilter !== 'All' ? departmentFilter : '',
        status: 'all'
      });
      if (res.success && res.events) {
        setEvents(res.events);
      }
    } catch (err) {
      console.error('Failed to load admin events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchTerm, categoryFilter, departmentFilter]);

  const handleEdit = (event) => {
    setEventToEdit(event);
    setFormModalOpen(true);
  };

  const handleCreate = () => {
    setEventToEdit(null);
    setFormModalOpen(true);
  };

  const promptDelete = (event) => {
    setEventToDelete(event);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setDeleting(true);
    try {
      const res = await api.deleteEvent(eventToDelete._id || eventToDelete.id);
      setDeleteFeedback(res.message || 'Event deleted successfully.');
      setDeleteModalOpen(false);
      setEventToDelete(null);
      fetchEvents();
      setTimeout(() => setDeleteFeedback(''), 4000);
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert(err.message || 'Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFeatured = async (event) => {
    try {
      await api.updateEvent(event._id || event.id, {
        isFeatured: !event.isFeatured
      });
      fetchEvents();
    } catch (err) {
      console.error('Failed to toggle featured state:', err);
    }
  };

  const columns = [
    {
      header: 'Event',
      className: 'min-w-[280px]',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.bannerImage}
            alt=""
            className="w-12 h-12 rounded-xl object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                {row.title}
              </span>
              {row.isFeatured && (
                <span className="flex items-center gap-0.5 text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-accent-500 text-white uppercase">
                  <Sparkles className="w-2.5 h-2.5 fill-white" />
                  Featured
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 line-clamp-1">{row.venue}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      render: (row) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {row.category}
        </span>
      )
    },
    {
      header: 'Date & Time',
      render: (row) => (
        <div className="text-xs space-y-0.5">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-slate-400">{row.time}</div>
        </div>
      )
    },
    {
      header: 'Registrations',
      render: (row) => (
        <div className="text-xs font-semibold">
          <span className="text-brand-600 dark:text-brand-400 font-bold">{row.registrationCount || 0}</span>
          <span className="text-slate-400">/{row.maxSeats > 0 ? row.maxSeats : '∞'} seats</span>
        </div>
      )
    },
    {
      header: 'Featured',
      render: (row) => (
        <button
          onClick={() => handleToggleFeatured(row)}
          className={`p-1.5 rounded-xl border text-xs font-bold transition-all ${
            row.isFeatured
              ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950 dark:border-amber-800'
              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 dark:bg-slate-800 dark:border-slate-700'
          }`}
          title={row.isFeatured ? "Currently Featured" : "Click to set as Featured"}
        >
          <Sparkles className={`w-4 h-4 ${row.isFeatured ? 'fill-amber-500' : ''}`} />
        </button>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-brand-50 dark:text-slate-400 dark:hover:text-brand-400 dark:hover:bg-slate-800 transition-colors"
            title="Edit event"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => promptDelete(row)}
            className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-400 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
            Manage Events
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, feature, and delete campus club events.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Delete Feedback Toast */}
      {deleteFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{deleteFeedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="All">All Departments</option>
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Events DataTable */}
      <DataTable
        columns={columns}
        data={events}
        isLoading={loading}
        emptyMessage="No events found."
        keyField="_id"
      />

      {/* Add / Edit Modal */}
      <EventFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEventToEdit(null);
        }}
        eventToEdit={eventToEdit}
        onSaved={() => {
          fetchEvents();
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Event Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0 text-rose-600" />
            <div className="text-xs leading-relaxed">
              <strong className="block font-bold">Warning: Cascade Deletion!</strong>
              Deleting <strong className="text-slate-900 dark:text-white">"{eventToDelete?.title}"</strong> will also permanently remove all of its associated student registrations.
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400">
            Are you sure you want to proceed? This action cannot be undone.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={confirmDelete}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 disabled:opacity-50 transition-all"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Event & Registrations</span>
              )}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
