'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import ApiService from '@/app/services/api';
import { useToast } from '@/app/context/ToastContext';
import PreviewModal from './PreviewModal';
import DepartmentsPreview from './previews/DepartmentsPreview';

interface Department {
  id?: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
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
  icon: '🏢', // إيموجي قصير للحفظ في قاعدة البيانات
  color: '#3B82F6', // hex color
  order: 0,
  is_active: true
};

// نظام mapping بين الرموز القصيرة (للحفظ في قاعدة البيانات) والفونت أوسوم (للعرض)
const ICON_MAPPING = {
  '🏢': 'fas fa-building',
  '📈': 'fas fa-chart-line', 
  '🎧': 'fas fa-headset',
  '⚙️': 'fas fa-cogs',
  '👥': 'fas fa-users',
  '💰': 'fas fa-dollar-sign',
  '📢': 'fas fa-bullhorn',
  '🚛': 'fas fa-truck',
  '🛡️': 'fas fa-shield-alt',
  '🔬': 'fas fa-microscope',
  '🔧': 'fas fa-tools',
  '🤝': 'fas fa-handshake',
  '📋': 'fas fa-clipboard-check',
  '🏭': 'fas fa-industry',
  '📦': 'fas fa-warehouse'
};

const ICON_OPTIONS = Object.keys(ICON_MAPPING);

// دالة للحصول على فونت أوسوم من الإيموجي
const getFontAwesomeIcon = (emoji: string): string => {
  return ICON_MAPPING[emoji as keyof typeof ICON_MAPPING] || 'fas fa-question';
};

// دالة للحصول على الإيموجي من فونت أوسوم (للتوافق مع البيانات القديمة)
const getEmojiFromFontAwesome = (fontAwesome: string): string => {
  const entry = Object.entries(ICON_MAPPING).find(([, fa]) => fa === fontAwesome);
  return entry ? entry[0] : '🏢'; // افتراضي
};

const COLOR_OPTIONS = [
  { name: 'أزرق', value: '#3B82F6' },
  { name: 'أخضر', value: '#10B981' },
  { name: 'برتقالي', value: '#F59E0B' },
  { name: 'بنفسجي', value: '#8B5CF6' },
  { name: 'أحمر', value: '#EF4444' },
  { name: 'وردي', value: '#EC4899' },
  { name: 'تركوازي', value: '#14B8A6' },
  { name: 'نيلي', value: '#6366F1' },
  { name: 'بني', value: '#92400E' },
  { name: 'رمادي', value: '#6B7280' },
  { name: 'ذهبي', value: '#D97706' },
  { name: 'زمردي', value: '#047857' }
];

