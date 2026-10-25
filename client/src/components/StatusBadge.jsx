import React from 'react';

/**
 * StatusBadge component displays the reservation state: Confirmed or Cancelled
 */
const StatusBadge = ({ status }) => {
  const isConfirmed = status === 'Confirmed';
  return (
    <span
      className={`badge ${
        isConfirmed ? 'badge-confirmed' : 'badge-cancelled'
      }`}
    >
      {isConfirmed ? '● Confirmed' : '✕ Cancelled'}
    </span>
  );
};

export default StatusBadge;
