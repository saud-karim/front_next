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
import { Product, Category } from '../../types/api';

export default function CategoryProductsPage() {
  const params = useParams();
  const categoryId = parseInt(params.id as string);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [wishlist, setWishlist] = useState<number[]>([]);
  
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { success, warning } = useToast();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchCategoryProducts();
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [categoryId, currentPage, isAuthenticated, language]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 جاري جلب منتجات الفئة:', categoryId);
      console.log('🔄 URL يتم استدعاؤه:', `/categories/${categoryId}`);
      
      const response = await ApiService.getCategoryProducts(categoryId, {
        page: currentPage,
        per_page: 12
      });
      
      console.log('📦 نوع الـ response:', typeof response);
      console.log('📦 استجابة API كاملة:', response);
      console.log('📦 response.category:', response?.category);
      console.log('📦 response.products:', response?.products);
      console.log('📦 response.products type:', Array.isArray(response?.products) ? 'array' : typeof response?.products);
      
      if (response) {
        // البيانات مباشرة في response، مش في response.data
        
        // Extract category info
        if (response.category) {
          console.log('📂 تم جلب بيانات الفئة:', response.category.name);
          setCategory(response.category);
        } else {
          console.log('❌ مفيش category في الـ response');
        }
        
        // Extract products - الآن مباشرة في products array
        if (response.products) {
          console.log('🔍 فحص المنتجات:', {
            exists: !!response.products,
            isArray: Array.isArray(response.products),
            length: response.products?.length,
            firstProduct: response.products?.[0]
          });
          
          if (Array.isArray(response.products)) {
            console.log('✅ تم جلب المنتجات بنجاح:', response.products.length);
            console.log('🛍️ أول منتج:', response.products[0]);
            setProducts(response.products);
            
            // For now, we'll handle pagination manually since API might not have meta
            const totalProducts = response.category?.products_count || response.products.length;
            const calculatedPages = Math.ceil(totalProducts / 12);
            setTotalPages(calculatedPages);
            
            console.log(`📄 عدد المنتجات: ${response.products.length}, إجمالي الصفحات: ${calculatedPages}`);
          } else {
            console.log('❌ المنتجات مش array:', typeof response.products);
            setProducts([]);
          }
        } else {
          console.log('❌ مفيش products في الـ response');
          setProducts([]);
        }
      } else {
        console.log('❌ مفيش response من الـ API');
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ خطأ في جلب منتجات الفئة:', error);
      console.error('❌ تفاصيل الخطأ:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setProducts([]);
      setTotalPages(1);
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
      setWishlist([]);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }
    
    const success_cart = await addToCart(product.id, 1);
    if (success_cart) {
      success(t('toast.cart.added'), `تم إضافة ${product.name} إلى سلة التسوق`);
    }
  };

  const handleWishlistToggle = async (productId: number) => {
    if (!isAuthenticated) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await ApiService.removeFromWishlist(productId);
        setWishlist(prev => prev.filter(id => id !== productId));
        success(t('toast.wishlist.removed'), t('toast.wishlist.removed.desc'));
      } else {
        await ApiService.addToWishlist(productId);
        setWishlist(prev => [...prev, productId]);
        success(t('toast.wishlist.added'), t('toast.wishlist.added.desc'));
      }
    } catch (error) {
      warning('حدث خطأ', 'حاول مرة أخرى');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">جاري تحميل منتجات الفئة...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Category Header */}
      <section className="pt-24 pb-12 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center space-x-2 text-sm text-gray-300 mb-4 rtl:space-x-reverse">
              <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <span>{'>'}</span>
              <Link href="/categories" className="hover:text-white transition-colors">الفئات</Link>
              <span>{'>'}</span>
              <span className="text-white">{category?.name || 'الفئة'}</span>
            </nav>

            {category && (
              <>
                <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
                  📂 فئة المنتجات
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                    {category.description}
                  </p>
                )}
                <div className="text-sm text-gray-400">
                  {products.length} منتج في هذه الفئة - صفحة {currentPage} من {totalPages}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {products.length > 0 ? (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="group card-hover bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    
                    {/* Product Image */}
                    <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-medium">
                        {Array.isArray(product.images) && product.images.length > 0 ? (
                          <img 
                            src={product.images[0] || '/images/placeholder.jpg'} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <>🛠️ {product.name.substring(0, 10)}...</>
                        )}
                      </div>
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={() => handleWishlistToggle(product.id)}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          wishlist.includes(product.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </button>
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
                            {product.rating || 5.0} ({product.reviews_count || 0})
                          </span>
                        </div>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Supplier */}
                      {product.supplier && (
                        <div className="mb-3">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-500">المورد:</span>
                            <span className="text-xs text-gray-700 font-medium">{product.supplier.name}</span>
                            {product.supplier.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-yellow-500 text-xs">⭐</span>
                                <span className="text-xs text-gray-600">{product.supplier.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                          متوفر: {product.stock}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 gradient-red text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md text-sm"
                        >
                          🛒 أضف للسلة
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    السابق
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (page > totalPages) return null;
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg ${
                          page === currentPage
                            ? 'gradient-red text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="text-8xl mb-8">📂</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">لا توجد منتجات في هذه الفئة</h2>
              <p className="text-gray-600 mb-8">ستتم إضافة منتجات جديدة لهذه الفئة قريباً</p>
              <div className="space-x-4 space-x-reverse">
                <Link 
                  href="/categories"
                  className="gradient-red text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 inline-block"
                >
                  تصفح الفئات الأخرى
                </Link>
                <Link 
                  href="/products"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:border-red-500 hover:text-red-500 transition-all duration-300 inline-block"
                >
                  تصفح جميع المنتجات
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
} 