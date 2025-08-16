import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, MapPin, Clock, Phone, ShoppingCart, X, Trash2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

interface Purchase {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
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

  const handlePurchase = (product: Product) => {
    if (product.stock_quantity <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
      return;
    }

    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const handleConfirmPurchase = () => {
    if (!selectedProduct) return;

    // Add to purchases
    const existingPurchase = purchases.find(p => p.id === selectedProduct.id);
    if (existingPurchase) {
      setPurchases(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ));
    } else {
      setPurchases(prev => [...prev, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image_url,
        quantity: 1
      }]);
    }

    toast({
      title: "Purchase Confirmed!",
      description: `Faleminderit qe zgjodhet ${selectedProduct.name}! Ju lutem vizitoni palestren per te marre produktin.`,
    });

    setShowPurchaseModal(false);
    setSelectedProduct(null);
  };

  const removeFromCart = (productId: number) => {
    setPurchases(prev => prev.filter(p => p.id !== productId));
    toast({
      title: "Produkti u hoq",
      description: "Produkti u hoq nga shporta.",
    });
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setPurchases(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, quantity: newQuantity }
        : p
    ));
  };

  const getTotalItems = () => {
    return purchases.reduce((total, purchase) => total + purchase.quantity, 0);
  };

  const getTotalPrice = () => {
    return purchases.reduce((total, purchase) => total + (purchase.price * purchase.quantity), 0);
  };

  if (isLoading) {
    return (
      <section id="shop" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Duke u ngarkuar produkti...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="shop" className="py-20 bg-white">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitness Shop</h2>
            <p className="text-xl text-gray-600">
            Pajisje dhe suplemente fitnesi premium për udhëtimin tuaj
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const purchaseCount = purchases.find(p => p.id === product.id)?.quantity || 0;
              
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover-scale transition-all duration-300 animate-fade-in"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Low Stock
                      </div>
                    )}
                    {product.stock_quantity <= 0 && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                    {purchaseCount > 0 && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Purchased: {purchaseCount}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-red-600">${product.price}</span>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock_quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchase(product)}
                      disabled={product.stock_quantity <= 0}
                      className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                        product.stock_quantity <= 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {product.stock_quantity <= 0 ? 'Out of Stock' : 'Purchase Now'}
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
          <div className="bg-white rounded-2xl p-6 max-w-2xl mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-red-600" />
                <span>Blerjet tuaja</span>
              </h3>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {purchases.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Shporta jote eshte bosh</p>
                <p className="text-gray-400 text-sm">Starto blerje per te shtuar produkte ne shporte</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={purchase.image}
                        alt={purchase.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{purchase.name}</h4>
                        <p className="text-red-600 font-bold">${purchase.price}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(purchase.id, purchase.quantity - 1)}
                          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">{purchase.quantity}</span>
                        <button
                          onClick={() => updateQuantity(purchase.id, purchase.quantity + 1)}
                          className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors duration-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(purchase.id)}
                          className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-900">Produktet totale:</span>
                    <span className="text-lg font-bold text-red-600">{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-semibold text-gray-900">Cmimi total:</span>
                    <span className="text-2xl font-bold text-red-600">${getTotalPrice()}</span>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 text-sm">
                      <strong>Pickup Instructions:</strong> Ju lutem vizitoni palestren tone per te marre produktet. 
                      Sillni nje karte identiteti funksionale me vete dhe kujtojini stafit produktin qe deshironi te merrni.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowCartModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                    >
                      Vazhdo shopping
                    </button>
                    <button
                      onClick={() => {
                        setShowCartModal(false);
                        toast({
                          title: "Gati per ti marre!",
                          description: "Te gjitha produktet e tuat jane gati per tu terhequr ne palestren tone!",
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-300"
                    >
                      Gati per terheqje 
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Thank You for Your Purchase!
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedProduct.name}</h4>
                <p className="text-2xl font-bold text-red-600">${selectedProduct.price}</p>
              </div>

              <div className="space-y-4 mb-6 text-left">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Vendi i marrjes</p>
                    <p className="text-gray-600 text-sm">Vizitoni palestren tone per te marre produktin</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Oret ne Disponueshmeri</p>
                    <p className="text-gray-600 text-sm">E hene-E diele: 6:00 AM - 12:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Na kontaktoni</p>
                    <p className="text-gray-600 text-sm">Na kontaktoni ne qofte se keni ndonje paqartesi</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>E rendesishme:</strong>Ju lutem sillni me vete nje karte identiteti funksionale kur te merrni produktin
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Dil
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-300"
                >
                  Konfirmo blerjen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
