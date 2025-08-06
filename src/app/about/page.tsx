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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
                🏢 {t('about.badge')}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t('about.title')}
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {t('about.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products"
                  className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-center"
                >
                  {t('about.explore.products')}
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold">
                  {t('about.contact.us')}
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏗️</div>
                  <h3 className="text-2xl font-bold mb-4">{t('about.mission')}</h3>
                  <p className="text-gray-300">
                    {t('about.mission.text')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-4">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('about.story.title')} <span className="text-gradient">{t('about.story.highlight')}</span>
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  {t('about.story.paragraph1')}
                </p>
                <p>
                  {t('about.story.paragraph2')}
                </p>
                <p>
                  {t('about.story.paragraph3')}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">🔨</div>
                  <div className="font-semibold text-gray-900">{t('about.story.features.premium')}</div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <div className="font-semibold text-gray-900">{t('about.story.features.safety')}</div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-semibold text-gray-900">{t('about.story.features.innovation')}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="font-semibold text-gray-900">{t('about.story.features.excellence')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about.values.title')} <span className="text-gradient">{t('about.values.highlight')}</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.values.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-hover group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className={`p-6 bg-gradient-to-r ${value.color} text-white text-center`}>
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about.journey.title')} <span className="text-gradient">{t('about.journey.highlight')}</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.journey.description')}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-500 to-orange-500"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="text-red-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.event}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('about.team.title')} <span className="text-gradient">{t('about.team.highlight')}</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('about.team.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card-hover group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-red-600 font-semibold mb-2">{member.role}</div>
                  <div className="text-sm text-gray-600 mb-3">{member.experience}</div>
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {member.specialty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Partnerships */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('about.certifications.title')} <span className="text-gradient">{t('about.certifications.highlight')}</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
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
              <div key={index} className="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
                <div className="text-4xl mb-3">{cert.icon}</div>
                <h3 className="text-lg font-bold mb-2">{cert.name}</h3>
                <p className="text-gray-300 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('about.cta.title')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('about.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold"
            >
              {t('about.cta.shop')}
            </Link>
            <Link 
              href="/categories"
              className="border-2 border-red-500 text-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 font-semibold"
            >
              {t('about.cta.browse')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 