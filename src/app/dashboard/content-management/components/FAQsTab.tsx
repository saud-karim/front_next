'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';
import PreviewModal from './PreviewModal';
import FAQsPreview from './previews/FAQsPreview';

interface FAQ {
  id?: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  category: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const FAQ_CATEGORIES = [
  { value: 'payment', label_ar: 'الدفع والتحصيل', label_en: 'Payment' },
  { value: 'shipping', label_ar: 'الشحن والتوصيل', label_en: 'Shipping' },
  { value: 'products', label_ar: 'المنتجات', label_en: 'Products' },
  { value: 'support', label_ar: 'الدعم الفني', label_en: 'Support' },
  { value: 'warranty', label_ar: 'الضمان', label_en: 'Warranty' },
  { value: 'returns', label_ar: 'المرتجعات', label_en: 'Returns' },
  { value: 'account', label_ar: 'الحساب', label_en: 'Account' },
  { value: 'general', label_ar: 'عام', label_en: 'General' }
];

const DEFAULT_FAQ: Omit<FAQ, 'id'> = {
  question_ar: '',
  question_en: '',
  answer_ar: '',
  answer_en: '',
  category: 'general',
  order: 1,
  is_active: true
};

export default function FAQsTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState<Omit<FAQ, 'id'>>(DEFAULT_FAQ);

  // تحميل الأسئلة الشائعة
  const loadFAQs = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getFAQs();
      
