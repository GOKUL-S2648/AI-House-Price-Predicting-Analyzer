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
        <div className="max-w-2xl mx-auto bg-[#F8FAFC] p-12 md:p-16 rounded-[56px] shadow-2xl border border-black/5 animate-in fade-in zoom-in-95 duration-1000">
            <div className="flex items-center justify-between mb-16">
                <div>
                    <h2 className="text-4xl font-black text-[#0F172A] tracking-tight uppercase">Manifest Property</h2>
                    <p className="text-[10px] text-[#00AEEF] font-black uppercase tracking-[0.4em] mt-3 border-l-2 border-[#00AEEF] pl-4">Network Growth</p>
                </div>
                <button onClick={onBack} className="text-gray-400 hover:text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] transition-all bg-white px-6 py-2 rounded-xl border border-black/5 shadow-sm">Dismiss</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Manifest Title</label>
                        <input
                            required
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                            placeholder="e.g. Skyline Unit"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Holding Type</label>
                        <div className="relative group">
                            <select
                                className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all appearance-none cursor-pointer uppercase tracking-widest shadow-sm"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                {['Pg', 'Apartment', 'Villa', 'Individual House', 'Studio'].map(t => (
                                    <option key={t} value={t} className="bg-white text-[#0F172A]">{t}</option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-focus-within:text-[#00AEEF] transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Liquidity Units (₹)</label>
                        <input
                            required
                            type="number"
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                            placeholder="e.g. 15000"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">District Focus</label>
                        <input
                            required
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                            placeholder="e.g. Ernakulam"
                            value={formData.district}
                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Vector Coordinates</label>
                    <input
                        required
                        className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                        placeholder="e.g. MG Road, Kochi, Kerala"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-1">Holding Analysis</label>
                    <textarea
                        required
                        rows={5}
                        className="w-full bg-white text-[#0F172A] border border-black/5 rounded-[32px] px-8 py-6 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all resize-none placeholder:text-gray-300 uppercase tracking-[0.2em] leading-relaxed shadow-sm"
                        placeholder="Define the premium parameters of your property holding..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white font-black py-7 rounded-[28px] shadow-xl shadow-[#00AEEF]/10 disabled:opacity-50 hover:shadow-[#00AEEF]/30 hover:scale-[1.02] transition-all uppercase tracking-[0.4em] text-[11px] active:scale-95"
                >
                    <span className="relative z-10">{loading ? 'Processing Neural Submission...' : 'Initiate Intelligence Verification'}</span>
                </button>
            </form>
        </div>
    );
};

export default ListProperty;
