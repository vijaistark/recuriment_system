const mongoose = require('mongoose');

async function connectDb() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recruitment_system';
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB || undefined,
  });
  console.log('MongoDB connected');
}

module.exports = { connectDb };


