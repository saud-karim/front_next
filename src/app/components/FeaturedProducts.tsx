'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { mockProducts } from '../data/mockData';
import { Product, getLocalizedText } from '../types/multilingual';

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoggedIn } = useUser();
  const { success, warning } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    // Simulate API call - in real app this would fetch from backend
    setApiProducts(mockProducts);
  }, []);

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

  const filteredProducts = apiProducts.filter(product => 
    activeFilter === 'all' || product.category === activeFilter
  );

  const filters = [
    { id: 'all', name: t('featured.filters.all'), count: apiProducts.length },
    { id: 'power-tools', name: t('featured.filters.power'), count: apiProducts.filter(p => p.category === 'power-tools').length },
    { id: 'hand-tools', name: t('featured.filters.hand'), count: apiProducts.filter(p => p.category === 'hand-tools').length },
    { id: 'safety', name: t('featured.filters.safety'), count: apiProducts.filter(p => p.category === 'safety').length }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            ⭐ {t('featured.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('featured.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('featured.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="card-hover group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Product Image & Badge */}
              <div className="relative p-8 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                <div className={`absolute top-4 left-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {getLocalizedText(product.badge, language)}
                </div>
                <div className="text-6xl mb-4">{product.image}</div>
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => handleWishlistToggle(product)}
                    className={`w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center transition-colors ${
                      isInWishlist(product.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
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
                {/* Rating */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Product Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                  {getLocalizedText(product.name, language)}
                </h3>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {product.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      {getLocalizedText(feature, language)}
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                    Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 gradient-red text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 shadow-md"
                  >
                    {t('products.add.cart')}
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-red-500 hover:text-red-600 transition-all duration-300 flex items-center justify-center"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="text-center mt-12">
          <button className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-lg">
            {t('products.load.more')}
          </button>
        </div>

        {/* Expert Help Section */}
        <div className="mt-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t('featured.cant.find')}
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              {t('featured.expert.section')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 font-semibold">
                📄 {t('featured.custom.quote')}
              </button>
              <button className="gradient-red text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold">
                🎯 {t('featured.contact.expert')}
              </button>
            </div>
          </div>
        </div>

        {/* Trusted Companies */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('featured.trusted.companies')}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 hover:opacity-80 transition-opacity">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-2xl">
                🏢
              </div>
              <span className="text-gray-600 text-sm">{t('featured.partners.1')}</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-2xl">
                🏗️
              </div>
              <span className="text-gray-600 text-sm">{t('featured.partners.2')}</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-2xl">
                🔧
              </div>
              <span className="text-gray-600 text-sm">{t('featured.partners.3')}</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center text-white text-2xl">
                🏙️
              </div>
              <span className="text-gray-600 text-sm">{t('featured.partners.4')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}