'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { Product, Category, WishlistItem } from '../types/api';
import { getBestImageUrl, getImageFallbacks } from '../dashboard/utils/imageUtils';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, warning, error } = useToast();
  const { t, language } = useLanguage();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('🔄 Products: Language changed to', language, '- refetching categories');
    fetchCategories();
  }, [language]);

  useEffect(() => {
    console.log('🔄 Products: Refetching products due to language change:', language);
    fetchProducts();
  }, [activeFilter, sortBy, sortOrder, searchTerm, currentPage, language]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const category = searchParams.get('category');
    const focus = searchParams.get('focus');
    
    if (category) {
      setActiveFilter(parseInt(category) || 'all');
    }
    
    // Auto-focus search input if coming from navbar search
    if (focus === 'search' && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      console.log('🏷️ Fetching categories...');
      const response = await ApiService.getCategories();
      console.log('📂 Categories response:', response);
      console.log('📂 Categories response.data:', response.data);
      console.log('📂 هل categories array?', Array.isArray(response.data));
      
      // البيانات في response.data مباشرة (Array من الفئات)
      if (response.data && Array.isArray(response.data)) {
        console.log('🎉 Categories نجح! عدد الفئات:', response.data.length);
        setCategories(response.data);
      } else {
        console.warn('⚠️ Categories response not as expected:', response);
        setCategories([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const query = {
        page: currentPage,
        per_page: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(activeFilter !== 'all' && { category_id: activeFilter as number }),
        sort: sortBy,
        order: sortOrder
      };

      const response = await ApiService.getProducts(query);
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
        setTotalPages(1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await ApiService.getWishlist();
      console.log('🎯 Products: Wishlist response:', response);
      
      if (response.success && response.data) {
        let wishlistData: any[] = [];
        
        if ((response.data as any).wishlist && Array.isArray((response.data as any).wishlist)) {
          // Format: { success: true, data: { wishlist: [...] } }
          wishlistData = (response.data as any).wishlist;
        } else if (Array.isArray(response.data)) {
          // Format: { success: true, data: [...] }
          wishlistData = response.data;
        }
        
        const wishlistIds = wishlistData.map((item: any) => item.product_id || item.product?.id || item.id);
        console.log('🎯 Products: Wishlist IDs:', wishlistIds);
        setWishlist(wishlistIds);
      } else {
        console.log('🎯 Products: No wishlist data');
        setWishlist([]);
      }
    } catch (error) {
      console.log('🎯 Products: Wishlist fetch error:', error);
      setWishlist([]);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }

    try {
      const success_cart = await addToCart(product.id, 1);
      if (success_cart) {
        success(t('toast.cart.added'), t('toast.cart.added.desc'));
      } else {
        error('فشل في إضافة المنتج', 'حدث خطأ أثناء إضافة المنتج للسلة. يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error('❌ خطأ في إضافة المنتج للسلة:', err);
      error('خطأ في إضافة المنتج', 'هذا المنتج غير متوفر حالياً أو حدث خطأ في الشبكة.');
    }
  };

  const handleWishlistToggle = async (product: Product) => {
    if (!isAuthenticated) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }

    const isInWishlist = wishlist.includes(product.id);

    try {
      if (isInWishlist) {
        await ApiService.removeFromWishlist(product.id);
        setWishlist(prev => prev.filter(id => id !== product.id));
      success(t('toast.wishlist.removed'), t('toast.wishlist.removed.desc'));
    } else {
        await ApiService.addToWishlist(product.id);
        setWishlist(prev => [...prev, product.id]);
      success(t('toast.wishlist.added'), t('toast.wishlist.added.desc'));
      }
    } catch (error) {
      console.error('Wishlist operation failed:', error);
    }
  };

  // Filter options - based on categories from API
  const filters = [
    { id: 'all', name: t('products.filter.all') },
    ...categories.map(cat => ({
      id: cat.id,
      name: cat.name
    }))
  ];

  // Search and sort handlers (API handles filtering now)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    if (value.includes('-')) {
      const [field, order] = value.split('-');
      setSortBy(field as 'name' | 'price' | 'created_at');
      setSortOrder(order as 'asc' | 'desc');
    } else {
      setSortBy(value as 'name' | 'price' | 'created_at');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden" suppressHydrationWarning={true}>
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gray-50 to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl opacity-20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
      <Header />
      
        {/* Modern Hero Section */}
        <section className="hero-modern relative pt-28 pb-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-20 w-24 h-24 bg-red-500 bg-opacity-5 rounded-full animate-float" />
            <div className="absolute top-48 right-32 w-16 h-16 bg-red-500 bg-opacity-10 rounded-full animate-pulse-modern" />
            <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-gray-500 bg-opacity-5 rounded-full animate-float" style={{animationDelay: '1s'}} />
          </div>
          
          <div className="container-modern relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge */}
              <div className="animate-slide-modern">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-8">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🛠️</span>
                    Professional Tools & Equipment
                  </span>
                </div>
              </div>
              
              {/* Main Heading */}
              <div className="animate-slide-modern" style={{animationDelay: '0.2s'}}>
                <h1 className="text-modern-heading mb-8">
            {t('products.title')}
                  <span className="block text-modern-accent mt-2">
                    Premium Collection
                  </span>
          </h1>
              </div>
              
              {/* Description */}
              <div className="animate-slide-modern mb-12" style={{animationDelay: '0.4s'}}>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('products.subtitle')}
          </p>
              </div>

              {/* Stats */}
              <div className="animate-slide-modern" style={{animationDelay: '0.6s'}}>
                <div className="inline-flex items-center gap-8 px-8 py-4 glass-modern rounded-2xl">
                  <div className="text-center">
                    <div className="stat-number-modern">{products.length}</div>
                    <div className="text-gray-600 text-sm font-medium">{t('categories.products')}</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center">
                    <div className="stat-number-modern">{currentPage}</div>
                    <div className="text-gray-600 text-sm font-medium">{t('products.current.page')}</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center">
                    <div className="stat-number-modern">{totalPages}</div>
                    <div className="text-gray-600 text-sm font-medium">{t('products.total.pages')}</div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
        <section className="section-modern bg-gradient-subtle">
          <div className="container-modern">
          
            {/* Modern Controls */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Search Card */}
              <div className="card-modern-2030 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t('products.search.title')}
                </h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('common.search')}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              />
            </form>
              </div>

              {/* Sort Card */}
              <div className="card-modern-2030 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  {t('products.sort.title')}
                </h3>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                <option value="name-asc">{t('products.sort.name')} (A-Z)</option>
                <option value="name-desc">{t('products.sort.name')} (Z-A)</option>
                <option value="price-asc">{t('products.sort.price')} (Low)</option>
                <option value="price-desc">{t('products.sort.price')} (High)</option>
                <option value="created_at-desc">{t('products.sort.newest')}</option>
              </select>
            </div>
          </div>

            {/* Modern Filters */}
            <div className="card-modern-2030 p-6 mb-12">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
                {t('products.filters.category')}
              </h3>
              <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as number | 'all')}
                    className={`px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeFilter === filter.id
                        ? 'btn-modern-primary'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {filter.name}
              </button>
            ))}
              </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
                <div className="inline-flex items-center gap-4 glass-modern px-8 py-6 rounded-2xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
                  <span className="text-gray-600 font-medium">جاري تحميل المنتجات...</span>
                </div>
            </div>
          ) : (
            <>
            {/* Modern Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product, index) => (
              <div
                key={product.id}
                onClick={() => window.location.href = `/products/${product.id}`}
                className="card-modern-2030 group overflow-hidden animate-slide-modern cursor-pointer hover:shadow-2xl transition-all duration-300"
                  style={{animationDelay: `${index * 0.1}s`}}
              >
                  {/* Product Image & Badges */}
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    {/* Product Image */}
                    <div className="w-full h-full flex items-center justify-center p-4">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={getBestImageUrl(product.images[0])} 
                        alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const currentSrc = e.currentTarget.src;
                          const fallbacks = getImageFallbacks(product.images[0]);
                          
                          for (const fallbackUrl of fallbacks) {
                            if (currentSrc !== fallbackUrl && !currentSrc.includes('placeholder')) {
                              e.currentTarget.src = fallbackUrl;
                              return;
                            }
                          }
                          
                          if (!currentSrc.includes('placeholder.svg')) {
                            e.currentTarget.src = '/placeholder.svg';
                          }
                        }}
                      />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                          📦
                        </div>
                    )}
                  </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4">
                      <div className="px-3 py-1 bg-gradient-accent text-white text-xs font-medium rounded-full">
                        جديد
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                        className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 ${
                          wishlist.includes(product.id) 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                  <div className="p-6">
                  {/* Category */}
                  {product.category && (
                      <div className="mb-3">
                      <Link 
                        href={`/categories/${product.category.id}`}
                        onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full hover:bg-blue-100 transition-colors"
                      >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {product.category.name}
                      </Link>
                    </div>
                  )}

                    {/* Product Name */}
                    <h3 className="font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                  {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(4.8)</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-2xl font-bold text-gray-900">
                        {parseFloat(product.sale_price || product.price).toFixed(0)} ج.م
                      </span>
                      {product.sale_price && parseFloat(product.sale_price) !== parseFloat(product.price) && (
                        <span className="text-sm text-gray-500 line-through">
                          {parseFloat(product.price).toFixed(0)} ج.م
                        </span>
                      )}
                  </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-full btn-modern-primary py-3 group/btn"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L7 13m0 0h10M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                        </svg>
                        <span>{t('common.add.to.cart')}</span>
                      </span>
                    </button>
                </div>
              </div>
            ))}
          </div>
              </>
            )}

            {/* Modern Pagination */}
          {totalPages > 1 && (
              <div className="mt-16 flex justify-center">
                <div className="glass-modern px-8 py-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
              </button>
              
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum > totalPages) return null;
                
                return (
                  <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all ${
                            currentPage === pageNum
                              ? 'bg-red-500 text-white shadow-md'
                              : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                          {pageNum}
                  </button>
                );
              })}
              
                    {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
              </button>
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
