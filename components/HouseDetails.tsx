
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

  useEffect(() => {
    const processData = async () => {
      setIsLoading(true);
      try {
        const textInsight = await getAffordabilityInsight(house, user.income);
        const forecast = await predictFuturePrice(house.historicalPrices, 2026, house.amenities.length);

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
    <div className="max-w-6xl mx-auto animate-in fade-in duration-1000 pb-20">
      <button onClick={onBack} className="mb-10 flex items-center gap-3 text-gray-400 hover:text-[#00AEEF] transition-all font-black text-[9px] uppercase tracking-[0.4em] group bg-[#F8FAFC] px-6 py-3 rounded-full border border-black/5 hover:border-[#00AEEF]/20 shadow-sm">
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" /></svg>
        Return Index
      </button>

      <div className="bg-[#F8FAFC] rounded-[56px] overflow-hidden shadow-2xl border border-black/5 flex flex-col lg:flex-row mb-16 backdrop-blur-xl">
        <div className="lg:w-1/2 aspect-square lg:aspect-auto p-4">
          <img src={house.image} className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000 rounded-[40px] shadow-lg" />
        </div>
        <div className="lg:w-1/2 p-12 lg:p-16 space-y-12 flex flex-col justify-center">
          <div>
            <span className="text-[9px] font-black text-[#00AEEF] uppercase tracking-[0.4em] mb-6 block border-l-2 border-[#00AEEF] pl-4">Verified Intelligence Holding</span>
            <h1 className="text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight uppercase mb-6">{house.title}</h1>
            <div className="flex items-center gap-4 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] mt-2">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00AEEF] shadow-sm border border-black/5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              </div>
              {house.location}
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-[#00AEEF] tracking-tighter">₹{house.price.toLocaleString()}</span>
              <span className="text-gray-400 font-black text-sm uppercase tracking-[0.3em]">Units/Mo</span>
            </div>

            {!isLoading && mlData && (
              <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-1000">
                <div className="px-8 py-5 bg-white text-[#0F172A] rounded-[32px] flex items-center gap-6 border border-black/5 shadow-xl">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#00AEEF] mb-1">Neural Forecast 2026</span>
                    <span className="text-2xl font-black text-[#0F172A] tracking-tight">₹{(mlData as any).rfPrice?.toLocaleString() || mlData.predictedPrice.toLocaleString()}</span>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${((mlData as any).rfTrend || mlData.trend) === 'rising' ? 'bg-[#00AEEF]/5 text-[#00AEEF]' : 'bg-rose-50 text-rose-500'}`}>
                    {((mlData as any).rfTrend || mlData.trend) === 'rising' ? (
                      <svg className="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00AEEF]/20 to-transparent rounded-[40px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <p className="relative text-gray-400 font-bold text-[11px] leading-relaxed bg-white p-10 rounded-[36px] border border-black/5 uppercase tracking-widest italic shadow-sm">
              "{insight}"
            </p>
          </div>

          <button onClick={onBook} className="group relative overflow-hidden bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white font-black py-7 rounded-[28px] shadow-[0_20px_50px_rgba(0,174,239,0.15)] hover:shadow-[0_20px_50px_rgba(0,174,239,0.3)] hover:scale-[1.03] active:scale-95 transition-all text-sm uppercase tracking-[0.4em] mt-auto">
            <span className="relative z-10">Initialize Holding</span>
          </button>
        </div>
      </div>

      {/* Feature Ratings Section */}
      <div className="bg-white rounded-[48px] p-12 lg:p-16 mb-16 shadow-xl border border-black/5 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
        <div className="flex items-center gap-2 mb-12">
          <h3 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">Ratings based on features</h3>
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 cursor-help group/info relative">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-[#0F172A] text-white text-[10px] rounded-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all font-bold uppercase tracking-widest text-center shadow-2xl z-20">
              Aggregated from user reviews and localized infra data targets.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20">
          {[
            { label: 'Connectivity', icon: 'M12 2c-4 0-8 .5-8 4v9.5c0 1.38 1.12 2.5 2.5 2.5l-.5 1v.5c0 .28.22.5.5.5h11c.28 0 .5-.22.5-.5v-.5l-.5-1c1.38 0 2.5-1.12 2.5-2.5V6c0-3.5-4-4-8-4zm0 2c3.71 0 6 .42 6 2v2H6V6c0-1.58 2.29-2 6-2zM6 15.5V10h12v5.5c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5zM8 13c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm8 0c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z', value: house.ratings?.connectivity || 4.2 },
            { label: 'Neighbourhood', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', value: house.ratings?.neighbourhood || 4.5 },
            { label: 'Safety', icon: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z', value: house.ratings?.safety || 4.8 },
            { label: 'Livability', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', value: house.ratings?.livability || 4.6 }
          ].map((rating, idx) => (
            <div key={idx} className="flex flex-col items-center group/rating cursor-pointer">
              <div className="relative w-24 h-24 mb-6">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * (rating.value / 5))}
                    strokeLinecap="round"
                    className="text-[#10B981] transition-all duration-1000 ease-out"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.3))' }}
                  />
                </svg>
                {/* Icon in Center */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover/rating:text-[#10B981] transition-colors duration-500 bg-white rounded-full bg-clip-content m-2">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={rating.icon} />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <span className="text-lg font-black text-[#0F172A] tracking-tighter mb-1 block">
                  {rating.value.toFixed(1)}<span className="text-gray-300 text-xs">/5</span>
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover/rating:text-[#0F172A] transition-colors">
                  {rating.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Furnishings Section */}
      <div className="bg-white rounded-[48px] p-12 lg:p-16 mb-16 shadow-xl border border-black/5 animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-xl font-black text-[#0F172A] tracking-tight uppercase">Furnishings</h3>
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            More furnishings 
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(house.furnishings || [
            { name: 'Sofa', count: 1 },
            { name: 'Stove', count: 1 },
            { name: 'Fan', count: 1 },
            { name: 'Light', count: 1 },
            { name: 'Wardrobe', count: 1 },
            { name: 'TV', count: 1 },
            { name: 'Bed', count: 1 }
          ]).map((item, idx) => (
            <div key={idx} className="bg-[#F8FAFC] border border-black/5 rounded-3xl p-6 flex flex-col gap-4 group hover:bg-white hover:border-indigo-600/20 hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all duration-500 shadow-sm border border-black/5">
                {item.name === 'Sofa' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 6v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z M7 18v2 M17 18v2 M3 10h18" /></svg>}
                {item.name === 'Stove' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4zm4 4h2v2H8V8zm6 0h2v2h-2V8zm-6 6h2v2H8v-2zm6 0h2v2h-2v-2z" /></svg>}
                {item.name === 'Fan' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12m-3 0a3 3 0 106 0 3 3 0 10-6 0 M12 5v2 M12 17v2 M5 12h2 M17 12h2 M7.75 7.75l1.5 1.5 M14.75 14.75l1.5 1.5 M7.75 16.25l1.5-1.5 M14.75 9.25l1.5-1.5" /></svg>}
                {item.name === 'Light' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.674a1 1 0 01.992.883l.11.9a1 1 0 01-.992 1.117H9.554a1 1 0 01-.992-1.117l.11-.9a1 1 0 01.992-.883zM12 3a7 7 0 00-7 7c0 1.58.523 3.039 1.405 4.215C7.456 15.343 8 16.5 8 18h8c0-1.5.544-2.657 1.595-3.785A6.974 6.974 0 0019 10a7 7 0 00-7-7z" /></svg>}
                {item.name === 'Wardrobe' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 4h14v16H5z M12 4v16 M9 10h1 M14 10h1" /></svg>}
                {item.name === 'TV' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z M10 16l-2 4 M14 16l2 4" /></svg>}
                {item.name === 'Bed' && <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10V19 M21 10V19 M3 14h18 M6 10l.613-2.454a3 3 0 012.91-2.273h4.954a3 3 0 012.91 2.273L18 10" /></svg>}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.count && item.count > 0 ? `${item.count} ` : ''}{item.name}</span>
              </div>
            </div>
          ))}
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-sm">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 text-xs font-black shadow-sm group-hover:scale-110 transition-transform">
              +1
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 group-hover:text-white">View Details</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-[#F8FAFC] rounded-[56px] p-16 text-[#0F172A] shadow-xl border border-black/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00AEEF]/5 rounded-full -mr-40 -mt-40 blur-3xl group-hover:bg-[#00AEEF]/10 transition-colors duration-1000"></div>
          <div className="relative z-10">
            <h3 className="text-[9px] font-black text-[#00AEEF] uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00AEEF] animate-ping"></div>
              Neural Manifestation Analysis
            </h3>

            {isLoading ? (
              <div className="h-40 w-full bg-black/5 animate-pulse rounded-[32px]" />
            ) : (
              <div className="space-y-10">
                <div>
                  <p className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.3em]">Anticipated Equilibrium 2026</p>
                  <div className="flex items-baseline gap-8">
                    <span className="text-7xl font-black text-[#0F172A] tracking-tighter">₹{(mlData as any)?.rfPrice?.toLocaleString() || mlData?.predictedPrice.toLocaleString()}</span>
                    <span className={`text-[8px] font-black px-4 py-2 rounded-xl border-2 uppercase tracking-[0.3em] ${((mlData as any)?.rfTrend || mlData?.trend) === 'rising' ? 'bg-[#00AEEF]/5 text-[#00AEEF] border-[#00AEEF]/10' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                      {((mlData as any)?.rfTrend || mlData?.trend).toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-loose border-l-2 border-[#00AEEF]/20 pl-8">
                  Data Engine Projection calculated via localized liquidity flows and infrastructure development velocity indices.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#F8FAFC] rounded-[56px] p-16 shadow-xl border border-black/5 relative overflow-hidden group">
          <h3 className="text-[9px] font-black text-[#00AEEF] uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
            <svg className="w-5 h-5 text-[#00AEEF]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Historical Delta Matrix
          </h3>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...house.historicalPrices, mlData ? { year: 2026, price: (mlData as any).lrPrice || mlData.predictedPrice } : null].filter(Boolean)}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: 900 }}
                  axisLine={{ stroke: 'rgba(0,0,0,0.05)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 10, fontWeight: 900 }}
                  axisLine={{ stroke: 'rgba(0,0,0,0.05)' }}
                  tickLine={false}
                  domain={['dataMin - 1000', 'dataMax + 1000']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    padding: '20px',
                    color: '#0F172A',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    letterSpacing: '0.1em'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#00AEEF"
                  strokeWidth={6}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    const isProjection = payload.year === 2026;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isProjection ? 10 : 6}
                        fill={isProjection ? '#00AEEF' : '#FFFFFF'}
                        stroke="#00AEEF"
                        strokeWidth={4}
                      />
                    );
                  }}
                  activeDot={{ r: 12, fill: '#00AEEF', stroke: '#FFFFFF', strokeWidth: 4 }}
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
