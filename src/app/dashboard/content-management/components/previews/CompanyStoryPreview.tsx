'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface CompanyStory {
  id?: number;
  section_title_ar: string;
  section_title_en: string;
  content_ar: string;
  content_en: string;
  image_url?: string;
  section_type: string;
  is_active: boolean;
  order_index: number;
}

interface CompanyStoryPreviewProps {
  data: CompanyStory[];
}

export default function CompanyStoryPreview({ data }: CompanyStoryPreviewProps) {
  const { language } = useLanguage();

  const activeSections = data
    .filter(section => section.is_active)
    .sort((a, b) => a.order_index - b.order_index);

  const getSectionIcon = (type: string) => {
    const icons: Record<string, string> = {
      'introduction': '🌟',
      'founding': '🏗️',
      'mission': '🎯',
      'vision': '👁️',
      'values': '⭐',
      'journey': '🛤️',
      'achievements': '🏆',
      'future': '🚀'
    };
    return icons[type] || '📖';
  };

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="text-6xl mb-6">📖</div>
          <h1 className="text-5xl font-bold mb-6">
            {language === 'ar' ? 'قصة BuildTools BS' : 'The BuildTools BS Story'}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'رحلة من الحلم إلى الواقع' 
              : 'A journey from dream to reality'
            }
          </p>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          {activeSections.length > 0 ? (
            <div className="space-y-12">
              {activeSections.map((section, index) => (
                <div key={section.id} className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl mr-4">
                      {getSectionIcon(section.section_type)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {language === 'ar' ? section.section_title_ar : section.section_title_en}
                    </h2>
                  </div>
                  
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: language === 'ar' ? section.content_ar : section.content_en 
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد قصة' : 'No Story Available'}
              </h2>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'أضف أقسام قصة الشركة لتظهر هنا' 
                  : 'Add company story sections to display here'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 