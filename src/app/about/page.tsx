'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  
  const stats = [
    { value: '15+', label: t('about.stats.experience'), icon: '🏆' },
    { value: '50K+', label: t('about.stats.customers'), icon: '👥' },
    { value: '1000+', label: t('about.stats.projects'), icon: '🏗️' },
    { value: '24/7', label: t('about.stats.support'), icon: '🛟' }
  ];

  const values = [
    {
      title: t('about.values.quality.title'),
      description: t('about.values.quality.desc'),
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: t('about.values.support.title'),
      description: t('about.values.support.desc'),
      icon: '🎯',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.desc'),
      icon: '🚀',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: t('about.values.reliability.title'),
      description: t('about.values.reliability.desc'),
      icon: '🛡️',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const team = [
    {
      name: t('about.team.ahmed.name'),
      role: t('about.team.ahmed.role'),
      experience: t('about.team.ahmed.experience'),
      image: '👨‍💼',
      specialty: t('about.team.ahmed.specialty')
    },
    {
      name: t('about.team.sarah.name'),
      role: t('about.team.sarah.role'),
      experience: t('about.team.sarah.experience'),
      image: '👩‍💼',
      specialty: t('about.team.sarah.specialty')
    },
    {
      name: t('about.team.omar.name'),
      role: t('about.team.omar.role'),
      experience: t('about.team.omar.experience'),
      image: '👨‍🔧',
      specialty: t('about.team.omar.specialty')
    },
    {
      name: t('about.team.fatima.name'),
      role: t('about.team.fatima.role'),
      experience: t('about.team.fatima.experience'),
      image: '👩‍💻',
      specialty: t('about.team.fatima.specialty')
    }
  ];

  const milestones = [
    { year: '2009', event: t('about.milestones.2009.event'), description: t('about.milestones.2009.desc') },
    { year: '2012', event: t('about.milestones.2012.event'), description: t('about.milestones.2012.desc') },
    { year: '2015', event: t('about.milestones.2015.event'), description: t('about.milestones.2015.desc') },
    { year: '2018', event: t('about.milestones.2018.event'), description: t('about.milestones.2018.desc') },
    { year: '2021', event: t('about.milestones.2021.event'), description: t('about.milestones.2021.desc') },
    { year: '2024', event: t('about.milestones.2024.event'), description: t('about.milestones.2024.desc') }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gray-50 to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl opacity-25" />
        <div className="absolute top-1/4 left-1/5 w-32 h-32 bg-gradient-to-br from-red-200 to-transparent rounded-full blur-2xl opacity-15" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Header />
        
        {/* Modern Hero Section */}
        <section className="hero-modern relative pt-28 pb-20">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-20 w-20 h-20 bg-red-500 bg-opacity-5 rounded-full animate-float" />
            <div className="absolute top-48 right-32 w-16 h-16 bg-red-500 bg-opacity-10 rounded-full animate-pulse-modern" />
            <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gray-500 bg-opacity-5 rounded-full animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-48 right-1/3 w-18 h-18 bg-red-500 bg-opacity-7 rounded-full animate-pulse-modern" style={{animationDelay: '2s'}} />
          </div>
          
          <div className="container-modern relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-modern">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-8">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-8 0H3m2 0h6M9 7h6m-6 4h6m-6 4h6" />
                    </svg>
                    {t('about.badge')}
                  </span>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-modern-heading mb-8">
                  {t('about.title')}
                </h1>
                
                {/* Description */}
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  {t('about.subtitle')}
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/products"
                    className="btn-modern-primary inline-flex items-center gap-2 group/btn"
                  >
                    <span>{t('about.explore.products')}</span>
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <button className="btn-modern-outline inline-flex items-center gap-2 group/btn">
                    <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{t('about.contact.us')}</span>
                  </button>
                </div>
              </div>
              
              <div className="relative animate-slide-modern" style={{animationDelay: '0.3s'}}>
                <div className="glass-modern p-10 rounded-3xl">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-3xl">
                      🏗️
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('about.mission')}</h3>
                    <p className="text-gray-900 leading-relaxed text-2xl font-semibold mb-2">
                      {t('about.mission.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-modern bg-gradient-subtle">
          <div className="container-modern">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="card-modern-2030 group text-center animate-slide-modern"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="p-8">
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="stat-number-modern text-4xl mb-4">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="section-modern">
          <div className="container-modern">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-modern">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  {t('about.story.title')} <span className="text-modern-accent">{t('about.story.highlight')}</span>
                </h2>
                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                  <p>{t('about.story.paragraph1')}</p>
                  <p>{t('about.story.paragraph2')}</p>
                  <p>{t('about.story.paragraph3')}</p>
                </div>
              </div>
              <div className="relative animate-slide-modern" style={{animationDelay: '0.2s'}}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="card-modern-2030 group text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
                      🔨
                    </div>
                    <div className="font-semibold text-gray-900">{t('about.story.features.premium')}</div>
                  </div>
                  <div className="card-modern-2030 group text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
                      🛡️
                    </div>
                    <div className="font-semibold text-gray-900">{t('about.story.features.safety')}</div>
                  </div>
                  <div className="card-modern-2030 group text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
                      ⚡
                    </div>
                    <div className="font-semibold text-gray-900">{t('about.story.features.innovation')}</div>
                  </div>
                  <div className="card-modern-2030 group text-center p-6">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
                      🎯
                    </div>
                    <div className="font-semibold text-gray-900">{t('about.story.features.excellence')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-modern bg-gradient-subtle">
          <div className="container-modern">
            <div className="text-center mb-16 animate-slide-modern">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('about.values.title')} <span className="text-modern-accent">{t('about.values.highlight')}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('about.values.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div 
                  key={index} 
                  className="card-modern-2030 group overflow-hidden animate-slide-modern"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className={`p-8 bg-gradient-to-r ${value.color} text-white text-center relative overflow-hidden`}>
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                      <div className="absolute inset-0 bg-white" />
                    </div>
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{value.icon}</div>
                      <h3 className="text-xl font-bold">{value.title}</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-modern">
          <div className="container-modern">
            <div className="text-center mb-16 animate-slide-modern">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('about.journey.title')} <span className="text-modern-accent">{t('about.journey.highlight')}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('about.journey.description')}
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-500 via-red-400 to-orange-500 rounded-full"></div>
              <div className="space-y-16">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center animate-slide-modern ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    style={{animationDelay: `${index * 0.2}s`}}
                  >
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                      <div className="card-modern-2030 p-8 group">
                        <div className="text-red-600 font-bold text-2xl mb-4 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          {milestone.year}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">{milestone.event}</h3>
                        <p className="text-gray-600 leading-relaxed text-lg">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="relative z-10">
                      <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section-modern bg-gradient-subtle">
          <div className="container-modern">
            <div className="text-center mb-16 animate-slide-modern">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {t('about.team.title')} <span className="text-modern-accent">{t('about.team.highlight')}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('about.team.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div 
                  key={index} 
                  className="card-modern-2030 group overflow-hidden animate-slide-modern"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                      {member.image}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{member.name}</h3>
                    <div className="text-red-600 font-semibold mb-3">{member.role}</div>
                    <div className="text-sm text-gray-600 mb-4 leading-relaxed">{member.experience}</div>
                    <div className="inline-block px-4 py-2 glass-modern text-gray-700 text-sm rounded-full font-medium">
                      {member.specialty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications & Partnerships */}
        <section className="section-modern bg-gradient-to-br from-white via-gray-50 to-red-50 text-gray-800 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-32 h-32 bg-red-200 bg-opacity-30 rounded-full blur-2xl" />
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-gray-200 bg-opacity-40 rounded-full blur-xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-red-100 bg-opacity-50 rounded-full blur-3xl" />
          </div>
          
          <div className="container-modern relative z-10">
            <div className="text-center mb-16 animate-slide-modern">
              <h2 className="text-4xl font-bold mb-6">
                {t('about.certifications.title')} <span className="text-gradient-accent">{t('about.certifications.highlight')}</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {t('about.certifications.description')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: t('about.certifications.iso.name'), description: t('about.certifications.iso.desc'), icon: '🏅' },
                { name: t('about.certifications.osha.name'), description: t('about.certifications.osha.desc'), icon: '🛡️' },
                { name: t('about.certifications.dewalt.name'), description: t('about.certifications.dewalt.desc'), icon: '🤝' },
                { name: t('about.certifications.leader.name'), description: t('about.certifications.leader.desc'), icon: '⭐' }
              ].map((cert, index) => (
                <div 
                  key={index} 
                  className="card-social-modern group p-8 text-center backdrop-blur-lg animate-slide-modern"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {cert.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-4 text-gray-800 group-hover:text-red-600 transition-colors">{cert.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-modern">
          <div className="container-modern">
            <div className="text-center animate-slide-modern">
              <div className="glass-modern p-16 rounded-3xl max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">
                  {t('about.cta.title')}
                </h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
                  {t('about.cta.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link 
                    href="/products"
                    className="btn-modern-primary inline-flex items-center gap-2 group/btn"
                  >
                    <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>{t('about.cta.shop')}</span>
                  </Link>
                  <Link 
                    href="/categories"
                    className="btn-modern-outline inline-flex items-center gap-2 group/btn"
                  >
                    <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>{t('about.cta.browse')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
} 