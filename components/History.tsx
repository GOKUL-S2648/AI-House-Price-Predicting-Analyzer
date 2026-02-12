
import React from 'react';

const History = ({ bookings, houses, onViewHouse, onNavigate }) => {
  const historyBookings = bookings.filter(b => b.status === 'Cancelled' || b.status === 'Completed');

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in duration-700 space-y-12">
      <div>
        <h1 className="text-[48px] font-black text-[#1A1F36] tracking-tighter mb-2">ACTIVITY HISTORY</h1>
        <div className="h-1.5 w-20 bg-[#3046D1]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {historyBookings.length === 0 ? (
          <div className="col-span-full bg-white rounded-[32px] border-2 border-dashed border-gray-100 p-20 text-center shadow-sm flex flex-col items-center">
             <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            <p className="text-gray-400 font-bold mb-6">No historical records found.</p>
            <button 
              onClick={() => onNavigate('search')}
              className="bg-[#3046D1] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              Explore Homes
            </button>
          </div>
        ) : (
          historyBookings.map(booking => {
            const house = houses.find(h => h.id === booking.houseId);
            if (!house) return null;

            const isCancelled = booking.status === 'Cancelled';

            return (
              <div 
                key={booking.id} 
                className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center gap-5 hover:border-blue-100 transition-all group shadow-sm hover:shadow-md cursor-pointer"
                onClick={() => onViewHouse(house)}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all">
                  <img src={house.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${isCancelled ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                      {booking.status}
                    </span>
                    <span className="text-[10px] text-gray-300 font-bold">{booking.bookingDate}</span>
                  </div>
                  <h4 className="font-bold text-[#1A1F36] text-sm truncate group-hover:text-[#3046D1] transition-colors">
                    {house.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-medium">₹{house.price.toLocaleString()} / mo</p>
                  <p className="text-[10px] text-gray-300 font-bold truncate mt-1">{house.district}</p>
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
