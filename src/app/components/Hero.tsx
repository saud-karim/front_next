'use client';

import { useLanguage } from '../context/LanguageContext';

export default function Hero() {
  const { t, isRTL } = useLanguage();
  return (
    <section className="relative pt-20 pb-16 gradient-bg overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-500/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
              {t('hero.badge')}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('hero.title')} 
              <span className="block text-transparent bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text">
                {t('hero.title.highlight')}
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              {t('hero.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-lg">
                {t('hero.explore.btn')}
              </button>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm font-semibold text-lg">
                {t('hero.quote.btn')}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-white/80 text-sm">{t('hero.stats.tools')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50k+</div>
                <div className="text-white/80 text-sm">{t('hero.stats.customers')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">25+</div>
                <div className="text-white/80 text-sm">{t('hero.stats.experience')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Tool Showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Tool Cards */}
              <div className="space-y-6">
                <div className="card-hover bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 gradient-red rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🔨</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{t('hero.tools.power.title')}</h3>
                  <p className="text-white/70 text-sm">{t('hero.tools.power.desc')}</p>
                </div>
                
                <div className="card-hover bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 metallic-effect rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{t('hero.tools.smart.title')}</h3>
                  <p className="text-white/70 text-sm">{t('hero.tools.smart.desc')}</p>
                </div>
              </div>

              <div className="space-y-6 pt-12">
                <div className="card-hover bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 metallic-effect rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{t('hero.tools.safety.title')}</h3>
                  <p className="text-white/70 text-sm">{t('hero.tools.safety.desc')}</p>
                </div>
                
                <div className="card-hover bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="w-12 h-12 gradient-red rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">📐</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{t('hero.tools.precision.title')}</h3>
                  <p className="text-white/70 text-sm">{t('hero.tools.precision.desc')}</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-gray-500/30 rounded-full blur-xl animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}