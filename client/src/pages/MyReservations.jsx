import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

const MyReservations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [searchEmail, setSearchEmail] = useState(emailParam);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Cancellation modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Auto-search if email query param exists on load
  useEffect(() => {
    if (emailParam && emailParam.trim() !== '') {
      fetchReservations(emailParam.trim());
    }
  }, [emailParam]);

  // Fetch reservations from API
  const fetchReservations = async (emailToFetch) => {
    if (!emailToFetch || !emailToFetch.trim()) {
      setErrorMessage('Please enter an email address to search.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessBanner('');
    setHasSearched(true);

    try {
      const response = await fetch(
        `/api/reservations?email=${encodeURIComponent(emailToFetch.trim())}`
      );
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch reservations.');
      }

      setReservations(data.data || []);
      // Sync URL search params
      setSearchParams({ email: emailToFetch.trim() });
    } catch (err) {
      console.error('Fetch reservations error:', err);
      setErrorMessage(
        err.message ||
          'Could not retrieve reservations. Please ensure the backend and MongoDB are running.'
      );
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReservations(searchEmail);
  };

  // Open cancel modal
  const promptCancel = (res) => {
    setSelectedReservation(res);
    setCancelModalOpen(true);
  };

  // Confirm cancel action
  const confirmCancel = async () => {
    if (!selectedReservation) return;

    setIsCancelling(true);
    setErrorMessage('');
    setSuccessBanner('');

    try {
      const response = await fetch(
        `/api/reservations/${selectedReservation._id}/cancel`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Cancellation failed.');
      }

      // Update state locally with the updated reservation from DB
      setReservations((prev) =>
        prev.map((item) =>
          item._id === selectedReservation._id
            ? { ...item, status: 'Cancelled' }
            : item
        )
      );

      setSuccessBanner(
        `Reservation #${selectedReservation._id.slice(-6)} has been cancelled successfully.`
      );
      setCancelModalOpen(false);
      setSelectedReservation(null);
    } catch (err) {
      console.error('Cancellation error:', err);
      setErrorMessage(err.message || 'Failed to cancel reservation.');
      setCancelModalOpen(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="my-reservations-page">
      <header className="page-header">
        <h1 className="page-title">My Reservations</h1>
        <p className="page-subtitle">
          Lookup and manage your existing table bookings using the email address you
          provided during reservation.
        </p>
      </header>

      {/* Lookup Card */}
      <div className="card lookup-card">
        <h2 className="card-title">Search Bookings by Email</h2>
        <form onSubmit={handleSearchSubmit} className="lookup-form">
          <input
            type="email"
            className="form-input"
            placeholder="Enter your email (e.g. rahul@example.com)"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ whiteSpace: 'nowrap' }}
          >
            {isLoading ? 'Searching...' : 'Find Reservations'}
          </button>
        </form>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="alert alert-success">
          <span>✓</span>
          <div>
            <div className="alert-title">Cancellation Confirmed</div>
            <div>{successBanner}</div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMessage && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <div>
            <div className="alert-title">Notice</div>
            <div>{errorMessage}</div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Retrieving reservations from database...
          </p>
        </div>
      ) : hasSearched && reservations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h2 className="empty-title">No Reservations Found</h2>
          <p className="empty-desc">
            No table bookings were found for <strong>{searchEmail}</strong>. Make sure
            you used the correct email address or book a new table below.
          </p>
          <Link to="/reserve" className="btn btn-primary btn-sm">
            Book a New Table
          </Link>
        </div>
      ) : (
        reservations.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
              }}
            >
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600 }}>
                Reservations for {searchEmail} ({reservations.length})
              </h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => fetchReservations(searchEmail)}
              >
                ↻ Refresh List
              </button>
            </div>

            <div className="reservations-list">
              {reservations.map((res) => {
                const isConfirmed = res.status === 'Confirmed';
                return (
                  <div key={res._id} className="reservation-card">
                    <div className="res-header">
                      <div>
                        <strong style={{ fontSize: '1.05rem', marginRight: '10px' }}>
                          {res.customerName}
                        </strong>
                        <span className="res-id">ID: {res._id}</span>
                      </div>
                      <StatusBadge status={res.status} />
                    </div>

                    <div className="res-grid">
                      <div className="detail-item">
                        <strong>Date & Time</strong>
                        <span>
                          {res.reservationDate} at {res.reservationTime}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Guests</strong>
                        <span>
                          {res.guests} {res.guests === 1 ? 'Guest' : 'Guests'}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Phone</strong>
                        <span>{res.phone}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Email</strong>
                        <span>{res.email}</span>
                      </div>
                    </div>

                    {res.specialRequests && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-main)',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.88rem',
                        }}
                      >
                        <strong style={{ color: 'var(--text-muted)' }}>
                          Special Requests:{' '}
                        </strong>
                        <span>{res.specialRequests}</span>
                      </div>
                    )}

                    <div className="res-footer">
                      <span>
                        Booked on:{' '}
                        {res.createdAt
                          ? new Date(res.createdAt).toLocaleString()
                          : 'N/A'}
                      </span>

                      {isConfirmed ? (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => promptCancel(res)}
                        >
                          Cancel Reservation
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>
                          Reservation Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalOpen && selectedReservation && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h3 className="modal-title">Confirm Cancellation</h3>
            <p className="modal-body">
              Are you sure you want to cancel your table reservation for{' '}
              <strong>
                {selectedReservation.reservationDate} at{' '}
                {selectedReservation.reservationTime}
              </strong>{' '}
              for <strong>{selectedReservation.guests} guest(s)</strong>?
              <br />
              <br />
              <em>
                Note: In accordance with our policy, the booking status will be updated
                to "Cancelled" in the database.
              </em>
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCancelModalOpen(false)}
                disabled={isCancelling}
              >
                Keep Reservation
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={confirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReservations;
