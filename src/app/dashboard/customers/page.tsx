'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { ApiService } from '../../services/api';
import Link from 'next/link';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'banned';
  orders_count: number;
  total_spent: number;
  currency?: string;
  favorite_payment_method?: string;
  addresses_count?: number;
  is_verified?: boolean;
  has_recent_activity?: boolean;
  registration_source?: string;
  last_activity?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

interface CustomerStats {
  total_customers: number;
  new_customers_this_month: number;
  active_customers: number;
  inactive_customers: number;
  banned_customers?: number;
  average_orders_per_customer: number;
  top_spending_customers: number;
  customers_with_zero_orders: number;
  growth_percentage: number;
  retention_rate: number;
}

export default function CustomersPage() {
  const { t, language, getLocalizedText } = useLanguage();
  const { success, error, warning } = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{[key: number]: string}>({});
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const fetchCustomers = async (page: number = 1) => {
    try {
      setLoading(true);
      
      const params: Record<string, string | number> = {
        page,
        per_page: 20,
        lang: language
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const response = await ApiService.getAdminCustomers(params);
      
      if (response.success && response.data) {
        const customersData = response.data.data || response.data;
        const metaData = response.data.meta || response.meta; // Fix: meta is at root level
        
        // Fix pagination calculation
        let totalPages = 1;
        if (metaData) {
          // Use API provided last_page
          totalPages = metaData.last_page || 1;
          
          // Fallback: Calculate manually if needed
          if (totalPages === 1 && metaData.total && metaData.per_page) {
            totalPages = Math.ceil(metaData.total / metaData.per_page);
          }
        }
        
        setCustomers(customersData);
        setCurrentPage(metaData?.current_page || 1);
        setTotalPages(totalPages);
      } else {
        console.warn('⚠️ Customers response format unexpected:', response);
        setCustomers([]);
      }
    } catch (err) {
      console.error('❌ Error fetching customers:', err);
      
      // Handle specific database column errors
      if (err instanceof Error && err.message.includes('payment_method')) {
        console.warn('⚠️ Backend database missing payment_method column');
        error(
          t('admin.database.error.title'),
          t('admin.database.payment.method.error')
        );
      } else {
      error(t('common.error'), t('admin.customers.error.fetch'));
      }
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await ApiService.getCustomersStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
      
      // Handle specific database column errors
      if (err instanceof Error && err.message.includes('payment_method')) {
        console.warn('⚠️ Backend database missing payment_method column - stats disabled');
      }
    }
  };

  const handleStatusUpdate = async (customerId: number, newStatus: string) => {
    if (!confirm(t('admin.customers.status.confirm'))) return;
    
    try {
      setActionLoading({ ...actionLoading, [customerId]: 'updating' });
      
      const response = await ApiService.updateCustomerStatus(customerId, newStatus);
      
      if (response.success) {
        success(t('common.success'), t('admin.customers.success.status.update'));
        fetchCustomers(currentPage);
        fetchStats();
      } else {
        warning(t('common.warning'), response.message || t('admin.customers.error.status.update'));
      }
    } catch (err) {
      console.error('❌ Error updating customer status:', err);
      error(t('common.error'), t('admin.customers.error.status.update'));
    } finally {
      setActionLoading({ ...actionLoading, [customerId]: '' });
    }
  };

  const openDetailsModal = async (customer: Customer) => {
    try {
      setActionLoading({ ...actionLoading, [customer.id]: 'loading_details' });
      
      const response = await ApiService.getCustomerDetails(customer.id);
      if (response.success && response.data) {
        setSelectedCustomer(response.data.customer || response.data);
        setShowDetails(true);
      }
    } catch (err) {
      console.error('❌ Error fetching customer details:', err);
      error(t('common.error'), t('admin.customers.error.details'));
    } finally {
      setActionLoading({ ...actionLoading, [customer.id]: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${t('common.currency')}`;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCustomers(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
    fetchCustomers(1);
  };

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, []);

  // Effect to handle page changes
  useEffect(() => {
    if (currentPage > 1) { // Don't refetch on initial load
      fetchCustomers(currentPage);
    }
  }, [currentPage]);

  if (loading && customers.length === 0) {
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
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.customers.title')}</h1>
            <p className="text-gray-600 mt-2">{t('admin.customers.subtitle')}</p>
          </div>
          <button
            onClick={() => fetchCustomers(currentPage)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
          >
            🔄 {t('admin.customers.refresh')}
          </button>
        </div>



        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-blue-600">{stats.total_customers}</div>
              <div className="text-sm text-gray-600">{t('admin.customers.stats.total')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-green-600">{stats.active_customers}</div>
              <div className="text-sm text-gray-600">{t('admin.customers.stats.active')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-purple-600">{stats.new_customers_this_month}</div>
              <div className="text-sm text-gray-600">{t('admin.customers.stats.new.month')}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-indigo-600">{formatCurrency(stats.top_spending_customers || 0)}</div>
              <div className="text-sm text-gray-600">{t('admin.customers.stats.revenue')}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.search')}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('admin.customers.search.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.customers.status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">{t('admin.customers.all.statuses')}</option>
                <option value="active">{t('admin.customers.status.active')}</option>
                <option value="inactive">{t('admin.customers.status.inactive')}</option>
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔍 {t('admin.customers.search.btn')}
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

        {/* Customers Table */}
        {customers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('admin.customers.no.customers')}</h3>
            <p className="text-gray-600">{t('admin.customers.no.customers.desc')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.customer')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.contact')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.orders')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.spent')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.status')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.joined')}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('admin.customers.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className="mr-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-xs text-gray-500">ID: {customer.id}</div>
                            {customer.company && (
                              <div className="text-xs text-gray-500">{customer.company}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        {customer.phone && (
                          <div className="text-xs text-gray-500">{customer.phone}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-bold text-gray-900">{customer.orders_count}</div>
                        <div className="text-xs text-gray-500">{t('admin.customers.orders.count')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">{formatCurrency(customer.total_spent)}</div>
                        {customer.last_activity && (
                          <div className="text-xs text-gray-500">
            {t('admin.customer.last.activity')}: {formatDate(customer.last_activity)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusUpdate(customer.id, customer.status === 'active' ? 'inactive' : 'active')}
                          disabled={actionLoading[customer.id] === 'updating'}
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${getStatusColor(customer.status)} hover:opacity-80`}
                        >
                          {actionLoading[customer.id] === 'updating' 
                            ? t('admin.customers.updating') 
                            : t(`admin.customers.status.${customer.status}`)
                          }
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(customer.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openDetailsModal(customer)}
                          disabled={actionLoading[customer.id] === 'loading_details'}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {actionLoading[customer.id] === 'loading_details' ? '⏳' : '👁️ ' + t('admin.customers.view')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - Modern Design like Products Page */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                  {t('admin.customers.previous') || 'السابق'}
                  </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                  <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-red-600 text-white border-red-600 shadow-md'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                      {pageNum}
                  </button>
                  );
                })}
                
                      <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                  {t('admin.customers.next') || 'التالي'}
                      </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('admin.customers.details.title')}: {selectedCustomer.name}
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
              {/* Customer Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('admin.customers.personal.info')}</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">{t('admin.customers.name')}:</span> {selectedCustomer.name}</p>
                    <p><span className="font-medium">{t('admin.customers.email')}:</span> {selectedCustomer.email}</p>
                    {selectedCustomer.phone && (
                      <p><span className="font-medium">{t('admin.customers.phone')}:</span> {selectedCustomer.phone}</p>
                    )}
                    {selectedCustomer.company && (
                      <p><span className="font-medium">{t('admin.customers.company')}:</span> {selectedCustomer.company}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('admin.customers.account.info')}</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">{t('admin.customers.joined')}:</span> {formatDate(selectedCustomer.created_at)}</p>
                    <p>
                      <span className="font-medium">{t('admin.customers.status')}:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                        {t(`admin.customers.status.${selectedCustomer.status}`)}
                      </span>
                    </p>
                    <p><span className="font-medium">{t('admin.customers.role')}:</span> {selectedCustomer.role}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('admin.customers.statistics')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedCustomer.orders_count}</div>
                    <div className="text-sm text-blue-700">{t('admin.customers.total.orders')}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.total_spent)}</div>
                    <div className="text-sm text-green-700">{t('admin.customers.total.spent')}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedCustomer.orders_count > 0 ? formatCurrency(selectedCustomer.total_spent / selectedCustomer.orders_count) : '0'}
                    </div>
                    <div className="text-sm text-purple-700">{t('admin.customers.average.order')}</div>
                  </div>
                </div>
              </div>

              {/* Last Order */}
              {selectedCustomer.last_activity && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t('admin.customer.last.activity.details')}</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                                          <p>{t('admin.customer.last.activity.date')}: {formatDate(selectedCustomer.last_activity)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-4">
              <button
                onClick={() => setShowDetails(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('admin.customers.close')}
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedCustomer.id, selectedCustomer.status === 'active' ? 'inactive' : 'active')}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {selectedCustomer.status === 'active' 
                  ? t('admin.customers.deactivate') 
                  : t('admin.customers.activate')
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 