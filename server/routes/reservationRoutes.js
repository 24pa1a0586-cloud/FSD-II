import express from 'express';
import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';

const router = express.Router();

/**
 * Middleware: Check if MongoDB is connected before attempting DB operations
 */
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        'Database is not connected. Please ensure MongoDB is running or verify MONGODB_URI in server/.env.',
    });
  }
  next();
};

router.use(checkDbConnection);

/**
 * Helper: Format today's date as YYYY-MM-DD in local time
 */
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * @route   GET /api/reservations
 * @desc    Retrieve reservations (optional filter by customer email)
 */
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};

    if (email && email.trim() !== '') {
      // Case-insensitive search on email
      query.email = email.trim().toLowerCase();
    }

    const reservations = await Reservation.find(query).sort({
      reservationDate: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reservations. Please try again.',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reservations/:id
 * @desc    Retrieve a single reservation by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation ID format.',
      });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found with the provided ID.',
      });
    }

    return res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.error('Error fetching reservation by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reservation.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/reservations
 * @desc    Create a new table reservation
 */
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      reservationDate,
      reservationTime,
      guests,
      specialRequests,
    } = req.body;

    // 1. Basic field presence validation
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required.',
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required.',
      });
    }

    if (!reservationDate) {
      return res.status(400).json({
        success: false,
        message: 'Reservation date is required.',
      });
    }

    if (!reservationTime) {
      return res.status(400).json({
        success: false,
        message: 'Reservation time is required.',
      });
    }

    const parsedGuests = parseInt(guests, 10);
    if (isNaN(parsedGuests) || parsedGuests < 1 || parsedGuests > 10) {
      return res.status(400).json({
        success: false,
        message: 'Number of guests must be between 1 and 10.',
      });
    }

    // 2. Business Rule: Past date validation
    const todayStr = getTodayDateString();
    if (reservationDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book reservations for past dates. Please pick today or a future date.',
      });
    }

    // 3. Business Rule: Table capacity check per slot
    const maxCapacity = parseInt(process.env.MAX_RESERVATIONS_PER_SLOT || '5', 10);
    const existingConfirmedCount = await Reservation.countDocuments({
      reservationDate,
      reservationTime,
      status: 'Confirmed',
    });

    if (existingConfirmedCount >= maxCapacity) {
      return res.status(400).json({
        success: false,
        message: `The selected slot (${reservationTime} on ${reservationDate}) is fully booked (limit of ${maxCapacity} reservations reached). Please choose a different time or date.`,
      });
    }

    // 4. Create and save new reservation
    const newReservation = new Reservation({
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      reservationDate,
      reservationTime,
      guests: parsedGuests,
      specialRequests: specialRequests ? specialRequests.trim() : '',
      status: 'Confirmed',
    });

    const savedReservation = await newReservation.save();

    return res.status(201).json({
      success: true,
      message: 'Reservation successfully confirmed!',
      data: savedReservation,
    });
  } catch (error) {
    console.error('Error creating reservation:', error);

    // Mongoose validation error handling
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error while creating reservation. Please try again later.',
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /api/reservations/:id/cancel
 * @desc    Cancel an existing reservation (updates status to 'Cancelled')
 */
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation ID format.',
      });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found with the provided ID.',
      });
    }

    // Business Rule: Check if already cancelled
    if (reservation.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This reservation is already cancelled.',
      });
    }

    // Update status to Cancelled (soft cancel, preserving record in MongoDB)
    reservation.status = 'Cancelled';
    await reservation.save();

    return res.status(200).json({
      success: true,
      message: 'Reservation has been cancelled successfully.',
      data: reservation,
    });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while cancelling reservation.',
      error: error.message,
    });
  }
});

export default router;
