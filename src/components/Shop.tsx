import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { ShoppingCart, X, Trash2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

export const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const { items, addItem, removeItem, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('id');

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    removeItem(productId);
    toast({
      title: "Produkti u hoq",
      description: "Produkti u hoq nga shporta.",
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    updateQuantity(productId, newQuantity);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (isLoading) {
    return (
      <section id="shop" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="shop" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Shopping Cart Icon */}
          <div className="flex justify-end mb-8">
            <div className="relative">
              <button
  onClick={() => setShowCartModal(true)}
  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer"
>
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Fitness Shop</h2>
            <p className="text-xl text-muted-foreground">
              Premium fitness equipment and supplements for your journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const cartItem = items.find(item => item.id === product.id);
              
              return (
                <div
                  key={product.id}
                  className="bg-card rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <div className="absolute top-4 left-4 bg-orange-500/90 text-white px-2 py-1 rounded text-xs font-semibold">
                        Low Stock
                      </div>
                    )}
                    {product.stock_quantity <= 0 && (
                      <div className="absolute top-4 left-4 bg-destructive/90 text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                    {cartItem && cartItem.quantity > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500/90 text-white px-2 py-1 rounded text-xs font-semibold">
                        In Cart: {cartItem.quantity}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-card-foreground mb-2">{product.name}</h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary">${product.price}</span>
                      <span className="text-sm text-muted-foreground">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock_quantity <= 0}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                        product.stock_quantity <= 0
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                           : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shopping Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-background rounded-2xl p-6 max-w-2xl mx-4 shadow-2xl max-h-[80vh] overflow-y-auto border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <span>Your Cart</span>
              </h3>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">Your cart is empty</p>
                <p className="text-muted-foreground/70 text-sm">Start shopping to add products to your cart</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        <p className="text-primary font-bold">${item.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors duration-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-8 h-8 bg-muted-foreground/20 text-foreground rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-foreground">Total Items:</span>
                    <span className="text-lg font-bold text-primary">{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold text-foreground">Total Price:</span>
                    <span className="text-2xl font-bold text-primary">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-950 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      <strong>Pickup Instructions:</strong> Please visit our gym to pick up your products. 
                      Bring a valid ID with you and remind the staff about the product you want to pick up.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowCartModal(false)}
                      className="flex-1 px-4 py-2 border border-muted-foreground/30 text-foreground rounded-lg font-semibold hover:bg-muted transition-colors duration-300"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => {
                        setShowCartModal(false);
                        toast({
                          title: "Ready for Pickup!",
                          description: "All your products are ready for pickup at our gym!",
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors duration-300"
                    >
                      Ready for Pickup
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};