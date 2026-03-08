export interface Property {
  id: number;
  title: string;
  location: string;
  city: string;
  university?: string;
  price: number;
  duration: string;
  durationMonths: number; // for filtering: 0.25 = 1 week, 1 = 1 month, etc.
  image: string;
  images?: string[]; // Multiple images for gallery (optional - falls back to single image)
  rating: number;
  reviews: number;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  amenities: string[];
  available: string;
  description: string;
  lat?: number; // Latitude for map pin
  lng?: number; // Longitude for map pin
}

export const allProperties: Property[] = [
  // New York Properties — NYU, Columbia, The New School
  {
    id: 1,
    title: 'Bright Studio Near NYU — 5 Min Walk to Campus',
    location: 'Greenwich Village, NY',
    city: 'New York, NY',
    university: 'NYU',
    price: 2400,
    duration: 'Fall semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.8,
    reviews: 7,
    type: 'Entire place',
    beds: 1,
    baths: 1,
    sqft: 650,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'AC', 'Study Desk', 'Furnished'],
    available: 'Available Sep 2026',
    description: 'Fully furnished studio in the heart of Greenwich Village, steps from NYU campus. Fast WiFi, dedicated study desk, and a quiet building perfect for late-night study sessions. Grocery stores and coffee shops right downstairs.',
    lat: 40.7295,
    lng: -73.9965,
  },
  {
    id: 2,
    title: 'Spacious 2BR Near Columbia — Morningside Heights',
    location: 'Morningside Heights, NY',
    city: 'New York, NY',
    university: 'Columbia',
    price: 2100,
    duration: 'Academic year',
    durationMonths: 9,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.6,
    reviews: 5,
    type: 'Entire place',
    beds: 2,
    baths: 1,
    sqft: 900,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Furnished', 'Near Transit', 'Pets OK'],
    available: 'Available Aug 2026',
    description: 'Two-bedroom apartment ideal for roommates attending Columbia or Barnard. 8-minute walk to campus, right on the 1 train line. Fully furnished with two study areas. Building has laundry and a quiet courtyard.',
    lat: 40.8075,
    lng: -73.9626,
  },
  {
    id: 3,
    title: 'Cozy Room in Chelsea — Near The New School',
    location: 'Chelsea, NY',
    city: 'New York, NY',
    university: 'The New School',
    price: 1650,
    duration: 'Spring semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.5,
    reviews: 4,
    type: 'Private room',
    beds: 1,
    baths: 1,
    sqft: 350,
    amenities: ['WiFi', 'Kitchen', 'Furnished', 'Study Desk', 'Near Transit'],
    available: 'Available Jan 2027',
    description: 'Private room in a shared apartment, perfect for New School students. Walking distance to campus and Union Square. Shared kitchen and living room with one other student. Quiet, respectful household.',
    lat: 40.7434,
    lng: -73.9949,
  },
  // Boston Properties — Harvard, BU, Northeastern
  {
    id: 4,
    title: 'Furnished 2BR Near Harvard Square',
    location: 'Cambridge, MA',
    city: 'Boston, MA',
    university: 'Harvard',
    price: 2800,
    duration: 'Summer semester',
    durationMonths: 3,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 9,
    type: 'Entire place',
    beds: 2,
    baths: 1,
    sqft: 850,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'AC', 'Furnished', 'Study Desk', 'Heating'],
    available: 'Available Jun 2026',
    description: 'Ideal for summer researchers or visiting scholars. Two-minute walk from Harvard Square, furnished with two desks and a reading nook. Quiet residential street, great for focused work. Laundry in unit.',
    lat: 42.3736,
    lng: -71.1197,
  },
  {
    id: 5,
    title: 'Affordable Room Near Boston University',
    location: 'Allston, MA',
    city: 'Boston, MA',
    university: 'Boston University',
    price: 1200,
    duration: 'Fall semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    rating: 4.3,
    reviews: 6,
    type: 'Private room',
    beds: 1,
    baths: 1,
    sqft: 300,
    amenities: ['WiFi', 'Kitchen', 'Heating', 'Near Transit', 'Furnished'],
    available: 'Available Sep 2026',
    description: 'Budget-friendly private room in a 3BR shared with BU students. On the B Line, 10 minutes to campus. Shared kitchen stocked with basics. Great if you want an affordable alternative to campus housing.',
    lat: 42.3535,
    lng: -71.1320,
  },
  {
    id: 6,
    title: 'Modern Apartment Near Northeastern — Fenway',
    location: 'Fenway, Boston',
    city: 'Boston, MA',
    university: 'Northeastern',
    price: 2400,
    duration: 'Academic year',
    durationMonths: 9,
    image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 11,
    type: 'Entire place',
    beds: 2,
    baths: 2,
    sqft: 1050,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'AC', 'Gym', 'Study Desk', 'Furnished'],
    available: 'Available Sep 2026',
    description: 'Two-bedroom in a modern building near Northeastern campus. In-unit washer/dryer, building gym, and a dedicated study nook. Perfect for co-op students who need a stable base year-round.',
    lat: 42.3420,
    lng: -71.0960,
  },
  // San Francisco Properties — UC Berkeley, Stanford
  {
    id: 7,
    title: 'Sunny Room Near UC Berkeley Campus',
    location: 'North Side, Berkeley',
    city: 'San Francisco, CA',
    university: 'UC Berkeley',
    price: 1500,
    duration: 'Fall semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 8,
    type: 'Private room',
    beds: 1,
    baths: 1,
    sqft: 280,
    amenities: ['WiFi', 'Kitchen', 'Furnished', 'Study Desk', 'Near Transit', 'Quiet Hours'],
    available: 'Available Aug 2026',
    description: 'Private room in a house shared with Cal grad students. 7-minute bike ride to campus, on the bus line. Shared kitchen and backyard. House enforces quiet hours after 10 PM — great for studying.',
    lat: 37.8750,
    lng: -122.2600,
  },
  {
    id: 8,
    title: 'Furnished Studio Near Stanford — Palo Alto',
    location: 'Palo Alto, CA',
    city: 'San Francisco, CA',
    university: 'Stanford',
    price: 2800,
    duration: 'Summer semester',
    durationMonths: 3,
    image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 5,
    type: 'Entire place',
    beds: 1,
    baths: 1,
    sqft: 550,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'AC', 'Parking', 'Furnished', 'Study Desk'],
    available: 'Available Jun 2026',
    description: 'Clean, fully furnished studio ideal for Stanford summer researchers. Bike-friendly route to campus. Free parking spot. Fast WiFi and a large desk for working from home. Quiet neighborhood.',
    lat: 37.4275,
    lng: -122.1697,
  },
  // Los Angeles Properties — UCLA, USC
  {
    id: 9,
    title: 'Bright 1BR Near UCLA — Westwood',
    location: 'Westwood, Los Angeles',
    city: 'Los Angeles, CA',
    university: 'UCLA',
    price: 2200,
    duration: 'Fall semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 10,
    type: 'Entire place',
    beds: 1,
    baths: 1,
    sqft: 700,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'AC', 'Furnished', 'Parking', 'Pool'],
    available: 'Available Sep 2026',
    description: 'One-bedroom in the heart of Westwood, walking distance to UCLA. Building has a pool and study lounge. Fully furnished with a comfortable desk setup. Close to restaurants, Target, and Trader Joe\'s.',
    lat: 34.0612,
    lng: -118.4462,
  },
  {
    id: 10,
    title: 'Affordable Room Near USC — University Park',
    location: 'University Park, Los Angeles',
    city: 'Los Angeles, CA',
    university: 'USC',
    price: 1400,
    duration: 'Spring semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviews: 7,
    type: 'Private room',
    beds: 1,
    baths: 1,
    sqft: 320,
    amenities: ['WiFi', 'Kitchen', 'Furnished', 'Study Desk', 'Near Transit', 'Quiet Hours'],
    available: 'Available Jan 2027',
    description: 'Budget-friendly private room 5 minutes from USC campus. Shared with two other USC students. Furnished bedroom with desk. Secure building with coded entry. Much cheaper than university housing.',
    lat: 34.0224,
    lng: -118.2851,
  },
  {
    id: 11,
    title: 'Spacious 2BR Near UCLA — Mar Vista',
    location: 'Mar Vista, Los Angeles',
    city: 'Los Angeles, CA',
    university: 'UCLA',
    price: 2600,
    duration: 'Academic year',
    durationMonths: 9,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 6,
    type: 'Entire place',
    beds: 2,
    baths: 1,
    sqft: 950,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Parking', 'Patio', 'Furnished'],
    available: 'Available Sep 2026',
    description: 'Two-bedroom with a private patio, perfect for UCLA roommates. 15-minute bus ride to campus. Comes with two parking spots — rare for the area. Quiet residential street, ideal for grad students.',
    lat: 34.0012,
    lng: -118.4298,
  },
  // Chicago Properties — UChicago, Northwestern
  {
    id: 12,
    title: 'Hyde Park Studio Near UChicago',
    location: 'Hyde Park, Chicago',
    city: 'Chicago, IL',
    university: 'UChicago',
    price: 1500,
    duration: 'Summer semester',
    durationMonths: 3,
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 8,
    type: 'Entire place',
    beds: 1,
    baths: 1,
    sqft: 550,
    amenities: ['WiFi', 'Kitchen', 'AC', 'Furnished', 'Study Desk', 'Near Transit'],
    available: 'Available Jun 2026',
    description: 'Clean studio in a secure building, 3 blocks from UChicago\'s main quad. Perfect for summer research students. Furnished with a proper desk and ergonomic chair. Building has 24/7 security.',
    lat: 41.7943,
    lng: -87.5907,
  },
  {
    id: 13,
    title: 'Evanston Apartment Near Northwestern',
    location: 'Evanston, IL',
    city: 'Chicago, IL',
    university: 'Northwestern',
    price: 2200,
    duration: 'Academic year',
    durationMonths: 9,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews: 12,
    type: 'Entire place',
    beds: 2,
    baths: 1,
    sqft: 900,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Heating', 'Furnished', 'Parking', 'Study Desk'],
    available: 'Available Sep 2026',
    description: 'Well-maintained two-bedroom a 10-minute walk from Northwestern campus. Furnished with two desks and plenty of storage. Free street parking. Close to downtown Evanston restaurants and shops.',
    lat: 42.0451,
    lng: -87.6877,
  },
  // Seattle Properties — UW
  {
    id: 14,
    title: 'Quiet Room in U-District — Near UW',
    location: 'University District, Seattle',
    city: 'Seattle, WA',
    university: 'UW',
    price: 1300,
    duration: 'Fall semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviews: 5,
    type: 'Private room',
    beds: 1,
    baths: 1,
    sqft: 280,
    amenities: ['WiFi', 'Kitchen', 'Furnished', 'Near Transit', 'Quiet Hours'],
    available: 'Available Sep 2026',
    description: 'Affordable private room in the U-District, shared with two UW grad students. 5-minute walk to campus and the Burke-Gilman Trail. Quiet house with enforced study hours. On the bus line to downtown.',
    lat: 47.6588,
    lng: -122.3130,
  },
  {
    id: 15,
    title: 'Modern 1BR Near UW — Wallingford',
    location: 'Wallingford, Seattle',
    city: 'Seattle, WA',
    university: 'UW',
    price: 1900,
    duration: 'Academic year',
    durationMonths: 9,
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews: 9,
    type: 'Entire place',
    beds: 1,
    baths: 1,
    sqft: 650,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'AC', 'Furnished', 'Study Desk'],
    available: 'Available Sep 2026',
    description: 'Clean one-bedroom in quiet Wallingford, a quick bus ride to UW. Modern kitchen, in-unit laundry, and a dedicated workspace. Great coffee shops within walking distance. Ideal for grad students.',
    lat: 47.6615,
    lng: -122.3342,
  },
  // Austin Properties — UT Austin
  {
    id: 16,
    title: 'West Campus Room — Steps from UT Austin',
    location: 'West Campus, Austin',
    city: 'Austin, TX',
    university: 'UT Austin',
    price: 1100,
    duration: 'Fall semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    rating: 4.3,
    reviews: 8,
    type: 'Private room',
    beds: 1,
    baths: 1,
    sqft: 300,
    amenities: ['WiFi', 'Kitchen', 'AC', 'Furnished', 'Pool', 'Near Transit'],
    available: 'Available Aug 2026',
    description: 'Private room in West Campus, the student neighborhood right next to UT. Walk to class in under 10 minutes. Building has a pool and study rooms. Furnished with bed, desk, and dresser.',
    lat: 30.2849,
    lng: -97.7494,
  },
  {
    id: 17,
    title: 'Furnished 2BR Near UT — North Campus',
    location: 'North Campus, Austin',
    city: 'Austin, TX',
    university: 'UT Austin',
    price: 2000,
    duration: 'Summer semester',
    durationMonths: 3,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviews: 5,
    type: 'Entire place',
    beds: 2,
    baths: 1,
    sqft: 800,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'AC', 'Furnished', 'Parking', 'Study Desk'],
    available: 'Available Jun 2026',
    description: 'Two-bedroom apartment perfect for summer session students. Walking distance to UT campus and Guadalupe Street. Furnished with desks in both rooms. Comes with one covered parking spot.',
    lat: 30.2900,
    lng: -97.7386,
  },
  // Miami Properties — University of Miami
  {
    id: 18,
    title: 'Studio Near University of Miami — Coral Gables',
    location: 'Coral Gables, FL',
    city: 'Miami, FL',
    university: 'University of Miami',
    price: 1800,
    duration: 'Fall semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviews: 6,
    type: 'Entire place',
    beds: 1,
    baths: 1,
    sqft: 500,
    amenities: ['WiFi', 'Kitchen', 'AC', 'Pool', 'Furnished', 'Parking'],
    available: 'Available Aug 2026',
    description: 'Furnished studio with pool access, 10-minute bike ride to UM campus. AC is a must in Miami and this unit stays ice cold. Free parking included. Close to Miracle Mile shops and restaurants.',
    lat: 25.7215,
    lng: -80.2684,
  },
  {
    id: 19,
    title: 'Affordable Room Near UM — South Miami',
    location: 'South Miami, FL',
    city: 'Miami, FL',
    university: 'University of Miami',
    price: 1100,
    duration: 'Spring semester',
    durationMonths: 4,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80',
    rating: 4.2,
    reviews: 4,
    type: 'Private room',
    beds: 1,
    baths: 1,
    sqft: 280,
    amenities: ['WiFi', 'Kitchen', 'AC', 'Furnished', 'Near Transit'],
    available: 'Available Jan 2027',
    description: 'Budget-friendly room shared with two UM students. On the Metrorail, easy commute to campus. Furnished bedroom with desk. The cheapest option near University of Miami you\'ll find.',
    lat: 25.7076,
    lng: -80.2921,
  },
  {
    id: 20,
    title: 'Modern 2BR Near UM — Brickell',
    location: 'Brickell, Miami',
    city: 'Miami, FL',
    university: 'University of Miami',
    price: 2800,
    duration: 'Academic year',
    durationMonths: 9,
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews: 3,
    type: 'Entire place',
    beds: 2,
    baths: 2,
    sqft: 1100,
    amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'AC', 'Pool', 'Gym', 'Furnished', 'Parking'],
    available: 'Available Sep 2026',
    description: 'Premium two-bedroom in Brickell with skyline views. Building has a pool, gym, and co-working space. 20-minute Metrorail to UM campus. Ideal for grad students or those interning in downtown Miami.',
    lat: 25.7617,
    lng: -80.1918,
  },
];

