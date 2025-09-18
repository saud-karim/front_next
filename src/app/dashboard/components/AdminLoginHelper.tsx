'use client';

import { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApiService } from '../../services/api';

interface AdminLoginHelperProps {
  onLoginSuccess?: () => void;
}

export default function AdminLoginHelper({ onLoginSuccess }: AdminLoginHelperProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const { success, error } = useToast();
  const { t } = useLanguage();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      error('Error', t('admin.login.error.fields'));
      return;
    }

    setLoading(true);
    
    try {
      const response = await ApiService.login(email, password);
      
      if (response.success && response.data) {
        // تحقق من أن المستخدم admin
        if (response.data.user.role === 'admin') {
          // حفظ admin token
          localStorage.setItem('admin_token', response.data.token);
          localStorage.setItem('auth_token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          success('Success', t('admin.login.success'));
          setShowHelper(false);
          setEmail('');
          setPassword('');
          
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        } else {
          error('Error', t('admin.login.error.not_admin'));
        }
      } else {
        error('Error', response.message || t('admin.login.error.failed'));
      }
    } catch (err) {
      console.error('❌ Admin login error:', err);
      error('Error', t('admin.login.error.connection'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdminAccess = () => {
    // للاختبار السريع - إنشاء token وهمي
    const mockAdminUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    };
    
    const mockToken = 'admin-test-token-' + Date.now();
    
    localStorage.setItem('admin_token', mockToken);
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockAdminUser));
    
    success('Success', 'تم تفعيل وضع المدير للاختبار');
    setShowHelper(false);
    
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-blue-600 text-xl mr-3">🔐</div>
          <div>
            <h3 className="text-blue-800 font-medium">تسجيل دخول المدير</h3>
            <p className="text-blue-700 text-sm">{t('admin.dashboard.access.required')}</p>
          </div>
        </div>
        <button
          onClick={() => setShowHelper(!showHelper)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          {showHelper ? 'إخفاء' : 'تسجيل دخول'}
        </button>
      </div>

      {showHelper && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholder.admin.email')}
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
              >
                {loading ? t('admin.login.loading') : t('admin.login.button')}
              </button>
              
              <button
                type="button"
                onClick={handleQuickAdminAccess}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
{t('admin.login.test.mode')}
              </button>
            </div>
          </form>
          
          <div className="mt-3 text-xs text-gray-600 space-y-1">
            <p>💡 <strong>{t('admin.login.help.admin').split(':')[0]}:</strong> {t('admin.login.help.admin').split(':')[1]}</p>
            <p>🚀 <strong>{t('admin.login.help.dev').split(':')[0]}:</strong> {t('admin.login.help.dev').split(':')[1]}</p>
            <p>⚡ <strong>{t('admin.login.help.test').split(':')[0]}:</strong> {t('admin.login.help.test').split(':')[1]}</p>
          </div>
        </div>
      )}
    </div>
  );
} 