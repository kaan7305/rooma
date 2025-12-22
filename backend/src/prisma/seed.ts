import prisma from '../config/database';

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Amenities
  console.log('Creating amenities...');
  const amenities = [
    // Essentials
    { name: 'WiFi', category: 'essentials', icon_name: 'wifi' },
    { name: 'Kitchen', category: 'essentials', icon_name: 'kitchen' },
    { name: 'Heating', category: 'essentials', icon_name: 'heating' },
    { name: 'Air Conditioning', category: 'essentials', icon_name: 'ac' },
    { name: 'Hot Water', category: 'essentials', icon_name: 'hot_water' },

    // Facilities
    { name: 'Washing Machine', category: 'facilities', icon_name: 'washer' },
    { name: 'Dryer', category: 'facilities', icon_name: 'dryer' },
    { name: 'Elevator', category: 'facilities', icon_name: 'elevator' },
    { name: 'Parking', category: 'facilities', icon_name: 'parking' },
    { name: 'Gym', category: 'facilities', icon_name: 'gym' },
    { name: 'Pool', category: 'facilities', icon_name: 'pool' },
    { name: 'Bike Storage', category: 'facilities', icon_name: 'bike' },

    // Features
    { name: 'Desk & Chair', category: 'features', icon_name: 'desk' },
    { name: 'TV', category: 'features', icon_name: 'tv' },
    { name: 'Balcony', category: 'features', icon_name: 'balcony' },
    { name: 'Garden', category: 'features', icon_name: 'garden' },
    { name: 'Dishwasher', category: 'features', icon_name: 'dishwasher' },
    { name: 'Microwave', category: 'features', icon_name: 'microwave' },
    { name: 'Coffee Maker', category: 'features', icon_name: 'coffee' },
    { name: 'Hair Dryer', category: 'features', icon_name: 'hairdryer' },
    { name: 'Iron', category: 'features', icon_name: 'iron' },
    { name: 'Hangers', category: 'features', icon_name: 'hangers' },
    { name: 'Bed Linens', category: 'features', icon_name: 'linens' },
    { name: 'Towels', category: 'features', icon_name: 'towels' },

    // Location
    { name: 'Near Public Transport', category: 'location', icon_name: 'transit' },
    { name: 'Near University', category: 'location', icon_name: 'university' },
    { name: 'Quiet Area', category: 'location', icon_name: 'quiet' },
    { name: 'City Center', category: 'location', icon_name: 'city_center' },
    { name: 'Wheelchair Accessible', category: 'location', icon_name: 'accessible' },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    });
  }

  console.log(`✅ Created ${amenities.length} amenities`);

  // Seed Universities
  console.log('Creating sample universities...');
  const universities = [
    // Germany - Berlin
    {
      name: 'Technical University of Berlin',
      city: 'Berlin',
      country: 'Germany',
      latitude: 52.512,
      longitude: 13.3267,
    },
    {
      name: 'Humboldt University of Berlin',
      city: 'Berlin',
      country: 'Germany',
      latitude: 52.5186,
      longitude: 13.3936,
    },
    {
      name: 'Free University of Berlin',
      city: 'Berlin',
      country: 'Germany',
      latitude: 52.4539,
      longitude: 13.29,
    },

    // UK - London
    {
      name: 'University College London',
      city: 'London',
      country: 'United Kingdom',
      latitude: 51.5246,
      longitude: -0.1340,
    },
    {
      name: 'Imperial College London',
      city: 'London',
      country: 'United Kingdom',
      latitude: 51.4988,
      longitude: -0.1749,
    },
    {
      name: 'London School of Economics',
      city: 'London',
      country: 'United Kingdom',
      latitude: 51.5144,
      longitude: -0.1167,
    },

    // USA - Boston
    {
      name: 'Harvard University',
      city: 'Boston',
      country: 'United States',
      latitude: 42.3770,
      longitude: -71.1167,
    },
    {
      name: 'Massachusetts Institute of Technology',
      city: 'Boston',
      country: 'United States',
      latitude: 42.3601,
      longitude: -71.0942,
    },
    {
      name: 'Boston University',
      city: 'Boston',
      country: 'United States',
      latitude: 42.3505,
      longitude: -71.1054,
    },

    // Spain - Barcelona
    {
      name: 'University of Barcelona',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.3874,
      longitude: 2.1686,
    },
    {
      name: 'Polytechnic University of Catalonia',
      city: 'Barcelona',
      country: 'Spain',
      latitude: 41.3888,
      longitude: 2.1129,
    },

    // USA - New York
    {
      name: 'New York University',
      city: 'New York',
      country: 'United States',
      latitude: 40.7295,
      longitude: -73.9965,
    },
    {
      name: 'Columbia University',
      city: 'New York',
      country: 'United States',
      latitude: 40.8075,
      longitude: -73.9626,
    },
  ];

  for (const university of universities) {
    await prisma.university.upsert({
      where: { id: 'temp' }, // Will fail, causing create
      update: {},
      create: university,
    }).catch(() => {
      // Ignore unique constraint errors, just use create
      return prisma.university.create({ data: university });
    });
  }

  console.log(`✅ Created ${universities.length} universities`);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
