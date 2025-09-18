'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Order } from '../../types/api';
import { ApiService } from '../../services/api';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, currentPage, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Note: This would need to be implemented in ApiService
      const response = await ApiService.getUserOrders({
        page: currentPage,
        per_page: 10,
        status: statusFilter || undefined
      });
      
      if (response.success && response.data) {
        setOrders(response.data);
        setTotalPages(response.meta?.last_page || 1);
      } else {
        // Fallback to mock data for demo
        const mockOrders: Order[] = [
          {
            id: 'ORD-001',
            status: 'delivered',
            subtotal: '250.00',
            total_amount: '275.00',
            currency: 'EGP',
            payment_status: 'paid',
            items_count: 3,
            estimated_delivery: '2025-01-20',
            created_at: '2025-01-15'
          },
          {
            id: 'ORD-002',
            status: 'processing',
            subtotal: '420.00',
            total_amount: '462.00',
            currency: 'EGP',
            payment_status: 'paid',
            items_count: 5,
            estimated_delivery: '2025-01-25',
            created_at: '2025-01-18'
          },
          {
            id: 'ORD-003',
            status: 'shipped',
            subtotal: '180.50',
            total_amount: '198.55',
            currency: 'EGP',
            payment_status: 'paid',
            items_count: 2,
            estimated_delivery: '2025-01-22',
            created_at: '2025-01-16'
          }
        ];
        setOrders(mockOrders);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: string) => {
    return `${parseFloat(amount).toFixed(2)} جنيه`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.login.required')}</h2>
            <p className="text-gray-600 mb-6">{t('auth.login.required.message')}</p>
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('auth.login.title')}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">الرئيسية</Link>
          <svg className="w-5 h-5 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <Link href="/account" className="text-gray-500 hover:text-gray-700">{t('account.title')}</Link>
          <svg className="w-5 h-5 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-900">{t('orders.title')}</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('account.profile.title')}
                </Link>
                
                <Link
                  href="/account/orders"
                  className="flex items-center px-3 py-2 text-red-600 bg-red-50 rounded-lg font-medium"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                  </svg>
                  {t('account.orders.title')}
                </Link>
                
                <Link
                  href="/wishlist"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t('wishlist.title')}
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('orders.title')}</h1>
                    <p className="text-gray-600 mt-1">{t('orders.subtitle')}</p>
                  </div>
                  
                  {/* Status Filter */}
                  <div className="flex items-center space-x-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">{t('orders.status')}</option>
                      <option value="pending">{t('orders.status.pending')}</option>
                      <option value="processing">{t('orders.status.processing')}</option>
                      <option value="shipped">{t('orders.status.shipped')}</option>
                      <option value="delivered">{t('orders.status.delivered')}</option>
                      <option value="cancelled">{t('orders.status.cancelled')}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('common.loading')}</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('orders.no.orders')}</h3>
                    <p className="text-gray-600 mb-6">{t('orders.no.orders.message')}</p>
                    <Link
                      href="/products"
                      className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                      {t('orders.browse.products')}
                    </Link>
                  </div>
                ) : (
                  <>
                    {/* Orders List */}
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <div>
                                <h3 className="font-semibold text-gray-900">{t('orders.order.number')}: {order.id}</h3>
                                <p className="text-gray-600 text-sm">{formatDate(order.created_at)}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {t(`orders.status.${order.status}`)}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatCurrency(order.total_amount)}</p>
                              <p className="text-gray-600 text-sm">{order.items_count} {t('orders.items')}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span>التسليم المتوقع: {formatDate(order.estimated_delivery)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <button className="text-red-600 hover:text-red-800 font-medium text-sm">
                                {t('orders.view.details')}
                              </button>
                              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                  {t('orders.track')}
                                </button>
                              )}
                              {order.status === 'delivered' && (
                                <button className="text-green-600 hover:text-green-800 font-medium text-sm">
                                  {t('orders.reorder')}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          السابق
                        </button>
                        
                        <span className="text-sm text-gray-700">
                          صفحة {currentPage} من {totalPages}
                        </span>
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          التالي
                          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 