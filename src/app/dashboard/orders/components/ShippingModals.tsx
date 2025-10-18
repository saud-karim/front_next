'use client';

import { useState } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface ShippingPreviewData {
  order_id: number;
  order_number: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  shipping_address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    district?: string;
    governorate: string;
    building_number?: string;
    floor?: string;
    apartment?: string;
    postal_code?: string;
  };
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  payment_method: string;
  notes?: string;
  validation: {
    is_valid: boolean;
    warnings: string[];
    errors: string[];
  };
}

interface ShippingResult {
  order_id: number;
  order_number?: string;
  status: 'pending' | 'sending' | 'success' | 'failed';
  tracking_number?: string;
  error?: string;
  message?: string;
}

// ============================================================================
// PREVIEW MODAL
// ============================================================================

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: {
    orders: ShippingPreviewData[];
    summary: {
      total_orders: number;
      valid_orders: number;
      invalid_orders: number;
      total_amount: number;
    };
  } | null;
  onConfirm: () => void;
  language: string;
}

export function ShippingPreviewModal({ 
  isOpen, 
  onClose, 
  previewData, 
  onConfirm,
  language 
}: PreviewModalProps) {
  if (!isOpen || !previewData) return null;

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-xl font-bold">
                {t('معاينة بيانات الشحن', 'Preview Shipping Data')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Summary */}
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <p className="text-gray-700 mb-3">
              {t(
                `سيتم إرسال ${previewData.summary.total_orders} طلب إلى شركة الشحن`,
                `${previewData.summary.total_orders} orders will be sent to shipping company`
              )}
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{previewData.summary.total_orders}</p>
                <p className="text-sm text-gray-600">{t('إجمالي الطلبات', 'Total Orders')}</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{previewData.summary.valid_orders}</p>
                <p className="text-sm text-gray-600">{t('جاهز للإرسال', 'Ready to Send')}</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {(previewData.summary?.total_amount || 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">{t('إجمالي المبلغ', 'Total Amount')}</p>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="px-6 py-4 overflow-y-auto max-h-[50vh]">
            {previewData.orders.map((order) => (
              <div 
                key={order.order_id}
                className={`border rounded-lg p-4 mb-4 ${
                  order.validation.is_valid 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                    </svg>
                    <h3 className="font-bold text-gray-900">
                      {t('طلب', 'Order')} #{order.order_number} - {order.customer.name}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.validation.is_valid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.validation.is_valid 
                      ? t('✓ جاهز', '✓ Ready') 
                      : t('✗ يحتاج مراجعة', '✗ Needs Review')
                    }
                  </span>
                </div>

                {/* Validation Errors */}
                {order.validation.errors.length > 0 && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
                    <p className="font-medium text-red-800 mb-1">
                      {t('⚠️ أخطاء يجب إصلاحها:', '⚠️ Errors to fix:')}
                    </p>
                    <ul className="list-disc list-inside text-sm text-red-700">
                      {order.validation.errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Validation Warnings */}
                {order.validation.warnings.length > 0 && (
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-3">
                    <p className="font-medium text-yellow-800 mb-1">
                      {t('⚠️ تحذيرات:', '⚠️ Warnings:')}
                    </p>
                    <ul className="list-disc list-inside text-sm text-yellow-700">
                      {order.validation.warnings.map((warning, idx) => (
                        <li key={idx}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Contact Info */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {t('📞 معلومات الاتصال', '📞 Contact Info')}
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{order.customer.name}</p>
                      <p>{order.customer.phone}</p>
                      <p>{order.customer.email}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {t('📍 عنوان الشحن', '📍 Shipping Address')}
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>{order.shipping_address.street}</p>
                      {order.shipping_address.district && <p>{order.shipping_address.district}</p>}
                      <p>{order.shipping_address.city}, {order.shipping_address.governorate}</p>
                      {order.shipping_address.postal_code && <p>{order.shipping_address.postal_code}</p>}
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {t('📦 المنتجات', '📦 Products')}
                  </p>
                  <div className="bg-white rounded border border-gray-200 p-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700">
                          • {item.product_name} × {item.quantity}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {(item.unit_price || item.price || 0).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total & Payment */}
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {t('طريقة الدفع:', 'Payment Method:')} <span className="font-medium">{order.payment_method}</span>
                    </p>
                    {order.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        {t('ملاحظات:', 'Notes:')} {order.notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{t('الإجمالي', 'Total')}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {(order.total_amount || 0).toFixed(2)} {t('جنيه', 'EGP')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              {t('إلغاء', 'Cancel')}
            </button>
            <button
              onClick={onConfirm}
              disabled={previewData.summary.valid_orders === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                previewData.summary.valid_orders === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('تأكيد الإرسال', 'Confirm Send')} ({previewData.summary.valid_orders})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROGRESS MODAL
// ============================================================================

interface ProgressModalProps {
  isOpen: boolean;
  results: Record<number, ShippingResult>;
  language: string;
  onClose: () => void;
}

export function ShippingProgressModal({ 
  isOpen, 
  results,
  language,
  onClose
}: ProgressModalProps) {
  if (!isOpen) return null;

  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  const resultsArray = Object.values(results);
  const total = resultsArray.length;
  const completed = resultsArray.filter(r => r.status === 'success' || r.status === 'failed').length;
  const success = resultsArray.filter(r => r.status === 'success').length;
  const failed = resultsArray.filter(r => r.status === 'failed').length;
  const sending = resultsArray.filter(r => r.status === 'sending').length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = completed === total;

  const getStatusIcon = (status: ShippingResult['status']) => {
    switch (status) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'sending':
        return (
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <h2 className="text-xl font-bold">
                {isComplete 
                  ? t('✅ اكتمل الإرسال', '✅ Sending Complete')
                  : t('🚚 جاري إرسال الطلبات...', '🚚 Sending Orders...')
                }
              </h2>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700 font-medium">
                {t('التقدم', 'Progress')}: {completed} / {total}
              </span>
              <span className="text-blue-600 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-blue-600 h-3 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Results List */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {resultsArray.map((result) => (
              <div 
                key={result.order_id}
                className={`flex items-center gap-3 p-3 rounded-lg mb-2 border ${
                  result.status === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : result.status === 'failed'
                    ? 'bg-red-50 border-red-200'
                    : result.status === 'sending'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(result.status)}
                </div>

                {/* Order Info */}
                <div className="flex-grow">
                  <p className="font-medium text-gray-900">
                    {t('طلب', 'Order')} #{result.order_number || result.order_id}
                  </p>
                  {result.status === 'success' && result.tracking_number && (
                    <p className="text-sm text-green-700">
                      {t('رقم الشحنة:', 'Tracking:')} {result.tracking_number}
                    </p>
                  )}
                  {result.status === 'failed' && result.error && (
                    <p className="text-sm text-red-700">{result.error}</p>
                  )}
                  {result.status === 'sending' && (
                    <p className="text-sm text-blue-700">{t('جاري الإرسال...', 'Sending...')}</p>
                  )}
                  {result.message && result.status !== 'sending' && (
                    <p className="text-sm text-gray-600">{result.message}</p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  {result.status === 'success' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      {t('✓ نجح', '✓ Success')}
                    </span>
                  )}
                  {result.status === 'failed' && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                      {t('✗ فشل', '✗ Failed')}
                    </span>
                  )}
                  {result.status === 'sending' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {t('⏳ جاري...', '⏳ Sending...')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{total}</p>
                <p className="text-sm text-gray-600">{t('إجمالي', 'Total')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{success}</p>
                <p className="text-sm text-gray-600">{t('نجح', 'Success')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{failed}</p>
                <p className="text-sm text-gray-600">{t('فشل', 'Failed')}</p>
              </div>
            </div>

            {/* Close Button */}
            {isComplete && (
              <button
                onClick={onClose}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                {t('إغلاق', 'Close')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

