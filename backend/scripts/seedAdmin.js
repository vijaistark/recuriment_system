const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDb } = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await connectDb();
    const name = process.env.SEED_ADMIN_NAME || 'Admin';
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', email);
      process.exit(0);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash, role: 'admin', isPresent: true });
    console.log('Seeded admin user');
    console.log('Email:', email);
    console.log('Password:', password);
    process.exit(0);
  } catch (e) {
    console.error('Seed failed', e);
    process.exit(1);
  }
})();


