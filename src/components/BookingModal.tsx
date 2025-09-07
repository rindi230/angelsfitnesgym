
import { useState } from 'react';
import { X, User, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useBooking } from '@/contexts/BookingContext';
import { validateEmail, validateName, validateAlbanianPhone, formatAlbanianPhone, cleanPhoneInput } from '@/lib/validation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: number;
  className: string;
  onBookingComplete: () => void;
}

export const BookingModal = ({ isOpen, onClose, classId, className, onBookingComplete }: BookingModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{name?: string; email?: string; phone?: string}>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const { addBooking } = useBooking();

  // Debug logging
  console.log('BookingModal props:', { isOpen, classId, className });

  if (!isOpen) return null;

  // Validation functions
  const validateForm = () => {
    const newErrors: {name?: string; email?: string; phone?: string} = {};
    
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }
    
    const phoneValidation = validateAlbanianPhone(phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      const validation = validateName(value);
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, name: undefined }));
      }
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      const validation = validateEmail(value);
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = cleanPhoneInput(value);
    setPhone(cleaned);
    if (errors.phone) {
      const validation = validateAlbanianPhone(cleaned);
      if (validation.isValid) {
        setErrors(prev => ({ ...prev, phone: undefined }));
      }
    }
  };

  const sendBookingNotification = async (customerName: string, customerEmail: string, customerPhone: string) => {
    try {
      console.log('Sending booking notification with:', {
        customerName,
        customerEmail,
        customerPhone,
        className,
        classId,
        bookingTime: new Date().toLocaleString()
      });
      
      const { data, error } = await supabase.functions.invoke('send-booking-notification', {
        body: {
          customerName,
          customerEmail,
          customerPhone,
          className: className,
          classId: classId,
          bookingTime: new Date().toLocaleString()
        }
      });

      if (error) {
        console.error('Error sending booking notification:', error);
      } else {
        console.log('Booking notification sent successfully:', data);
      }
    } catch (error) {
      console.error('Failed to send booking notification:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save booking to database
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id || null,
          class_id: classId,
          customer_name: name.trim(),
          customer_email: email.trim(),
        });

      if (bookingError) {
        console.error('Error saving booking:', bookingError);
        toast({
          title: "Booking Error",
          description: "Failed to save your booking. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Send email notification
      await sendBookingNotification(name.trim(), email.trim(), phone);
      
      // Add to local booking context for immediate admin panel update
      addBooking(classId, className, name.trim(), email.trim());
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking for ${className} has been confirmed.`,
      });

      onBookingComplete();
      setName('');
      setEmail('');
      setPhone('');
      setErrors({});
      onClose();
      
      // Dispatch custom event to notify other components about new booking
      window.dispatchEvent(new CustomEvent('bookingUpdated'));
    } catch (error) {
      console.error('Error processing booking:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your booking.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Book Class: {className}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
              required
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Gmail Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your Gmail address (example@gmail.com)"
              required
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Albanian Phone Number
            </label>
            <input
              type="tel"
              value={formatAlbanianPhone(phone)}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+355 6X XXX XXX"
              required
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              disabled={isSubmitting || !name.trim() || !email.trim() || !phone.trim() || Object.keys(errors).length > 0}
            >
              {isSubmitting ? 'Booking...' : 'Book Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
