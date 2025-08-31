import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  serviceName: string;
  totalAmount: number;
  commissionAmount: number;
  providerAmount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceName: string;
  customerName: string;
  providerName: string;
  customerPhone: string;
  providerPhone: string;
  location: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  timestamp: Date;
}

interface PaymentContextType {
  bookings: Booking[];
  payments: Payment[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'timestamp' | 'status'>) => Booking;
  processPayment: (bookingId: string) => Payment;
  getBookingsByUser: (userId: string) => Booking[];
  getPaymentsByUser: (userId: string) => Payment[];
  calculateCommission: (amount: number) => { commission: number; providerAmount: number };
  // Admin functions
  getAllBookings: () => Booking[];
  getAllPayments: () => Payment[];
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  getPendingBookings: () => Booking[];
  // Local storage functions
  clearAllData: () => void;
  exportData: () => { bookings: Booking[]; payments: Payment[] };
  importData: (data: { bookings: Booking[]; payments: Payment[] }) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Load data from localStorage on mount
  React.useEffect(() => {
    try {
      const savedBookings = localStorage.getItem('bookings');
      const savedPayments = localStorage.getItem('payments');
      
      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings);
        // Convert timestamp strings back to Date objects
        const bookingsWithDates = parsedBookings.map((booking: any) => ({
          ...booking,
          timestamp: new Date(booking.timestamp)
        }));
        setBookings(bookingsWithDates);
      }
      
      if (savedPayments) {
        const parsedPayments = JSON.parse(savedPayments);
        // Convert timestamp strings back to Date objects
        const paymentsWithDates = parsedPayments.map((payment: any) => ({
          ...payment,
          timestamp: new Date(payment.timestamp)
        }));
        setPayments(paymentsWithDates);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  const saveToLocalStorage = (newBookings: Booking[], newPayments: Payment[]) => {
    try {
      localStorage.setItem('bookings', JSON.stringify(newBookings));
      localStorage.setItem('payments', JSON.stringify(newPayments));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const calculateCommission = (amount: number) => {
    const commission = amount * 0.10; // 10% commission
    const providerAmount = amount - commission;
    return { commission, providerAmount };
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'timestamp' | 'status'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: 'pending',
    };
    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    saveToLocalStorage(updatedBookings, payments);
    return newBooking;
  };

  const processPayment = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const { commission, providerAmount } = calculateCommission(booking.amount);

    const payment: Payment = {
      id: Date.now().toString(),
      bookingId,
      customerId: booking.customerId,
      providerId: booking.providerId,
      serviceName: booking.serviceName,
      totalAmount: booking.amount,
      commissionAmount: commission,
      providerAmount,
      status: 'completed',
      timestamp: new Date(),
    };

    const updatedPayments = [payment, ...payments];
    setPayments(updatedPayments);

    // Update booking status
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'confirmed' as const } : b
    );
    setBookings(updatedBookings);
    
    saveToLocalStorage(updatedBookings, updatedPayments);
    return payment;
  };

  const getBookingsByUser = (userId: string) => {
    return bookings.filter(b => b.customerId === userId || b.providerId === userId);
  };

  const getPaymentsByUser = (userId: string) => {
    return payments.filter(p => p.customerId === userId || p.providerId === userId);
  };

  // Admin functions
  const getAllBookings = () => {
    return bookings;
  };

  const getAllPayments = () => {
    return payments;
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    const updatedBookings = bookings.map(b =>
      b.id === bookingId ? { ...b, status } : b
    );
    setBookings(updatedBookings);
    saveToLocalStorage(updatedBookings, payments);
  };

  const getPendingBookings = () => {
    return bookings.filter(b => b.status === 'pending');
  };

  // Local storage management functions
  const clearAllData = () => {
    setBookings([]);
    setPayments([]);
    localStorage.removeItem('bookings');
    localStorage.removeItem('payments');
  };

  const exportData = () => {
    return { bookings, payments };
  };

  const importData = (data: { bookings: Booking[]; payments: Payment[] }) => {
    const bookingsWithDates = data.bookings.map(booking => ({
      ...booking,
      timestamp: new Date(booking.timestamp)
    }));
    const paymentsWithDates = data.payments.map(payment => ({
      ...payment,
      timestamp: new Date(payment.timestamp)
    }));
    
    setBookings(bookingsWithDates);
    setPayments(paymentsWithDates);
    saveToLocalStorage(bookingsWithDates, paymentsWithDates);
  };

  return (
    <PaymentContext.Provider
      value={{
        bookings,
        payments,
        createBooking,
        processPayment,
        getBookingsByUser,
        getPaymentsByUser,
        calculateCommission,
        getAllBookings,
        getAllPayments,
        updateBookingStatus,
        getPendingBookings,
        clearAllData,
        exportData,
        importData,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}; 