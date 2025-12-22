'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, Star } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const streetInputRef = useRef<HTMLInputElement>(null);

  // Mock addresses
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      type: 'home',
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Work',
      type: 'work',
      street: '456 Business Ave, Suite 200',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
    },
  ]);

  // Form state
  const [formData, setFormData] = useState({
    label: '',
    type: 'home' as 'home' | 'work' | 'other',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const handleSetDefault = (id: string) => {
    setAddresses(addrs =>
      addrs.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses(addrs => addrs.filter(addr => addr.id !== id));
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      label: address.label,
      type: address.type,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    });
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addrs =>
        addrs.map(addr =>
          addr.id === editingAddress.id
            ? { ...addr, ...formData }
            : addr
        )
      );
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAddress(null);
    setShowSuggestions(false);
    setAddressSuggestions([]);
    setFormData({
      label: '',
      type: 'home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    });
  };

  // Mock address autocomplete - In production, this would call Google Places API or similar
  const handleAddressSearch = (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Mock suggestions - In production, this would be API call
    const mockSuggestions = [
      {
        description: `${query} Main Street, New York, NY 10001`,
        street: `${query} Main Street`,
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      {
        description: `${query} Broadway, New York, NY 10012`,
        street: `${query} Broadway`,
        city: 'New York',
        state: 'NY',
        zipCode: '10012',
        country: 'United States'
      },
      {
        description: `${query} 5th Avenue, New York, NY 10018`,
        street: `${query} 5th Avenue`,
        city: 'New York',
        state: 'NY',
        zipCode: '10018',
        country: 'United States'
      },
      {
        description: `${query} Park Avenue, New York, NY 10022`,
        street: `${query} Park Avenue`,
        city: 'New York',
        state: 'NY',
        zipCode: '10022',
        country: 'United States'
      }
    ];

    setAddressSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setFormData({
      ...formData,
      street: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      zipCode: suggestion.zipCode,
      country: suggestion.country
    });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (streetInputRef.current && !streetInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-6 h-6 text-rose-600" />;
      case 'work':
        return <Briefcase className="w-6 h-6 text-rose-600" />;
      default:
        return <MapPin className="w-6 h-6 text-rose-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Addresses</h1>
          <p className="text-gray-600">Manage your saved addresses for faster checkout</p>
        </div>

        {/* Add Address Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.map(address => (
            <div
              key={address.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-rose-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center flex-shrink-0">
                    {getAddressIcon(address.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{address.label}</h3>
                      {address.isDefault && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-medium rounded">
                          <Star className="w-3 h-3 fill-rose-700" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-gray-600">{address.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved addresses</h3>
            <p className="text-gray-500 mb-6">Add an address to make booking faster</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition"
            >
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g., Home, Work, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Type
                </label>
                <div className="flex gap-4">
                  {['home', 'work', 'other'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, type: type as any })}
                      className={`flex-1 px-4 py-2 rounded-lg border-2 transition ${
                        formData.type === type
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Street with Autocomplete */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  ref={streetInputRef}
                  type="text"
                  value={formData.street}
                  onChange={e => {
                    setFormData({ ...formData, street: e.target.value });
                    handleAddressSearch(e.target.value);
                  }}
                  onFocus={() => {
                    if (formData.street.length >= 3) {
                      handleAddressSearch(formData.street);
                    }
                  }}
                  placeholder="Start typing an address..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  autoComplete="off"
                />

                {/* Autocomplete Suggestions Dropdown */}
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {addressSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-rose-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{suggestion.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Start typing to see address suggestions
                </p>
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    placeholder="NY"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                    placeholder="10001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition"
              >
                {editingAddress ? 'Save Changes' : 'Add Address'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
