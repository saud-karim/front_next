'use client';

import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function PreviewModal({ isOpen, onClose, title, children }: PreviewModalProps) {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">👁️</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}
              </h3>
              <p className="text-sm text-gray-600">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6">
            {/* Browser mockup header */}
            <div className="bg-gray-100 rounded-t-lg p-3 border-b">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600 ml-4">
                  https://buildtools-bs.com
                </div>
              </div>
            </div>
            
            {/* Preview content */}
            <div className="bg-white border border-gray-200 rounded-b-lg min-h-[400px]">
              {children}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {language === 'ar' 
                ? 'هذه معاينة لكيف ستظهر البيانات في الموقع الفعلي' 
                : 'This is a preview of how the data will appear on the actual website'
              }
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {language === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 