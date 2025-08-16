
import { useState, useEffect } from "react";
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import { BookingModal } from './BookingModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ClassItem {
  id: number;
  name: string;
  description: string;
  trainer: string;
  schedule_time: string;
  duration: string;
  max_slots: number;
  available_slots: number;
  price: number;
  difficulty: string;
  image_url: string;
}

export const Classes = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [bookingStatus, setBookingStatus] = useState<{[key: number]: 'idle' | 'booking' | 'booked' | 'full'}>({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{id: number, name: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('active', true)
        .order('id');

      if (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: "Error",
          description: "Failed to load classes. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookClass = (classId: number, className: string) => {
    setSelectedClass({ id: classId, name: className });
    setShowBookingModal(true);
  };

  const handleBookingComplete = async () => {
    if (!selectedClass) return;

    setBookingStatus(prev => ({ ...prev, [selectedClass.id]: 'booking' }));
    
    try {
      setBookingStatus(prev => ({ ...prev, [selectedClass.id]: 'booked' }));
      
      toast({
        title: "Success!",
        description: `Klasa ${selectedClass.name}u rezervua me sukses!`,
      });
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setBookingStatus(prev => ({ ...prev, [selectedClass.id]: 'idle' }));
      }, 3000);
    } catch (error) {
      console.error('Error completing booking:', error);
      toast({
        title: "Error",
        description: "An error occurred while completing your booking.",
        variant: "destructive",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSlotStatus = (slots: number, maxSlots: number) => {
    const percentage = (slots / maxSlots) * 100;
    if (percentage <= 0) return { color: 'text-red-600', text: 'Full' };
    if (percentage <= 20) return { color: 'text-orange-600', text: 'Almost Full' };
    return { color: 'text-green-600', text: 'Available' };
  };

  if (isLoading) {
    return (
      <section id="classes" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading classes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="classes" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitness Classes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our expert-led classes designed for all fitness levels. Book your spot now!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem) => {
              const status = bookingStatus[classItem.id] || 'idle';
              
              return (
                <div
                  key={classItem.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <img
                      src={classItem.image_url}
                      alt={classItem.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(classItem.difficulty)}`}>
                        {classItem.difficulty}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Available
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{classItem.name}</h3>
                    <p className="text-red-600 font-semibold mb-3"> {classItem.trainer}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{classItem.schedule_time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{classItem.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span className="text-green-600">Available</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {classItem.description}
                    </p>
                    
                    <button
                      onClick={() => handleBookClass(classItem.id, classItem.name)}
                      disabled={status === 'booking' || status === 'booked'}
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        status === 'booked'
                          ? 'bg-green-600 text-white'
                          : status === 'booking'
                          ? 'bg-red-400 text-white cursor-wait'
                          : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg transform hover:scale-105'
                      }`}
                    >
                      {status === 'booking' && (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Booking...</span>
                        </>
                      )}
                      {status === 'booked' && (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Booked Successfully!</span>
                        </>
                      )}
                      {status === 'idle' && (
                        <>
                          <Calendar className="w-4 h-4" />
                          <span>Book Class</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedClass(null);
        }}
        classId={selectedClass?.id || 0}
        className={selectedClass?.name || ''}
        onBookingComplete={handleBookingComplete}
      />
    </>
  );
};
