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
        { name: t('categories.measuring.title'), href: "/products/measuring" }
      ]
    },
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about.us'), href: "/about" },
        { name: t('footer.contact.us'), href: "/contact" },
        { name: t('footer.support.help'), href: "/help" },
        { name: t('footer.support.returns'), href: "/returns" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 text-black border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">{t('footer.newsletter')}</h3>
          <p className="text-gray-600 mb-6">{t('footer.newsletter.desc')}</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('footer.email.placeholder')}
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500"
              />
            <button className="btn-primary">
                {t('footer.subscribe')}
              </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm mr-3">
                  BS
                </div>
                <span className="text-lg font-semibold">Construction Tools</span>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {t('footer.company.desc')}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📍</span>
                  <span>{t('footer.address')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>📞</span>
                  <span>{t('footer.phone')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span>✉️</span>
                  <span>{t('footer.email')}</span>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-black mb-3">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href={link.href} className="text-sm text-gray-600 hover:text-red-500 transition-colors">
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

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 py-6 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="text-gray-600">
              © {currentYear} Construction Tools. {t('footer.rights')}
            </div>
            
            <div className="flex gap-4">
              <Link href="/privacy" className="text-gray-600 hover:text-red-500 transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-red-500 transition-colors">
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}