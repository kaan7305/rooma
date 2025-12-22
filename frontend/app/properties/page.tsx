'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { propertiesApi } from '@/lib/properties-api';
import { Property, PropertySearchParams } from '@/types';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<PropertySearchParams>({
    page: 1,
    limit: 12,
  });

  useEffect(() => {
    loadProperties();
  }, [searchParams]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesApi.getProperties(searchParams);
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loadProperties();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
          <p className="mt-2 text-gray-600">
            Find your perfect student home from thousands of verified listings
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="City"
              value={searchParams.city || ''}
              onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={searchParams.min_price || ''}
              onChange={(e) =>
                setSearchParams({ ...searchParams, min_price: Number(e.target.value) })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={searchParams.max_price || ''}
              onChange={(e) =>
                setSearchParams({ ...searchParams, max_price: Number(e.target.value) })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No properties found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group"
              >
                {/* Property Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {property.photos && property.photos[0] ? (
                    <img
                      src={property.photos[0].photo_url}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <span className="text-6xl">🏠</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                    <span className="font-semibold text-indigo-600">
                      ${property.price_per_month}/mo
                    </span>
                  </div>
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    📍 {property.city}, {property.state}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>🛏️ {property.bedrooms} bed</span>
                    <span>🚿 {property.bathrooms} bath</span>
                    <span>👥 {property.max_occupants} guests</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{property.property_type}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.is_available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {property.is_available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {properties.length > 0 && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <button
              onClick={() => setSearchParams({ ...searchParams, page: (searchParams.page || 1) - 1 })}
              disabled={(searchParams.page || 1) <= 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">Page {searchParams.page || 1}</span>
            <button
              onClick={() => setSearchParams({ ...searchParams, page: (searchParams.page || 1) + 1 })}
              disabled={properties.length < (searchParams.limit || 12)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
