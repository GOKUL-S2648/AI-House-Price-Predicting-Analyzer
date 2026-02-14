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
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-end justify-between px-2">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-[#1E1B4B] dark:text-white">Admin Approval Panel</h2>
                    <p className="text-gray-400 font-bold text-lg mt-2">
                        {pendingHouses.length} properties awaiting review.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {pendingHouses.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 p-12 rounded-[32px] text-center shadow-xl">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 text-3xl">✅</div>
                        <h3 className="text-2xl font-black text-[#1E1B4B] dark:text-white">All Clear!</h3>
                        <p className="text-gray-400 font-bold">No properties currently pending approval.</p>
                    </div>
                ) : (
                    pendingHouses.map(house => (
                        <div key={house.id} className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-xl flex flex-col md:flex-row gap-8 items-center">
                            <img src={house.image} alt={house.title} className="w-full md:w-64 h-48 object-cover rounded-2xl" />

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{house.type}</span>
                                    <span className="text-xs font-bold text-gray-400">ID: {house.id}</span>
                                </div>
                                <h3 className="text-2xl font-black text-[#1E1B4B] dark:text-white">{house.title}</h3>
                                <p className="text-gray-500 font-bold">{house.location}</p>
                                <p className="text-indigo-600 font-black text-xl">₹{house.price.toLocaleString()}/mo</p>
                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => handleApprove(house.id)}
                                        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
                                    >
                                        Approve Listing
                                    </button>
                                    <button
                                        onClick={() => handleReject(house.id)}
                                        className="px-8 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl font-bold transition-all"
                                    >
                                        Reject
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
