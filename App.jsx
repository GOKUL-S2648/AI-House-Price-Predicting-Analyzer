
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MOCK_HOUSES } from './constants.js';
import Auth from './components/Auth.jsx';
import Navbar from './components/Navbar.jsx';
import SearchFilters from './components/SearchFilters.jsx';
import HouseCard from './components/HouseCard.jsx';
import HouseDetails from './components/HouseDetails.jsx';
import Dashboard from './components/Dashboard.jsx';
import History from './components/History.jsx';
import ChatAI from './components/ChatAI.jsx';
import { getCategorizedSuggestions } from './geminiService.js';
import { rankProperties } from './mlService.js';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('search');
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiTips, setAiTips] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [searchCriteria, setSearchCriteria] = useState({
    income: 0,
    maxPrice: 0,
    houseType: '',
    district: '', 
    state: ''
  });

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
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleLogin = async (user) => {
    setCurrentUser(user);
    setView('search');
    setIsSearching(false);
    
    const ranked = rankProperties(MOCK_HOUSES.filter(h => h.price <= (user.income || 50000) * 0.5), user).slice(0, 15);
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
    } catch (e) {}
  };

  const handleViewDetails = (house) => {
    setSelectedHouse(house);
    setView('details');
  };

  const handleSearch = useCallback((criteria) => {
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

  const handleBook = (house) => {
    if (!currentUser) return;
    const newBooking = {
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

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] flex transition-colors duration-300">
      <Navbar user={currentUser} onNavigate={(v) => setView(v)} onLogout={() => setCurrentUser(null)} currentView={view} />
      
      <main className="flex-1 overflow-y-auto px-6 py-12 md:px-16 md:py-20 scroll-smooth">
        {view === 'search' && (
          <div className="max-w-7xl mx-auto space-y-20 animate-in fade-in duration-500">
            <SearchFilters onSearch={handleSearch} initialCriteria={searchCriteria} />
            
            <section className="space-y-12">
              <div className="flex items-end justify-between px-2">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-[#1E1B4B]">
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
            <HouseDetails house={selectedHouse} user={currentUser} onBack={() => setView('search')} onBook={() => handleBook(selectedHouse)} />
          )}
          {view === 'dashboard' && (
            <Dashboard bookings={bookings} houses={MOCK_HOUSES} onViewHouse={handleViewDetails} onUpdateStatus={(id, s) => setBookings(prev => prev.map(b => b.id === id ? {...b, status: s} : b))} onNavigate={(v) => setView(v)} />
          )}
          {view === 'history' && (
            <History bookings={bookings} houses={MOCK_HOUSES} onViewHouse={handleViewDetails} onNavigate={(v) => setView(v)} />
          )}
        </div>

        <ChatAI contextHouses={currentDisplayHouses} user={currentUser} />
      </main>
    </div>
  );
};

export default App;
