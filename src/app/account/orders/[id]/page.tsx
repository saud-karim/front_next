'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useToast } from '../../../context/ToastContext';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { ApiService } from '../../../services/api';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  variant_id?: number;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderDetails {
  id: number;
  order_number: string;
  status: string;
  status_ar: string;
  payment_method: string;
  payment_method_ar: string;
  payment_status: string;
  payment_status_ar: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  shipping_address: {
    name: string;
    phone: string;
    governorate: string;
    city: string;
    district?: string;
    street: string;
    building_number?: string;
    floor?: string;
    apartment?: string;
    postal_code?: string;
  };
  items: OrderItem[];
  notes?: string;
  estimated_delivery_date?: string;
  can_be_cancelled: boolean;
  created_at: string;
  updated_at: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { language } = useLanguage();
  const toast = useToast();
  
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = params.id as string;

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetails();
    }
  }, [user, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getOrderDetails(orderId);
      
      console.log('📦 Order Details Response:', response);
      
      if (response.success && response.data) {
        setOrder(response.data as OrderDetails);
      } else if (response.data) {
        // Sometimes backend returns data without success flag
        setOrder(response.data as OrderDetails);
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast.error(
        language === 'ar' ? 'خطأ' : 'Error',
        error.message || (language === 'ar' ? 'فشل في تحميل تفاصيل الطلب' : 'Failed to load order details')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm(language === 'ar' ? 'هل تريد إلغاء هذا الطلب؟' : 'Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await ApiService.cancelOrder(orderId, {
        reason: language === 'ar' ? 'ملغى من قبل العميل' : 'Cancelled by customer'
      });

      if (response.success) {
        toast.success(
          language === 'ar' ? 'نجح' : 'Success',
          language === 'ar' ? 'تم إلغاء الطلب بنجاح' : 'Order cancelled successfully'
        );
        fetchOrderDetails();
      }
    } catch (error: any) {
      toast.error(
        language === 'ar' ? 'خطأ' : 'Error',
        error.message || (language === 'ar' ? 'فشل في إلغاء الطلب' : 'Failed to cancel order')
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'ar' ? 'ar-EG' : 'en-US',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(
      language === 'ar' ? 'ar-EG' : 'en-US',
      {
        style: 'currency',
        currency: order?.currency || 'EGP'
      }
    ).format(amount);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {language === 'ar' ? 'طلب غير موجود' : 'Order Not Found'}
            </h3>
            <p className="mt-2 text-gray-600">
              {language === 'ar' ? 'لم يتم العثور على هذا الطلب' : 'This order was not found'}
            </p>
            <Link
              href="/account/orders"
              className="mt-6 inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {language === 'ar' ? 'العودة للطلبات' : 'Back to Orders'}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <svg className={`w-5 h-5 mx-2 text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <Link href="/account" className="text-gray-500 hover:text-gray-700">
            {language === 'ar' ? 'حسابي' : 'My Account'}
          </Link>
          <svg className={`w-5 h-5 mx-2 text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <Link href="/account/orders" className="text-gray-500 hover:text-gray-700">
            {language === 'ar' ? 'طلباتي' : 'My Orders'}
          </Link>
          <svg className={`w-5 h-5 mx-2 text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-900">{order.order_number}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'طلب' : 'Order'} #{order.order_number}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' ? 'تم الطلب في' : 'Placed on'} {formatDate(order.created_at)}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {language === 'ar' ? order.status_ar : order.status}
              </span>
              
              {order.can_be_cancelled && (
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors"
                >
                  {language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'المنتجات' : 'Items'} ({order.items?.length || 0})
              </h2>
              
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex-shrink-0">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.product_name}
                        </h3>
                        {item.variant_name && (
                          <p className="text-sm text-gray-600 mb-1">
                            {item.variant_name}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          {language === 'ar' ? 'الكمية' : 'Quantity'}: {item.quantity}
                        </p>
                      </div>
                      
                      <div className={`text-${language === 'ar' ? 'left' : 'right'}`}>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.unit_price)} {language === 'ar' ? 'للقطعة' : 'each'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    {language === 'ar' ? 'لا توجد منتجات' : 'No items'}
                  </p>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
              </h2>
              
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">{order.shipping_address.name}</p>
                <p>{order.shipping_address.phone}</p>
                <p>
                  {order.shipping_address.street}
                  {order.shipping_address.building_number && `, ${language === 'ar' ? 'عقار' : 'Building'} ${order.shipping_address.building_number}`}
                  {order.shipping_address.floor && `, ${language === 'ar' ? 'طابق' : 'Floor'} ${order.shipping_address.floor}`}
                  {order.shipping_address.apartment && `, ${language === 'ar' ? 'شقة' : 'Apt'} ${order.shipping_address.apartment}`}
                </p>
                <p>
                  {order.shipping_address.district && `${order.shipping_address.district}, `}
                  {order.shipping_address.city}, {order.shipping_address.governorate}
                </p>
                {order.shipping_address.postal_code && (
                  <p>{order.shipping_address.postal_code}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-gray-700">
                  <span>{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                  <span>{formatCurrency(order.shipping_cost)}</span>
                </div>
                
                {order.tax_amount > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                    <span>{formatCurrency(order.tax_amount)}</span>
                  </div>
                )}
                
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{language === 'ar' ? 'الخصم' : 'Discount'}</span>
                    <span>-{formatCurrency(order.discount_amount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {language === 'ar' ? 'الإجمالي' : 'Total'}
                    </span>
                    <span className="text-xl font-bold text-red-600">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {language === 'ar' ? 'معلومات الدفع' : 'Payment Info'}
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
                  </p>
                  <p className="font-medium text-gray-900">
                    {language === 'ar' ? order.payment_method_ar : order.payment_method}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {language === 'ar' ? 'حالة الدفع' : 'Payment Status'}
                  </p>
                  <p className="font-medium text-gray-900">
                    {language === 'ar' ? order.payment_status_ar : order.payment_status}
                  </p>
                </div>
              </div>
            </div>

            {/* Expected Delivery */}
            {order.estimated_delivery_date && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                  <span className="font-medium text-blue-900">
                    {language === 'ar' ? 'التسليم المتوقع' : 'Expected Delivery'}
                  </span>
                </div>
                <p className="text-blue-800">
                  {formatDate(order.estimated_delivery_date)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/account/orders"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {language === 'ar' ? 'العودة للطلبات' : 'Back to Orders'}
              </Link>
              
              {order.status === 'shipped' && (
                <Link
                  href={`/track-order?order=${order.order_number}`}
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {language === 'ar' ? 'تتبع الطلب' : 'Track Order'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

