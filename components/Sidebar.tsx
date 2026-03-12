
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: any) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, user, onLogout }) => {
  const navItems = [
    { id: 'search', label: 'Marketplace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'dashboard', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'properties', label: 'My Properties', icon: 'M8 14v20c0 4.418 7.163 8 16 8 1.387 0 2.717-.087 3.966-.253M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14c0 4.418-7.163 8-16 8-1.387 0-2.717-.087-3.966-.253m0-14c0 4.418 7.163 8 16 8s16-3.582 16-8V14' },
    { id: 'auctions', label: 'Auctions', icon: 'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z' },
    { id: 'wallet', label: 'Wallet', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'favorites', label: 'Favorites', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
  ];

  return (
    <aside className="w-64 bg-[#F8FAFC] border-r border-black/5 flex flex-col sticky top-0 h-screen shrink-0">
      <div className="p-8 flex flex-col gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#0F172A] tracking-[0.2em]">PR</span>
            <div className="relative">
              <span className="text-2xl font-black text-[#0F172A] tracking-[0.2em] opacity-0">O</span>
              <svg className="absolute inset-0 w-full h-full text-[#00AEEF]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <span className="text-2xl font-black text-[#0F172A] tracking-[0.2em]">PERLY</span>
          </div>
          <p className="text-[#00AEEF] font-black tracking-[0.4em] text-[8px] uppercase">modern. intelligent.</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Core Directory</p>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${activeView === item.id ? 'bg-[#00AEEF]/5 text-[#0F172A] font-black border border-[#00AEEF]/10' : 'text-gray-500 hover:bg-black/[0.02] hover:text-[#0F172A]'}`}
          >
            <svg className={`w-5 h-5 ${activeView === item.id ? 'text-[#00AEEF]' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
            </svg>
            <span className="text-xs uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Operations</p>
        <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-black/[0.02] hover:text-[#0F172A] mb-2 transition-all border border-transparent hover:border-black/5" onClick={() => onNavigate('list')}>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          <span className="text-xs uppercase tracking-widest">List Property</span>
        </button>
        
        <div className="mt-8 p-5 bg-white rounded-[32px] flex items-center gap-4 border border-black/5 shadow-sm">
          <div className="w-11 h-11 rounded-full border-2 border-[#00AEEF]/20 flex items-center justify-center font-bold text-[#00AEEF] overflow-hidden p-[2px]">
            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=F8FAFC&color=00AEEF&bold=true`} alt={user.name} className="w-full h-full rounded-full" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-[#0F172A] truncate uppercase tracking-tight">{user.name}</p>
            <p className="text-[9px] text-[#00AEEF] font-black truncate tracking-[0.2em]">{user.role?.toUpperCase() || 'USER'}</p>
          </div>
        </div>

        <button className="w-full flex items-center gap-3 px-4 py-4 mt-4 rounded-2xl text-gray-400 hover:text-rose-500 transition-all font-black uppercase tracking-[0.3em] text-[9px] hover:bg-rose-500/5 group" onClick={onLogout}>
          <svg className="w-4 h-4 text-gray-300 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span>Terminal Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
