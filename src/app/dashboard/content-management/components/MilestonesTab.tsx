'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';

interface Milestone {
  id?: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  date: string;
  icon?: string;
  order_index: number;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function MilestonesTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [saving, setSaving] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    date: '',
    icon: '🎯',
    order_index: 0
  });

  // تحميل الإنجازات
  const loadMilestones = async () => {
    try {
      setLoading(true);
      console.log('🎯 Loading real Milestones data from API...');
      const response = await ApiService.getCompanyMilestones();
      
      if (response.success && response.data) {
        setMilestones(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل الإنجازات';
      toast.error('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // إضافة إنجاز جديد
  const handleAddMilestone = async () => {
    try {
      setSaving(true);
      const response = await ApiService.createMilestone(newMilestone as any);
      
      if (response.success && response.data) {
        setMilestones(prev => [...prev, response.data]);
        setNewMilestone({
          title_ar: '',
          title_en: '',
          description_ar: '',
          description_en: '',
          date: '',
          icon: '🎯',
          order_index: 0
        });
        setShowAddForm(false);
        toast.success(
          language === 'ar' ? 'نجح الإضافة' : 'Success',
          language === 'ar' ? 'تم إضافة الإنجاز بنجاح' : 'Milestone added successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة الإنجاز';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث إنجاز
  const handleUpdateMilestone = async (milestone: Milestone) => {
    try {
      setSaving(true);
      const response = await ApiService.updateMilestone(milestone.id!, milestone);
      
      if (response.success && response.data) {
        setMilestones(prev => prev.map(m => m.id === milestone.id ? response.data : m));
        setEditingMilestone(null);
        toast.success(
          language === 'ar' ? 'نجح التحديث' : 'Success',
          language === 'ar' ? 'تم تحديث الإنجاز بنجاح' : 'Milestone updated successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث الإنجاز';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف إنجاز
  const handleDeleteMilestone = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الإنجاز؟' : 'Are you sure you want to delete this milestone?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await ApiService.deleteMilestone(id);
      
      if (response.success) {
        setMilestones(prev => prev.filter(m => m.id !== id));
        toast.success(
          language === 'ar' ? 'نجح الحذف' : 'Success',
          language === 'ar' ? 'تم حذف الإنجاز بنجاح' : 'Milestone deleted successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف الإنجاز';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            {language === 'ar' ? 'الإنجازات والمحطات المهمة' : 'Milestones & Achievements'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {language === 'ar' ? 'إدارة محطات الشركة المهمة وإنجازاتها' : 'Manage company milestones and achievements'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + {language === 'ar' ? 'إضافة إنجاز' : 'Add Milestone'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {language === 'ar' ? 'إضافة إنجاز جديد' : 'Add New Milestone'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
              </label>
              <input
                type="text"
                value={newMilestone.title_ar || ''}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title_ar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'العنوان (انجليزي)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={newMilestone.title_en || ''}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title_en: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
              </label>
              <textarea
                value={newMilestone.description_ar || ''}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, description_ar: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)'}
              </label>
              <textarea
                value={newMilestone.description_en || ''}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, description_en: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'التاريخ' : 'Date'}
              </label>
              <input
                type="date"
                value={newMilestone.date || ''}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الأيقونة' : 'Icon'}
              </label>
              <input
                type="text"
                value={newMilestone.icon || ''}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, icon: e.target.value }))}
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
                value={newMilestone.order_index || 0}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
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
              onClick={handleAddMilestone}
              disabled={saving || !newMilestone.title_ar || !newMilestone.title_en || !newMilestone.date}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        <div className="space-y-8">
          {milestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((milestone, index) => (
            <div key={milestone.id} className="relative flex items-start">
              {/* Timeline Node */}
              <div className="absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
              
              {/* Content */}
              <div className="ml-16 bg-white rounded-lg shadow-md border border-gray-200 p-6 w-full">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{milestone.icon}</span>
                      <h4 className="font-semibold text-gray-900">
                        {language === 'ar' ? milestone.title_ar : milestone.title_en}
                      </h4>
                      <span className="text-xs text-gray-500">#{milestone.order_index}</span>
                    </div>
                    <p className="text-blue-600 text-sm mb-2 font-medium">
                      📅 {formatDate(milestone.date)}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {language === 'ar' ? milestone.description_ar : milestone.description_en}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingMilestone(milestone)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                    >
                      {language === 'ar' ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      onClick={() => handleDeleteMilestone(milestone.id!)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                    >
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {milestones.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <p>{language === 'ar' ? 'لا توجد إنجازات' : 'No milestones found'}</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingMilestone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {language === 'ar' ? 'تعديل الإنجاز' : 'Edit Milestone'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingMilestone.title_ar}
                  onChange={(e) => setEditingMilestone(prev => prev ? { ...prev, title_ar: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (انجليزي)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={editingMilestone.title_en}
                  onChange={(e) => setEditingMilestone(prev => prev ? { ...prev, title_en: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}
                </label>
                <textarea
                  value={editingMilestone.description_ar}
                  onChange={(e) => setEditingMilestone(prev => prev ? { ...prev, description_ar: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الوصف (انجليزي)' : 'Description (English)'}
                </label>
                <textarea
                  value={editingMilestone.description_en}
                  onChange={(e) => setEditingMilestone(prev => prev ? { ...prev, description_en: e.target.value } : null)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'التاريخ' : 'Date'}
                </label>
                <input
                  type="date"
                  value={editingMilestone.date}
                  onChange={(e) => setEditingMilestone(prev => prev ? { ...prev, date: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الأيقونة' : 'Icon'}
                </label>
                <input
                  type="text"
                  value={editingMilestone.icon || ''}
                  onChange={(e) => setEditingMilestone(prev => prev ? { ...prev, icon: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingMilestone(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleUpdateMilestone(editingMilestone)}
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