// Helper function to get popular sublets (first 8 for homepage)
export const getPopularSublets = () => allProperties.slice(0, 8);

// Helper function to filter properties
export const filterProperties = (
  location?: string,
  duration?: string
): Property[] => {
  return allProperties.filter((property) => {
    const matchesLocation = !location ||
      location === '' ||
      property.city.toLowerCase().includes(location.toLowerCase()) ||
      property.location.toLowerCase().includes(location.toLowerCase()) ||
      (property.university && property.university.toLowerCase().includes(location.toLowerCase()));

    const matchesDuration = !duration ||
      duration === '' ||
      duration === 'Any length' ||
      property.duration.toLowerCase() === duration.toLowerCase();

    return matchesLocation && matchesDuration;
  });
};

// Map API property response to frontend Property type
const mapApiProperty = (p: any): Property => ({
  id: p.id,
  title: p.title || '',
  location: `${p.city || ''}, ${p.country || ''}`,
  city: p.city || '',
  price: (p.monthly_price_cents || 0) / 100,
  duration: `${p.minimum_stay_months || 1} months`,
  durationMonths: p.minimum_stay_months || 1,
  image: p.photos?.[0]?.photo_url || '',
  images: (p.photos || []).map((photo: any) => photo.photo_url),
  rating: p.average_rating || 0,
  reviews: p.total_reviews || 0,
  type: p.property_type || 'Apartment',
  beds: p.bedrooms || 0,
  baths: p.bathrooms || 0,
  sqft: p.square_feet || 0,
  amenities: (p.amenities || []).map((a: any) => a.name || a.amenity_id),
  available: p.status === 'active' ? 'Available Now' : 'Unavailable',
  description: p.description || '',
  lat: p.latitude,
  lng: p.longitude,
});

