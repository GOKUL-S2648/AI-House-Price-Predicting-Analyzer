import React, { useState } from 'react';
import { getMatchScore, predictFuturePrice, analyzeListingValue } from '../mlService';
import { House, User } from '../types';

// Fix: Defined HouseCardProps interface for strict typing
interface HouseCardProps {
  house: House;
  onClick: () => void;
  user: User;
}  

// Fix: Used React.FC<HouseCardProps> to correctly handle React props like 'key' in App.tsx
const HouseCard: React.FC<HouseCardProps> = ({ house, onClick, user }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [valuation, setValuation] = useState<{ label: string, color: string } | null>(null);
  const matchScore = user ? getMatchScore(house, user) : null;

  React.useEffect(() => {
    const checkValuation = async () => {
      const prediction = await predictFuturePrice(house.historicalPrices, 2025, house.amenities.length);
      const analysis = analyzeListingValue(house.price, prediction.predictedPrice);
      setValuation(analysis);
    };
    checkValuation();
  }, [house]);

  return (
    <div
      className="group relative bg-[var(--bg-secondary)] rounded-[40px] overflow-hidden border border-black/5 shadow-xl hover:border-[#00AEEF]/30 transition-all duration-700 cursor-pointer flex flex-col h-full hover:shadow-[0_20px_60px_rgba(0,174,239,0.08)]"
      onClick={onClick}
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        {!isLoaded && <div className="absolute inset-0 bg-black/[0.02] animate-pulse" />}
        <img
          src={house.image}
          alt={house.title}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />

        <div className="absolute top-6 left-6 flex flex-col gap-3 z-10">
          <div className="bg-[#00AEEF] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl flex items-center gap-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
            Verified Intelligence
          </div>
          <div className="bg-[var(--bg-main)]/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#00AEEF] shadow-lg flex items-center gap-2 border border-black/5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {house.bhkType}
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        {house.is_suspicious && (
          <div className="mb-6 p-4 bg-rose-50 rounded-2xl border border-rose-100">
            <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-1">Anomaly Log</p>
            <p className="text-xs font-bold text-rose-500/80 leading-relaxed line-clamp-2">{house.suspicious_reason}</p>
          </div>
        )}
        
        <div className="mb-6 h-[52px] flex items-start">
          <h3 className="text-lg font-black text-[var(--text-main)] group-hover:text-[#00AEEF] transition-colors leading-tight uppercase tracking-tight line-clamp-2">
            {house.title}
          </h3>
        </div>

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5">
          <div className="flex flex-col">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Valuation</p>
            <p className="text-2xl font-black text-[#00AEEF] tracking-tighter leading-none">
              ₹{house.price.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] leading-none mb-1">Network Units</p>
             <span className="text-[10px] font-black text-emerald-500 uppercase">Live Index</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-400 mb-8 min-h-[32px]">
          <div className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-black/5 flex items-center justify-center text-[#00AEEF]/60 shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <span className="text-xs font-black uppercase tracking-[0.2em] line-clamp-1">{house.location} • {house.type}</span>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {house.amenities.slice(0, 4).map(a => (
            <span key={a} className="bg-[var(--bg-main)] text-gray-400 text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-black/5 group-hover:border-[#00AEEF]/10 group-hover:text-gray-500 transition-all">
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HouseCard;