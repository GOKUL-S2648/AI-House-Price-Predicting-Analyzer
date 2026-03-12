
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
