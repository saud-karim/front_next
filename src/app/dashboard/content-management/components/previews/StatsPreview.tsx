'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface CompanyStatsData {
  years_experience: number;
  happy_customers: number;
  completed_projects: number;
  support_available: boolean;
}

interface StatsPreviewProps {
  data: CompanyStatsData;
}

export default function StatsPreview({ data }: StatsPreviewProps) {
  const { language } = useLanguage();

  const statsConfig = [
    {
      key: 'years_experience' as const,
      nameAr: 'سنوات الخبرة',
      nameEn: 'Years of Experience',
      icon: '🏆',
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500',
      value: data.years_experience,
      suffix: language === 'ar' ? 'سنة' : 'Years'
    },
    {
      key: 'happy_customers' as const,
      nameAr: 'عميل سعيد',
      nameEn: 'Happy Customers',
      icon: '👥',
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-500',
      value: data.happy_customers,
      suffix: '+'
    },
    {
      key: 'completed_projects' as const,
      nameAr: 'مشروع مكتمل',
      nameEn: 'Completed Projects',
      icon: '🚧',
      color: 'from-orange-500 to-orange-600',
      borderColor: 'border-orange-500',
      value: data.completed_projects,
      suffix: '+'
    },
    {
      key: 'support_available' as const,
      nameAr: 'دعم متاح',
      nameEn: 'Support Available',
      icon: '⏰',
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500',
      value: data.support_available ? 24 : 0,
      suffix: data.support_available ? '/7' : ''
    }
  ];

  // تنسيق الأرقام
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'إنجازاتنا بالأرقام' : 'Our Achievements in Numbers'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'أرقام تعكس التزامنا بالتميز وثقة عملائنا بنا' 
              : 'Numbers that reflect our commitment to excellence and our customers\' trust'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsConfig.map((stat) => (
            <div 
              key={stat.key}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300"
            >
              {/* Icon */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>

              {/* Number */}
              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  {formatNumber(stat.value)}
                </span>
                <span className="text-xl text-gray-600">{stat.suffix}</span>
              </div>

              {/* Label */}
              <p className="text-gray-600 font-medium">
                {language === 'ar' ? stat.nameAr : stat.nameEn}
              </p>

              {/* Decorative border */}
              <div className={`w-12 h-1 ${stat.borderColor} rounded-full mx-auto mt-4`}></div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md inline-block">
            <div className="flex items-center justify-center space-x-4">
              <span className="text-2xl">🌟</span>
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-900">
                  {language === 'ar' ? 'منذ عام 2010' : 'Since 2010'}
                </p>
                <p className="text-sm text-gray-600">
                  {language === 'ar' ? 'نخدم عملاءنا بتميز' : 'Serving our customers with excellence'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 