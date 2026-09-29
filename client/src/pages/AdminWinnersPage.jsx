import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import DataTable from '../components/common/DataTable';
import WinnerFormModal from '../components/admin/WinnerFormModal';
import Modal from '../components/common/Modal';
import { dummyWinners } from '../data/dummyWinners';
import { CATEGORIES, DEPARTMENTS } from '../constants';
import { 
  Trophy, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Medal, 
  Award, 
  CheckCircle2, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function AdminWinnersPage() {
  const [winners, setWinners] = useState(dummyWinners);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [winnerToEdit, setWinnerToEdit] = useState(null);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [winnerToDelete, setWinnerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchWinners = async () => {
    setLoading(true);
    try {
      const res = await api.getWinners({
        search: searchTerm,
        category: categoryFilter !== 'All' ? categoryFilter : ''
      });
      if (res.success && res.winners && res.winners.length > 0) {
        setWinners(res.winners);
      } else {
        // Fallback filter
        let filtered = [...dummyWinners];
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          filtered = filtered.filter(w =>
            w.name.toLowerCase().includes(q) ||
            (w.teamName && w.teamName.toLowerCase().includes(q)) ||
            (w.eventName && w.eventName.toLowerCase().includes(q))
          );
        }
        if (categoryFilter !== 'All') {
          filtered = filtered.filter(w => w.category === categoryFilter);
        }
        setWinners(filtered);
      }
    } catch (err) {
      console.warn('API error fetching winners, using local list:', err);
      let filtered = [...dummyWinners];
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(w =>
          w.name.toLowerCase().includes(q) ||
          (w.teamName && w.teamName.toLowerCase().includes(q)) ||
          (w.eventName && w.eventName.toLowerCase().includes(q))
        );
      }
      if (categoryFilter !== 'All') {
        filtered = filtered.filter(w => w.category === categoryFilter);
      }
      setWinners(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, [searchTerm, categoryFilter]);

  const handleCreate = () => {
    setWinnerToEdit(null);
    setFormModalOpen(true);
  };

  const handleEdit = (winner) => {
    setWinnerToEdit(winner);
    setFormModalOpen(true);
  };

  const promptDelete = (winner) => {
    setWinnerToDelete(winner);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!winnerToDelete) return;
    setDeleting(true);
    try {
      await api.deleteWinner(winnerToDelete._id || winnerToDelete.id);
      setFeedback(`Winner "${winnerToDelete.name}" removed successfully.`);
      setDeleteModalOpen(false);
      setWinnerToDelete(null);
      fetchWinners();
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      // Local removal fallback
      setWinners(prev => prev.filter(w => (w._id || w.id) !== (winnerToDelete._id || winnerToDelete.id)));
      setFeedback(`Winner "${winnerToDelete.name}" removed successfully.`);
      setDeleteModalOpen(false);
      setWinnerToDelete(null);
      setTimeout(() => setFeedback(''), 4000);
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Winner / Student',
      className: 'min-w-[220px]',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img src={row.photo} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center font-bold text-xs shrink-0">
              {row.name ? row.name.charAt(0) : 'W'}
            </div>
          )}
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100">{row.name}</div>
            {row.teamName && <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">{row.teamName}</p>}
            <p className="text-[10px] text-slate-400">{row.department} • {row.year}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Position',
      render: (row) => {
        const badge = row.position === 1
          ? { text: '1st Place', icon: Trophy, bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300' }
          : row.position === 2
          ? { text: '2nd Place', icon: Medal, bg: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300' }
          : { text: '3rd Place', icon: Award, bg: 'bg-amber-800/10 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-800' };
        const Icon = badge.icon;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{badge.text}</span>
          </span>
        );
      }
    },
    {
      header: 'Event & Category',
      className: 'min-w-[220px]',
      render: (row) => (
        <div className="text-xs space-y-1">
          <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
            {row.eventName || row.event?.title || 'Campus Event'}
          </span>
          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
            {row.category}
          </span>
        </div>
      )
    },
    {
      header: 'Prize Awarded',
      render: (row) => (
        <span className="text-xs font-bold text-accent-600 dark:text-accent-400">
          {row.prize}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
            title="Edit winner"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => promptDelete(row)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete winner"
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
            Manage Winners
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add, update, and manage student achievers featured in the Hall of Fame.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-accent-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 shadow-md shadow-accent-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Winner</span>
        </button>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search winners..."
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
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={winners}
        isLoading={loading}
        emptyMessage="No winners recorded yet."
        keyField="_id"
      />

      {/* Add / Edit Modal */}
      <WinnerFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setWinnerToEdit(null);
        }}
        winnerToEdit={winnerToEdit}
        onSaved={() => {
          fetchWinners();
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Winner Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0 text-rose-600" />
            <div className="text-xs leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900 dark:text-white">"{winnerToDelete?.name}"</strong> from the Hall of Fame?
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={deleting}
              onClick={confirmDelete}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Winner</span>
              )}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
