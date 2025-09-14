'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { mockProducts } from '../../data/mockData';
import { Product, getLocalizedText } from '../../types/multilingual';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoggedIn } = useUser();
  const { success, warning } = useToast();
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Use mock products with multilingual support
  const allProducts = mockProducts;
  const product = allProducts.find(p => p.id === productId);

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

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-8xl mb-8">🔍</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('product.not.found')}</h2>
          <p className="text-gray-600 mb-8">{t('product.not.found.desc')}</p>
          <Link href="/products" className="gradient-red text-white px-6 py-3 rounded-lg">
            {t('product.back.to.products')}
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
        name: getLocalizedText(product.name, language),
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        features: product.features.map(f => getLocalizedText(f, language))
      });
    }
    success(t('toast.cart.added'), `${quantity} ${getLocalizedText(product.name, language)} ${t('toast.cart.added.desc')}`);
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Breadcrumb */}
      <section className="pt-24 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-600">{t('nav.home')}</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-red-600">{t('nav.products')}</Link>
            <span>›</span>
            <span className="text-gray-900">{getLocalizedText(product.name, language)}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="relative mb-6">
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-8xl border-2 border-gray-200">
                  {product.image}
                </div>
                <div className={`absolute top-4 left-4 ${product.badgeColor} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                  {getLocalizedText(product.badge, language)}
                </div>
                <button
                  onClick={() => handleWishlistToggle(product)}
                  className={`absolute top-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-colors ${
                    isInWishlist(product.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating} ({product.reviews} {t('product.reviews')})
                </span>
              </div>

              {/* Product Name */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {getLocalizedText(product.name, language)}
              </h1>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {getLocalizedText(product.description, language)}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-gray-900">${product.price}</span>
                <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                <span className="text-lg font-semibold text-green-600 bg-green-100 px-3 py-1 rounded">
                  {t('product.save')} {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{t('product.features')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{getLocalizedText(feature, language)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:text-red-600"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-gray-900 font-semibold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:text-red-600"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">{t('product.quantity')}</span>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 gradient-red text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
                  >
                    {t('products.add.cart')} - ${(parseFloat(product.price) * quantity).toFixed(2)}
                  </button>
                  <button
                    onClick={() => handleWishlistToggle(product)}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-red-500 hover:text-red-600 transition-all duration-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('product.specifications')}</h2>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">{getLocalizedText(key as any, language)}</span>
                    <span className="text-gray-600">{getLocalizedText(value, language)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('product.related')}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    className="card-hover bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">{relatedProduct.image}</div>
                      <h3 className="font-semibold text-gray-900">{getLocalizedText(relatedProduct.name, language)}</h3>
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold text-red-600">${relatedProduct.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">${relatedProduct.originalPrice}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 