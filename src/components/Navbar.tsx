
import { useState, useEffect } from "react";
import { Menu, X, Settings, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPanel } from "./AdminPanel";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface NavbarProps {
  scrollY: number;
}

export const Navbar = ({ scrollY }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingCount();
    
    // Listen for booking updates
    const handleBookingUpdate = () => {
      fetchBookingCount();
    };
    
    window.addEventListener('bookingUpdated', handleBookingUpdate);
    
    return () => {
      window.removeEventListener('bookingUpdated', handleBookingUpdate);
    };
  }, []);

  const fetchBookingCount = async () => {
    try {
      console.log('Fetching booking count...');
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      console.log('Booking count:', count);
      console.log('Booking count error:', error);

      if (error) {
        console.error('Error fetching booking count:', error);
        return;
      }

      setBookingCount(count || 0);
    } catch (error) {
      console.error('Error fetching booking count:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Classes", href: "#classes" },
    { name: "Shop", href: "#shop" },
    { name: "Gallery", href: "#gallery" }, // Added Gallery section
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Angels Fitness
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                      scrollY > 50
                        ? "text-gray-700 hover:text-red-600"
                        : "text-white hover:text-red-200"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${scrollY > 50 ? "text-gray-700" : "text-white"}`}>
                    Welcome, {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className={`p-2 rounded-full transition-colors ${
                      scrollY > 50
                        ? "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        : "text-white hover:text-red-200 hover:bg-white/10"
                    }`}
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    scrollY > 50
                      ? "text-gray-700 hover:text-red-600 hover:bg-red-50"
                      : "text-white hover:text-red-200 hover:bg-white/10"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}



              <button
                onClick={() => {
                  setShowAdminPanel(true);
                  fetchBookingCount(); // Refresh count when opening admin panel
                }}
                className={`relative p-2 rounded-full transition-colors ${
                  scrollY > 50
                    ? "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    : "text-white hover:text-red-200 hover:bg-white/10"
                }`}
                title="Admin Panel"
              >
                <Settings className="w-5 h-5" />
                {bookingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {bookingCount > 99 ? '99+' : bookingCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md transition-colors ${
                  scrollY > 50
                    ? "text-gray-700 hover:text-red-600"
                    : "text-white hover:text-red-200"
                }`}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-700">
                      Welcome, {user.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}
                

                
                <button
                  onClick={() => {
                    setShowAdminPanel(true);
                    setIsMenuOpen(false);
                    fetchBookingCount(); // Refresh count when opening admin panel
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>Admin Panel</span>
                  {bookingCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1">
                      {bookingCount > 99 ? '99+' : bookingCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
    </>
  );
};
