import React, { useEffect, useState } from 'react';
import { House } from '../types';

interface RiskZoneMapProps {
    houses: House[];
}

const RiskZoneMap: React.FC<RiskZoneMapProps> = ({ houses }) => {
    const [analysis, setAnalysis] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/district-analysis`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ houses })
                });
                const data = await response.json();
                setAnalysis(data.analysis);
            } catch (e) {
                console.error("Failed to fetch district analysis", e);
            } finally {
                setLoading(false);
            }
        };

        if (houses.length > 0) {
            fetchAnalysis();
        }
    }, [houses]);

    if (loading) return null;

    return (
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mt-12">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-[#1E1B4B]">Neighborhood Intelligence</h2>
                <p className="text-gray-400 font-bold text-sm mt-1">AI-driven risk assessment of local districts and slum risk mapping.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {analysis.map((item, idx) => (
                    <div
                        key={idx}
                        className={`p-6 rounded-[24px] border transition-all duration-300 ${item.risk_score > 70 ? 'bg-rose-50 border-rose-100 hover:shadow-rose-100' :
                                item.risk_score > 40 ? 'bg-amber-50 border-amber-100 hover:shadow-amber-100' :
                                    'bg-emerald-50 border-emerald-100 hover:shadow-emerald-100'
                            } hover:shadow-xl hover:-translate-y-1`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-lg font-black text-[#1E1B4B]">{item.district}</h4>
                            <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${item.risk_score > 70 ? 'bg-rose-600 text-white' :
                                    item.risk_score > 40 ? 'bg-amber-500 text-white' :
                                        'bg-emerald-600 text-white'
                                }`}>
                                Score: {item.risk_score}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <p className={`text-sm font-bold ${item.risk_score > 70 ? 'text-rose-600' :
                                        item.risk_score > 40 ? 'text-amber-600' :
                                            'text-emerald-600'
                                    }`}>{item.status}</p>
                            </div>

                            <div className="flex justify-between">
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Growth</p>
                                    <p className="text-sm font-bold text-gray-700">{item.avg_growth}%</p>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Data Points</p>
                                    <p className="text-sm font-bold text-gray-700">{item.house_count} Listings</p>
                                </div>
                            </div>

                            <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${item.risk_score > 70 ? 'bg-rose-500' :
                                            item.risk_score > 40 ? 'bg-amber-500' :
                                                'bg-emerald-500'
                                        }`}
                                    style={{ width: `${item.risk_score}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RiskZoneMap;
