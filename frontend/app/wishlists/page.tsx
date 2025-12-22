'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { wishlistsApi } from '@/lib/wish lists-api';
import { Wishlist } from '@/types';

export default function WishlistsPage() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWishlistName, setNewWishlistName] = useState('');

  useEffect(() => {
    loadWishlists();
  }, []);

  const loadWishlists = async () => {
    try {
      const response = await wishlistsApi.getMyWishlists();
      setWishlists(response.data);
    } catch (error) {
      console.error('Failed to load wishlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async () => {
    try {
      await wishlistsApi.createWishlist({ name: newWishlistName });
      setNewWishlistName('');
      setShowCreateModal(false);
      loadWishlists();
    } catch (error) {
      alert('Failed to create wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlists</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Create Wishlist
          </button>
        </div>

        {wishlists.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <p className="text-xl text-gray-600 mb-4">No wishlists yet</p>
            <p className="text-gray-500 mb-6">
              Create a wishlist and start saving your favorite properties!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Create Your First Wishlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlists.map((wishlist) => (
              <div key={wishlist.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{wishlist.name}</h3>
                  <span className="text-sm text-gray-500">{wishlist.items?.length || 0} properties</span>
                </div>
                {wishlist.description && (
                  <p className="text-gray-600 text-sm mb-4">{wishlist.description}</p>
                )}
                <Link
                  href={`/wishlists/${wishlist.id}`}
                  className="text-indigo-600 text-sm font-medium hover:text-indigo-700"
                >
                  View Properties →
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Wishlist</h2>
              <input
                type="text"
                value={newWishlistName}
                onChange={(e) => setNewWishlistName(e.target.value)}
                placeholder="Wishlist name"
                className="w-full px-4 py-3 border rounded-lg mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWishlist}
                  disabled={!newWishlistName}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
