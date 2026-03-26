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
import { rankProperties, detectSuspiciousListings } from './mlService';
import { supabase } from './supabaseClient';
import ListProperty from './components/ListProperty';
import AdminDashboard from './components/AdminDashboard';
import { sendAutomaticHoldingEmail } from './emailService';
import { User, House, Booking, SearchCriteria } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = sessionStorage.getItem('homesight_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [view, setView] = useState<'search' | 'details' | 'dashboard' | 'history' | 'list' | 'admin'>(() => {
    const saved = sessionStorage.getItem('homesight_view');
    return (saved as any) || 'search';
  });

  const [selectedHouse, setSelectedHouse] = useState<House | null>(() => {
    try {
      const saved = sessionStorage.getItem('homesight_selected_house');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = sessionStorage.getItem('homesight_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);
  const [isSearching, setIsSearching] = useState(() => {
    return sessionStorage.getItem('homesight_is_searching') === 'true';
  });
  const [aiTips, setAiTips] = useState<Record<string, string[]>>({});
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(() => {
    try {
      const saved = sessionStorage.getItem('homesight_search_criteria');
      return saved ? JSON.parse(saved) : {
        income: 0,
        maxPrice: 0,
        houseType: '',
        district: '',
        state: ''
      };
    } catch (e) {
      return {
        income: 0,
        maxPrice: 0,
        houseType: '',
        district: '',
        state: ''
      };
    }
  });
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  // Persistence Effects
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('homesight_user', JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem('homesight_user');
    }
  }, [currentUser]);

  useEffect(() => {
    sessionStorage.setItem('homesight_view', view);
  }, [view]);

  useEffect(() => {
    if (selectedHouse) {
      sessionStorage.setItem('homesight_selected_house', JSON.stringify(selectedHouse));
    } else {
      sessionStorage.removeItem('homesight_selected_house');
    }
  }, [selectedHouse]);

  useEffect(() => {
    sessionStorage.setItem('homesight_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    sessionStorage.setItem('homesight_is_searching', isSearching.toString());
  }, [isSearching]);

  useEffect(() => {
    sessionStorage.setItem('homesight_search_criteria', JSON.stringify(searchCriteria));
  }, [searchCriteria]);

  const fetchHouses = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('houses')
        .select('*');

      if (error) throw error;

      const roundTo500 = (num: number) => Math.round(num / 500) * 500;

      let fetched: House[] = [];
      if (data && data.length > 0) {
        fetched = data.map((h: any) => ({
          ...h,
          id: h.listing_id || h.id,
          historicalPrices: h.historical_prices && h.historical_prices.length > 0 ? h.historical_prices : [
            { year: 2023, price: roundTo500(h.price * 0.5) },
            { year: 2024, price: roundTo500((h.price * 2) / 3) },
            { year: 2025, price: roundTo500((h.price * 5) / 6) },
            { year: 2026, price: h.price }
          ],
          isApproved: h.is_approved,
          ownerId: h.owner_id
        }));
      }
      
      // Combine DB houses with Mock houses so the platform feels full
      const combined = [...fetched, ...MOCK_HOUSES.filter(mh => !fetched.some(fh => fh.id === mh.id))];
      const analyzed = await detectSuspiciousListings(combined);
      setHouses(analyzed);

      // Restore search state if refreshing while searching
      if (isSearching) {
        const query = (searchCriteria.district || '').toLowerCase().trim();
        const results = analyzed.filter((h: House) => {
          if (currentUser?.role !== 'admin' && !h.isApproved) return false;
          const priceLimit = searchCriteria.maxPrice || 2000000;
          const priceMatch = h.price <= (priceLimit + 10000);
          const typeMatch = !searchCriteria.houseType || searchCriteria.houseType === 'Any' || h.type === searchCriteria.houseType;
          const locationMatch = !query || h.location.toLowerCase().includes(query) || h.title.toLowerCase().includes(query);
          return priceMatch && typeMatch && locationMatch;
        });

        if (currentUser) {
          setFilteredHouses(rankProperties(results, currentUser));
        } else {
          setFilteredHouses(results);
        }
      }
    } catch (err) {
      console.error("Error fetching houses:", err);
      const analyzed = await detectSuspiciousListings(MOCK_HOUSES);
      setHouses(analyzed);
    } finally {
      setLoading(false);
    }
  }, [isSearching, searchCriteria, currentUser]);

  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    setView('search');
    setIsSearching(false);

    // 1. Log to history table immediately (Independent of AI tips)
    try {
      const { error: historyError } = await supabase
        .from('login_history')
        .insert({
          user_id: user.id || null, // Accepts UUID or mock ID
          email: user.email,
          ip_address: 'Logged in successfully'
        });
      
      if (historyError) {
        console.error("Could not save login history (Supabase):", historyError);
      } else {
        console.log("Login history updated successfully for:", user.email);
      }
    } catch (e) {
      console.error("Critical error saving login history:", e);
    }

    const approvedHouses = houses.filter(h => h.isApproved);
    // Relaxed initial filter (allow up to 80% of income for visibility)
    const ranked = rankProperties(approvedHouses.filter(h => h.price <= (user.income || 50000) * 0.8), user).slice(0, 15);
    setFilteredHouses(ranked);

    try {
      // 2. Fetch AI tips (Secondary)
      const tips = await getCategorizedSuggestions({
        income: user.income,
        maxPrice: user.income * 0.8,
        district: 'your area',
        houseType: 'Any',
        state: ''
      }, ranked);
      setAiTips(tips);
    } catch (e) {
      console.warn("AI Tips failed to load, continue login flow.");
    }
  };

  const handleViewDetails = (house: House) => {
    setSelectedHouse(house);
    setView('details');
  };

  const handleSearch = useCallback((criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    setIsSearching(true);

    const query = (criteria.district || '').toLowerCase().trim();
    const results = houses.filter(h => {
      if (currentUser?.role !== 'admin' && !h.isApproved) return false;
      const priceLimit = criteria.maxPrice || 2000000;
      const priceMatch = h.price <= (priceLimit + 10000);
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
  }, [currentUser, houses]);

  const handleBook = (house: House) => {
    if (!currentUser) return;

    // Send personalized email to owner
    const subject = `INQUIRY: ${house.title} - HOLDING INITIALIZATION`;
    const body = `Hi ${house.ownerName || 'Property Owner'},\n\nI am ${currentUser.name} and I am reaching out to initialize a holding for your property: "${house.title}" located in ${house.location}.\n\nI have reviewed the Neural Manifestation Analysis and Historical Delta Matrix, and I would like to proceed with the holding fee of ₹${house.price.toLocaleString()}.\n\nPlease provide me with the specific documentation requirements and next steps.\n\nBest Regards,\n${currentUser.name}\nAntigravity Intelligence Portfolio Holder`;

    window.location.href = `mailto:${house.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Try background automated dispatch
    console.log("Attempting background automated email dispatch...");
    sendAutomaticHoldingEmail(house, currentUser).then(success => {
      console.log(success ? "Automatic email sent." : "Automatic email failed (Expected on Resend Free without domain).");
    });

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
    const approvedHouses = houses.filter(h => h.isApproved);
    // Removed strict price filter to show ALL approved houses
    return rankProperties(approvedHouses, currentUser).slice(0, 20);
  }, [currentUser, isSearching, filteredHouses, view, selectedHouse, houses]);

  const updateBookingStatus = (id: string, status: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));
  };

  if (!currentUser) return <Auth onLogin={handleLogin} />;

  return (
    <div className="min-h-screen flex bg-[#F1F5F9] text-[#0F172A] selection:bg-[#00AEEF]/10">
      <Navbar
        user={currentUser}
        onNavigate={(v: any) => setView(v)}
        onLogout={() => {
          setCurrentUser(null);
          setView('search');
          sessionStorage.removeItem('homesight_user');
          sessionStorage.removeItem('homesight_view');
          sessionStorage.removeItem('homesight_selected_house');
        }}
        currentView={view}
        isOpen={isNavbarOpen}
        onClose={() => setIsNavbarOpen(false)}
      />

      <main className="flex-1 min-w-0 overflow-y-auto px-6 py-12 md:px-16 md:py-16 scroll-smooth">
        {/* Mobile Sidebar Toggle Overlay */}
        <div className="flex items-center justify-between md:justify-end mb-8">
          <button
            onClick={() => setIsNavbarOpen(true)}
            className="md:hidden p-3 rounded-2xl bg-[#E2E8F0] border border-black/5 text-gray-400 hover:text-[#00AEEF] transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>

        {view === 'search' && (
          <div className="max-w-7xl mx-auto space-y-20 animate-in fade-in duration-500">
            <SearchFilters onSearch={handleSearch} initialCriteria={searchCriteria} />

            <section className="space-y-12">
              <div className="flex items-end justify-between px-2">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-[#0F172A] uppercase">
                    {isSearching ? 'Strategic Matches' : 'Market Recommendations'}
                  </h2>
                  <p className="text-[#00AEEF] font-black text-xs mt-3 uppercase tracking-[0.3em]">Analyzed by our intelligence model for your portfolio.</p>
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
              houses={houses}
              user={currentUser}
              onViewHouse={handleViewDetails}
              onUpdateStatus={updateBookingStatus}
              onNavigate={(v: any) => setView(v)}
            />
          )}
          {view === 'history' && (
            <History
              bookings={bookings}
              houses={houses}
              onViewHouse={handleViewDetails}
              onNavigate={(v: any) => setView(v)}
            />
          )}

          {view === 'list' && currentUser && (
            <ListProperty
              user={currentUser}
              onSuccess={() => { fetchHouses(); setView('search'); }}
              onBack={() => setView('search')}
            />
          )}

          {view === 'admin' && currentUser?.role === 'admin' && (
            <AdminDashboard
              pendingHouses={houses.filter(h => !h.isApproved && !h.id.toString().startsWith('listing_'))}
              onAction={() => fetchHouses()}
            />
          )}
        </div>

        <ChatAI contextHouses={currentDisplayHouses} user={currentUser} />
      </main>
    </div>
  );
};

export default App;