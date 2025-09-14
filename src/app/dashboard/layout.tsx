'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, isAuthenticated } = useAuth();
  const { error } = useToast();
  const { t } = useLanguage();
  const router = useRouter();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // Check authentication and admin role - STRICT ACCESS CONTROL
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                🔐 مطلوب تسجيل الدخول
              </h1>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold mb-2">
                  يجب تسجيل الدخول كمدير للوصول لهذا القسم
                </p>
              </div>
              <button
                onClick={() => router.push('/auth')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                🔐 تسجيل الدخول
              </button>
              <div className="text-sm text-gray-600 mt-4">
                <p>📧 للمدير: admin@construction.com</p>
                <p>🔑 كلمة المرور: admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-red-600 mb-4">
                🚫 وصول مرفوض
              </h1>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-semibold mb-2">
                  لوحة التحكم مخصصة للمدراء فقط
                </p>
                <p className="text-red-700 text-sm">
                  دورك الحالي: {user.role === 'customer' ? 'عميل' : user.role} - تحتاج دور "مدير"
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  مرحباً {user.name}، ليس لديك صلاحية للوصول لهذا القسم
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🏠 الذهاب للصفحة الرئيسية
                  </button>
                  <button
                    onClick={() => router.push('/products')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    🛍️ تصفح المنتجات
                  </button>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    💡 لتصبح مديراً، اتصل بمدير النظام لتحديث صلاحياتك في قاعدة البيانات
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1">
          <main className="p-3 lg:p-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 