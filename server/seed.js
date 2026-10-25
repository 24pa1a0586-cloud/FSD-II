import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Reservation from './models/Reservation.js';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant_db';

const sampleReservations = [
  {
    customerName: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '9876543210',
    reservationDate: '2026-10-30',
    reservationTime: '07:30 PM',
    guests: 4,
    specialRequests: 'Corner booth preferred, celebrating family birthday.',
    status: 'Confirmed',
  },
  {
    customerName: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone: '9123456780',
    reservationDate: '2026-10-31',
    reservationTime: '08:00 PM',
    guests: 2,
    specialRequests: 'Quiet table for two.',
    status: 'Confirmed',
  },
  {
    customerName: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '9876543210',
    reservationDate: '2026-10-28',
    reservationTime: '01:00 PM',
    guests: 3,
    specialRequests: '',
    status: 'Cancelled',
  },
];

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB.');

    // Clear existing sample reservations
    await Reservation.deleteMany({});
    console.log('Cleared existing reservations.');

    // Insert sample reservations
    const inserted = await Reservation.insertMany(sampleReservations);
    console.log(` Successfully inserted ${inserted.length} sample reservations:`);
    inserted.forEach((item) => {
      console.log(
        `- [${item.status}] ${item.customerName} (${item.email}) on ${item.reservationDate} at ${item.reservationTime}`
      );
    });

    console.log('\nSeed completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    console.log('Tip: Ensure MongoDB is running and MONGODB_URI in server/.env is valid.');
    process.exit(1);
  }
};

seedData();
