'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t, language } = useLanguage();

  const features = [
    {
      title: language === 'ar' ? 'جودة عالية' : 'High Quality',
      description: language === 'ar' ? 'منتجات عالية الجودة مضمونة' : 'High quality products guaranteed',
      icon: '⭐',
      gradient: 'from-yellow-400 to-yellow-600'
    },
    {
      title: language === 'ar' ? 'توصيل سريع' : 'Fast Delivery', 
      description: language === 'ar' ? 'خدمة توصيل سريعة في جميع أنحاء البلاد' : 'Fast delivery service nationwide',
      icon: '🚚',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      title: language === 'ar' ? 'دعم فني' : 'Technical Support',
      description: language === 'ar' ? 'فريق دعم فني متخصص متاح على مدار الساعة' : 'Professional technical support team available 24/7',
      icon: '🔧',
      gradient: 'from-green-400 to-green-600'
    },
    {
      title: language === 'ar' ? 'أسعار منافسة' : 'Competitive Prices',
      description: language === 'ar' ? 'أفضل الأسعار في السوق مع ضمان الجودة' : 'Best prices in the market with quality guarantee',
      icon: '💰',
      gradient: 'from-red-400 to-red-600'
    }
  ];

  const stats = [
    { 
      value: '15+', 
      label: language === 'ar' ? 'سنة خبرة' : 'Years of Experience', 
      icon: '🏆',
      gradient: 'from-purple-500 to-purple-700'
    },
    { 
      value: '50K+', 
      label: t('about.stats.customers'), 
      icon: '👥',
      gradient: 'from-blue-500 to-blue-700'
    },
    { 
      value: '1000+', 
      label: t('about.stats.projects'), 
      icon: '🏗️',
      gradient: 'from-green-500 to-green-700'
    },
    { 
      value: '24/7', 
      label: t('about.stats.support'), 
      icon: '🛟',
      gradient: 'from-red-500 to-red-700'
    }
  ];

  return (
    <section className="section-modern relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-gray-100 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container-modern relative">
        {/* Section Header */}
        <div className="text-center mb-20 animate-slide-modern">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {t('about.badge.info')}
            </div>
          <h2 className="text-modern-heading mb-6">
            {t('about.title')}
            </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('about.description.text')}
          </p>
                </div>

        {/* Features Grid */}
        <div className="grid-modern mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group animate-slide-modern"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="card-modern-2030 p-8 text-center h-full relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient}`} />
                </div>
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-4xl filter group-hover:drop-shadow-lg">
                      {feature.icon}
                    </span>
              </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
            </div>

        {/* Stats Section */}
        <div className="animate-slide-modern" style={{animationDelay: '0.6s'}}>
          <div className="glass-modern rounded-3xl p-12 mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('common.stats.speak')}</h3>
              <p className="text-gray-600">{t('common.achievements')}</p>
          </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group cursor-pointer"
                  style={{animationDelay: `${0.8 + index * 0.1}s`}}
                >
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform">
                    {stat.value}
            </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-slide-modern" style={{animationDelay: '1s'}}>
          <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              {t('common.ready.start')}
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('common.contact.today')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/products"
                className="btn-modern-primary inline-flex items-center gap-2"
              >
                <span>{t('common.browse.products')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/contact"
                className="btn-modern-outline inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>
                  {t('common.learn.more')}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}