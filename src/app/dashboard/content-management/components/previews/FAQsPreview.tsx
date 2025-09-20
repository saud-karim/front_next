'use client';

import { useState } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

interface FAQ {
  id?: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  category: string;
  order: number;
  is_active: boolean;
}

interface FAQsPreviewProps {
  data: FAQ[];
}

const FAQ_CATEGORIES = [
  { value: 'payment', label_ar: 'الدفع والتحصيل', label_en: 'Payment', icon: '💳' },
  { value: 'shipping', label_ar: 'الشحن والتوصيل', label_en: 'Shipping', icon: '🚚' },
  { value: 'products', label_ar: 'المنتجات', label_en: 'Products', icon: '📦' },
  { value: 'support', label_ar: 'الدعم الفني', label_en: 'Support', icon: '🎧' },
  { value: 'warranty', label_ar: 'الضمان', label_en: 'Warranty', icon: '🛡️' },
  { value: 'returns', label_ar: 'المرتجعات', label_en: 'Returns', icon: '↩️' },
  { value: 'account', label_ar: 'الحساب', label_en: 'Account', icon: '👤' },
  { value: 'general', label_ar: 'عام', label_en: 'General', icon: '❓' }
];

export default function FAQsPreview({ data }: FAQsPreviewProps) {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const activeFAQs = data
    .filter(faq => faq.is_active)
    .sort((a, b) => a.order - b.order);

  const getCategoryInfo = (category: string) => {
    return FAQ_CATEGORIES.find(c => c.value === category) || 
           { value: category, label_ar: category, label_en: category, icon: '❓' };
  };

  const filteredFAQs = activeCategory === 'all' 
    ? activeFAQs 
    : activeFAQs.filter(faq => faq.category === activeCategory);

  const categoriesWithCounts = FAQ_CATEGORIES.map(category => ({
    ...category,
    count: activeFAQs.filter(faq => faq.category === category.value).length
  })).filter(category => category.count > 0);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'نجيب على أهم الأسئلة التي تهم عملاءنا الكرام'
            : 'We answer the most important questions that matter to our valued customers'
          }
        </p>
      </div>

      {activeFAQs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">❓</div>
          <p className="text-xl text-gray-500">
            {language === 'ar' ? 'لا توجد أسئلة متاحة' : 'No FAQs available'}
          </p>
        </div>
      ) : (
        <>
          {/* Categories Filter */}
          {categoriesWithCounts.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">🔍</span>
                {language === 'ar' ? 'جميع الأسئلة' : 'All Questions'}
                <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                  {activeFAQs.length}
                </span>
              </button>
              
              {categoriesWithCounts.map(category => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-6 py-3 rounded-full font-medium transition-colors ${
                    activeCategory === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {language === 'ar' ? category.label_ar : category.label_en}
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto space-y-4 mb-16">
            {filteredFAQs.map((faq) => {
              const categoryInfo = getCategoryInfo(faq.category);
              return (
                <div key={faq.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id!)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <span className="text-2xl mt-1">{categoryInfo.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {language === 'ar' ? faq.question_ar : faq.question_en}
                        </h3>
                        <span className="text-sm text-blue-600">
                          {language === 'ar' ? categoryInfo.label_ar : categoryInfo.label_en}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl text-gray-400 transform transition-transform">
                        {expandedFAQ === faq.id ? '−' : '+'}
                      </span>
                    </div>
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <div className="pl-12 pt-2 border-t border-gray-100">
                        <p className="text-gray-700 leading-relaxed mt-3">
                          {language === 'ar' ? faq.answer_ar : faq.answer_en}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Category Grid View */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {language === 'ar' ? 'استكشف حسب التصنيف' : 'Explore by Category'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoriesWithCounts.map(category => (
                <div key={category.value} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                     onClick={() => setActiveCategory(category.value)}>
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    {language === 'ar' ? category.label_ar : category.label_en}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {category.count} {language === 'ar' ? 'سؤال' : 'questions'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'إحصائيات الأسئلة الشائعة' : 'FAQ Statistics'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">{activeFAQs.length}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'إجمالي الأسئلة' : 'Total Questions'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">{categoriesWithCounts.length}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'التصنيفات المتاحة' : 'Available Categories'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'الدعم المتاح' : 'Support Available'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {activeFAQs.slice(0, 6).map((faq) => {
              const categoryInfo = getCategoryInfo(faq.category);
              return (
                <div key={`quick-${faq.id}`} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="flex items-start space-x-3 mb-4">
                    <span className="text-2xl">{categoryInfo.icon}</span>
                    <div className="flex-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {language === 'ar' ? categoryInfo.label_ar : categoryInfo.label_en}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">
                    {language === 'ar' ? faq.question_ar : faq.question_en}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {language === 'ar' ? faq.answer_ar : faq.answer_en}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Contact Support */}
          <div className="text-center bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'لم تجد إجابة لسؤالك؟' : 'Didn\'t Find Your Answer?'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'فريق الدعم الفني متاح لمساعدتك في أي وقت. لا تتردد في التواصل معنا'
                : 'Our technical support team is available to help you anytime. Don\'t hesitate to contact us'
              }
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                {language === 'ar' ? '📞 اتصل بنا' : '📞 Call Us'}
              </button>
              <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                {language === 'ar' ? '💬 دردشة مباشرة' : '💬 Live Chat'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 