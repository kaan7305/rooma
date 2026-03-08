'use client';

import { useState, useEffect, useMemo } from 'react';
import { allProperties, type Property } from '@/data/properties';
import { useMapStore, mockAmenities, type Amenity } from '@/lib/map-store';
import {
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Maximize2,
  X,
  Filter,
  Layers,
  Search,
  Navigation,
  GraduationCap,
  Bus,
  ShoppingCart,
  Coffee,
  Dumbbell,
  Edit3,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InteractiveMap() {
  const router = useRouter();
  const {
    center,
    zoom,
    selectedPropertyId,
    showAmenities,
    amenityTypes,
    filters,
    drawnArea,
    setCenter,
    setZoom,
    setSelectedProperty,
    toggleAmenities,
    setAmenityTypes,
    setFilters,
    setDrawnArea,
    clearFilters,
  } = useMapStore();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);
  const [mapElement, setMapElement] = useState<HTMLDivElement | null>(null);

  // Filter properties based on current filters and drawn area
  const filteredProperties = useMemo(() => {
    return allProperties.filter((property) => {
      // Price filter
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false;
      }

      // Beds filter
      if (filters.beds.length > 0 && !filters.beds.includes(property.beds)) {
        return false;
      }

      // Property type filter
      if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.type)) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every((amenity) =>
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      // Drawn area filter
      if (drawnArea && drawnArea.length > 0 && property.lat && property.lng) {
        const isInside = isPointInPolygon([property.lat, property.lng], drawnArea);
        if (!isInside) return false;
      }

      return true;
    });
  }, [filters, drawnArea]);

  // Point in polygon algorithm
  const isPointInPolygon = (point: [number, number], polygon: [number, number][]): boolean => {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  // Calculate map bounds to fit all filtered properties
  const fitBounds = () => {
    if (filteredProperties.length === 0) return;

    const lats = filteredProperties.filter(p => p.lat).map(p => p.lat!);
    const lngs = filteredProperties.filter(p => p.lng).map(p => p.lng!);

    if (lats.length === 0) return;

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    setCenter([centerLat, centerLng]);
    setZoom(11);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !mapElement) return;

    const rect = mapElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel coordinates to lat/lng (simplified conversion)
    const lng = ((x / rect.width) * 360) - 180 + center[1];
    const lat = (((rect.height - y) / rect.height) * 180) - 90 + center[0];

    setDrawingPoints([...drawingPoints, [lat, lng]]);
  };

  const finishDrawing = () => {
    if (drawingPoints.length >= 3) {
      setDrawnArea(drawingPoints);
    }
    setIsDrawing(false);
    setDrawingPoints([]);
  };

  const clearDrawing = () => {
    setDrawnArea(null);
    setDrawingPoints([]);
    setIsDrawing(false);
  };

  const selectedProperty = filteredProperties.find(p => p.id === selectedPropertyId);

  const getAmenityIcon = (type: Amenity['type']) => {
    switch (type) {
      case 'university':
        return <GraduationCap className="w-4 h-4" />;
      case 'transit':
        return <Bus className="w-4 h-4" />;
      case 'grocery':
        return <ShoppingCart className="w-4 h-4" />;
      case 'cafe':
        return <Coffee className="w-4 h-4" />;
      case 'gym':
        return <Dumbbell className="w-4 h-4" />;
    }
  };

  const getAmenityColor = (type: Amenity['type']) => {
    switch (type) {
      case 'university':
        return 'bg-blue-500';
      case 'transit':
        return 'bg-purple-500';
      case 'grocery':
        return 'bg-green-500';
      case 'cafe':
        return 'bg-orange-500';
      case 'gym':
        return 'bg-red-500';
    }
  };

  const filteredAmenities = showAmenities
    ? mockAmenities.filter(a => amenityTypes.length === 0 || amenityTypes.includes(a.type))
    : [];

  return (
    <div className="relative w-full h-screen bg-gray-100">
      {/* Map Container - Simplified representation */}
      <div
        ref={setMapElement}
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      >
        {/* Property Markers */}
        {filteredProperties.map((property) => {
          if (!property.lat || !property.lng) return null;

          // Simplified positioning (centered around default view)
          const offsetLat = (property.lat - center[0]) * 100;
          const offsetLng = (property.lng - center[1]) * 100;

          const isSelected = selectedPropertyId === property.id;
          const isHovered = hoveredProperty === property.id;

          return (
            <div
              key={property.id}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-200"
              style={{
                left: `calc(50% + ${offsetLng}px)`,
                top: `calc(50% - ${offsetLat}px)`,
                zIndex: isSelected ? 1000 : isHovered ? 999 : 1,
              }}
              onMouseEnter={() => setHoveredProperty(property.id)}
              onMouseLeave={() => setHoveredProperty(null)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProperty(property.id);
              }}
            >
              {/* Marker Pin */}
              <div
                className={`relative transition-all duration-200 ${
                  isSelected || isHovered ? 'scale-125' : 'scale-100'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-rose-600 ring-4 ring-rose-300'
                      : 'bg-white border-2 border-rose-500'
                  }`}
                >
                  <MapPin
                    className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-rose-600'}`}
                    fill={isSelected ? 'white' : 'currentColor'}
                  />
                </div>

                {/* Price tag */}
                {!isSelected && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow-md border border-gray-200">
                    <span className="text-sm font-bold text-gray-900">${property.price}</span>
                  </div>
                )}
              </div>

              {/* Hover Preview */}
              {isHovered && !isSelected && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50">
                  <img
                    src={property.images?.[0] || property.image}
                    alt={property.title}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{property.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{property.location}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-600">${property.price}/mo</span>
                    <div className="flex gap-2 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3" /> {property.beds}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" /> {property.baths}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Amenity Markers */}
        {filteredAmenities.map((amenity) => {
          const offsetLat = (amenity.lat - center[0]) * 100;
          const offsetLng = (amenity.lng - center[1]) * 100;

          return (
            <div
              key={amenity.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `calc(50% + ${offsetLng}px)`,
                top: `calc(50% - ${offsetLat}px)`,
                zIndex: 10,
              }}
            >
              <div
                className={`${getAmenityColor(amenity.type)} w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white group relative`}
              >
                {getAmenityIcon(amenity.type)}

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {amenity.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Drawing overlay */}
        {drawnArea && drawnArea.length > 0 && (
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 500 }}>
            <polygon
              points={drawnArea
                .map(([lat, lng]) => {
                  const offsetLat = (lat - center[0]) * 100;
                  const offsetLng = (lng - center[1]) * 100;
                  return `${window.innerWidth / 2 + offsetLng},${window.innerHeight / 2 - offsetLat}`;
                })
                .join(' ')}
              fill="rgba(236, 72, 153, 0.2)"
              stroke="rgb(236, 72, 153)"
              strokeWidth="2"
            />
          </svg>
        )}
      </div>

      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1001] flex gap-4">
        {/* Search Box */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search location, university, neighborhood..."
              className="flex-1 outline-none text-gray-900"
            />
            <button
              onClick={fitBounds}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Fit all properties"
            >
              <Maximize2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Results count */}
          <div className="mt-2 text-sm text-gray-600">
            {filteredProperties.length} properties found
            {drawnArea && ' in drawn area'}
          </div>
        </div>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium text-gray-900"
        >
          <Filter className="w-5 h-5" />
          Filters
          {(filters.beds.length > 0 ||
            filters.propertyType.length > 0 ||
            filters.amenities.length > 0 ||
            drawnArea) && (
            <span className="bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {filters.beds.length +
                filters.propertyType.length +
                filters.amenities.length +
                (drawnArea ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Amenities Toggle */}
        <button
          onClick={toggleAmenities}
          className={`px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 font-medium ${
            showAmenities
              ? 'bg-rose-600 text-white'
              : 'bg-white text-gray-900'
          }`}
        >
          <Layers className="w-5 h-5" />
          Amenities
        </button>

        {/* Drawing Tools */}
        <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
          <button
            onClick={() => {
              setIsDrawing(true);
              setDrawingPoints([]);
            }}
            className={`p-2 rounded transition ${
              isDrawing
                ? 'bg-rose-600 text-white'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Draw search area"
          >
            <Edit3 className="w-5 h-5" />
          </button>
          {(isDrawing || drawnArea) && (
            <button
              onClick={clearDrawing}
              className="p-2 hover:bg-red-50 text-red-600 rounded transition"
              title="Clear drawn area"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          {isDrawing && drawingPoints.length >= 3 && (
            <button
              onClick={finishDrawing}
              className="px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 transition"
            >
              Finish
            </button>
          )}
        </div>
      </div>

      {/* Drawing Instructions */}
      {isDrawing && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-rose-600 text-white px-4 py-2 rounded-lg shadow-lg z-[1001]">
          Click on the map to draw a custom search area. Need at least 3 points.
          {drawingPoints.length > 0 && ` (${drawingPoints.length} points)`}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-2xl z-[1002] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    setFilters({
                      priceRange: [parseInt(e.target.value), filters.priceRange[1]],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Min"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      const newBeds = filters.beds.includes(num)
                        ? filters.beds.filter((b) => b !== num)
                        : [...filters.beds, num];
                      setFilters({ beds: newBeds });
                    }}
                    className={`px-4 py-2 rounded-lg border transition ${
                      filters.beds.includes(num)
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-rose-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <div className="space-y-2">
                {['Entire place', 'Private room', 'Shared room'].map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.propertyType.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.propertyType, type]
                          : filters.propertyType.filter((t) => t !== type);
                        setFilters({ propertyType: newTypes });
                      }}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="space-y-2">
                {['WiFi', 'Kitchen', 'Washer', 'AC', 'Parking', 'Gym'].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={(e) => {
                        const newAmenities = e.target.checked
                          ? [...filters.amenities, amenity]
                          : filters.amenities.filter((a) => a !== amenity);
                        setFilters({ amenities: newAmenities });
                      }}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Amenities Filter (when shown) */}
      {showAmenities && (
        <div className="absolute top-24 right-4 bg-white rounded-lg shadow-lg p-4 z-[1001]">
          <h4 className="font-bold text-gray-900 mb-3">Show Amenities</h4>
          <div className="space-y-2">
            {[
              { type: 'university', label: 'Universities', icon: GraduationCap, color: 'blue' },
              { type: 'transit', label: 'Transit', icon: Bus, color: 'purple' },
              { type: 'grocery', label: 'Grocery', icon: ShoppingCart, color: 'green' },
              { type: 'cafe', label: 'Cafes', icon: Coffee, color: 'orange' },
              { type: 'gym', label: 'Gyms', icon: Dumbbell, color: 'red' },
            ].map(({ type, label, icon: Icon, color }) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenityTypes.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...amenityTypes, type]
                      : amenityTypes.filter((t) => t !== type);
                    setAmenityTypes(newTypes);
                  }}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <div className={`w-6 h-6 rounded-full bg-${color}-500 flex items-center justify-center text-white`}>
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Selected Property Detail Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-96 bg-white rounded-lg shadow-2xl z-[1001]">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src={selectedProperty.images?.[0] || selectedProperty.image}
            alt={selectedProperty.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />

          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {selectedProperty.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{selectedProperty.location}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-rose-600">
                ${selectedProperty.price}
                <span className="text-sm text-gray-500">/month</span>
              </div>
              <div className="flex gap-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  {selectedProperty.beds} beds
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  {selectedProperty.baths} baths
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push(`/property/${selectedProperty.id}`)}
              className="w-full px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1001]">
        <h4 className="text-xs font-bold text-gray-900 mb-2">Map Legend</h4>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-rose-600"></div>
            <span>Selected Property</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-rose-500"></div>
            <span>Available Property</span>
          </div>
          {showAmenities && (
            <>
              <div className="h-px bg-gray-200 my-1"></div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>University</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                <span>Transit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span>Grocery</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
