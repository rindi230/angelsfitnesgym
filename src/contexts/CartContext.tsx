import { createContext, useContext, useState, ReactNode } from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2, CreditCard, User, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  getTotalPrice: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      getTotalPrice,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const sendShopNotification = async () => {
    try {
      const itemsForEmail = items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      const { error } = await supabase.functions.invoke('send-shop-notification', {
        body: {
          customerName,
          customerEmail,
          customerPhone,
          items: itemsForEmail,
          totalAmount: getTotalPrice(),
          totalItems: items.reduce((total, item) => total + item.quantity, 0),
        },
      });

      if (error) {
        console.error('Error sending shop notification:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in sendShopNotification:', error);
      throw error;
    }
  };

  const handleGymPickup = async () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to complete your order.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      await sendShopNotification();
      
      toast({
        title: "Order Confirmed!",
        description: `Thank you ${customerName}! Your order is ready for pickup at the gym.`,
      });
      
      // Clear cart and close modal
      clearCart();
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setShowContactForm(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!customerEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to proceed with checkout.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      console.log("Starting checkout process...");
      console.log("Items to checkout:", items);
      console.log("Customer email:", customerEmail);

      const checkoutItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      console.log("Calling create-checkout function...");

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          items: checkoutItems,
          customerEmail: customerEmail.trim(),
          successUrl: `${window.location.origin}/?payment=success`,
          cancelUrl: `${window.location.origin}/?payment=cancelled`,
        }
      });

      console.log("Function response:", { data, error });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast({
          title: "Checkout Error",
          description: error.message || "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        console.log("Redirecting to Stripe checkout:", data.url);
        
        // Redirect to Stripe checkout in the same window
        window.location.href = data.url;
      } else {
        console.error("No checkout URL received");
        toast({
          title: "Checkout Error",
          description: "No checkout URL received. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      toast({
        title: "Error",
        description: "An error occurred during checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <ShoppingCart className="w-6 h-6" />
            <span>Shopping Cart</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-red-600 font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {items.length > 0 && (
          <div className="border-t p-6 flex-shrink-0">
            {!showContactForm ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-red-600">${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowContactForm(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    disabled={isProcessing}
                  >
                    <User className="w-4 h-4" />
                    <span>Order for Gym Pickup</span>
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">or</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address (for online payment) *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                  
                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessing || !customerEmail.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay Online</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    Clear Cart
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pickup-name">Full Name *</Label>
                      <Input
                        id="pickup-name"
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup-email">Email Address *</Label>
                      <Input
                        id="pickup-email"
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pickup-phone">Phone Number *</Label>
                      <Input
                        id="pickup-phone"
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-red-600">${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Pickup Instructions:</strong> Your order will be prepared for pickup at our gym. Please bring a valid ID when collecting your items.
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleGymPickup}
                    disabled={isProcessing || !customerName.trim() || !customerEmail.trim() || !customerPhone.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessing ? "Processing..." : "Confirm Order"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};