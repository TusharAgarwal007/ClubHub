import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Sparkles } from 'lucide-react';
import WinnerCard from '../common/WinnerCard';
import { api } from '../../api/client';
import { dummyWinners } from '../../data/dummyWinners';

export default function WinnersSection() {
  const [winners, setWinners] = useState(dummyWinners.slice(0, 6));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWinners() {
      try {
        const res = await api.getWinners({ limit: 6 });
        if (res.success && res.winners && res.winners.length > 0) {
          setWinners(res.winners);
        } else {
          setWinners(dummyWinners.slice(0, 6));
        }
      } catch (err) {
        console.warn('API error fetching winners, using fallback dummy winners:', err);
        setWinners(dummyWinners.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }
    loadWinners();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Trophy className="w-4 h-4 fill-amber-500 text-amber-500" />
            Hall of Fame
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Our Winners
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Celebrating the achievers of our college events
          </p>
        </div>

        <Link
          to="/winners"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-accent-500 to-brand-600 hover:from-amber-600 hover:to-brand-700 shadow-md shadow-accent-500/20 hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <span>View All Winners</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Winners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners.map(winner => (
          <WinnerCard key={winner._id || winner.id} winner={winner} />
        ))}
      </div>
    </section>
  );
}
