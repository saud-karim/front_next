'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t, isRTL, language } = useLanguage();
  return (
    <section className="hero-modern relative pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500 bg-opacity-5 rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-20 h-20 bg-red-500 bg-opacity-10 rounded-full animate-pulse-modern" />
        <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-gray-500 bg-opacity-5 rounded-full animate-float" style={{animationDelay: '1s'}} />
      </div>

      <div className="container-modern relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <div className="animate-slide-modern">
            <h1 className="text-modern-heading mb-6">
              {t('hero.title')} 
              <span className="block text-modern-accent mt-2">
                {t('hero.title.highlight')}
              </span>
            </h1>
          </div>
            
          {/* Description */}
          <div className="animate-slide-modern" style={{animationDelay: '0.2s'}}>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="animate-slide-modern mb-20" style={{animationDelay: '0.4s'}}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="btn-modern-primary">
                <span className="flex items-center gap-2">
                  <span>{t('hero.explore.btn')}</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button className="btn-modern-outline">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{t('hero.quote.btn')}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Modern Stats */}
          <div className="animate-slide-modern" style={{animationDelay: '0.6s'}}>
            <div className="stats-modern">
              <div className="stat-item-modern">
                <div className="stat-number-modern">500+</div>
                <div className="text-gray-600 font-medium">{t('hero.stats.tools')}</div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity" />
                  </div>
              <div className="stat-item-modern">
                <div className="stat-number-modern">1000+</div>
                <div className="text-gray-600 font-medium">
                  {language === 'ar' ? 'مشروع منجز' : 'Completed Projects'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity" />
              </div>
              <div className="stat-item-modern">
                <div className="stat-number-modern">24/7</div>
                <div className="text-gray-600 font-medium">
                  {language === 'ar' ? 'دعم فني' : 'Technical Support'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-red-500 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}