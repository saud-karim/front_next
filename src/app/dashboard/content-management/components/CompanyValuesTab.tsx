'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';

interface CompanyValue {
  id?: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  order_index: number;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function CompanyValuesTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [values, setValues] = useState<CompanyValue[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null);
  const [saving, setSaving] = useState(false);
  const [newValue, setNewValue] = useState<Partial<CompanyValue>>({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    icon: '',
    order_index: 0
  });

  // تحميل قيم الشركة
  const loadCompanyValues = async () => {
    try {
      setLoading(true);
      console.log('💎 Loading real Company Values data from API...');
      const response = await ApiService.getCompanyValues();
      
      if (response.success && response.data) {
        setValues(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل قيم الشركة';
      toast.error('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // إضافة قيمة جديدة
  const handleAddValue = async () => {
    try {
      setSaving(true);
      const response = await ApiService.createCompanyValue(newValue as any);
      
      if (response.success && response.data) {
        setValues(prev => [...prev, response.data]);
        setNewValue({
          title_ar: '',
          title_en: '',
          description_ar: '',
          description_en: '',
          icon: '',
          order_index: 0
        });
        setShowAddForm(false);
        toast.success(
          language === 'ar' ? 'نجح الإضافة' : 'Success',
          language === 'ar' ? 'تم إضافة القيمة بنجاح' : 'Company value added successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة القيمة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث قيمة
  const handleUpdateValue = async (value: CompanyValue) => {
    try {
      setSaving(true);
      const response = await ApiService.updateCompanyValue(value.id!, value);
      
      if (response.success && response.data) {
        setValues(prev => prev.map(v => v.id === value.id ? response.data : v));
        setEditingValue(null);
        toast.success(
          language === 'ar' ? 'نجح التحديث' : 'Success',
          language === 'ar' ? 'تم تحديث القيمة بنجاح' : 'Company value updated successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث القيمة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف قيمة
  const handleDeleteValue = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه القيمة؟' : 'Are you sure you want to delete this value?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await ApiService.deleteCompanyValue(id);
      
      if (response.success) {
        setValues(prev => prev.filter(v => v.id !== id));
        toast.success(
          language === 'ar' ? 'نجح الحذف' : 'Success',
          language === 'ar' ? 'تم حذف القيمة بنجاح' : 'Company value deleted successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف القيمة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadCompanyValues();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'قيم الشركة' : 'Company Values'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {language === 'ar' ? 'إدارة قيم ومبادئ الشركة' : 'Manage company values and principles'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + {language === 'ar' ? 'إضافة قيمة' : 'Add Value'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {language === 'ar' ? 'إضافة قيمة جديدة' : 'Add New Value'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
              </label>
              <input
                type="text"
                value={newValue.title_ar || ''}
                onChange={(e) => setNewValue(prev => ({ ...prev, title_ar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العنوان (انجليزي)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={newValue.title_en || ''}
                onChange={(e) => setNewValue(prev => ({ ...prev, title_en: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
              </label>
              <textarea
                value={newValue.description_ar || ''}
                onChange={(e) => setNewValue(prev => ({ ...prev, description_ar: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)'}
              </label>
              <textarea
                value={newValue.description_en || ''}
                onChange={(e) => setNewValue(prev => ({ ...prev, description_en: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الأيقونة' : 'Icon'}
              </label>
              <input
                type="text"
                value={newValue.icon || ''}
                onChange={(e) => setNewValue(prev => ({ ...prev, icon: e.target.value }))}
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
                value={newValue.order_index || 0}
                onChange={(e) => setNewValue(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={handleAddValue}
              disabled={saving || !newValue.title_ar || !newValue.title_en}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      )}

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value) => (
          <div key={value.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{value.icon}</div>
              <span className="text-xs text-gray-500">#{value.order_index}</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'ar' ? value.title_ar : value.title_en}
            </h4>
            <p className="text-gray-600 text-sm mb-4 line-clamp-4">
              {language === 'ar' ? value.description_ar : value.description_en}
            </p>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setEditingValue(value)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
              >
                {language === 'ar' ? 'تعديل' : 'Edit'}
              </button>
              <button
                onClick={() => handleDeleteValue(value.id!)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
              >
                {language === 'ar' ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {values.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">💎</div>
          <p>{language === 'ar' ? 'لا توجد قيم للشركة' : 'No company values found'}</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingValue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {language === 'ar' ? 'تعديل القيمة' : 'Edit Value'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingValue.title_ar}
                  onChange={(e) => setEditingValue(prev => prev ? { ...prev, title_ar: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (انجليزي)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={editingValue.title_en}
                  onChange={(e) => setEditingValue(prev => prev ? { ...prev, title_en: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                </label>
                <textarea
                  value={editingValue.description_ar}
                  onChange={(e) => setEditingValue(prev => prev ? { ...prev, description_ar: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)'}
                </label>
                <textarea
                  value={editingValue.description_en}
                  onChange={(e) => setEditingValue(prev => prev ? { ...prev, description_en: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الأيقونة' : 'Icon'}
                </label>
                <input
                  type="text"
                  value={editingValue.icon}
                  onChange={(e) => setEditingValue(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الترتيب' : 'Order'}
                </label>
                <input
                  type="number"
                  value={editingValue.order_index}
                  onChange={(e) => setEditingValue(prev => prev ? { ...prev, order_index: parseInt(e.target.value) } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingValue(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleUpdateValue(editingValue)}
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