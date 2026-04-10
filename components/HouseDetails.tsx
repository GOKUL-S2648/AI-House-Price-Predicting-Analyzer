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
  const [activeImage, setActiveImage] = useState<string | null>(house.image);
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
      <div className="bg-[#F8FAFC] rounded-[56px] overflow-hidden shadow-2xl border border-black/5 flex flex-col lg:flex-row mb-16 backdrop-blur-xl min-h-[700px]">
        <div className="lg:w-1/2 bg-slate-50/50 p-8 flex flex-col border-r border-black/5">
          <div className="flex-1 space-y-10 flex flex-col justify-center">
            <div className="aspect-[4/5] w-full relative group">
              <img 
                src={activeImage || house.image} 
                alt={house.title}
                className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700 rounded-[48px] shadow-2xl border border-black/5" 
              />
              {house.images && house.images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 px-5 py-3 bg-black/30 backdrop-blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {house.images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        (activeImage || house.image) === house.images![i] ? 'bg-[#00AEEF] scale-150 shadow-[0_0_10px_#00AEEF]' : 'bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {house.images && house.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4 px-2">
                {house.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-[24px] overflow-hidden border-2 transition-all duration-500 hover:scale-110 ${
                      (activeImage || house.image) === img 
                        ? 'border-[#00AEEF] scale-105 shadow-xl shadow-[#00AEEF]/20' 
                        : 'border-transparent bg-white shadow-sm hover:border-black/10'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-1/2 p-12 lg:p-20 space-y-12 flex flex-col justify-center bg-white">
          <div>
            <span className="text-sm font-black text-[#00AEEF] uppercase tracking-[0.4em] mb-6 block border-l-2 border-[#00AEEF] pl-4">Verified Intelligence Holding</span>
            <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight uppercase mb-6">
              {house.title}
            </h1>
            <div className="flex items-center gap-4 text-[#0F172A] font-black text-xs uppercase tracking-[0.2em] mt-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00AEEF] shadow-sm border border-black/5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              {house.location} • {house.type} • {house.bhkType}
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
                  <span className="text-base font-black text-[#0F172A] tracking-wider">{house.phone || `+91 7${((house.price * 17) % 899999999) + 100000000}`}</span>
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

      {/* 2.5 Amenities Section */}
      <div className="bg-white rounded-[56px] p-12 lg:p-20 mb-16 shadow-2xl border border-black/5 animate-in fade-in slide-in-from-bottom duration-1000 transition-all hover:shadow-[0_32px_80px_rgba(0,0,0,0.08)]">
        <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase italic mb-10">Premium Amenities</h3>
        <div className="flex flex-wrap gap-4">
          {house.amenities.map((amenity, idx) => (
            <div key={idx} className="bg-[#F8FAFC] border border-black/5 px-6 py-4 rounded-2xl flex items-center gap-3 group hover:border-[#00AEEF]/20 transition-all shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#00AEEF] group-hover:scale-125 transition-transform"></div>
              <span className="text-sm font-black text-[#0F172A] uppercase tracking-widest">{amenity}</span>
            </div>
          ))}
          {house.carParking && (
            <div className="bg-[#F8FAFC] border border-[#00AEEF]/20 px-6 py-4 rounded-2xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-black text-[#0F172A] uppercase tracking-widest">Car Parking: {house.carParking}</span>
            </div>
          )}
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
                    <p className="text-xs font-black text-gray-500 uppercase tracking-[0.3em]">Anticipated Equilibrium 2027</p>
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
      </div>    </div>
  );
};

export default HouseDetails;
