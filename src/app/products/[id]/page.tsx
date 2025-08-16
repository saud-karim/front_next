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
import { Product } from '../../types/api';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, warning } = useToast();
  const { t, language } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    fetchProduct();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [productId, isAuthenticated]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProductDetails(productId);
      
      if (response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
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
      // Silent fail for wishlist
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated || !product) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }

    try {
      if (wishlist.includes(product.id)) {
        await ApiService.removeFromWishlist(product.id);
        setWishlist(prev => prev.filter(id => id !== product.id));
        success(t('toast.wishlist.removed'), t('toast.wishlist.removed.desc'));
      } else {
        await ApiService.addToWishlist(product.id);
        setWishlist(prev => [...prev, product.id]);
        success(t('toast.wishlist.added'), t('toast.wishlist.added.desc'));
      }
    } catch (error) {
      warning('حدث خطأ', 'حاول مرة أخرى');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !product) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }
    
    const success_cart = await addToCart(product.id, quantity);
    if (success_cart) {
      success(t('toast.cart.added'), `تم إضافة ${product.name} إلى سلة التسوق`);
    } else {
      warning('حدث خطأ', 'حاول مرة أخرى');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
        <Footer />
      </div>
    );
  }

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

  // Get product images
  const productImages = Array.isArray(product.images) 
    ? product.images 
    : typeof product.images === 'string' 
      ? JSON.parse(product.images) 
      : ['/images/placeholder.jpg'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Breadcrumb */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 rtl:space-x-reverse">
            <Link href="/" className="hover:text-red-600 transition-colors">الرئيسية</Link>
            <span>{'>'}</span>
            <Link href="/products" className="hover:text-red-600 transition-colors">المنتجات</Link>
            {product.category && (
              <>
                <span>{'>'}</span>
                <Link 
                  href={`/categories/${product.category.id}`} 
                  className="hover:text-red-600 transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>{'>'}</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                <img 
                  src={productImages[selectedImageIndex] || '/images/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image Thumbnails */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {productImages.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all duration-300 ${
                        selectedImageIndex === index 
                          ? 'border-red-500 ring-2 ring-red-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={image || '/images/placeholder.jpg'}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-red-600">${product.price}</span>
                  {product.category && (
                    <Link 
                      href={`/categories/${product.category.id}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
                    >
                      📂 {product.category.name}
                    </Link>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">الوصف</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">الحالة:</span>
                {product.stock > 0 ? (
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                    متوفر ({product.stock} قطعة)
                  </span>
                ) : (
                  <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-sm">
                    غير متوفر
                  </span>
                )}
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">الكمية:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 bg-gray-50 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 gradient-red text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🛒 إضافة للسلة
                  </button>
                  
                  <button
                    onClick={handleWishlistToggle}
                    className={`px-6 py-3 rounded-lg border-2 transition-all duration-300 ${
                      wishlist.includes(product.id)
                        ? 'border-red-500 text-red-500 bg-red-50'
                        : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                    }`}
                  >
                    {wishlist.includes(product.id) ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>

              {/* Supplier Info */}
              {product.supplier && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">معلومات المورد</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{product.supplier.name}</p>
                        {product.supplier.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-600">{product.supplier.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 