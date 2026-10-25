import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      minlength: [7, 'Phone number must be at least 7 digits'],
      maxlength: [15, 'Phone number cannot exceed 15 digits'],
    },
    reservationDate: {
      type: String,
      required: [true, 'Reservation date is required'],
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        'Reservation date must be in YYYY-MM-DD format',
      ],
    },
    reservationTime: {
      type: String,
      required: [true, 'Reservation time is required'],
      trim: true,
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'At least 1 guest is required'],
      max: [10, 'Maximum table capacity is 10 guests per reservation'],
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [300, 'Special requests cannot exceed 300 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Confirmed', 'Cancelled'],
        message: 'Status must be either Confirmed or Cancelled',
      },
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly search reservations by email
reservationSchema.index({ email: 1, reservationDate: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
