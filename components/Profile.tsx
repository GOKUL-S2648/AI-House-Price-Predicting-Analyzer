
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
  const terms = [
    { type: 'PG / Shared Living', oneBhk: '₹5,000', twoBhk: '₹7,000' },
    { type: 'Apartment', oneBhk: '₹6,000', twoBhk: '₹8,000' },
    { type: 'Estate / Villa', oneBhk: '₹7,000', twoBhk: '₹8,500' },
    { type: 'Individual House', oneBhk: '₹5,500', twoBhk: '₹7,500' },
    { type: 'Studio Space', oneBhk: '₹7,000', twoBhk: '₹9,000' },
  ];

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
          <h1 className="text-5xl font-black text-[#0F172A] mt-8 uppercase tracking-tighter">User <span className="text-[#00AEEF]">Profile.</span></h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
             <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-xl flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-4 border-[#00AEEF]/10 p-1 mb-6">
                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=F1F5F9&color=00AEEF&bold=true&size=128`} alt={user.name} className="w-full h-full rounded-full" />
                </div>
                <h3 className="text-xl font-black text-[#0F172A] uppercase tracking-tight">{user.name}</h3>
                <p className="text-[#00AEEF] font-black text-[10px] uppercase tracking-[0.2em] mt-2">{user.role || 'Verified User'}</p>
                <div className="w-full h-px bg-black/5 my-6"></div>
                <div className="w-full space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Portfolio Status</span>
                        <span className="text-emerald-500">Active</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Member Since</span>
                        <span className="text-[#0F172A]">2026</span>
                    </div>
                </div>
             </div>
        </div>

        <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00AEEF]/5 rounded-bl-full"></div>
                
                <h2 className="text-2xl font-black text-[#0F172A] uppercase tracking-tight mb-8">Terms & <span className="text-[#00AEEF]">Conditions.</span></h2>
                
                <div className="space-y-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                        Standardized pricing guidelines for new property listings. All submissions must adhere to the neural valuation matrix below:
                    </p>

                    <div className="overflow-hidden rounded-3xl border border-black/5 mt-8">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F8FAFC]">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">Listing Category</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-[#00AEEF] uppercase tracking-[0.2em]">1 BHK Limit</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-[#00AEEF] uppercase tracking-[0.2em]">2 BHK Limit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {terms.map((term, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5 text-xs font-black text-[#0F172A] uppercase tracking-tight">{term.type}</td>
                                        <td className="px-6 py-5 text-xs font-black text-slate-500">{term.oneBhk}</td>
                                        <td className="px-6 py-5 text-xs font-black text-slate-500">{term.twoBhk}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-[#00AEEF]/5 p-6 rounded-2xl border border-[#00AEEF]/10 mt-8">
                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-[#00AEEF] flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <p className="text-[10px] font-black text-[#0077B6] uppercase tracking-widest leading-[1.6]">
                                Note: These prices represent the minimum intelligence benchmarks. Premium amenities and neural upgrades may allow for delta adjustments in the final valuation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
