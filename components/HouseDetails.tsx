
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
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700 pb-20">
      <button onClick={onBack} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors font-bold text-xs uppercase tracking-widest group">
        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" /></svg>
        Go back
      </button>

      <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-50 flex flex-col md:flex-row mb-10">
        <div className="md:w-1/2 aspect-square md:aspect-auto">
          <img src={house.image} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-12 space-y-8 flex flex-col">
          <div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 block">Market Verified Listing</span>
            <h1 className="text-4xl font-black text-[#1E1B4B] tracking-tight mb-2">{house.title}</h1>
            <p className="text-gray-400 font-bold">{house.location}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-[#1E1B4B]">₹{house.price.toLocaleString()}</span>
              <span className="text-gray-400 font-bold text-lg">/month</span>
            </div>

            {!isLoading && mlData && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left duration-1000">
                <div className="px-4 py-2 bg-[#1E1B4B] text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-100 border border-white/10">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300">2026 AI Forecast</span>
                    <span className="text-lg font-black leading-none">₹{mlData.predictedPrice.toLocaleString()}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg ${mlData.trend === 'rising' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {mlData.trend === 'rising' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <p className="text-gray-600 font-medium leading-relaxed bg-gray-50 p-6 rounded-3xl border border-gray-100 italic">
            "{insight}"
          </p>

          <button onClick={onBook} className="w-full brand-gradient text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all text-lg mt-auto">
            Schedule a Personal Visit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-[#1E1B4B] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-10">
              {mlData?.isRF ? 'Random Forest Smart Projection' : 'Linear Regression Projection'}
            </h3>

            {isLoading ? (
              <div className="h-20 w-full bg-white/5 animate-pulse rounded-2xl" />
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-indigo-200/60 mb-1">Forecast for 2026</p>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-black">₹{mlData?.predictedPrice.toLocaleString()}</span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md ${mlData?.trend === 'rising' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {mlData?.trend.toUpperCase()} TREND
                    </span>
                  </div>
                </div>
                <p className="text-xs text-indigo-100/40 font-bold leading-relaxed">
                  Mathematical prediction based on local market velocity and historical rent adjustments.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-8 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            AI Price Trend Analysis ({mlData?.isRF ? 'Random Forest' : 'Linear Regression'})
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...house.historicalPrices, mlData ? { year: 2026, price: mlData.predictedPrice } : null].filter(Boolean)}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 600 }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickLine={false}
                  domain={['dataMin - 200', 'dataMax + 200']}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}
                />
                {/* Current marker line - positioned at 2025 */}
                <line
                  x1="75%"
                  y1="0"
                  x2="75%"
                  y2="100%"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                  opacity="0.5"
                />
                <text
                  x="75%"
                  y="50%"
                  fill="#6B7280"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  Current
                </text>
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={(props) => {
                    const { cx, cy, index, payload } = props;
                    // Highlight the last point (2026 projection) with a larger, filled dot
                    const isProjection = payload.year === 2026;
                    return (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isProjection ? 8 : 5}
                        fill={isProjection ? '#4F46E5' : '#fff'}
                        stroke="#4F46E5"
                        strokeWidth={isProjection ? 4 : 2}
                      />
                    );
                  }}
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
