import { useState, useEffect } from "react";
import { Menu, X, Settings, User, LogOut, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { AdminPanel } from "./AdminPanel";
import { CartModal } from "./CartModal";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface NavbarProps {
  scrollY: number;
}

export const Navbar = ({ scrollY }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    try {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Account for fixed navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } catch (error) {
      console.error('Error scrolling to section:', error);
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Classes", id: "classes" },
    { name: "Membership", id: "membership" },
    { name: "Shop", id: "shop" },
    { name: "Gallery", id: "gallery" },
    { name: "Contact", id: "contact" }
  ];

  useEffect(() => {
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
      const { count, error } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

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
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrollY > 50 
          ? "bg-white shadow-lg" 
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => scrollToSection('home')}
                className="flex items-center space-x-2"
              >
                <img
                  src="/downloads/angels logo.jpg"
                  alt="Angels Fitness"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className={`text-xl font-bold ${
                  scrollY > 50 ? "text-gray-900" : "text-white"
                }`}>
                  Angels Fitness
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      scrollY > 50
                        ? "text-gray-700 hover:text-red-600 hover:bg-red-50"
                        : "text-white hover:text-red-200 hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setShowCart(true)}
                className={`relative p-2 rounded-full transition-colors ${
                  scrollY > 50
                    ? "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    : "text-white hover:text-red-200 hover:bg-white/10"
                }`}
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length > 99 ? '99+' : items.length}
                  </span>
                )}
              </button>

              {user ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setShowAdminPanel(true);
                      setIsMenuOpen(false);
                      fetchBookingCount();
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
                  
                  <div className="flex items-center space-x-2">
                    <User className={`w-5 h-5 ${
                      scrollY > 50 ? "text-gray-700" : "text-white"
                    }`} />
                    <span className={`text-sm font-medium ${
                      scrollY > 50 ? "text-gray-700" : "text-white"
                    }`}>
                      {user.email}
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
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                    scrollY > 50
                      ? "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100"
                      : "bg-transparent text-white border-white hover:bg-white/10"
                  }`}
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-md transition-colors ${
                  scrollY > 50
                    ? "text-gray-700 hover:text-red-600 hover:bg-red-50"
                    : "text-white hover:text-red-200 hover:bg-white/10"
                }`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Cart Button */}
              <button
                onClick={() => {
                  setShowCart(true);
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Shopping Cart</span>
                {items.length > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1">
                    {items.length > 99 ? '99+' : items.length}
                  </span>
                )}
              </button>

              {user ? (
                <>
                  <button
                    onClick={() => {
                      setShowAdminPanel(true);
                      setIsMenuOpen(false);
                      fetchBookingCount();
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
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center px-3 py-2">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AdminPanel isOpen={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
      <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};