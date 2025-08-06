'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { mockProducts } from '../data/mockData';
import { Product, getLocalizedText } from '../types/multilingual';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoggedIn } = useUser();
  const { success, warning } = useToast();
  const { t, language } = useLanguage();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load products from API (using mock data)
    setProducts(mockProducts);
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    const focus = searchParams.get('focus');
    
    if (category) {
      setActiveFilter(category);
    }
    
    // Auto-focus search input if coming from navbar search
    if (focus === 'search' && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchParams]);

  const handleAddToCart = (product: Product) => {
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
  };

  const handleWishlistToggle = (product: Product) => {
    if (!isLoggedIn) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      success(t('toast.wishlist.removed'), t('toast.wishlist.removed.desc'));
    } else {
      addToWishlist({
        id: product.id,
        name: getLocalizedText(product.name, language),
        price: `$${product.price}`,
        originalPrice: `$${product.originalPrice}`,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        badge: getLocalizedText(product.badge, language),
        badgeColor: product.badgeColor
      });
      success(t('toast.wishlist.added'), t('toast.wishlist.added.desc'));
    }
  };

  const filters = [
    { id: 'all', name: t('products.filter.all'), count: products.length },
    { id: 'power-tools', name: t('products.filter.power-tools'), count: products.filter(p => p.category === 'power-tools').length },
    { id: 'hand-tools', name: t('products.filter.hand-tools'), count: products.filter(p => p.category === 'hand-tools').length },
    { id: 'safety', name: t('products.filter.safety'), count: products.filter(p => p.category === 'safety').length }
  ];

  // Filter products
  let filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  // Search products
  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product => {
      const productName = getLocalizedText(product.name, language);
      const searchInName = productName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const searchInFeatures = product.features.some(feature => {
        const featureText = getLocalizedText(feature, language);
        return featureText.toLowerCase().includes(searchTerm.toLowerCase());
      });
      
      return searchInName || searchInFeatures;
    });
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        const nameA = getLocalizedText(a.name, language);
        const nameB = getLocalizedText(b.name, language);
        return nameA.localeCompare(nameB);
    }
  });

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
            {t('products.showing')} {sortedProducts.length} {t('products.of')} {products.length} {t('nav.products')}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            {/* Search */}
            <div className="relative flex-1 w-full md:w-auto">
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
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <span className="text-gray-700 font-medium">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="name">{t('products.sort.name')}</option>
                <option value="price-low">{t('products.sort.price-low')}</option>
                <option value="price-high">{t('products.sort.price-high')}</option>
                <option value="rating">{t('products.sort.rating')}</option>
                <option value="reviews">{t('products.sort.reviews')}</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'gradient-red text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="card-hover group bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500"
              >
                {/* Product Image & Badge */}
                <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                  <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {getLocalizedText(product.badge, language)}
                  </div>
                  <div className="text-5xl mb-3">{product.image}</div>
                  <div className="absolute top-3 right-3">
                    <button 
                      onClick={() => handleWishlistToggle(product)}
                      className={`w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center transition-colors ${
                        isInWishlist(product.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
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
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {getLocalizedText(product.name, language)}
                  </h3>

                  {/* Features */}
                  <div className="grid grid-cols-1 gap-1 mb-3">
                    {product.features.slice(0, 2).map((feature, i) => (
                      <div key={i} className="flex items-center text-xs text-gray-600">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {getLocalizedText(feature, language)}
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
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

          {/* Load More Button */}
          {sortedProducts.length > 0 && (
            <div className="text-center mt-12">
              <button className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-lg">
                {t('products.load.more')}
              </button>
            </div>
          )}

          {/* No Results */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('products.no.results')}</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('all');
                }}
                className="gradient-red text-white px-6 py-3 rounded-lg font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 