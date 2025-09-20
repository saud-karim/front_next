'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface SocialLink {
  id?: number;
  platform: string;
  url: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
}

// نظام mapping بين الرموز القصيرة والفونت أوسوم (نفس النظام من SocialLinksTab)
const ICON_MAPPING = {
  'FB': 'fab fa-facebook',
  'IG': 'fab fa-instagram', 
  'TW': 'fab fa-twitter',
  'LI': 'fab fa-linkedin',
  'WA': 'fab fa-whatsapp',
  'TG': 'fab fa-telegram',
  'YT': 'fab fa-youtube',
  'TK': 'fab fa-tiktok',
  'SC': 'fab fa-snapchat',
  'PT': 'fab fa-pinterest',
  'WS': 'fas fa-globe',
  'CU': 'fas fa-link'
};

// دالة للحصول على فونت أوسوم من الرمز القصير
const getFontAwesomeIcon = (shortCode: string): string => {
  return ICON_MAPPING[shortCode as keyof typeof ICON_MAPPING] || 'fas fa-question';
};

interface SocialLinksPreviewProps {
  data: SocialLink[];
}

export default function SocialLinksPreview({ data }: SocialLinksPreviewProps) {
  const { language } = useLanguage();

  const activeSocialLinks = data
    .filter(link => link.is_active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'تابعونا على' : 'Follow Us On'}
        </h2>
        <p className="text-gray-600">
          {language === 'ar' ? 'ابقوا على تواصل معنا عبر منصات التواصل الاجتماعي' : 'Stay connected with us on social media'}
        </p>
      </div>

      {activeSocialLinks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔗</div>
          <p className="text-gray-500">
            {language === 'ar' ? 'لا توجد روابط اجتماعية متاحة' : 'No social links available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {activeSocialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: link.color }}
              >
                <i className={`${getFontAwesomeIcon(link.icon)} text-2xl`}></i>
              </div>
              <span className="text-sm font-medium text-gray-900 capitalize">
                {link.platform}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Alternative Style */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          {language === 'ar' ? 'أسلوب أفقي' : 'Horizontal Style'}
        </h3>
        
        {activeSocialLinks.length > 0 && (
          <div className="flex justify-center items-center space-x-4">
            {activeSocialLinks.map((link) => (
              <a
                key={`horizontal-${link.id}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-full hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: link.color }}
                title={link.platform}
              >
                <i className={`${getFontAwesomeIcon(link.icon)} text-xl text-white group-hover:scale-125 transition-transform`}></i>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer Style */}
      <div className="mt-16 bg-gray-900 rounded-xl p-8 text-white">
        <h3 className="text-xl font-semibold mb-6 text-center">
          {language === 'ar' ? 'أسلوب القدم' : 'Footer Style'}
        </h3>
        
        {activeSocialLinks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeSocialLinks.map((link) => (
              <a
                key={`footer-${link.id}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: link.color }}
                >
                  <i className={`${getFontAwesomeIcon(link.icon)} text-lg text-white`}></i>
                </div>
                <div>
                  <div className="font-medium capitalize">{link.platform}</div>
                  <div className="text-sm text-gray-300 truncate">
                    {link.url.replace(/^https?:\/\//, '')}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            {language === 'ar' ? 'لا توجد روابط متاحة' : 'No links available'}
          </p>
        )}
      </div>
    </div>
  );
} 