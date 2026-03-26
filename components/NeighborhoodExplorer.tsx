
import React, { useState, useEffect, useCallback, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { House } from '../types';

interface NeighborhoodExplorerProps {
  house: House;
}

const CATEGORIES = [
  { id: 'education', label: 'Education', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z', color: 'text-indigo-600', osm_query: '["amenity"~"school|university|library"]' },
  { id: 'healthcare', label: 'Healthca...', icon: 'M19 14l-7 7-7-7m14-8l-7 7-7-7', color: 'text-rose-600', osm_query: '["amenity"~"hospital|pharmacy|doctors"]' },
  { id: 'commute', label: 'Commute', icon: 'M8 17l4 4 4-4m-4-5v9', color: 'text-amber-500', osm_query: '["highway"="bus_stop"]' },
  { id: 'food', label: 'Food an...', icon: 'M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z', color: 'text-emerald-600', osm_query: '["amenity"~"restaurant|cafe|bar"]' },
  { id: 'shopping', label: 'Shopping', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', color: 'text-sky-600', osm_query: '["shop"~"supermarket|mall"]' }
];

const NeighborhoodExplorer: React.FC<NeighborhoodExplorerProps> = ({ house }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [map, setMap] = useState<L.Map | null>(null);
  const [showLocation, setShowLocation] = useState(false);
  const [poiMarkers, setPoiMarkers] = useState<L.Marker[]>([]);
  const [isLoadingPoi, setIsLoadingPoi] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || map) return;

    const leafletMap = L.map(mapRef.current, {
      center: [house.lat, house.lng],
      zoom: 13,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(leafletMap);

    // House Marker
    const houseIcon = L.divIcon({
        className: 'custom-house-marker',
        html: '<div class="w-6 h-6 bg-[#00AEEF] border-4 border-white rounded-full shadow-lg"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    L.marker([house.lat, house.lng], { icon: houseIcon }).addTo(leafletMap);

    setMap(leafletMap);

    return () => {
      leafletMap.remove();
    };
  }, [house, map]);

  const fetchNearbyPoi = useCallback(async () => {
    if (!map || !showLocation) return;
    
    setIsLoadingPoi(true);
    // Clear old markers
    poiMarkers.forEach(m => m.remove());
    setPoiMarkers([]);

    try {
      // Overpass API Query
      const query = `[out:json];node(around:2000,${house.lat},${house.lng})${activeCategory.osm_query};out limit 10;`;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.elements) {
        const newMarkers = data.elements.map((el: any) => {
          const markerIcon = L.divIcon({
            className: 'custom-poi-marker',
            html: `<div class="w-8 h-8 bg-[#1A1F36] text-white flex items-center justify-center rounded-full border-2 border-white shadow-md font-black text-[10px] uppercase">${activeCategory.label.charAt(0)}</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          return L.marker([el.lat, el.lon], { icon: markerIcon })
            .bindPopup(`<div class="p-2 font-black text-xs uppercase text-[#0F172A]">${el.tags.name || activeCategory.label}</div>`)
            .addTo(map);
        });
        setPoiMarkers(newMarkers);
      }
    } catch (e) {
      console.error("Overpass error:", e);
    } finally {
      setIsLoadingPoi(false);
    }
  }, [map, activeCategory, house, showLocation, poiMarkers]);

  useEffect(() => {
    if (showLocation) {
        fetchNearbyPoi();
    }
  }, [activeCategory, showLocation]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${house.lat},${house.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-[56px] p-12 lg:p-20 mb-16 shadow-2xl border border-black/5 animate-in fade-in slide-in-from-bottom duration-1000 transition-all hover:shadow-[0_32px_80px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
           <h3 className="text-2xl font-black text-[#0F172A] tracking-tighter uppercase italic">
              Explore Neighbourhood - {house.location.split(',')[0]}
           </h3>
           <p className="text-gray-400 font-bold text-xs mt-2 uppercase tracking-[0.2em]">Open-source local infrastructure targets powered by OSM.</p>
        </div>
        <button 
          onClick={openInGoogleMaps}
          className="flex items-center gap-3 text-[#00AEEF] font-black text-xs uppercase tracking-[0.3em] border border-[#00AEEF]/20 px-6 py-3 rounded-2xl hover:bg-[#00AEEF]/5 transition-all group"
        >
          Open in Maps
          <svg className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      </div>

      <div className="space-y-12">
        <div className="relative aspect-video w-full rounded-[48px] overflow-hidden border border-black/5 shadow-inner bg-gray-50 bg-center bg-cover" 
             style={{ backgroundImage: !showLocation ? "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80')" : 'none' }}>
          <div ref={mapRef} className={`w-full h-full z-0 ${!showLocation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`} />

          {!showLocation && (
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] flex items-center justify-center transition-all duration-700 z-[1000]">
               <button 
                onClick={() => {
                    setShowLocation(true);
                    map?.setZoom(15);
                }}
                className="bg-[#5821E1] text-white px-12 py-5 rounded-[28px] font-black text-sm uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-[#5821E1]/40 border border-white/20"
               >
                 Click to View Location
               </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-5 gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat);
                if (!showLocation) {
                    setShowLocation(true);
                    map?.setZoom(15);
                }
              }}
              className={`flex flex-col items-center gap-6 p-8 rounded-[36px] transition-all duration-500 border ${activeCategory.id === cat.id ? 'bg-[#F8FAFC] border-[#00AEEF]/20 shadow-xl scale-105' : 'bg-transparent border-transparent hover:bg-black/[0.02]'}`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform duration-500 ${activeCategory.id === cat.id ? 'bg-[#00AEEF] text-white scale-110' : 'bg-white text-gray-300'}`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cat.icon} />
                </svg>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${activeCategory.id === cat.id ? 'text-[#0F172A]' : 'text-gray-400'}`}>
                {cat.label}
              </span>
              {isLoadingPoi && activeCategory.id === cat.id && (
                <div className="w-4 h-1 bg-[#00AEEF]/20 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-[#00AEEF] animate-progress" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodExplorer;
