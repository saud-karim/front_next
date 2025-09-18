'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';

interface SocialLink {
  id?: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  order_index: number;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function SocialLinksTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [saving, setSaving] = useState(false);
  const [newLink, setNewLink] = useState<Partial<SocialLink>>({
    platform: '',
    url: '',
    icon: '',
    is_active: true,
    order_index: 0
  });

  // تحميل الروابط الاجتماعية
  const loadSocialLinks = async () => {
    try {
      setLoading(true);
      console.log('🔗 Loading real Social Links data from API...');
      const response = await ApiService.getSocialLinks();
      
      if (response.success && response.data) {
        setSocialLinks(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل الروابط الاجتماعية';
      toast.error('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // إضافة رابط جديد
  const handleAddLink = async () => {
    try {
      setSaving(true);
      const response = await ApiService.createSocialLink(newLink as any);
      
      if (response.success && response.data) {
        setSocialLinks(prev => [...prev, response.data]);
        setNewLink({ platform: '', url: '', icon: '', is_active: true, order_index: 0 });
        setShowAddForm(false);
        toast.success(
          language === 'ar' ? 'نجح الإضافة' : 'Success',
          language === 'ar' ? 'تم إضافة الرابط بنجاح' : 'Social link added successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة الرابط';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث رابط
  const handleUpdateLink = async (link: SocialLink) => {
    try {
      setSaving(true);
      const response = await ApiService.updateSocialLink(link.id!, link);
      
      if (response.success && response.data) {
        setSocialLinks(prev => prev.map(l => l.id === link.id ? response.data : l));
        setEditingLink(null);
        toast.success(
          language === 'ar' ? 'نجح التحديث' : 'Success',
          language === 'ar' ? 'تم تحديث الرابط بنجاح' : 'Social link updated successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث الرابط';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف رابط
  const handleDeleteLink = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الرابط؟' : 'Are you sure you want to delete this link?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await ApiService.deleteSocialLink(id);
      
      if (response.success) {
        setSocialLinks(prev => prev.filter(l => l.id !== id));
        toast.success(
          language === 'ar' ? 'نجح الحذف' : 'Success',
          language === 'ar' ? 'تم حذف الرابط بنجاح' : 'Social link deleted successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف الرابط';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSocialLinks();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'الروابط الاجتماعية' : 'Social Links'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {language === 'ar' ? 'إدارة روابط التواصل الاجتماعي' : 'Manage social media links'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + {language === 'ar' ? 'إضافة رابط' : 'Add Link'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {language === 'ar' ? 'إضافة رابط جديد' : 'Add New Link'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المنصة' : 'Platform'}
              </label>
              <input
                type="text"
                value={newLink.platform || ''}
                onChange={(e) => setNewLink(prev => ({ ...prev, platform: e.target.value }))}
                placeholder={t('placeholder.social.platforms')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الرابط' : 'URL'}
              </label>
              <input
                type="url"
                value={newLink.url || ''}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                placeholder={t('placeholder.url')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الأيقونة' : 'Icon'}
              </label>
              <input
                type="text"
                value={newLink.icon || ''}
                onChange={(e) => setNewLink(prev => ({ ...prev, icon: e.target.value }))}
                placeholder={t('placeholder.icon')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الترتيب' : 'Order'}
              </label>
              <input
                type="number"
                value={newLink.order_index || 0}
                onChange={(e) => setNewLink(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="is_active"
              checked={newLink.is_active || false}
              onChange={(e) => setNewLink(prev => ({ ...prev, is_active: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              {language === 'ar' ? 'نشط' : 'Active'}
            </label>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleAddLink}
              disabled={saving || !newLink.platform || !newLink.url}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      )}

      {/* Social Links List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {language === 'ar' ? 'الروابط الحالية' : 'Current Links'} ({socialLinks.length})
          </h3>
        </div>
        
        {socialLinks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {language === 'ar' ? 'لا توجد روابط اجتماعية' : 'No social links found'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {socialLinks.map((link) => (
              <div key={link.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{link.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{link.platform}</h4>
                    <p className="text-sm text-gray-600">{link.url}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        link.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {link.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {language === 'ar' ? 'ترتيب:' : 'Order:'} {link.order_index}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingLink(link)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id!)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    {language === 'ar' ? 'حذف' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {language === 'ar' ? 'تعديل الرابط' : 'Edit Link'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المنصة' : 'Platform'}
                </label>
                <input
                  type="text"
                  value={editingLink.platform}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, platform: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الرابط' : 'URL'}
                </label>
                <input
                  type="url"
                  value={editingLink.url}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, url: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الأيقونة' : 'Icon'}
                </label>
                <input
                  type="text"
                  value={editingLink.icon}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingLink.is_active}
                  onChange={(e) => setEditingLink(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  {language === 'ar' ? 'نشط' : 'Active'}
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingLink(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleUpdateLink(editingLink)}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {saving ? (language === 'ar' ? 'جاري التحديث...' : 'Updating...') : (language === 'ar' ? 'تحديث' : 'Update')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 