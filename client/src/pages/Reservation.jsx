import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const timeSlots = [
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
];

// Helper to get local date string YYYY-MM-DD
const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Reservation = () => {
  const todayStr = getTodayDateString();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    reservationDate: todayStr,
    reservationTime: '07:30 PM',
    guests: 2,
    specialRequests: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear individual field error upon typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.customerName.trim()) {
      errors.customerName = 'Customer name is required.';
    } else if (formData.customerName.trim().length < 2) {
      errors.customerName = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!/^\d{7,15}$/.test(formData.phone.trim().replace(/[-+\s]/g, ''))) {
      errors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    if (!formData.reservationDate) {
      errors.reservationDate = 'Reservation date is required.';
    } else if (formData.reservationDate < todayStr) {
      errors.reservationDate = 'Reservations cannot be made for past dates.';
    }

    if (!formData.reservationTime) {
      errors.reservationTime = 'Please select a reservation time.';
    }

    const guestCount = parseInt(formData.guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 10) {
      errors.guests = 'Number of guests must be between 1 and 10.';
    }

    return errors;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setConfirmedReservation(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          reservationDate: formData.reservationDate,
          reservationTime: formData.reservationTime,
          guests: parseInt(formData.guests, 10),
          specialRequests: formData.specialRequests.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to complete reservation.');
      }

      // Backend confirmation received
      setConfirmedReservation(data.data);

      // Reset form fields
      setFormData({
        customerName: '',
        email: '',
        phone: '',
        reservationDate: todayStr,
        reservationTime: '07:30 PM',
        guests: 2,
        specialRequests: '',
      });
    } catch (err) {
      console.error('Reservation submission error:', err);
      setErrorMessage(
        err.message ||
          'Could not reach server. Please ensure backend and MongoDB are running.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookAnother = () => {
    setConfirmedReservation(null);
    setErrorMessage('');
  };

  return (
    <div className="reservation-page">
      <header className="page-header">
        <h1 className="page-title">Reserve a Table</h1>
        <p className="page-subtitle">
          Book your dining slot in advance. Enter your contact details and preferred
          timing below.
        </p>
      </header>

      {/* Success Confirmation Card */}
      {confirmedReservation && (
        <div className="reservation-success-card">
          <div className="success-badge-header">
            <span>✓</span> Table Reserved Successfully!
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Thank you, <strong>{confirmedReservation.customerName}</strong>. Your
            reservation has been saved to the database.
          </p>

          <div className="reservation-details-grid">
            <div className="detail-item">
              <strong>Reservation ID</strong>
              <span style={{ fontFamily: 'monospace' }}>
                {confirmedReservation._id}
              </span>
            </div>
            <div className="detail-item">
              <strong>Status</strong>
              <span style={{ color: 'var(--success)' }}>
                ● {confirmedReservation.status}
              </span>
            </div>
            <div className="detail-item">
              <strong>Date & Time</strong>
              <span>
                {confirmedReservation.reservationDate} at{' '}
                {confirmedReservation.reservationTime}
              </span>
            </div>
            <div className="detail-item">
              <strong>Number of Guests</strong>
              <span>{confirmedReservation.guests} Person(s)</span>
            </div>
            <div className="detail-item">
              <strong>Contact Email</strong>
              <span>{confirmedReservation.email}</span>
            </div>
            <div className="detail-item">
              <strong>Contact Phone</strong>
              <span>{confirmedReservation.phone}</span>
            </div>
            {confirmedReservation.specialRequests && (
              <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                <strong>Special Requests</strong>
                <span style={{ fontWeight: 'normal' }}>
                  {confirmedReservation.specialRequests}
                </span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <Link
              to={`/my-reservations?email=${encodeURIComponent(
                confirmedReservation.email
              )}`}
              className="btn btn-primary btn-sm"
            >
              View in My Reservations
            </Link>
            <button
              type="button"
              onClick={handleBookAnother}
              className="btn btn-secondary btn-sm"
            >
              Book Another Table
            </button>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="alert alert-error">
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <div className="alert-title">Reservation Failed</div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Booking Form & Policy Section */}
      <div className="reservation-container">
        {/* Form Card */}
        <div className="card">
          <h2 className="card-title">Booking Details</h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Customer Name */}
            <div className="form-group">
              <label htmlFor="customerName" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                className={`form-input ${
                  formErrors.customerName ? 'input-error' : ''
                }`}
                placeholder="e.g. Rahul Sharma"
                value={formData.customerName}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
              {formErrors.customerName && (
                <div className="form-error">{formErrors.customerName}</div>
              )}
            </div>

            {/* Email and Phone */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input ${
                    formErrors.email ? 'input-error' : ''
                  }`}
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                <div className="form-helper">Used to search & manage your booking</div>
                {formErrors.email && (
                  <div className="form-error">{formErrors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`form-input ${
                    formErrors.phone ? 'input-error' : ''
                  }`}
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.phone && (
                  <div className="form-error">{formErrors.phone}</div>
                )}
              </div>
            </div>

            {/* Date, Time, and Guests */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reservationDate" className="form-label">
                  Date <span className="required">*</span>
                </label>
                <input
                  id="reservationDate"
                  name="reservationDate"
                  type="date"
                  min={todayStr}
                  className={`form-input ${
                    formErrors.reservationDate ? 'input-error' : ''
                  }`}
                  value={formData.reservationDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
                {formErrors.reservationDate && (
                  <div className="form-error">{formErrors.reservationDate}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reservationTime" className="form-label">
                  Time Slot <span className="required">*</span>
                </label>
                <select
                  id="reservationTime"
                  name="reservationTime"
                  className={`form-select ${
                    formErrors.reservationTime ? 'input-error' : ''
                  }`}
                  value={formData.reservationTime}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {formErrors.reservationTime && (
                  <div className="form-error">{formErrors.reservationTime}</div>
                )}
              </div>
            </div>

            {/* Number of Guests */}
            <div className="form-group">
              <label htmlFor="guests" className="form-label">
                Number of Guests (1–10) <span className="required">*</span>
              </label>
              <select
                id="guests"
                name="guests"
                className={`form-select ${
                  formErrors.guests ? 'input-error' : ''
                }`}
                value={formData.guests}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest (Individual Table)' : 'Guests'}
                  </option>
                ))}
              </select>
              {formErrors.guests && (
                <div className="form-error">{formErrors.guests}</div>
              )}
            </div>

            {/* Special Requests */}
            <div className="form-group">
              <label htmlFor="specialRequests" className="form-label">
                Special Requests <span style={{ color: 'var(--text-muted)' }}>(Optional)</span>
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                className="form-textarea"
                rows="3"
                placeholder="e.g. Window seat, baby chair, anniversary celebration, etc."
                value={formData.specialRequests}
                onChange={handleChange}
                disabled={isSubmitting}
                maxLength="300"
              />
              <div className="form-helper">Maximum 300 characters</div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Confirming with Server...' : 'Confirm Reservation'}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="booking-summary-box">
          <h3 className="summary-heading">Booking Terms</h3>
          <ul className="summary-rules-list">
            <li>
              <strong>Instant Confirmation:</strong> Reservations are directly saved
              to MongoDB. No payment required.
            </li>
            <li>
              <strong>Capacity Control:</strong> To maintain quality service, our system
              limits concurrent reservations per time slot.
            </li>
            <li>
              <strong>Grace Period:</strong> We hold reserved tables for 15 minutes past
              your selected arrival time.
            </li>
            <li>
              <strong>Cancellation:</strong> Plans changed? Easily cancel your table in
              the <em>My Reservations</em> section anytime without penalty.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
