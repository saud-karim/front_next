'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

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

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoggedIn } = useUser();
  const { success, warning } = useToast();

  // Set initial filter based on URL parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setActiveFilter(categoryParam);
    }
  }, [searchParams]);

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
    success('تمت الإضافة للسلة', `تم إضافة ${product.name} إلى سلة التسوق`);
  };

  const handleWishlistToggle = (product: Product) => {
    if (!isLoggedIn) {
      warning('تسجيل الدخول مطلوب', 'يرجى تسجيل الدخول أولاً لإضافة المنتجات لقائمة الأمنيات');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      success('تمت الإزالة بنجاح', 'تم إزالة المنتج من قائمة الأمنيات');
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
      success('تمت الإضافة بنجاح', 'تم إضافة المنتج لقائمة الأمنيات');
    }
  };

  const allProducts = [
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
    },
    {
      id: 7,
      name: "Pneumatic Nail Gun",
      category: "power-tools",
      price: "$199",
      originalPrice: "$249",
      rating: 4.7,
      reviews: 425,
      image: "🔫",
      features: ["Pneumatic Power", "Quick Load", "Depth Control", "Anti-Jam"],
      badge: "Top Rated",
      badgeColor: "bg-green-500"
    },
    {
      id: 8,
      name: "Professional Level Set",
      category: "measuring",
      price: "$129",
      originalPrice: "$159",
      rating: 4.8,
      reviews: 298,
      image: "📏",
      features: ["Magnetic Base", "Bubble Vials", "Aluminum Frame", "3-Piece Set"],
      badge: "Quality",
      badgeColor: "bg-indigo-500"
    },
    {
      id: 9,
      name: "Heavy Duty Gloves",
      category: "safety",
      price: "$29",
      originalPrice: "$39",
      rating: 4.6,
      reviews: 1032,
      image: "🧤",
      features: ["Cut Resistant", "Grip Enhanced", "Breathable", "Machine Washable"],
      badge: "Essential",
      badgeColor: "bg-yellow-500"
    },
    {
      id: 10,
      name: "Industrial Wrench Set",
      category: "hand-tools",
      price: "$159",
      originalPrice: "$199",
      rating: 4.9,
      reviews: 667,
      image: "🔧",
      features: ["Chrome Finish", "Metric & Imperial", "Case Included", "12-Piece Set"],
      badge: "Complete",
      badgeColor: "bg-pink-500"
    },
    {
      id: 11,
      name: "Digital Multimeter",
      category: "measuring",
      price: "$79",
      originalPrice: "$99",
      rating: 4.5,
      reviews: 234,
      image: "📊",
      features: ["Auto Range", "True RMS", "Data Hold", "Backlit Display"],
      badge: "Tech",
      badgeColor: "bg-cyan-500"
    },
    {
      id: 12,
      name: "Welding Machine MIG",
      category: "heavy-machinery",
      price: "$899",
      originalPrice: "$1,099",
      rating: 4.8,
      reviews: 189,
      image: "🔥",
      features: ["MIG/MAG", "Digital Display", "Wire Feed", "Portable Design"],
      badge: "Professional",
      badgeColor: "bg-red-600"
    }
  ];

  const filters = [
    { id: 'all', name: 'All Products', count: allProducts.length },
    { id: 'power-tools', name: 'Power Tools', count: allProducts.filter(p => p.category === 'power-tools').length },
    { id: 'hand-tools', name: 'Hand Tools', count: allProducts.filter(p => p.category === 'hand-tools').length },
    { id: 'safety', name: 'Safety Equipment', count: allProducts.filter(p => p.category === 'safety').length },
    { id: 'measuring', name: 'Measuring Tools', count: allProducts.filter(p => p.category === 'measuring').length },
    { id: 'heavy-machinery', name: 'Heavy Machinery', count: allProducts.filter(p => p.category === 'heavy-machinery').length }
  ];

  // Filter and search products
  let filteredProducts = activeFilter === 'all' 
    ? allProducts 
    : allProducts.filter(product => product.category === activeFilter);

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseInt(a.price.slice(1).replace(',', '')) - parseInt(b.price.slice(1).replace(',', ''));
      case 'price-high':
        return parseInt(b.price.slice(1).replace(',', '')) - parseInt(a.price.slice(1).replace(',', ''));
      case 'rating':
        return b.rating - a.rating;
      case 'reviews':
        return b.reviews - a.reviews;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            🛠️ Professional Tools
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Construction <span className="text-gradient">Tools Catalog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Browse our complete collection of professional construction tools, equipment, and safety gear. 
            Quality products trusted by professionals worldwide.
          </p>
          <div className="text-sm text-gray-400">
            Showing {sortedProducts.length} of {allProducts.length} products
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'gradient-red text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="card-hover group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-500"
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Product Image & Badge */}
                  <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                    <div className={`absolute top-3 left-3 ${product.badgeColor} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                      {product.badge}
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
                  <div className="p-5">
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
                      {product.name}
                    </h3>

                    {/* Features */}
                    <div className="grid grid-cols-1 gap-1 mb-3">
                      {product.features.slice(0, 2).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-gray-600">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 