
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingRecord {
  id: string;
  classId: number;
  className: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  bookingTime: string;
}

interface BookingContextType {
  bookings: BookingRecord[];
  addBooking: (classId: number, className: string, customerName: string, customerEmail: string) => void;
  getBookingsForClass: (classId: number) => BookingRecord[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  const addBooking = (classId: number, className: string, customerName: string, customerEmail: string) => {
    const newBooking: BookingRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      classId,
      className,
      customerName,
      customerEmail,
      bookingDate: new Date().toLocaleDateString(),
      bookingTime: new Date().toLocaleTimeString()
    };
    
    setBookings(prev => [newBooking, ...prev]);
    console.log(`New booking added:`, newBooking);
  };

  const getBookingsForClass = (classId: number) => {
    return bookings.filter(booking => booking.classId === classId);
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      addBooking,
      getBookingsForClass
    }}>
      {children}
    </BookingContext.Provider>
  );
};
