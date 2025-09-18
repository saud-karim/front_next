'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';

interface FAQ {
  id?: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  category_ar?: string;
  category_en?: string;
  is_featured: boolean;
  order_index: number;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function FAQsTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [saving, setSaving] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [newFAQ, setNewFAQ] = useState<Partial<FAQ>>({
    question_ar: '',
    question_en: '',
    answer_ar: '',
    answer_en: '',
    category_ar: '',
    category_en: '',
    is_featured: false,
    order_index: 0
  });

  // تحميل الأسئلة الشائعة
  const loadFAQs = async () => {
    try {
      setLoading(true);
      console.log('❓ Loading real FAQs data from API...');
      const response = await ApiService.getFAQs();
      
      if (response.success && response.data) {
        setFaqs(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل الأسئلة الشائعة';
      toast.error('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // إضافة سؤال جديد
  const handleAddFAQ = async () => {
    try {
      setSaving(true);
      const response = await ApiService.createFAQ(newFAQ as any);
      
      if (response.success && response.data) {
        setFaqs(prev => [...prev, response.data]);
        setNewFAQ({
          question_ar: '',
          question_en: '',
          answer_ar: '',
          answer_en: '',
          category_ar: '',
          category_en: '',
          is_featured: false,
          order_index: 0
        });
        setShowAddForm(false);
        toast.success(
          language === 'ar' ? 'نجح الإضافة' : 'Success',
          language === 'ar' ? 'تم إضافة السؤال بنجاح' : 'FAQ added successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة السؤال';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث سؤال
  const handleUpdateFAQ = async (faq: FAQ) => {
    try {
      setSaving(true);
      const response = await ApiService.updateFAQ(faq.id!, faq);
      
      if (response.success && response.data) {
        setFaqs(prev => prev.map(f => f.id === faq.id ? response.data : f));
        setEditingFAQ(null);
        toast.success(
          language === 'ar' ? 'نجح التحديث' : 'Success',
          language === 'ar' ? 'تم تحديث السؤال بنجاح' : 'FAQ updated successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث السؤال';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف سؤال
  const handleDeleteFAQ = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await ApiService.deleteFAQ(id);
      
      if (response.success) {
        setFaqs(prev => prev.filter(f => f.id !== id));
        toast.success(
          language === 'ar' ? 'نجح الحذف' : 'Success',
          language === 'ar' ? 'تم حذف السؤال بنجاح' : 'FAQ deleted successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف السؤال';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

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
            {language === 'ar' ? 'إدارة الأسئلة والأجوبة الشائعة' : 'Manage frequently asked questions and answers'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + {language === 'ar' ? 'إضافة سؤال' : 'Add FAQ'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {language === 'ar' ? 'إضافة سؤال جديد' : 'Add New FAQ'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'السؤال (عربي)' : 'Question (Arabic)'}
              </label>
              <textarea
                value={newFAQ.question_ar || ''}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, question_ar: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'السؤال (انجليزي)' : 'Question (English)'}
              </label>
              <textarea
                value={newFAQ.question_en || ''}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, question_en: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الإجابة (عربي)' : 'Answer (Arabic)'}
              </label>
              <textarea
                value={newFAQ.answer_ar || ''}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, answer_ar: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الإجابة (انجليزي)' : 'Answer (English)'}
              </label>
              <textarea
                value={newFAQ.answer_en || ''}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, answer_en: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الفئة (عربي)' : 'Category (Arabic)'}
              </label>
              <input
                type="text"
                value={newFAQ.category_ar || ''}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, category_ar: e.target.value }))}
                placeholder="عام، دعم فني، شحن..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الفئة (انجليزي)' : 'Category (English)'}
              </label>
              <input
                type="text"
                value={newFAQ.category_en || ''}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, category_en: e.target.value }))}
                placeholder={t('placeholder.category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={newFAQ.is_featured || false}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="is_featured" className="text-sm text-gray-700">
                {language === 'ar' ? 'سؤال مميز' : 'Featured FAQ'}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الترتيب' : 'Order'}
              </label>
              <input
                type="number"
                value={newFAQ.order_index || 0}
                onChange={(e) => setNewFAQ(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onClick={handleAddFAQ}
              disabled={saving || !newFAQ.question_ar || !newFAQ.question_en || !newFAQ.answer_ar || !newFAQ.answer_en}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      )}

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id!)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {language === 'ar' ? faq.question_ar : faq.question_en}
                    </h4>
                    {faq.is_featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        ⭐ {language === 'ar' ? 'مميز' : 'Featured'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {faq.category_ar && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {language === 'ar' ? faq.category_ar : faq.category_en}
                      </span>
                    )}
                    <span>#{faq.order_index}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFAQ(faq);
                    }}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                  >
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFAQ(faq.id!);
                    }}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                  >
                    {language === 'ar' ? 'حذف' : 'Delete'}
                  </button>
                  <button className="text-gray-400">
                    {expandedFAQ === faq.id ? '▲' : '▼'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Expanded Answer */}
            {expandedFAQ === faq.id && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="pt-4">
                  <p className="text-gray-700 leading-relaxed">
                    {language === 'ar' ? faq.answer_ar : faq.answer_en}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">❓</div>
          <p>{language === 'ar' ? 'لا توجد أسئلة شائعة' : 'No FAQs found'}</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {language === 'ar' ? 'تعديل السؤال' : 'Edit FAQ'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'السؤال (عربي)' : 'Question (Arabic)'}
                </label>
                <textarea
                  value={editingFAQ.question_ar}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, question_ar: e.target.value } : null)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'السؤال (انجليزي)' : 'Question (English)'}
                </label>
                <textarea
                  value={editingFAQ.question_en}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, question_en: e.target.value } : null)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الإجابة (عربي)' : 'Answer (Arabic)'}
                </label>
                <textarea
                  value={editingFAQ.answer_ar}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, answer_ar: e.target.value } : null)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الإجابة (انجليزي)' : 'Answer (English)'}
                </label>
                <textarea
                  value={editingFAQ.answer_en}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, answer_en: e.target.value } : null)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingFAQ.is_featured}
                  onChange={(e) => setEditingFAQ(prev => prev ? { ...prev, is_featured: e.target.checked } : null)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  {language === 'ar' ? 'سؤال مميز' : 'Featured FAQ'}
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingFAQ(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleUpdateFAQ(editingFAQ)}
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