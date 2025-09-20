'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface ContactInfoData {
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
  google_maps_url?: string;
}

interface ContactInfoPreviewProps {
  data: ContactInfoData;
}

export default function ContactInfoPreview({ data }: ContactInfoPreviewProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'ar' 
              ? 'نحن هنا لمساعدتك، تواصل معنا في أي وقت' 
              : 'We\'re here to help you, contact us anytime'
            }
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
            {/* Phone Numbers */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">📞</span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'ar' ? 'الهواتف' : 'Phone Numbers'}
                </h3>
              </div>
              <div className="space-y-3">
                {data.main_phone && (
                  <div className="flex items-center">
                    <span className="text-blue-600 font-medium mr-2">
                      {language === 'ar' ? 'الرئيسي:' : 'Main:'}
                    </span>
                    <span className="text-gray-700">{data.main_phone}</span>
                  </div>
                )}
                {data.secondary_phone && (
                  <div className="flex items-center">
                    <span className="text-green-600 font-medium mr-2">
                      {language === 'ar' ? language === 'ar' ? data.labels.emergency_ar : data.labels.emergency_en : 'Emergency:'}
                    </span>
                    <span className="text-gray-700">{data.secondary_phone}</span>
                  </div>
                )}
                {data.toll_free && (
                  <div className="flex items-center">
                    <span className="text-purple-600 font-medium mr-2">
                      {language === 'ar' ? data.labels.toll_free_ar : data.labels.toll_free_en}:
                    </span>
                    <span className="text-gray-700">{data.toll_free}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Emails */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">📧</span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Addresses'}
                </h3>
              </div>
              <div className="space-y-3">
                {data.main_email && (
                  <div className="flex items-center">
                    <span className="text-blue-600 font-medium mr-2">
                      {language === 'ar' ? 'عام:' : 'General:'}
                    </span>
                    <span className="text-gray-700 text-sm">{data.main_email}</span>
                  </div>
                )}
                {data.sales_email && (
                  <div className="flex items-center">
                    <span className="text-green-600 font-medium mr-2">
                      {language === 'ar' ? 'المبيعات:' : 'Sales:'}
                    </span>
                    <span className="text-gray-700 text-sm">{data.sales_email}</span>
                  </div>
                )}
                {data.support_email && (
                  <div className="flex items-center">
                    <span className="text-orange-600 font-medium mr-2">
                      {language === 'ar' ? 'الدعم:' : 'Support:'}
                    </span>
                    <span className="text-gray-700 text-sm">{data.support_email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp */}
            {data.whatsapp && (
              <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">💬</span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </h3>
                </div>
                <div className="flex items-center justify-between bg-green-50 rounded-lg p-4">
                  <div>
                    <span className="text-green-700 font-medium">{data.whatsapp}</span>
                    <p className="text-sm text-green-600 mt-1">
                      {language === 'ar' ? 'تواصل معنا مباشرة' : 'Contact us directly'}
                    </p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    {language === 'ar' ? 'إرسال رسالة' : 'Send Message'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Address & Hours */}
          <div className="space-y-6">
            {/* Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">📍</span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'ar' ? 'العنوان' : 'Address'}
                </h3>
              </div>
              <div className="text-gray-700 space-y-2">
                <p>{language === 'ar' ? data.address.street_ar : data.address.street_en}</p>
                <p>{language === 'ar' ? data.address.district_ar : data.address.district_en}</p>
                <p>{language === 'ar' ? data.address.city_ar : data.address.city_en}</p>
                <p className="font-medium text-gray-900">
                  {language === 'ar' ? data.address.country_ar : data.address.country_en}
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">⏰</span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {language === 'ar' ? 'ساعات العمل' : 'Working Hours'}
                </h3>
              </div>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">
                    {language === 'ar' ? 'الأسبوع:' : 'Weekdays:'}
                  </span>
                  <span>
                    {language === 'ar' ? data.working_hours.weekdays_ar : data.working_hours.weekdays_en}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    {language === 'ar' ? 'الجمعة:' : 'Friday:'}
                  </span>
                  <span className="text-red-600">
                    {language === 'ar' ? data.working_hours.friday_ar : data.working_hours.friday_en}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">
                    {language === 'ar' ? 'السبت:' : 'Saturday:'}
                  </span>
                  <span>
                    {language === 'ar' ? data.working_hours.saturday_ar : data.working_hours.saturday_en}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 