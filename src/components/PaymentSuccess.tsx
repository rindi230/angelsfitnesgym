
import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ShoppingBag } from 'lucide-react';

export const PaymentSuccess = () => {
  const { clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
    
    toast({
      title: "Payment Successful!",
      description: "Thank you for your purchase. You will receive a confirmation email shortly.",
    });
  }, [clearCart, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Payment Successful!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your order has been confirmed and will be processed shortly.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <ShoppingBag className="mx-auto h-8 w-8 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What's Next?
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• You'll receive a confirmation email shortly</li>
            <li>• Your order is being processed</li>
            <li>• We'll notify you when it ships</li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = '/#shop'}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
