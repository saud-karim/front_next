'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import ApiService from '../services/api';

interface CompanyInfo {
  company_name_ar: string;
  company_name_en: string;
  company_description_ar: string;
  company_description_en: string;
}

interface ContactInfo {
  main_phone: string;
  main_email: string;
  address?: {
    street_ar: string;
    street_en: string;
    district_ar: string;
    district_en: string;
    city_ar: string;
    city_en: string;
    country_ar: string;
    country_en: string;
  };
}

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_active: boolean;
  order_index: number;
}

export default function Footer() {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  // Dynamic content states
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name_ar: 'بي إس تولز',
    company_name_en: 'BS Tools',
    company_description_ar: 'شركة رائدة في مجال أدوات ومواد البناء منذ أكثر من 15 عاماً',
    company_description_en: 'Leading company in construction tools and materials for over 15 years'
  });
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    main_phone: '+20 123 456 7890',
    main_email: 'info@bstools.com',
    address: {
      street_ar: 'شارع التحرير، المعادي',
      street_en: 'Tahrir Street, Maadi',
      district_ar: 'المعادي',
      district_en: 'Maadi',
      city_ar: 'القاهرة',
      city_en: 'Cairo',
      country_ar: 'مصر',
      country_en: 'Egypt'
    }
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🏢 Footer: Loading company info...');
        
        // Load company info using public API
        const companyResponse = await ApiService.getPublicCompanyInfo();
        if (companyResponse.success && companyResponse.data) {
          console.log('✅ Footer: Company info loaded:', companyResponse.data);
          setCompanyInfo({
            company_name_ar: companyResponse.data.company_name_ar || companyInfo.company_name_ar,
            company_name_en: companyResponse.data.company_name_en || companyInfo.company_name_en,
            company_description_ar: companyResponse.data.company_description_ar || companyInfo.company_description_ar,
            company_description_en: companyResponse.data.company_description_en || companyInfo.company_description_en
          });
        } else {
          console.log('❌ Footer: Failed to load company info:', companyResponse);
        }

        // Load contact info using public API
        const contactResponse = await ApiService.getPublicContactInfo();
        if (contactResponse.success && contactResponse.data) {
          setContactInfo({
            main_phone: contactResponse.data.main_phone || contactInfo.main_phone,
            main_email: contactResponse.data.main_email || contactInfo.main_email,
            address: contactResponse.data.address || contactInfo.address
          });
        }

        // Load social links using public API
        const socialResponse = await ApiService.getPublicSocialLinks();
        if (socialResponse.success && socialResponse.data) {
          const activeSocial = socialResponse.data
            .filter(link => link.is_active)
            .sort((a, b) => a.order_index - b.order_index);
          setSocialLinks(activeSocial);
        }

      } catch (error) {
        console.log('Footer: Using fallback data due to API error:', error);
      }
    };

    loadData();
  }, []);

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">BS</span>
              </div>
              <span className="text-lg font-semibold">
                {language === 'ar' ? companyInfo.company_name_ar : companyInfo.company_name_en}
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {language === 'ar' ? companyInfo.company_description_ar : companyInfo.company_description_en}
            </p>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    title={link.platform}
                  >
                    <span className="text-xs">{link.icon}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-red-500">📞</span>
                <span className="text-gray-300 text-sm">{contactInfo.main_phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-500">✉️</span>
                <span className="text-gray-300 text-sm">{contactInfo.main_email}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-red-500">📍</span>
                <span className="text-gray-300 text-sm">
                  {language === 'ar' 
                  ? `${contactInfo.address?.street_ar || ''}, ${contactInfo.address?.district_ar || ''}, ${contactInfo.address?.city_ar || ''}, ${contactInfo.address?.country_ar || ''}`.replace(/^,+|,+$/g, '').replace(/,\s*,/g, ',').trim()
                  : `${contactInfo.address?.street_en || ''}, ${contactInfo.address?.district_en || ''}, ${contactInfo.address?.city_en || ''}, ${contactInfo.address?.country_en || ''}`.replace(/^,+|,+$/g, '').replace(/,\s*,/g, ',').trim()
                }
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} {language === 'ar' ? companyInfo.company_name_ar : companyInfo.company_name_en}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}