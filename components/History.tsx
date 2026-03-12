import React from 'react';
import { Booking, House } from '../types';

interface HistoryProps {
  bookings: Booking[];
  houses: House[];
  onViewHouse: (house: House) => void;
  onNavigate: (view: any) => void;
}

const History: React.FC<HistoryProps> = ({ bookings, houses, onViewHouse, onNavigate }) => {
  const historyBookings = bookings.filter((b: Booking) => b.status === 'Cancelled' || b.status === 'Completed');

  return (
    <div className="max-w-6xl mx-auto py-16 px-6 animate-in fade-in duration-1000 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-10">
        <div>
          <h1 className="text-5xl font-black text-[#0F172A] tracking-tight uppercase">Activity Matrix</h1>
          <p className="text-[10px] text-[#00AEEF] font-black uppercase tracking-[0.4em] mt-4 border-l-2 border-[#00AEEF] pl-4">Historical Holding Logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {historyBookings.length === 0 ? (
          <div className="col-span-full bg-[#F8FAFC] rounded-[48px] border border-black/5 p-24 text-center shadow-xl flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center mb-10 text-[#00AEEF] border border-black/5 shadow-lg">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-400 font-black mb-12 uppercase tracking-[0.4em] text-[10px]">Zero historical records detected in your orbit.</p>
            <button
              onClick={() => onNavigate('search')}
              className="bg-gradient-to-r from-[#00AEEF] to-[#0077B6] text-white px-14 py-5 rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] hover:scale-105 transition-all shadow-lg shadow-[#00AEEF]/20 active:scale-95"
            >
              Initialize Exploration
            </button>
          </div>
        ) : (
          historyBookings.map((booking: Booking) => {
            const house = houses.find((h: House) => h.id === booking.houseId);
            if (!house) return null;

            const isCancelled = booking.status === 'Cancelled';

            return (
              <div
                key={booking.id}
                className="bg-[#F8FAFC] rounded-[40px] p-8 border border-black/5 flex items-center gap-8 hover:border-[#00AEEF]/30 transition-all group shadow-xl cursor-pointer"
                onClick={() => onViewHouse(house)}
              >
                <div className="w-28 h-28 rounded-[28px] overflow-hidden shrink-0 grayscale-[20%] group-hover:grayscale-0 transition-all border border-black/5 group-hover:scale-105 duration-700">
                  <img src={house.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border ${isCancelled ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-[#00AEEF]/5 text-[#00AEEF] border-[#00AEEF]/10'}`}>
                      {booking.status}
                    </span>
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{booking.bookingDate}</span>
                  </div>
                  <h4 className="font-black text-[#0F172A] text-lg truncate group-hover:text-[#00AEEF] transition-colors mb-2 uppercase tracking-tight">
                    {house.title}
                  </h4>
                  <p className="text-[#00AEEF] font-black text-xs uppercase tracking-widest mb-2">₹{house.price.toLocaleString()} / Units</p>
                  <p className="text-[9px] text-gray-400 font-black truncate tracking-[0.2em] uppercase">{house.district}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
