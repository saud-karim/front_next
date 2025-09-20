'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';
import PreviewModal from './PreviewModal';
import MilestonesPreview from './previews/MilestonesPreview';

interface Milestone {
  id?: number;
  year: string;
  event_ar: string;
  event_en: string;
  description_ar: string;
  description_en: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_MILESTONE: Omit<Milestone, 'id'> = {
  year: new Date().getFullYear().toString(),
  event_ar: '',
  event_en: '',
  description_ar: '',
  description_en: '',
  order: 1,
  is_active: true
};

export default function MilestonesTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Omit<Milestone, 'id'>>(DEFAULT_MILESTONE);

  // تحميل معالم الشركة
  const loadMilestones = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCompanyMilestones();
      
      if (response.data && Array.isArray(response.data)) {
        setMilestones(response.data);
      } else {
        setMilestones([]);
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل معالم الشركة';
      toast.error('خطأ', errorMessage);
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.year.trim()) {
      newErrors.year = language === 'ar' ? 'السنة مطلوبة' : 'Year is required';
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = language === 'ar' ? 'السنة يجب أن تكون 4 أرقام' : 'Year must be 4 digits';
    }
    
    if (!formData.event_ar.trim()) {
      newErrors.event_ar = language === 'ar' ? 'العنوان باللغة العربية مطلوب' : 'Arabic title is required';
    }
    if (!formData.event_en.trim()) {
      newErrors.event_en = language === 'ar' ? 'العنوان باللغة الإنجليزية مطلوب' : 'English title is required';
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

  // إنشاء معلم جديد
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await ApiService.createMilestone(formData);
      
      toast.success('نجح', language === 'ar' ? 'تم إضافة المعلم بنجاح' : 'Milestone added successfully');
      setShowForm(false);
      setFormData(DEFAULT_MILESTONE);
      await loadMilestones();
    } catch (error) {
      console.error('Error creating milestone:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة المعلم';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث معلم
  const handleUpdate = async () => {
    if (!validateForm() || !editingMilestone) return;

    try {
      setSaving(true);
      await ApiService.updateMilestone(editingMilestone.id!, formData);
      
      toast.success('نجح', language === 'ar' ? 'تم تحديث المعلم بنجاح' : 'Milestone updated successfully');
      setShowForm(false);
        setEditingMilestone(null);
      setFormData(DEFAULT_MILESTONE);
      await loadMilestones();
    } catch (error) {
      console.error('Error updating milestone:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث المعلم';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف معلم
  const handleDelete = async (milestone: Milestone) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المعلم؟' : 'Are you sure you want to delete this milestone?')) {
      return;
    }

    try {
      setSaving(true);
      await ApiService.deleteMilestone(milestone.id!);
      
      toast.success('نجح', language === 'ar' ? 'تم حذف المعلم بنجاح' : 'Milestone deleted successfully');
      await loadMilestones();
    } catch (error) {
      console.error('Error deleting milestone:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف المعلم';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // بدء التعديل
  const startEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setFormData({ 
      year: milestone.year,
      event_ar: milestone.event_ar,
      event_en: milestone.event_en,
      description_ar: milestone.description_ar,
      description_en: milestone.description_en,
      order: milestone.order,
      is_active: milestone.is_active
    });
    setShowForm(true);
  };

  // فتح نموذج الإضافة
  const openAddForm = () => {
    setEditingMilestone(null);
    setFormData({
      ...DEFAULT_MILESTONE,
      order: milestones.length + 1
    });
    setShowForm(true);
  };

  // إلغاء النموذج
  const cancelForm = () => {
    setShowForm(false);
    setEditingMilestone(null);
    setFormData(DEFAULT_MILESTONE);
    setErrors({});
  };

  // تحديث حقل
  const updateField = (field: keyof Omit<Milestone, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند تحديث الحقل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'معالم الشركة' : 'Company Milestones'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {language === 'ar' ? 'إدارة إنجازات ومعالم تاريخ الشركة' : 'Manage company achievements and historical milestones'}
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
            + {language === 'ar' ? 'إضافة معلم' : 'Add Milestone'}
        </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {editingMilestone ? 
              (language === 'ar' ? 'تعديل المعلم' : 'Edit Milestone') : 
              (language === 'ar' ? 'إضافة معلم جديد' : 'Add New Milestone')
            }
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* السنة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'السنة' : 'Year'} *
              </label>
              <input
                type="text"
                maxLength={4}
                value={formData.year}
                onChange={(e) => updateField('year', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.year ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="2024"
              />
              {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
            </div>

            {/* الترتيب */}
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

            {/* العنوان */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'} *
              </label>
              <input
                type="text"
                value={formData.event_ar}
                onChange={(e) => updateField('event_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.event_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'تأسيس الشركة' : 'Company Establishment'}
              />
              {errors.event_ar && <p className="text-red-500 text-xs mt-1">{errors.event_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'} *
              </label>
              <input
                type="text"
                value={formData.event_en}
                onChange={(e) => updateField('event_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.event_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'Company Establishment' : 'Company Establishment'}
              />
              {errors.event_en && <p className="text-red-500 text-xs mt-1">{errors.event_en}</p>}
            </div>

            {/* الحالة */}
            <div className="md:col-span-2">
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
                placeholder={language === 'ar' ? 'بداية رحلتنا في مجال أدوات ومواد البناء...' : 'The beginning of our journey...'}
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
                placeholder={language === 'ar' ? 'The beginning of our journey...' : 'The beginning of our journey...'}
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
              onClick={editingMilestone ? handleUpdate : handleCreate}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </div>
              ) : (
                editingMilestone 
                  ? (language === 'ar' ? 'تحديث المعلم' : 'Update Milestone')
                  : (language === 'ar' ? 'إضافة المعلم' : 'Add Milestone')
              )}
            </button>
          </div>
        </div>
      )}

      {/* قائمة معالم الشركة */}
      <div className="bg-white rounded-lg border">
        {milestones.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'لا توجد معالم للشركة' : 'No Company Milestones'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'ar' ? 'ابدأ بإضافة أول معلم تاريخي للشركة' : 'Start by adding your first company milestone'}
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-6">
              {milestones.sort((a, b) => a.order - b.order).map((milestone, index) => (
                <div key={milestone.id} className={`border rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-white ${
                  milestone.is_active 
                    ? 'border-gray-200 hover:border-blue-300' 
                    : 'border-red-200 bg-red-50/30 opacity-75'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {milestone.year}
                        </div>
                        {index < milestones.length - 1 && (
                          <div className="w-0.5 h-16 bg-gradient-to-b from-blue-300 to-transparent mt-2"></div>
                        )}
                      </div>
              
              {/* Content */}
                  <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {language === 'ar' ? milestone.event_ar : milestone.event_en}
                          </h3>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            #{milestone.order}
                          </span>
                    </div>
                        <p className="text-gray-600 leading-relaxed">
                      {language === 'ar' ? milestone.description_ar : milestone.description_en}
                    </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            milestone.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {milestone.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                          </span>
                          <div className="flex space-x-2">
                    <button
                              onClick={() => startEdit(milestone)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title={language === 'ar' ? 'تعديل' : 'Edit'}
                    >
                              ✏️
                    </button>
                    <button
                              onClick={() => handleDelete(milestone)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title={language === 'ar' ? 'حذف' : 'Delete'}
                    >
                              🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
              ))}
            </div>
          </div>
        )}
        </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={language === 'ar' ? 'معاينة معالم الشركة' : 'Company Milestones Preview'}
      >
        <MilestonesPreview data={milestones} />
      </PreviewModal>
    </div>
  );
} 