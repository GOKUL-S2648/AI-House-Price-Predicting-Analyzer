import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_HOUSES } from './constants';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import SearchFilters from './components/SearchFilters';
import HouseCard from './components/HouseCard';
import HouseDetails from './components/HouseDetails';
import Dashboard from './components/Dashboard';
import History from './components/History';
import ChatAI from './components/ChatAI';
import { getCategorizedSuggestions } from './geminiService';
import { rankProperties } from './mlService';
import { User, House, Booking, SearchCriteria } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'search' | 'details' | 'dashboard' | 'history'>('search');
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiTips, setAiTips] = useState<Record<string, string[]>>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    income: 0,
    maxPrice: 0,
    houseType: '',
    district: '',
    state: ''
  });

  // Persist bookings
  useEffect(() => {
    const saved = localStorage.getItem('homesight_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load bookings", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('homesight_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Dark mode toggle effect
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    setView('search');
    setIsSearching(false);

    const initialIncome = user.income || 50000;
    const ranked = rankProperties(MOCK_HOUSES.filter(h => h.price <= initialIncome * 0.5), user).slice(0, 15);
    setFilteredHouses(ranked);

    try {
      const tips = await getCategorizedSuggestions({
        income: user.income,
        maxPrice: user.income * 0.5,
        district: 'your area',
        houseType: 'Any',
        state: ''
      }, ranked);
      setAiTips(tips);
    } catch (e) { }
  };

  const handleViewDetails = (house: House) => {
    setSelectedHouse(house);
    setView('details');
  };

  const handleSearch = useCallback((criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    setIsSearching(true);

    const query = (criteria.district || '').toLowerCase().trim();
    const results = MOCK_HOUSES.filter(h => {
      const priceLimit = criteria.maxPrice || 1000000;
      const priceMatch = h.price <= (priceLimit + 5000);
      const typeMatch = !criteria.houseType || criteria.houseType === 'Any' || h.type === criteria.houseType;
      const locationMatch = !query || h.location.toLowerCase().includes(query) || h.title.toLowerCase().includes(query);
      return priceMatch && typeMatch && locationMatch;
    });

    if (currentUser) {
      setFilteredHouses(rankProperties(results, currentUser));
    } else {
      setFilteredHouses(results);
    }
    setView('search');
  }, [currentUser]);

  const handleBook = (house: House) => {
    if (!currentUser) return;
    const newBooking: Booking = {
      id: `book_${Date.now()}`,
      houseId: house.id,
      userId: currentUser.id,
      bookingDate: new Date().toLocaleDateString(),
      status: 'Confirmed'
    };
    setBookings(prev => [newBooking, ...prev]);
    setView('dashboard');
  };

  const currentDisplayHouses = useMemo(() => {
    if (!currentUser) return [];
    if (view === 'details' && selectedHouse) return [selectedHouse];
    if (isSearching) return filteredHouses;
    return rankProperties(MOCK_HOUSES.filter(h => h.price <= (currentUser.income || 50000) * 0.45), currentUser).slice(0, 12);
  }, [currentUser, isSearching, filteredHouses, view, selectedHouse]);

  const updateBookingStatus = (id: string, status: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
  };

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-[#1E1B4B]'}`}>
      <Navbar
        user={currentUser}
        onNavigate={(v: any) => setView(v)}
        onLogout={() => setCurrentUser(null)}
        currentView={view}
      />

      <main className="flex-1 overflow-y-auto px-6 py-12 md:px-16 md:py-20 scroll-smooth">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-slate-400 shadow-sm'}`}
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>
        </div>

        {view === 'search' && (
          <div className="max-w-7xl mx-auto space-y-20 animate-in fade-in duration-500">
            <SearchFilters onSearch={handleSearch} initialCriteria={searchCriteria} />

            <section className="space-y-12">
              <div className="flex items-end justify-between px-2">
                <div>
                  <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E1B4B]'}`}>
                    {isSearching ? 'Personalized Matches' : 'Market Recommendations'}
                  </h2>
                  <p className="text-gray-400 font-bold text-lg mt-2">Ranked by our intelligence model for your profile.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {currentDisplayHouses.map(house => (
                  <HouseCard key={house.id} house={house} onClick={() => handleViewDetails(house)} user={currentUser} />
                ))}
              </div>
            </section>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          {view === 'details' && selectedHouse && (
            <HouseDetails
              house={selectedHouse}
              user={currentUser}
              onBack={() => setView('search')}
              onBook={() => handleBook(selectedHouse)}
            />
          )}
          {view === 'dashboard' && (
            <Dashboard
              bookings={bookings}
              houses={MOCK_HOUSES}
              onViewHouse={handleViewDetails}
              onUpdateStatus={updateBookingStatus}
              onNavigate={(v: any) => setView(v)}
            />
          )}
          {view === 'history' && (
            <History
              bookings={bookings}
              houses={MOCK_HOUSES}
              onViewHouse={handleViewDetails}
              onNavigate={(v: any) => setView(v)}
            />
          )}
        </div>

        <ChatAI contextHouses={currentDisplayHouses} user={currentUser} />
      </main>
    </div>
  );
};

export default App;