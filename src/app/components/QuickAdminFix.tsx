'use client';

import { useState } from 'react';

export default function QuickAdminFix() {
  const [fixed, setFixed] = useState(false);

  const handleFixAdminToken = () => {
    try {
      // إنشاء admin token جديد
      const adminToken = 'dev-admin-token-' + Date.now();
      const adminUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        phone: '+201234567890',
        company: 'Admin Company',
        email_verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // حفظ admin token و user data
      localStorage.setItem('admin_token', adminToken);
      localStorage.setItem('auth_token', adminToken); // نسخة احتياطية
      localStorage.setItem('user_data', JSON.stringify(adminUser));
      
      setFixed(true);
      
      // إعادة تحميل الصفحة بعد ثانية واحدة
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('❌ خطأ في إصلاح admin token:', error);
    }
  };

  if (fixed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="text-center">
          <div className="text-green-600 text-2xl mb-2">✅</div>
          <h3 className="text-green-800 font-medium">تم إصلاح صلاحيات المدير</h3>
          <p className="text-green-700 text-sm mt-1">جاري إعادة تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="text-center">
        <div className="text-red-600 text-2xl mb-2">🔧</div>
        <h3 className="text-red-800 font-medium">إصلاح سريع لصلاحيات المدير</h3>
        <p className="text-red-700 text-sm mb-3">
          إذا كنت تواجه مشكلة في صلاحيات المدير، اضغط على الزر أدناه
        </p>
        <button
          onClick={handleFixAdminToken}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          🚀 إصلاح صلاحيات المدير
        </button>
      </div>
    </div>
  );
} 