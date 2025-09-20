'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface CompanyValue {
  id?: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  order: number;
  is_active: boolean;
}

interface CompanyValuesPreviewProps {
  data: CompanyValue[];
}

// نظام mapping بين الرموز القصيرة والفونت أوسوم (نفس النظام من CompanyValuesTab)
const ICON_MAPPING = {
  'AW': 'fas fa-award',           // الجودة
  'LB': 'fas fa-lightbulb',       // الابتكار
  'HS': 'fas fa-handshake',       // الشراكة
  'SH': 'fas fa-shield-alt',      // الموثوقية
  'US': 'fas fa-users',           // العمل الجماعي
  'ST': 'fas fa-star',            // التميز
  'HE': 'fas fa-heart',           // العاطفة
  'TA': 'fas fa-target',          // الهدف
  'RO': 'fas fa-rocket',          // النمو
  'CO': 'fas fa-compass',         // التوجيه
  'EY': 'fas fa-eye',             // الرؤية
  'CH': 'fas fa-chart-line',      // التطوير
  'GL': 'fas fa-globe',           // العالمية
  'CU': 'fas fa-question'         // مخصص
};

// دالة للحصول على فونت أوسوم من الرمز القصير
const getFontAwesomeIcon = (shortCode: string): string => {
  return ICON_MAPPING[shortCode as keyof typeof ICON_MAPPING] || 'fas fa-question';
};

export default function CompanyValuesPreview({ data }: CompanyValuesPreviewProps) {
  const { language } = useLanguage();

  const activeValues = data
    .filter(value => value.is_active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'قيمنا الأساسية' : 'Our Core Values'}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'القيم والمبادئ التي توجه عملنا وتحدد هويتنا كشركة رائدة في المجال'
            : 'The values and principles that guide our work and define our identity as a leading company in the field'
          }
        </p>
      </div>

      {activeValues.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">💎</div>
          <p className="text-xl text-gray-500">
            {language === 'ar' ? 'لا توجد قيم متاحة' : 'No values available'}
          </p>
        </div>
      ) : (
        <>
          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {activeValues.map((value) => (
              <div key={value.id} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                  {/* Icon Header */}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center">
                    <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <i className={`${getFontAwesomeIcon(value.icon)} text-3xl text-blue-600`}></i>
                    </div>
                    
                    {/* Order Badge */}
                    <div className="absolute top-4 right-4 bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">#{value.order}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                      {language === 'ar' ? value.title_ar : value.title_en}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed text-center">
                      {language === 'ar' ? value.description_ar : value.description_en}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Alternative Style - Horizontal Cards */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {language === 'ar' ? 'قيمنا في عمل واحد' : 'Our Values in Action'}
            </h3>
            
            <div className="space-y-6">
              {activeValues.slice(0, 4).map((value) => (
                <div key={`horizontal-${value.id}`} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <i className={`${getFontAwesomeIcon(value.icon)} text-xl text-white`}></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {language === 'ar' ? value.title_ar : value.title_en}
                      </h4>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'ar' ? value.description_ar : value.description_en}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        #{value.order}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'إحصائيات قيمنا' : 'Our Values Statistics'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">{activeValues.length}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'قيمة أساسية' : 'Core Values'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'الالتزام بالقيم' : 'Value Commitment'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">∞</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'التأثير الإيجابي' : 'Positive Impact'}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Values Timeline */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {language === 'ar' ? 'رحلة قيمنا' : 'Our Values Journey'}
            </h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 to-purple-600 h-full rounded-full"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                {activeValues.map((value, index) => (
                  <div key={`timeline-${value.id}`} className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center space-x-3 mb-3">
                          <i className={`${getFontAwesomeIcon(value.icon)} text-lg text-blue-600`}></i>
                          <h4 className="font-bold text-gray-900">
                            {language === 'ar' ? value.title_ar : value.title_en}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm">
                          {language === 'ar' ? value.description_ar : value.description_en}
                        </p>
                      </div>
                    </div>
                    
                    {/* Timeline Node */}
                    <div className="relative z-10 w-8 h-8 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-blue-600">{value.order}</span>
                    </div>
                    
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'انضم إلى قيمنا' : 'Join Our Values'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'نحن نؤمن بأن القيم الصحيحة هي أساس النجاح والتميز في كل ما نقوم به'
                : 'We believe that the right values are the foundation of success and excellence in everything we do'
              }
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors transform hover:scale-105">
              {language === 'ar' ? 'تعرف أكثر' : 'Learn More'}
            </button>
          </div>
        </>
      )}
    </div>
  );
} 