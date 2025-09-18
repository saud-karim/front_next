'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import ApiService from '@/app/services/api';
import { useToast } from '@/app/context/ToastContext';

interface Department {
  id?: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  phone: string;
  email: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_DEPARTMENT: Omit<Department, 'id'> = {
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  phone: '',
  email: '',
  icon: '💼',
  color: 'bg-blue-500',
  order: 0,
  is_active: true
};

const ICON_OPTIONS = ['💼', '📞', '🔧', '📋', '💡', '🚀', '⭐', '🎯', '🔒', '📊'];
const COLOR_OPTIONS = [
  { name: 'أزرق', value: 'bg-blue-500' },
  { name: 'أخضر', value: 'bg-green-500' },
  { name: 'برتقالي', value: 'bg-orange-500' },
  { name: 'بنفسجي', value: 'bg-purple-500' },
  { name: 'أحمر', value: 'bg-red-500' },
  { name: 'وردي', value: 'bg-pink-500' },
  { name: 'تركوازي', value: 'bg-teal-500' },
  { name: 'نيلي', value: 'bg-indigo-500' }
];

export default function DepartmentsTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Omit<Department, 'id'>>(DEFAULT_DEPARTMENT);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // تحميل الأقسام
  const loadDepartments = async () => {
    try {
      setLoading(true);
      console.log('🏢 Loading real Departments data from API...');
      const response = await ApiService.getDepartments();
      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (error: any) {
      console.error('Error loading departments:', error);
      toast.error(error.message || 'خطأ في تحميل الأقسام');
    } finally {
      setLoading(false);
    }
  };

  // إضافة قسم جديد
  const handleCreate = async () => {
    try {
      setErrors({});
      setSaving(true);

      // Validation
      const newErrors: Record<string, string> = {};
      if (!formData.name_ar.trim()) {
        newErrors.name_ar = language === 'ar' ? 'الاسم بالعربية مطلوب' : 'Arabic name is required';
      }
      if (!formData.name_en.trim()) {
        newErrors.name_en = language === 'ar' ? 'الاسم بالإنجليزية مطلوب' : 'English name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const response = await ApiService.createDepartment(formData);
      
      if (response.success) {
        toast.success(language === 'ar' ? 'تم إضافة القسم بنجاح' : 'Department added successfully');
        setShowForm(false);
        setFormData(DEFAULT_DEPARTMENT);
        loadDepartments();
      } else {
        throw new Error(response.message || 'Failed to create department');
      }
    } catch (error: any) {
      console.error('Error creating department:', error);
      toast.error(error.message || 'خطأ في إضافة القسم');
    } finally {
      setSaving(false);
    }
  };

  // تحديث قسم
  const handleUpdate = async () => {
    if (!editingDepartment?.id) return;

    try {
      setErrors({});
      setSaving(true);

      const response = await ApiService.updateDepartment(editingDepartment.id, formData);
      
      if (response.success) {
        toast.success(language === 'ar' ? 'تم تحديث القسم بنجاح' : 'Department updated successfully');
        setEditingDepartment(null);
        setFormData(DEFAULT_DEPARTMENT);
        loadDepartments();
      } else {
        throw new Error(response.message || 'Failed to update department');
      }
    } catch (error: any) {
      console.error('Error updating department:', error);
      toast.error(error.message || 'خطأ في تحديث القسم');
    } finally {
      setSaving(false);
    }
  };

  // حذف قسم
  const handleDelete = async (department: Department) => {
    if (!department.id) return;

    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا القسم؟' : 'Are you sure you want to delete this department?')) {
      return;
    }

    try {
      const response = await ApiService.deleteDepartment(department.id);
      
      if (response.success) {
        toast.success(language === 'ar' ? 'تم حذف القسم بنجاح' : 'Department deleted successfully');
        loadDepartments();
      } else {
        throw new Error(response.message || 'Failed to delete department');
      }
    } catch (error: any) {
      console.error('Error deleting department:', error);
      toast.error(error.message || 'خطأ في حذف القسم');
    }
  };

  // بدء التعديل
  const startEdit = (department: Department) => {
    setEditingDepartment(department);
    setFormData({ ...department });
    setShowForm(true);
  };

  // إلغاء النموذج
  const cancelForm = () => {
    setShowForm(false);
    setEditingDepartment(null);
    setFormData(DEFAULT_DEPARTMENT);
    setErrors({});
  };

  // تحديث حقل
  const updateField = (field: keyof Omit<Department, 'id'>, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {language === 'ar' ? 'إدارة الأقسام' : 'Manage Departments'}
          </h2>
          <p className="text-gray-600">
            {language === 'ar' ? 'إضافة وتعديل أقسام الشركة' : 'Add and edit company departments'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center space-x-2">
            <span>➕</span>
            <span>{language === 'ar' ? 'إضافة قسم' : 'Add Department'}</span>
          </div>
        </button>
      </div>

      {/* نموذج الإضافة/التعديل */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingDepartment 
              ? (language === 'ar' ? 'تعديل القسم' : 'Edit Department')
              : (language === 'ar' ? 'إضافة قسم جديد' : 'Add New Department')
            }
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* الاسم بالعربية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => updateField('name_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'المبيعات' : 'Sales'}
              />
              {errors.name_ar && (
                <p className="mt-1 text-sm text-red-600">{errors.name_ar}</p>
              )}
            </div>

            {/* الاسم بالإنجليزية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => updateField('name_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('placeholder.department.name.english')}
              />
              {errors.name_en && (
                <p className="mt-1 text-sm text-red-600">{errors.name_en}</p>
              )}
            </div>

            {/* الهاتف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholder.department.phone')}
              />
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('placeholder.department.email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* الأيقونة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الأيقونة' : 'Icon'}
              </label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => updateField('icon', icon)}
                    className={`p-2 rounded-md border-2 ${
                      formData.icon === icon 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* اللون */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اللون' : 'Color'}
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateField('color', color.value)}
                    className={`w-8 h-8 rounded-md border-2 ${color.value} ${
                      formData.color === color.value 
                        ? 'border-gray-800' 
                        : 'border-gray-300'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* الوصف بالعربية */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الوصف بالعربية' : 'Arabic Description'}
            </label>
            <textarea
              value={formData.description_ar}
              onChange={(e) => updateField('description_ar', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder={language === 'ar' ? 'وصف مختصر للقسم...' : 'Brief description of the department...'}
            />
          </div>

          {/* الوصف بالإنجليزية */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الوصف بالإنجليزية' : 'English Description'}
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) => updateField('description_en', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholder.department.description')}
            />
          </div>

          {/* أزرار النموذج */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={cancelForm}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={editingDepartment ? handleUpdate : handleCreate}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </div>
              ) : (
                editingDepartment 
                  ? (language === 'ar' ? 'تحديث القسم' : 'Update Department')
                  : (language === 'ar' ? 'إضافة القسم' : 'Add Department')
              )}
            </button>
          </div>
        </div>
      )}

      {/* قائمة الأقسام */}
      <div className="bg-white rounded-lg border">
        {departments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">📂</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {language === 'ar' ? 'لا توجد أقسام' : 'No Departments'}
            </h3>
            <p className="text-gray-600">
              {language === 'ar' ? 'ابدأ بإضافة أول قسم للشركة' : 'Start by adding your first department'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {departments.map((dept) => (
              <div key={dept.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`${dept.color} rounded-lg p-2 text-white`}>
                      {dept.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {language === 'ar' ? dept.name_ar : dept.name_en}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === 'ar' ? dept.description_ar : dept.description_en}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => startEdit(dept)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title={language === 'ar' ? 'تعديل' : 'Edit'}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(dept)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title={language === 'ar' ? 'حذف' : 'Delete'}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                {/* تفاصيل الاتصال */}
                <div className="space-y-1 text-sm text-gray-600">
                  {dept.phone && (
                    <div className="flex items-center space-x-2">
                      <span>📞</span>
                      <span>{dept.phone}</span>
                    </div>
                  )}
                  {dept.email && (
                    <div className="flex items-center space-x-2">
                      <span>📧</span>
                      <span>{dept.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 