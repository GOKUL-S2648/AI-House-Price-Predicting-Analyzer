import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { MOCK_HOUSES } from '../constants';

const MigrationUtility: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const startMigration = async () => {
        setLoading(true);
        setStatus('Starting migration...');

        try {
            for (const house of MOCK_HOUSES) {
                const { error } = await supabase
                    .from('houses')
                    .upsert({
                        listing_id: house.id,
                        title: house.title,
                        type: house.type,
                        price: house.price,
                        location: house.location,
                        district: house.district,
                        state: house.state,
                        image: house.image,
                        amenities: house.amenities,
                        historical_prices: house.historicalPrices,
                        description: house.description,
                        lat: house.lat,
                        lng: house.lng
                    }, { onConflict: 'listing_id' });

                if (error) {
                    console.error(`Error inserting ${house.title}:`, error);
                    setStatus(`Error: ${error.message}`);
                    setLoading(false);
                    return;
                }
            }
            setStatus('Migration complete! All houses inserted/updated.');
        } catch (err: any) {
            console.error('Migration failed:', err);
            setStatus(`Failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl mt-8">
            <h3 className="text-xl font-bold mb-4">Supabase Data Migration</h3>
            <p className="text-gray-500 mb-6">This tool will push the mock data from constants.ts into your Supabase database.</p>

            <div className="flex items-center gap-4">
                <button
                    onClick={startMigration}
                    disabled={loading}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold disabled:opacity-50 transition-all"
                >
                    {loading ? 'Migrating...' : 'Start Migration'}
                </button>

                {status && (
                    <span className={`font-medium ${status.includes('Error') || status.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                        {status}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MigrationUtility;