// Fetch properties from API with fallback to mock data
export const fetchProperties = async (filters?: {
  city?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  page?: number;
  limit?: number;
}): Promise<{ properties: Property[]; total: number }> => {
  try {
    const params = new URLSearchParams();
    if (filters?.city) params.set('city', filters.city);
    if (filters?.min_price) params.set('min_price', String(filters.min_price));
    if (filters?.max_price) params.set('max_price', String(filters.max_price));
    if (filters?.property_type) params.set('property_type', filters.property_type);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/backend';
    const response = await fetch(`${API_BASE}/properties/search?${params.toString()}`);

    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    const properties = (data.data?.properties || []).map(mapApiProperty);
    return { properties, total: data.data?.pagination?.total || properties.length };
  } catch {
    // Fallback to mock data
    return { properties: allProperties, total: allProperties.length };
  }
};

// Fetch single property by ID from API with fallback
export const fetchPropertyById = async (id: string | number): Promise<Property | null> => {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '/backend';
    const response = await fetch(`${API_BASE}/properties/${id}`);
    if (!response.ok) throw new Error('API request failed');

    const data = await response.json();
    return data.data ? mapApiProperty(data.data) : null;
  } catch {
    // Fallback to mock data
    return allProperties.find(p => p.id === Number(id)) || null;
  }
};
