'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface Milestone {
  id?: number;
  year: string;
  event_ar: string;
  event_en: string;
  description_ar: string;
  description_en: string;
  order: number;
  is_active: boolean;
}

interface MilestonesPreviewProps {
  data: Milestone[];
}

export default function MilestonesPreview({ data }: MilestonesPreviewProps) {
  const { language } = useLanguage();

  const activeMilestones = data
    .filter(milestone => milestone.is_active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'رحلتنا عبر السنين' : 'Our Journey Through the Years'}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'محطات مهمة ولحظات فارقة شكلت تاريخنا وصنعت نجاحنا على مدى السنوات'
            : 'Important milestones and pivotal moments that shaped our history and made our success over the years'
          }
        </p>
      </div>

      {activeMilestones.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🎯</div>
          <p className="text-xl text-gray-500">
            {language === 'ar' ? 'لا توجد معالم متاحة' : 'No milestones available'}
          </p>
        </div>
      ) : (
        <>
          {/* Main Timeline */}
          <div className="relative mb-16">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 h-full rounded-full shadow-lg"></div>
            
            {/* Timeline Items */}
            <div className="space-y-16">
              {activeMilestones.map((milestone, index) => (
                <div key={milestone.id} className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                  {/* Content Side */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100">
                      <div className={`flex items-center space-x-3 mb-4 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-lg font-bold">
                          {milestone.year}
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          #{milestone.order}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {language === 'ar' ? milestone.event_ar : milestone.event_en}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {language === 'ar' ? milestone.description_ar : milestone.description_en}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="relative z-10 w-2/12 flex justify-center">
                    <div className="w-6 h-6 bg-white border-4 border-blue-500 rounded-full shadow-lg animate-pulse"></div>
                  </div>
                  
                  {/* Empty Side */}
                  <div className="w-5/12"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Alternative Style - Horizontal Cards */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {language === 'ar' ? 'أبرز المحطات' : 'Key Milestones'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeMilestones.slice(0, 6).map((milestone) => (
                <div key={`card-${milestone.id}`} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg">
                      {milestone.year}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      {language === 'ar' ? milestone.event_ar : milestone.event_en}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {language === 'ar' ? milestone.description_ar : milestone.description_en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'إحصائيات رحلتنا' : 'Our Journey Statistics'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">{activeMilestones.length}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'معلم مهم' : 'Major Milestones'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">
                  {Math.max(...activeMilestones.map(m => parseInt(m.year))) - Math.min(...activeMilestones.map(m => parseInt(m.year))) + 1}
                </div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'سنة من التميز' : 'Years of Excellence'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">∞</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'التطور المستمر' : 'Continuous Growth'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'الالتزام بالجودة' : 'Quality Commitment'}
                </div>
              </div>
            </div>
          </div>

          {/* Compact Timeline for Mobile */}
          <div className="md:hidden">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {language === 'ar' ? 'الخط الزمني' : 'Timeline View'}
            </h3>
            
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-600"></div>
              
              <div className="space-y-8">
                {activeMilestones.map((milestone) => (
                  <div key={`mobile-${milestone.id}`} className="relative pl-16">
                    <div className="absolute left-6 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {milestone.year}
                        </span>
                        <span className="text-xs text-gray-500">#{milestone.order}</span>
                      </div>
                                             <h4 className="font-bold text-gray-900 mb-2">
                         {language === 'ar' ? milestone.event_ar : milestone.event_en}
                       </h4>
                      <p className="text-gray-600 text-sm">
                        {language === 'ar' ? milestone.description_ar : milestone.description_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'انضم لرحلتنا المستمرة' : 'Join Our Continuing Journey'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'كل معلم يمثل خطوة في رحلة طويلة من الإنجازات، ونحن نتطلع للمزيد'
                : 'Every milestone represents a step in a long journey of achievements, and we look forward to more'
              }
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors transform hover:scale-105">
              {language === 'ar' ? 'تعرف على قصتنا' : 'Discover Our Story'}
            </button>
          </div>
        </>
      )}
    </div>
  );
} 