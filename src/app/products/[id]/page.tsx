'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApiService } from '../../services/api';
import { Product } from '../../types/api';
import { getBestImageUrl, getImageFallbacks } from '../../dashboard/utils/imageUtils';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  
  console.log('🔍 Product Details: Params:', params);
  console.log('🔍 Product Details: Product ID:', productId);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, warning } = useToast();
  const { t, language, getLocalizedText } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    if (productId && !isNaN(productId)) {
      fetchProduct();
    } else {
      console.error('❌ Product Details: Invalid product ID:', productId);
      setLoading(false);
    }
  }, [productId, language]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      console.log('🔍 Product Details: Fetching product ID:', productId);
      const response = await ApiService.getProductDetails(productId);
      
      console.log('🔍 Product Details: Full response:', response);
      console.log('🔍 Product Details: Response.data:', response.data);
      
              // Handle different response structures
        if (response.data) {
          setProduct(response.data);
          console.log('✅ Product Details: Product set successfully:', response.data);
          console.log('✅ Product name (localized):', getLocalizedText(response.data, 'name'));
        } else if ((response as any).product) {
          // Handle case where API returns { product: {...} }
          setProduct((response as any).product);
          console.log('✅ Product Details: Product set from response.product:', (response as any).product);
          console.log('✅ Product name (localized):', getLocalizedText((response as any).product, 'name'));
        } else if (response.success && response) {
          // Handle case where product data is directly in response
          setProduct(response as any);
          console.log('✅ Product Details: Product set from direct response:', response);
          console.log('✅ Product name (localized):', getLocalizedText(response as any, 'name'));
        } else {
          console.error('❌ Product Details: Product not found in response');
        }
    } catch (error) {
      console.error('❌ Product Details: Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await ApiService.getWishlist();
      console.log('🎯 Product Details: Wishlist response:', response);
      
      if (response.success && response.data) {
        let wishlistData: any[] = [];
        
        if ((response.data as any).wishlist && Array.isArray((response.data as any).wishlist)) {
          wishlistData = (response.data as any).wishlist;
        } else if (Array.isArray(response.data)) {
          wishlistData = response.data;
        }
        
        const wishlistIds = wishlistData.map((item: any) => item.product_id || item.product?.id || item.id);
        console.log('🎯 Product Details: Wishlist IDs:', wishlistIds);
        setWishlist(wishlistIds);
      }
    } catch (error) {
      console.log('🎯 Product Details: Wishlist fetch error:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated || !product) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }

    try {
      if (wishlist.includes(product.id)) {
        await ApiService.removeFromWishlist(product.id);
        setWishlist(prev => prev.filter(id => id !== product.id));
      success(t('toast.wishlist.removed'), t('toast.wishlist.removed.desc'));
    } else {
        await ApiService.addToWishlist(product.id);
        setWishlist(prev => [...prev, product.id]);
      success(t('toast.wishlist.added'), t('toast.wishlist.added.desc'));
    }
    } catch (error) {
      warning(t('product.error.title'), t('product.error.try.again'));
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !product) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }
    
    const success_cart = await addToCart(product.id, quantity);
    if (success_cart) {
      success(t('toast.cart.added'), `${t('toast.cart.added')} ${getLocalizedText(product, 'name') || product.name || t('product.unknown')}`);
          } else {
        warning(t('product.error.title'), t('product.error.try.again'));
      }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
        <Footer />
      </div>
    );
    }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-8xl mb-8">🔍</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('product.not.found')}</h2>
          <p className="text-gray-600 mb-8">{t('product.not.found.desc')}</p>
          <Link href="/products" className="gradient-red text-white px-6 py-3 rounded-lg">
            {t('product.back.to.products')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get product images
  const productImages = Array.isArray(product.images) 
    ? product.images 
    : typeof product.images === 'string' 
      ? JSON.parse(product.images) 
      : ['/images/placeholder.jpg'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Breadcrumb */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 rtl:space-x-reverse">
            <Link href="/" className="hover:text-red-600 transition-colors">{t('nav.home')}</Link>
            <span>{'>'}</span>
            <Link href="/products" className="hover:text-red-600 transition-colors">{t('nav.products')}</Link>
            {product.category && (
              <>
                <span>{'>'}</span>
                <Link 
                  href={`/categories/${product.category.id}`} 
                  className="hover:text-red-600 transition-colors"
                >
                  {getLocalizedText(product.category, 'name') || product.category.name}
                </Link>
              </>
            )}
            <span>{'>'}</span>
            <span className="text-gray-900">{getLocalizedText(product, 'name') || product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                <img 
                  src={getBestImageUrl(productImages[selectedImageIndex]) || '/placeholder.svg'}
                  alt={getLocalizedText(product, 'name') || product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const currentSrc = e.currentTarget.src;
                    const originalImage = productImages[selectedImageIndex];
                    
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
                    }
                  }}
                />
                </div>
              
              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {productImages.map((image: string, index: number) => (
                <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                        selectedImageIndex === index 
                          ? 'border-red-500 ring-2 ring-red-200' 
                          : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                      <img 
                        src={getBestImageUrl(image) || '/placeholder.svg'}
                        alt={`${getLocalizedText(product, 'name') || product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const currentSrc = e.currentTarget.src;
                          
                          if (image) {
                            const fallbacks = getImageFallbacks(image);
                            
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
                          }
                        }}
                      />
                </button>
                  ))}
              </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Price */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {getLocalizedText(product, 'name') || t('product.unknown')}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-red-600">
                    {product?.price ? `${product.price} ${language === 'ar' ? 'ج.م' : 'EGP'}` : t('products.out.of.stock')}
                  </span>
                  {product.category && (
                    <Link 
                      href={`/categories/${product.category.id}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      📂 {getLocalizedText(product.category, 'name') || product.category.name}
                    </Link>
                  )}
                </div>
              </div>

              {/* Description */}
              {(getLocalizedText(product, 'description') || product.description) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product.description')}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {getLocalizedText(product, 'description') || product.description || t('product.no.description')}
                  </p>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">{t('product.status')}:</span>
                {product.stock > 0 ? (
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                    {t('product.available')} ({product.stock} {t('product.pieces')})
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
                    {t('product.unavailable')}
                  </span>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">{t('product.quantity')}:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 bg-gray-50 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 gradient-red text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🛒 {t('product.add.cart')}
                  </button>
                  
                  <button
                    onClick={handleWishlistToggle}
                    className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                      wishlist.includes(product.id)
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    {wishlist.includes(product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>

              {/* Supplier Info */}
              {product.supplier && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('product.supplier.info')}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {getLocalizedText(product.supplier, 'name') || product.supplier.name || t('product.unknown.supplier')}
                        </p>
                        {product.supplier.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600">{product.supplier.rating}</span>
                          </div>
                        )}
            </div>
          </div>
                  </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 