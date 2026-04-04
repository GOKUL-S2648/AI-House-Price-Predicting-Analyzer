
import React, { useState } from 'react';
import { User, House } from '../types';
import { supabase } from '../supabaseClient';

interface ListPropertyProps {
    user: User;
    onSuccess: () => void;
    onBack: () => void;
}

const ListProperty: React.FC<ListPropertyProps> = ({ user, onSuccess, onBack }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        type: 'Apartment',
        bhkType: '2BHK',
        image: '',
        description: '',
        amenities: [] as string[]
    });

    const amenitiesList = [
        'Neural Ethernet', 'Climate Control', 'Neural Security', 'Solar Grid', 
        'Smart Storage', 'Air Purification', 'Gym Access', 'Pool'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('houses')
                .insert([{
                    title: formData.title,
                    price: parseFloat(formData.price),
                    location: formData.location,
                    type: formData.type,
                    bhkType: formData.bhkType,
                    image: formData.image,
                    description: formData.description,
                    owner_id: user.id,
                    owner_name: user.name,
                    email: user.email,
                    is_approved: false, // Wait for admin
                    amenities: formData.amenities,
                    historical_prices: [
                        { year: 2026, price: parseFloat(formData.price) }
                    ]
                }]);

            if (error) throw error;
            onSuccess();
        } catch (err) {
            console.error("Neural submission failed:", err);
            alert("Protocol Violation: Neural submission could not be verified.");
        } finally {
            setLoading(false);
        }
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <button 
                        onClick={onBack}
                        className="group flex items-center gap-3 text-gray-400 hover:text-[#00AEEF] transition-all font-black text-[10px] uppercase tracking-[0.4em]"
                    >
                        <div className="p-2 rounded-xl bg-white border border-black/5 group-hover:border-[#00AEEF]/20 transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </div>
                        Back to Search
                    </button>
                    <h1 className="text-5xl font-black text-[#0F172A] mt-8 uppercase tracking-tighter">Submit <span className="text-[#00AEEF]">Intelligence.</span></h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-black/5 rounded-[40px] p-10 md:p-14 space-y-12 shadow-2xl">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Manifestation Title</label>
                    <input
                        required
                        className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                        placeholder="e.g. Skyline Sanctuary"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Type of Living</label>
                        <select
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all cursor-pointer uppercase tracking-widest shadow-sm"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="Individual House">Individual House</option>
                            <option value="Studio">Studio</option>
                            <option value="Pg">Pg / Shared</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">BHK Magnitude</label>
                        <select
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all cursor-pointer uppercase tracking-widest shadow-sm"
                            value={formData.bhkType}
                            onChange={e => setFormData({ ...formData, bhkType: e.target.value })}
                        >
                            <option value="1BHK">1 BHK</option>
                            <option value="2BHK">2 BHK</option>
                            <option value="3BHK">3 BHK</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Monthly Cost (Fixed)</label>
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
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Property Location</label>
                        <input
                            required
                            className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                            placeholder="e.g. Adyar, Chennai"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Property Visual URL</label>
                    <input
                        required
                        className="w-full bg-white text-[#0F172A] border border-black/5 rounded-2xl px-8 py-5 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all placeholder:text-gray-300 uppercase tracking-widest shadow-sm"
                        placeholder="e.g. https://images.com/house.jpg"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Holding Analysis</label>
                    <textarea
                        required
                        rows={5}
                        className="w-full bg-white text-[#0F172A] border border-black/5 rounded-[32px] px-8 py-6 text-sm font-black focus:ring-4 focus:ring-[#00AEEF]/5 focus:border-[#00AEEF]/20 outline-none transition-all resize-none placeholder:text-gray-300 uppercase tracking-[0.2em] leading-relaxed shadow-sm"
                        placeholder="Define the premium parameters of your property holding..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-8">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 ml-1">Integrated Amenities</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {amenitiesList.map(amenity => (
                            <button
                                key={amenity}
                                type="button"
                                onClick={() => toggleAmenity(amenity)}
                                className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                    formData.amenities.includes(amenity)
                                        ? 'bg-[#00AEEF] border-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20'
                                        : 'bg-white border-black/5 text-gray-400 hover:border-[#00AEEF]/20'
                                }`}
                            >
                                {amenity}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="group relative overflow-hidden w-full bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white font-black py-7 rounded-[28px] shadow-xl shadow-[#00AEEF]/10 disabled:opacity-50 hover:shadow-[#00AEEF]/30 hover:scale-[1.02] transition-all uppercase tracking-[0.4em] text-[11px] active:scale-95"
                >
                    <span className="relative z-10">{loading ? 'Processing Neural Submission...' : 'Initiate Intelligence Verification'}</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
            </form>
        </div>
    );
};

export default ListProperty;
