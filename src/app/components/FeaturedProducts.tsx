'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  badge: string;
  badgeColor: string;
}

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoggedIn } = useUser();
  const { success, warning } = useToast();
  const { t } = useLanguage();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseInt(product.price.slice(1).replace(',', '')),
      originalPrice: parseInt(product.originalPrice.slice(1).replace(',', '')),
      image: product.image,
      category: product.category,
      features: product.features
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
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        badge: product.badge,
        badgeColor: product.badgeColor
      });
      success(t('toast.wishlist.added'), t('toast.wishlist.added.desc'));
    }
  };

  const products = [
    {
      id: 1,
      name: "DeWalt 20V Max Cordless Drill",
      category: "power-tools",
      price: "$299",
      originalPrice: "$349",
      rating: 4.8,
      reviews: 1247,
      image: "🔋",
      features: ["Brushless Motor", "20V Battery", "LED Light", "2-Speed"],
      badge: "Best Seller",
      badgeColor: "bg-red-500"
    },
    {
      id: 2,
      name: "Professional Tool Set 150pcs",
      category: "hand-tools",
      price: "$189",
      originalPrice: "$229",
      rating: 4.9,
      reviews: 892,
      image: "🧰",
      features: ["Chrome Vanadium", "Lifetime Warranty", "Organized Case", "150 Pieces"],
      badge: "Premium",
      badgeColor: "bg-purple-500"
    },
    {
      id: 3,
      name: "Smart Safety Helmet",
      category: "safety",
      price: "$159",
      originalPrice: "$199",
      rating: 4.7,
      reviews: 543,
      image: "🛡️",
      features: ["IoT Sensors", "Impact Detection", "Bluetooth", "LED Indicators"],
      badge: "New Tech",
      badgeColor: "bg-blue-500"
    },
    {
      id: 4,
      name: "Laser Distance Meter",
      category: "measuring",
      price: "$89",
      originalPrice: "$119",
      rating: 4.6,
      reviews: 321,
      image: "📐",
      features: ["100m Range", "Bluetooth", "IP54 Rating", "Color Display"],
      badge: "Hot Deal",
      badgeColor: "bg-orange-500"
    },
    {
      id: 5,
      name: "Concrete Mixer Pro",
      category: "heavy-machinery",
      price: "$2,499",
      originalPrice: "$2,899",
      rating: 4.9,
      reviews: 156,
      image: "🚜",
      features: ["350L Capacity", "Electric Motor", "Self-Loading", "Heavy Duty"],
      badge: "Industrial",
      badgeColor: "bg-gray-600"
    },
    {
      id: 6,
      name: "Multi-Material Saw",
      category: "power-tools",
      price: "$449",
      originalPrice: "$529",
      rating: 4.8,
      reviews: 678,
      image: "⚡",
      features: ["Variable Speed", "Dust Collection", "Quick Change", "Safety Guard"],
      badge: "Pro Choice",
      badgeColor: "bg-teal-500"
    }
  ];

  const filters = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'power-tools', name: 'Power Tools', count: products.filter(p => p.category === 'power-tools').length },
    { id: 'hand-tools', name: 'Hand Tools', count: products.filter(p => p.category === 'hand-tools').length },
    { id: 'safety', name: 'Safety', count: products.filter(p => p.category === 'safety').length },
    { id: 'measuring', name: 'Measuring', count: products.filter(p => p.category === 'measuring').length }
  ];

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(product => product.category === activeFilter);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            ⭐ Featured Products
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Professional <span className="text-gradient">Tool Collection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our hand-picked selection of premium construction tools, 
            trusted by professionals worldwide for their quality and performance.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
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
                  {product.badge}
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
                  {product.name}
                </h3>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {product.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                    <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    Save {Math.round(((parseInt(product.originalPrice.slice(1)) - parseInt(product.price.slice(1))) / parseInt(product.originalPrice.slice(1))) * 100)}%
                  </div>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 616 0z" />
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
            Load More Products
          </button>
        </div>
      </div>
    </section>
  );
}