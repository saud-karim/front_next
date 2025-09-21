'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { ApiService } from '../../services/api';
import Link from 'next/link';

interface Order {
  id: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'credit_card' | 'cash_on_delivery' | 'bank_transfer';
  subtotal: string;
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  total_amount: string;
  currency: string;
  items_count: number;
  shipping_address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
  };
  notes?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

interface OrderStats {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue: number;
  today_orders: number;
  this_month_orders: number;
}

export default function OrdersPage() {
  const { t, language, getLocalizedText } = useLanguage();
  const { success, error, warning } = useToast();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{[key: string]: string}>({});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  const fetchOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      
      const params: any = {
        page,
        per_page: 20,
        lang: language
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (paymentStatusFilter) params.payment_status = paymentStatusFilter;
      if (dateFilter) params.date_filter = dateFilter;
      
      const response = await ApiService.getAdminOrders(params);
      console.log('📦 Orders API Response:', response);
      
      if (response.success && response.data) {
        setOrders(response.data.data || response.data);
        setCurrentPage(response.data.meta?.current_page || 1);
        setTotalPages(response.data.meta?.last_page || 1);
      } else {
        console.warn('⚠️ Orders response format unexpected:', response);
        setOrders([]);
      }
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      error(t('common.error'), t('admin.orders.error.fetch'));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await ApiService.getOrdersStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      setActionLoading({ ...actionLoading, [selectedOrder.id]: 'updating' });
      
      const response = await ApiService.updateOrderStatus(selectedOrder.id, newStatus, statusNotes);
      
      if (response.success) {
        success(t('common.success'), t('admin.orders.success.status.update'));
        setShowStatusModal(false);
        setSelectedOrder(null);
        setNewStatus('');
        setStatusNotes('');
        fetchOrders(currentPage);
        fetchStats();
      }
    } catch (err) {
      console.error('❌ Error updating order status:', err);
      error(t('common.error'), t('admin.orders.error.status.update'));
    } finally {
      setActionLoading({ ...actionLoading, [selectedOrder.id]: '' });
    }
  };

  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  const openDetailsModal = async (order: Order) => {
    try {
      setActionLoading({ ...actionLoading, [order.id]: 'loading_details' });
      
      const response = await ApiService.getAdminOrderDetails(order.id);
      if (response.success && response.data) {
        setSelectedOrder(response.data.order || response.data);
        setShowDetails(true);
      }
    } catch (err) {
      console.error('❌ Error fetching order details:', err);
      error(t('common.error'), t('admin.orders.error.details'));
    } finally {
      setActionLoading({ ...actionLoading, [order.id]: '' });
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrders(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentStatusFilter('');
    setDateFilter('');
    setCurrentPage(1);
    fetchOrders(1);
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  if (loading && orders.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.orders.title')}</h1>
            <p className="text-gray-600 mt-2">{t('admin.orders.subtitle')}</p>
          </div>
          <button
            onClick={() => fetchOrders(currentPage)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
          >
            🔄 {t('admin.orders.refresh')}
          </button>
        </div>



        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-blue-600">{stats.total_orders}</div>
              <div className="text-sm text-gray-600">{t('admin.orders.stats.total')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-yellow-600">{stats.pending_orders}</div>
              <div className="text-sm text-gray-600">{t('admin.orders.stats.pending')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-purple-600">{stats.processing_orders}</div>
              <div className="text-sm text-gray-600">{t('admin.orders.stats.processing')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-green-600">{stats.delivered_orders}</div>
              <div className="text-sm text-gray-600">{t('admin.orders.stats.delivered')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-indigo-600">{stats.total_revenue.toLocaleString()} {t('common.currency')}</div>
              <div className="text-sm text-gray-600">{t('admin.orders.stats.revenue')}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.orders.search')}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('admin.orders.search.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.orders.status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">{t('admin.orders.all.statuses')}</option>
                <option value="pending">{t('admin.orders.status.pending')}</option>
                <option value="processing">{t('admin.orders.status.processing')}</option>
                <option value="shipped">{t('admin.orders.status.shipped')}</option>
                <option value="delivered">{t('admin.orders.status.delivered')}</option>
                <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.orders.payment.status')}
              </label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">{t('admin.orders.all.payment.statuses')}</option>
                <option value="paid">{t('admin.orders.payment.paid')}</option>
                <option value="pending">{t('admin.orders.payment.pending')}</option>
                <option value="failed">{t('admin.orders.payment.failed')}</option>
                <option value="refunded">{t('admin.orders.payment.refunded')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.orders.date.filter')}
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">{t('admin.orders.all.dates')}</option>
                <option value="today">{t('admin.orders.today')}</option>
                <option value="this_week">{t('admin.orders.this.week')}</option>
                <option value="this_month">{t('admin.orders.this.month')}</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔍 {t('admin.orders.search.btn')}
              </button>
              <button
                onClick={clearFilters}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔄
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('admin.orders.no.orders')}</h3>
            <p className="text-gray-600">{t('admin.orders.no.orders.desc')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.orders.order.id')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.orders.customer')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.orders.total')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.orders.status')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.orders.payment')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.orders.date')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.orders.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        <div className="text-xs text-gray-500">{order.items_count} {t('admin.orders.items')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                        <div className="text-xs text-gray-500">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{order.total_amount} {order.currency}</div>
                        <div className="text-xs text-gray-500">{t('admin.orders.payment.method')}: {order.payment_method}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {t(`admin.orders.status.${order.status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                          {t(`admin.orders.payment.${order.payment_status}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openDetailsModal(order)}
                          disabled={actionLoading[order.id] === 'loading_details'}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {actionLoading[order.id] === 'loading_details' ? '⏳' : '👁️'}
                        </button>
                        <button
                          onClick={() => openStatusModal(order)}
                          className="text-green-600 hover:text-green-900"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => currentPage > 1 && fetchOrders(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t('admin.orders.previous')}
                  </button>
                  <button
                    onClick={() => currentPage < totalPages && fetchOrders(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    {t('admin.orders.next')}
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {t('admin.orders.showing')} <span className="font-medium">{currentPage}</span> {t('admin.orders.of')} <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => currentPage > 1 && fetchOrders(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        ‹
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        {currentPage}
                      </span>
                      <button
                        onClick={() => currentPage < totalPages && fetchOrders(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        ›
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('admin.orders.details.title')} #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('admin.orders.customer.info')}</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">{t('admin.orders.name')}:</span> {selectedOrder.user.name}</p>
                    <p><span className="font-medium">{t('admin.orders.email')}:</span> {selectedOrder.user.email}</p>
                    {selectedOrder.user.phone && (
                      <p><span className="font-medium">{t('admin.orders.phone')}:</span> {selectedOrder.user.phone}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('admin.orders.order.info')}</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">{t('admin.orders.date')}:</span> {formatDate(selectedOrder.created_at)}</p>
                    <p>
                      <span className="font-medium">{t('admin.orders.status')}:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {t(`admin.orders.status.${selectedOrder.status}`)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">{t('admin.orders.payment')}:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                        {t(`admin.orders.payment.${selectedOrder.payment_status}`)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('admin.orders.shipping.address')}</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{selectedOrder.shipping_address.name}</p>
                  <p>{selectedOrder.shipping_address.street}</p>
                  <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}</p>
                  <p>{selectedOrder.shipping_address.country}</p>
                  {selectedOrder.shipping_address.phone && (
                    <p>{t('admin.orders.phone')}: {selectedOrder.shipping_address.phone}</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('admin.orders.order.summary')}</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>{t('admin.orders.subtotal')}:</span>
                    <span>{selectedOrder.subtotal} {selectedOrder.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('admin.orders.tax')}:</span>
                    <span>{selectedOrder.tax_amount} {selectedOrder.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('admin.orders.shipping')}:</span>
                    <span>{selectedOrder.shipping_amount} {selectedOrder.currency}</span>
                  </div>
                  {selectedOrder.discount_amount !== '0' && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('admin.orders.discount')}:</span>
                      <span>-{selectedOrder.discount_amount} {selectedOrder.currency}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>{t('admin.orders.total')}:</span>
                    <span>{selectedOrder.total_amount} {selectedOrder.currency}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('admin.orders.notes')}</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p>{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-4">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('admin.orders.close')}
              </button>
              <button
                onClick={() => {
                  setShowDetails(false);
                  openStatusModal(selectedOrder);
                }}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('admin.orders.update.status')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {t('admin.orders.update.status.title')}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.orders.current.status')}: {t(`admin.orders.status.${selectedOrder.status}`)}
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.orders.new.status')}
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="pending">{t('admin.orders.status.pending')}</option>
                  <option value="processing">{t('admin.orders.status.processing')}</option>
                  <option value="shipped">{t('admin.orders.status.shipped')}</option>
                  <option value="delivered">{t('admin.orders.status.delivered')}</option>
                  <option value="cancelled">{t('admin.orders.status.cancelled')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.orders.status.notes')}
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  placeholder={t('admin.orders.status.notes.placeholder')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-4">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                  setNewStatus('');
                  setStatusNotes('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('admin.orders.cancel')}
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!newStatus || actionLoading[selectedOrder.id] === 'updating'}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading[selectedOrder.id] === 'updating' 
                  ? t('admin.orders.updating') 
                  : t('admin.orders.update.status')
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 