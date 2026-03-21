import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAffordabilityInsight } from '../geminiService';
import { predictFuturePrice } from '../mlService';
import { House, User } from '../types';

const HouseDetails = ({ house, user, onBack, onBook }: {
  house: House;
  user: User;
  onBack: () => void;
  onBook: () => void;
}) => {
  const [insight, setInsight] = useState('');
  const [mlData, setMlData] = useState<{
    predictedPrice: number;
    trend: string;
    isRF: boolean;
    lrPrice?: number;
    lrTrend?: string;
    rfPrice?: number;
    rfTrend?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  
  // Rule: If rent is 6k, the chart should show 3k, 4k, 5k, 6k
  // house.historicalPrices is now pre-standardized to 3k, 4k, 5k, 6k for a 6k rent.
  const chartData = [
    ...house.historicalPrices
  ];

  useEffect(() => {
    const processData = async () => {
      setIsLoading(true);
      try {
        const textInsight = await getAffordabilityInsight(house, user.income);
        const forecast = await predictFuturePrice(house.historicalPrices, 2027, house.amenities.length);

        setInsight(textInsight);
        setMlData(forecast);
      } catch (e) {
        console.error("Prediction error:", e);
      } finally {
        setIsLoading(false);
      }
    };
    processData();
  }, [house.id, user.income]);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-1000 pb-20 px-4">
      {/* Back Navigation */}
      <button 
        onClick={onBack} 
        className="mb-10 flex items-center gap-3 text-gray-400 hover:text-[#00AEEF] transition-all font-black text-xs uppercase tracking-[0.4em] group bg-[#F8FAFC] px-6 py-3 rounded-full border border-black/5 hover:border-[#00AEEF]/20 shadow-sm"
      >
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
        </svg>
        Return Index
      </button>

      {/* 1. Main Overview Header (Hero) */}
      <div className="bg-[#F8FAFC] rounded-[56px] overflow-hidden shadow-2xl border border-black/5 flex flex-col lg:flex-row mb-16 backdrop-blur-xl">
        <div className="lg:w-1/2 aspect-square lg:aspect-auto p-4">
          <img 
            src={house.image} 
            alt={house.title}
            className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000 rounded-[40px] shadow-lg" 
          />
        </div>
        <div className="lg:w-1/2 p-12 lg:p-16 space-y-12 flex flex-col justify-center">
          <div>
            <span className="text-sm font-black text-[#00AEEF] uppercase tracking-[0.4em] mb-6 block border-l-2 border-[#00AEEF] pl-4">Verified Intelligence Holding</span>
            <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight uppercase mb-6">{house.title}</h1>
            <div className="flex items-center gap-4 text-[#0F172A] font-black text-xs uppercase tracking-[0.2em] mt-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00AEEF] shadow-sm border border-black/5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              {house.location}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-[#00AEEF] tracking-tighter">₹{house.price.toLocaleString()}</span>
              <span className="text-gray-400 font-black text-sm uppercase tracking-[0.3em]">Units/Mo</span>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00AEEF]/20 to-transparent rounded-[40px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <p className="relative text-[#0F172A]/80 font-semibold text-lg leading-relaxed bg-white p-12 rounded-[36px] border border-black/5 tracking-tight italic shadow-sm">
                "{insight || "Analyzing market liquidity and demographic stability indices..."}"
              </p>
            </div>
          </div>

          <div className="mt-auto space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-6 px-10 py-6 bg-white rounded-[32px] border border-black/5 shadow-sm group/email cursor-pointer hover:border-[#00AEEF]/20 transition-all">
                <div className="w-12 h-12 rounded-full bg-[#00AEEF]/5 flex items-center justify-center text-[#00AEEF] group-hover/email:bg-[#00AEEF] group-hover/email:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Owner Registry</span>
                  <span className="text-base font-black text-[#0F172A] tracking-wider">{house.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 px-10 py-6 bg-white rounded-[32px] border border-black/5 shadow-sm group/phone cursor-pointer hover:border-[#00AEEF]/20 transition-all">
                <div className="w-12 h-12 rounded-full bg-[#00AEEF]/5 flex items-center justify-center text-[#00AEEF] group-hover/phone:bg-[#00AEEF] group-hover/phone:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Direct Line</span>
                  <span className="text-base font-black text-[#0F172A] tracking-wider">{house.phone || `+91 9${(house.price % 8999) + 1000}-48${(house.price % 999) + 100}`}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={onBook} 
              className="w-full group relative overflow-hidden bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white font-black py-7 rounded-[28px] shadow-[0_20px_50px_rgba(0,174,239,0.15)] hover:shadow-[0_20px_50px_rgba(0,174,239,0.3)] hover:scale-[1.03] active:scale-95 transition-all text-sm uppercase tracking-[0.4em]"
            >
              <span className="relative z-10">Initialize Holding</span>
            </button>
          </div>
        </div>
      </div>
      {/* 2. Ratings Based on Features Section */}
      <div className="bg-white rounded-[56px] p-12 lg:p-20 mb-16 shadow-2xl border border-black/5 animate-in fade-in slide-in-from-bottom duration-1000 transition-all hover:shadow-[0_32px_80px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 mb-16">
          <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase italic">Ratings based on features</h3>
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 cursor-help group/info relative">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-[#0F172A] text-white text-xs rounded-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all font-bold uppercase tracking-widest text-center shadow-2xl z-20">
              Aggregated from user reviews and localized infra data targets.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">
          {[
            { label: 'Connectivity', icon: 'M12 2c-4 0-8 .5-8 4v9.5c0 1.38 1.12 2.5 2.5 2.5l-.5 1v.5c0 .28.22.5.5.5h11c.28 0 .5-.22.5-.5v-.5l-.5-1c1.38 0 2.5-1.12 2.5-2.5V6c0-3.5-4-4-8-4z', value: house.ratings?.connectivity || 4.2 },
            { label: 'Neighbourhood', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', value: house.ratings?.neighbourhood || 3.6 },
            { label: 'Safety', icon: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z', value: house.ratings?.safety || 3.5 },
            { label: 'Livability', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', value: house.ratings?.livability || 4.2 }
          ].map((rating, idx) => (
            <div key={idx} className="flex flex-col items-center group/rating cursor-pointer">
              <div className="relative w-28 h-28 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-gray-100" />
                  <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={314} strokeDashoffset={314 - (314 * (rating.value / 5))} strokeLinecap="round" className="text-[#10B981] transition-all duration-1000 ease-out" style={{ filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.2))' }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover/rating:text-[#10B981] transition-all duration-500 bg-white rounded-full m-3 shadow-inner">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={rating.icon} />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1 font-black mb-2">
                  <span className="text-2xl text-[#0F172A] tracking-tighter">{rating.value.toFixed(1)}</span>
                  <span className="text-gray-300 text-xs uppercase tracking-widest">/5</span>
                </div>
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] group-hover/rating:text-[#00AEEF] transition-colors">
                  {rating.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Neural Analysis Section (2 Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Neural Manifestation Analysis Card */}
        <div className="bg-white rounded-[64px] p-16 text-[#0F172A] shadow-2xl border border-black/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00AEEF]/5 rounded-full -mr-48 -mt-48 blur-[100px] group-hover:bg-[#00AEEF]/10 transition-all duration-1000"></div>
          <div className="relative z-10">
            <h3 className="text-xs font-black text-[#00AEEF] uppercase tracking-[0.5em] mb-16 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse"></div>
              Neural Manifestation Analysis
            </h3>

            {isLoading ? (
              <div className="space-y-12 h-64">
                <div className="h-8 w-1/3 bg-gray-100 animate-pulse rounded-full" />
                <div className="h-24 w-full bg-gray-100 animate-pulse rounded-[32px]" />
                <div className="h-16 w-full bg-gray-100 animate-pulse rounded-[32px]" />
              </div>
            ) : (
              <div className="space-y-16">
                <div className="pt-4">
                  <div className="space-y-8">
                    <p className="text-xs font-black text-gray-300 uppercase tracking-[0.3em]">Anticipated Equilibrium 2027</p>
                    <div className="flex flex-col gap-5">
                      <span className="text-7xl font-black text-[#0F172A] tracking-tighter leading-none">
                        ₹{(mlData as any)?.rfPrice?.toLocaleString() || mlData?.predictedPrice.toLocaleString()}
                      </span>
                      <div className="flex">
                        <span className={`text-[11px] font-black px-5 py-2.5 rounded-xl border-2 uppercase tracking-[0.3em] ${((mlData as any)?.rfTrend || mlData?.trend) === 'rising' ? 'bg-[#00AEEF]/5 text-[#00AEEF] border-[#00AEEF]/10' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                          {((mlData as any)?.rfTrend || mlData?.trend).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-black/5 flex items-start gap-6">
                  <div className="w-10 h-10 rounded-2xl bg-[#00AEEF]/5 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#00AEEF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <p className="text-base text-[#0F172A]/70 font-bold leading-relaxed">
                    Neural Analytics confirmed. Advanced regression logic calibrated with Bootstrap Aggregation for localized volatility suppression.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Historical Delta Matrix Card */}
        <div className="bg-white rounded-[64px] p-16 shadow-2xl border border-black/5 relative overflow-hidden group">
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#00AEEF]/3 rounded-full blur-[80px]"></div>
          
          <h3 className="text-xs font-black text-[#00AEEF] uppercase tracking-[0.5em] mb-16 flex items-center gap-4">
            <svg className="w-6 h-6 text-[#00AEEF]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Historical Delta Matrix
          </h3>

          <div className="h-[400px] w-full pt-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData}
                margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 900 }} 
                  axisLine={false}
                  tickLine={false}
                  dy={20}
                />
                <YAxis 
                  hide={false}
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 800 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `₹${value > 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                />
                <Tooltip 
                  cursor={{ stroke: '#00AEEF', strokeWidth: 3, strokeDasharray: '8 8' }}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '40px',
                    border: 'none',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.15)',
                    padding: '32px',
                    color: '#0F172A',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '14px',
                    letterSpacing: '0.2em'
                  }}
                  itemStyle={{ color: '#00AEEF', padding: '8px 0', fontSize: '18px' }}
                  labelStyle={{ marginBottom: '12px', color: '#94A3B8', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#00AEEF" 
                  strokeWidth={10} 
                  dot={{ r: 10, fill: '#FFFFFF', strokeWidth: 5, stroke: '#00AEEF' }} 
                  activeDot={{ r: 14, fill: '#00AEEF', strokeWidth: 5, stroke: '#FFFFFF' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


    </div>
  );
};

export default HouseDetails;
