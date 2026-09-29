import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import StatCard from '../components/admin/StatCard';
import EventFormModal from '../components/admin/EventFormModal';
import { 
  Calendar, 
  CalendarDays, 
  Users, 
  UserCheck, 
  Plus, 
  ArrowRight, 
  Ticket, 
  Sparkles,
  Layers,
  Clock,
  Loader2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart, 
  Pie, 
  Legend 
} from 'recharts';

const PIE_COLORS = ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.getAdminStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading admin analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time campus event metrics, registrations, and analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 shadow-md shadow-brand-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* 1. Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={CalendarDays}
          color="purple"
        />
        <StatCard
          title="Total Registrations"
          value={stats?.totalRegistrations || 0}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Total Winners"
          value={stats?.totalWinners || 14}
          icon={Trophy}
          color="amber"
        />
        <StatCard
          title="Registrations Today"
          value={stats?.registrationsToday || 0}
          change="+ Today"
          icon={UserCheck}
          color="rose"
        />
      </div>

      {/* 2. Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bar Chart: Registrations per event */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Registrations by Event
              </h3>
              <p className="text-xs text-slate-400">Total student signups across events</p>
            </div>
            <Link
              to="/admin/events"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.registrationsByEvent || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <XAxis
                  dataKey="title"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  angle={-15}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl space-y-1">
                          <p className="font-bold">{data.fullTitle || data.title}</p>
                          <p className="text-accent-400">Category: {data.category}</p>
                          <p className="text-emerald-400">Registrations: {data.count}</p>
                          {data.maxSeats > 0 && <p className="text-slate-400">Capacity: {data.maxSeats}</p>}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#4F46E5">
                  {(stats?.registrationsByEvent || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? '#4F46E5' : '#6366F1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Registrations by Year of Study */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Students by Year
            </h3>
            <p className="text-xs text-slate-400">Demographic distribution</p>
          </div>

          <div className="h-60 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.registrationsByYear || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(stats?.registrationsByYear || []).map((entry, index) => (
                    <Cell key={`slice-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} Students`, name]}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 text-center">
            <span className="text-xs text-slate-400">
              Participation across all collegiate batches
            </span>
          </div>
        </div>

      </div>

      {/* 3. Recent Registrations Stream Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Registrations
            </h3>
            <p className="text-xs text-slate-400">Latest student signups</p>
          </div>

          <Link
            to="/admin/registrations"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View All Registrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {(stats?.recentRegistrations || []).map((reg) => (
            <div key={reg._id || reg.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center font-black text-xs">
                  {reg.fullName?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {reg.fullName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {reg.email} • {reg.collegeName} ({reg.yearOfStudy})
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                  {reg.event?.title || 'Campus Event'}
                </span>
                <span className="block font-mono text-[10px] text-slate-400">
                  Ticket: {reg.ticketId}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Event Modal */}
      <EventFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSaved={() => {
          fetchStats();
        }}
      />

    </div>
  );
}