      if (response.data && Array.isArray(response.data)) {
        setFaqs(response.data);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error('Error loading FAQs:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل الأسئلة الشائعة';
      toast.error('خطأ', errorMessage);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.question_ar.trim()) {
      newErrors.question_ar = language === 'ar' ? 'السؤال باللغة العربية مطلوب' : 'Arabic question is required';
    }
    if (!formData.question_en.trim()) {
      newErrors.question_en = language === 'ar' ? 'السؤال باللغة الإنجليزية مطلوب' : 'English question is required';
    }
    if (!formData.answer_ar.trim()) {
      newErrors.answer_ar = language === 'ar' ? 'الإجابة باللغة العربية مطلوبة' : 'Arabic answer is required';
    }
    if (!formData.answer_en.trim()) {
      newErrors.answer_en = language === 'ar' ? 'الإجابة باللغة الإنجليزية مطلوبة' : 'English answer is required';
    }
    if (!formData.category) {
      newErrors.category = language === 'ar' ? 'التصنيف مطلوب' : 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إنشاء سؤال جديد
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await ApiService.createFAQ(formData);
      
      toast.success('نجح', language === 'ar' ? 'تم إضافة السؤال بنجاح' : 'FAQ added successfully');
      setShowForm(false);
      setFormData(DEFAULT_FAQ);
      await loadFAQs();
    } catch (error) {
      console.error('Error creating FAQ:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة السؤال';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث سؤال
  const handleUpdate = async () => {
    if (!validateForm() || !editingFAQ) return;

    try {
      setSaving(true);
      await ApiService.updateFAQ(editingFAQ.id!, formData);
      
      toast.success('نجح', language === 'ar' ? 'تم تحديث السؤال بنجاح' : 'FAQ updated successfully');
      setShowForm(false);
        setEditingFAQ(null);
      setFormData(DEFAULT_FAQ);
      await loadFAQs();
    } catch (error) {
      console.error('Error updating FAQ:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث السؤال';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف سؤال
  const handleDelete = async (faq: FAQ) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      setSaving(true);
      await ApiService.deleteFAQ(faq.id!);
      
      toast.success('نجح', language === 'ar' ? 'تم حذف السؤال بنجاح' : 'FAQ deleted successfully');
      await loadFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف السؤال';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // بدء التعديل
  const startEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({ 
      question_ar: faq.question_ar,
      question_en: faq.question_en,
      answer_ar: faq.answer_ar,
      answer_en: faq.answer_en,
      category: faq.category,
      order: faq.order,
      is_active: faq.is_active
    });
    setShowForm(true);
  };

  // فتح نموذج الإضافة
  const openAddForm = () => {
    setEditingFAQ(null);
    setFormData({
      ...DEFAULT_FAQ,
      order: faqs.length + 1
    });
    setShowForm(true);
  };

  // إلغاء النموذج
  const cancelForm = () => {
    setShowForm(false);
    setEditingFAQ(null);
    setFormData(DEFAULT_FAQ);
    setErrors({});
  };

  // تحديث حقل
  const updateField = (field: keyof Omit<FAQ, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند تحديث الحقل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // الحصول على تسمية التصنيف
  const getCategoryLabel = (category: string) => {
    const cat = FAQ_CATEGORIES.find(c => c.value === category);
    return cat ? (language === 'ar' ? cat.label_ar : cat.label_en) : category;
  };

  // فلترة الأسئلة حسب التصنيف
  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  useEffect(() => {
    loadFAQs();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {language === 'ar' ? 'إدارة الأسئلة والأجوبة الشائعة للعملاء' : 'Manage customer frequently asked questions and answers'}
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
          + {language === 'ar' ? 'إضافة سؤال' : 'Add FAQ'}
        </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-4 mb-6 bg-gray-50 p-4 rounded-lg">
        <span className="text-sm font-medium text-gray-700">
          {language === 'ar' ? 'تصنيف:' : 'Category:'}
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{language === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
          {FAQ_CATEGORIES.map(category => (
            <option key={category.value} value={category.value}>
              {language === 'ar' ? category.label_ar : category.label_en}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500">
          ({filteredFAQs.length} {language === 'ar' ? 'سؤال' : 'questions'})
        </span>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {editingFAQ ? 
              (language === 'ar' ? 'تعديل السؤال' : 'Edit FAQ') : 
              (language === 'ar' ? 'إضافة سؤال جديد' : 'Add New FAQ')
            }
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* التصنيف والترتيب */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'التصنيف' : 'Category'} *
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{language === 'ar' ? 'اختر التصنيف' : 'Select Category'}</option>
                {FAQ_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {language === 'ar' ? category.label_ar : category.label_en}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

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

          {/* السؤال */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'السؤال (عربي)' : 'Question (Arabic)'} *
              </label>
              <textarea
                value={formData.question_ar}
                onChange={(e) => updateField('question_ar', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.question_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'ما هي طرق الدفع المتاحة؟' : 'What payment methods are available?'}
              />
              {errors.question_ar && <p className="text-red-500 text-xs mt-1">{errors.question_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'السؤال (إنجليزي)' : 'Question (English)'} *
              </label>
              <textarea
                value={formData.question_en}
                onChange={(e) => updateField('question_en', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.question_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'What payment methods are available?' : 'What payment methods are available?'}
              />
              {errors.question_en && <p className="text-red-500 text-xs mt-1">{errors.question_en}</p>}
            </div>
          </div>

          {/* الإجابة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الإجابة (عربي)' : 'Answer (Arabic)'} *
              </label>
              <textarea
                value={formData.answer_ar}
                onChange={(e) => updateField('answer_ar', e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.answer_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'نقبل جميع طرق الدفع: نقداً، تحويل بنكي، بطاقات ائتمان...' : 'We accept all payment methods...'}
              />
              {errors.answer_ar && <p className="text-red-500 text-xs mt-1">{errors.answer_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الإجابة (إنجليزي)' : 'Answer (English)'} *
              </label>
              <textarea
                value={formData.answer_en}
                onChange={(e) => updateField('answer_en', e.target.value)}
                rows={5}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.answer_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'We accept all payment methods...' : 'We accept all payment methods: cash, bank transfer, credit cards...'}
              />
              {errors.answer_en && <p className="text-red-500 text-xs mt-1">{errors.answer_en}</p>}
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
              onClick={editingFAQ ? handleUpdate : handleCreate}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </div>
              ) : (
                editingFAQ 
                  ? (language === 'ar' ? 'تحديث السؤال' : 'Update FAQ')
                  : (language === 'ar' ? 'إضافة السؤال' : 'Add FAQ')
              )}
            </button>
          </div>
        </div>
      )}

      {/* قائمة الأسئلة الشائعة */}
      <div className="bg-white rounded-lg border">
        {filteredFAQs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">❓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'لا توجد أسئلة شائعة' : 'No FAQs Found'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'ar' ? 'ابدأ بإضافة أول سؤال شائع' : 'Start by adding your first FAQ'}
            </p>
          </div>
        ) : (
          <div className="p-6">
                  <div className="space-y-6">
              {filteredFAQs.sort((a, b) => a.order - b.order).map((faq, index) => (
                <div key={faq.id} className={`border rounded-lg p-6 hover:shadow-lg transition-all duration-200 bg-white ${
                  faq.is_active 
                    ? 'border-gray-200 hover:border-blue-300' 
                    : 'border-red-200 bg-red-50/30 opacity-75'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <button
              onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id!)}
                          className="flex items-center space-x-2 text-left"
                        >
                          <span className="text-lg">
                            {expandedFAQ === faq.id ? '➖' : '➕'}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                      {language === 'ar' ? faq.question_ar : faq.question_en}
                          </h3>
                        </button>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            {getCategoryLabel(faq.category)}
                          </span>
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                            #{faq.order}
                      </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            faq.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {faq.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                      </span>
              </div>
            </div>
            
                      {/* الإجابة المُوسَّعة */}
            {expandedFAQ === faq.id && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'ar' ? faq.answer_ar : faq.answer_en}
                  </p>
              </div>
            )}
      </div>

                    {/* أزرار التحكم */}
                    <div className="flex space-x-2 ml-4">
              <button
                        onClick={() => startEdit(faq)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title={language === 'ar' ? 'تعديل' : 'Edit'}
              >
                        ✏️
              </button>
              <button
                        onClick={() => handleDelete(faq)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title={language === 'ar' ? 'حذف' : 'Delete'}
                      >
                        🗑️
              </button>
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
        title={language === 'ar' ? 'معاينة الأسئلة الشائعة' : 'FAQs Preview'}
      >
        <FAQsPreview data={faqs} />
      </PreviewModal>
    </div>
  );
} 