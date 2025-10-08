'use client';

import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any | null;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: string) => string;
}

export default function OrderDetailsModal({ 
  isOpen, 
  onClose, 
  order, 
  formatCurrency, 
  formatDate 
}: OrderDetailsModalProps) {
  const { language } = useLanguage();

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707v11a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
              </h3>
              <p className="text-sm text-gray-600">
                {order.order_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 max-h-96 overflow-y-auto">
          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707v11a2 2 0 01-2 2z" />
                </svg>
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'رقم الطلب:' : 'Order Number:'}
                  </span>
                  <span className="font-medium">{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'التاريخ:' : 'Date:'}
                  </span>
                  <span className="font-medium">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'الحالة:' : 'Status:'}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {language === 'ar' ? order.status_ar : order.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'حالة الدفع:' : 'Payment Status:'}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                    {language === 'ar' ? order.payment_status_ar : order.payment_status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}
                  </span>
                  <span className="font-medium">{order.payment_method || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {language === 'ar' ? 'بيانات العميل' : 'Customer Info'}
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">
                    {language === 'ar' ? 'الاسم:' : 'Name:'}
                  </span>
                  <span className="font-medium ml-2">{order.customer.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">
                    {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}
                  </span>
                  <span className="font-medium ml-2">{order.customer.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">
                    {language === 'ar' ? 'الهاتف:' : 'Phone:'}
                  </span>
                  <span className="font-medium ml-2">{order.customer.phone || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
            </h4>
            <div className="text-sm text-gray-700">
              <p><strong>{order.shipping_address?.name || order.customer.name}</strong></p>
              <p>{order.shipping_address?.street || 'No address provided'}</p>
              <p>{order.shipping_address?.city}, {order.shipping_address?.district}</p>
              <p>{order.shipping_address?.governorate}</p>
              <p>{order.shipping_address?.phone || order.customer.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {language === 'ar' ? 'المنتجات' : 'Order Items'}
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {order.items_count} {language === 'ar' ? 'منتج' : 'items'}
              </span>
            </h4>
            
            <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                    <div className="flex-1">
                      <p className="font-medium">
                        {language === 'ar' ? item.product_name : (item.product_name_en || item.product_name)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {language === 'ar' ? 'الكمية:' : 'Qty:'} {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  {language === 'ar' ? 'لا توجد تفاصيل المنتجات' : 'No item details available'}
                </p>
              )}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              {language === 'ar' ? 'ملخص المبلغ' : 'Order Total'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{language === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span>{formatCurrency(order.amounts.subtotal)}</span>
              </div>
              {order.amounts.tax_amount > 0 && (
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'الضريبة:' : 'Tax:'}</span>
                  <span>{formatCurrency(order.amounts.tax_amount)}</span>
                </div>
              )}
              {order.amounts.shipping_amount > 0 && (
                <div className="flex justify-between">
                  <span>{language === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
                  <span>{formatCurrency(order.amounts.shipping_amount)}</span>
                </div>
              )}
              {order.amounts.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{language === 'ar' ? 'الخصم:' : 'Discount:'}</span>
                  <span>-{formatCurrency(order.amounts.discount_amount)}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>{language === 'ar' ? 'المجموع الكلي:' : 'Total:'}</span>
                <span className="text-blue-600">{formatCurrency(order.amounts.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          {(order.tracking_number || order.estimated_delivery) && (
            <div className="bg-green-50 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {language === 'ar' ? 'معلومات الشحن' : 'Shipping Info'}
              </h4>
              <div className="space-y-2 text-sm">
                {order.tracking_number && (
                  <div>
                    <span className="text-gray-600">
                      {language === 'ar' ? 'رقم التتبع:' : 'Tracking Number:'}
                    </span>
                    <span className="font-medium ml-2">{order.tracking_number}</span>
                  </div>
                )}
                {order.estimated_delivery && (
                  <div>
                    <span className="text-gray-600">
                      {language === 'ar' ? 'التسليم المتوقع:' : 'Estimated Delivery:'}
                    </span>
                    <span className="font-medium ml-2">{formatDate(order.estimated_delivery)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {language === 'ar' ? 'ملاحظات' : 'Notes'}
              </h4>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
          <button
            onClick={() => {
              // Print functionality will go here
              window.print();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            {language === 'ar' ? 'طباعة' : 'Print'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for status colors
function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

function getPaymentStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
} 
 