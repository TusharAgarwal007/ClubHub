import React from 'react';
import { Trophy, Medal, Award, Sparkles, Gift } from 'lucide-react';

export default function PodiumHighlight({ winners = [] }) {
  if (!winners || winners.length < 3) return null;

  const first = winners.find(w => w.position === 1) || winners[0];
  const second = winners.find(w => w.position === 2) || winners[1];
  const third = winners.find(w => w.position === 3) || winners[2];

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'W';
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-950 p-6 sm:p-10 border border-indigo-900/50 shadow-2xl overflow-hidden text-white">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 relative z-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Hall of Fame Podium</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Championship Spotlight
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          Recognizing the standout performers of {first.eventName || 'recent campus competitions'}
        </p>
      </div>

      {/* 3-Column Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto relative z-10">
        
        {/* 2nd Place (Left) */}
        <div className="order-2 md:order-1 flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-slate-700/60 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
          <div className="relative mb-3">
            {second.photo ? (
              <img
                src={second.photo}
                alt={second.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-300 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center font-black text-white text-lg">
                {getInitials(second.name)}
              </div>
            )}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-300 text-slate-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
              <Medal className="w-3 h-3" />
              2nd
            </span>
          </div>

          <h4 className="text-base font-bold text-white mt-1">{second.name}</h4>
          {second.teamName && <p className="text-xs text-indigo-300 font-semibold">{second.teamName}</p>}
          <p className="text-[11px] text-slate-400 mt-0.5">{second.department} • {second.year}</p>
          
          <div className="mt-4 pt-3 border-t border-white/10 w-full">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Award</span>
            <span className="text-xs font-bold text-slate-200">{second.prize}</span>
          </div>
        </div>

        {/* 1st Place (Center - Highlighted) */}
        <div className="order-1 md:order-2 flex flex-col items-center text-center p-8 rounded-3xl bg-gradient-to-b from-amber-500/20 via-white/10 to-white/5 border-2 border-amber-400/80 backdrop-blur-md shadow-2xl shadow-amber-500/10 scale-105 hover:scale-[1.07] transition-all duration-300 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
            <span>👑 CHAMPION</span>
          </div>

          <div className="relative mb-3 mt-2">
            {first.photo ? (
              <img
                src={first.photo}
                alt={first.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-amber-400 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl">
                {getInitials(first.name)}
              </div>
            )}
            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Trophy className="w-3.5 h-3.5 fill-slate-950" />
              1st
            </span>
          </div>

          <h4 className="text-lg font-black text-white mt-1">{first.name}</h4>
          {first.teamName && <p className="text-xs text-amber-300 font-bold">{first.teamName}</p>}
          <p className="text-xs text-slate-300 mt-0.5">{first.department} • {first.year}</p>

          <div className="mt-4 pt-3 border-t border-amber-400/30 w-full">
            <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block">Grand Prize</span>
            <span className="text-sm font-black text-amber-300 flex items-center justify-center gap-1 mt-0.5">
              <Gift className="w-4 h-4" />
              {first.prize}
            </span>
          </div>
        </div>

        {/* 3rd Place (Right) */}
        <div className="order-3 flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-slate-700/60 backdrop-blur-md hover:bg-white/10 transition-all duration-300">
          <div className="relative mb-3">
            {third.photo ? (
              <img
                src={third.photo}
                alt={third.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-700 shadow-lg"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-amber-900 text-white flex items-center justify-center font-black text-lg">
                {getInitials(third.name)}
              </div>
            )}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
              <Award className="w-3 h-3" />
              3rd
            </span>
          </div>

          <h4 className="text-base font-bold text-white mt-1">{third.name}</h4>
          {third.teamName && <p className="text-xs text-amber-400 font-semibold">{third.teamName}</p>}
          <p className="text-[11px] text-slate-400 mt-0.5">{third.department} • {third.year}</p>

          <div className="mt-4 pt-3 border-t border-white/10 w-full">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Award</span>
            <span className="text-xs font-bold text-slate-200">{third.prize}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
