import React from 'react';
import { Booking, House, User } from '../types';
import Alerts from './Alerts';
import RiskZoneMap from './RiskZoneMap';

interface DashboardProps {
  bookings: Booking[];
  houses: House[];
  user: User;
  onViewHouse: (house: House) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookings, houses, user, onViewHouse, onUpdateStatus, onNavigate }) => {
  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in duration-700 space-y-12 text-[#0F172A]">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/5">
        <div>
          <h2 className="text-4xl font-black text-[#0F172A] tracking-tight uppercase">User Terminal</h2>
          <p className="text-gray-400 font-black text-xs mt-3 uppercase tracking-[0.4em]">Manage your premium holdings and digital reservations.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#F8FAFC] px-8 py-4 rounded-3xl shadow-sm border border-black/5 text-center backdrop-blur-md">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Portfolio</p>
            <p className="text-2xl font-black text-[#00AEEF] uppercase">{activeBookings.length} Active</p>
          </div>
          <div className="bg-[#F8FAFC] px-8 py-4 rounded-3xl shadow-sm border border-black/5 text-center backdrop-blur-md">
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Network</p>
            <p className="text-2xl font-black text-[#00AEEF] uppercase">Live</p>
          </div>
        </div>
      </header>

      <section>
        <h3 className="text-[12px] font-black text-gray-400 mb-8 uppercase tracking-[0.4em]">Recent Manifestations</h3>

        <div className="space-y-8">
          {activeBookings.length === 0 ? (
            <div className="bg-[#F8FAFC] rounded-[48px] border-2 border-dashed border-black/5 p-24 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mb-8 text-gray-300 shadow-sm">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-black text-xl mb-10 max-w-md uppercase tracking-tight">Your portfolio is currently blank. Initialize your orbit.</p>
              <button
                onClick={() => onNavigate('search')}
                className="bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white px-14 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-lg shadow-[#00AEEF]/20"
              >
                Access Global Index
              </button>
            </div>
          ) : (
            activeBookings.map(booking => {
              const house = houses.find(h => h.id === booking.houseId);
              if (!house) return null;

              return (
                <div
                  key={booking.id}
                  className="bg-[#F8FAFC] rounded-[40px] shadow-xl border border-black/5 flex flex-col md:flex-row overflow-hidden hover:border-[#00AEEF]/30 transition-all duration-500 group"
                >
                  <div className="md:w-72 h-56 md:h-auto shrink-0 bg-gray-100 overflow-hidden">
                    <img src={house.image} alt={house.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                  </div>

                  <div className="p-10 flex-1 flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div>
                        <h4 className="text-2xl font-black text-[#0F172A] mb-2 uppercase tracking-tight">{house.title}</h4>
                        <p className="text-[#00AEEF] font-black text-xs uppercase tracking-[0.2em]">₹ {house.price.toLocaleString()} • Logged {booking.bookingDate}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#00AEEF]/5 text-[#00AEEF] px-5 py-2.5 rounded-full border border-[#00AEEF]/10">
                          <div className="w-2 h-2 rounded-full bg-[#00AEEF] animate-pulse"></div>
                          <span className="text-xs font-black uppercase tracking-[0.2em]">{booking.status}</span>
                        </div>
                        <button
                          onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                          className="bg-rose-50 text-rose-500 border border-rose-100 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                        >
                          Terminate
                        </button>
                        <button
                          onClick={() => onViewHouse(house)}
                          className="p-3 bg-white rounded-xl text-gray-300 hover:text-[#00AEEF] shadow-sm border border-black/5 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-black/5 flex justify-end">
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Protocol: <span className="text-[#00AEEF]">Properly Intelligence</span></p>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Encryption: <span className="text-emerald-500">Active</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section>
        <div className="mb-10">
          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[0.4em]">Intelligence Transparency</h3>
          <p className="text-gray-400 font-black text-xs mt-2 uppercase tracking-[0.2em]">Neural detection of market anomalies and risk-weighted listings.</p>
        </div>

        {houses.some(h => h.is_suspicious || h.is_overpriced) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {houses.filter(h => h.is_suspicious || h.is_overpriced).map(house => (
              <div key={house.id} className="relative group">
                <div className={`absolute -top-4 -right-2 z-20 px-4 py-2 rounded-xl text-xs font-black shadow-xl ring-4 ring-white uppercase tracking-[0.3em] ${house.is_suspicious ? 'bg-rose-600 text-white' : 'bg-[#00AEEF] text-white'}`}>
                  {house.is_suspicious ? 'Suspect Flag' : 'Market Divergence'}
                </div>
                <div className="opacity-90 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
                  <div
                    onClick={() => onViewHouse(house)}
                    className="bg-[#F8FAFC] rounded-[40px] overflow-hidden border border-black/5 shadow-xl p-6 cursor-pointer group-hover:border-[#00AEEF]/30 transition-colors"
                  >
                    <div className="aspect-video rounded-[24px] overflow-hidden mb-6">
                      <img src={house.image} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <h4 className="font-black text-sm text-[#0F172A] truncate uppercase tracking-tight">{house.title}</h4>
                    <p className="text-[#00AEEF] mt-2 font-black text-xs uppercase tracking-widest">VALUATION: ₹{house.price.toLocaleString()}</p>
                    <div className={`mt-5 p-3 rounded-2xl text-xs font-black uppercase tracking-widest leading-relaxed ${house.is_suspicious ? 'bg-rose-50 text-rose-600' : 'bg-[#00AEEF]/5 text-[#00AEEF]'}`}>
                      Anomaly: {house.suspicious_reason}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#00AEEF]/5 rounded-[48px] p-12 border border-[#00AEEF]/10 flex items-center gap-10 backdrop-blur-md transition-all hover:bg-[#00AEEF]/10 group">
            <div className="w-16 h-16 bg-white rounded-[32px] shadow-lg flex items-center justify-center text-[#00AEEF] shrink-0 border border-black/5 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-[#00AEEF] font-black text-sm uppercase tracking-[0.4em]">Market Equilibrium Secured</p>
              <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mt-2">Properly Neural Engine reports 0% high-risk price anomalies in current liquidity.</p>
            </div>
          </div>
        )}
      </section>

      <section className="pt-12 border-t border-gray-100">
        <RiskZoneMap houses={houses} />
      </section>
    </div>
  );
};

export default Dashboard;