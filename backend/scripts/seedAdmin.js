const prisma = require('../src/config/prisma');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const email = 'sohanmandal2005@gmail.com';
  const password = 'sohanpassword';
  const name = 'Admin User';

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('Admin user already exists.');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create the admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password_hash,
        role: 'admin',
      },
    });

    console.log('Admin user seeded successfully:', admin.email);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
