'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { mockProducts } from '../data/mockData';
import { Product, getLocalizedText } from '../types/multilingual';

interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  category: string;
  features: string[];
}

interface PromoCode {
  code: string;
  discount: number;
  description: string;
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, addToCart } = useCart();
  const { success, error, info } = useToast();
  const { t, language } = useLanguage();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load recommended products from API (using first 4 products as recommendations)
    setRecommendedProducts(mockProducts.slice(0, 4));
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const savings = originalTotal - subtotal;
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 500 ? 0 : 29; // Free shipping over $500
  const promoDiscount = appliedPromo ? subtotal * 0.1 : 0; // 10% promo discount
  const finalTotal = subtotal + tax + shipping - promoDiscount;

  // Helper function to handle quantity updates
  const handleQuantityUpdate = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, newQuantity);
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedPromo({ code: 'SAVE10', discount: 0.1, description: '10% Off' });
      success(t('cart.promo.success'), t('cart.promo.success.desc'));
    } else {
      error(t('cart.promo.error'), t('cart.promo.error.desc'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            🛒 {t('cart.badge')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('cart.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {t('cart.subtitle')}
          </p>
          <div className="text-sm text-gray-400">
            {cartItems.length} {t('cart.items')}
          </div>
        </div>
      </section>

      {cartItems.length === 0 ? (
        // Empty Cart
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <div className="text-8xl mb-8">🛒</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('cart.empty.title')}</h2>
            <p className="text-gray-600 mb-8">{t('cart.empty.subtitle')}</p>
            <Link href="/products" className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-lg inline-block">
              {t('cart.browse.products')}
            </Link>
          </div>
        </section>
      ) : (
        // Cart Content
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cart.items.title')}</h2>
                  
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl">
                          {item.image}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.features.slice(0, 2).map((feature, index) => (
                              <span key={index} className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                                {feature}
                              </span>
                            ))}
                          </div>
                          
                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900">${item.price}</span>
                              <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                              <span className="text-xs text-green-600 font-semibold">
                                {t('cart.save')} ${item.originalPrice - item.price}
                              </span>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-2 w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-200 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Continue Shopping */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Link 
                      href="/products" 
                      className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
{t('cart.browse.products')}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('cart.summary.title')}</h2>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('cart.promo.label')}</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder={t('cart.promo.placeholder')}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 gradient-red text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
                      >
                        {t('cart.promo.apply')}
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="mt-2 text-sm text-green-600 font-semibold">
                        ✓ {appliedPromo.code} {t('cart.promo.applied')} - {appliedPromo.description}
                      </div>
                    )}
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>{t('cart.summary.subtotal')}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-green-600">
                      <span>{t('cart.summary.savings')}</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                    
                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span>{t('cart.summary.promo')}</span>
                        <span>-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600">
                      <span>{t('cart.summary.tax')}</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-gray-600">
                      <span>{t('cart.summary.shipping')}</span>
                      <span>{shipping === 0 ? t('cart.summary.free') : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    {shipping > 0 && (
                      <div className="text-xs text-gray-500">
                        {t('cart.summary.free.shipping')}
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>{t('cart.summary.total')}</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <button className="w-full gradient-red text-white py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-lg mb-4">
                    {t('cart.checkout.button')}
                  </button>
                  
                  {/* Security Info */}
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {t('cart.checkout.secure')}
                  </div>
                  
                  {/* Payment Methods */}
                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 mb-2">{t('cart.checkout.accept')}</p>
                    <div className="flex justify-center space-x-2">
                      <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">V</div>
                      <div className="w-8 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">M</div>
                      <div className="w-8 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">A</div>
                      <div className="w-8 h-6 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">P</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Recommended Products */}
      {cartItems.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('cart.recommended.title')}
              </h2>
              <p className="text-gray-600">{t('cart.recommended.subtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product, index) => (
                <div key={product.id} className="card-hover bg-white rounded-xl shadow-lg p-4 text-center border border-gray-200">
                  <div className="text-4xl mb-3">{product.image}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{getLocalizedText(product.name, language)}</h3>
                  <div className="text-lg font-bold text-red-600 mb-3">${product.price}</div>
                  <button 
                    onClick={() => {
                      // Add recommended product to cart
                      addToCart({
                        id: product.id,
                        name: getLocalizedText(product.name, language),
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.image,
                        category: product.category,
                        features: product.features.map(f => getLocalizedText(f, language))
                      });
                      success(t('toast.cart.added'), t('toast.cart.added.desc'));
                    }}
                    className="w-full gradient-red text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    {t('products.add.cart')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
} 