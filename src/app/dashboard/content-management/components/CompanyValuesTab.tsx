'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';
import PreviewModal from './PreviewModal';
import CompanyValuesPreview from './previews/CompanyValuesPreview';

interface CompanyValue {
  id?: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// نظام mapping بين الرموز القصيرة (للحفظ في قاعدة البيانات) والفونت أوسوم (للعرض)
const ICON_MAPPING = {
  'AW': 'fas fa-award',           // الجودة
  'LB': 'fas fa-lightbulb',       // الابتكار
  'HS': 'fas fa-handshake',       // الشراكة
  'SH': 'fas fa-shield-alt',      // الموثوقية
  'US': 'fas fa-users',           // العمل الجماعي
  'ST': 'fas fa-star',            // التميز
  'HE': 'fas fa-heart',           // العاطفة
  'TA': 'fas fa-target',          // الهدف
  'RO': 'fas fa-rocket',          // النمو
  'CO': 'fas fa-compass',         // التوجيه
  'EY': 'fas fa-eye',             // الرؤية
  'CH': 'fas fa-chart-line',      // التطوير
  'GL': 'fas fa-globe',           // العالمية
  'CU': 'fas fa-question'         // مخصص
};

// دالة للحصول على فونت أوسوم من الرمز القصير
const getFontAwesomeIcon = (shortCode: string): string => {
  return ICON_MAPPING[shortCode as keyof typeof ICON_MAPPING] || 'fas fa-question';
};

// دالة للحصول على الرمز القصير من فونت أوسوم (للتوافق مع البيانات القديمة)
const getShortCodeFromFontAwesome = (fontAwesome: string): string => {
  const entry = Object.entries(ICON_MAPPING).find(([, fa]) => fa === fontAwesome);
  return entry ? entry[0] : 'CU'; // افتراضي
};

const ICON_OPTIONS = Object.keys(ICON_MAPPING);

const DEFAULT_VALUE: Omit<CompanyValue, 'id'> = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  icon: 'AW', // رمز قصير افتراضي
  order: 1,
  is_active: true
};

