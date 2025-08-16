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
  const { success, warning } = useToast();
  const { t, language } = useLanguage();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeFilter, sortBy, sortOrder, searchTerm, currentPage]);

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
      
      if (response.data && Array.isArray(response.data)) {
        const wishlistIds = response.data.map((item: any) => item.product_id || item.id);
        setWishlist(wishlistIds);
      } else {
        setWishlist([]);
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
    success(t('toast.cart.added'), t('toast.cart.added.desc'));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            🛠️ Professional Tools
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('products.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {t('products.subtitle')}
          </p>
          <div className="text-sm text-gray-400">
            {t('products.showing')} {products.length} {t('nav.products')} - Page {currentPage} of {totalPages}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </form>

            {/* Sort */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-gray-700 font-medium">Sort By:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="name-asc">{t('products.sort.name')} (A-Z)</option>
                <option value="name-desc">{t('products.sort.name')} (Z-A)</option>
                <option value="price-asc">{t('products.sort.price')} (Low)</option>
                <option value="price-desc">{t('products.sort.price')} (High)</option>
                <option value="created_at-desc">{t('products.sort.newest')}</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as number | 'all')}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'gradient-red text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
              <p className="mt-2 text-sm text-gray-500">
                Debug: Loading={loading ? 'true' : 'false'}, Products count={products.length}
              </p>
            </div>
          ) : (
            <>
          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
              <div
                key={product.id}
                className="card-hover group bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                {/* Product Image & Badge */}
                <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    New
                  </div>
                  <div className="w-32 h-32 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => handleWishlistToggle(product)}
                      className={`w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-colors ${
                        wishlist.includes(product.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Category */}
                  {product.category && (
                    <div className="mb-2">
                      <Link 
                        href={`/categories/${product.category.id}`}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
                      >
                        📂 {product.category.name}
                      </Link>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600 ml-1">
                        {product.rating || 5.0} ({product.reviews_count || 0})
                      </span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Supplier */}
                  {product.supplier && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">المورد:</span>
                        <span className="text-xs text-gray-700 font-medium">{product.supplier.name}</span>
                        {product.supplier.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-xs">⭐</span>
                            <span className="text-xs text-gray-600">{product.supplier.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                      Stock: {product.stock}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 gradient-red text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md text-sm"
                    >
                      {t('products.add.cart')}
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      className="px-3 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-red-500 hover:text-red-600 transition-all duration-300 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page > totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'gradient-red text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('products.no.results')}</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                  setCurrentPage(1);
                }}
                className="gradient-red text-white px-6 py-3 rounded-lg font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 