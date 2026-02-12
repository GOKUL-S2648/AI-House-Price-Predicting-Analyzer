
import React from 'react';
import { SearchCriteria } from '../types';

interface MarketplaceHeaderProps {
  onFilterChange: (criteria: SearchCriteria) => void;
  criteria: SearchCriteria;
  count: number;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({ onFilterChange, criteria, count }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Marketplace</h1>
          <p className="text-gray-400 text-sm mt-1">Discover verified affordable homes with secure AI insights.</p>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl">
          <button className="p-2 bg-white rounded-xl shadow-sm"><svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg></button>
          <button className="p-2 text-gray-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg></button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 py-6 border-y border-gray-100">
        <div className="flex-1 flex gap-4 overflow-x-auto pb-2 sm:pb-0">
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Property Type</label>
            <select 
              value={criteria.houseType}
              onChange={(e) => onFilterChange({...criteria, houseType: e.target.value})}
              className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              <option value="Any">All Types</option>
              <option value="Pg">PG / Hostel</option>
              <option value="Apartment">Apartment</option>
              <option value="Individual House">House</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
          <div className="min-w-[140px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Max Price</label>
            <select 
              value={criteria.maxPrice}
              onChange={(e) => onFilterChange({...criteria, maxPrice: parseInt(e.target.value)})}
              className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            >
              <option value="1000000">Any Price</option>
              <option value="10000">Below ₹10k</option>
              <option value="20000">Below ₹20k</option>
              <option value="50000">Below ₹50k</option>
            </select>
          </div>
          <button 
            className="mt-auto mb-1 text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors uppercase tracking-widest"
            onClick={() => onFilterChange({...criteria, houseType: 'Any', maxPrice: 1000000})}
          >
            Clear Filters
          </button>
        </div>

        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
          {['All', 'Active', 'Upcoming'].map(tab => (
            <button key={tab} className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${tab === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;
