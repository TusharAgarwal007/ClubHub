import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, MessageSquare, Send, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-brand-700 to-accent-600 dark:from-brand-400 dark:to-accent-400 bg-clip-text text-transparent">
                ClubHub
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The premier platform for university student clubs, collegiate competitions, cultural festivals, sports arenas, and skill workshops. Discover opportunities, compete, and level up your college journey.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-400 transition-colors" title="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-400 transition-colors" title="Discord Community">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-400 transition-colors" title="Telegram Channel">
                <Send className="w-4 h-4" />
              </a>
              <a href="mailto:events@clubhub.edu" className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950 dark:hover:text-brand-400 transition-colors" title="Contact Email">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/winners" className="text-slate-600 hover:text-amber-500 dark:text-slate-400 dark:hover:text-amber-400 font-bold transition-colors">
                  Hall of Fame (Winners) 🏆
                </Link>
              </li>
              <li>
                <Link to="/events?category=Competition" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Competitions
                </Link>
              </li>
              <li>
                <Link to="/events?category=Workshop" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Hands-on Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/events?category=Workshop" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Workshops
                </Link>
              </li>
              <li>
                <Link to="/events?category=Competition" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Competitions
                </Link>
              </li>
              <li>
                <Link to="/events?category=Seminar" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Seminars
                </Link>
              </li>
              <li>
                <Link to="/events?category=Cultural" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Cultural
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Admin */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-4">
              Club Administration
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/admin/login" className="text-brand-600 font-semibold dark:text-brand-400 hover:underline">
                  Admin Portal Login
                </Link>
              </li>
              <li className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs pt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                events@clubhub.edu
              </li>
              <li className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Student Activity Center
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} ClubHub Platform. Designed in the spirit of Unstop.</p>
          <p className="flex items-center gap-1">
            Empowering student campus life with passion & code <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