export default function CompanyValuesTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [values, setValues] = useState<CompanyValue[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Omit<CompanyValue, 'id'>>(DEFAULT_VALUE);

  // تحميل قيم الشركة
  const loadCompanyValues = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCompanyValues();
      
      if (response.data && Array.isArray(response.data)) {
        // تحويل FontAwesome strings إلى short codes للتوافق مع النظام الجديد
        const normalizedData = response.data.map(value => ({
          ...value,
          icon: value.icon.startsWith('fas ') ? getShortCodeFromFontAwesome(value.icon) : value.icon
        }));
        setValues(normalizedData);
      } else {
        setValues([]);
      }
    } catch (error) {
      console.error('Error loading company values:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل قيم الشركة';
      toast.error('خطأ', errorMessage);
      setValues([]);
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title_ar.trim()) {
      newErrors.title_ar = language === 'ar' ? 'العنوان باللغة العربية مطلوب' : 'Arabic title is required';
    }
    if (!formData.title_en.trim()) {
      newErrors.title_en = language === 'ar' ? 'العنوان باللغة الإنجليزية مطلوب' : 'English title is required';
    }
    if (!formData.description_ar.trim()) {
      newErrors.description_ar = language === 'ar' ? 'الوصف باللغة العربية مطلوب' : 'Arabic description is required';
    }
    if (!formData.description_en.trim()) {
      newErrors.description_en = language === 'ar' ? 'الوصف باللغة الإنجليزية مطلوب' : 'English description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إنشاء قيمة جديدة
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await ApiService.createCompanyValue(formData);
      
      toast.success('نجح', language === 'ar' ? 'تم إضافة القيمة بنجاح' : 'Value added successfully');
      setShowForm(false);
      setFormData(DEFAULT_VALUE);
      await loadCompanyValues();
    } catch (error) {
      console.error('Error creating value:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة القيمة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث قيمة
  const handleUpdate = async () => {
    if (!validateForm() || !editingValue) return;

    try {
      setSaving(true);
      await ApiService.updateCompanyValue(editingValue.id!, formData);
      
      toast.success('نجح', language === 'ar' ? 'تم تحديث القيمة بنجاح' : 'Value updated successfully');
      setShowForm(false);
        setEditingValue(null);
      setFormData(DEFAULT_VALUE);
      await loadCompanyValues();
    } catch (error) {
      console.error('Error updating value:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث القيمة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف قيمة
  const handleDelete = async (value: CompanyValue) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه القيمة؟' : 'Are you sure you want to delete this value?')) {
      return;
    }

    try {
      setSaving(true);
      await ApiService.deleteCompanyValue(value.id!);
      
      toast.success('نجح', language === 'ar' ? 'تم حذف القيمة بنجاح' : 'Value deleted successfully');
      await loadCompanyValues();
    } catch (error) {
      console.error('Error deleting value:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف القيمة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // بدء التعديل
  const startEdit = (value: CompanyValue) => {
    setEditingValue(value);
    // التأكد من أن الأيقونة short code وليس FontAwesome string
    const normalizedValue = {
      ...value,
      icon: value.icon.startsWith('fas ') ? getShortCodeFromFontAwesome(value.icon) : value.icon
    };
    setFormData({ 
      title_ar: normalizedValue.title_ar,
      title_en: normalizedValue.title_en,
      description_ar: normalizedValue.description_ar,
      description_en: normalizedValue.description_en,
      icon: normalizedValue.icon,
      order: normalizedValue.order,
      is_active: normalizedValue.is_active
    });
    setShowForm(true);
  };

  // فتح نموذج الإضافة
  const openAddForm = () => {
    setEditingValue(null);
    setFormData({
      ...DEFAULT_VALUE,
      order: values.length + 1
    });
    setShowForm(true);
  };

  // إلغاء النموذج
  const cancelForm = () => {
    setShowForm(false);
    setEditingValue(null);
    setFormData(DEFAULT_VALUE);
    setErrors({});
  };

  // تحديث حقل
  const updateField = (field: keyof Omit<CompanyValue, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند تحديث الحقل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <span>👁️</span>
            <span>{language === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}</span>
          </button>
        <button
            onClick={openAddForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + {language === 'ar' ? 'إضافة قيمة' : 'Add Value'}
        </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {editingValue ? 
              (language === 'ar' ? 'تعديل القيمة' : 'Edit Value') : 
              (language === 'ar' ? 'إضافة قيمة جديدة' : 'Add New Value')
            }
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* العنوان */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'} *
              </label>
              <input
                type="text"
                value={formData.title_ar}
                onChange={(e) => updateField('title_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'الجودة' : 'Quality'}
              />
              {errors.title_ar && <p className="text-red-500 text-xs mt-1">{errors.title_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
              </label>
              <input
                type="text"
                value={formData.title_en}
                onChange={(e) => updateField('title_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'Quality' : 'Quality'}
              />
              {errors.title_en && <p className="text-red-500 text-xs mt-1">{errors.title_en}</p>}
            </div>

            {/* الأيقونة */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الأيقونة' : 'Icon'}
              </label>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {ICON_OPTIONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => updateField('icon', icon)}
                    className={`p-3 rounded-md border-2 hover:scale-105 transition-all ${
                      formData.icon === icon 
                        ? 'border-blue-500 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:border-gray-400 text-gray-600'
                    }`}
                    title={getFontAwesomeIcon(icon)}
                  >
                    <i className={`${getFontAwesomeIcon(icon)} text-xl`}></i>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <i className={`${getFontAwesomeIcon(formData.icon)} text-lg`}></i>
                  <span className="text-sm text-gray-600">{formData.icon} → {getFontAwesomeIcon(formData.icon)}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {language === 'ar' ? 'الأيقونة المحددة' : 'Selected icon'}
                </span>
              </div>
            </div>

            {/* الترتيب والحالة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الترتيب' : 'Order'}
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => updateField('order', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الحالة' : 'Status'}
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => updateField('is_active', true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border-2 transition-all ${
                    formData.is_active 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${formData.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span>{language === 'ar' ? 'نشط' : 'Active'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateField('is_active', false)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border-2 transition-all ${
                    !formData.is_active 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-300 hover:border-red-400'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${!formData.is_active ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                  <span>{language === 'ar' ? 'غير نشط' : 'Inactive'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* الوصف */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'} *
              </label>
              <textarea
                value={formData.description_ar}
                onChange={(e) => updateField('description_ar', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'نضمن أعلى معايير الجودة في جميع منتجاتنا...' : 'We guarantee the highest quality...'}
              />
              {errors.description_ar && <p className="text-red-500 text-xs mt-1">{errors.description_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'} *
              </label>
              <textarea
                value={formData.description_en}
                onChange={(e) => updateField('description_en', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'We guarantee the highest quality...' : 'We guarantee the highest quality...'}
              />
              {errors.description_en && <p className="text-red-500 text-xs mt-1">{errors.description_en}</p>}
            </div>
          </div>

          {/* أزرار النموذج */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={cancelForm}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={editingValue ? handleUpdate : handleCreate}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </div>
              ) : (
                editingValue 
                  ? (language === 'ar' ? 'تحديث القيمة' : 'Update Value')
                  : (language === 'ar' ? 'إضافة القيمة' : 'Add Value')
              )}
            </button>
          </div>
        </div>
      )}

      {/* قائمة قيم الشركة */}
      <div className="bg-white rounded-lg border">
        {values.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">💎</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'لا توجد قيم للشركة' : 'No Company Values'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'ar' ? 'ابدأ بإضافة أول قيمة للشركة' : 'Start by adding your first company value'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {values.sort((a, b) => a.order - b.order).map((value) => (
              <div key={value.id} className={`border rounded-lg px-8 py-6 hover:shadow-lg transition-all duration-200 bg-white ${
                value.is_active 
                  ? 'border-gray-200 hover:border-blue-300' 
                  : 'border-red-200 bg-red-50/30 opacity-75'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                                        <div className="relative w-12 h-12 overflow-visible">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-sm">
                        <i className={`${getFontAwesomeIcon(value.icon)} text-lg`}></i>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                        {value.order}
      </div>
        </div>
              <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {language === 'ar' ? value.title_ar : value.title_en}
            </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {(language === 'ar' ? value.description_ar : value.description_en).substring(0, 60)}
                        {(language === 'ar' ? value.description_ar : value.description_en).length > 60 && '...'}
                      </p>
              </div>
            </div>

                {/* حالة القيمة */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    value.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {value.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                  <span className="text-xs text-gray-500">#{value.order}</span>
                </div>

                {/* أزرار التحكم - منفصلة في أسفل الكارد */}
                <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-center gap-2 rounded-b-lg mt-3">
              <button
                      onClick={() => startEdit(value)}
                      className="flex-1 max-w-24 flex items-center justify-center px-2 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm font-medium"
                      title={language === 'ar' ? 'تعديل' : 'Edit'}
              >
                      <span>✏️</span>
                      <span className="ml-1 hidden sm:inline">{language === 'ar' ? 'تعديل' : 'Edit'}</span>
              </button>
              <button
                      onClick={() => handleDelete(value)}
                      className="flex-1 max-w-24 flex items-center justify-center px-2 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-medium"
                      title={language === 'ar' ? 'حذف' : 'Delete'}
                  >
                      <span>🗑️</span>
                      <span className="ml-1 hidden sm:inline">{language === 'ar' ? 'حذف' : 'Delete'}</span>
              </button>
            </div>
          </div>
            ))}
        </div>
      )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={language === 'ar' ? 'معاينة قيم الشركة' : 'Company Values Preview'}
      >
        <CompanyValuesPreview data={values} />
      </PreviewModal>
    </div>
  );
} 