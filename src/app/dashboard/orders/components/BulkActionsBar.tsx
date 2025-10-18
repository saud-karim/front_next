'use client';

interface BulkActionsBarProps {
  selectedCount: number;
  onPreviewShipping: () => void;
  onSendToShipping: () => void;
  onConfigureShipping: () => void;
  onDeselectAll: () => void;
  onExport: () => void;
  onPrint: () => void;
  onBulkDelete: () => void;
  onBulkStatusChange: (status: string) => void;
  language: string;
  loading?: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onPreviewShipping,
  onSendToShipping,
  onConfigureShipping,
  onDeselectAll,
  onExport,
  onPrint,
  onBulkDelete,
  onBulkStatusChange,
  language,
  loading = false
}: BulkActionsBarProps) {
  const t = (ar: string, en: string) => language === 'ar' ? ar : en;

  if (selectedCount === 0) return null;

  return (
    <div 
      className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-6 shadow-md"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Selection Info */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {selectedCount}
          </div>
          <p className="text-blue-900 font-medium">
            {t(
              `تم تحديد ${selectedCount} طلب`,
              `${selectedCount} order${selectedCount > 1 ? 's' : ''} selected`
            )}
          </p>
        </div>
        <button
          onClick={onDeselectAll}
          className="text-blue-700 hover:text-blue-900 font-medium text-sm flex items-center gap-1 transition-colors"
          disabled={loading}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {t('إلغاء التحديد', 'Deselect All')}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Shipping Actions */}
        <div className="flex gap-2 border-l-2 border-blue-300 pl-2">
          <button
            onClick={onPreviewShipping}
            disabled={loading}
            className="px-4 py-2 bg-white border-2 border-blue-400 text-blue-700 rounded-lg hover:bg-blue-50 font-medium transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="hidden sm:inline">{t('معاينة البيانات', 'Preview Data')}</span>
            <span className="sm:hidden">📋</span>
          </button>

          <button
            onClick={onSendToShipping}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <span className="hidden sm:inline">{t('إرسال للشحن', 'Send to Shipping')}</span>
            <span className="sm:hidden">🚚</span>
          </button>

          <button
            onClick={onConfigureShipping}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={t('إعدادات الشحن - حدد البيانات المرسلة', 'Shipping Configuration - Select Data Fields')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">{t('إعدادات', 'Configure')}</span>
            <span className="sm:hidden">⚙️</span>
          </button>
        </div>

        {/* Other Actions */}
        <div className="relative inline-block">
          <button
            onClick={(e) => {
              const dropdown = document.getElementById('shipping-bulk-status-dropdown');
              if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
              }
            }}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">{t('تغيير الحالة', 'Change Status')}</span>
            <span className="sm:hidden">↻</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div 
            id="shipping-bulk-status-dropdown" 
            className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200"
            style={{ display: 'none' }}
          >
            <div className="py-1">
              {[
                { value: 'pending', label: t('في الانتظار', 'Pending'), color: 'text-yellow-600' },
                { value: 'confirmed', label: t('مؤكد', 'Confirmed'), color: 'text-blue-600' },
                { value: 'processing', label: t('قيد التحضير', 'Processing'), color: 'text-purple-600' },
                { value: 'shipped', label: t('تم الشحن', 'Shipped'), color: 'text-indigo-600' },
                { value: 'delivered', label: t('تم التسليم', 'Delivered'), color: 'text-green-600' },
                { value: 'cancelled', label: t('ملغي', 'Cancelled'), color: 'text-red-600' }
              ].map(status => (
                <button
                  key={status.value}
                  onClick={() => {
                    onBulkStatusChange(status.value);
                    const dropdown = document.getElementById('shipping-bulk-status-dropdown');
                    if (dropdown) dropdown.style.display = 'none';
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${status.color}`}
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

        <button
          onClick={onExport}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">{t('تصدير', 'Export')}</span>
          <span className="sm:hidden">📊</span>
        </button>

        <button
          onClick={onPrint}
          disabled={loading}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span className="hidden sm:inline">{t('طباعة', 'Print')}</span>
          <span className="sm:hidden">🖨️</span>
        </button>

        <button
          onClick={onBulkDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden sm:inline">{t('حذف', 'Delete')}</span>
          <span className="sm:hidden">🗑️</span>
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-blue-700">
          <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">{t('جاري التنفيذ...', 'Processing...')}</span>
        </div>
      )}
    </div>
  );
}

