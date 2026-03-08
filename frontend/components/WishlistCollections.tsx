'use client';

import { useState, useEffect } from 'react';
import {
  Heart,
  Plus,
  Edit2,
  Trash2,
  Share2,
  Lock,
  Unlock,
  FolderOpen,
  StickyNote,
  Copy,
  Check,
  X,
  Image as ImageIcon,
  Calendar,
} from 'lucide-react';
import { useWishlistStore, type WishlistCollection } from '@/lib/wishlist-store';
import { allProperties, type Property } from '@/data/properties';
import { useToast } from '@/lib/toast-context';

export default function WishlistCollections() {
  const toast = useToast();
  const {
    collections,
    loadCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    updateItemNote,
    togglePublic,
    generateShareLink,
  } = useWishlistStore();

  const properties = allProperties;

  const [selectedCollection, setSelectedCollection] = useState<WishlistCollection | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<{ collectionId: string; propertyId: number } | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    createCollection(newCollectionName, newCollectionDescription);
    setNewCollectionName('');
    setNewCollectionDescription('');
    setShowCreateModal(false);
    toast.success('Collection created successfully!');
  };

  const handleDeleteCollection = (id: string) => {
    if (confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id);
      if (selectedCollection?.id === id) {
        setSelectedCollection(null);
      }
      toast.success('Collection deleted');
    }
  };

  const handleShareCollection = (collection: WishlistCollection) => {
    const link = generateShareLink(collection.id);
    navigator.clipboard.writeText(link);
    setCopiedLink(collection.id);
    setTimeout(() => setCopiedLink(null), 2000);
    toast.success('Share link copied to clipboard!');
  };

  const handleAddProperty = (propertyId: number) => {
    if (!selectedCollection) return;

    const property = properties.find((p: Property) => p.id === propertyId);
    if (property) {
      addToCollection(selectedCollection.id, property);
      toast.success('Property added to collection!');
    }
  };

  const handleUpdateNote = (collectionId: string, propertyId: number) => {
    updateItemNote(collectionId, propertyId, noteText);
    setEditingNote(null);
    setNoteText('');
    toast.success('Note updated');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Collections</h2>
          <p className="text-gray-600 mt-1">Organize your favorite properties into collections</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          New Collection
        </button>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No collections yet</h3>
          <p className="text-gray-600 mb-6">Create your first collection to start organizing favorites</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setSelectedCollection(collection)}
            >
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-br from-rose-400 to-pink-500">
                {collection.coverImage ? (
                  <img
                    src={collection.coverImage}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  {collection.isPublic ? (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Unlock className="w-3 h-3" />
                      Public
                    </div>
                  ) : (
                    <div className="bg-gray-700 bg-opacity-80 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Private
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{collection.name}</h3>
                {collection.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{collection.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{collection.items.length} {collection.items.length === 1 ? 'property' : 'properties'}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(collection.updatedAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareCollection(collection);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition"
                  >
                    {copiedLink === collection.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        Share
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCollection(collection);
                      setShowEditModal(true);
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCollection(collection.id);
                    }}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Create Collection</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Name *
                </label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Summer 2025, Budget Friendly"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Add a description for this collection..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCollection}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collection Detail Modal */}
      {selectedCollection && !showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            {/* Header */}
            <div className="relative h-64 bg-gradient-to-br from-rose-400 to-pink-500">
              {selectedCollection.coverImage ? (
                <img
                  src={selectedCollection.coverImage}
                  alt={selectedCollection.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-24 h-24 text-white opacity-50" />
                </div>
              )}
              <button
                onClick={() => setSelectedCollection(null)}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedCollection.name}</h2>
                  {selectedCollection.description && (
                    <p className="text-gray-600 mb-4">{selectedCollection.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{selectedCollection.items.length} properties</span>
                    <span>•</span>
                    <span>Updated {formatDate(selectedCollection.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublic(selectedCollection.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      selectedCollection.isPublic
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedCollection.isPublic ? (
                      <span className="flex items-center gap-2">
                        <Unlock className="w-4 h-4" />
                        Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Private
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setShowAddPropertyModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Property
                  </button>
                </div>
              </div>

              {/* Properties List */}
              {selectedCollection.items.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">No properties in this collection yet</p>
                  <button
                    onClick={() => setShowAddPropertyModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition"
                  >
                    Add Properties
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedCollection.items.map((item) => (
                    <div
                      key={item.property.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <img
                        src={item.property.images?.[0] || item.property.image}
                        alt={item.property.title}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1">{item.property.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{item.property.location}</p>
                        <p className="text-lg font-bold text-rose-600 mb-2">
                          ${item.property.price}/month
                        </p>

                        {editingNote?.collectionId === selectedCollection.id &&
                        editingNote.propertyId === item.property.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Add a note..."
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateNote(selectedCollection.id, item.property.id)}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingNote(null)}
                              className="px-3 py-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            {item.note ? (
                              <p className="text-sm text-gray-600 italic flex-1">Note: {item.note}</p>
                            ) : (
                              <p className="text-sm text-gray-400 italic flex-1">No note added</p>
                            )}
                            <button
                              onClick={() => {
                                setEditingNote({ collectionId: selectedCollection.id, propertyId: item.property.id });
                                setNoteText(item.note || '');
                              }}
                              className="p-1 hover:bg-gray-200 rounded transition"
                            >
                              <StickyNote className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCollection(selectedCollection.id, item.property.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition self-start"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddPropertyModal && selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Add to {selectedCollection.name}</h3>
              <button
                onClick={() => setShowAddPropertyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {properties
                .filter((p: Property) => !selectedCollection.items.some(item => item.property.id === p.id))
                .map((property: Property) => (
                  <div
                    key={property.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
                    onClick={() => {
                      handleAddProperty(property.id);
                      setShowAddPropertyModal(false);
                    }}
                  >
                    <img
                      src={property.images?.[0] || property.image}
                      alt={property.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{property.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{property.location}</p>
                      <p className="text-lg font-bold text-rose-600">
                        ${property.price}/month
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Plus className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                ))}

              {properties.filter((p: Property) => !selectedCollection.items.some(item => item.property.id === p.id)).length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">All properties have been added to this collection</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
