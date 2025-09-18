'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import AdminLoginHelper from './components/AdminLoginHelper';
// import DevModeNotice from '../components/DevModeNotice'; // Disabled - System is production ready
import QuickAdminFix from '../components/QuickAdminFix';
import { AdminHelper } from '../utils/adminHelper';


interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  pending_orders: number;
  low_stock_products: number;
  new_customers_this_month: number;
  monthly_growth_percentage: number;
}

interface RecentActivity {
  id: string | number;
  type: 'order' | 'customer' | 'product' | 'review';
  message: string;
  timestamp: string;
  user_name?: string;
  product_id?: number;
  product_name?: string;
  rating?: number;
}

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // جلب البيانات من الـ Admin Dashboard APIs
  const fetchDashboardData = async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      setError(null);

    // Check if admin token exists before making API call
    const adminToken = localStorage.getItem('admin_token');
    
    if (!adminToken) {
      console.warn('No admin token found, using fallback dashboard data');
      setError(`🔐 ${t('admin.login.required.dashboard')}`);
      
      // Use fallback data
      setStats({
        total_products: 0,
        total_orders: 0,
        total_customers: 0,
        total_revenue: 0,
        pending_orders: 0,
        low_stock_products: 0,
        new_customers_this_month: 0,
        monthly_growth_percentage: 0
      });
      setRecentActivity([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

      console.log('📊 Loading Dashboard data from Admin APIs...');

    // محاولة استخدام Admin APIs مع fallback للمستخدم العادي
    try {
        console.log('🔍 Checking user admin permissions...');
        
        // جرب Admin APIs الأول
      const [statsResponse, activityResponse] = await Promise.all([
          ApiService.getDashboardStats().catch(err => ({ 
            success: false, 
            error: err.message,
            isRoleError: err.message?.includes('User does not have the right roles')
          })),
          ApiService.getRecentActivity({ limit: 5 }).catch(err => ({ 
            success: false, 
            error: err.message,
            isRoleError: err.message?.includes('User does not have the right roles')
          }))
      ]);

      console.log('📊 Dashboard Stats Response:', statsResponse);
      console.log('📋 Recent Activity Response:', activityResponse);

        // إذا كانت المشكلة في الصلاحيات، استخدم customer mode
        if (statsResponse.isRoleError || activityResponse.isRoleError) {
          console.log('🔄 Admin APIs blocked, switching to Customer mode...');
          
          // استخدم customer APIs بدلاً من admin APIs
          const customerStats = {
            total_products: t('admin.limited.access'),
            total_orders: t('admin.limited.access'),
            total_customers: t('admin.limited.access'),
            total_revenue: t('admin.limited.access'),
            pending_orders: t('admin.limited.access'),
            low_stock_products: t('admin.limited.access'),
            new_customers_this_month: t('admin.limited.access'),
            monthly_growth_percentage: 0
          };
          
          setStats(customerStats);
          setRecentActivity([
            {
              id: 1,
              type: 'info',
              message: t('admin.welcome.customer.dashboard'),
              timestamp: new Date().toISOString(),
                              user_name: t('admin.system.user')
            }
          ]);
          
          setError(`📊 ${t('admin.error.customer.dashboard')}`);
          
        } else if (statsResponse.success && statsResponse.data) {
          // Admin APIs تعمل بشكل طبيعي
        setStats(statsResponse.data);

      if (activityResponse.success && activityResponse.data) {
        setRecentActivity(activityResponse.data);
      } else {
            setRecentActivity([]);
          }
        } else {
          throw new Error('Failed to load dashboard data');
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('admin.error.loading.data') || 'Error loading dashboard data';
      console.error('❌', t('admin.error.loading.data'), ':', err);
      
        // Handle authentication errors gracefully
      if (errorMessage.includes('Unauthenticated')) {
          console.warn('Authentication failed for dashboard APIs');
          localStorage.removeItem('admin_token');
          setError(`🔐 ${t('admin.error.session.expired')}`);
          
          // Use fallback data when authentication fails
          setStats({
            total_products: 0,
            total_orders: 0,
            total_customers: 0,
            total_revenue: 0,
            pending_orders: 0,
            low_stock_products: 0,
            new_customers_this_month: 0,
            monthly_growth_percentage: 0
          });
          setRecentActivity([]);
        } else if (errorMessage.includes('User does not have the right roles')) {
          console.warn('🚫 Role permission error - User is not admin in backend');
          setError(`⚠️ ${t('admin.error.permissions')}`);
          
          // Use fallback data for role errors
          setStats({
            total_products: 0,
            total_orders: 0,
            total_customers: 0,
            total_revenue: 0,
            pending_orders: 0,
            low_stock_products: 0,
            new_customers_this_month: 0,
            monthly_growth_percentage: 0
          });
          setRecentActivity([]);
      } else {
        setError(errorMessage);
      }
      
      // في حالة الخطأ، استخدم بيانات افتراضية
      setStats({
        total_products: 0,
        total_orders: 0,
        total_customers: 0,
        total_revenue: 0,
        pending_orders: 0,
        low_stock_products: 0,
        new_customers_this_month: 0,
        monthly_growth_percentage: 0,
      });
      setRecentActivity([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Check admin token on component mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setAdminToken(token);
  }, []);

  // تحميل البيانات عند تحميل المكون
  useEffect(() => {
    fetchDashboardData();
    
    // تحديث تلقائي كل 5 دقائق
    const interval = setInterval(() => {
      fetchDashboardData(true); // مع مؤشر التحديث
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle successful admin login
  const handleAdminLoginSuccess = () => {
    const token = localStorage.getItem('admin_token');
    setAdminToken(token);
    setError(null);
    fetchDashboardData();
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('admin.greeting.morning') || 'صباح الخير';
    if (hour < 17) return t('admin.greeting.afternoon') || 'مساء الخير';
    return t('admin.greeting.evening') || 'مساء الخير';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return '🛒';
      case 'customer': return '👤';
      case 'product': return '📦';
      case 'review': return '⭐';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-100';
      case 'customer': return 'text-green-600 bg-green-100';
      case 'product': return 'text-yellow-600 bg-yellow-100';
      case 'review': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US');
  };

  // Helper function to safely format numbers or strings
  const formatValue = (value: string | number | undefined, decimals: number = 0): string => {
    if (typeof value === 'string') {
      return value; // Return strings like "محدود" as-is
    }
    if (typeof value === 'number') {
      return decimals > 0 ? value.toFixed(decimals) : value.toString();
    }
    return '0'; // Fallback for undefined/null
  };

  // Helper to safely calculate percentages for limited data
  const safeCalculation = (baseValue: string | number | undefined, calculation: (num: number) => number): string => {
    if (typeof baseValue === 'string') {
      return '--'; // Return placeholder for string values
    }
    if (typeof baseValue === 'number') {
      return calculation(baseValue).toString();
    }
    return '0';
  };

  // إنشاء بطاقات الإحصائيات
  const statsCards = stats ? [
    {
      title: t('admin.stats.total.products') || 'إجمالي المنتجات',
      value: formatValue(stats.total_products),
      icon: '📦',
      color: 'from-red-500 to-red-600',
      change: '+' + safeCalculation(stats.total_products, (num) => Math.ceil(num * 0.05)),
      changeType: 'positive' as const,
    },
    {
      title: t('admin.stats.total.orders') || 'إجمالي الطلبات',
      value: formatValue(stats.total_orders),
      icon: '🛒',
      color: 'from-blue-500 to-blue-600',
      change: '+' + safeCalculation(stats.total_orders, (num) => Math.ceil(num * 0.08)),
      changeType: 'positive' as const,
    },
    {
      title: t('admin.stats.total.customers') || 'إجمالي العملاء',
      value: formatValue(stats.total_customers),
      icon: '👥',
      color: 'from-green-500 to-green-600',
      change: '+' + formatValue(stats.new_customers_this_month),
      changeType: 'positive' as const,
    },
    {
      title: t('admin.stats.total.revenue') || 'إجمالي الإيرادات',
      value: formatValue(stats.total_revenue, 2),
      icon: '💰',
      color: 'from-purple-500 to-purple-600',
      change: '+' + formatValue(stats.monthly_growth_percentage, 1) + '%',
      changeType: 'positive' as const,
    },
    {
      title: t('admin.stats.pending.orders') || (language === 'ar' ? 'الطلبات المعلقة' : 'Pending Orders'),
      value: formatValue(stats.pending_orders),
      icon: '⏳',
      color: 'from-yellow-500 to-yellow-600',
              change: (typeof stats.pending_orders === 'number' && stats.pending_orders > 0) ? 
          (language === 'ar' ? 'يحتاج متابعة' : 'Needs Follow-up') : 
          (language === 'ar' ? 'مُحدث' : 'Up to Date'),
      changeType: (typeof stats.pending_orders === 'number' && stats.pending_orders > 5) ? 'negative' as const : 'neutral' as const,
    },
    {
      title: t('admin.alert.low.stock.title'),
      value: formatValue(stats.low_stock_products),
      icon: '📉',
      color: 'from-orange-500 to-orange-600',
      change: (typeof stats.low_stock_products === 'number' && stats.low_stock_products > 0) ? 'يحتاج تجديد' : 'مستقر',
      changeType: (typeof stats.low_stock_products === 'number' && stats.low_stock_products > 3) ? 'negative' as const : 'neutral' as const,
    },
  ] : [];

  // Note: Admin access control is handled by dashboard/layout.tsx
  // This page will only be reached by verified admin users

  // Show admin login helper if no admin token (but user is admin)
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                🔐 مطلوب تسجيل دخول الإدارة
              </h1>
              <p className="text-gray-600 mb-2">
    {t('admin.identity.confirm').replace('{name}', user.name)}
              </p>
              <p className="text-gray-500 text-sm">
                يرجى إدخال بيانات المدير للمتابعة
              </p>
            </div>
            
            <AdminLoginHelper onLoginSuccess={handleAdminLoginSuccess} />
          </div>
        </div>
      </div>
    );
  }

  if (loading && !refreshing) {
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
            <h1 className="text-3xl font-bold text-gray-900">
              {getCurrentGreeting()}, {user?.name || 'Admin'} 👋
            </h1>
            <p className="text-gray-600 mt-2">
              {t('common.overview')}
            </p>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md disabled:opacity-50"
          >
            {refreshing ? `🔄 ${t('common.updating')}` : `🔄 ${t('common.update')}`}
          </button>
        </div>

        {/* Development Mode Notice - Disabled (System is now production ready) */}
        {/* <DevModeNotice /> */}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 text-xl mr-3">⚠️</div>
              <div className="flex-1">
                <h3 className="text-red-800 font-medium">{language === 'ar' ? 'خطأ في التحميل' : 'Loading Error'}</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                
                {/* Auth Help Message */}
                {error.includes('تسجيل الدخول كمدير') && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-800 text-sm">
                      <p className="font-medium mb-1">📝 {language === 'ar' ? 'لتسجيل الدخول كمدير:' : 'To login as admin:'}</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>{language === 'ar' ? 'تأكد من وجود' : 'Make sure'} <code>admin_token</code> {language === 'ar' ? 'في localStorage' : 'exists in localStorage'}</li>
                <li>{language === 'ar' ? 'أو قم بإضافة' : 'Or add'} <code>role: 'admin'</code> {language === 'ar' ? 'لحسابك' : 'to your account'}</li>
                                                  <li>{language === 'ar' ? 'استخدم' : 'Use'} <code>/admin/login</code> API {language === 'ar' ? 'للحصول على admin token' : 'to get admin token'}</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin Login Helper */}
        {error && error.includes('تسجيل الدخول كمدير') && (
          <div className="mb-6">
            <AdminLoginHelper onLoginSuccess={() => fetchDashboardData()} />
          </div>
        )}

        {/* Quick Admin Fix */}
        {error && error.includes('تسجيل الدخول كمدير') && (
          <QuickAdminFix />
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center text-white text-xl`}>
                  {card.icon}
                </div>
                <div className={`text-sm px-2 py-1 rounded-full ${
                  card.changeType === 'positive' ? 'bg-green-100 text-green-800' :
                  card.changeType === 'negative' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {card.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-gray-600 text-sm">{card.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {t('admin.recent.activity') || 'الأنشطة الحديثة'}
            </h2>
            
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {t('admin.no.recent.activity') || 'لا توجد أنشطة حديثة'}
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      {activity.user_name && (
                        <p className="text-xs text-gray-600">{t('admin.by.user') || 'بواسطة:'} {activity.user_name}</p>
                      )}
                      <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
                          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-5 shadow-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {t('admin.quick.actions') || 'إجراءات سريعة'}
            </h2>
            
            <div className="space-y-2">
              {[
                { label: t('admin.actions.add.product') || 'إضافة منتج', icon: '➕📦', href: '/dashboard/products/new' },
                { label: t('admin.actions.view.orders') || 'عرض الطلبات', icon: '📋🛒', href: '/dashboard/orders' },
                { label: t('admin.actions.manage.categories') || 'إدارة الفئات', icon: '📂⚙️', href: '/dashboard/categories' },
                { label: t('admin.actions.customer.support') || 'دعم العملاء', icon: '🎧💬', href: '/dashboard/customers' },
              ].map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  onClick={() => window.location.href = action.href}
                >
                  <span className="text-base">{action.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {action.label}
                  </span>
                  <div className="ml-auto text-gray-400 group-hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
                            

      </div>
    </div>
  );
} 