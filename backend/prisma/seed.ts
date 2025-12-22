import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data (in development only!)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.wishlistItem.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.review.deleteMany();
    await prisma.payout.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.propertyUniversity.deleteMany();
    await prisma.propertyPhoto.deleteMany();
    await prisma.propertyAvailability.deleteMany();
    await prisma.property.deleteMany();
    await prisma.university.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Cleaned existing data\n');
  }

  // Create Universities
  console.log('🏫 Creating universities...');
  const harvard = await prisma.university.create({
    data: {
      name: 'Harvard University',
      city: 'Cambridge',
      country: 'United States',
      latitude: 42.3770,
      longitude: -71.1167,
    },
  });

  const mit = await prisma.university.create({
    data: {
      name: 'Massachusetts Institute of Technology',
      city: 'Cambridge',
      country: 'United States',
      latitude: 42.3601,
      longitude: -71.0942,
    },
  });

  const stanford = await prisma.university.create({
    data: {
      name: 'Stanford University',
      city: 'Stanford',
      country: 'United States',
      latitude: 37.4275,
      longitude: -122.1697,
    },
  });

  console.log(`✅ Created 3 universities: ${harvard.name}, ${mit.name}, ${stanford.name}\n`);

  // Create Users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const host1 = await prisma.user.create({
    data: {
      email: 'host1@nestquarter.com',
      password_hash: hashedPassword,
      first_name: 'John',
      last_name: 'Smith',
      phone_number: '+14155551234',
      date_of_birth: new Date('1985-06-15'),
      profile_photo_url: 'https://i.pravatar.cc/150?img=12',
      bio: 'Experienced host with 5+ years. Love welcoming students!',
    },
  });

  const host2 = await prisma.user.create({
    data: {
      email: 'host2@nestquarter.com',
      password_hash: hashedPassword,
      first_name: 'Sarah',
      last_name: 'Johnson',
      phone_number: '+14155555678',
      date_of_birth: new Date('1990-03-22'),
      profile_photo_url: 'https://i.pravatar.cc/150?img=5',
      bio: 'Student housing specialist. Clean, safe, affordable.',
    },
  });

  const guest1 = await prisma.user.create({
    data: {
      email: 'student1@nestquarter.com',
      password_hash: hashedPassword,
      first_name: 'Emily',
      last_name: 'Chen',
      phone_number: '+14155559012',
      date_of_birth: new Date('2002-09-10'),
      profile_photo_url: 'https://i.pravatar.cc/150?img=9',
      bio: 'MBA student at Harvard. Looking for quiet study space.',
    },
  });

  const guest2 = await prisma.user.create({
    data: {
      email: 'student2@nestquarter.com',
      password_hash: hashedPassword,
      first_name: 'Michael',
      last_name: 'Rodriguez',
      phone_number: '+14155553456',
      date_of_birth: new Date('2001-11-28'),
      profile_photo_url: 'https://i.pravatar.cc/150?img=13',
      bio: 'CS grad student at MIT. Clean and responsible.',
    },
  });

  console.log(`✅ Created ${4} users\n`);

  // Create Properties
  console.log('🏠 Creating properties...');
  const property1 = await prisma.property.create({
    data: {
      host_id: host1.id,
      title: 'Cozy Studio Near Harvard Square',
      description: 'Beautiful studio apartment perfect for students. 10 min walk to Harvard Yard. Fully furnished with high-speed WiFi, kitchen, and laundry. Quiet neighborhood, perfect for studying.',
      property_type: 'ENTIRE_PLACE',
      street_address: '123 Brattle Street',
      city: 'Cambridge',
      state: 'MA',
      postal_code: '02138',
      country: 'United States',
      latitude: 42.3736,
      longitude: -71.1197,
      bedrooms: 1,
      bathrooms: 1,
      max_guests: 2,
      square_feet: 450,
      monthly_price_cents: 180000, // $1,800/month
      cleaning_fee_cents: 7500, // $75
      security_deposit_cents: 180000,
      amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Desk', 'Heating', 'AC'],
      house_rules: ['No smoking', 'No parties', 'Quiet hours 10pm-8am'],
      status: 'active',
      photos: {
        create: [
          {
            photo_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            display_order: 1,
          },
          {
            photo_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            display_order: 2,
          },
        ],
      },
    },
  });

  const property2 = await prisma.property.create({
    data: {
      host_id: host1.id,
      title: 'Modern Private Room - MIT Area',
      description: 'Private bedroom in shared apartment. 5 min from MIT campus. Includes desk, closet, and fast WiFi. Share kitchen and bathroom with one other student. Great community!',
      property_type: 'PRIVATE_ROOM',
      street_address: '456 Massachusetts Avenue',
      city: 'Cambridge',
      state: 'MA',
      postal_code: '02139',
      country: 'United States',
      latitude: 42.3613,
      longitude: -71.0897,
      bedrooms: 1,
      bathrooms: 1,
      max_guests: 1,
      square_feet: 200,
      monthly_price_cents: 120000, // $1,200/month
      cleaning_fee_cents: 5000, // $50
      security_deposit_cents: 120000,
      amenities: ['WiFi', 'Kitchen', 'Desk', 'Heating', 'AC', 'Shared bathroom'],
      house_rules: ['No smoking', 'No overnight guests', 'Clean shared spaces'],
      status: 'active',
      photos: {
        create: [
          {
            photo_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            display_order: 1,
          },
        ],
      },
    },
  });

  const property3 = await prisma.property.create({
    data: {
      host_id: host2.id,
      title: 'Spacious 2BR Apartment - Harvard Medical School',
      description: 'Large 2-bedroom apartment perfect for 2 students. Walking distance to Harvard Medical School and Longwood Medical Area. Renovated kitchen, in-unit laundry, parking available.',
      property_type: 'ENTIRE_PLACE',
      street_address: '789 Longwood Avenue',
      city: 'Boston',
      state: 'MA',
      postal_code: '02115',
      country: 'United States',
      latitude: 42.3372,
      longitude: -71.1045,
      bedrooms: 2,
      bathrooms: 1,
      max_guests: 3,
      square_feet: 850,
      monthly_price_cents: 280000, // $2,800/month
      cleaning_fee_cents: 10000, // $100
      security_deposit_cents: 280000,
      amenities: ['WiFi', 'Kitchen', 'Washer', 'Dryer', 'Parking', 'Heating', 'AC', 'Dishwasher'],
      house_rules: ['No smoking', 'No pets', 'Quiet hours 10pm-7am'],
      status: 'active',
      photos: {
        create: [
          {
            photo_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
            display_order: 1,
          },
          {
            photo_url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            display_order: 2,
          },
          {
            photo_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            display_order: 3,
          },
        ],
      },
    },
  });

  console.log(`✅ Created ${3} properties\n`);

  // Link Properties to Universities
  console.log('🔗 Linking properties to universities...');
  await prisma.propertyUniversity.createMany({
    data: [
      { property_id: property1.id, university_id: harvard.id, distance_km: 0.8, transit_minutes: 10 },
      { property_id: property1.id, university_id: mit.id, distance_km: 2.1, transit_minutes: 15 },
      { property_id: property2.id, university_id: mit.id, distance_km: 0.4, transit_minutes: 5 },
      { property_id: property2.id, university_id: harvard.id, distance_km: 1.9, transit_minutes: 12 },
      { property_id: property3.id, university_id: harvard.id, distance_km: 1.5, transit_minutes: 20 },
    ],
  });
  console.log('✅ Linked properties to universities\n');

  // Create Property Availability
  console.log('📅 Setting property availability...');
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-12-31');

  await prisma.propertyAvailability.createMany({
    data: [
      { property_id: property1.id, start_date: startDate, end_date: endDate },
      { property_id: property2.id, start_date: startDate, end_date: endDate },
      { property_id: property3.id, start_date: startDate, end_date: endDate },
    ],
  });
  console.log('✅ Set availability for all properties\n');

  // Create a completed booking
  console.log('📝 Creating sample bookings...');
  const booking1 = await prisma.booking.create({
    data: {
      property_id: property1.id,
      guest_id: guest1.id,
      host_id: host1.id,
      check_in_date: new Date('2025-01-15'),
      check_out_date: new Date('2025-05-15'),
      nights: 120,
      subtotal_cents: 720000, // $7,200 (4 months)
      service_fee_cents: 72000, // $720
      cleaning_fee_cents: 7500, // $75
      security_deposit_cents: 180000,
      total_cents: 799500,
      booking_status: 'completed',
      payment_status: 'completed',
      number_of_guests: 1,
    },
  });

  console.log(`✅ Created sample booking\n`);

  // Create Reviews
  console.log('⭐ Creating reviews...');
  await prisma.review.create({
    data: {
      booking_id: booking1.id,
      reviewer_id: guest1.id,
      reviewee_id: host1.id,
      property_id: property1.id,
      rating: 5,
      review_text: 'Amazing place! Perfect for studying. John was a great host, very responsive and helpful. The location near Harvard is unbeatable. Highly recommend!',
      cleanliness_rating: 5,
      communication_rating: 5,
      checkin_rating: 5,
      accuracy_rating: 5,
      location_rating: 5,
      value_rating: 5,
    },
  });

  console.log('✅ Created reviews\n');

  // Create Wishlist
  console.log('❤️ Creating wishlists...');
  const wishlist = await prisma.wishlist.create({
    data: {
      user_id: guest2.id,
      name: 'My Favorites',
      items: {
        create: [
          { property_id: property1.id },
          { property_id: property3.id },
        ],
      },
    },
  });

  console.log(`✅ Created wishlist: ${wishlist.name} with ${wishlist.items.length} items\n`);

  console.log('✨ Seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - ${3} Universities`);
  console.log(`   - ${4} Users`);
  console.log(`   - ${3} Properties`);
  console.log(`   - ${1} Booking`);
  console.log(`   - ${1} Review`);
  console.log(`   - ${1} Wishlist\n`);
  console.log('🔐 Login Credentials (all users):');
  console.log('   Password: Password123!');
  console.log('   Emails: host1@nestquarter.com, host2@nestquarter.com,');
  console.log('           student1@nestquarter.com, student2@nestquarter.com\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
