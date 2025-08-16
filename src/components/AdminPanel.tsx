import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, Mail, User, X, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingRecord {
  id: string;
  class_id: number;
  class_name: string;
  customer_name: string;
  customer_email: string;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
}

interface ClassItem {
  id: number;
  name: string;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel = ({ isOpen, onClose }: AdminPanelProps) => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
      fetchClasses();
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for booking updates
    const handleBookingUpdate = () => {
      if (isOpen) {
        fetchBookings();
      }
    };
    
    window.addEventListener('bookingUpdated', handleBookingUpdate);
    
    return () => {
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
    };
  }, [isOpen]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching bookings...');
      
      // First get all bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Bookings data:', bookingsData);
      console.log('Bookings error:', bookingsError);

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        toast({
          title: "Error",
          description: "Failed to load bookings. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Then get all classes for mapping
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('id, name');

      console.log('Classes data:', classesData);
      console.log('Classes error:', classesError);

      if (classesError) {
        console.error('Error fetching classes:', classesError);
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Create a map of class IDs to names
      const classMap = new Map(classesData?.map(cls => [cls.id, cls.name]) || []);

      // Transform the data to match our interface
      const transformedBookings = bookingsData?.map(booking => ({
        id: booking.id,
        class_id: booking.class_id,
        class_name: classMap.get(booking.class_id) || 'Unknown Class',
        customer_name: booking.customer_name,
        customer_email: booking.customer_email,
        booking_date: new Date(booking.booking_date).toLocaleDateString(),
        booking_time: new Date(booking.booking_time).toLocaleTimeString(),
        status: booking.status,
        created_at: new Date(booking.created_at).toLocaleString()
      })) || [];

      console.log('Transformed bookings:', transformedBookings);
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('active', true)
        .order('name');

      if (error) {
        console.error('Error fetching classes:', error);
        return;
      }

      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchBookingCount = async () => {
    try {
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching booking count:', error);
        return;
      }

      console.log('Updated booking count:', count);
    } catch (error) {
      console.error('Error fetching booking count:', error);
    }
  };

  if (!isOpen) return null;

  const filteredBookings = selectedClass 
    ? bookings.filter(booking => booking.class_id === selectedClass)
    : bookings;

  const uniqueCustomers = new Set(bookings.map(b => b.customer_email)).size;
  const todayBookings = bookings.filter(booking => {
    const today = new Date().toDateString();
    return new Date(booking.booking_date).toDateString() === today;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-red-600 text-white">
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>Admin Panel - Class Bookings</span>
          </h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchBookings}
              disabled={isLoading}
              className="text-white hover:text-red-200 transition-colors disabled:opacity-50"
              title="Refresh bookings"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={async () => {
                // Test creating a booking
                const { data, error } = await supabase
                  .from('bookings')
                  .insert({
                    class_id: 1,
                    customer_name: 'Test User',
                    customer_email: 'test@example.com',
                    status: 'confirmed'
                  });
                console.log('Test booking result:', data, error);
                if (!error) {
                  fetchBookings();
                  fetchBookingCount();
                  // Dispatch event to update navbar count
                  window.dispatchEvent(new CustomEvent('bookingUpdated'));
                }
              }}
              className="text-white hover:text-red-200 transition-colors"
              title="Test booking"
            >
              Test
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-red-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedClass(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedClass === null 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Classes
            </button>
            {classes.map(cls => (
              <button
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedClass === cls.id 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cls.name}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{bookings.length}</div>
                <div className="text-gray-600">Total Bookings</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{uniqueCustomers}</div>
                <div className="text-gray-600">Unique Customers</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{todayBookings.length}</div>
                <div className="text-gray-600">Today's Bookings</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedClass ? filteredBookings.length : bookings.length}
                </div>
                <div className="text-gray-600">
                  {selectedClass ? 'Class Bookings' : 'All Bookings'}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {selectedClass 
                    ? 'No bookings found for this class' 
                    : 'No bookings found'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <div>
                          <div className="font-semibold text-gray-900">{booking.class_name}</div>
                          <div className="text-sm text-gray-600">Class</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="font-semibold text-gray-900">{booking.customer_name}</div>
                          <div className="text-sm text-gray-600">Customer</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-semibold text-gray-900">{booking.customer_email}</div>
                          <div className="text-sm text-gray-600">Email</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-purple-500" />
                        <div>
                          <div className="font-semibold text-gray-900">{booking.booking_date}</div>
                          <div className="text-sm text-gray-600">{booking.booking_time}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

