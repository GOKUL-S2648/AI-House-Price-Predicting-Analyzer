
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { House } from '../types';

interface MapViewProps {
  houses: House[];
  onHouseClick: (house: House) => void;
  selectedHouseId?: string;
}

const MapView: React.FC<MapViewProps> = ({ houses, onHouseClick, selectedHouseId }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(mapRef.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Fix: Access markers by key to avoid "unknown" type inference
    Object.keys(markersRef.current).forEach(id => {
      const marker = markersRef.current[id];
      if (marker) {
        marker.remove();
      }
    });
    markersRef.current = {};

    if (houses.length === 0) return;

    const bounds = L.latLngBounds([]);

    houses.forEach(house => {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="custom-price-marker ${selectedHouseId === house.id ? '!bg-[#1A1F36] !scale-110' : ''}">₹${(house.price / 1000).toFixed(1)}k</div>`,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      });

      const marker = L.marker([house.lat, house.lng], { icon })
        .addTo(mapRef.current!)
        .on('click', () => onHouseClick(house));
      
      markersRef.current[house.id] = marker;
      bounds.extend([house.lat, house.lng]);
    });

    if (houses.length > 0) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [houses, selectedHouseId, onHouseClick]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-[32px] border border-gray-100 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {houses.length > 0 && (
        <div className="absolute top-6 left-6 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#3046D1]">
            Showing {houses.length} Results
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;
