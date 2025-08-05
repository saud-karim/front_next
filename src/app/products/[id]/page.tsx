'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';

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
  description: string;
  specifications: { [key: string]: string };
  images: string[];
}

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoggedIn } = useUser();
  const { success, warning } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleWishlistToggle = (product: Product) => {
    if (!isLoggedIn) {
      alert('يرجى تسجيل الدخول أولاً لإضافة المنتجات لقائمة الأمنيات');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
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
    }
  };

  // Enhanced product data with more details
  const allProducts: Product[] = [
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
      badgeColor: "bg-red-500",
      description: "Professional-grade cordless drill with brushless motor technology for superior performance and extended runtime. Features LED work light and dual-speed transmission for versatile applications.",
      specifications: {
        "Motor": "Brushless DC Motor",
        "Battery": "20V MAX Lithium-Ion",
        "Chuck": "1/2\" Single Sleeve Ratcheting",
        "Speed Range": "0-450/0-1,650 RPM",
        "Torque": "300 Unit Watts Out",
        "Weight": "2.8 lbs",
        "Warranty": "3 Years Limited"
      },
      images: ["🔋", "⚡", "🔧", "🛠️"]
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
      badgeColor: "bg-purple-500",
      description: "Complete tool set with 150 pieces of professional-grade tools. Made from chrome vanadium steel for durability and precision. Includes organized carrying case.",
      specifications: {
        "Material": "Chrome Vanadium Steel",
        "Pieces": "150 Tools",
        "Case": "Blow Molded Plastic",
        "Socket Sizes": "1/4\", 3/8\", 1/2\" Drive",
        "Ratchets": "72-Tooth",
        "Warranty": "Lifetime",
        "Weight": "15 lbs"
      },
      images: ["🧰", "🔧", "🔩", "⚙️"]
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
      badgeColor: "bg-blue-500",
      description: "Next-generation safety helmet with IoT sensors and impact detection technology. Features Bluetooth connectivity and LED indicators for enhanced workplace safety.",
      specifications: {
        "Material": "High-Density Polyethylene",
        "Sensors": "Accelerometer, Gyroscope",
        "Connectivity": "Bluetooth 5.0",
        "Battery Life": "30 Days",
        "Weight": "380g",
        "Standards": "ANSI Z89.1, EN 397",
        "Warranty": "2 Years"
      },
      images: ["🛡️", "📱", "🔋", "💡"]
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
      badgeColor: "bg-orange-500",
      description: "Precision laser distance meter with 100m range and Bluetooth connectivity. Features color display and IP54 water resistance rating.",
      specifications: {
        "Range": "0.05m to 100m",
        "Accuracy": "±1.5mm",
        "Display": "2.4\" Color LCD",
        "Connectivity": "Bluetooth",
        "Protection": "IP54",
        "Battery": "2x AAA",
        "Warranty": "2 Years"
      },
      images: ["📐", "📏", "🔍", "📊"]
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
      badgeColor: "bg-gray-600",
      description: "Professional concrete mixer with 350L capacity and electric motor. Features self-loading mechanism and heavy-duty construction for industrial applications.",
      specifications: {
        "Capacity": "350 Liters",
        "Motor": "Electric 220V",
        "Weight": "180 kg",
        "Mixing Speed": "28 RPM",
        "Material": "Steel Drum",
        "Features": "Self-Loading",
        "Warranty": "5 Years"
      },
      images: ["🚜", "⚙️", "🔧", "🏗️"]
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
      badgeColor: "bg-teal-500",
      description: "Versatile multi-material saw with variable speed control and dust collection system. Features quick blade change and advanced safety guard.",
      specifications: {
        "Motor": "15 Amp",
        "Speed": "0-5000 RPM",
        "Blade": "7-1/4\"",
        "Dust Collection": "Yes",
        "Weight": "9.2 lbs",
        "Laser Guide": "Yes",
        "Warranty": "3 Years"
      },
      images: ["⚡", "🔪", "🔧", "🛡️"]
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
      badgeColor: "bg-green-500",
      description: "Professional pneumatic nail gun with quick load mechanism and depth control. Features anti-jam technology and ergonomic design.",
      specifications: {
        "Type": "Pneumatic",
        "Nail Size": "1-1/4\" to 2-1/2\"",
        "Magazine": "100 Nails",
        "Pressure": "70-120 PSI",
        "Weight": "4.2 lbs",
        "Trigger": "Sequential/Contact",
        "Warranty": "2 Years"
      },
      images: ["🔫", "🔩", "⚙️", "🛠️"]
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
      badgeColor: "bg-indigo-500",
      description: "Professional 3-piece level set with magnetic base and precision bubble vials. Features durable aluminum frame construction.",
      specifications: {
        "Pieces": "3 Levels",
        "Material": "Aluminum",
        "Accuracy": "0.0005\"/inch",
        "Magnetic": "Yes",
        "Sizes": "24\", 48\", Torpedo",
        "Vials": "3 per level",
        "Warranty": "Lifetime"
      },
      images: ["📏", "🧲", "⚖️", "📐"]
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
      badgeColor: "bg-yellow-500",
      description: "Heavy-duty work gloves with cut resistance and enhanced grip. Breathable material with machine washable design for easy maintenance.",
      specifications: {
        "Material": "Synthetic Leather",
        "Cut Level": "ANSI A3",
        "Grip": "Enhanced Palm",
        "Breathability": "Yes",
        "Washable": "Machine Wash",
        "Sizes": "S, M, L, XL",
        "Warranty": "1 Year"
      },
      images: ["🧤", "✋", "🛡️", "💪"]
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
      badgeColor: "bg-pink-500",
      description: "Complete 12-piece industrial wrench set with chrome finish. Includes both metric and imperial sizes with organized carrying case.",
      specifications: {
        "Pieces": "12 Wrenches",
        "Finish": "Chrome Plated",
        "Sizes": "Metric & Imperial",
        "Material": "Chrome Vanadium",
        "Case": "Blow Molded",
        "Angle": "15 Degree",
        "Warranty": "Lifetime"
      },
      images: ["🔧", "⚙️", "🧰", "✨"]
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
      badgeColor: "bg-cyan-500",
      description: "Advanced digital multimeter with auto-ranging and true RMS measurement. Features data hold function and backlit display for low-light conditions.",
      specifications: {
        "Type": "Digital",
        "Range": "Auto/Manual",
        "RMS": "True RMS",
        "Display": "6000 Count LCD",
        "Backlight": "Yes",
        "Safety": "CAT III 600V",
        "Warranty": "3 Years"
      },
      images: ["📊", "🔌", "📱", "⚡"]
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
      badgeColor: "bg-red-600",
      description: "Professional MIG welding machine with digital display and wire feed system. Portable design suitable for both MIG and MAG welding applications.",
      specifications: {
        "Type": "MIG/MAG",
        "Power": "220V",
        "Wire Size": "0.6-1.2mm",
        "Duty Cycle": "60% at 200A",
        "Display": "Digital LCD",
        "Weight": "15 kg",
        "Warranty": "2 Years"
      },
      images: ["🔥", "⚡", "🔧", "🏭"]
    }
  ];

  const product = allProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="gradient-red text-white px-6 py-3 rounded-lg">
            Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: parseInt(product.price.slice(1).replace(',', '')),
        originalPrice: parseInt(product.originalPrice.slice(1).replace(',', '')),
        image: product.image,
        category: product.category,
        features: product.features
      });
    }
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-red-600">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Product Images */}
            <div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 mb-6 text-center">
                <div className={`inline-block px-3 py-1 ${product.badgeColor} text-white text-sm font-bold rounded-full mb-4`}>
                  {product.badge}
                </div>
                <div className="text-8xl mb-4">{product.images[selectedImageIndex]}</div>
              </div>
              
              {/* Image Thumbnails */}
              <div className="flex gap-4 justify-center">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl transition-all ${
                      selectedImageIndex === index
                        ? 'bg-red-100 border-2 border-red-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {img}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-lg text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">{product.price}</span>
                <span className="text-2xl text-gray-500 line-through">{product.originalPrice}</span>
                <span className="text-lg text-green-600 font-semibold">
                  Save {Math.round(((parseInt(product.originalPrice.slice(1)) - parseInt(product.price.slice(1))) / parseInt(product.originalPrice.slice(1))) * 100)}%
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-lg font-semibold text-gray-900">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 gradient-red text-white py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-lg"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => handleWishlistToggle(product)}
                    className={`px-6 py-4 border-2 rounded-xl transition-all duration-300 ${
                      isInWishlist(product.id) 
                        ? 'border-red-500 text-red-600 bg-red-50' 
                        : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>2-Year Warranty</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-Day Returns</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Expert Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Technical <span className="text-gradient">Specifications</span>
          </h2>
          
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Related <span className="text-gradient">Products</span>
              </h2>
              <p className="text-gray-600">You might also be interested in these products</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="card-hover bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{relatedProduct.image}</div>
                    <h3 className="font-semibold text-gray-900 mb-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <span className="text-xl font-bold text-gray-900">{relatedProduct.price}</span>
                      <span className="text-sm text-gray-500 line-through">{relatedProduct.originalPrice}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${relatedProduct.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button className="px-4 py-2 gradient-red text-white rounded-lg hover:shadow-lg transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
} 