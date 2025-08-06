'use client';

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('footer.products'),
      links: [
        { name: t('categories.power.title'), href: "/products/power-tools" },
        { name: t('categories.hand.title'), href: "/products/hand-tools" },
        { name: t('categories.safety.title'), href: "/products/safety" },
        { name: t('categories.measuring.title'), href: "/products/measuring" },
        { name: t('categories.materials.title'), href: "/products/materials" }
      ]
    },
    {
      title: t('footer.services'),
      links: [
        { name: t('footer.services.rental'), href: "/services/rental" },
        { name: t('footer.services.maintenance'), href: "/services/maintenance" },
        { name: t('footer.services.support'), href: "/services/support" },
        { name: t('footer.services.training'), href: "/services/training" },
        { name: t('footer.services.custom'), href: "/services/custom" }
      ]
    },
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about.us'), href: "/about" },
        { name: t('footer.company.story'), href: "/story" },
        { name: t('footer.company.careers'), href: "/careers" },
        { name: t('footer.company.news'), href: "/news" },
        { name: t('footer.company.partnerships'), href: "/partnerships" }
      ]
    },
    {
      title: t('footer.support'),
      links: [
        { name: t('footer.contact.us'), href: "/contact" },
        { name: t('footer.support.help'), href: "/help" },
        { name: t('footer.support.returns'), href: "/returns" },
        { name: t('footer.support.warranty'), href: "/warranty" },
        { name: t('footer.support.track'), href: "/track" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", href: "#" },
    { name: "Instagram", icon: "📷", href: "#" },
    { name: "Twitter", icon: "🐦", href: "#" },
    { name: "LinkedIn", icon: "💼", href: "#" },
    { name: "YouTube", icon: "📺", href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="gradient-bg py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-white">{t('footer.newsletter')}</h3>
              <p className="text-white/90 text-lg">
                {t('footer.newsletter.desc')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder={t('footer.email.placeholder')}
                className="flex-1 px-6 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="gradient-red text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold">
                {t('footer.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-12 h-12 metallic-effect rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    BS
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 gradient-red rounded transform rotate-45"></div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 gradient-red rounded-full"></div>
                  <div className="absolute -bottom-2 left-0 w-6 h-1 gradient-red rounded"></div>
                  <div className="absolute -bottom-2 left-2 w-4 h-1 gradient-red rounded"></div>
                  <div className="absolute -bottom-2 left-4 w-2 h-1 gradient-red rounded"></div>
                </div>
                <span className="ml-3 text-2xl font-bold">BuildTools</span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('footer.company.desc')}
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <span className="text-xl mr-3">📍</span>
                  <span>{t('footer.address')}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-xl mr-3">📞</span>
                  <span>{t('footer.phone')}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-xl mr-3">✉️</span>
                  <span>{t('footer.email')}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                  >
                    <span className="text-lg">{social.icon}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-6 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} BuildTools BS. {t('footer.rights')}
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-red-400 transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-red-400 transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-red-400 transition-colors">
                {t('footer.cookies')}
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-red-400 transition-colors">
                {t('footer.sitemap')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 gradient-red text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </footer>
  );
}