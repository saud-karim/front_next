'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';
import PreviewModal from './PreviewModal';
import TeamMembersPreview from './previews/TeamMembersPreview';

interface TeamMember {
  id?: number;
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  experience_ar: string;
  experience_en: string;
  image?: string;
  email: string;
  phone: string;
  linkedin?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_MEMBER: Omit<TeamMember, 'id'> = {
  name_ar: '',
  name_en: '',
  role_ar: '',
  role_en: '',
  experience_ar: '',
  experience_en: '',
  email: '',
  phone: '',
  linkedin: '',
  order: 1,
  is_active: true
};

export default function TeamMembersTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Omit<TeamMember, 'id'>>(DEFAULT_MEMBER);

  // تحميل أعضاء الفريق
  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getTeamMembers();
      
      if (response.data && Array.isArray(response.data)) {
        setTeamMembers(response.data);
      } else {
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل أعضاء الفريق';
      toast.error('خطأ', errorMessage);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_ar.trim()) {
      newErrors.name_ar = language === 'ar' ? 'الاسم باللغة العربية مطلوب' : 'Arabic name is required';
    }
    if (!formData.name_en.trim()) {
      newErrors.name_en = language === 'ar' ? 'الاسم باللغة الإنجليزية مطلوب' : 'English name is required';
    }
    if (!formData.role_ar.trim()) {
      newErrors.role_ar = language === 'ar' ? 'المنصب باللغة العربية مطلوب' : 'Arabic role is required';
    }
    if (!formData.role_en.trim()) {
      newErrors.role_en = language === 'ar' ? 'المنصب باللغة الإنجليزية مطلوب' : 'English role is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إنشاء عضو جديد
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await ApiService.createTeamMember(formData);
      
      toast.success('نجح', language === 'ar' ? 'تم إضافة العضو بنجاح' : 'Member added successfully');
      setShowForm(false);
      setFormData(DEFAULT_MEMBER);
      await loadTeamMembers();
    } catch (error) {
      console.error('Error creating member:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة العضو';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث عضو
  const handleUpdate = async () => {
    if (!validateForm() || !editingMember) return;

    try {
      setSaving(true);
      await ApiService.updateTeamMember(editingMember.id!, formData);
      
      toast.success('نجح', language === 'ar' ? 'تم تحديث العضو بنجاح' : 'Member updated successfully');
      setShowForm(false);
        setEditingMember(null);
      setFormData(DEFAULT_MEMBER);
      await loadTeamMembers();
    } catch (error) {
      console.error('Error updating member:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث العضو';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف عضو
  const handleDelete = async (member: TeamMember) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العضو؟' : 'Are you sure you want to delete this member?')) {
      return;
    }

    try {
      setSaving(true);
      await ApiService.deleteTeamMember(member.id!);
      
      toast.success('نجح', language === 'ar' ? 'تم حذف العضو بنجاح' : 'Member deleted successfully');
      await loadTeamMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف العضو';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // بدء التعديل
  const startEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({ 
      name_ar: member.name_ar,
      name_en: member.name_en,
      role_ar: member.role_ar,
      role_en: member.role_en,
      experience_ar: member.experience_ar,
      experience_en: member.experience_en,
      email: member.email,
      phone: member.phone,
      linkedin: member.linkedin || '',
      order: member.order,
      is_active: member.is_active
    });
    setShowForm(true);
  };

  // فتح نموذج الإضافة
  const openAddForm = () => {
    setEditingMember(null);
    setFormData({
      ...DEFAULT_MEMBER,
      order: teamMembers.length + 1
    });
    setShowForm(true);
  };

  // إلغاء النموذج
  const cancelForm = () => {
    setShowForm(false);
    setEditingMember(null);
    setFormData(DEFAULT_MEMBER);
    setErrors({});
  };

  // تحديث حقل
  const updateField = (field: keyof Omit<TeamMember, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند تحديث الحقل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
          + {language === 'ar' ? 'إضافة عضو' : 'Add Member'}
        </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {editingMember ? 
              (language === 'ar' ? 'تعديل العضو' : 'Edit Member') : 
              (language === 'ar' ? 'إضافة عضو جديد' : 'Add New Member')
            }
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* الاسم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)'} *
              </label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => updateField('name_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'أدخل الاسم باللغة العربية' : 'Enter name in Arabic'}
              />
              {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)'} *
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => updateField('name_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'أدخل الاسم باللغة الإنجليزية' : 'Enter name in English'}
              />
              {errors.name_en && <p className="text-red-500 text-xs mt-1">{errors.name_en}</p>}
            </div>

            {/* المنصب */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المنصب (عربي)' : 'Role (Arabic)'} *
              </label>
              <input
                type="text"
                value={formData.role_ar}
                onChange={(e) => updateField('role_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'مدير المبيعات' : 'Sales Manager'}
              />
              {errors.role_ar && <p className="text-red-500 text-xs mt-1">{errors.role_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المنصب (إنجليزي)' : 'Role (English)'} *
              </label>
              <input
                type="text"
                value={formData.role_en}
                onChange={(e) => updateField('role_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.role_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'Sales Manager' : 'Sales Manager'}
              />
              {errors.role_en && <p className="text-red-500 text-xs mt-1">{errors.role_en}</p>}
            </div>

            {/* معلومات الاتصال */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="example@company.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+20 123 456 789"
              />
            </div>

            {/* LinkedIn */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رابط LinkedIn' : 'LinkedIn URL'}
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => updateField('linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
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

          {/* الخبرة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الخبرة (عربي)' : 'Experience (Arabic)'}
              </label>
              <textarea
                value={formData.experience_ar}
                onChange={(e) => updateField('experience_ar', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ar' ? 'خبرة 10 سنوات في مجال المبيعات...' : '10 years experience in sales...'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الخبرة (إنجليزي)' : 'Experience (English)'}
              </label>
              <textarea
                value={formData.experience_en}
                onChange={(e) => updateField('experience_en', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={language === 'ar' ? '10 years experience in sales...' : '10 years experience in sales...'}
              />
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
              onClick={editingMember ? handleUpdate : handleCreate}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </div>
              ) : (
                editingMember 
                  ? (language === 'ar' ? 'تحديث العضو' : 'Update Member')
                  : (language === 'ar' ? 'إضافة العضو' : 'Add Member')
              )}
            </button>
          </div>
        </div>
      )}

      {/* قائمة أعضاء الفريق */}
      <div className="bg-white rounded-lg border">
        {teamMembers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">👥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'لا يوجد أعضاء فريق' : 'No Team Members'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'ar' ? 'ابدأ بإضافة أول عضو للفريق' : 'Start by adding your first team member'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {teamMembers.sort((a, b) => a.order - b.order).map((member) => (
              <div key={member.id} className={`border rounded-lg px-8 py-6 hover:shadow-lg transition-all duration-200 bg-white ${
                member.is_active 
                  ? 'border-gray-200 hover:border-blue-300' 
                  : 'border-red-200 bg-red-50/30 opacity-75'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                                        <div className="relative w-12 h-12 overflow-visible">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-sm">
                        <span className="font-semibold text-lg">
                          {(language === 'ar' ? member.name_ar : member.name_en).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-10">
                        {member.order}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {language === 'ar' ? member.name_ar : member.name_en}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {language === 'ar' ? member.role_ar : member.role_en}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {member.email}
                      </p>
                    </div>
                </div>

                {/* معلومات العضو */}
                <div className="space-y-2 text-sm">
                  {member.phone && (
                    <div className="flex items-center text-gray-600">
                      <span className="w-5">📞</span>
                      <span>{member.phone}</span>
        </div>
      )}
                  {member.linkedin && (
                    <div className="flex items-center text-blue-600">
                      <span className="w-5">💼</span>
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                        LinkedIn
                      </a>
              </div>
                  )}
                  {(language === 'ar' ? member.experience_ar : member.experience_en) && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-600 text-xs leading-relaxed">
                        <strong>{language === 'ar' ? 'الخبرة:' : 'Experience:'}</strong><br />
                        {((language === 'ar' ? member.experience_ar : member.experience_en) || '').substring(0, 80)}
                        {((language === 'ar' ? member.experience_ar : member.experience_en) || '').length > 80 && '...'}
                      </p>
              </div>
                  )}
              </div>

                {/* حالة العضو */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    member.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                  </span>
                  <span className="text-xs text-gray-500">#{member.order}</span>
                </div>

                {/* أزرار التحكم - منفصلة في أسفل الكارد */}
                <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-center gap-2 rounded-b-lg mt-3">
                  <button
                      onClick={() => startEdit(member)}
                      className="flex-1 max-w-24 flex items-center justify-center px-2 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm font-medium"
                      title={language === 'ar' ? 'تعديل' : 'Edit'}
                  >
                      <span>✏️</span>
                      <span className="ml-1 hidden sm:inline">{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                  </button>
                  <button
                      onClick={() => handleDelete(member)}
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
        title={language === 'ar' ? 'معاينة أعضاء الفريق' : 'Team Members Preview'}
      >
        <TeamMembersPreview data={teamMembers} />
      </PreviewModal>
    </div>
  );
} 