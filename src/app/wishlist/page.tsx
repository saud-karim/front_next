'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

interface WishlistItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: string;
    images: string[];
    stock: number;
  };
  date_added: string;
}

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { success } = useToast();
  const { t } = useLanguage();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    } else {
      fetchWishlist();
    }
  }, [isAuthenticated, router]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getWishlist();
      
      if (response.data && Array.isArray(response.data)) {
        setWishlistItems(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToCart = async (item: WishlistItem) => {
    const success_cart = await addToCart(item.product.id, 1);
    if (success_cart) {
      success('تمت الإضافة للسلة', `تم إضافة ${item.product.name} إلى سلة التسوق`);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await ApiService.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
      success('تمت الإزالة بنجاح', 'تم إزالة المنتج من قائمة الأمنيات');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddAllToCart = async () => {
    let successCount = 0;
    for (const item of wishlistItems) {
      const success_cart = await addToCart(item.product.id, 1);
      if (success_cart) successCount++;
    }
    
    if (successCount > 0) {
      success('تمت الإضافة للسلة', `تم إضافة ${successCount} منتج إلى سلة التسوق`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="text-8xl mb-8">🔐</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تسجيل الدخول مطلوب</h2>
          <p className="text-gray-600 mb-8">يجب تسجيل الدخول أولاً لعرض قائمة الأمنيات</p>
          <Link href="/auth" className="gradient-red text-white px-6 py-3 rounded-lg">
            تسجيل الدخول
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">جاري تحميل قائمة الأمنيات...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">❤️ قائمة الأمنيات</h1>
          <p className="text-xl text-gray-600">منتجاتك المحفوظة والمفضلة</p>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {wishlistItems.length > 0 ? (
            <>
              {/* Wishlist Actions */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  منتجاتك المحفوظة ({wishlistItems.length})
                </h2>
                <div className="flex gap-4">
                  <button 
                    onClick={handleAddAllToCart}
                    className="gradient-red text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    أضف الكل للسلة
                  </button>
                  <Link 
                    href="/products"
                    className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-red-500 hover:text-red-600 transition-all duration-300"
                  >
                    تصفح المزيد
                  </Link>
                </div>
              </div>

              {/* Wishlist Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {wishlistItems.map((item) => {
                  const productImage = Array.isArray(item.product.images) 
                    ? item.product.images[0] 
                    : typeof item.product.images === 'string' 
                      ? JSON.parse(item.product.images)[0] 
                      : '/images/placeholder.jpg';

                  return (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group hover:shadow-2xl transition-all duration-300">
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-50">
                        <img 
                          src={productImage || '/images/placeholder.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => handleRemoveFromWishlist(item.product.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                        >
                          ✕
                        </button>
                        {item.product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold">غير متوفر</span>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Category */}
                        {item.product.category && (
                          <div className="mb-2">
                            <Link 
                              href={`/categories/${item.product.category.id}`}
                              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full hover:bg-blue-200 transition-colors"
                            >
                              📂 {item.product.category.name}
                            </Link>
                          </div>
                        )}
                        
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.product.name}
                        </h3>

                        {/* Supplier */}
                        {item.product.supplier && (
                          <p className="text-xs text-gray-500 mb-2">
                            المورد: {item.product.supplier.name}
                            {item.product.supplier.rating && (
                              <span className="ml-1">⭐ {item.product.supplier.rating}</span>
                            )}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold text-red-600">
                            ${item.product.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            المخزون: {item.product.stock}
                          </span>
                        </div>

                        <div className="text-xs text-gray-500 mb-4">
                          أُضيف في: {formatDate(item.date_added)}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            disabled={item.product.stock === 0}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            🛒 إضافة للسلة
                          </button>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:border-red-500 hover:text-red-600 transition-colors"
                          >
                            👁️
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Empty Wishlist */
            <div className="text-center py-16">
              <div className="text-8xl mb-8">💔</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">قائمة الأمنيات فارغة</h2>
              <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى قائمة الأمنيات بعد</p>
              <Link 
                href="/products"
                className="gradient-red text-white px-8 py-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-block"
              >
                تصفح المنتجات
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 