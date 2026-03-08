'use client';

import { useState } from 'react';
import { X, GitCompare, Star, MapPin, Bed, Bath, Maximize, Check, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useComparisonStore } from '@/lib/comparison-store';
import { useToast } from '@/lib/toast-context';

export default function PropertyComparison() {
  const toast = useToast();
  const { properties, removeFromComparison, clearComparison } = useComparisonStore();
  const [isOpen, setIsOpen] = useState(false);

  if (properties.length === 0) {
    return null;
  }

  const comparisonFeatures = [
    { key: 'price', label: 'Monthly Rent', icon: DollarSign },
    { key: 'location', label: 'Location', icon: MapPin },
    { key: 'duration', label: 'Duration', icon: null },
    { key: 'type', label: 'Type', icon: null },
    { key: 'beds', label: 'Bedrooms', icon: Bed },
    { key: 'baths', label: 'Bathrooms', icon: Bath },
    { key: 'sqft', label: 'Square Feet', icon: Maximize },
    { key: 'rating', label: 'Rating', icon: Star },
    { key: 'available', label: 'Availability', icon: null },
  ];

  return (
    <>
      {/* Floating Comparison Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-50 flex items-center gap-3 px-6 py-4 group"
      >
        <GitCompare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="flex flex-col items-start">
          <span className="font-bold text-sm">Compare Properties</span>
          <span className="text-xs opacity-90">{properties.length} selected</span>
        </div>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
          {properties.length}
        </div>
      </button>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                    <GitCompare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Property Comparison</h2>
                    <p className="text-sm text-gray-600">
                      Comparing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      clearComparison();
                      setIsOpen(false);
                      toast.success('Comparison cleared');
                    }}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 hover:bg-gray-100 rounded-xl flex items-center justify-center transition"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="flex-1 overflow-auto p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-white p-4 text-left font-semibold text-gray-700 w-48">
                        Features
                      </th>
                      {properties.map((property) => (
                        <th key={property.id} className="p-4 min-w-[280px]">
                          <div className="relative">
                            <button
                              onClick={() => {
                                removeFromComparison(property.id);
                                toast.success(`Removed ${property.title} from comparison`);
                              }}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition z-10"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <Link href={`/properties/${property.id}`} className="block">
                              <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-40 object-cover rounded-xl mb-3 hover:scale-105 transition-transform"
                              />
                              <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-rose-600 transition">
                                {property.title}
                              </h3>
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr
                        key={feature.key}
                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      >
                        <td className="sticky left-0 bg-inherit p-4 font-semibold text-gray-700 border-r border-gray-200">
                          <div className="flex items-center gap-2">
                            {feature.icon && <feature.icon className="w-4 h-4 text-gray-500" />}
                            {feature.label}
                          </div>
                        </td>
                        {properties.map((property) => (
                          <td key={property.id} className="p-4 text-center">
                            {feature.key === 'price' ? (
                              <div className="font-bold text-lg bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                                ${property.price.toLocaleString()}/mo
                              </div>
                            ) : feature.key === 'rating' ? (
                              <div className="flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">{property.rating}</span>
                              </div>
                            ) : feature.key === 'available' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                <Check className="w-3 h-3" />
                                {property.available}
                              </span>
                            ) : feature.key === 'amenities' ? (
                              <div className="text-sm text-gray-600">
                                {property.amenities.length} amenities
                              </div>
                            ) : feature.key === 'sqft' ? (
                              <div className="font-semibold text-gray-900">
                                {property.sqft.toLocaleString()} sq ft
                              </div>
                            ) : (
                              <div className="text-gray-900">
                                {property[feature.key as keyof typeof property]}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Amenities Row */}
                    <tr className="bg-white">
                      <td className="sticky left-0 bg-white p-4 font-semibold text-gray-700 border-r border-gray-200">
                        Amenities
                      </td>
                      {properties.map((property) => (
                        <td key={property.id} className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {property.amenities.slice(0, 6).map((amenity) => (
                              <span
                                key={amenity}
                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                            {property.amenities.length > 6 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                                +{property.amenities.length - 6} more
                              </span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* View Details Row */}
                    <tr className="bg-gray-50">
                      <td className="sticky left-0 bg-gray-50 p-4"></td>
                      {properties.map((property) => (
                        <td key={property.id} className="p-4">
                          <Link
                            href={`/properties/${property.id}`}
                            className="block w-full py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl font-semibold text-center transition-all shadow-lg hover:shadow-xl"
                          >
                            View Details
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 text-center">
                You can compare up to 4 properties at once. Click the X to remove a property from comparison.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
