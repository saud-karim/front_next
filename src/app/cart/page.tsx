'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { Product } from '../types/api';
import { getBestImageUrl, getImageFallbacks } from '../dashboard/utils/imageUtils';

export default function CartPage() {
  const { cart, loading, updateCartItem, removeFromCart, applyCoupon, removeCoupon, refreshCart, addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, error, info } = useToast();
  const { t, language, getLocalizedText } = useLanguage();
  const [promoCode, setPromoCode] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchRecommendedProducts();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);

  const fetchRecommendedProducts = async () => {
    try {
      const response = await ApiService.getProducts({ per_page: 4 });
      
      if (response.data && Array.isArray(response.data)) {
        setRecommendedProducts(response.data);
      } else {
        setRecommendedProducts([]);
      }
    } catch (error) {
      setRecommendedProducts([]);
    }
  };

  // Use cart data from API and convert strings to numbers
  const subtotal = parseFloat(cart?.subtotal || '0');
  const shipping = parseFloat(cart?.shipping || '0');
  const total = parseFloat(cart?.total || '0');
  const discount = parseFloat(cart?.discount || '0');
  const itemsCount = cart?.items_count || 0;

  // Helper function to handle quantity updates
  const handleQuantityUpdate = async (productId: number, newQuantity: number) => {
    if (!isAuthenticated) return;
    
    console.log('🔄 Cart handleQuantityUpdate:', { productId, newQuantity });
    
    if (newQuantity <= 0) {
      const success_remove = await removeFromCart(productId);
      if (success_remove) {
        success(t('toast.cart.removed'), t('toast.cart.removed.desc'));
              } else {
          error(t('toast.error'), t('toast.error.desc'));
        }
      return;
    }
    
    // Check if quantity is too high (likely stock issue)
    if (newQuantity > 50) {
      error(t('cart.quantity.too.high'), t('cart.quantity.max.limit'));
      return;
    }
    
    const success_update = await updateCartItem(productId, newQuantity);
    if (success_update) {
      success(t('cart.update.success'), '');
    } else {
      // More specific error messages
      if (newQuantity > 15) {
        error(t('cart.update.failed'), t('cart.update.stock.limit'));
      } else {
        error(t('cart.update.failed'), t('toast.error.try.again'));
      }
    }
  };

  // Apply promo code
  const applyPromoCode = async () => {
    if (!isAuthenticated) {
      error(t('toast.login.required'), '');
      return;
    }

    const success_coupon = await applyCoupon(promoCode);
    if (success_coupon) {
      success(t('cart.promo.success'), '');
      setPromoCode('');
    } else {
      error(t('cart.promo.error'), t('cart.promo.error.desc'));
    }
  };

  const removeCouponCode = async () => {
    if (!isAuthenticated) return;
    
    const success_remove = await removeCoupon();
    if (success_remove) {
      success(t('cart.coupon.removed'), '');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded text-sm font-medium mb-4">
            🛒 {t('cart.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            {t('cart.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {t('cart.subtitle')}
          </p>
          <div className="text-sm text-gray-500">
            {itemsCount} {t('cart.items')}
          </div>
        </div>
      </section>

      {!isAuthenticated ? (
        // Not Logged In
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="text-6xl mb-8">🔐</div>
            <h2 className="text-2xl font-bold text-black mb-4">{t('cart.login.required')}</h2>
            <p className="text-gray-600 mb-8">
              {t('cart.login.required.desc')}
            </p>
            <Link 
              href="/auth"
              className="bg-red-500 text-white px-8 py-4 rounded font-medium hover:bg-red-600 transition-colors"
            >
              {t('cart.login.button')}
            </Link>
          </div>
        </section>
      ) : loading ? (
        // Loading
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('cart.loading')}</p>
          </div>
        </section>
      ) : !cart || itemsCount === 0 ? (
        // Empty Cart
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="text-6xl mb-8">🛒</div>
            <h2 className="text-2xl font-bold text-black mb-4">{t('cart.empty.title')}</h2>
            <p className="text-gray-600 mb-8">{t('cart.empty.subtitle')}</p>
            <Link href="/products" className="bg-red-500 text-white px-8 py-4 rounded font-medium hover:bg-red-600 transition-colors inline-block">
              {t('cart.browse.products')}
            </Link>
          </div>
        </section>
      ) : (
        // Cart Content
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-black mb-6">{t('cart.items.title')}</h2>
                  
                  <div className="space-y-6">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                          {(() => {
                            let productImage;
                            let originalImage = '';
                            
                            // Handle different image formats
                            if (Array.isArray(item.product.images) && item.product.images.length > 0) {
                              originalImage = item.product.images[0];
                              productImage = getBestImageUrl(item.product.images[0]);
                            } else if (typeof item.product.images === 'string') {
                              try {
                                const parsed = JSON.parse(item.product.images);
                                const imageSource = Array.isArray(parsed) ? parsed[0] : parsed;
                                originalImage = imageSource;
                                productImage = getBestImageUrl(imageSource);
                              } catch {
                                originalImage = item.product.images;
                                productImage = getBestImageUrl(item.product.images);
                              }
                            } else if (item.product.images && item.product.images.length > 0) {
                              originalImage = item.product.images[0];
                              productImage = getBestImageUrl(item.product.images[0]);
                            }
                            
                            return productImage ? (
                              <img 
                                src={productImage} 
                                alt={getLocalizedText(item.product, 'name')}
                                className="w-full h-full object-cover rounded-xl"
                                loading="lazy"
                                onError={(e) => {
                                  const currentSrc = e.currentTarget.src;
                                  
                                  if (originalImage) {
                                    const fallbacks = getImageFallbacks(originalImage);
                                    
                                    // جرب المسارات البديلة
                                    for (const fallbackUrl of fallbacks) {
                                      if (currentSrc !== fallbackUrl && !currentSrc.includes('placeholder')) {
                                        e.currentTarget.src = fallbackUrl;
                                        return;
                                      }
                                    }
                                  }
                                  
                                  // إذا فشل كل شيء، استخدم placeholder
                                  if (!currentSrc.includes('placeholder.svg')) {
                                    e.currentTarget.src = '/placeholder.svg';
                                    return;
                                  }
                                  
                                  // إذا فشل حتى placeholder، أخفي الصورة واعرض أيقونة
                                  e.currentTarget.style.display = 'none';
                                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    nextElement.style.display = 'block';
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-3xl">📦</span>
                            );
                          })()}
                          <span className="text-3xl" style={{ display: 'none' }}>📦</span>
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {getLocalizedText(item.product, 'name')}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                            {getLocalizedText(item.product, 'description')}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                                                          {item.product.category && (
                                <>
                                  <Link 
                                    href={`/categories/${item.product.category.id}`}
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                  >
                                    📂 {getLocalizedText(item.product.category, 'name')}
                                  </Link>
                                </>
                              )}
                          </div>
                          {item.product.supplier && (
                            <p className="text-xs text-gray-500 mb-2">
                              {t('cart.supplier')}: {getLocalizedText(item.product.supplier, 'name')}
                              {item.product.supplier.rating && (
                                <span className="ml-1">⭐ {item.product.supplier.rating}</span>
                              )}
                            </p>
                          )}
                          
                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900">
                                {item.product ? `${item.product.price} ج.م` : 'سعر غير متوفر'}
                              </span>
                              <span className="text-xs text-gray-600">
                                × {item.quantity} = {item.product ? `${(parseFloat(item.product.price) * item.quantity).toFixed(2)} ج.م` : 'غير محسوب'}
                              </span>
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleQuantityUpdate(item.product_id, item.quantity - 1)}
                                className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityUpdate(item.product_id, item.quantity + 1)}
                                className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleQuantityUpdate(item.product_id, 0)}
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
                <div className="bg-white rounded border border-gray-200 p-6 sticky top-6">
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
                        className="px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors"
                      >
                        {t('cart.promo.apply')}
                      </button>
                    </div>
                    {discount > 0 && (
                      <div className="mt-2 text-sm text-green-600 font-semibold">
                        ✓ {t('cart.coupon.applied')}
                      </div>
                    )}
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>{t('cart.summary.subtotal')}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>{t('cart.summary.promo')}</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-600">
                      <span>{t('cart.summary.shipping')}</span>
                      <span>{shipping === 0 ? t('cart.summary.free') : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    {shipping > 0 && (
                      <div className="text-xs text-gray-500">
                        {t('cart.free.shipping.text')}
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>{t('cart.summary.total')}</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Applied Coupon Display */}
                    {discount > 0 && (
                      <div className="mt-2 p-2 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600 font-semibold">✓ {t('cart.coupon.applied.success')}</span>
                          <button
                            onClick={removeCouponCode}
                            className="text-red-600 hover:text-red-700 font-semibold"
                          >
                            {t('cart.coupon.remove')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Checkout Button */}
                  <button className="w-full bg-red-500 text-white py-4 rounded font-medium text-lg hover:bg-red-600 transition-colors mb-4">
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
      {isAuthenticated && itemsCount > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('cart.recommended.title')}
              </h2>
              <p className="text-gray-600">{t('cart.recommended.subtitle')}</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="card-hover bg-white rounded-xl shadow-lg p-4 text-center border border-gray-200">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={getBestImageUrl(product.images[0])} 
                        alt={getLocalizedText(product, 'name')}
                        className="w-full h-full object-cover rounded-lg"
                        loading="lazy"
                        onError={(e) => {
                          const currentSrc = e.currentTarget.src;
                          const fallbacks = getImageFallbacks(product.images[0]);
                          
                          // جرب المسارات البديلة
                          for (const fallbackUrl of fallbacks) {
                            if (currentSrc !== fallbackUrl && !currentSrc.includes('placeholder')) {
                              e.currentTarget.src = fallbackUrl;
                              return;
                            }
                          }
                          
                          // إذا فشل كل شيء، استخدم placeholder
                          if (!currentSrc.includes('placeholder.svg')) {
                            e.currentTarget.src = '/placeholder.svg';
                          }
                        }}
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {getLocalizedText(product, 'name')}
                  </h3>
                  <div className="text-lg font-bold text-red-600 mb-3">${product.price}</div>
                  <button 
                    onClick={async () => {
                      const success_add = await addToCart(product.id, 1);
                      if (success_add) {
                        success(t('toast.cart.added'), '');
                      }
                    }}
                    className="w-full bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600 transition-colors"
                  >
                    {t('cart.add.to.cart')}
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