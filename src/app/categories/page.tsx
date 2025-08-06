'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
  featuredProducts: Product[];
  color: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: string;
}

export default function CategoriesPage() {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { success } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseInt(product.price.slice(1).replace(',', '')),
      originalPrice: parseInt(product.originalPrice.slice(1).replace(',', '')),
      image: product.image,
      category: 'Tools',
      features: ['Professional Grade', 'High Quality']
    });
  };

  const categories: Category[] = [
    {
      id: 'power-tools',
      name: 'Power Tools',
      description: 'Professional electric and battery-powered tools for heavy-duty construction work',
      icon: '⚡',
      productCount: 4,
      color: 'from-red-500 to-orange-500',
      featuredProducts: [
        {
          id: 1,
          name: "DeWalt 20V Max Cordless Drill",
          price: "$299",
          originalPrice: "$349",
          image: "🔋",
          rating: 4.8,
          reviews: 1247,
          badge: "Best Seller",
          badgeColor: "bg-red-500"
        },
        {
          id: 6,
          name: "Multi-Material Saw",
          price: "$449",
          originalPrice: "$529",
          image: "⚡",
          rating: 4.8,
          reviews: 678,
          badge: "Pro Choice",
          badgeColor: "bg-teal-500"
        },
        {
          id: 7,
          name: "Pneumatic Nail Gun",
          price: "$199",
          originalPrice: "$249",
          image: "🔫",
          rating: 4.7,
          reviews: 425,
          badge: "Top Rated",
          badgeColor: "bg-green-500"
        }
      ]
    },
    {
      id: 'hand-tools',
      name: 'Hand Tools',
      description: 'Traditional manual tools and tool sets for precision work and maintenance',
      icon: '🔧',
      productCount: 2,
      color: 'from-blue-500 to-cyan-500',
      featuredProducts: [
        {
          id: 2,
          name: "Professional Tool Set 150pcs",
          price: "$189",
          originalPrice: "$229",
          image: "🧰",
          rating: 4.9,
          reviews: 892,
          badge: "Premium",
          badgeColor: "bg-purple-500"
        },
        {
          id: 10,
          name: "Industrial Wrench Set",
          price: "$159",
          originalPrice: "$199",
          image: "🔧",
          rating: 4.9,
          reviews: 667,
          badge: "Complete",
          badgeColor: "bg-pink-500"
        }
      ]
    },
    {
      id: 'safety',
      name: 'Safety Equipment',
      description: 'Protective gear and safety equipment to ensure workplace safety and compliance',
      icon: '🛡️',
      productCount: 2,
      color: 'from-green-500 to-emerald-500',
      featuredProducts: [
        {
          id: 3,
          name: "Smart Safety Helmet",
          price: "$159",
          originalPrice: "$199",
          image: "🛡️",
          rating: 4.7,
          reviews: 543,
          badge: "New Tech",
          badgeColor: "bg-blue-500"
        },
        {
          id: 9,
          name: "Heavy Duty Gloves",
          price: "$29",
          originalPrice: "$39",
          image: "🧤",
          rating: 4.6,
          reviews: 1032,
          badge: "Essential",
          badgeColor: "bg-yellow-500"
        }
      ]
    },
    {
      id: 'measuring',
      name: 'Measuring Tools',
      description: 'Precision instruments for accurate measurements and quality control',
      icon: '📐',
      productCount: 3,
      color: 'from-purple-500 to-indigo-500',
      featuredProducts: [
        {
          id: 4,
          name: "Laser Distance Meter",
          price: "$89",
          originalPrice: "$119",
          image: "📐",
          rating: 4.6,
          reviews: 321,
          badge: "Hot Deal",
          badgeColor: "bg-orange-500"
        },
        {
          id: 8,
          name: "Professional Level Set",
          price: "$129",
          originalPrice: "$159",
          image: "📏",
          rating: 4.8,
          reviews: 298,
          badge: "Quality",
          badgeColor: "bg-indigo-500"
        },
        {
          id: 11,
          name: "Digital Multimeter",
          price: "$79",
          originalPrice: "$99",
          image: "📊",
          rating: 4.5,
          reviews: 234,
          badge: "Tech",
          badgeColor: "bg-cyan-500"
        }
      ]
    },
    {
      id: 'heavy-machinery',
      name: 'Heavy Machinery',
      description: 'Industrial equipment and heavy-duty machinery for large construction projects',
      icon: '🚜',
      productCount: 2,
      color: 'from-gray-600 to-gray-800',
      featuredProducts: [
        {
          id: 5,
          name: "Concrete Mixer Pro",
          price: "$2,499",
          originalPrice: "$2,899",
          image: "🚜",
          rating: 4.9,
          reviews: 156,
          badge: "Industrial",
          badgeColor: "bg-gray-600"
        },
        {
          id: 12,
          name: "Welding Machine MIG",
          price: "$899",
          originalPrice: "$1,099",
          image: "🔥",
          rating: 4.8,
          reviews: 189,
          badge: "Professional",
          badgeColor: "bg-red-600"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            🏗️ Tool Categories
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Product <span className="text-gradient">Categories</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore our comprehensive range of construction tools organized by category. 
            Find exactly what you need for your next project.
          </p>
          <div className="text-sm text-gray-400">
            {categories.length} categories • {categories.reduce((total, cat) => total + cat.productCount, 0)} products
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by <span className="text-gradient">Category</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Click on any category to explore featured products and view the complete collection
            </p>
          </div>

          {/* Category Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categories.map((category) => (
              <div
                key={category.id}
                className="card-hover group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                {/* Category Header */}
                <div className={`p-6 bg-gradient-to-r ${category.color} text-white text-center`}>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <div className="text-sm opacity-90">
                    {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/products?category=${category.id}`}
                      className="text-red-600 hover:text-red-700 font-semibold text-sm"
                    >
                      View All Products
                    </Link>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products by Category */}
      {selectedCategory && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {categories
              .filter(cat => cat.id === selectedCategory)
              .map((category) => (
                <div key={category.id}>
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-4xl mr-3">{category.icon}</span>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {category.name} <span className="text-gradient">Collection</span>
                      </h2>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.featuredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="card-hover group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500"
                      >
                        {/* Product Image & Badge */}
                        <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                          <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                            {product.badge}
                          </div>
                          <div className="text-5xl mb-3">{product.image}</div>
                          <div className="absolute top-3 right-3">
                            <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-5">
                          {/* Rating */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="flex text-yellow-400 mr-2">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">
                                {product.rating} ({product.reviews})
                              </span>
                            </div>
                          </div>

                          {/* Product Name */}
                          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                            {product.name}
                          </h3>

                          {/* Price */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold text-gray-900">{product.price}</span>
                              <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                            </div>
                            <div className="text-xs text-green-600 font-semibold">
                              Save {Math.round(((parseInt(product.originalPrice.slice(1).replace(',', '')) - parseInt(product.price.slice(1).replace(',', ''))) / parseInt(product.originalPrice.slice(1).replace(',', ''))) * 100)}%
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 gradient-red text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md text-sm"
                            >
                              Add to Cart
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

                  {/* View All Button */}
                  <div className="text-center mt-12">
                    <Link 
                      href={`/products?category=${category.id}`}
                      className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-lg inline-block"
                    >
                      View All {category.name}
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {categories.reduce((total, cat) => total + cat.productCount, 0)}+
              </div>
              <div className="text-gray-300">Total Products</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-red-400 mb-2">{categories.length}</div>
              <div className="text-gray-300">Categories</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-red-400 mb-2">24/7</div>
              <div className="text-gray-300">Support</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl font-bold text-red-400 mb-2">2-5Y</div>
              <div className="text-gray-300">Warranty</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-gray-600 mb-8">
            Our experts are here to help you find the perfect tools for your project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold"
            >
              Browse All Products
            </Link>
            <button className="border-2 border-red-500 text-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 font-semibold">
              Contact Expert
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 