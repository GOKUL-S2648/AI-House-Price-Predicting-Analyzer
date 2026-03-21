
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  currentView: string;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, currentView, onNavigate, onLogout, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden transition-opacity animate-in fade-in"
          onClick={onClose}
        />
      )}

      <nav className={`fixed md:sticky top-0 left-0 h-screen w-80 bg-[#E2E8F0] border-r border-black/5 flex flex-col p-10 z-[70] shrink-0 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-6 right-6 p-2 rounded-xl bg-black/5 text-gray-400"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex flex-col gap-4 cursor-pointer mb-20 group" onClick={() => { onNavigate('search'); onClose(); }}>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black text-[#0F172A] tracking-[0.2em]">PR</span>
              <div className="relative">
                <span className="text-3xl font-black text-[#0F172A] tracking-[0.2em] opacity-0">O</span>
                <svg className="absolute inset-0 w-full h-full text-[#00AEEF]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
              <span className="text-3xl font-black text-[#0F172A] tracking-[0.2em]">PERLY</span>
            </div>
            <p className="text-[#00AEEF] text-[10px] font-black uppercase tracking-[0.5em]">modern. intelligent.</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 ml-2">Main Navigation</p>
          <button onClick={() => { onNavigate('search'); onClose(); }} className={`px-5 py-5 rounded-2xl font-black text-left transition-all flex items-center gap-4 uppercase tracking-[0.1em] text-xs ${currentView === 'search' || currentView === 'details' ? 'bg-[#00AEEF]/5 text-[#0F172A] border border-[#00AEEF]/10 shadow-xl shadow-black/5' : 'text-gray-400 hover:bg-black/[0.02] hover:text-[#0F172A]'}`}>
            <svg className={`w-5 h-5 ${currentView === 'search' || currentView === 'details' ? 'text-[#00AEEF]' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Explore
          </button>
          {user.role !== 'admin' && (
            <>
              <button onClick={() => { onNavigate('dashboard'); onClose(); }} className={`px-5 py-5 rounded-2xl font-black text-left transition-all flex items-center gap-4 uppercase tracking-[0.1em] text-xs ${currentView === 'dashboard' ? 'bg-[#00AEEF]/5 text-[#0F172A] border border-[#00AEEF]/10 shadow-xl shadow-black/5' : 'text-gray-400 hover:bg-black/[0.02] hover:text-[#0F172A]'}`}>
                <svg className={`w-5 h-5 ${currentView === 'dashboard' ? 'text-[#00AEEF]' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Visits
              </button>
              <button onClick={() => { onNavigate('history'); onClose(); }} className={`px-5 py-5 rounded-2xl font-black text-left transition-all flex items-center gap-4 uppercase tracking-[0.1em] text-xs ${currentView === 'history' ? 'bg-[#00AEEF]/5 text-[#0F172A] border border-[#00AEEF]/10 shadow-xl shadow-black/5' : 'text-gray-400 hover:bg-black/[0.02] hover:text-[#0F172A]'}`}>
                <svg className={`w-5 h-5 ${currentView === 'history' ? 'text-[#00AEEF]' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                History
              </button>
            </>
          )}

          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-10 mb-4 ml-2">Services</p>
          {user.role !== 'admin' && (
            <button onClick={() => { onNavigate('list'); onClose(); }} className={`px-5 py-5 rounded-2xl font-black text-left transition-all flex items-center gap-4 uppercase tracking-[0.1em] text-xs ${currentView === 'list' ? 'bg-[#00AEEF]/5 text-[#0F172A] border border-[#00AEEF]/10 shadow-xl shadow-black/5' : 'text-gray-400 hover:bg-black/[0.02] hover:text-[#0F172A]'}`}>
              <svg className={`w-5 h-5 ${currentView === 'list' ? 'text-[#00AEEF]' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              List Property
            </button>
          )}

          {user.role === 'admin' && (
            <button onClick={() => { onNavigate('admin'); onClose(); }} className={`px-5 py-5 rounded-2xl font-black text-left transition-all flex items-center gap-4 uppercase tracking-[0.1em] text-xs ${currentView === 'admin' ? 'bg-[#00AEEF]/5 text-[#0F172A] border border-[#00AEEF]/10 shadow-xl shadow-black/5' : 'text-gray-400 hover:bg-black/[0.02] hover:text-[#0F172A]'}`}>
              <svg className={`w-5 h-5 ${currentView === 'admin' ? 'text-[#00AEEF]' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              Admin Panel
            </button>
          )}
        </div>

        <div className="pt-10 border-t border-black/5">
          <div className="flex items-center gap-5 p-5 bg-[#F1F5F9] rounded-3xl border border-black/5 shadow-md">
            <div className="w-12 h-12 rounded-full border-2 border-[#00AEEF]/20 flex items-center justify-center text-lg font-black text-[#00AEEF] p-[2px]">
              <img src={`https://ui-avatars.com/api/?name=${user.name}&background=F8FAFC&color=00AEEF&bold=true`} alt={user.name} className="w-full h-full rounded-full" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-black text-[#0F172A] truncate uppercase tracking-tight">{user.name}</span>
              <span className="text-[9px] text-[#00AEEF] font-bold uppercase tracking-[0.2em]">{user.role || 'User'}</span>
            </div>
          </div>
          <button onClick={onLogout} className="w-full mt-6 py-4 px-4 rounded-2xl text-[10px] font-black text-gray-400 hover:text-rose-500 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.3em] hover:bg-rose-500/5 group">
            <svg className="w-4 h-4 text-gray-300 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Terminal Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