export default function DepartmentsTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [formData, setFormData] = useState<Omit<Department, 'id'>>(DEFAULT_DEPARTMENT);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  // تنسيق التاريخ بأمان (ميلادي)
  const formatDate = (dateString?: string) => {
    if (!dateString || dateString.trim() === '') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // إرجاع النص الأصلي إذا كان التاريخ غير صحيح
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      calendar: 'gregory', // فرض استخدام التقويم الميلادي
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // تحميل الأقسام
  const loadDepartments = async () => {
    try {
      setLoading(true);
      console.log('🏢 Loading real Departments data from API...');
      const response = await ApiService.getDepartments();
      console.log('🏢 Load Departments Response:', response);
      
      // الـ API يرجع { data: [...], meta: {...} } بدون success field
      if (response.data && Array.isArray(response.data)) {
        // تحويل FontAwesome strings إلى emojis للتوافق مع النظام الجديد
        const normalizedData = response.data.map(dept => ({
          ...dept,
          icon: dept.icon.startsWith('fas ') ? getEmojiFromFontAwesome(dept.icon) : dept.icon
        }));
        setDepartments(normalizedData);
        console.log('🏢 Departments loaded successfully:', normalizedData.length);
      } else {
        // إذا لم توجد بيانات، فهناك مشكلة
        throw new Error('لا توجد بيانات أقسام');
      }
    } catch (error: any) {
      console.error('Error loading departments:', error);
      toast.error(error.message || 'خطأ في تحميل الأقسام');
      // في حالة الخطأ، اعرض array فارغ بدلاً من ترك الصفحة فارغة
      setDepartments([]);
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
      if (!formData.description_ar.trim()) {
        newErrors.description_ar = language === 'ar' ? 'الوصف بالعربية مطلوب' : 'Arabic description is required';
      }
      if (!formData.description_en.trim()) {
        newErrors.description_en = language === 'ar' ? 'الوصف بالإنجليزية مطلوب' : 'English description is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const response = await ApiService.createDepartment(formData);
      console.log('🏢 Create Department Response:', response);
      
      // إذا وصل هنا بدون error، فالعملية نجحت
      // الـ API لا يرجع success field، لكن إذا لم يرجع error فهو نجح
      toast.success(language === 'ar' ? 'تم إضافة القسم بنجاح' : 'Department added successfully');
      setShowForm(false);
      setFormData(DEFAULT_DEPARTMENT);
      await loadDepartments(); // انتظار تحميل البيانات الجديدة
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
      console.log('🏢 Update Department Response:', response);
      
      // إذا وصل هنا بدون error، فالعملية نجحت
      toast.success(language === 'ar' ? 'تم تحديث القسم بنجاح' : 'Department updated successfully');
      setEditingDepartment(null);
      setFormData(DEFAULT_DEPARTMENT);
      await loadDepartments(); // انتظار تحميل البيانات المحدثة
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
      console.log('🏢 Delete Department Response:', response);
      
      // إذا وصل هنا بدون error، فالعملية نجحت
      toast.success(language === 'ar' ? 'تم حذف القسم بنجاح' : 'Department deleted successfully');
      await loadDepartments(); // انتظار تحميل البيانات المحدثة
    } catch (error: any) {
      console.error('Error deleting department:', error);
      toast.error(error.message || 'خطأ في حذف القسم');
    }
  };

  // بدء التعديل
  const startEdit = (department: Department) => {
    setEditingDepartment(department);
    // التأكد من أن الأيقونة emoji وليس FontAwesome string
    const normalizedDepartment = {
      ...department,
      icon: department.icon.startsWith('fas ') ? getEmojiFromFontAwesome(department.icon) : department.icon
    };
    setFormData({ ...normalizedDepartment });
    setShowForm(true);
  };

  // إلغاء النموذج
  const cancelForm = () => {
    setShowForm(false);
    setEditingDepartment(null);
    setFormData(DEFAULT_DEPARTMENT);
    setErrors({});
  };

  // فتح نموذج إضافة قسم جديد مع ترتيب تلقائي
  const openAddForm = () => {
    const nextOrder = departments.length > 0 ? Math.max(...departments.map(d => d.order || 0)) + 1 : 1;
    setFormData({
      ...DEFAULT_DEPARTMENT,
      order: nextOrder
    });
    setEditingDepartment(null);
    setErrors({});
    setShowForm(true);
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
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <span>👁️</span>
            <span>{language === 'ar' ? 'معاينة' : 'Preview'}</span>
          </button>
          <button
            onClick={openAddForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center space-x-2">
              <span>➕</span>
              <span>{language === 'ar' ? 'إضافة قسم' : 'Add Department'}</span>
            </div>
          </button>
        </div>
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



            {/* الأيقونة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الأيقونة' : 'Icon'}
              </label>
              <div className="grid grid-cols-5 gap-2">
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
                    title={icon}
                  >
                    <i className={`${getFontAwesomeIcon(icon)} text-xl`}></i>
                  </button>
                ))}
              </div>
              {/* عرض الأيقونة المحددة مع النص */}
              <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <i className={`${getFontAwesomeIcon(formData.icon)} text-lg`}></i>
                  <span className="text-sm text-gray-600">{formData.icon} → {getFontAwesomeIcon(formData.icon)}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {language === 'ar' ? 'الأيقونة المحددة' : 'Selected icon'}
                </span>
              </div>
            </div>

            {/* اللون */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اللون' : 'Color'}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateField('color', color.value)}
                    className={`relative p-1 rounded-lg border-2 hover:scale-105 transition-all ${
                      formData.color === color.value 
                        ? 'border-gray-800 ring-2 ring-blue-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title={`${color.name} - ${color.value}`}
                  >
                    <div 
                      className="w-10 h-10 rounded-md shadow-inner"
                      style={{ backgroundColor: color.value }}
                    ></div>
                    {formData.color === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <i className="fas fa-check text-white text-lg drop-shadow-lg"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {/* عرض اللون المحدد مع التفاصيل */}
              <div className="mt-3 flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                <div 
                  className="w-8 h-8 rounded-md border border-gray-300 shadow-sm"
                  style={{ backgroundColor: formData.color }}
                ></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {COLOR_OPTIONS.find(c => c.value === formData.color)?.name || 'مخصص'}
                  </div>
                  <div className="text-xs text-gray-500">{formData.color}</div>
                </div>
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

          {/* الإعدادات الإضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* ترتيب القسم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'ترتيب القسم' : 'Department Order'}
              </label>
              <input
                type="number"
                min="0"
                value={formData.order || 0}
                onChange={(e) => updateField('order', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                {language === 'ar' ? 'الرقم الأقل يظهر أولاً' : 'Lower numbers appear first'}
              </p>
            </div>

            {/* حالة القسم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'حالة القسم' : 'Department Status'}
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => updateField('is_active', true)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border-2 transition-all ${
                    formData.is_active
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
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
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${!formData.is_active ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                  <span>{language === 'ar' ? 'غير نشط' : 'Inactive'}</span>
                </button>
              </div>
            </div>
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
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'لا توجد أقسام' : 'No Departments'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'ar' ? 'ابدأ بإضافة أول قسم للشركة' : 'Start by adding your first department'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {departments.sort((a, b) => a.order - b.order).map((dept) => (
              <div key={dept.id} className={`border rounded-lg px-8 py-6 hover:shadow-lg transition-all duration-200 bg-white ${
                dept.is_active 
                  ? 'border-gray-200 hover:border-blue-300' 
                  : 'border-red-200 bg-red-50/30 opacity-75'
              }`}>
                                  <div className="flex items-center space-x-3 mb-3">
                    <div className="relative w-14 h-14 overflow-visible" title={`${dept.icon} → ${getFontAwesomeIcon(dept.icon)} - ${dept.color}`}>
                      <div 
                        className="w-12 h-12 rounded-lg p-3 text-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
                        style={{ backgroundColor: dept.color }}
                      >
                        <i className={`${getFontAwesomeIcon(dept.icon)} text-lg`}></i>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                        {dept.order}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {language === 'ar' ? dept.name_ar : dept.name_en}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {(language === 'ar' ? dept.description_ar : dept.description_en).substring(0, 80)}
                        {(language === 'ar' ? dept.description_ar : dept.description_en).length > 80 && '...'}
                      </p>
                    </div>
                  </div>
                
                {/* معلومات القسم */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>🏷️</span>
                      <span>{language === 'ar' ? 'ترتيب:' : 'Order:'} {dept.order}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      dept.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                        dept.is_active ? 'bg-green-400' : 'bg-red-400'
                      }`}></span>
                      {dept.is_active 
                        ? (language === 'ar' ? 'نشط' : 'Active')
                        : (language === 'ar' ? 'غير نشط' : 'Inactive')
                      }
                    </span>
                  </div>
                  
                  {/* التاريخ */}
                  {dept.created_at && (
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>📅</span>
                      <span>
                        {language === 'ar' ? 'تم الإنشاء:' : 'Created:'} {formatDate(dept.created_at)}
                      </span>
                    </div>
                  )}
                </div>

                {/* أزرار التحكم - منفصلة في أسفل الكارد */}
                <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-center gap-2 rounded-b-lg mt-3">
                  <button
                    onClick={() => startEdit(dept)}
                    className="flex-1 max-w-24 flex items-center justify-center px-2 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm font-medium"
                    title={language === 'ar' ? 'تعديل' : 'Edit'}
                  >
                    <span>✏️</span>
                    <span className="ml-1 hidden sm:inline">{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(dept)}
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
        title={language === 'ar' ? 'معاينة الأقسام' : 'Departments Preview'}
      >
        <DepartmentsPreview data={departments} />
      </PreviewModal>
    </div>
  );
} 