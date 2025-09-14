'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { ApiService } from '../../services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface AdminProduct {
  id: number;
  name: string;
  description?: string;
  price: string;
  original_price?: string;
  rating?: string;
  reviews_count: number;
  stock: number;
  status: 'active' | 'inactive';
  featured: boolean;
  images?: string[];
  category: {
    id: number;
    name: string;
  };
  supplier: {
    id: number;
    name: string;
    rating?: string;
  };
  brand?: {
    id: number;
    name: string;
  };
  is_in_stock: boolean;
  has_low_stock: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface ProductsParams {
  page: string;
  per_page: string;
  lang: string;
  sort: string;
  order: string;
  search?: string;
  category?: string;
  status?: string;
}

export default function ProductsPage() {
  const { t, language, getLocalizedText } = useLanguage();
  const router = useRouter();
  const { success, error, warning } = useToast();
  
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{[key: number]: string}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [perPage] = useState(12);

  // ✅ دالة مساعدة لتصحيح مسارات الصور
  const getCorrectImagePath = (imagePath: string): string => {
    if (!imagePath) return '';
    
    // إذا كان مسار كامل بالفعل، ارجعه كما هو
    if (imagePath.startsWith('/storage/') || imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // إذا كان اسم ملف فقط، أضف المسار الكامل
    return `/storage/products/${imagePath}`;
  };

  const getFullImageUrl = (imagePath: string): string => {
    const correctedPath = getCorrectImagePath(imagePath);
    return `http://localhost:8000${correctedPath}`;
  };

  // ✅ Data URL للـ fallback النهائي (صغيرة جداً)
  const getDataUrlPlaceholder = (): string => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiM5Q0EzQUYiPjAx8J+Tpo8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiPtmE2Kcg2KrZiNis2K8g2LXZiNix2KktL3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0EzQUYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
  };

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Product statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0,
    low_stock: 0,
    out_of_stock: 0,
  });

  // Memoized filter summary for better performance
  const filterSummary = useMemo(() => {
    let summary = `${products.length} ${t('admin.products.count')}`;
    if (searchTerm) summary += ` (${t('admin.products.search')}: "${searchTerm}")`;
    if (selectedCategory) {
      const category = categories.find(c => c.id.toString() === selectedCategory);
      if (category) summary += ` (${t('admin.products.category')}: ${getLocalizedText(category, 'name')})`;
    }
    if (selectedStatus) summary += ` (${t('admin.products.status')}: ${selectedStatus === 'active' ? t('admin.products.active.status') : t('admin.products.inactive.status')})`;
    return summary;
  }, [products.length, searchTerm, selectedCategory, selectedStatus, categories, getLocalizedText, t]);

  // Fetch data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: ProductsParams = {
        page: currentPage.toString(),
        per_page: perPage.toString(),
        lang: language,
        sort: sortBy,
        order: sortOrder,
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;

      // جرب Admin Products API مع fallback للـ Customer API
      try {
      const response = await ApiService.getAdminProducts(params);
      
      if (response.success && response.data) {
        setProducts(response.data);
        setTotalProducts(response.meta?.total || 0);
        }
      } catch (adminErr) {
        if (adminErr.message?.includes('User does not have the right roles')) {
          console.log('🔄 Admin Products blocked, switching to regular Products API...');
          
          // استخدم regular products API للعملاء
          const customerResponse = await ApiService.getProducts(params);
          
          if (customerResponse.success && customerResponse.data) {
            setProducts(customerResponse.data);
            setTotalProducts(customerResponse.meta?.total || 0);
            
            // اعرض رسالة للمستخدم
            error('ℹ️ عرض محدود', 'يتم عرض المنتجات بصلاحيات العملاء. للوصول الكامل، تحتاج صلاحيات إدارية.');
          } else {
            throw customerResponse.error || new Error('Failed to load products');
          }
        } else {
          throw adminErr;
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      error(t('common.error'), t('admin.products.error.fetch'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      console.log('🏷️ Categories API Response:', response);
      
      // البيانات في response.data مباشرة
      if (response.data && Array.isArray(response.data)) {
        console.log('🏷️ Categories fetched:', response.data.length, 'items');
        setCategories(response.data);
      } else {
        console.warn('⚠️ Categories response format unexpected:', response);
        setCategories([]);
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      error(t('common.error'), t('admin.products.error.categories'));
      setCategories([]);
    }
  };

  const fetchStats = async () => {
    try {
      // جرب Admin Stats API مع fallback
    try {
      const response = await ApiService.getAdminProductsStats();
      if (response.success && response.data) {
        setStats(response.data);
          return;
      }
      } catch (adminStatsErr) {
        if (adminStatsErr.message?.includes('User does not have the right roles')) {
          console.log('🔄 Admin Product Stats blocked, using calculated stats...');
        } else {
          throw adminStatsErr;
        }
      }
      
      // Fallback: حساب الإحصائيات من المنتجات المتاحة
      if (products.length > 0) {
        setStats({
          total: products.length,
          active: products.filter(p => p.status === 'active').length,
          inactive: products.filter(p => p.status === 'inactive').length,
          featured: products.filter(p => p.featured).length,
          low_stock: products.filter(p => p.has_low_stock).length,
          out_of_stock: products.filter(p => !p.is_in_stock).length,
        });
      }
    } catch (err) {
      console.error('❌ خطأ في جلب إحصائيات المنتجات:', err);
      setError('فشل في تحميل إحصائيات المنتجات');
    }
  };

  // Toggle product status with optimistic update
  const toggleProductStatus = async (productId: number, currentStatus: string) => {
    // Optimistic update
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: newStatus as 'active' | 'inactive' }
        : product
    ));

    try {
      const response = await ApiService.toggleProductStatus(productId);
      
      if (response.success) {
        success(t('common.success'), response.message || t('admin.products.success.status'));
        fetchStats(); // Update stats
      } else {
        // Revert on failure
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, status: currentStatus as 'active' | 'inactive' }
            : product
        ));
        error(t('common.error'), t('admin.products.error.status'));
      }
    } catch (err) {
      console.error('Error updating product status:', err);
      // Revert on error
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, status: currentStatus as 'active' | 'inactive' }
          : product
      ));
      error(t('common.error'), t('admin.products.error.status'));
    }
  };

  // Toggle featured product with optimistic update
  const toggleFeatured = async (productId: number, currentFeatured: boolean) => {
    // Optimistic update
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, featured: !currentFeatured }
        : product
    ));

    try {
      const response = await ApiService.toggleProductFeatured(productId);
      
      if (response.success) {
        success(t('common.success'), response.message || t('admin.products.success.featured'));
        fetchStats(); // Update stats
      } else {
        // Revert on failure
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, featured: currentFeatured }
            : product
        ));
        error(t('common.error'), t('admin.products.error.featured'));
      }
    } catch (err) {
      console.error('Error updating featured status:', err);
      // Revert on error
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, featured: currentFeatured }
          : product
      ));
      error(t('common.error'), t('admin.products.error.featured'));
    }
  };

  // Delete product with enhanced confirmation
  const deleteProduct = async (productId: number) => {
    if (!confirm(t('admin.products.delete') + '? ' + t('admin.products.delete.confirm'))) return;
    
    try {
      const response = await ApiService.deleteProduct(productId);
      
      if (response.success) {
        // Remove product from local state
        setProducts(prev => prev.filter(product => product.id !== productId));
        success(t('common.success'), t('admin.products.success.delete'));
        fetchStats(); // Update stats
      } else {
        error(t('common.error'), t('admin.products.error.delete'));
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      error(t('common.error'), t('admin.products.error.delete'));
    }
  };

  // Enhanced action functions with loading states
  const handleToggleStatus = async (productId: number, currentStatus: string) => {
    if (actionLoading[productId]) return; // Prevent duplicate actions
    
    setActionLoading(prev => ({ ...prev, [productId]: 'status' }));
    await toggleProductStatus(productId, currentStatus);
    setActionLoading(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleToggleFeatured = async (productId: number, currentFeatured: boolean) => {
    if (actionLoading[productId]) return;
    
    setActionLoading(prev => ({ ...prev, [productId]: 'featured' }));
    await toggleFeatured(productId, currentFeatured);
    setActionLoading(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleDeleteProduct = async (productId: number) => {
    if (actionLoading[productId]) return;
    
    setActionLoading(prev => ({ ...prev, [productId]: 'delete' }));
    await deleteProduct(productId);
    setActionLoading(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // Effects
  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortBy, sortOrder, selectedCategory, selectedStatus, debouncedSearchTerm]);

  const totalPages = Math.ceil(totalProducts / perPage);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.products.title')}</h1>
            <p className="text-gray-600 mt-1">{filterSummary}</p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            <span>➕</span>
            {t('admin.products.add')}
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">{t('admin.products.stats.total')}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">{t('admin.products.stats.active')}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <div className="text-sm text-gray-600">{t('admin.products.stats.inactive')}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
            <div className="text-sm text-gray-600">{t('admin.products.stats.featured')}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.low_stock}</div>
            <div className="text-sm text-gray-600">{t('admin.products.stats.low.stock')}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.out_of_stock}</div>
            <div className="text-sm text-gray-600">{t('admin.products.stats.out.of.stock')}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.products.search')}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('admin.products.search.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.products.category')} ({categories.length} {t('admin.products.categories.available')})
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  console.log('🏷️ Category selected:', e.target.value);
                  setSelectedCategory(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">{t('admin.products.all.categories')}</option>
                {categories.map((category) => {
                  console.log('🏷️ Rendering category:', category);
                  return (
                    <option key={category.id} value={category.id}>
                      {getLocalizedText(category, 'name')}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.products.status')}
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">{t('admin.products.all.statuses')}</option>
                <option value="active">{t('admin.products.active.status')}</option>
                <option value="inactive">{t('admin.products.inactive.status')}</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.products.sort')}
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-');
                  setSortBy(sort);
                  setSortOrder(order);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="created_at-desc">{t('admin.products.sort.newest')}</option>
                <option value="created_at-asc">{t('admin.products.sort.oldest')}</option>
                <option value="name-asc">{t('admin.products.sort.name.asc')}</option>
                <option value="name-desc">{t('admin.products.sort.name.desc')}</option>
                <option value="price-asc">{t('admin.products.sort.price.asc')}</option>
                <option value="price-desc">{t('admin.products.sort.price.desc')}</option>
                <option value="stock-asc">{t('admin.products.sort.stock.asc')}</option>
                <option value="stock-desc">{t('admin.products.sort.stock.desc')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('admin.products.no.products')}</h3>
            <p className="text-gray-600 mb-6">{t('admin.products.no.products.desc')}</p>
            <Link
              href="/dashboard/products/new"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <span>➕</span>
              {t('admin.products.add.first')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Product Image */}
                <div className="relative h-48 bg-gray-100">
                  {(() => {
                    // ✅ معالجة الصور - قد تكون string أو array
                    let imagesList: string[] = [];
                    
                    try {
                      if (typeof product.images === 'string') {
                        // إذا كانت string، حاول parse كـ JSON
                        imagesList = JSON.parse(product.images);
                      } else if (Array.isArray(product.images)) {
                        // إذا كانت array بالفعل
                        imagesList = product.images;
                      }
                      
                      // تنظيف القائمة من القيم الفارغة
                      imagesList = imagesList.filter(img => img && typeof img === 'string' && img.trim());
                    } catch (error) {
                      console.error('❌ Dashboard: Error parsing images for product', product.id, ':', error);
                      console.error('🔍 Raw images data:', product.images);
                      imagesList = [];
                    }
                    
                    console.log(`🔍 Product #${product.id} processed images:`, imagesList);
                    
                                                              return imagesList.length > 0 ? (
                       <img 
                         src={(() => {
                           const fullUrl = getFullImageUrl(imagesList[0]);
                           console.log(`🔗 Building image URL: "${imagesList[0]}" → "${fullUrl}"`);
                           return fullUrl;
                         })()}
                         alt={getLocalizedText(product, 'name')}
                         className="w-full h-full object-cover transition-opacity duration-300"
                         loading="lazy"
                                                                          onError={(e) => {
                           const originalPath = imagesList[0];
                           const correctedPath = getCorrectImagePath(originalPath);
                           const fullUrl = getFullImageUrl(originalPath);
                           
                           console.error('❌ Dashboard: Failed to load product image:', originalPath);
                           console.error('🔗 Corrected path:', correctedPath);
                           console.error('🔗 Full URL tried:', fullUrl);
                           console.error('🔍 Original images data:', product.images);
                           
                           // محاولة استخدام placeholder.svg أولاً
                           if (e.currentTarget.src !== `${window.location.origin}/placeholder.svg`) {
                             console.log('🔄 Trying placeholder.svg fallback...');
                             e.currentTarget.src = '/placeholder.svg';
                             return;
                           }
                           
                           // إذا فشل placeholder.svg كمان، استخدم HTML fallback
                           console.warn('⚠️ Placeholder.svg also failed, using HTML fallback');
                           const parent = e.currentTarget.parentElement;
                           if (parent) {
                             parent.innerHTML = `
                               <div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                                 <div class="text-center p-4">
                                   <div class="text-5xl mb-2">📦</div>
                                   <div class="text-sm font-medium text-gray-600">صورة غير متاحة</div>
                                   <div class="text-xs text-gray-500 mt-1">Image not available</div>
                                 </div>
                               </div>
                             `;
                           }
                         }}
                                                 onLoad={(e) => {
                           const originalPath = imagesList[0];
                           const loadedSrc = e.currentTarget.src;
                           
                           if (loadedSrc.includes('placeholder.svg')) {
                             console.log('📦 Dashboard: Placeholder image loaded (product image failed)');
                             console.log(`🔗 Original failed path: "${originalPath}"`);
                           } else {
                             const finalUrl = getFullImageUrl(originalPath);
                             console.log('✅ Dashboard: Product image loaded successfully!');
                             console.log(`🔗 Original: "${originalPath}" → Final: "${finalUrl}"`);
                           }
                         }}
                      />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <span className="text-4xl block">📦</span>
                            <span className="text-xs">لا توجد صورة</span>
                          </div>
                        </div>
                      );
                    })()}
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        ⭐ {t('admin.products.featured.badge')}
                      </span>
                    )}
                    {!product.is_in_stock && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {t('admin.products.out.of.stock.badge')}
                      </span>
                    )}
                    {product.has_low_stock && product.is_in_stock && (
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {t('admin.products.low.stock.badge')}
                      </span>
                    )}
                  </div>

                  {/* Images Count Badge */}
                  {(() => {
                    let imagesCount = 0;
                    try {
                      if (typeof product.images === 'string') {
                        const parsed = JSON.parse(product.images);
                        imagesCount = Array.isArray(parsed) ? parsed.length : 0;
                      } else if (Array.isArray(product.images)) {
                        imagesCount = product.images.length;
                      }
                    } catch (error) {
                      imagesCount = 0;
                    }
                    
                    return imagesCount > 1 ? (
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-blue-600/80 text-white px-2 py-1 rounded text-xs font-medium">
                          📸 {imagesCount} صور
                        </span>
                      </div>
                    ) : null;
                  })()}

                  {/* Product Status */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'active' ? t('admin.products.active.status') : t('admin.products.inactive.status')}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg line-clamp-2 flex-1">
                      {getLocalizedText(product, 'name')}
                    </h3>
                    
                    {/* Debug Images Button */}
                    {(() => {
                      let parsedImages: string[] = [];
                      try {
                        if (typeof product.images === 'string') {
                          parsedImages = JSON.parse(product.images);
                        } else if (Array.isArray(product.images)) {
                          parsedImages = product.images;
                        }
                      } catch (error) {
                        parsedImages = [];
                      }
                      
                      return parsedImages.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => {
                            console.log(`🔍 Product #${product.id} Raw Images:`, product.images);
                            console.log(`🔍 Product #${product.id} Parsed Images:`, parsedImages);
                            if (parsedImages.length > 0) {
                              const originalPath = parsedImages[0];
                              const correctedPath = getCorrectImagePath(originalPath);
                              const fullUrl = getFullImageUrl(originalPath);
                              console.log(`🔗 Original path: "${originalPath}"`);
                              console.log(`🔗 Corrected path: "${correctedPath}"`);
                              console.log(`🔗 Full URL: ${fullUrl}`);
                            }
                          }}
                          className="ml-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded"
                          title="Debug صور المنتج"
                        >
                          🔍
                        </button>
                      ) : null;
                    })()}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {getLocalizedText(product, 'description')}
                  </p>

                  {/* Product Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('admin.products.price')}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">{product.price} {t('common.currency')}</span>
                        {product.original_price && (
                          <span className="text-gray-400 line-through text-sm">
                            {product.original_price} {t('common.currency')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('admin.products.stock')}:</span>
                      <span className="font-medium">{product.stock}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('admin.products.rating')}:</span>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-gray-500 text-sm">({product.reviews_count})</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('admin.products.category')}:</span>
                      <span className="text-sm font-medium">{getLocalizedText(product.category, 'name')}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => router.push(`/dashboard/products/${product.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      ✏️ {t('admin.products.edit')}
                    </button>
                    
                    {/* Toggle Status */}
                    <button
                      onClick={() => handleToggleStatus(product.id, product.status)}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                        product.status === 'active'
                          ? 'bg-red-100 hover:bg-red-200 text-red-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                      disabled={actionLoading[product.id] === 'status'}
                    >
                      {actionLoading[product.id] === 'status' ? t('admin.products.loading') : product.status === 'active' ? `⏸️ ${t('admin.products.deactivate')}` : `▶️ ${t('admin.products.activate')}`}
                    </button>
                    
                    {/* Toggle Featured */}
                    <button
                      onClick={() => handleToggleFeatured(product.id, product.featured)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                        product.featured
                          ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      disabled={actionLoading[product.id] === 'featured'}
                    >
                      {actionLoading[product.id] === 'featured' ? t('admin.products.loading') : product.featured ? '⭐' : '☆'}
                    </button>
                    
                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition-colors"
                      disabled={actionLoading[product.id] === 'delete'}
                    >
                      {actionLoading[product.id] === 'delete' ? t('admin.products.deleting') : '🗑️'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {t('admin.products.pagination.previous')}
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 border rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-red-600 text-white border-red-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              {t('admin.products.pagination.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 