'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useListingsStore } from '@/lib/listings-store';
import { Plus, MapPin, Star, Edit, Trash2, Home } from 'lucide-react';

export default function MyListingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { listings, loadListings, getUserListings, deleteListing } = useListingsStore();
  const [userListings, setUserListings] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please log in to view your listings');
      router.push('/auth/login');
      return;
    }
    loadListings();
  }, [isAuthenticated, router, loadListings]);

  useEffect(() => {
    if (user) {
      const myListings = getUserListings(user.id);
      setUserListings(myListings);
    }
  }, [user, listings, getUserListings]);

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      deleteListing(id);
      alert('Listing deleted successfully');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Listings
            </h1>
            <p className="text-gray-600">Manage your property listings</p>
          </div>
          <Link
            href="/host/new"
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            <Plus className="w-5 h-5" />
            List New Property
          </Link>
        </div>

        {userListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-10 h-10 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Start earning by listing your property</p>
            <Link
              href="/host/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all">
                <div className="relative aspect-square">
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                    <span className="text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {listing.duration}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
                    {listing.rating > 0 && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{listing.rating}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {listing.location}
                  </p>

                  <p className="text-sm text-gray-500">
                    {listing.type} · {listing.beds} bed{listing.beds > 1 ? 's' : ''} · {listing.baths} bath{listing.baths > 1 ? 's' : ''}
                  </p>

                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      ${listing.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">/ month</span>
                  </div>

                  <p className="text-xs text-emerald-600 font-medium">{listing.available}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/host/edit/${listing.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition font-semibold text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition font-semibold text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
