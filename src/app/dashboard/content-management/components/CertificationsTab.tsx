'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';
import PreviewModal from './PreviewModal';
import CertificationsPreview from './previews/CertificationsPreview';

interface Certification {
  id?: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  issuer_ar: string;
  issuer_en: string;
  issue_date: string;
  expiry_date?: string;
  image?: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_CERTIFICATION: Omit<Certification, 'id'> = {
  name_ar: '',
  name_en: '',
  description_ar: '',
  description_en: '',
  issuer_ar: '',
  issuer_en: '',
  issue_date: new Date().toISOString().split('T')[0], // تاريخ اليوم بصيغة YYYY-MM-DD
  expiry_date: '',
  image: '', // سيتم استبداله بـ file upload
  order: 1,
  is_active: true
};

export default function CertificationsTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>(DEFAULT_CERTIFICATION);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // تحميل الشهادات
  const loadCertifications = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCertifications();
      
      if (response.data && Array.isArray(response.data)) {
        setCertifications(response.data);
      } else {
        setCertifications([]);
      }
    } catch (error) {
      console.error('Error loading certifications:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل الشهادات';
      toast.error('خطأ', errorMessage);
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name_ar.trim()) {
      newErrors.name_ar = language === 'ar' ? 'اسم الشهادة باللغة العربية مطلوب' : 'Arabic certificate name is required';
    }
    if (!formData.name_en.trim()) {
      newErrors.name_en = language === 'ar' ? 'اسم الشهادة باللغة الإنجليزية مطلوب' : 'English certificate name is required';
    }
    if (!formData.description_ar.trim()) {
      newErrors.description_ar = language === 'ar' ? 'الوصف باللغة العربية مطلوب' : 'Arabic description is required';
    }
    if (!formData.description_en.trim()) {
      newErrors.description_en = language === 'ar' ? 'الوصف باللغة الإنجليزية مطلوب' : 'English description is required';
    }
    if (!formData.issuer_ar.trim()) {
      newErrors.issuer_ar = language === 'ar' ? 'جهة الإصدار باللغة العربية مطلوبة' : 'Arabic issuer is required';
    }
    if (!formData.issuer_en.trim()) {
      newErrors.issuer_en = language === 'ar' ? 'جهة الإصدار باللغة الإنجليزية مطلوبة' : 'English issuer is required';
    }
    if (!formData.issue_date) {
      newErrors.issue_date = language === 'ar' ? 'تاريخ الإصدار مطلوب' : 'Issue date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    // إنشاء شهادة جديدة
  const handleCreate = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const formDataToSend = createFormData();
      await ApiService.createCertification(formDataToSend);
      
      toast.success('نجح', language === 'ar' ? 'تم إضافة الشهادة بنجاح' : 'Certificate added successfully');
      setShowForm(false);
      setFormData(DEFAULT_CERTIFICATION);
      setSelectedImageFile(null);
      setImagePreview('');
      await loadCertifications();
    } catch (error) {
      console.error('Error creating certification:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في إضافة الشهادة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // تحديث شهادة
  const handleUpdate = async () => {
    if (!validateForm() || !editingCertification) return;

    try {
      setSaving(true);
      const formDataToSend = createFormData();
      await ApiService.updateCertification(editingCertification.id!, formDataToSend);
      
      toast.success('نجح', language === 'ar' ? 'تم تحديث الشهادة بنجاح' : 'Certificate updated successfully');
      setShowForm(false);
        setEditingCertification(null);
      setFormData(DEFAULT_CERTIFICATION);
      setSelectedImageFile(null);
      setImagePreview('');
      await loadCertifications();
    } catch (error) {
      console.error('Error updating certification:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحديث الشهادة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // حذف شهادة
  const handleDelete = async (certification: Certification) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الشهادة؟' : 'Are you sure you want to delete this certification?')) {
      return;
    }

    try {
      setSaving(true);
      await ApiService.deleteCertification(certification.id!);
      
      toast.success('نجح', language === 'ar' ? 'تم حذف الشهادة بنجاح' : 'Certificate deleted successfully');
      await loadCertifications();
    } catch (error) {
      console.error('Error deleting certification:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حذف الشهادة';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // بدء التعديل
  const startEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setFormData({ 
      name_ar: certification.name_ar,
      name_en: certification.name_en,
      description_ar: certification.description_ar,
      description_en: certification.description_en,
      issuer_ar: certification.issuer_ar,
      issuer_en: certification.issuer_en,
      issue_date: certification.issue_date,
      expiry_date: certification.expiry_date || '',
      image: certification.image || '',
      order: certification.order,
      is_active: certification.is_active
    });
    // عرض الصورة الحالية إذا وجدت
    if (certification.image) {
      setImagePreview(certification.image);
    }
    setSelectedImageFile(null);
    setShowForm(true);
  };

  // فتح نموذج الإضافة
  const openAddForm = () => {
    setEditingCertification(null);
    setFormData({
      ...DEFAULT_CERTIFICATION,
      order: certifications.length + 1
    });
    setSelectedImageFile(null);
    setImagePreview('');
    setShowForm(true);
  };

  // إلغاء النموذج
  const cancelForm = () => {
    setShowForm(false);
    setEditingCertification(null);
    setFormData(DEFAULT_CERTIFICATION);
    setSelectedImageFile(null);
    setImagePreview('');
    setErrors({});
  };

  // تحديث حقل
  const updateField = (field: keyof Omit<Certification, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // إزالة الخطأ عند تحديث الحقل
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // التحقق من انتهاء الشهادة
  const isExpired = (expiry_date?: string) => {
    if (!expiry_date || expiry_date.trim() === '') return false;
    const date = new Date(expiry_date);
    if (isNaN(date.getTime())) return false; // إذا كان التاريخ غير صحيح
    return date < new Date();
  };

  // التحقق من قرب انتهاء الشهادة (30 يوم)
  const isExpiringSoon = (expiry_date?: string) => {
    if (!expiry_date || expiry_date.trim() === '') return false;
    const today = new Date();
    const expiry = new Date(expiry_date);
    if (isNaN(expiry.getTime())) return false; // إذا كان التاريخ غير صحيح
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

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

  // معالجة اختيار الصورة
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        toast.error('خطأ', language === 'ar' ? 'يرجى اختيار ملف صورة صحيح' : 'Please select a valid image file');
        return;
      }

      // التحقق من حجم الملف (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('خطأ', language === 'ar' ? 'حجم الصورة يجب أن يكون أقل من 5 ميجا' : 'Image size must be less than 5MB');
        return;
      }

      setSelectedImageFile(file);
      
      // إنشاء preview للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // إنشاء FormData للإرسال
  const createFormData = (): FormData => {
    const formDataToSend = new FormData();
    
    formDataToSend.append('name_ar', formData.name_ar);
    formDataToSend.append('name_en', formData.name_en);
    formDataToSend.append('description_ar', formData.description_ar);
    formDataToSend.append('description_en', formData.description_en);
    formDataToSend.append('issuer_ar', formData.issuer_ar);
    formDataToSend.append('issuer_en', formData.issuer_en);
    formDataToSend.append('issue_date', formData.issue_date);
    if (formData.expiry_date) {
      formDataToSend.append('expiry_date', formData.expiry_date);
    }
    formDataToSend.append('order', formData.order.toString());
    formDataToSend.append('is_active', formData.is_active.toString());
    
    // إضافة الصورة إذا تم اختيارها
    if (selectedImageFile) {
      formDataToSend.append('image', selectedImageFile);
    }
    
    return formDataToSend;
  };

  // فرز الشهادات
  const sortedCertifications = certifications.sort((a, b) => a.order - b.order);

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
            {language === 'ar' ? 'إدارة شهادات الجودة والاعتمادات المهنية' : 'Manage quality certifications and professional accreditations'}
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
            + {language === 'ar' ? 'إضافة شهادة' : 'Add Certificate'}
        </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📜</span>
            <div>
              <div className="text-2xl font-bold text-blue-600">{certifications.length}</div>
              <div className="text-sm text-blue-600">{language === 'ar' ? 'إجمالي الشهادات' : 'Total Certificates'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {certifications.filter(c => c.is_active).length}
              </div>
              <div className="text-sm text-green-600">{language === 'ar' ? 'نشطة' : 'Active'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {certifications.filter(c => isExpiringSoon(c.expiry_date)).length}
              </div>
              <div className="text-sm text-yellow-600">{language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">❌</span>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {certifications.filter(c => isExpired(c.expiry_date)).length}
              </div>
              <div className="text-sm text-red-600">{language === 'ar' ? 'منتهية الصلاحية' : 'Expired'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border">
          <h3 className="text-lg font-medium text-gray-900 mb-6">
            {editingCertification ? 
              (language === 'ar' ? 'تعديل الشهادة' : 'Edit Certificate') : 
              (language === 'ar' ? 'إضافة شهادة جديدة' : 'Add New Certificate')
            }
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* اسم الشهادة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اسم الشهادة (عربي)' : 'Certificate Name (Arabic)'} *
              </label>
              <input
                type="text"
                value={formData.name_ar}
                onChange={(e) => updateField('name_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'شهادة الأيزو 9001' : 'ISO 9001 Certificate'}
              />
              {errors.name_ar && <p className="text-red-500 text-xs mt-1">{errors.name_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'اسم الشهادة (إنجليزي)' : 'Certificate Name (English)'} *
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => updateField('name_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'ISO 9001 Certificate' : 'ISO 9001 Certificate'}
              />
              {errors.name_en && <p className="text-red-500 text-xs mt-1">{errors.name_en}</p>}
            </div>

            {/* جهة الإصدار */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'جهة الإصدار (عربي)' : 'Issuer (Arabic)'} *
              </label>
              <input
                type="text"
                value={formData.issuer_ar}
                onChange={(e) => updateField('issuer_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issuer_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'منظمة المعايير الدولية' : 'International Standards Organization'}
              />
              {errors.issuer_ar && <p className="text-red-500 text-xs mt-1">{errors.issuer_ar}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'جهة الإصدار (إنجليزي)' : 'Issuer (English)'} *
              </label>
              <input
                type="text"
                value={formData.issuer_en}
                onChange={(e) => updateField('issuer_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issuer_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={language === 'ar' ? 'International Standards Organization' : 'International Standards Organization'}
              />
              {errors.issuer_en && <p className="text-red-500 text-xs mt-1">{errors.issuer_en}</p>}
            </div>

            {/* التواريخ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'} *
              </label>
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => updateField('issue_date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.issue_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.issue_date && <p className="text-red-500 text-xs mt-1">{errors.issue_date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}
              </label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => updateField('expiry_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                {language === 'ar' ? 'صورة الشهادة' : 'Certificate Image'}
              </label>
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">{language === 'ar' ? 'اضغط لرفع صورة' : 'Click to upload'}</span>
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                    </div>
              <input
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-contain border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setSelectedImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* File Info */}
                {selectedImageFile && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <p><span className="font-medium">{language === 'ar' ? 'اسم الملف:' : 'File name:'}</span> {selectedImageFile.name}</p>
                    <p><span className="font-medium">{language === 'ar' ? 'الحجم:' : 'Size:'}</span> {(selectedImageFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}

                {/* Note for editing */}
                {editingCertification && !selectedImageFile && (
                  <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                    <p>
                      {language === 'ar' 
                        ? '💡 اختر صورة جديدة فقط إذا كنت تريد تغيير الصورة الحالية'
                        : '💡 Select a new image only if you want to change the current image'
                      }
                    </p>
                  </div>
                )}
              </div>
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
                  <span>{language === 'ar' ? 'نشطة' : 'Active'}</span>
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
                  <span>{language === 'ar' ? 'غير نشطة' : 'Inactive'}</span>
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
                placeholder={language === 'ar' ? 'شهادة إدارة الجودة الدولية...' : 'International Quality Management Certificate...'}
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
                placeholder={language === 'ar' ? 'International Quality Management Certificate...' : 'International Quality Management Certificate...'}
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
              onClick={editingCertification ? handleUpdate : handleCreate}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                </div>
              ) : (
                editingCertification 
                  ? (language === 'ar' ? 'تحديث الشهادة' : 'Update Certificate')
                  : (language === 'ar' ? 'إضافة الشهادة' : 'Add Certificate')
              )}
            </button>
          </div>
        </div>
      )}

      {/* قائمة الشهادات */}
      <div className="bg-white rounded-lg border">
        {sortedCertifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">📜</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'لا توجد شهادات' : 'No Certifications Found'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'ar' ? 'ابدأ بإضافة أول شهادة' : 'Start by adding your first certification'}
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedCertifications.map((certification) => (
                <div key={certification.id} className={`border rounded-lg p-6 hover:shadow-lg transition-all duration-200 ${
                  certification.is_active 
                    ? 'border-gray-200 hover:border-blue-300 bg-white' 
                    : 'border-red-200 bg-red-50/30 opacity-75'
                } ${
                  isExpired(certification.expiry_date) 
                    ? 'border-red-500 bg-red-50' 
                    : isExpiringSoon(certification.expiry_date) 
                    ? 'border-yellow-500 bg-yellow-50' 
                    : ''
                }`}>
                  {/* معلومات الشهادة */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="flex-shrink-0">
                      {certification.image ? (
                        <img
                          src={certification.image}
                          alt={language === 'ar' ? certification.name_ar : certification.name_en}
                          className="w-12 h-12 object-contain rounded border"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-2xl">📜</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {language === 'ar' ? certification.name_ar : certification.name_en}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {language === 'ar' ? certification.issuer_ar : certification.issuer_en}
                      </p>
                    </div>
                  </div>

                  {/* الوصف */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {language === 'ar' ? certification.description_ar : certification.description_en}
                  </p>

                  {/* التواريخ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-xs text-gray-500 block">{language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</span>
                      <span className="text-sm font-medium">
                        {formatDate(certification.issue_date)}
                      </span>
                    </div>
                    {certification.expiry_date && (
                      <div>
                        <span className="text-xs text-gray-500 block">{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</span>
                        <span className={`text-sm font-medium ${
                          isExpired(certification.expiry_date) 
                            ? 'text-red-600' 
                            : isExpiringSoon(certification.expiry_date) 
                            ? 'text-yellow-600' 
                            : 'text-gray-900'
                        }`}>
                          {formatDate(certification.expiry_date)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* البيانات الوصفية */}
                  <div className="flex items-center space-x-3 flex-wrap">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                      #{certification.order}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      certification.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {certification.is_active ? (language === 'ar' ? 'نشطة' : 'Active') : (language === 'ar' ? 'غير نشطة' : 'Inactive')}
                    </span>
                    {isExpired(certification.expiry_date) && (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        {language === 'ar' ? 'منتهية الصلاحية' : 'Expired'}
                    </span>
                  )}
                    {isExpiringSoon(certification.expiry_date) && !isExpired(certification.expiry_date) && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
                    </span>
                  )}
                </div>

                  {/* أزرار التحكم - منفصلة في أسفل الكارد */}
                  <div className="bg-gray-50 border-t border-gray-200 p-3 flex justify-center gap-2 rounded-b-lg mt-4 -mx-6 -mb-6">
                <button
                      onClick={() => startEdit(certification)}
                      className="flex-1 max-w-24 flex items-center justify-center px-2 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm font-medium"
                      title={language === 'ar' ? 'تعديل' : 'Edit'}
                >
                      <span>✏️</span>
                      <span className="ml-1 hidden sm:inline">{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                </button>
                <button
                      onClick={() => handleDelete(certification)}
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
        </div>
      )}
              </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={language === 'ar' ? 'معاينة الشهادات' : 'Certifications Preview'}
      >
        <CertificationsPreview data={certifications} />
      </PreviewModal>
    </div>
  );
} 