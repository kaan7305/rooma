'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, X } from 'lucide-react';
import { type Property } from '@/data/properties';

interface PropertyMapProps {
  properties: Property[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter properties with coordinates
  const propertiesWithCoords = properties.filter(p => p.lat && p.lng);

  // Calculate map center
  const centerLat = propertiesWithCoords.length > 0
    ? propertiesWithCoords.reduce((sum, p) => sum + (p.lat || 0), 0) / propertiesWithCoords.length
    : 40.7128;
  const centerLng = propertiesWithCoords.length > 0
    ? propertiesWithCoords.reduce((sum, p) => sum + (p.lng || 0), 0) / propertiesWithCoords.length
    : -74.0060;

  // Google Maps URL with markers
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&center=${centerLat},${centerLng}&zoom=12`;

  return (
    <div className="relative h-[700px] bg-gray-100 rounded-2xl shadow-xl overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
          className="grayscale-[20%]"
        ></iframe>
      </div>

      {/* Price Markers Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {propertiesWithCoords.map((property) => {
          // Convert lat/lng to approximate pixel position (simplified)
          const latRange = 0.1; // Approximate degrees visible
          const lngRange = 0.15;
          const top = ((centerLat + latRange / 2 - (property.lat || centerLat)) / latRange) * 100;
          const left = (((property.lng || centerLng) - (centerLng - lngRange / 2)) / lngRange) * 100;

          const isHovered = hoveredProperty === property.id;
          const isSelected = selectedProperty?.id === property.id;

          return (
            <button
              key={property.id}
              onClick={() => setSelectedProperty(property)}
              onMouseEnter={() => setHoveredProperty(property.id)}
              onMouseLeave={() => setHoveredProperty(null)}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
              style={{
                top: `${Math.max(10, Math.min(90, top))}%`,
                left: `${Math.max(10, Math.min(90, left))}%`,
                zIndex: isHovered || isSelected ? 50 : 10,
              }}
            >
              <div
                className={`px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg transition-all duration-200 ${
                  isHovered || isSelected
                    ? 'bg-black text-white scale-110 shadow-2xl'
                    : 'bg-white text-black hover:shadow-xl'
                }`}
              >
                ${property.price.toLocaleString()}
              </div>
              {isHovered && !isSelected && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-black"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Property Card Preview */}
      {selectedProperty && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[60] pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-[320px] animate-slide-up-fade">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-black" />
            </button>
            <Link href={`/properties/${selectedProperty.id}`} className="block group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-black line-clamp-1 group-hover:text-rose-600 transition-colors">
                    {selectedProperty.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-black">{selectedProperty.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-black mb-3">{selectedProperty.location}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-black">
                    ${selectedProperty.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-black">/month</span>
                </div>
                <p className="text-xs text-emerald-600 font-medium mt-1">{selectedProperty.available}</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-3 pointer-events-auto">
        <p className="text-xs font-semibold text-black mb-2">
          {propertiesWithCoords.length} properties shown
        </p>
        <div className="flex items-center gap-2 text-xs text-black">
          <div className="w-3 h-3 bg-white border-2 border-black rounded-full"></div>
          <span>Click pin to view</span>
        </div>
      </div>
    </div>
  );
}
