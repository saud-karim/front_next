'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';

interface TeamMember {
  id?: number;
  name_ar: string;
  name_en: string;
  position_ar: string;
  position_en: string;
  bio_ar?: string;
  bio_en?: string;
  image_url?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  is_featured: boolean;
  order_index: number;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function TeamMembersTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    name_ar: '',
    name_en: '',
    position_ar: '',
    position_en: '',
    bio_ar: '',
    bio_en: '',
    image_url: '',
    email: '',
    phone: '',
    linkedin_url: '',
    is_featured: false,
    order_index: 0
  });

  // تحميل أعضاء الفريق
  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      console.log('👥 Loading real Team Members data from API...');
      const response = await ApiService.getTeamMembers();
      
      if (response.success && response.data) {
        setTeamMembers(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل أعضاء الفريق';
      toast.error('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // إضافة عضو جديد
  const handleAddMember = async () => {
    try {
      setSaving(true);
      const response = await ApiService.createTeamMember(newMember as any);
      
      if (response.success && response.data) {
        setTeamMembers(prev => [...prev, response.data]);
        setNewMember({
          name_ar: '',
          name_en: '',
          position_ar: '',
          position_en: '',
          bio_ar: '',
          bio_en: '',
          image_url: '',
          email: '',
          phone: '',
          linkedin_url: '',
          is_featured: false,
          order_index: 0
        });
        setShowAddForm(false);
        toast.success(
          language === 'ar' ? 'نجح الإضافة' : 'Success',
          language === 'ar' ? 'تم إضافة العضو بنجاح' : 'Team member added successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة العضو';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث عضو
  const handleUpdateMember = async (member: TeamMember) => {
    try {
      setSaving(true);
      const response = await ApiService.updateTeamMember(member.id!, member);
      
      if (response.success && response.data) {
        setTeamMembers(prev => prev.map(m => m.id === member.id ? response.data : m));
        setEditingMember(null);
        toast.success(
          language === 'ar' ? 'نجح التحديث' : 'Success',
          language === 'ar' ? 'تم تحديث العضو بنجاح' : 'Team member updated successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث العضو';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف عضو
  const handleDeleteMember = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Are you sure you want to delete this member?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await ApiService.deleteTeamMember(id);
      
      if (response.success) {
        setTeamMembers(prev => prev.filter(m => m.id !== id));
        toast.success(
          language === 'ar' ? 'نجح الحذف' : 'Success',
          language === 'ar' ? 'تم حذف العضو بنجاح' : 'Team member deleted successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف العضو';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'أعضاء الفريق' : 'Team Members'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {language === 'ar' ? 'إدارة أعضاء فريق العمل' : 'Manage team members'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + {language === 'ar' ? 'إضافة عضو' : 'Add Member'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {language === 'ar' ? 'إضافة عضو جديد' : 'Add New Member'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
              </label>
              <input
                type="text"
                value={newMember.name_ar || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, name_ar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم (انجليزي)' : 'Name (English)'}
              </label>
              <input
                type="text"
                value={newMember.name_en || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, name_en: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المنصب (عربي)' : 'Position (Arabic)'}
              </label>
              <input
                type="text"
                value={newMember.position_ar || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, position_ar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المنصب (انجليزي)' : 'Position (English)'}
              </label>
              <input
                type="text"
                value={newMember.position_en || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, position_en: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="email"
                value={newMember.email || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
              </label>
              <input
                type="tel"
                value={newMember.phone || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رابط الصورة' : 'Image URL'}
              </label>
              <input
                type="url"
                value={newMember.image_url || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder={t('placeholder.url')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'السيرة الذاتية (عربي)' : 'Bio (Arabic)'}
              </label>
              <textarea
                value={newMember.bio_ar || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, bio_ar: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'السيرة الذاتية (انجليزي)' : 'Bio (English)'}
              </label>
              <textarea
                value={newMember.bio_en || ''}
                onChange={(e) => setNewMember(prev => ({ ...prev, bio_en: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                checked={newMember.is_featured || false}
                onChange={(e) => setNewMember(prev => ({ ...prev, is_featured: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="is_featured" className="text-sm text-gray-700">
                {language === 'ar' ? 'عضو مميز' : 'Featured Member'}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الترتيب' : 'Order'}
              </label>
              <input
                type="number"
                value={newMember.order_index || 0}
                onChange={(e) => setNewMember(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
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
              onClick={handleAddMember}
              disabled={saving || !newMember.name_ar || !newMember.name_en}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {member.image_url && (
              <img
                src={member.image_url}
                alt={language === 'ar' ? member.name_ar : member.name_en}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">
                  {language === 'ar' ? member.name_ar : member.name_en}
                </h4>
                {member.is_featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    ⭐ {language === 'ar' ? 'مميز' : 'Featured'}
                  </span>
                )}
              </div>
              <p className="text-blue-600 text-sm mb-2">
                {language === 'ar' ? member.position_ar : member.position_en}
              </p>
              {(member.bio_ar || member.bio_en) && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {language === 'ar' ? member.bio_ar : member.bio_en}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  {member.email && <span>📧</span>}
                  {member.phone && <span>📞</span>}
                  {member.linkedin_url && <span>💼</span>}
                  <span>#{member.order_index}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                  >
                    {language === 'ar' ? 'تعديل' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id!)}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                  >
                    {language === 'ar' ? 'حذف' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">👥</div>
          <p>{language === 'ar' ? 'لا يوجد أعضاء فريق' : 'No team members found'}</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {language === 'ar' ? 'تعديل العضو' : 'Edit Member'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingMember.name_ar}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, name_ar: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم (انجليزي)' : 'Name (English)'}
                </label>
                <input
                  type="text"
                  value={editingMember.name_en}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, name_en: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المنصب (عربي)' : 'Position (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingMember.position_ar}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, position_ar: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'المنصب (انجليزي)' : 'Position (English)'}
                </label>
                <input
                  type="text"
                  value={editingMember.position_en}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, position_en: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingMember.is_featured}
                  onChange={(e) => setEditingMember(prev => prev ? { ...prev, is_featured: e.target.checked } : null)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  {language === 'ar' ? 'عضو مميز' : 'Featured Member'}
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleUpdateMember(editingMember)}
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