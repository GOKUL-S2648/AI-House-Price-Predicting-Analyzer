import React from 'react';
import { supabase } from '../supabaseClient';
import { House } from '../types';

interface AdminDashboardProps {
    pendingHouses: House[];
    onAction: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ pendingHouses, onAction }) => {
    const handleApprove = async (id: string, dbId?: string) => {
        try {
            // Find the actual database ID if the current id is the listing_id
            const { error } = await supabase
                .from('houses')
                .update({ is_approved: true })
                .or(`listing_id.eq.${id},id.eq.${id}`);

            if (error) throw error;
            onAction();
        } catch (err: any) {
            alert(`Error approving: ${err.message}`);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to reject and delete this listing?')) return;
        try {
            const { error } = await supabase
                .from('houses')
                .delete()
                .or(`listing_id.eq.${id},id.eq.${id}`);

            if (error) throw error;
            onAction();
        } catch (err: any) {
            alert(`Error rejecting: ${err.message}`);
        }
    };

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-end justify-between px-4 border-b border-black/5 pb-10">
                <div>
                    <h2 className="text-5xl font-black tracking-tight text-[#0F172A] uppercase">Neural Panel</h2>
                    <p className="text-[#00AEEF] font-black text-[10px] uppercase tracking-[0.4em] mt-4">
                        {pendingHouses.length} units awaiting intelligence verification.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {pendingHouses.length === 0 ? (
                    <div className="bg-[#F8FAFC] p-24 rounded-[56px] text-center border border-black/5 shadow-xl">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-10 text-[#00AEEF] border border-black/5 shadow-lg">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-3xl font-black text-[#0F172A] uppercase tracking-tight">Ecosystem Synchronized</h3>
                        <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Zero items pending verification.</p>
                    </div>
                ) : (
                    pendingHouses.map(house => (
                        <div key={house.id} className="bg-[#F8FAFC] p-10 rounded-[56px] border border-black/5 shadow-xl flex flex-col lg:flex-row gap-12 items-center group hover:border-[#00AEEF]/30 transition-all duration-700">
                            <div className="w-full lg:w-80 space-y-4 shrink-0">
                                <div className="h-64 rounded-[40px] overflow-hidden border border-black/5">
                                    <img src={house.image} alt={house.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                                </div>
                                {house.images && house.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {house.images.slice(1).map((img, idx) => (
                                            <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-black/5 shrink-0">
                                                <img src={img} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-6">
                                    <span className="bg-[#00AEEF]/5 text-[#00AEEF] px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] border border-[#00AEEF]/10">{house.type}</span>
                                    <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase">ID: {house.id}</span>
                                </div>
                                <h3 className="text-4xl font-black text-[#0F172A] tracking-tight uppercase leading-tight">{house.title}</h3>
                                <div className="text-gray-400 font-black flex items-center gap-3 text-[11px] uppercase tracking-widest leading-none">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#00AEEF] shadow-sm border border-black/5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                    </div>
                                    {house.location}
                                </div>
                                <p className="text-[#00AEEF] font-black text-3xl tracking-tighter">₹{house.price.toLocaleString()} <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] pl-4">Liquidity Units/Mo</span></p>
                                <div className="pt-8 flex flex-wrap gap-8">
                                    <button
                                        onClick={() => handleApprove(house.id)}
                                        className="px-14 py-5 bg-gradient-to-r from-[#00AEEF] to-[#0077B6] hover:scale-105 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-[#00AEEF]/20 transition-all active:scale-95"
                                    >
                                        Deploy Manifestation
                                    </button>
                                    <button
                                        onClick={() => handleReject(house.id)}
                                        className="px-14 py-5 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border border-black/5 hover:border-rose-100 shadow-sm transition-all active:scale-95"
                                    >
                                        Purge Log
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
