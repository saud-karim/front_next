'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import ApiService from '@/app/services/api';
import { useToast } from '@/app/context/ToastContext';
import PreviewModal from './PreviewModal';
import CompanyInfoPreview from './previews/CompanyInfoPreview';

interface CompanyInfoData {
  id?: number;
  company_name_ar: string;
  company_name_en: string;
  company_description_ar: string;
  company_description_en: string;
  mission_ar: string;
  mission_en: string;
  vision_ar: string;
  vision_en: string;
  logo_text: string;
  founded_year: string;
  employees_count: string;
  values: Array<{
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Cache للبيانات لتجنب الطلبات المتكررة
let companyInfoCache: CompanyInfoData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function CompanyInfoTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [data, setData] = useState<CompanyInfoData>({
    company_name_ar: 'بي إس تولز',
    company_name_en: 'BS Tools',
    company_description_ar: 'شركة رائدة في مجال أدوات ومواد البناء منذ أكثر من 15 عاماً',
    company_description_en: 'Leading company in construction tools and materials for over 15 years',
    mission_ar: 'نسعى لتوفير أفضل أدوات ومواد البناء بأعلى جودة وأسعار تنافسية',
    mission_en: 'We strive to provide the best construction tools and materials with the highest quality and competitive prices',
    vision_ar: 'أن نكون الشريك المفضل لكل مقاول ومهندس في منطقة الشرق الأوسط',
    vision_en: 'To be the preferred partner for every contractor and engineer in the Middle East',
    logo_text: 'BS',
    founded_year: '2009',
    employees_count: '150',
    values: [
      {
        title_ar: 'الجودة',
        title_en: 'Quality',
        description_ar: 'نلتزم بتقديم أعلى معايير الجودة في جميع منتجاتنا',
        description_en: 'We are committed to providing the highest quality standards in all our products'
      },
      {
        title_ar: 'الابتكار',
        title_en: 'Innovation',
        description_ar: 'نسعى دائماً لتطوير حلول مبتكرة في مجال البناء',
        description_en: 'We always strive to develop innovative solutions in the construction field'
      }
    ]
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [retryCount, setRetryCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // تحميل البيانات مع Cache و Retry Logic
  const loadData = async (forceRefresh = false) => {
    try {
      // التحقق من Cache أولاً
      const now = Date.now();
      if (!forceRefresh && companyInfoCache && (now - lastFetchTime) < CACHE_DURATION) {
        console.log('📦 Using cached company info data');
        setData(companyInfoCache);
        return;
      }

      setLoading(true);
      
      // إضافة delay لتجنب Rate Limiting
      if (retryCount > 0) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await ApiService.getCompanyInfo();
      
      if (response.success && response.data) {
        console.log('🔍 CompanyInfoTab - Raw API data:', response.data);
        // تحديث Cache
        companyInfoCache = response.data;
        lastFetchTime = now;
        setData(response.data);
        console.log('✅ CompanyInfoTab - Data updated:', response.data);
        setRetryCount(0); // إعادة تعيين عداد المحاولات عند النجاح
      } else {
        console.log('❌ CompanyInfoTab - API failed:', response);
      }
      
    } catch (error: unknown) {
      console.error('Error loading company info:', error);
      
      // في حالة Rate Limiting، زيادة عداد المحاولات
      if (error.message.includes('طلبات كثيرة') || error.message.includes('Too Many')) {
        setRetryCount(prev => prev + 1);
        
        if (retryCount < 3) {
          toast.info(t('toast.info'), t('toast.retry.attempt').replace('{count}', String(retryCount + 1)));
          // إعادة المحاولة تلقائياً بعد delay
          setTimeout(() => loadData(), 3000);
          return;
        }
      }
      
              toast.error(t('toast.error'), error.message || t('toast.loading.data'));
    } finally {
      setLoading(false);
    }
  };

  // حفظ البيانات
  const handleSave = async () => {
    try {
      setErrors({});
      setSaving(true);

      // Validation
      const newErrors: Record<string, string> = {};
      if (!data.company_name_ar.trim()) {
        newErrors.company_name_ar = language === 'ar' ? 'اسم الشركة بالعربية مطلوب' : 'Company name in Arabic is required';
      }
      if (!data.company_name_en.trim()) {
        newErrors.company_name_en = language === 'ar' ? 'اسم الشركة بالإنجليزية مطلوب' : 'Company name in English is required';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const response = await ApiService.updateCompanyInfo(data);
      
      if (response.success) {
        toast.success(
          language === 'ar' ? 'نجح الحفظ' : 'Success', 
          language === 'ar' ? 'تم حفظ البيانات بنجاح' : 'Data saved successfully'
        );
        if (response.data) {
          setData(response.data);
        }
      } else {
        throw new Error(response.message || 'Failed to save data');
      }
    } catch (error: any) {
      console.error('Error saving company info:', error);
      toast.error(t('toast.error'), error.message || t('toast.saving.data'));
    } finally {
      setSaving(false);
    }
  };

  // تحديث حقل
  const updateField = (field: keyof CompanyInfoData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">
      {/* Header with Preview Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'معلومات الشركة' : 'Company Information'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'ar' 
              ? 'إدارة البيانات الأساسية للشركة'
              : 'Manage basic company information'
            }
          </p>
        </div>
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <span>👁️</span>
          <span>{language === 'ar' ? 'معاينة مباشرة' : 'Live Preview'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* اسم الشركة بالعربية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'اسم الشركة (بالعربية)' : 'Company Name (Arabic)'}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.company_name_ar || ''}
            onChange={(e) => updateField('company_name_ar', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company_name_ar ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={language === 'ar' ? 'أدخل اسم الشركة بالعربية' : 'Enter company name in Arabic'}
          />
          {errors.company_name_ar && (
            <p className="mt-1 text-sm text-red-600">{errors.company_name_ar}</p>
          )}
        </div>

        {/* اسم الشركة بالإنجليزية */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'اسم الشركة (بالإنجليزية)' : 'Company Name (English)'}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.company_name_en || ''}
            onChange={(e) => updateField('company_name_en', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.company_name_en ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={language === 'ar' ? 'أدخل اسم الشركة بالإنجليزية' : 'Enter company name in English'}
          />
          {errors.company_name_en && (
            <p className="mt-1 text-sm text-red-600">{errors.company_name_en}</p>
          )}
        </div>



        {/* سنة التأسيس */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'سنة التأسيس' : 'Founded Year'}
          </label>
          <input
            type="text"
            value={data.founded_year || ''}
            onChange={(e) => updateField('founded_year', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'ar' ? '2009' : '2009'}
          />
        </div>

        {/* عدد الموظفين */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'عدد الموظفين' : 'Employees Count'}
          </label>
          <input
            type="text"
            value={data.employees_count || ''}
            onChange={(e) => updateField('employees_count', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'ar' ? '150+' : '150+'}
          />
        </div>

        {/* شعار الشركة (النص) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ar' ? 'نص الشعار' : 'Logo Text'}
          </label>
          <input
            type="text"
            value={data.logo_text || ''}
            onChange={(e) => updateField('logo_text', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={language === 'ar' ? 'BS' : 'BS'}
          />
        </div>
      </div>

      {/* وصف الشركة بالعربية */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'وصف الشركة (بالعربية)' : 'Company Description (Arabic)'}
        </label>
        <textarea
          value={data.company_description_ar || ''}
          onChange={(e) => updateField('company_description_ar', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={language === 'ar' ? 'أدخل وصف مختصر عن الشركة بالعربية...' : 'Enter company description in Arabic...'}
        />
      </div>

      {/* وصف الشركة بالإنجليزية */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'وصف الشركة (بالإنجليزية)' : 'Company Description (English)'}
        </label>
        <textarea
          value={data.company_description_en || ''}
          onChange={(e) => updateField('company_description_en', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={language === 'ar' ? 'أدخل وصف مختصر عن الشركة بالإنجليزية...' : 'Enter company description in English...'}
        />
      </div>

      {/* الرسالة بالعربية */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'رسالة الشركة (بالعربية)' : 'Company Mission (Arabic)'}
        </label>
        <textarea
          value={data.mission_ar || ''}
          onChange={(e) => updateField('mission_ar', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={language === 'ar' ? 'أدخل رسالة الشركة بالعربية...' : 'Enter company mission in Arabic...'}
        />
      </div>

      {/* الرسالة بالإنجليزية */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'رسالة الشركة (بالإنجليزية)' : 'Company Mission (English)'}
        </label>
        <textarea
          value={data.mission_en || ''}
          onChange={(e) => updateField('mission_en', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('placeholder.company.mission.english')}
        />
      </div>

      {/* الرؤية بالعربية */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'رؤية الشركة (بالعربية)' : 'Company Vision (Arabic)'}
        </label>
        <textarea
          value={data.vision_ar || ''}
          onChange={(e) => updateField('vision_ar', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={language === 'ar' ? 'أدخل رؤية الشركة بالعربية...' : 'Enter company vision in Arabic...'}
        />
      </div>

      {/* الرؤية بالإنجليزية */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {language === 'ar' ? 'رؤية الشركة (بالإنجليزية)' : 'Company Vision (English)'}
        </label>
        <textarea
          value={data.vision_en || ''}
          onChange={(e) => updateField('vision_en', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('placeholder.company.vision.english')}
        />
      </div>

      {/* أزرار الحفظ */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => loadData(true)}
          disabled={saving || loading}
          className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          title={language === 'ar' ? 'إعادة تحميل مع تجاهل الكاش' : 'Force refresh (ignore cache)'}
        >
          {loading ? '⟳' : '🔄'} {language === 'ar' ? 'إعادة تحميل' : 'Reload'}
        </button>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
            </div>
          ) : (
            language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'
          )}
        </button>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={language === 'ar' ? 'معاينة معلومات الشركة' : 'Company Information Preview'}
      >
        <CompanyInfoPreview data={data} />
      </PreviewModal>
    </div>
  );
} 