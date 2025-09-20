'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';
import PreviewModal from './PreviewModal';
import ContactInfoPreview from './previews/ContactInfoPreview';

interface ContactInfoData {
  id?: number;
  main_phone: string;
  secondary_phone: string;
  toll_free: string;
  main_email: string;
  sales_email: string;
  support_email: string;
  whatsapp: string;
  address: {
    street_ar: string;
    street_en: string;
    district_ar: string;
    district_en: string;
    city_ar: string;
    city_en: string;
    country_ar: string;
    country_en: string;
  };
  working_hours: {
    weekdays_ar: string;
    weekdays_en: string;
    friday_ar: string;
    friday_en: string;
    saturday_ar: string;
    saturday_en: string;
  };
  labels: {
    emergency_ar: string;
    emergency_en: string;
    toll_free_ar: string;
    toll_free_en: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function ContactInfoTab({ loading, setLoading }: Props) {
  const { language, t } = useLanguage();
  const toast = useToast();
  const [data, setData] = useState<ContactInfoData>({
    main_phone: '+20 123 456 7890',
    secondary_phone: '+20 987 654 3210',
    toll_free: '+20 800 123 456',
    main_email: 'info@bstools.com',
    sales_email: 'sales@bstools.com',
    support_email: 'support@bstools.com',
    whatsapp: '+20 100 000 0001',
    address: {
      street_ar: 'شارع التحرير، المعادي',
      street_en: 'Tahrir Street, Maadi',
      district_ar: 'المعادي',
      district_en: 'Maadi',
      city_ar: 'القاهرة',
      city_en: 'Cairo',
      country_ar: 'مصر',
      country_en: 'Egypt'
    },
    working_hours: {
      weekdays_ar: 'الأحد - الخميس: 9:00 ص - 6:00 م',
      weekdays_en: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
      friday_ar: 'الجمعة: مغلق',
      friday_en: 'Friday: Closed',
      saturday_ar: 'السبت: 9:00 ص - 2:00 م',
      saturday_en: 'Saturday: 9:00 AM - 2:00 PM'
    },
    labels: {
      emergency_ar: 'الطوارئ',
      emergency_en: 'Emergency',
      toll_free_ar: 'الخط المجاني',
      toll_free_en: 'Toll Free'
    }
  });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('🔥 Loading real Contact Info data from API...');
      const response = await ApiService.getContactInfo();
      
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل معلومات الاتصال';
      toast.error(t('toast.error'), errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // تحويل البيانات إلى التنسيق المُفلطح الذي يتوقعه الـ Backend
      const flattenedData = {
        main_phone: data.main_phone,
        secondary_phone: data.secondary_phone || '',
        toll_free: data.toll_free || '',
        main_email: data.main_email,
        sales_email: data.sales_email || '',
        support_email: data.support_email || '',
        whatsapp: data.whatsapp || '',
        // Address fields (flattened)
        address_street_ar: data.address.street_ar,
        address_street_en: data.address.street_en,
        address_district_ar: data.address.district_ar,
        address_district_en: data.address.district_en,
        address_city_ar: data.address.city_ar,
        address_city_en: data.address.city_en,
        address_country_ar: data.address.country_ar,
        address_country_en: data.address.country_en,
        // Working hours fields (flattened)
        working_hours_weekdays_ar: data.working_hours.weekdays_ar,
        working_hours_weekdays_en: data.working_hours.weekdays_en,
        working_hours_friday_ar: data.working_hours.friday_ar,
        working_hours_friday_en: data.working_hours.friday_en,
        working_hours_saturday_ar: data.working_hours.saturday_ar,
        working_hours_saturday_en: data.working_hours.saturday_en,
        // Labels fields (flattened)
        emergency_phone_label_ar: data.labels.emergency_ar,
        emergency_phone_label_en: data.labels.emergency_en,
        toll_free_label_ar: data.labels.toll_free_ar,
        toll_free_label_en: data.labels.toll_free_en,
      };
      
      console.log('🔄 Sending flattened data to Backend:', flattenedData);
      
      // استخدام الـ API client مع البيانات المُفلطحة
      const response = await (ApiService as any).client.put('/admin/contact-info', flattenedData);
      
      if (response.success) {
        toast.success(
          language === 'ar' ? 'نجح الحفظ' : 'Success',
          language === 'ar' ? 'تم حفظ معلومات الاتصال بنجاح' : 'Contact information saved successfully'
        );
        if (response.data) {
          setData(response.data);
        }
      } else {
        throw new Error(response.message || 'Failed to save contact information');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t('toast.saving.data');
      toast.error(t('toast.error'), errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setData(prev => {
      // Handle nested fields like 'address.street_ar' or 'working_hours.weekdays_ar'
      if (field.includes('.')) {
        const [parentKey, childKey] = field.split('.');
        return {
          ...prev,
          [parentKey]: {
            ...(prev[parentKey as keyof ContactInfoData] as Record<string, string>),
            [childKey]: value
          }
        };
      }
      // Handle top-level fields
      return { ...prev, [field]: value };
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header with Preview Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'معلومات الاتصال' : 'Contact Information'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'ar' 
              ? 'إدارة بيانات التواصل وساعات العمل'
              : 'Manage contact details and working hours'
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phone Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📞</span>
            {language === 'ar' ? 'أرقام الهاتف' : 'Phone Numbers'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الهاتف الرئيسي' : 'Main Phone'}
              </label>
              <input
                type="tel"
                value={data.main_phone || ''}
                onChange={(e) => updateField('main_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+20123456789"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الهاتف الثانوي' : 'Secondary Phone'}
              </label>
              <input
                type="tel"
                value={data.secondary_phone || ''}
                onChange={(e) => updateField('secondary_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+20987654321"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الخط المجاني' : 'Toll Free'}
              </label>
              <input
                type="tel"
                value={data.toll_free || ''}
                onChange={(e) => updateField('toll_free', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+20800123456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'واتساب' : 'WhatsApp'}
              </label>
              <input
                type="tel"
                value={data.whatsapp || ''}
                onChange={(e) => updateField('whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+20123456789"
              />
            </div>
          </div>
        </div>

        {/* Email Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📧</span>
            {language === 'ar' ? 'عناوين البريد الإلكتروني' : 'Email Addresses'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'البريد الرئيسي' : 'Main Email'}
              </label>
              <input
                type="email"
                value={data.main_email || ''}
                onChange={(e) => updateField('main_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholder.main.email')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بريد المبيعات' : 'Sales Email'}
              </label>
              <input
                type="email"
                value={data.sales_email || ''}
                onChange={(e) => updateField('sales_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sales@bstools.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بريد الدعم الفني' : 'Support Email'}
              </label>
              <input
                type="email"
                value={data.support_email || ''}
                onChange={(e) => updateField('support_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('placeholder.support.email')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">📍</span>
          {language === 'ar' ? 'العنوان' : 'Address'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الشارع (عربي)' : 'Street (Arabic)'}
            </label>
            <input
              type="text"
              value={data.address.street_ar || ''}
              onChange={(e) => updateField('address.street_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 شارع الأهرام"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الشارع (إنجليزي)' : 'Street (English)'}
            </label>
            <input
              type="text"
              value={data.address.street_en || ''}
              onChange={(e) => updateField('address.street_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Pyramids Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الحي (عربي)' : 'District (Arabic)'}
            </label>
            <input
              type="text"
              value={data.address.district_ar || ''}
              onChange={(e) => updateField('address.district_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="الجيزة"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الحي (إنجليزي)' : 'District (English)'}
            </label>
            <input
              type="text"
              value={data.address.district_en || ''}
              onChange={(e) => updateField('address.district_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Giza"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'المدينة (عربي)' : 'City (Arabic)'}
            </label>
            <input
              type="text"
              value={data.address.city_ar || ''}
              onChange={(e) => updateField('address.city_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="القاهرة"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'المدينة (إنجليزي)' : 'City (English)'}
            </label>
            <input
              type="text"
              value={data.address.city_en || ''}
              onChange={(e) => updateField('address.city_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Cairo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الدولة (عربي)' : 'Country (Arabic)'}
            </label>
            <input
              type="text"
              value={data.address.country_ar || ''}
              onChange={(e) => updateField('address.country_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مصر"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الدولة (إنجليزي)' : 'Country (English)'}
            </label>
            <input
              type="text"
              value={data.address.country_en || ''}
              onChange={(e) => updateField('address.country_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Egypt"
            />
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">⏰</span>
          {language === 'ar' ? 'ساعات العمل' : 'Working Hours'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'أيام الأسبوع (عربي)' : 'Weekdays (Arabic)'}
            </label>
            <input
              type="text"
              value={data.working_hours.weekdays_ar || ''}
              onChange={(e) => updateField('working_hours.weekdays_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="الأحد - الخميس: 9:00 ص - 6:00 م"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'أيام الأسبوع (إنجليزي)' : 'Weekdays (English)'}
            </label>
            <input
              type="text"
              value={data.working_hours.weekdays_en || ''}
              onChange={(e) => updateField('working_hours.weekdays_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('placeholder.working.hours')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الجمعة (عربي)' : 'Friday (Arabic)'}
            </label>
            <input
              type="text"
              value={data.working_hours.friday_ar || ''}
              onChange={(e) => updateField('working_hours.friday_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="الجمعة: مغلق"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'الجمعة (إنجليزي)' : 'Friday (English)'}
            </label>
            <input
              type="text"
              value={data.working_hours.friday_en || ''}
              onChange={(e) => updateField('working_hours.friday_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Friday: Closed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'السبت (عربي)' : 'Saturday (Arabic)'}
            </label>
            <input
              type="text"
              value={data.working_hours.saturday_ar || ''}
              onChange={(e) => updateField('working_hours.saturday_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="السبت: 9:00 ص - 2:00 م"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'السبت (إنجليزي)' : 'Saturday (English)'}
            </label>
            <input
              type="text"
              value={data.working_hours.saturday_en || ''}
              onChange={(e) => updateField('working_hours.saturday_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Saturday: 9:00 AM - 2:00 PM"
            />
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-2">🏷️</span>
          {language === 'ar' ? 'التسميات والأوصاف' : 'Labels & Descriptions'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'تسمية الطوارئ (عربي)' : 'Emergency Label (Arabic)'}
            </label>
            <input
              type="text"
              value={data.labels.emergency_ar || ''}
              onChange={(e) => updateField('labels.emergency_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="الطوارئ"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'تسمية الطوارئ (إنجليزي)' : 'Emergency Label (English)'}
            </label>
            <input
              type="text"
              value={data.labels.emergency_en || ''}
              onChange={(e) => updateField('labels.emergency_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Emergency"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'تسمية الخط المجاني (عربي)' : 'Toll Free Label (Arabic)'}
            </label>
            <input
              type="text"
              value={data.labels.toll_free_ar || ''}
              onChange={(e) => updateField('labels.toll_free_ar', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="الخط المجاني"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'ar' ? 'تسمية الخط المجاني (إنجليزي)' : 'Toll Free Label (English)'}
            </label>
            <input
              type="text"
              value={data.labels.toll_free_en || ''}
              onChange={(e) => updateField('labels.toll_free_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Toll Free"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
            </>
          ) : (
            <>
              <span className="mr-2">💾</span>
              {language === 'ar' ? 'حفظ البيانات' : 'Save Data'}
            </>
          )}
        </button>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={language === 'ar' ? 'معاينة معلومات الاتصال' : 'Contact Information Preview'}
      >
        <ContactInfoPreview data={data} />
      </PreviewModal>
    </div>
  );
} 