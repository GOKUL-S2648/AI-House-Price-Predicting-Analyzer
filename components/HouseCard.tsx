
import React, { useState } from 'react';
import { getMatchScore } from '../mlService.ts';
import { House, User } from '../types.ts';

// Fix: Defined HouseCardProps interface for strict typing
interface HouseCardProps {
  house: House;
  onClick: () => void;
  user: User;
}

// Fix: Used React.FC<HouseCardProps> to correctly handle React props like 'key' in App.tsx
const HouseCard: React.FC<HouseCardProps> = ({ house, onClick, user }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const matchScore = user ? getMatchScore(house, user) : null;

  return (
    <div 
      className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group flex flex-col h-full"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
        {!isLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
        <img 
          src={house.image} 
          alt={house.title} 
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-white/20 flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Verified Space
          </div>
          {matchScore !== null && (
            <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg border border-white/10 flex items-center gap-1.5 ${matchScore > 80 ? 'bg-emerald-600' : matchScore > 60 ? 'bg-amber-500' : 'bg-gray-500'}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              {matchScore}% Match
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-base font-bold text-[#1E1B4B] group-hover:text-indigo-600 transition-colors line-clamp-2">{house.title}</h3>
          <div className="text-right shrink-0">
            <p className="text-lg font-black text-indigo-600">₹{house.price.toLocaleString()}</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Monthly Rent</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400 mb-6">
          <svg className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
          <span className="text-xs font-semibold">{house.location}</span>
        </div>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {house.amenities.slice(0, 3).map(a => (
            <span key={a} className="bg-gray-50 text-gray-500 text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-tight border border-gray-100">
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
