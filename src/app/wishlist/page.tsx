'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { getBestImageUrl, getImageFallbacks } from '../dashboard/utils/imageUtils';

interface WishlistItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    name_ar?: string;
    name_en?: string;
    description?: string;
    description_ar?: string;
    description_en?: string;
    price: string;
    images: string[];
    stock: number;
    category?: {
      id: number;
      name: string;
      name_ar?: string;
      name_en?: string;
    };
    supplier?: {
      id: number;
      name: string;
      name_ar?: string;
      name_en?: string;
      rating?: string;
    };
  } | null; // Allow product to be null for deleted products
  date_added?: string; // Real API uses date_added instead of created_at
  created_at?: string; // Alternative date field from API - fallback
}

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { success } = useToast();
  const { t, language, getLocalizedText } = useLanguage();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🎯 Wishlist: useEffect triggered, isAuthenticated:', isAuthenticated);
    console.log('🎯 Wishlist: user:', user);
    console.log('🎯 Wishlist: token exists:', !!localStorage.getItem('auth_token'));
    
    if (!isAuthenticated) {
      console.log('🎯 Wishlist: User not authenticated, redirecting to auth');
      router.push('/auth');
    } else {
      console.log('🎯 Wishlist: User authenticated, fetching wishlist');
      fetchWishlist();
    }
  }, [isAuthenticated, router]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      console.log('🎯 Wishlist: Starting to fetch wishlist...');
      
      const response = await ApiService.getWishlist();
      console.log('🎯 Wishlist: Full API Response:', response);
      
      // Handle different response formats
        let wishlistData = [];
      
      if (response && response.data) {
        console.log('🎯 Wishlist: response.data type:', typeof response.data);
        console.log('🎯 Wishlist: response.data:', response.data);
        
        const data = response.data as any;
        if (data.wishlist && Array.isArray(data.wishlist)) {
          // Real Backend Format: { data: { wishlist: [...], total_items: 5 } }
          wishlistData = data.wishlist;
          console.log('🎯 Wishlist: Using data.wishlist format, length:', wishlistData.length);
        } else if (Array.isArray(data)) {
          // Direct array format: { data: [...] }
          wishlistData = data;
          console.log('🎯 Wishlist: Using direct array format, length:', wishlistData.length);
        } else if (response.success && data && data.wishlist) {
          // Format with success flag: { success: true, data: { wishlist: [...] } }
          wishlistData = data.wishlist;
          console.log('🎯 Wishlist: Using success format, length:', wishlistData.length);
        } else {
          console.log('🎯 Wishlist: Unknown response format!', response.data);
        }
        
        console.log('🎯 Wishlist: Raw wishlistData:', wishlistData);
        
        // Normalize the data structure - handle date_added vs created_at
        const normalizedData = wishlistData.map(item => ({
          ...item,
          created_at: item.date_added || item.created_at,
          date_added: item.date_added || item.created_at
        }));
        
        console.log('🎯 Wishlist: Normalized data:', normalizedData);
        
        // Debug individual items before filtering
        console.log('🔍 Wishlist: Checking each item:');
        normalizedData.forEach((item, index) => {
          console.log(`Item ${index}:`, {
            id: item?.id,
            product_id: item?.product_id,
            product: !!item?.product,
            'product.id': item?.product?.id,
            'product.name': item?.product?.name,
            'product.name_ar': item?.product?.name_ar,
            'product.name_en': item?.product?.name_en
          });
        });

        // Filter out items with null or invalid products (relaxed filtering)
        const validWishlistItems = normalizedData.filter(item => {
          // Relaxed validation - just check for basic structure
          const isValid = item && item.product && item.product.id;
          
          if (!isValid) {
            console.log('🚫 Wishlist: Invalid item details:', {
              item: !!item,
              product: !!item?.product,
              productId: item?.product?.id,
              productName: item?.product?.name,
              productNameAr: item?.product?.name_ar,
              productNameEn: item?.product?.name_en,
              fullProduct: item?.product
            });
          }
          
          return isValid;
        });

        console.log('🎯 Wishlist: Valid items after filtering:', validWishlistItems);

        // Log filtering results for debugging
        const filteredCount = normalizedData.length - validWishlistItems.length;
        if (filteredCount > 0) {
          console.log(`⚠️ Filtered out ${filteredCount} invalid wishlist items (products may have been deleted)`);
        }

        setWishlistItems(validWishlistItems);
        console.log('🎯 Wishlist: Final state set, items count:', validWishlistItems.length);
      } else {
        console.log('🎯 Wishlist: No data in response:', response);
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch wishlist:', error);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToCart = async (item: WishlistItem) => {
    if (!item || !item.product || !item.product.id) {
      console.error('Invalid product item for cart addition');
      return;
    }

    const success_cart = await addToCart(item.product.id, 1);
    if (success_cart) {
      const productName = getLocalizedText(item.product, 'name');
      success(t('toast.cart.added'), `${t('toast.cart.added')} ${productName}`);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    if (!productId) {
      console.error('Invalid product ID for wishlist removal');
      return;
    }

    try {
      await ApiService.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.product && item.product.id !== productId));
      success(t('toast.wishlist.removed'), t('toast.wishlist.removed.desc'));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddAllToCart = async () => {
    let successCount = 0;
    for (const item of wishlistItems) {
      if (item && item.product && item.product.id && item.product.stock > 0) {
        const success_cart = await addToCart(item.product.id, 1);
        if (success_cart) successCount++;
      }
    }
    
    if (successCount > 0) {
      success(t('toast.cart.added'), `${t('toast.cart.added')} ${successCount} ${t('categories.products')}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-8xl mb-8">🔐</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('wishlist.login.required')}</h2>
          <p className="text-gray-600 mb-8">{t('wishlist.login.required.desc')}</p>
          <Link href="/auth" className="gradient-red text-white px-6 py-3 rounded-lg">
            {t('wishlist.login.button')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">{t('wishlist.loading')}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">❤️ {t('wishlist.title')}</h1>
          <p className="text-xl text-gray-600">{t('wishlist.subtitle')}</p>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {wishlistItems.length > 0 ? (
            <>
              {/* Wishlist Actions */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('wishlist.saved.products')} ({wishlistItems.length})
                </h2>
                <div className="flex gap-4">
                  <button 
                    onClick={handleAddAllToCart}
                    className="gradient-red text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    {t('wishlist.add.all.cart')}
                  </button>
                  <Link 
                    href="/products"
                    className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-red-500 hover:text-red-600 transition-all duration-300"
                  >
                    {t('wishlist.browse.more')}
                  </Link>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {wishlistItems.map((item) => {
                  // Additional safety check
                  if (!item || !item.product || !item.product.id) {
                    return null;
                  }

                  const productImage = (() => {
                    try {
                      if (Array.isArray(item.product.images) && item.product.images.length > 0) {
                        return getBestImageUrl(item.product.images[0]);
                      } else if (typeof item.product.images === 'string' && item.product.images) {
                        const parsed = JSON.parse(item.product.images);
                        return Array.isArray(parsed) && parsed.length > 0 ? getBestImageUrl(parsed[0]) : '/placeholder.svg';
                      }
                      return '/placeholder.svg';
                    } catch (e) {
                      return '/placeholder.svg';
                    }
                  })();

                  return (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    {/* Product Image */}
                      <div className="relative aspect-square bg-gray-50">
                        <img 
                          src={productImage || '/placeholder.svg'}
                          alt={item.product ? getLocalizedText(item.product, 'name') : 'Product Image'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const currentSrc = e.currentTarget.src;
                            
                            // Get original image path for fallbacks
                            let originalImage = '';
                            try {
                              if (item.product && Array.isArray(item.product.images) && item.product.images.length > 0) {
                                originalImage = item.product.images[0];
                              } else if (item.product && typeof item.product.images === 'string' && item.product.images) {
                                const parsed = JSON.parse(item.product.images);
                                originalImage = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '';
                              }
                            } catch (e) {
                              originalImage = '';
                            }
                            
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
                        <button
                          onClick={() => item.product && handleRemoveFromWishlist(item.product.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                        >
                          ✕
                        </button>
                        {item.product && item.product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold">{t('wishlist.out.of.stock')}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-4">
                        {/* Category */}
                        {item.product?.category && (
                          <div className="mb-2">
                            <Link 
                              href={`/categories/${item.product.category.id}`}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
                            >
                              📂 {getLocalizedText(item.product.category, 'name') || 
                                   item.product.category.name_ar || 
                                   item.product.category.name_en || 
                                   item.product.category.name}
                            </Link>
                    </div>
                        )}
                        
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.product ? (
                            getLocalizedText(item.product, 'name') || 
                            item.product.name_ar || 
                            item.product.name_en || 
                            item.product.name || 
                            'منتج غير متوفر'
                          ) : 'منتج غير متوفر'}
                        </h3>
                      
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.product ? (
                            getLocalizedText(item.product, 'description') || 
                            item.product.description_ar || 
                            item.product.description_en || 
                            item.product.description || 
                            'وصف غير متوفر'
                          ) : 'وصف غير متوفر'}
                        </p>
                      
                        {/* Supplier */}
                        {item.product?.supplier && (
                          <p className="text-xs text-gray-500 mb-2">
                            {t('wishlist.supplier')}: {getLocalizedText(item.product.supplier, 'name') || 
                                                           item.product.supplier.name_ar || 
                                                           item.product.supplier.name_en || 
                                                           item.product.supplier.name}
                            {item.product.supplier.rating && (
                              <span className="ml-1">⭐ {item.product.supplier.rating}</span>
                            )}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-red-600">
                            {item.product?.price ? `${item.product.price} ج.م` : 'سعر غير متوفر'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {t('wishlist.stock')}: {item.product?.stock ?? 'غير متوفر'}
                          </span>
                      </div>
                      
                        <div className="text-xs text-gray-500 mb-4">
                          {t('wishlist.added.on')}: {(item.date_added || item.created_at) ? formatDate(item.date_added || item.created_at!) : 'تاريخ غير متوفر'}
                      </div>
                      
                        <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                            disabled={!item.product || item.product.stock === 0}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🛒 {t('wishlist.add.cart')}
                        </button>
                        {item.product && (
                          <Link 
                              href={`/products/${item.product.id}`}
                              className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:border-red-500 hover:text-red-600 transition-colors"
                          >
                              👁️
                          </Link>
                        )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Empty Wishlist */
            <div className="text-center py-16">
              <div className="text-8xl mb-8">💔</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('wishlist.empty.title')}</h2>
              <p className="text-gray-600 mb-8">{t('wishlist.empty.subtitle')}</p>
                  <Link 
                    href="/products"
                className="gradient-red text-white px-8 py-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-block"
                  >
                {t('wishlist.browse.products')}
                    </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 