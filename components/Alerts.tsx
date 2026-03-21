import React, { useEffect, useState } from 'react';
import { House } from '../types';
import { getCheapDeals } from '../mlService';
import HouseCard from './HouseCard';

interface AlertsProps {
    houses: House[];
    user: any;
    onHouseClick: (house: House) => void;
}

const Alerts: React.FC<AlertsProps> = ({ houses, user, onHouseClick }) => {
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            setLoading(true);
            const cheapDeals = await getCheapDeals(houses);
            setDeals(cheapDeals);
            setLoading(false);
        };
        if (houses.length > 0) {
            fetchDeals();
        }
    }, [houses]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (deals.length === 0) {
        return (
            <div className="text-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="bg-white w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Flash Deals Found</h3>
                <p className="text-gray-500 text-sm">AI is currently scanning the market for undervalued properties.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-[#1E1B4B] flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                        </span>
                        AI Flash Deals
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Properties listed significantly below current AI market valuation.</p>
                </div>
                <span className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
                    {deals.length} Active Alerts
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deals.map(deal => {
                    // Find the original house object to pass to HouseCard
                    const originalHouse = houses.find(h => h.id === deal.id);
                    if (!originalHouse) return null;

                    return (
                        <div key={deal.id} className="relative">
                            <div className="absolute -top-3 -right-3 z-20 bg-rose-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black shadow-xl ring-4 ring-white">
                                {deal.discount_percentage}% OFF MARKET
                            </div>
                            <HouseCard
                                house={originalHouse}
                                onClick={() => onHouseClick(originalHouse)}
                                user={user}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Alerts;
