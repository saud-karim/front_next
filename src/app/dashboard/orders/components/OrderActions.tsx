'use client';

import React from 'react';
import { useToast } from '../../../context/ToastContext';
import { useLanguage } from '../../../context/LanguageContext';

interface OrderActionsProps {
  order: any;
  actionLoading: Record<number, string>;
  onViewDetails: (orderId: number) => void;
  onUpdateStatus: (orderData: any) => void;
}

export default function OrderActions({ 
  order, 
  actionLoading, 
  onViewDetails, 
  onUpdateStatus 
}: OrderActionsProps) {
  const { language } = useLanguage();
  const toast = useToast();

  return (
    <div className="flex gap-1">
      {/* View Details Button */}
      <button
        onClick={() => onViewDetails(order.id)}
        disabled={actionLoading[order.id] === 'loading_details'}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title={language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
      >
        {actionLoading[order.id] === 'loading_details' ? (
          <svg className="animate-spin h-3 w-3 mr-1" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
        <span className="hidden sm:inline">
          {language === 'ar' ? 'عرض' : 'View'}
        </span>
      </button>

      {/* Update Status Button */}
      <button
        onClick={() => onUpdateStatus({
          orderId: order.id,
          status: order.status,
          notes: '',
          tracking_number: order.tracking_number || '',
          estimated_delivery: order.estimated_delivery || '',
          notify_customer: true
        })}
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        title={language === 'ar' ? 'تحديث الحالة' : 'Update Status'}
      >
        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span className="hidden sm:inline">
          {language === 'ar' ? 'تحديث' : 'Edit'}
        </span>
      </button>

      {/* Status Badge */}
      <div className="flex items-center">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {language === 'ar' ? order.status_ar : order.status}
        </span>
      </div>

      {/* Print/Download Button */}
      <button
        onClick={() => {
          toast.info(
            language === 'ar' ? 'قريباً' : 'Coming Soon',
            language === 'ar' ? 'ميزة الطباعة قريباً' : 'Print feature coming soon'
          );
        }}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        title={language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
      >
        <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        <span className="hidden lg:inline">
          {language === 'ar' ? 'طباعة' : 'Print'}
        </span>
      </button>

      {/* More Actions Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            const currentlyOpen = document.getElementById(`dropdown-${order.id}`)?.style.display === 'block';
            document.querySelectorAll('[id^="dropdown-"]').forEach(el => {
              (el as HTMLElement).style.display = 'none';
            });
            const dropdown = document.getElementById(`dropdown-${order.id}`);
            if (dropdown) {
              dropdown.style.display = currentlyOpen ? 'none' : 'block';
            }
          }}
          className="inline-flex items-center px-2 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          title={language === 'ar' ? 'المزيد' : 'More Actions'}
        >
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        <div
          id={`dropdown-${order.id}`}
          className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
          style={{ display: 'none' }}
        >
          <div className="py-1">
            <button
              onClick={() => {
                toast.info(
                  language === 'ar' ? 'قريباً' : 'Coming Soon',
                  language === 'ar' ? 'ميزة إضافة الملاحظات قريباً' : 'Add notes feature coming soon'
                );
                document.getElementById(`dropdown-${order.id}`)!.style.display = 'none';
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg className="inline h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {language === 'ar' ? 'إضافة ملاحظة' : 'Add Note'}
            </button>
            <button
              onClick={() => {
                toast.info(
                  language === 'ar' ? 'قريباً' : 'Coming Soon',
                  language === 'ar' ? 'ميزة إرسال إيميل قريباً' : 'Send email feature coming soon'
                );
                document.getElementById(`dropdown-${order.id}`)!.style.display = 'none';
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <svg className="inline h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {language === 'ar' ? 'إرسال إيميل' : 'Send Email'}
            </button>
            {order.can_be_cancelled && (
              <button
                onClick={() => {
                  if (confirm(language === 'ar' ? 'هل أنت متأكد من إلغاء هذا الطلب؟' : 'Are you sure you want to cancel this order?')) {
                    toast.info(
                      language === 'ar' ? 'قريباً' : 'Coming Soon',
                      language === 'ar' ? 'ميزة إلغاء الطلب قريباً' : 'Cancel order feature coming soon'
                    );
                  }
                  document.getElementById(`dropdown-${order.id}`)!.style.display = 'none';
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                <svg className="inline h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for status colors
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