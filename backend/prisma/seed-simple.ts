import prisma from '../src/config/database';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create a test user
  console.log('👥 Creating test user...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const testUser = await prisma.user.create({
    data: {
      email: 'test@nestquarter.com',
      password_hash: hashedPassword,
      first_name: 'Test',
      last_name: 'User',
      phone: '+14155551234',
      date_of_birth: new Date('1995-01-01'),
      user_type: 'both',
    },
  });

  console.log(`✅ Created test user: ${testUser.email}\n`);

  // Create a university
  console.log('🏫 Creating university...');
  const harvard = await prisma.university.create({
    data: {
      name: 'Harvard University',
      city: 'Cambridge',
      country: 'United States',
      latitude: 42.3770,
      longitude: -71.1167,
    },
  });

  console.log(`✅ Created university: ${harvard.name}\n`);

  console.log('✨ Seed completed successfully!\n');
  console.log('🔐 Login Credentials:');
  console.log('   Email: test@nestquarter.com');
  console.log('   Password: Password123!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
