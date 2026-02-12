
import React from 'react';

const Navbar = ({ user, currentView, onNavigate, onLogout }) => {
  return (
    <nav className="w-80 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] h-screen sticky top-0 flex flex-col p-10 z-50 shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-4 cursor-pointer mb-20 group" onClick={() => onNavigate('search')}>
        <div className="w-10 h-10 brand-gradient rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </div>
        <span className="text-2xl font-extrabold text-[var(--text-main)] tracking-tighter">AffordHome</span>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">Navigation</p>
        <button onClick={() => onNavigate('search')} className={`px-5 py-4 rounded-2xl font-bold text-left transition-all flex items-center gap-4 ${currentView === 'search' || currentView === 'details' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Explore
        </button>
        <button onClick={() => onNavigate('dashboard')} className={`px-5 py-4 rounded-2xl font-bold text-left transition-all flex items-center gap-4 ${currentView === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Visits
        </button>
        <button onClick={() => onNavigate('history')} className={`px-5 py-4 rounded-2xl font-bold text-left transition-all flex items-center gap-4 ${currentView === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          History
        </button>
      </div>

      <div className="pt-10 border-t border-[var(--border-color)]">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent">
          <div className="w-12 h-12 rounded-full brand-gradient flex items-center justify-center text-lg font-bold text-white">
             {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold text-[var(--text-main)] truncate">{user.name}</span>
            <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase">Verified</span>
          </div>
        </div>
        <button onClick={onLogout} className="w-full mt-6 py-4 px-4 rounded-xl text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-3 uppercase tracking-widest">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
