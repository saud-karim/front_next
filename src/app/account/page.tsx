'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User } from '../types/api';
import { ApiService } from '../services/api';

export default function AccountPage() {
  const { user, logout, loading, updateUser } = useAuth();
  const { t } = useLanguage();
  const { success, error } = useToast();
  const [profileData, setProfileData] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    company: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        company: user.company || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  const handleEditStart = () => {
    setIsEditMode(true);
    setFormErrors({});
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
    setFormErrors({});
    // Reset form data to original values
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        company: user.company || ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = t('profile.validation.name.required') || 'اسم المستخدم مطلوب';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = t('profile.validation.phone.invalid') || 'رقم الهاتف غير صحيح';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSaving(true);
      
      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        company: formData.company.trim() || undefined
      };
      
      const response = await ApiService.updateUserProfile(updateData);
      
      if (response.success && response.data) {
        // Update local state
        setProfileData(response.data);
        setIsEditMode(false);
        
        // Update AuthContext user data if updateUser exists
        if (updateUser) {
          updateUser(response.data);
        }
        
        success(
          t('profile.update.success.title') || 'تم التحديث', 
          t('profile.update.success.message') || 'تم تحديث الملف الشخصي بنجاح'
        );
      } else {
        throw new Error(response.message || 'فشل في تحديث الملف الشخصي');
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      error(
        t('profile.update.error.title') || 'خطأ في التحديث',
        err.message || t('profile.update.error.message') || 'فشل في تحديث الملف الشخصي'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('common.loading')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.login.required')}</h2>
            <p className="text-gray-600 mb-6">{t('auth.login.required.message')}</p>
            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="block w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('auth.login.title')}
              </Link>
              <Link
                href="/auth/register"
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t('auth.register.title')}
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('account.title')}</h1>
          <p className="text-gray-600">
            {t('account.welcome').replace('{name}', user.name)}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center px-3 py-2 text-red-600 bg-red-50 rounded-lg font-medium"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t('account.profile.title')}
                </Link>
                
                <Link
                  href="/account/orders"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                  </svg>
                  {t('account.orders.title')}
                </Link>
                
                <Link
                  href="/wishlist"
                  className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t('wishlist.title')}
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-left"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {t('account.logout')}
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{t('account.profile.title')}</h2>
                {isEditMode ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleEditCancel}
                      disabled={isSaving}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {t('profile.cancel')}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('profile.saving') || 'جاري الحفظ...'}
                        </>
                      ) : (
                        t('profile.save')
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEditStart}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {t('account.profile.edit')}
                  </button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.name')} *
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={t('profile.name')}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData?.name}</p>
                  )}
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                
                {/* Email Field (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.email')}
                  </label>
                  <p className="text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">{profileData?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                </div>
                
                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.phone')}
                  </label>
                  {isEditMode ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+20 123 456 7890"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {profileData?.phone || t('common.not.specified') || 'غير محدد'}
                    </p>
                  )}
                  {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                </div>
                
                {/* Company Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.company')}
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder={t('profile.company')}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {profileData?.company || t('common.not.specified') || 'غير محدد'}
                    </p>
                  )}
                </div>
                
                {/* Address Field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.address')}
                  </label>
                  {isEditMode ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder={t('profile.address')}
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                      {profileData?.address || t('common.not.specified') || 'غير محدد'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  href="/account/orders"
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">{t('account.orders.view')}</h4>
                      <p className="text-gray-600 text-sm">{t('orders.subtitle')}</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/wishlist"
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">{t('wishlist.title')}</h4>
                      <p className="text-gray-600 text-sm">عرض منتجاتك المفضلة</p>
                    </div>
                  </div>
                </Link>

                <Link
                  href="/products"
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-gray-900">{t('orders.browse.products')}</h4>
                      <p className="text-gray-600 text-sm">اكتشف منتجات جديدة</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 