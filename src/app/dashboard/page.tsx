'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../context/UserContext';

export default function DashboardPage() {
  const { user, isLoggedIn, logout, updateProfile } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    address: '',
    company: ''
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/auth');
      return;
    }
    
    if (user) {
      setEditData({
        name: user.name,
        phone: user.phone || '',
        address: user.address || '',
        company: user.company || ''
      });
    }
  }, [isLoggedIn, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSaveProfile = () => {
    if (user) {
      updateProfile(editData);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'processing': return 'قيد المعالجة';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التوصيل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: '📊' },
    { id: 'profile', name: 'الملف الشخصي', icon: '👤' },
    { id: 'orders', name: 'الطلبات', icon: '📦' },
    { id: 'wishlist', name: 'قائمة الأمنيات', icon: '❤️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                مرحباً، <span className="text-gradient">{user.name}</span>
              </h1>
              <p className="text-xl text-gray-300">
                إدارة حسابك وطلباتك وقائمة أمنياتك
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    عضو منذ {formatDate(user.joinDate)}
                  </p>
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-right transition-colors ${
                        activeTab === tab.id
                          ? 'gradient-red text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="ml-3 text-lg">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">نظرة عامة</h2>
                  
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">إجمالي الطلبات</p>
                          <p className="text-3xl font-bold">{user.orders.length}</p>
                        </div>
                        <div className="text-4xl">📦</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">قائمة الأمنيات</p>
                          <p className="text-3xl font-bold">{user.wishlist.length}</p>
                        </div>
                        <div className="text-4xl">❤️</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">إجمالي الإنفاق</p>
                          <p className="text-3xl font-bold">
                            ${user.orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-4xl">💰</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">آخر الطلبات</h3>
                    {user.orders.slice(0, 3).length > 0 ? (
                      <div className="space-y-4">
                        {user.orders.slice(0, 3).map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-semibold">طلب #{order.id}</p>
                              <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                            </div>
                            <div className="text-left">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                              <p className="text-lg font-bold mt-1">${order.total}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">لا توجد طلبات بعد</p>
                    )}
                  </div>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">الملف الشخصي</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="gradient-red text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      {isEditing ? 'إلغاء' : 'تعديل'}
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    {isEditing ? (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                          <input
                            type="text"
                            value={editData.address}
                            onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">الشركة</label>
                          <input
                            type="text"
                            value={editData.company}
                            onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>
                        
                        <button
                          onClick={handleSaveProfile}
                          className="gradient-red text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300"
                        >
                          حفظ التغييرات
                        </button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-500">الاسم</label>
                          <p className="text-lg text-gray-900">{user.name}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500">البريد الإلكتروني</label>
                          <p className="text-lg text-gray-900">{user.email}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500">رقم الهاتف</label>
                          <p className="text-lg text-gray-900">{user.phone || 'غير محدد'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-500">الشركة</label>
                          <p className="text-lg text-gray-900">{user.company || 'غير محدد'}</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-500">العنوان</label>
                          <p className="text-lg text-gray-900">{user.address || 'غير محدد'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">سجل الطلبات</h2>
                  
                  {user.orders.length > 0 ? (
                    <div className="space-y-6">
                      {user.orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">طلب #{order.id}</h3>
                              <p className="text-gray-600">{formatDate(order.date)}</p>
                            </div>
                            <div className="text-left">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                              <p className="text-xl font-bold mt-1">${order.total}</p>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">المنتجات:</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="text-2xl ml-3">{item.image}</span>
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <p className="font-semibold">${item.price * item.quantity}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {order.trackingNumber && (
                            <div className="border-t pt-4 mt-4">
                              <p className="text-sm text-gray-600">
                                رقم التتبع: <span className="font-mono text-blue-600">{order.trackingNumber}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات بعد</h3>
                      <p className="text-gray-600 mb-6">ابدأ التسوق لإنشاء طلبك الأول</p>
                      <Link 
                        href="/products"
                        className="gradient-red text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 inline-block"
                      >
                        تسوق الآن
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900">قائمة الأمنيات</h2>
                  
                  {user.wishlist.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.wishlist.map((item) => (
                        <div key={item.id} className="card-hover bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 text-center">
                            <div className="text-4xl mb-2">{item.image}</div>
                            <div className={`inline-block px-2 py-1 ${item.badgeColor} text-white text-xs font-bold rounded-full`}>
                              {item.badge}
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="text-lg font-bold text-gray-900">{item.price}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
                              </div>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                  </svg>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Link 
                                href={`/products/${item.id}`}
                                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                              >
                                عرض
                              </Link>
                              <button className="flex-1 gradient-red text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
                                أضف للسلة
                              </button>
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              أضيف في {formatDate(item.dateAdded)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">قائمة الأمنيات فارغة</h3>
                      <p className="text-gray-600 mb-6">أضف منتجات لقائمة أمنياتك لحفظها للمستقبل</p>
                      <Link 
                        href="/products"
                        className="gradient-red text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 inline-block"
                      >
                        تصفح المنتجات
                      </Link>
                    </div>
                  )}
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