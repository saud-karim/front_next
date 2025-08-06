'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    projectType: 'residential'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        projectType: 'residential'
      });
    }, 2000);
  };

  const contactInfo = [
    {
      title: t('contact.info.office.title'),
      details: [
        t('contact.info.office.street'),
        t('contact.info.office.district'),
        t('contact.info.office.country')
      ],
      icon: '📍',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: t('contact.info.phone.title'),
      details: [
        '+20 123 456 7890',
        '+20 987 654 3210',
        t('contact.info.phone.toll')
      ],
      icon: '📞',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: t('contact.info.email.title'),
      details: [
        'info@bstools.com',
        'sales@bstools.com',
        'support@bstools.com'
      ],
      icon: '✉️',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: t('contact.info.hours.title'),
      details: [
        t('contact.info.hours.weekdays'),
        t('contact.info.hours.saturday'),
        t('contact.info.hours.sunday')
      ],
      icon: '🕒',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const departments = [
    {
      name: t('contact.departments.sales.name'),
      description: t('contact.departments.sales.desc'),
      phone: '+20 123 456 7891',
      email: 'sales@bstools.com',
      icon: '💼',
      color: 'bg-blue-500'
    },
    {
      name: t('contact.departments.support.name'),
      description: t('contact.departments.support.desc'),
      phone: '+20 123 456 7892',
      email: 'support@bstools.com',
      icon: '🔧',
      color: 'bg-green-500'
    },
    {
      name: t('contact.departments.service.name'),
      description: t('contact.departments.service.desc'),
      phone: '+20 123 456 7893',
      email: 'service@bstools.com',
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      name: t('contact.departments.partnerships.name'),
      description: t('contact.departments.partnerships.desc'),
      phone: '+20 123 456 7894',
      email: 'partners@bstools.com',
      icon: '🤝',
      color: 'bg-orange-500'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#', color: 'bg-blue-600' },
    { name: 'Twitter', icon: '🐦', url: '#', color: 'bg-sky-500' },
    { name: 'LinkedIn', icon: '💼', url: '#', color: 'bg-blue-700' },
    { name: 'Instagram', icon: '📷', url: '#', color: 'bg-pink-500' },
    { name: 'YouTube', icon: '📺', url: '#', color: 'bg-red-600' },
    { name: 'WhatsApp', icon: '💬', url: '#', color: 'bg-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
            📞 {t('contact.badge')}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {t('contact.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold mb-1">{t('contact.hero.quick')}</div>
              <div className="text-sm text-gray-300">{t('contact.hero.quick.desc')}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold mb-1">{t('contact.hero.expert')}</div>
              <div className="text-sm text-gray-300">{t('contact.hero.expert.desc')}</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="font-bold mb-1">{t('contact.hero.support')}</div>
              <div className="text-sm text-gray-300">{t('contact.hero.support.desc')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('contact.form.title')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('contact.form.subtitle')}
              </p>

              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
{t('contact.form.success')}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={t('contact.form.name.placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={t('contact.form.email.placeholder')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={t('contact.form.phone.placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={t('contact.form.company.placeholder')}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.project')}
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="residential">{t('contact.form.project.residential')}</option>
                      <option value="commercial">{t('contact.form.project.commercial')}</option>
                      <option value="industrial">{t('contact.form.project.industrial')}</option>
                      <option value="infrastructure">{t('contact.form.project.infrastructure')}</option>
                      <option value="renovation">{t('contact.form.project.renovation')}</option>
                      <option value="other">{t('contact.form.project.other')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.subject')} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder={t('contact.form.subject.placeholder')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={t('contact.form.message.placeholder')}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'gradient-red text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('contact.form.sending')}
                    </div>
                  ) : (
                    t('contact.send')
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('contact.info.title')} <span className="text-gradient">{t('contact.info.highlight')}</span>
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start">
                      <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center text-white text-xl mr-4 flex-shrink-0`}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600 mb-1">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <div className="text-gray-700 font-semibold">{t('contact.map.title')}</div>
                  <div className="text-gray-600 text-sm">{t('contact.map.desc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('contact.departments.title')} <span className="text-gradient">{t('contact.departments.highlight')}</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('contact.departments.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="card-hover bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className={`p-4 ${dept.color} text-white text-center`}>
                  <div className="text-3xl mb-2">{dept.icon}</div>
                  <h3 className="font-bold">{dept.name}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="mr-2">📞</span>
                      <a href={`tel:${dept.phone}`} className="hover:text-red-600">{dept.phone}</a>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="mr-2">✉️</span>
                      <a href={`mailto:${dept.email}`} className="hover:text-red-600">{dept.email}</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('contact.faq.title')} <span className="text-gradient">{t('contact.faq.highlight')}</span>
            </h2>
            <p className="text-gray-600">
              {t('contact.faq.description')}
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: t('contact.faq.return.question'),
                answer: t('contact.faq.return.answer')
              },
              {
                question: t('contact.faq.bulk.question'),
                answer: t('contact.faq.bulk.answer')
              },
              {
                question: t('contact.faq.shipping.question'),
                answer: t('contact.faq.shipping.answer')
              },
              {
                question: t('contact.faq.support.question'),
                answer: t('contact.faq.support.answer')
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Additional Contact */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('contact.social.title')} <span className="text-gradient">{t('contact.social.highlight')}</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('contact.social.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className={`${social.color} rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300`}
              >
                <div className="text-4xl mb-3">{social.icon}</div>
                <div className="font-semibold">{t('contact.social.follow')} {social.name}</div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">{t('contact.cta.title')}</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+201234567890"
                className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold"
              >
                📞 {t('contact.cta.call')}: +20 123 456 7890
              </a>
              <a 
                href="mailto:info@bstools.com"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold"
              >
                ✉️ {t('contact.cta.email')}: info@bstools.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 