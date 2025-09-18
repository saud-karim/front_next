'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';

interface Certification {
  id?: number;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  issuer_ar: string;
  issuer_en: string;
  issue_date: string;
  expiry_date?: string;
  certificate_number?: string;
  image_url?: string;
  is_active: boolean;
  order_index: number;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function CertificationsTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [saving, setSaving] = useState(false);
  const [newCertification, setNewCertification] = useState<Partial<Certification>>({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    issuer_ar: '',
    issuer_en: '',
    issue_date: '',
    expiry_date: '',
    certificate_number: '',
    image_url: '',
    is_active: true,
    order_index: 0
  });

  // تحميل الشهادات
  const loadCertifications = async () => {
    try {
      setLoading(true);
      console.log('🏆 Loading real Certifications data from API...');
      const response = await ApiService.getCertifications();
      
      if (response.success && response.data) {
        setCertifications(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل الشهادات والاعتمادات';
      toast.error('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // إضافة شهادة جديدة
  const handleAddCertification = async () => {
    try {
      setSaving(true);
      const response = await ApiService.createCertification(newCertification as any);
      
      if (response.success && response.data) {
        setCertifications(prev => [...prev, response.data]);
        setNewCertification({
          name_ar: '',
          name_en: '',
          description_ar: '',
          description_en: '',
          issuer_ar: '',
          issuer_en: '',
          issue_date: '',
          expiry_date: '',
          certificate_number: '',
          image_url: '',
          is_active: true,
          order_index: 0
        });
        setShowAddForm(false);
        toast.success(
          language === 'ar' ? 'نجح الإضافة' : 'Success',
          language === 'ar' ? 'تم إضافة الشهادة بنجاح' : 'Certification added successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة الشهادة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث شهادة
  const handleUpdateCertification = async (certification: Certification) => {
    try {
      setSaving(true);
      const response = await ApiService.updateCertification(certification.id!, certification);
      
      if (response.success && response.data) {
        setCertifications(prev => prev.map(c => c.id === certification.id ? response.data : c));
        setEditingCertification(null);
        toast.success(
          language === 'ar' ? 'نجح التحديث' : 'Success',
          language === 'ar' ? 'تم تحديث الشهادة بنجاح' : 'Certification updated successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث الشهادة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف شهادة
  const handleDeleteCertification = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الشهادة؟' : 'Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      setSaving(true);
      const response = await ApiService.deleteCertification(id);
      
      if (response.success) {
        setCertifications(prev => prev.filter(c => c.id !== id));
        toast.success(
          language === 'ar' ? 'نجح الحذف' : 'Success',
          language === 'ar' ? 'تم حذف الشهادة بنجاح' : 'Certification deleted successfully'
        );
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف الشهادة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'الشهادات والاعتمادات' : 'Certifications & Accreditations'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {language === 'ar' ? 'إدارة شهادات واعتمادات الشركة' : 'Manage company certifications and accreditations'}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + {language === 'ar' ? 'إضافة شهادة' : 'Add Certification'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {language === 'ar' ? 'إضافة شهادة جديدة' : 'Add New Certification'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اسم الشهادة (عربي)' : 'Certification Name (Arabic)'}
              </label>
              <input
                type="text"
                value={newCertification.name_ar || ''}
                onChange={(e) => setNewCertification(prev => ({ ...prev, name_ar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اسم الشهادة (انجليزي)' : 'Certification Name (English)'}
              </label>
              <input
                type="text"
                value={newCertification.name_en || ''}
                onChange={(e) => setNewCertification(prev => ({ ...prev, name_en: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الجهة المانحة (عربي)' : 'Issuer (Arabic)'}
              </label>
              <input
                type="text"
                value={newCertification.issuer_ar || ''}
                onChange={(e) => setNewCertification(prev => ({ ...prev, issuer_ar: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الجهة المانحة (انجليزي)' : 'Issuer (English)'}
              </label>
              <input
                type="text"
                value={newCertification.issuer_en || ''}
                onChange={(e) => setNewCertification(prev => ({ ...prev, issuer_en: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}
              </label>
              <input
                type="date"
                value={newCertification.issue_date || ''}
                onChange={(e) => setNewCertification(prev => ({ ...prev, issue_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}
              </label>
              <input
                type="date"
                value={newCertification.expiry_date || ''}
                onChange={(e) => setNewCertification(prev => ({ ...prev, expiry_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رقم الشهادة' : 'Certificate Number'}
              </label>
              <input
                type="text"
                value={newCertification.certificate_number || ''}
                onChange={(e) => setNewCertification(prev => ({ ...prev, certificate_number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رابط الصورة' : 'Image URL'}
              </label>
              <input
                type="url"
                value={newCertification.image_url || ''}
                onChange={(e) => setNewCertification(prev => ({ ...prev, image_url: e.target.value }))}
                placeholder={t('placeholder.url')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={newCertification.is_active || false}
                onChange={(e) => setNewCertification(prev => ({ ...prev, is_active: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                {language === 'ar' ? 'نشطة' : 'Active'}
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الترتيب' : 'Order'}
              </label>
              <input
                type="number"
                value={newCertification.order_index || 0}
                onChange={(e) => setNewCertification(prev => ({ ...prev, order_index: parseInt(e.target.value) }))}
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
              onClick={handleAddCertification}
              disabled={saving || !newCertification.name_ar || !newCertification.name_en || !newCertification.issuer_ar || !newCertification.issuer_en}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      )}

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {cert.image_url && (
              <img
                src={cert.image_url}
                alt={language === 'ar' ? cert.name_ar : cert.name_en}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {language === 'ar' ? cert.name_ar : cert.name_en}
                </h4>
                <div className="flex items-center space-x-1">
                  {cert.is_active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      ✓ {language === 'ar' ? 'نشطة' : 'Active'}
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      ⏸ {language === 'ar' ? 'متوقفة' : 'Inactive'}
                    </span>
                  )}
                  {cert.expiry_date && isExpired(cert.expiry_date) && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      ⚠ {language === 'ar' ? 'منتهية' : 'Expired'}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-blue-600 text-xs mb-2">
                {language === 'ar' ? cert.issuer_ar : cert.issuer_en}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>📅 {language === 'ar' ? 'إصدار:' : 'Issued:'} {formatDate(cert.issue_date)}</div>
                {cert.expiry_date && (
                  <div>⏰ {language === 'ar' ? 'انتهاء:' : 'Expires:'} {formatDate(cert.expiry_date)}</div>
                )}
                {cert.certificate_number && (
                  <div>🔢 {cert.certificate_number}</div>
                )}
                <div>#{cert.order_index}</div>
              </div>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <button
                  onClick={() => setEditingCertification(cert)}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                >
                  {language === 'ar' ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDeleteCertification(cert.id!)}
                  className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors"
                >
                  {language === 'ar' ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">🏆</div>
          <p>{language === 'ar' ? 'لا توجد شهادات واعتمادات' : 'No certifications found'}</p>
        </div>
      )}

      {/* Edit Modal */}
      {editingCertification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {language === 'ar' ? 'تعديل الشهادة' : 'Edit Certification'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم الشهادة (عربي)' : 'Name (Arabic)'}
                </label>
                <input
                  type="text"
                  value={editingCertification.name_ar}
                  onChange={(e) => setEditingCertification(prev => prev ? { ...prev, name_ar: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'اسم الشهادة (انجليزي)' : 'Name (English)'}
                </label>
                <input
                  type="text"
                  value={editingCertification.name_en}
                  onChange={(e) => setEditingCertification(prev => prev ? { ...prev, name_en: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={editingCertification.is_active}
                  onChange={(e) => setEditingCertification(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">
                  {language === 'ar' ? 'نشطة' : 'Active'}
                </label>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingCertification(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => handleUpdateCertification(editingCertification)}
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