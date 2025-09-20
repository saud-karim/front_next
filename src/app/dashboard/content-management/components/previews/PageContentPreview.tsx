'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface PageContent {
  id?: number;
  page_slug: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  meta_title_ar?: string;
  meta_title_en?: string;
  meta_description_ar?: string;
  meta_description_en?: string;
  is_active: boolean;
  order_index: number;
}

interface PageContentPreviewProps {
  data: PageContent[];
}

export default function PageContentPreview({ data }: PageContentPreviewProps) {
  const { language } = useLanguage();

  // الصفحات النشطة مرتبة حسب order_index
  const activePages = data
    .filter(page => page.is_active)
    .sort((a, b) => a.order_index - b.order_index);

  const getPageIcon = (slug: string) => {
    const icons: Record<string, string> = {
      'home': '🏠',
      'about': 'ℹ️',
      'services': '🛠️',
      'products': '📦',
      'contact': '📞',
      'privacy': '🔒',
      'terms': '📋',
      'faq': '❓',
      'blog': '📝',
      'news': '📰',
      'gallery': '🖼️',
      'testimonials': '💬'
    };
    return icons[slug] || '📄';
  };

  // محاكاة صفحة ويب مع محتوى ديناميكي
  return (
    <div className="bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">BuildTools BS</div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {activePages.slice(0, 6).map((page) => (
                <a 
                  key={page.id}
                  href="#"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <span>{getPageIcon(page.page_slug)}</span>
                  <span>{language === 'ar' ? page.title_ar : page.title_en}</span>
                </a>
              ))}
            </div>

            {/* Language Toggle */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-600">🌐</span>
              <span className="text-sm font-medium text-gray-700">
                {language === 'ar' ? 'العربية' : 'English'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50">
        {activePages.length > 0 ? (
          <div className="space-y-16 pb-16">
            {activePages.map((page, index) => (
              <section key={page.id} className={index === 0 ? 'pt-16' : ''}>
                {/* Page Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                  <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="text-6xl mb-4">{getPageIcon(page.page_slug)}</div>
                    <h1 className="text-4xl font-bold mb-4">
                      {language === 'ar' ? page.title_ar : page.title_en}
                    </h1>
                    {(page.meta_description_ar || page.meta_description_en) && (
                      <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        {language === 'ar' ? page.meta_description_ar : page.meta_description_en}
                      </p>
                    )}
                  </div>
                </div>

                {/* Page Content */}
                <div className="bg-white py-16">
                  <div className="max-w-4xl mx-auto px-6">
                    <div className="prose prose-lg max-w-none">
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: language === 'ar' ? page.content_ar : page.content_en 
                        }}
                      />
                    </div>

                    {/* Page Metadata */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {language === 'ar' ? 'معلومات الصفحة' : 'Page Information'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <span className="mr-2">🔗</span>
                            <span className="text-gray-600">
                              {language === 'ar' ? 'الرابط:' : 'URL:'} /{page.page_slug}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">📱</span>
                            <span className="text-gray-600">
                              {language === 'ar' ? 'متجاوب' : 'Responsive'} ✅
                            </span>
                          </div>
                          {page.meta_title_ar && (
                            <div className="flex items-center">
                              <span className="mr-2">🔍</span>
                              <span className="text-gray-600">
                                {language === 'ar' ? 'عنوان SEO:' : 'SEO Title:'} {language === 'ar' ? page.meta_title_ar : page.meta_title_en}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="mr-2">✅</span>
                            <span className="text-gray-600">
                              {language === 'ar' ? 'الحالة: نشطة' : 'Status: Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separator between pages */}
                {index < activePages.length - 1 && (
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'لا توجد صفحات' : 'No Pages Available'}
            </h2>
            <p className="text-gray-600">
              {language === 'ar' 
                ? 'أضف محتوى الصفحات لتظهر هنا' 
                : 'Add page content to display here'
              }
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">BuildTools BS</h3>
              <p className="text-gray-400 text-sm">
                {language === 'ar' 
                  ? 'أدوات البناء والتشييد عالية الجودة' 
                  : 'High-quality construction and building tools'
                }
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
              </h4>
              <ul className="space-y-2">
                {activePages.slice(0, 4).map((page) => (
                  <li key={page.id}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                      {language === 'ar' ? page.title_ar : page.title_en}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pages Count */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'إحصائيات الموقع' : 'Site Statistics'}
              </h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>{activePages.length} {language === 'ar' ? 'صفحة نشطة' : 'active pages'}</div>
                <div>{language === 'ar' ? 'متعدد اللغات' : 'Multi-language'} ✅</div>
                <div>{language === 'ar' ? 'محسن للموبايل' : 'Mobile optimized'} 📱</div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div>📞 +966 XX XXX XXXX</div>
                <div>📧 info@buildtools-bs.com</div>
                <div>📍 {language === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia'}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 BuildTools BS. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 