'use client';

import React from 'react';
import { useToast } from '../../../context/ToastContext';
import { useLanguage } from '../../../context/LanguageContext';

interface BulkActionsProps {
  selectedOrders: number[];
  onBulkUpdateStatus: (status: string) => void;
  onClearSelection: () => void;
}

export default function BulkActions({ 
  selectedOrders, 
  onBulkUpdateStatus, 
  onClearSelection 
}: BulkActionsProps) {
  const { language } = useLanguage();
  const toast = useToast();

  if (selectedOrders.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-blue-900">
              {language === 'ar' ? `تم اختيار ${selectedOrders.length} طلب` : `${selectedOrders.length} orders selected`}
            </p>
            <p className="text-xs text-blue-600">
              {language === 'ar' ? 'اختر إجراءً للتطبيق على الطلبات المحددة' : 'Choose an action to apply to selected orders'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Status Update Dropdown */}
          <div className="relative inline-block">
            <button
              onClick={() => {
                const dropdown = document.getElementById('bulk-status-dropdown');
                const isOpen = dropdown!.style.display === 'block';
                dropdown!.style.display = isOpen ? 'none' : 'block';
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
              <svg className="w-3 h-3 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div id="bulk-status-dropdown" className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200" style={{ display: 'none' }}>
              <div className="py-1">
                {[
                  { value: 'pending', label: language === 'ar' ? 'في الانتظار' : 'Pending', color: 'text-yellow-600', bg: 'bg-yellow-100' },
                  { value: 'confirmed', label: language === 'ar' ? 'مؤكد' : 'Confirmed', color: 'text-blue-600', bg: 'bg-blue-100' },
                  { value: 'processing', label: language === 'ar' ? 'قيد التحضير' : 'Processing', color: 'text-purple-600', bg: 'bg-purple-100' },
                  { value: 'shipped', label: language === 'ar' ? 'تم الشحن' : 'Shipped', color: 'text-indigo-600', bg: 'bg-indigo-100' },
                  { value: 'delivered', label: language === 'ar' ? 'تم التسليم' : 'Delivered', color: 'text-green-600', bg: 'bg-green-100' },
                  { value: 'cancelled', label: language === 'ar' ? 'ملغي' : 'Cancelled', color: 'text-red-600', bg: 'bg-red-100' }
                ].map(status => (
                  <button
                    key={status.value}
                    onClick={() => {
                      onBulkUpdateStatus(status.value);
                      document.getElementById('bulk-status-dropdown')!.style.display = 'none';
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:${status.bg} ${status.color} transition-colors`}
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 bg-current opacity-60`}></div>
                      {status.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <button
            onClick={() => onBulkUpdateStatus('confirmed')}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {language === 'ar' ? 'تأكيد الكل' : 'Confirm All'}
          </button>

          {/* Export Button */}
          <button
            onClick={() => {
              toast.info(
                language === 'ar' ? 'قريباً' : 'Coming Soon',
                language === 'ar' ? 'ميزة التصدير قريباً' : 'Export feature coming soon'
              );
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">
              {language === 'ar' ? 'تصدير' : 'Export'}
            </span>
          </button>

          {/* Print Button */}
          <button
            onClick={() => {
              toast.info(
                language === 'ar' ? 'قريباً' : 'Coming Soon',
                language === 'ar' ? 'ميزة الطباعة الجماعية قريباً' : 'Bulk print feature coming soon'
              );
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="hidden sm:inline">
              {language === 'ar' ? 'طباعة' : 'Print'}
            </span>
          </button>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="hidden sm:inline">
              {language === 'ar' ? 'إلغاء التحديد' : 'Clear'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
} 