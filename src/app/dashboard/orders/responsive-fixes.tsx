import React from 'react';

// إضافة Style tag لإصلاح المشاكل مباشرة
export function ResponsiveFixes() {
  React.useEffect(() => {
    // إضافة CSS مباشرة للـ head
    const style = document.createElement('style');
    style.textContent = `
      /* إصلاح مشاكل الـ horizontal scroll */
      .orders-page-wrapper {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        box-sizing: border-box !important;
      }

      /* إصلاح الـ table overflow */
      .orders-table-wrapper {
        width: 100% !important;
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }

      .orders-table-wrapper::-webkit-scrollbar {
        height: 6px !important;
      }

      .orders-table-wrapper::-webkit-scrollbar-thumb {
        background: #cbd5e0 !important;
        border-radius: 3px !important;
      }

      /* إصلاح الـ Actions buttons */
      .order-actions-fixed {
        display: flex !important;
        gap: 0.25rem !important;
        flex-wrap: nowrap !important;
        min-width: fit-content !important;
      }

      @media (max-width: 640px) {
        .order-actions-fixed button {
          padding: 0.375rem 0.5rem !important;
          font-size: 0.75rem !important;
        }
        
        .order-actions-fixed .text-mobile-hidden {
          display: none !important;
        }
      }

      @media (max-width: 768px) {
        .order-actions-fixed .text-tablet-hidden {
          display: none !important;
        }
      }

      /* إصلاح الـ Stats cards */
      .stats-cards-fixed {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
        gap: 1rem !important;
        width: 100% !important;
      }

      @media (max-width: 640px) {
        .stats-cards-fixed {
          grid-template-columns: 1fr !important;
        }
      }

      /* إصلاح الـ header */
      .page-header-fixed {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
      }

      @media (min-width: 640px) {
        .page-header-fixed {
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
      }

      /* إصلاح الـ bulk actions */
      .bulk-actions-fixed {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
      }

      @media (min-width: 640px) {
        .bulk-actions-fixed {
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
      }

      .bulk-actions-buttons-fixed {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 0.5rem !important;
      }

      @media (max-width: 640px) {
        .bulk-actions-buttons-fixed {
          gap: 0.25rem !important;
          overflow-x: auto !important;
          flex-wrap: nowrap !important;
          padding-bottom: 0.5rem !important;
        }
      }

      /* منع التمدد الأفقي للعناصر */
      .prevent-overflow {
        max-width: 100% !important;
        box-sizing: border-box !important;
      }

      /* تحسين الـ pagination */
      .pagination-fixed {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
      }

      @media (min-width: 640px) {
        .pagination-fixed {
          flex-direction: row !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
      }

      /* تحسين الـ modals للشاشات الصغيرة */
      .modal-fixed {
        position: fixed !important;
        inset: 0 !important;
        z-index: 50 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 1rem !important;
        overflow-y: auto !important;
      }

      .modal-content-fixed {
        width: 100% !important;
        max-width: 90vw !important;
        max-height: 90vh !important;
        overflow-y: auto !important;
        background: white !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      }

      @media (min-width: 768px) {
        .modal-content-fixed {
          max-width: 75vw !important;
        }
      }

      @media (min-width: 1024px) {
        .modal-content-fixed {
          max-width: 50vw !important;
        }
      }

      /* إصلاح عام للعناصر */
      * {
        box-sizing: border-box !important;
      }
    `;
    
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}

// Hook لإضافة الـ classes المناسبة للعناصر
export function useResponsiveClasses() {
  const getTableClasses = () => "orders-table-wrapper prevent-overflow";
  const getActionsClasses = () => "order-actions-fixed prevent-overflow";
  const getStatsClasses = () => "stats-cards-fixed prevent-overflow";
  const getHeaderClasses = () => "page-header-fixed prevent-overflow";
  const getBulkActionsClasses = () => "bulk-actions-fixed prevent-overflow";
  const getPageClasses = () => "orders-page-wrapper prevent-overflow";
  const getPaginationClasses = () => "pagination-fixed prevent-overflow";
  const getModalClasses = () => "modal-fixed";
  const getModalContentClasses = () => "modal-content-fixed";

  return {
    getTableClasses,
    getActionsClasses,
    getStatsClasses,
    getHeaderClasses,
    getBulkActionsClasses,
    getPageClasses,
    getPaginationClasses,
    getModalClasses,
    getModalContentClasses
  };
} 