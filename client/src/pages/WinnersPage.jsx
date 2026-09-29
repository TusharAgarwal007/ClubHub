import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import WinnerCard from '../components/common/WinnerCard';
import PodiumHighlight from '../components/winners/PodiumHighlight';
import SearchBar from '../components/common/SearchBar';
import { dummyWinners } from '../data/dummyWinners';
import { CATEGORIES, DEPARTMENTS } from '../constants';
import { Trophy, Award, RotateCcw, Filter, Users, Sparkles } from 'lucide-react';

const years = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

export default function WinnersPage() {
  const [winners, setWinners] = useState(dummyWinners);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  const fetchWinners = async () => {
    setLoading(true);
    try {
      const res = await api.getWinners({
        search: searchTerm,
        category: selectedCategory !== 'All' ? selectedCategory : '',
        department: selectedDepartment !== 'All' ? selectedDepartment : '',
        year: selectedYear !== 'All' ? selectedYear : ''
      });

      if (res.success && res.winners && res.winners.length > 0) {
        setWinners(res.winners);
      } else {
        // Filter dummyWinners locally as fallback
        let filtered = [...dummyWinners];
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          filtered = filtered.filter(w =>
            w.name.toLowerCase().includes(q) ||
            (w.teamName && w.teamName.toLowerCase().includes(q)) ||
            (w.eventName && w.eventName.toLowerCase().includes(q))
          );
        }
        if (selectedCategory !== 'All') {
          filtered = filtered.filter(w => w.category === selectedCategory);
        }
        if (selectedDepartment !== 'All') {
          filtered = filtered.filter(w => w.department === selectedDepartment);
        }
        if (selectedYear !== 'All') {
          filtered = filtered.filter(w => w.year === selectedYear);
        }
        setWinners(filtered);
      }
    } catch (err) {
      console.warn('API error fetching winners, filtering local dataset:', err);
      let filtered = [...dummyWinners];
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        filtered = filtered.filter(w =>
          w.name.toLowerCase().includes(q) ||
          (w.teamName && w.teamName.toLowerCase().includes(q)) ||
          (w.eventName && w.eventName.toLowerCase().includes(q))
        );
      }
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(w => w.category === selectedCategory);
      }
      if (selectedDepartment !== 'All') {
        filtered = filtered.filter(w => w.department === selectedDepartment);
      }
      if (selectedYear !== 'All') {
        filtered = filtered.filter(w => w.year === selectedYear);
      }
      setWinners(filtered);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWinners();
  }, [searchTerm, selectedCategory, selectedDepartment, selectedYear]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedDepartment('All');
    setSelectedYear('All');
  };

  // Top 3 winners for podium highlight (e.g. from the first competition event)
  const podiumWinners = dummyWinners.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-black uppercase tracking-wider shadow-sm">
          <Trophy className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>Campus Hall of Fame</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Celebrating Our Achievers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Honoring the outstanding students and teams who excelled across technical competitions, workshops, cultural showdowns, and sports tournaments.
        </p>
      </div>

      {/* Top 3 Podium-Style Highlight */}
      <PodiumHighlight winners={podiumWinners} />

      {/* Search and Filters Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
        <SearchBar
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
          placeholder="Search winners by student name, team, or event..."
        />

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Year of Study Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Year of Study
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {years.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Winners Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : winners.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-500 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              No Winners Found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              No achievers match your search or filter criteria. Try resetting the filters.
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
          {winners.map(winner => (
            <WinnerCard key={winner._id || winner.id} winner={winner} />
          ))}
        </div>
      )}

    </div>
  );
}
