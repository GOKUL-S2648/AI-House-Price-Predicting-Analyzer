
import React from 'react';
import { SearchCriteria } from '../types';

interface MarketplaceHeaderProps {
  onFilterChange: (criteria: SearchCriteria) => void;
  criteria: SearchCriteria;
  count: number;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ onFilterChange, criteria, count }) => {
  return (
    <div className="space-y-12 pb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="flex items-end justify-between px-2">
        <div>
          <h1 className="text-5xl font-black text-[#0F172A] tracking-tight uppercase">Intelligence Marketplace</h1>
          <p className="text-[#00AEEF] font-black text-[10px] uppercase tracking-[0.4em] mt-4 border-l-2 border-[#00AEEF] pl-4">Verified holdings with neural performance metrics.</p>
        </div>
        <div className="flex items-center gap-4 p-2 bg-[#F8FAFC] backdrop-blur-xl rounded-[24px] border border-black/5 shadow-xl">
          <button className="p-3 bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white rounded-xl shadow-lg shadow-[#00AEEF]/20"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" /></svg></button>
          <button className="p-3 text-gray-400 hover:text-[#0F172A] transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-10 py-10 border-y border-black/5">
        <div className="flex-1 flex gap-10 overflow-x-auto pb-4 scrollbar-hide">
          <div className="min-w-[200px] space-y-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Asset Class</label>
            <div className="relative group">
                <select 
                value={criteria.houseType}
                onChange={(e) => onFilterChange({...criteria, houseType: e.target.value})}
                className="w-full bg-white border border-black/5 rounded-2xl px-6 py-3.5 text-xs font-black text-[#0F172A] focus:ring-2 focus:ring-[#00AEEF]/10 focus:border-[#00AEEF]/20 outline-none transition-all appearance-none cursor-pointer uppercase tracking-widest shadow-sm"
                >
                <option value="Any" className="bg-white">Protocol Defaults</option>
                <option value="Pg" className="bg-white">Co-Living/Hostel</option>
                <option value="Apartment" className="bg-white">Standard Units</option>
                <option value="Individual House" className="bg-white">Single Holdings</option>
                <option value="Villa" className="bg-white">Elite Manifests</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#00AEEF]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
          </div>
          <div className="min-w-[200px] space-y-3">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Cap Threshold</label>
            <div className="relative group">
                <select 
                value={criteria.maxPrice}
                onChange={(e) => onFilterChange({...criteria, maxPrice: parseInt(e.target.value)})}
                className="w-full bg-white border border-black/5 rounded-2xl px-6 py-3.5 text-xs font-black text-[#0F172A] focus:ring-2 focus:ring-[#00AEEF]/10 focus:border-[#00AEEF]/20 outline-none transition-all appearance-none cursor-pointer uppercase tracking-widest shadow-sm"
                >
                <option value="1000000" className="bg-white">Unlimited</option>
                <option value="10000" className="bg-white">Under ₹10k Units</option>
                <option value="20000" className="bg-white">Under ₹20k Units</option>
                <option value="50000" className="bg-white">Under ₹50k Units</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#00AEEF]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
          </div>
          <button 
            className="mt-auto mb-2 text-[10px] font-black text-gray-400 hover:text-[#00AEEF] transition-all uppercase tracking-[0.3em] bg-[#F8FAFC] px-6 py-2 rounded-xl border border-black/5"
            onClick={() => onFilterChange({...criteria, houseType: 'Any', maxPrice: 1000000})}
          >
            Clear Matrix
          </button>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-[#F8FAFC] rounded-2xl border border-black/5 shadow-md">
          {['All', 'Active', 'Upcoming'].map(tab => (
            <button key={tab} className={`px-8 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${tab === 'All' ? 'bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white shadow-lg shadow-[#00AEEF]/10' : 'text-gray-400 hover:text-[#0F172A] hover:bg-black/[0.02]'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
