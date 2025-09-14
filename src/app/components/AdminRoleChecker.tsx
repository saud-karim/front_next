'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface AdminRoleCheckerProps {
  onRoleCheck?: (isAdmin: boolean, isLoggedIn: boolean) => void;
}

export function AdminRoleChecker({ onRoleCheck }: AdminRoleCheckerProps) {
  const [roleStatus, setRoleStatus] = useState<{
    isAdmin: boolean;
    isLoggedIn: boolean;
    userInfo: any;
    message: string;
  }>({
    isAdmin: false,
    isLoggedIn: false,
    userInfo: null,
    message: 'جاري التحقق من الصلاحيات...'
  });

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
      
      if (!token) {
        setRoleStatus({
          isAdmin: false,
          isLoggedIn: false,
          userInfo: null,
          message: 'غير مسجل دخول'
        });
        onRoleCheck?.(false, false);
        return;
      }

      // جرب admin API للتحقق من الصلاحيات
      try {
        const adminTest = await ApiService.getDashboardStats();
        
        if (adminTest.success) {
          setRoleStatus({
            isAdmin: true,
            isLoggedIn: true,
            userInfo: null,
            message: 'صلاحيات إدارية مفعلة ✅'
          });
          onRoleCheck?.(true, true);
        } else {
          throw new Error('Admin access failed');
        }
      } catch (adminErr: any) {
        if (adminErr.message?.includes('User does not have the right roles')) {
          // المستخدم مسجل دخول لكن ليس admin
          setRoleStatus({
            isAdmin: false,
            isLoggedIn: true,
            userInfo: null,
            message: 'مسجل دخول كعميل - صلاحيات محدودة'
          });
          onRoleCheck?.(false, true);
        } else if (adminErr.message?.includes('Unauthenticated')) {
          // Token منتهي الصلاحية
          localStorage.removeItem('admin_token');
          localStorage.removeItem('auth_token');
          setRoleStatus({
            isAdmin: false,
            isLoggedIn: false,
            userInfo: null,
            message: 'انتهت صلاحية الجلسة'
          });
          onRoleCheck?.(false, false);
        } else {
          throw adminErr;
        }
      }
    } catch (error) {
      console.error('Role check failed:', error);
      setRoleStatus({
        isAdmin: false,
        isLoggedIn: false,
        userInfo: null,
        message: 'خطأ في التحقق من الصلاحيات'
      });
      onRoleCheck?.(false, false);
    }
  };

  return (
    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <div className={`w-3 h-3 rounded-full ${
          roleStatus.isAdmin 
            ? 'bg-green-500' 
            : roleStatus.isLoggedIn 
              ? 'bg-yellow-500' 
              : 'bg-red-500'
        }`} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {roleStatus.message}
        </span>
        <button 
          onClick={checkUserRole}
          className="text-xs text-blue-500 hover:text-blue-600 underline"
        >
          إعادة فحص
        </button>
      </div>
      
      {!roleStatus.isAdmin && roleStatus.isLoggedIn && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          💡 للحصول على صلاحيات إدارية كاملة، تحتاج إلى تحديث دورك في قاعدة بيانات Laravel
        </div>
      )}
    </div>
  );
} 