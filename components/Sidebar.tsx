
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
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen shrink-0">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#00D1FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-100">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <span className="text-xl font-black text-gray-900 tracking-tight">INVESTMENT</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Overview</p>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeView === item.id ? 'bg-[#F0FDFF] text-[#00D1FF] font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <svg className={`w-5 h-5 ${activeView === item.id ? 'text-[#00D1FF]' : 'text-gray-400 group-hover:text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Account</p>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 mb-1">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <span className="text-sm">Inbox</span>
          <span className="ml-auto bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">4</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50" onClick={onLogout}>
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="text-sm">Logout</span>
        </button>

        <div className="mt-8 p-4 bg-gray-50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=E0F2FE&color=0369A1`} alt={user.name} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
