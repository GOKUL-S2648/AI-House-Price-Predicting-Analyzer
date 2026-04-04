
import React, { useState, useEffect } from 'react';
import { SearchCriteria } from '../types';

interface SearchFiltersProps {
  onSearch: (criteria: SearchCriteria) => void;
  initialCriteria: SearchCriteria;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, initialCriteria }) => {
  const [houseType, setHouseType] = useState(initialCriteria.houseType || '');
  const [bhkType, setBhkType] = useState(initialCriteria.bhkType || '');
  const [stateName, setStateName] = useState(initialCriteria.state || '');
  const [district, setDistrict] = useState(initialCriteria.district || '');
  const [income, setIncome] = useState(initialCriteria.income > 0 ? initialCriteria.income.toString() : '');

  useEffect(() => {
    if (initialCriteria.houseType) setHouseType(initialCriteria.houseType);
    if (initialCriteria.bhkType) setBhkType(initialCriteria.bhkType);
    if (initialCriteria.state) setStateName(initialCriteria.state);
    if (initialCriteria.district) setDistrict(initialCriteria.district);
    if (initialCriteria.income > 0) setIncome(initialCriteria.income.toString());
  }, [initialCriteria]);

  const triggerSearch = () => {
    const incomeValue = parseInt(income) || 0;
    onSearch({
      houseType: houseType || 'Any',
      bhkType: bhkType || 'Any',
      state: stateName.trim(),
      district: district.trim(),
      income: incomeValue,
      maxPrice: incomeValue > 0 ? incomeValue * 0.55 : 1000000
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch();
  };

  return (
    <div className="w-full relative overflow-hidden rounded-[40px] border border-black/5 shadow-2xl animate-in fade-in slide-in-from-top-8 duration-1000">
      {/* Cinematic Perspective Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Cinematic Interior" 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-white/30"></div>
      </div>

      <div className="relative z-10 p-8 md:p-14 lg:p-20">
        <div className="max-w-3xl mb-12 md:mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] leading-[1.1] tracking-tighter uppercase">
            Your Next Chapter <br /><span className="text-[#00AEEF]">Begins Here.</span>
          </h2>
          <p className="text-[#00AEEF] font-black text-xs md:text-sm mt-6 uppercase tracking-[0.4em]">Refine your search to find spaces that speak to you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 md:space-y-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Type of Living</label>
              <div className="relative group">
                <select
                  value={houseType}
                  onChange={e => setHouseType(e.target.value)}
                  className="w-full bg-white/40 backdrop-blur-md border border-black/5 rounded-2xl px-6 py-5 text-sm font-black text-[#0F172A] appearance-none outline-none ring-2 ring-transparent focus:ring-[#00AEEF]/10 focus:border-[#00AEEF]/30 focus:bg-white/60 transition-all cursor-pointer uppercase tracking-widest"
                >
                  <option value="" disabled hidden className="bg-white">Choose Type</option>
                  <option value="Any" className="bg-white">All Options</option>
                  <option value="Pg" className="bg-white">PG / Shared Living</option>
                  <option value="Apartment" className="bg-white">Apartment</option>
                  <option value="Villa" className="bg-white">Estate / Villa</option>
                  <option value="Individual House" className="bg-white">Standalone House</option>
                  <option value="Studio" className="bg-white">Studio Space</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-[#00AEEF] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-[0.3em] ml-1">BHK Type</label>
              <div className="relative group">
                <select
                  value={bhkType}
                  onChange={e => setBhkType(e.target.value)}
                  className="w-full bg-white/40 backdrop-blur-md border border-black/5 rounded-2xl px-6 py-5 text-sm font-black text-[#0F172A] appearance-none outline-none ring-2 ring-transparent focus:ring-[#00AEEF]/10 focus:border-[#00AEEF]/30 focus:bg-white/60 transition-all cursor-pointer uppercase tracking-widest"
                >
                  <option value="" disabled hidden className="bg-white">Choose BHK</option>
                  <option value="Any" className="bg-white">All BHK</option>
                  <option value="1BHK" className="bg-white">1 BHK</option>
                  <option value="2BHK" className="bg-white">2 BHK</option>
                  <option value="3BHK" className="bg-white">3 BHK</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-[#00AEEF] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>


            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Preferred State</label>
              <input
                type="text"
                value={stateName}
                onChange={e => setStateName(e.target.value)}
                className="w-full bg-white/40 backdrop-blur-md border border-black/5 rounded-2xl px-6 py-5 text-sm font-black text-[#0F172A] outline-none ring-2 ring-transparent focus:ring-[#00AEEF]/10 focus:border-[#00AEEF]/30 focus:bg-white/60 transition-all placeholder:text-gray-300 uppercase tracking-widest"
                placeholder="e.g. Kerala"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Location / Area</label>
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full bg-white/40 backdrop-blur-md border border-black/5 rounded-2xl px-6 py-5 text-sm font-black text-[#0F172A] outline-none ring-2 ring-transparent focus:ring-[#00AEEF]/10 focus:border-[#00AEEF]/30 focus:bg-white/60 transition-all placeholder:text-gray-300 uppercase tracking-widest"
                placeholder="e.g. Kochi"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Budget Confidence</label>
              <input
                type="text"
                value={income}
                onChange={e => setIncome(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-white/40 backdrop-blur-md border border-black/5 rounded-2xl px-6 py-5 text-sm font-black text-[#0F172A] outline-none ring-2 ring-transparent focus:ring-[#00AEEF]/10 focus:border-[#00AEEF]/30 focus:bg-white/60 transition-all placeholder:text-gray-300 uppercase tracking-widest"
                placeholder="Income ₹/mo"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="group relative overflow-hidden px-14 py-6 bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(0,174,239,0.1)] hover:shadow-[0_20px_50px_rgba(0,174,239,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="relative z-10">Launch Available Spaces</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchFilters;   