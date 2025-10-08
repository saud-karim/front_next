'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../../context/LanguageContext';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  statusUpdateData: {
    orderId: number;
    status: string;
    notes: string;
    tracking_number: string;
    estimated_delivery: string;
    notify_customer: boolean;
  };
  setStatusUpdateData: (data: any) => void;
  updating: boolean;
}

export default function StatusUpdateModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  statusUpdateData,
  setStatusUpdateData,
  updating
}: StatusUpdateModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  const statusOptions = [
    { value: 'pending', label: language === 'ar' ? 'في الانتظار' : 'Pending', color: 'text-yellow-600', icon: '⏳' },
    { value: 'confirmed', label: language === 'ar' ? 'مؤكد' : 'Confirmed', color: 'text-blue-600', icon: '✅' },
    { value: 'processing', label: language === 'ar' ? 'قيد التحضير' : 'Processing', color: 'text-purple-600', icon: '⚙️' },
    { value: 'shipped', label: language === 'ar' ? 'تم الشحن' : 'Shipped', color: 'text-indigo-600', icon: '🚚' },
    { value: 'delivered', label: language === 'ar' ? 'تم التسليم' : 'Delivered', color: 'text-green-600', icon: '📦' },
    { value: 'cancelled', label: language === 'ar' ? 'ملغي' : 'Cancelled', color: 'text-red-600', icon: '❌' },
    { value: 'refunded', label: language === 'ar' ? 'مسترد' : 'Refunded', color: 'text-gray-600', icon: '↩️' }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'ar' ? 'تحديث حالة الطلب' : 'Update Order Status'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? `الطلب رقم ${statusUpdateData.orderId}` : `Order #${statusUpdateData.orderId}`}
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
        <div className="mt-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {language === 'ar' ? 'الحالة الجديدة' : 'New Status'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setStatusUpdateData(prev => ({ ...prev, status: status.value }))}
                  className={`relative p-3 border-2 rounded-lg text-center transition-colors ${
                    statusUpdateData.status === status.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-lg mb-1">{status.icon}</div>
                  <div className="text-xs font-medium">{status.label}</div>
                  {statusUpdateData.status === status.value && (
                    <div className="absolute top-1 right-1">
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Fields Based on Status */}
          {(statusUpdateData.status === 'shipped' || statusUpdateData.status === 'processing') && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {language === 'ar' ? 'معلومات الشحن' : 'Shipping Information'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'رقم التتبع' : 'Tracking Number'}
                  </label>
                  <input
                    type="text"
                    value={statusUpdateData.tracking_number}
                    onChange={(e) => setStatusUpdateData(prev => ({ ...prev, tracking_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={language === 'ar' ? 'رقم التتبع (اختياري)' : 'Tracking number (optional)'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === 'ar' ? 'تاريخ التسليم المتوقع' : 'Estimated Delivery'}
                  </label>
                  <input
                    type="date"
                    value={statusUpdateData.estimated_delivery}
                    onChange={(e) => setStatusUpdateData(prev => ({ ...prev, estimated_delivery: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'ملاحظات' : 'Notes'}
            </label>
            <textarea
              value={statusUpdateData.notes}
              onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={language === 'ar' 
                ? 'أضف ملاحظات حول تحديث الحالة (اختياري)...'
                : 'Add notes about the status update (optional)...'
              }
            />
          </div>

          {/* Customer Notification */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notify_customer"
                checked={statusUpdateData.notify_customer}
                onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notify_customer: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notify_customer" className="ml-2 block text-sm text-gray-900">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium">
                    {language === 'ar' ? 'إشعار العميل' : 'Notify Customer'}
                  </span>
                </div>
                <span className="text-xs text-gray-600 ml-6">
                  {language === 'ar' 
                    ? 'إرسال إشعار بريد إلكتروني للعميل عند تحديث الحالة'
                    : 'Send email notification to customer when status is updated'
                  }
                </span>
              </label>
            </div>
          </div>

          {/* Status Change Preview */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-yellow-800">
                  {language === 'ar' ? 'معاينة التغيير:' : 'Change Preview:'}
                </p>
                <p className="text-yellow-700">
                  {language === 'ar' 
                    ? `سيتم تغيير حالة الطلب إلى "${statusOptions.find(s => s.value === statusUpdateData.status)?.label || statusUpdateData.status}"`
                    : `Order status will be changed to "${statusOptions.find(s => s.value === statusUpdateData.status)?.label || statusUpdateData.status}"`
                  }
                  {statusUpdateData.notify_customer && (
                    <span>
                      {language === 'ar' ? ' وسيتم إرسال إشعار للعميل.' : ' and customer will be notified.'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={updating}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={onUpdate}
            disabled={updating || !statusUpdateData.status}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {language === 'ar' ? 'جاري التحديث...' : 'Updating...'}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 