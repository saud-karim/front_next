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
import { Product, Category } from '../../types/api';
import { getBestImageUrl, getImageFallbacks } from '../../dashboard/utils/imageUtils';

export default function CategoryProductsPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState<number[]>([]);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, warning } = useToast();
  const { t, language, getLocalizedText } = useLanguage();

  useEffect(() => {
    fetchCategoryProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [categoryId, currentPage, isAuthenticated, language]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching category products:', categoryId);
      console.log('🔄 API URL:', `/categories/${categoryId}`);
      
      const response = await ApiService.getCategoryProducts(categoryId, {
        page: currentPage,
        per_page: 12
      });
      
      console.log('📦 Response type:', typeof response);
      console.log('📦 Full API response:', response);
      console.log('📦 response.category:', response?.category);
      console.log('📦 response.products:', response?.products);
      console.log('📦 response.products type:', Array.isArray(response?.products) ? 'array' : typeof response?.products);
      
      if (response) {
        // البيانات مباشرة في response، مش في response.data
        
        // Extract category info
        if (response.category) {
          console.log('📂 Category data loaded:', response.category.name);
          setCategory(response.category);
        } else {
          console.log('❌ No category in response');
        }
        
        // Extract products - Now directly in products array
        if (response.products) {
          console.log('🔍 Products check:', {
            exists: !!response.products,
            isArray: Array.isArray(response.products),
            length: response.products?.length,
            firstProduct: response.products?.[0]
          });
          
          if (Array.isArray(response.products)) {
            console.log('✅ Products loaded successfully:', response.products.length);
            console.log('🛍️ First product:', response.products[0]);
            setProducts(response.products);
            
            // For now, we'll handle pagination manually since API might not have meta
            const totalProducts = response.category?.products_count || response.products.length;
            const calculatedPages = Math.ceil(totalProducts / 12);
            setTotalPages(calculatedPages);
            
            console.log(`📄 Products count: ${response.products.length}, Total pages: ${calculatedPages}`);
          } else {
            console.log('❌ Products is not array:', typeof response.products);
            setProducts([]);
          }
        } else {
          console.log('❌ No products in response');
          setProducts([]);
        }
      } else {
        console.log('❌ No response from API');
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching category products:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await ApiService.getWishlist();
      if (response.data && Array.isArray(response.data)) {
        const wishlistIds = response.data.map((item: any) => item.product_id || item.id);
        setWishlist(wishlistIds);
      }
    } catch (error) {
      setWishlist([]);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }
    
    const success_cart = await addToCart(product.id, 1);
    if (success_cart) {
      success(t('toast.cart.added'), `تم إضافة ${product.name} إلى سلة التسوق`);
    }
  };

  const handleWishlistToggle = async (productId: number) => {
    if (!isAuthenticated) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await ApiService.removeFromWishlist(productId);
        setWishlist(prev => prev.filter(id => id !== productId));
        success(t('toast.wishlist.removed'), t('toast.wishlist.removed.desc'));
      } else {
        await ApiService.addToWishlist(productId);
        setWishlist(prev => [...prev, productId]);
        success(t('toast.wishlist.added'), t('toast.wishlist.added.desc'));
      }
    } catch (error) {
      warning(t('product.error.title'), t('product.error.try.again'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl opacity-30" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gray-50 to-transparent rounded-full blur-3xl opacity-40" />
        </div>
        
        <Header />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="inline-flex items-center gap-4 glass-modern px-8 py-6 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
            <span className="text-gray-600 font-medium">{t('categories.loading')}</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gray-50 to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl opacity-25" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        
        {/* Modern Hero Section */}
        <section className="hero-modern relative pt-28 pb-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-20 w-20 h-20 bg-red-500 bg-opacity-5 rounded-full animate-float" />
            <div className="absolute top-48 right-32 w-16 h-16 bg-red-500 bg-opacity-10 rounded-full animate-pulse-modern" />
            <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gray-500 bg-opacity-5 rounded-full animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-48 right-1/3 w-18 h-18 bg-red-500 bg-opacity-7 rounded-full animate-pulse-modern" style={{animationDelay: '2s'}} />
          </div>
          
          <div className="container-modern relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Breadcrumb */}
              <div className="animate-slide-modern mb-8">
                <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4 rtl:space-x-reverse">
                  <Link href="/" className="hover:text-red-600 transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {t('nav.home')}
                  </Link>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <Link href="/categories" className="hover:text-red-600 transition-colors flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {t('nav.categories')}
                  </Link>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-red-600 font-medium">
                    {getLocalizedText(category, 'name') || category?.name || t('nav.categories')}
                  </span>
                </nav>
              </div>

              {category && (
                <>
                  {/* Badge */}
                  <div className="animate-slide-modern" style={{animationDelay: '0.1s'}}>
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-8">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        {t('categories.badge')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Main Heading */}
                  <div className="animate-slide-modern" style={{animationDelay: '0.2s'}}>
                    <h1 className="text-modern-heading mb-6">
                      {getLocalizedText(category, 'name') || category.name}
                    </h1>
                  </div>
                  
                  {/* Description */}
                  {(getLocalizedText(category, 'description') || category.description) && (
                    <div className="animate-slide-modern mb-8" style={{animationDelay: '0.3s'}}>
                      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {getLocalizedText(category, 'description') || category.description}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="animate-slide-modern" style={{animationDelay: '0.4s'}}>
                    <div className="inline-flex items-center gap-8 px-8 py-4 glass-modern rounded-2xl">
                      <div className="text-center">
                        <div className="stat-number-modern">{products.length}</div>
                        <div className="text-gray-600 text-sm font-medium">{t('categories.product.available')}</div>
                      </div>
                      <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                      <div className="text-center">
                        <div className="stat-number-modern">{currentPage}</div>
                        <div className="text-gray-600 text-sm font-medium">{t('categories.page.of').replace('{totalPages}', totalPages.toString())}</div>
                      </div>
                      {products.length > 0 && (
                        <>
                          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                          <div className="text-center">
                            <div className="stat-number-modern">⭐</div>
                            <div className="text-gray-600 text-sm font-medium">{t('categories.best.quality')}</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="section-modern bg-gradient-subtle">
          <div className="container-modern">
            
            {products.length > 0 ? (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product, index) => (
                    <div 
                      key={product.id} 
                      className="card-modern-2030 group overflow-hidden animate-slide-modern"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      
                      {/* Product Image */}
                      <div className="relative p-6 bg-gradient-to-br from-gray-50 to-white">
                        <div className="w-full h-48 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform">
                          {Array.isArray(product.images) && product.images.length > 0 ? (
                            <img 
                              src={getBestImageUrl(product.images[0]) || '/placeholder.svg'} 
                              alt={getLocalizedText(product, 'name') || product.name}
                              className="w-full h-full object-cover"
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
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-medium">
                              🛠️ {(getLocalizedText(product, 'name') || product.name).substring(0, 10)}...
                            </div>
                          )}
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Wishlist Button */}
                          <button
                            onClick={() => handleWishlistToggle(product.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors backdrop-blur-sm ${
                              wishlist.includes(product.id)
                                ? 'bg-red-500 text-white shadow-lg'
                                : 'bg-white bg-opacity-90 text-gray-400 hover:text-red-500 hover:bg-red-50'
                            }`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          </button>
                          
                          {/* Quick View Button */}
                          <Link
                            href={`/products/${product.id}`}
                            className="w-10 h-10 rounded-xl bg-white bg-opacity-90 text-gray-600 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors backdrop-blur-sm"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        </div>

                        {/* Stock Badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full backdrop-blur-sm">
                            {t('categories.available')}: {product.stock}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        {/* Rating */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {product.rating || 5.0} ({product.reviews_count || 0})
                            </span>
                          </div>
                        </div>

                        {/* Product Name */}
                        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                          {getLocalizedText(product, 'name') || product.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                          {getLocalizedText(product, 'description') || product.description}
                        </p>

                        {/* Supplier */}
                        {product.supplier && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{t('categories.supplier')}:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700 font-medium">
                                  {getLocalizedText(product.supplier, 'name') || product.supplier.name}
                                </span>
                                {product.supplier.rating && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-500 text-sm">⭐</span>
                                    <span className="text-sm text-gray-600">{product.supplier.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full btn-modern-primary py-3 group/btn"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L7 13m0 0h10M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                            </svg>
                            {t('categories.add.cart')}
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Modern Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 animate-slide-modern" style={{animationDelay: '0.5s'}}>
                    <div className="flex justify-center items-center glass-modern px-8 py-4 rounded-2xl">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 btn-modern-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('categories.previous')}
                      </button>
                      
                      <div className="flex items-center gap-2 mx-6">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                          if (page > totalPages) return null;
                          
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-12 h-12 rounded-xl font-semibold transition-all ${
                                page === currentPage
                                  ? 'btn-modern-primary'
                                  : 'bg-white bg-opacity-80 text-gray-600 hover:bg-red-50 hover:text-red-600'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 btn-modern-outline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {t('categories.next')}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Modern Empty State */
              <div className="text-center py-20 animate-slide-modern">
                <div className="glass-modern p-16 rounded-3xl max-w-2xl mx-auto">
                  <div className="text-8xl mb-8">📂</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('categories.no.products.title')}</h2>
                  <p className="text-xl text-gray-600 mb-12 leading-relaxed">{t('categories.no.products.subtitle')}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/categories"
                      className="btn-modern-primary inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {t('categories.browse.other')}
                    </Link>
                    <Link 
                      href="/products"
                      className="btn-modern-outline inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {t('categories.browse.all.products')}
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
} 