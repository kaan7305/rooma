'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useListingsStore } from '@/lib/listings-store';
import { MapPin, Home, DollarSign, Calendar, Image as ImageIcon, AlertCircle } from 'lucide-react';
import TurnstileCaptcha from '@/components/TurnstileCaptcha';
import { validatePropertyImage, base64ToImageElement, type ValidationResult } from '@/lib/image-validator';

export default function NewListingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addListing } = useListingsStore();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    city: '',
    country: '',
    postcode: '',
    price: '',
    duration: 'Summer',
    type: 'Entire apartment',
    beds: '1',
    baths: '1',
    sqft: '',
    description: '',
    image: '',
    images: ['', '', '', ''],
    available: 'Available now',
  });

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<{ main: File | null, additional: (File | null)[] }>({
    main: null,
    additional: [null, null, null, null],
  });
  const [imagePreviews, setImagePreviews] = useState<{ main: string, additional: string[] }>({
    main: '',
    additional: ['', '', '', ''],
  });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [photoConfirmation, setPhotoConfirmation] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<{ preview: string; index: number } | null>(null);
  const [photoConfirmed, setPhotoConfirmed] = useState<{ main: boolean; additional: boolean[] }>({
    main: false,
    additional: [false, false, false, false],
  });
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const locationContainerRef = useRef<HTMLDivElement>(null);

  const allAmenities = ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'AC', 'Parking', 'Gym', 'Pool', 'Pets OK', 'Backyard'];
  const durationOptions = ['Summer', 'Fall', 'Winter', 'Spring', 'Academic Year', 'Semester', 'Flexible'];
  const typeOptions = ['Entire apartment', 'Private room', 'Shared room', 'Studio', 'House'];

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please log in to list a property');
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationContainerRef.current && !locationContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch address suggestions using Nominatim (OpenStreetMap) - FREE API
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'NestQuarter-App'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAddressSuggestions(data);
        setShowSuggestions(data.length > 0);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSelectAddress = (suggestion: any) => {
    console.log('Selected suggestion:', suggestion);

    const address = suggestion.address || {};
    const displayName = suggestion.display_name || '';

    // Extract address components with better fallbacks
    const city = address.city || address.town || address.village || address.municipality || address.county || '';
    const country = address.country || '';
    const postcode = address.postcode || '';

    console.log('Extracted:', { displayName, city, country, postcode });

    setFormData(prev => ({
      ...prev,
      location: displayName,
      city: city,
      country: country,
      postcode: postcode
    }));

    setShowSuggestions(false);
    setAddressSuggestions([]);

    console.log('Fields updated');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Trigger address suggestions for location field
    if (name === 'location') {
      fetchAddressSuggestions(value);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, or WebP)');
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Validate image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = async () => {
        URL.revokeObjectURL(objectUrl);

        if (img.width < 400 || img.height < 300) {
          alert('Image dimensions must be at least 400x300 pixels for better quality');
          return;
        }

        // Convert to base64
        const base64 = await convertToBase64(file);

        // AI Validation
        setIsValidating(true);
        try {
          const imgElement = await base64ToImageElement(base64);
          const result = await validatePropertyImage(imgElement);
          setValidationResult(result);

          if (!result.isValid) {
            alert(`❌ AI Validation Failed\n\n${result.reason}\n\n${result.suggestions || ''}`);
            setIsValidating(false);
            return;
          }

          // Show modal for manual confirmation
          setPendingPhoto({ preview: base64, index: -1 });
          setShowPhotoModal(true);

          // Store temporarily (will be confirmed in modal)
          setImageFiles(prev => ({ ...prev, main: file }));
          setImagePreviews(prev => ({ ...prev, main: base64 }));
          setFormData(prev => ({ ...prev, image: base64 }));
        } catch (error) {
          console.error('Validation error:', error);
          alert('Failed to validate image. Please try again.');
        } finally {
          setIsValidating(false);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        alert('Failed to load image. Please try a different file.');
      };
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, PNG, or WebP)');
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Validate image dimensions
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      img.onload = async () => {
        URL.revokeObjectURL(objectUrl);

        if (img.width < 400 || img.height < 300) {
          alert('Image dimensions must be at least 400x300 pixels for better quality');
          return;
        }

        // Convert to base64
        const base64 = await convertToBase64(file);

        // AI Validation
        setIsValidating(true);
        try {
          const imgElement = await base64ToImageElement(base64);
          const result = await validatePropertyImage(imgElement);
          setValidationResult(result);

          if (!result.isValid) {
            alert(`❌ AI Validation Failed\n\n${result.reason}\n\n${result.suggestions || ''}`);
            setIsValidating(false);
            return;
          }

          // Show modal for manual confirmation
          setPendingPhoto({ preview: base64, index });
          setShowPhotoModal(true);

          // Store temporarily (will be confirmed in modal)
          const newFiles = [...imageFiles.additional];
          newFiles[index] = file;
          setImageFiles(prev => ({ ...prev, additional: newFiles }));

          const newPreviews = [...imagePreviews.additional];
          newPreviews[index] = base64;
          setImagePreviews(prev => ({ ...prev, additional: newPreviews }));

          const newImages = [...formData.images];
          newImages[index] = base64;
          setFormData(prev => ({ ...prev, images: newImages }));
        } catch (error) {
          console.error('Validation error:', error);
          alert('Failed to validate image. Please try again.');
        } finally {
          setIsValidating(false);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        alert('Failed to load image. Please try a different file.');
      };
    }
  };

  const removeImage = (index: number) => {
    if (index === -1) {
      // Remove main image
      setImageFiles(prev => ({ ...prev, main: null }));
      setImagePreviews(prev => ({ ...prev, main: '' }));
      setFormData(prev => ({ ...prev, image: '' }));
      setPhotoConfirmed(prev => ({ ...prev, main: false }));
    } else {
      // Remove additional image
      const newFiles = [...imageFiles.additional];
      newFiles[index] = null;
      setImageFiles(prev => ({ ...prev, additional: newFiles }));

      const newPreviews = [...imagePreviews.additional];
      newPreviews[index] = '';
      setImagePreviews(prev => ({ ...prev, additional: newPreviews }));

      const newImages = [...formData.images];
      newImages[index] = '';
      setFormData(prev => ({ ...prev, images: newImages }));

      const newConfirmed = [...photoConfirmed.additional];
      newConfirmed[index] = false;
      setPhotoConfirmed(prev => ({ ...prev, additional: newConfirmed }));
    }
  };

  const handlePhotoConfirm = () => {
    if (!pendingPhoto) return;

    if (pendingPhoto.index === -1) {
      setPhotoConfirmed(prev => ({ ...prev, main: true }));
    } else {
      const newConfirmed = [...photoConfirmed.additional];
      newConfirmed[pendingPhoto.index] = true;
      setPhotoConfirmed(prev => ({ ...prev, additional: newConfirmed }));
    }

    setShowPhotoModal(false);
    setPendingPhoto(null);
  };

  const handlePhotoReject = () => {
    if (!pendingPhoto) return;

    // Remove the photo
    removeImage(pendingPhoto.index);

    setShowPhotoModal(false);
    setPendingPhoto(null);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to create a listing');
      return;
    }

    // Validation
    if (!formData.title || !formData.location || !formData.city || !formData.price || !formData.sqft || !formData.description || !formData.image) {
      alert('Please fill in all required fields');
      return;
    }

    // Check photo confirmation
    if (!photoConfirmation) {
      alert('Please confirm that you are uploading genuine property photos');
      return;
    }

    // Check captcha verification
    if (!isCaptchaVerified) {
      alert('Please complete the captcha verification');
      return;
    }

    // Check if main photo is confirmed
    if (!photoConfirmed.main) {
      alert('Please confirm that your main photo is a genuine property image');
      return;
    }

    // Check if all additional photos are confirmed
    const hasUnconfirmedPhotos = imagePreviews.additional.some(
      (preview, idx) => preview && !photoConfirmed.additional[idx]
    );
    if (hasUnconfirmedPhotos) {
      alert('Please confirm all uploaded photos are genuine property images');
      return;
    }

    const filteredImages = formData.images.filter(img => img.trim() !== '');

    addListing({
      userId: user.id,
      title: formData.title,
      location: formData.location,
      city: formData.city,
      price: parseInt(formData.price),
      duration: formData.duration,
      type: formData.type,
      beds: parseInt(formData.beds),
      baths: parseInt(formData.baths),
      sqft: parseInt(formData.sqft),
      description: formData.description,
      amenities: selectedAmenities,
      image: formData.image,
      images: filteredImages.length > 0 ? filteredImages : undefined,
      available: formData.available,
    });

    alert('Property listed successfully!');
    router.push('/host');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            List Your Property
          </h1>
          <p className="text-gray-600 mb-8">Share your space with students looking for sublets</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Property Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="w-5 h-5 text-rose-600" />
                Property Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Cozy 2BR Near Campus"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative" ref={locationContainerRef}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <div className="relative">
                      <input
                        ref={locationInputRef}
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        onFocus={() => {
                          if (formData.location.length >= 3) {
                            fetchAddressSuggestions(formData.location);
                          }
                        }}
                        placeholder="Start typing an address..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                        required
                        autoComplete="off"
                      />
                      {isLoadingSuggestions && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-600"></div>
                        </div>
                      )}
                    </div>

                    {/* Autocomplete Suggestions Dropdown */}
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {addressSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectAddress(suggestion);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-rose-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{suggestion.display_name}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Type at least 3 characters to see suggestions
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g., Cambridge"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g., United States"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleChange}
                      placeholder="e.g., 02138"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900"
                    >
                      {typeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Square Feet *
                    </label>
                    <input
                      type="number"
                      name="sqft"
                      value={formData.sqft}
                      onChange={handleChange}
                      placeholder="e.g., 850"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bedrooms *
                    </label>
                    <select
                      name="beds"
                      value={formData.beds}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bathrooms *
                    </label>
                    <select
                      name="baths"
                      value={formData.baths}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900"
                    >
                      {[1, 1.5, 2, 2.5, 3].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Availability */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-rose-600" />
                Pricing & Availability
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., 1800"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration *
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900"
                  >
                    {durationOptions.map(duration => (
                      <option key={duration} value={duration}>{duration}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Availability
                  </label>
                  <input
                    type="text"
                    name="available"
                    value={formData.available}
                    onChange={handleChange}
                    placeholder="e.g., Available June 1st"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your property, nearby amenities, transportation, etc..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                required
              />
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {allAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-rose-600" />
                Photos
              </h2>

              {/* Photo Guidelines Warning */}
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  Important Photo Guidelines
                </h3>
                <ul className="text-sm text-amber-800 space-y-1 mb-4">
                  <li>• Only upload photos of the actual property being listed</li>
                  <li>• Photos must clearly show the interior or exterior of the property</li>
                  <li>• Random images, stock photos, or unrelated content are prohibited</li>
                  <li>• Minimum dimensions: 400x300 pixels for quality</li>
                  <li>• Maximum file size: 5MB per photo</li>
                  <li>• Supported formats: JPG, PNG, WebP</li>
                </ul>
                <label className="flex items-start gap-3 cursor-pointer hover:bg-amber-100 p-3 rounded-lg transition">
                  <input
                    type="checkbox"
                    checked={photoConfirmation}
                    onChange={(e) => setPhotoConfirmation(e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-amber-900 font-semibold">
                    I confirm that all photos I upload are genuine images of the property I am listing. I understand that listings with fake or unrelated photos will be removed.
                  </span>
                </label>
              </div>

              <p className="text-sm text-gray-600 mb-4">Upload clear photos of your property (max 5MB each)</p>

              {/* Main Photo */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Main Photo *
                </label>
                {imagePreviews.main ? (
                  <div className="relative">
                    <img
                      src={imagePreviews.main}
                      alt="Main preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    {photoConfirmed.main && (
                      <div className="absolute top-3 left-3 bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1 font-semibold text-sm shadow-lg">
                        ✓ Verified
                      </div>
                    )}
                    {!photoConfirmed.main && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 font-semibold text-sm shadow-lg animate-pulse">
                        ⚠ Pending Confirmation
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(-1)}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-xl hover:border-rose-500 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      required
                    />
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Click to upload main photo</span>
                      <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Additional Photos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Photos (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index}>
                      {imagePreviews.additional[index] ? (
                        <div className="relative aspect-video">
                          <img
                            src={imagePreviews.additional[index]}
                            alt={`Preview ${index + 2}`}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          {photoConfirmed.additional[index] && (
                            <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg">
                              ✓
                            </div>
                          )}
                          {!photoConfirmed.additional[index] && (
                            <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                              ⚠
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label className="block aspect-video border-2 border-dashed border-gray-300 rounded-xl hover:border-rose-500 transition cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAdditionalImageUpload(e, index)}
                            className="hidden"
                          />
                          <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8 mb-1" />
                            <span className="text-xs">Photo {index + 2}</span>
                          </div>
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Captcha */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Verify You're Human</h2>
              <TurnstileCaptcha onVerify={setIsCaptchaVerified} isVerified={isCaptchaVerified} />
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!isCaptchaVerified || !photoConfirmation}
                className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-8 py-4 transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                List Property
              </button>
              <button
                type="button"
                onClick={() => router.push('/host')}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
            </div>

            {(!isCaptchaVerified || !photoConfirmation) && (
              <p className="text-sm text-amber-600 text-center mt-2">
                {!photoConfirmation && 'Please confirm photo guidelines '}
                {!photoConfirmation && !isCaptchaVerified && 'and '}
                {!isCaptchaVerified && 'complete captcha verification '}
                to submit your listing
              </p>
            )}
          </form>
        </div>

        {/* AI Validation Loading Overlay */}
        {isValidating && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Validating Image...</h3>
              <p className="text-gray-600">Please wait while we verify this is a property photo</p>
              <p className="text-sm text-gray-500 mt-4">This usually takes 3-5 seconds</p>
            </div>
          </div>
        )}

        {/* Photo Confirmation Modal */}
        {showPhotoModal && pendingPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      AI Validation Passed
                    </h2>
                    {validationResult && (
                      <p className="text-sm text-emerald-700 font-semibold">
                        {validationResult.reason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-emerald-900 mb-2">✓ AI Analysis Complete</h3>
                  <p className="text-sm text-emerald-800">
                    Our AI has analyzed this image and detected property-related content.
                    However, we still need your manual confirmation.
                  </p>
                  {validationResult && validationResult.detectedObjects.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-emerald-900 mb-1">Detected Objects:</p>
                      <div className="flex flex-wrap gap-1">
                        {validationResult.detectedObjects.slice(0, 5).map((obj, idx) => (
                          <span key={idx} className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
                  <h3 className="font-bold text-red-900 mb-3 text-lg">⚠️ CRITICAL WARNING</h3>
                  <ul className="text-sm text-red-800 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span><strong>DO NOT upload screenshots</strong> of file browsers, folders, or any UI elements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span><strong>DO NOT upload random images</strong> that are not related to the property</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span><strong>ONLY upload actual photos</strong> showing the interior or exterior of the property</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span><strong>Fake photos will result</strong> in immediate listing removal and account suspension</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Review your uploaded image carefully:
                  </p>
                  <div className="border-4 border-gray-300 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={pendingPhoto.preview}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6">
                  <p className="text-sm font-bold text-yellow-900 mb-2">
                    Ask yourself these questions:
                  </p>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>✓ Is this a photo of the actual property (rooms, exterior, amenities)?</li>
                    <li>✓ Can someone viewing this understand what the property looks like?</li>
                    <li>✓ Is this NOT a screenshot of a file browser or other application?</li>
                    <li>✓ Is this NOT a random image from the internet?</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handlePhotoConfirm}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl px-6 py-4 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
                  >
                    ✓ Yes, This is a Real Property Photo
                  </button>
                  <button
                    type="button"
                    onClick={handlePhotoReject}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-6 py-4 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
                  >
                    ✗ No, Remove This Photo
                  </button>
                </div>

                <p className="text-xs text-center text-gray-600 mt-4">
                  By clicking "Yes", you confirm under penalty of account suspension that this is a genuine property photo.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
