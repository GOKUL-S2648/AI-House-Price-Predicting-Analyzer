
import React from 'react';
import { Booking, House } from '../types';

interface DashboardProps {
  bookings: Booking[];
  houses: House[];
  onViewHouse: (house: House) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ bookings, houses, onViewHouse, onUpdateStatus, onNavigate }) => {
  const activeBookings = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending');

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in duration-700 space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-[#1A1F36] tracking-tight">User Dashboard</h2>
          <p className="text-gray-400 font-bold text-sm mt-1">Manage your housing applications and digital bookings.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Bookings</p>
            <p className="text-xl font-black text-[#3046D1]">{activeBookings.length}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
            <p className="text-xl font-black text-green-600">Active</p>
          </div>
        </div>
      </header>

      <section>
        <h3 className="text-xl font-black text-[#1A1F36] mb-8">Your Recent Bookings</h3>

        <div className="space-y-6">
          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 text-gray-200">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-bold text-xl mb-6">No bookings yet. Start your search to find your next home!</p>
              <button
                onClick={() => onNavigate('search')}
                className="bg-[#3046D1] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-50"
              >
                Find Affordable Homes
              </button>
            </div>
          ) : (
            activeBookings.map(booking => {
              const house = houses.find(h => h.id === booking.houseId);
              if (!house) return null;

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row overflow-hidden hover:border-indigo-100 transition-colors"
                >
                  <div className="md:w-64 h-48 md:h-auto shrink-0 bg-gray-50">
                    <img src={house.image} alt={house.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h4 className="text-2xl font-black text-[#1A1F36] mb-2">{house.title}</h4>
                        <p className="text-gray-400 font-bold text-sm">₹ {house.price.toLocaleString()} • Applied on {booking.bookingDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full border border-green-100">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          <span className="text-xs font-black uppercase tracking-widest">{booking.status}</span>
                        </div>
                        <button
                          onClick={() => onUpdateStatus(booking.id, 'Cancelled')}
                          className="bg-red-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-md hover:bg-red-700 transition-all active:scale-95"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => onViewHouse(house)}
                          className="p-2 text-gray-300 hover:text-[#3046D1] transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-50 flex justify-end">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold">Contact: <span className="text-gray-600">+91 98765 43210</span></p>
                        <p className="text-[10px] text-gray-400 font-bold">Support: <span className="text-gray-600">support@affordhome.ai</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
};

export default Dashboard;