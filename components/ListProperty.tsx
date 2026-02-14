import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';

interface ListPropertyProps {
    user: User;
    onSuccess: () => void;
    onBack: () => void;
}

const ListProperty: React.FC<ListPropertyProps> = ({ user, onSuccess, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Apartment',
        price: '',
        location: '',
        district: '',
        state: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('houses')
                .insert({
                    title: formData.title,
                    type: formData.type,
                    price: parseFloat(formData.price),
                    location: formData.location,
                    district: formData.district,
                    state: formData.state,
                    description: formData.description,
                    image: formData.image,
                    owner_id: user.id,
                    is_approved: false, // Must be approved by admin
                    amenities: ['Basic Amenities'],
                    historical_prices: [{ year: 2025, price: parseFloat(formData.price) }]
                });

            if (error) throw error;
            onSuccess();
        } catch (err: any) {
            alert(`Error listing property: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-[#1E1B4B] dark:text-white tracking-tight">List Your Property</h2>
                <button onClick={onBack} className="text-gray-400 hover:text-indigo-600 font-bold transition-all">Cancel</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Property Title</label>
                        <input
                            required
                            className="w-full bg-gray-50 dark:bg-slate-900 text-[#1E1B4B] dark:text-white border-none rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="e.g. Modern 2BHK in Downtown"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Type</label>
                        <select
                            className="w-full bg-gray-50 dark:bg-slate-900 text-[#1E1B4B] dark:text-white border-none rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            {['Pg', 'Apartment', 'Villa', 'Individual House', 'Studio'].map(t => (
                                <option key={t} value={t} className="bg-white dark:bg-slate-900 text-[#1E1B4B] dark:text-white">{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Monthly Rent (₹)</label>
                        <input
                            required
                            type="number"
                            className="w-full bg-gray-50 dark:bg-slate-900 text-[#1E1B4B] dark:text-white border-none rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="e.g. 15000"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">District</label>
                        <input
                            required
                            className="w-full bg-gray-50 dark:bg-slate-900 text-[#1E1B4B] dark:text-white border-none rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="e.g. Ernakulam"
                            value={formData.district}
                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Full Address/Location</label>
                    <input
                        required
                        className="w-full bg-gray-50 dark:bg-slate-900 text-[#1E1B4B] dark:text-white border-none rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all"
                        placeholder="e.g. MG Road, Kochi, Kerala"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Property Description</label>
                    <textarea
                        required
                        rows={4}
                        className="w-full bg-gray-50 dark:bg-slate-900 text-[#1E1B4B] dark:text-white border-none rounded-2xl px-6 py-4 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                        placeholder="Tell us about the property..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 disabled:opacity-50 transition-all transform active:scale-95"
                >
                    {loading ? 'Submitting for Approval...' : 'Submit Listing'}
                </button>
            </form>
        </div>
    );
};

export default ListProperty;
