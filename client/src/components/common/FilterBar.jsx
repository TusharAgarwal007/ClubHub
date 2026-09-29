import React from 'react';
import { Filter, ArrowUpDown, Calendar, Layers, Building2 } from 'lucide-react';
import { CATEGORIES, DEPARTMENTS } from '../../constants';

const categories = ['All', ...CATEGORIES];

const statusOptions = [
  { label: 'All Dates', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'This Week', value: 'this-week' },
  { label: 'Past Events', value: 'past' }
];

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  selectedSort,
  onSelectSort,
  selectedDepartment,
  onSelectDepartment
}) {
  return (
    <div className="space-y-4">
      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1 hidden sm:inline-flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Category:
        </span>
        {categories.map((cat) => {
          const isSelected = (selectedCategory || 'All') === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Date Status, Department & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        
        {/* Date Filter Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {statusOptions.map((opt) => {
            const isSelected = (selectedStatus || 'all') === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSelectStatus(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Department Filter (if provided) */}
          {onSelectDepartment && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDepartment || 'All'}
                onChange={(e) => onSelectDepartment(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="All">All Departments</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSort || 'featured'}
              onChange={(e) => onSelectSort(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="featured">Featured & Upcoming</option>
              <option value="date-asc">Date: Soonest First</option>
              <option value="date-desc">Date: Furthest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
