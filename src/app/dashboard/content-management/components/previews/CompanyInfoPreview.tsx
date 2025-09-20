'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface CompanyInfoData {
  company_name_ar: string;
  company_name_en: string;
  company_description_ar: string;
  company_description_en: string;
  mission_ar: string;
  mission_en: string;
  vision_ar: string;
  vision_en: string;
  values: Array<{
    title_ar: string;
    title_en: string;
    description_ar: string;
    description_en: string;
  }>;
}

interface CompanyInfoPreviewProps {
  data: CompanyInfoData;
}

export default function CompanyInfoPreview({ data }: CompanyInfoPreviewProps) {
  const { language } = useLanguage();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'ar' ? data.company_name_ar : data.company_name_en}
          </h1>
          <p className="text-xl opacity-90">
            {language === 'ar' ? data.company_description_ar : data.company_description_en}
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Mission */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🎯</span>
                <h3 className="text-xl font-semibold text-blue-900">
                  {language === 'ar' ? 'رسالتنا' : 'Our Mission'}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar' ? data.mission_ar : data.mission_en}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🔭</span>
                <h3 className="text-xl font-semibold text-green-900">
                  {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {language === 'ar' ? data.vision_ar : data.vision_en}
              </p>
            </div>
          </div>

          {/* Values */}
          {data.values && data.values.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                {language === 'ar' ? 'قيمنا الأساسية' : 'Our Core Values'}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.values.map((value, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">⭐</span>
                      <h4 className="font-semibold text-gray-900">
                        {language === 'ar' ? value.title_ar : value.title_en}
                      </h4>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {language === 'ar' ? value.description_ar : value.description_en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 