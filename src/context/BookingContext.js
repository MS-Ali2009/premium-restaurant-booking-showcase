import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BookingContext = createContext();

const STORAGE_KEY = 'luxury_restaurant_bookings';
const MAX_TABLES_PER_SLOT = 10;

function getStoredBookings() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(getStoredBookings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }, [bookings]);

  const getAvailability = useCallback((date) => {
    const slots = {};
    const timeSlots = [];
    for (let h = 11; h <= 22; h++) {
      timeSlots.push(`${h.toString().padStart(2, '0')}:00`);
      timeSlots.push(`${h.toString().padStart(2, '0')}:30`);
    }

    timeSlots.forEach((time) => {
      const booked = bookings.filter(
        (b) => b.date === date && b.time === time && b.status !== 'cancelled'
      ).length;
      slots[time] = {
        available: MAX_TABLES_PER_SLOT - booked,
        total: MAX_TABLES_PER_SLOT,
        isFull: booked >= MAX_TABLES_PER_SLOT,
      };
    });
    return slots;
  }, [bookings]);

  const createBooking = useCallback((bookingData) => {
    const newBooking = {
      ...bookingData,
      id: uuidv4(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      scanned: false,
    };
    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  }, []);

  const cancelBooking = useCallback((id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b))
    );
  }, []);

  const getBookingById = useCallback((id) => {
    return bookings.find((b) => b.id === id) || null;
  }, [bookings]);

  const markScanned = useCallback((id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, scanned: true } : b))
    );
  }, []);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        getAvailability,
        createBooking,
        cancelBooking,
        getBookingById,
        markScanned,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
