
import React, { useState, useEffect } from 'react';
import { SearchCriteria } from '../types';

interface SearchFiltersProps {
  onSearch: (criteria: SearchCriteria) => void;
  initialCriteria: SearchCriteria;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, initialCriteria }) => {
  const [houseType, setHouseType] = useState(initialCriteria.houseType || '');
  const [stateName, setStateName] = useState(initialCriteria.state || '');
  const [district, setDistrict] = useState(initialCriteria.district || '');
  const [income, setIncome] = useState(initialCriteria.income > 0 ? initialCriteria.income.toString() : '');

  useEffect(() => {
    if (initialCriteria.houseType) setHouseType(initialCriteria.houseType);
    if (initialCriteria.state) setStateName(initialCriteria.state);
    if (initialCriteria.district) setDistrict(initialCriteria.district);
    if (initialCriteria.income > 0) setIncome(initialCriteria.income.toString());
  }, [initialCriteria]);

  const triggerSearch = () => {
    const incomeValue = parseInt(income) || 0;
    onSearch({
      houseType: houseType || 'Any',
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
    <div className="w-full bg-white rounded-[32px] p-8 md:p-14 border border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="mb-14">
        <h2 className="text-[44px] font-extrabold text-[#1E1B4B] leading-tight tracking-tighter">Your Next Chapter Begins Here.</h2>
        <p className="text-lg text-gray-400 font-medium mt-3">Refine your search to find spaces that speak to you.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Type of Living</label>
            <div className="relative">
              <select
                value={houseType}
                onChange={e => setHouseType(e.target.value)}
                className="w-full bg-[#F8FAFC] border-transparent rounded-2xl px-6 py-5 text-base font-bold text-[#1E1B4B] appearance-none outline-none ring-2 ring-transparent focus:ring-indigo-500/10 focus:bg-white transition-all cursor-pointer border border-gray-100"
              >
                <option value="" disabled hidden>Choose Type</option>
                <option value="Any">All Options</option>
                <option value="Pg">PG / Shared Living</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Estate / Villa</option>
                <option value="Individual House">Standalone House</option>
                <option value="Studio">Studio Space</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Preferred State</label>
            <input
              type="text"
              value={stateName}
              onChange={e => setStateName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-2xl px-6 py-5 text-base font-bold text-[#1E1B4B] outline-none ring-2 ring-transparent focus:ring-indigo-500/10 focus:bg-white transition-all placeholder:text-gray-300"
              placeholder="e.g. Kerala"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Location / Area</label>
            <input
              type="text"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-2xl px-6 py-5 text-base font-bold text-[#1E1B4B] outline-none ring-2 ring-transparent focus:ring-indigo-500/10 focus:bg-white transition-all placeholder:text-gray-300"
              placeholder="e.g. Kochi"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Budget Confidence</label>
            <input
              type="text"
              value={income}
              onChange={e => setIncome(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-[#F8FAFC] border border-gray-100 rounded-2xl px-6 py-5 text-base font-bold text-[#1E1B4B] outline-none ring-2 ring-transparent focus:ring-indigo-500/10 focus:bg-white transition-all placeholder:text-gray-300"
              placeholder="Income ₹/mo"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            className="brand-gradient text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Show Available Spaces
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
