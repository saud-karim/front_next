'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export default function WishlistPage() {
  const { user, isLoggedIn, removeFromWishlist } = useUser();
  const { addToCart } = useCart();
  const { success } = useToast();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth');
    }
  }, [isLoggedIn, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: parseInt(item.price.slice(1).replace(',', '')),
      originalPrice: parseInt(item.originalPrice.slice(1).replace(',', '')),
      image: item.image,
      category: item.category,
      features: []
    });
    success('تمت الإضافة للسلة', `تم إضافة ${item.name} إلى سلة التسوق`);
  };

  const handleRemoveFromWishlist = (id: number) => {
    removeFromWishlist(id);
    success('تمت الإزالة بنجاح', 'تم إزالة المنتج من قائمة الأمنيات');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
            ❤️ قائمة الأمنيات
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            منتجاتك <span className="text-gradient">المفضلة</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {user?.wishlist.length 
              ? `لديك ${user.wishlist.length} منتج محفوظ في قائمة أمنياتك`
              : 'قائمة أمنياتك فارغة، ابدأ بحفظ المنتجات المفضلة لديك'
            }
          </p>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {user?.wishlist && user.wishlist.length > 0 ? (
            <>
              {/* Wishlist Actions */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  منتجاتك المحفوظة ({user.wishlist.length})
                </h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      user.wishlist.forEach(item => handleAddToCart(item));
                    }}
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
                {user.wishlist.map((item) => (
                  <div key={item.id} className="card-hover bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    
                    {/* Product Image */}
                    <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                      <div className="text-5xl mb-3">{item.image}</div>
                      <div className={`inline-block px-3 py-1 ${item.badgeColor} text-white text-xs font-bold rounded-full`}>
                        {item.badge}
                      </div>
                      
                      {/* Remove from Wishlist */}
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 transition-colors"
                        title="إزالة من قائمة الأمنيات"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-6">
                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                      
                      {/* Category */}
                      <p className="text-sm text-gray-500 mb-3">{item.category}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({item.reviews})</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-xl font-bold text-gray-900">{item.price}</span>
                          <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
                        </div>
                        <div className="text-sm text-green-600 font-semibold">
                          وفر {Math.round((1 - parseInt(item.price.slice(1).replace(',', '')) / parseInt(item.originalPrice.slice(1).replace(',', ''))) * 100)}%
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="gradient-red text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                        >
                          أضف للسلة
                        </button>
                        <Link 
                          href={`/products/${item.id}`}
                          className="border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:border-red-500 hover:text-red-600 transition-all duration-300 text-center"
                        >
                          عرض التفاصيل
                        </Link>
                      </div>
                      
                      {/* Date Added */}
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        أضيف في {formatDate(item.dateAdded)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="text-center mt-12">
                <Link 
                  href="/products"
                  className="gradient-red text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-block"
                >
                  تصفح المزيد من المنتجات
                </Link>
              </div>
            </>
          ) : (
            /* Empty Wishlist */
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-8xl mb-6">❤️</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">قائمة الأمنيات فارغة</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  ابدأ بإضافة منتجاتك المفضلة لقائمة الأمنيات لحفظها والعودة إليها لاحقاً
                </p>
                
                <div className="space-y-4">
                  <Link 
                    href="/products"
                    className="gradient-red text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 inline-block"
                  >
                    تصفح المنتجات
                  </Link>
                  
                  <div className="flex items-center justify-center gap-6 mt-8">
                    <Link href="/categories" className="text-red-600 hover:text-red-700 font-semibold">
                      الفئات
                    </Link>
                    <span className="w-px h-4 bg-gray-300"></span>
                    <Link href="/about" className="text-red-600 hover:text-red-700 font-semibold">
                      عن الشركة
                    </Link>
                    <span className="w-px h-4 bg-gray-300"></span>
                    <Link href="/contact" className="text-red-600 hover:text-red-700 font-semibold">
                      اتصل بنا
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">💡 نصائح لاستخدام قائمة الأمنيات</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl mb-4">❤️</div>
              <h4 className="font-bold text-gray-900 mb-2">احفظ المفضلات</h4>
              <p className="text-gray-600 text-sm">اضغط على القلب لحفظ المنتجات التي تعجبك</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl mb-4">🔔</div>
              <h4 className="font-bold text-gray-900 mb-2">تنبيهات الأسعار</h4>
              <p className="text-gray-600 text-sm">احصل على إشعارات عند انخفاض أسعار منتجاتك المفضلة</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-3xl mb-4">🛒</div>
              <h4 className="font-bold text-gray-900 mb-2">شراء سريع</h4>
              <p className="text-gray-600 text-sm">أضف جميع منتجاتك المفضلة للسلة بضغطة واحدة</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 