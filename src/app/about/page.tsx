'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import ApiService from '../services/api';
import { formatStat } from '../utils/statsFormatter';

// Dynamic content interfaces
interface PageContentData {
  about_page: {
    badge_ar: string;
    badge_en: string;
    title_ar: string;
    title_en: string;
    subtitle_ar: string;
    subtitle_en: string;
  };
}

interface CompanyStatsData {
  years_experience: number;
  happy_customers: number;
  completed_projects: number;
  support_available: boolean;
}

interface CompanyInfoData {
  id?: number;
  company_name_ar: string;
  company_name_en: string;
  company_description_ar: string;
  company_description_en: string;
  mission_ar: string;
  mission_en: string;
  vision_ar: string;
  vision_en: string;
  logo_text: string;
  founded_year: string;
  employees_count: string;
  created_at?: string;
  updated_at?: string;
}

interface CompanyValue {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  order_index: number;
}

interface TeamMember {
  id: number;
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  experience_ar: string;
  experience_en: string;
  image?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  order: number;
  is_active: boolean;
}

interface Milestone {
  id: number;
  year: string;
  event_ar: string;
  event_en: string;
  description_ar: string;
  description_en: string;
  order: number;
  is_active: boolean;
}

interface CompanyStory {
  paragraph1_ar: string;
  paragraph1_en: string;
  paragraph2_ar: string;
  paragraph2_en: string;
  paragraph3_ar: string;
  paragraph3_en: string;
  features: Array<{
    title_ar: string;
    title_en: string;
  }>;
}

interface Certification {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  issuer_ar: string;
  issuer_en: string;
  issue_date: string;
  expiry_date?: string;
  image?: string;
  order: number;
  is_active: boolean;
}

export default function AboutPage() {
  const { t, language } = useLanguage();
  
  // Dynamic content states
  const [pageContent, setPageContent] = useState<PageContentData>({
    about_page: {
      badge_ar: 'عن الشركة',
      badge_en: 'About Company',
      title_ar: 'نحن رواد في صناعة أدوات البناء',
      title_en: 'We are pioneers in construction tools industry',
      subtitle_ar: 'منذ أكثر من 15 عامًا ونحن نقدم أفضل الأدوات والحلول للبناء والإنشاءات',
      subtitle_en: 'For over 15 years, we have been providing the best tools and solutions for construction'
    }
  });

  const [companyStats, setCompanyStats] = useState<CompanyStatsData>({
    years_experience: 15,
    happy_customers: 50000,
    completed_projects: 1000,
    support_available: true
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfoData>({
    company_name_ar: 'بي إس تولز',
    company_name_en: 'BS Tools',
    company_description_ar: 'شركة رائدة في مجال أدوات ومواد البناء منذ أكثر من 15 عاماً، تقدم حلولاً شاملة ومبتكرة لقطاع الإنشاءات والبناء',
    company_description_en: 'Leading company in construction tools and materials for over 15 years, providing comprehensive and innovative solutions for the construction and building sector',
    mission_ar: 'نسعى لتوفير أفضل أدوات ومواد البناء بأعلى جودة وأسعار تنافسية، مع تقديم خدمة عملاء استثنائية وحلول مبتكرة لجميع احتياجات البناء والتشييد',
    mission_en: 'We strive to provide the best construction tools and materials with the highest quality and competitive prices, while delivering exceptional customer service and innovative solutions for all construction and building needs',
    vision_ar: 'أن نكون الشركة الرائدة في منطقة الشرق الأوسط في توفير أدوات ومواد البناء عالية الجودة، والشريك المفضل لكل مقاول ومهندس',
    vision_en: 'To be the leading company in the Middle East for providing high-quality construction tools and materials, and the preferred partner for every contractor and engineer',
    logo_text: 'BS',
    founded_year: '2009',
    employees_count: '150+'
  });

  const [companyValues, setCompanyValues] = useState<CompanyValue[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [companyStory, setCompanyStory] = useState<CompanyStory>({
    paragraph1_ar: 'بدأت شركتنا كحلم صغير في عام 2009، بهدف توفير أدوات البناء عالية الجودة للمقاولين والحرفيين.',
    paragraph1_en: 'Our company started as a small dream in 2009, aiming to provide high-quality construction tools for contractors and craftsmen.',
    paragraph2_ar: 'على مر السنين، نمت شركتنا لتصبح واحدة من أكثر الشركات الموثوقة في المنطقة.',
    paragraph2_en: 'Over the years, our company has grown to become one of the most trusted companies in the region.',
    paragraph3_ar: 'اليوم، نفخر بخدمة آلاف العملاء وتقديم أفضل الحلول لمشاريعهم.',
    paragraph3_en: 'Today, we are proud to serve thousands of customers and provide the best solutions for their projects.',
    features: [
      { title_ar: 'أدوات عالية الجودة', title_en: 'Premium Tools' },
      { title_ar: 'معايير السلامة', title_en: 'Safety Standards' },
      { title_ar: 'الابتكار التقني', title_en: 'Technical Innovation' },
      { title_ar: 'التميز في الخدمة', title_en: 'Service Excellence' }
    ]
  });

  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dynamic content using Public APIs
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load page content using public API
        const pageResponse = await ApiService.getPublicPageContent();
        if (pageResponse.success && pageResponse.data) {
          setPageContent(pageResponse.data);
        }

        // Load company stats using public API
        const statsResponse = await ApiService.getPublicCompanyStats();
        if (statsResponse.success && statsResponse.data) {
          console.log('🔍 About Page - Raw API data:', statsResponse.data);
          
          // تحويل أسماء الـ fields من API إلى Frontend format
          const convertedStats = {
            years_experience: parseInt(statsResponse.data.years_experience) || 15,
            happy_customers: parseInt(statsResponse.data.total_customers || statsResponse.data.happy_customers) || 50000,
            completed_projects: parseInt(statsResponse.data.completed_projects) || 1000,
            support_available: statsResponse.data.support_availability === 'true' || statsResponse.data.support_availability === true || statsResponse.data.support_available === true
          };
          
          console.log('✅ About Page - Converted stats:', convertedStats);
          setCompanyStats(convertedStats);
        } else {
          console.log('❌ About Page - Failed to load stats:', statsResponse);
        }

        // Load company info using public API
        const infoResponse = await ApiService.getPublicCompanyInfo();
        if (infoResponse.success && infoResponse.data) {
          console.log('🏢 About Page - Raw Company Info API data:', infoResponse.data);
          
          // تحديث companyInfo مع التأكد من field names صحيحة
          const mappedInfo = {
            company_name_ar: infoResponse.data.company_name_ar || companyInfo.company_name_ar,
            company_name_en: infoResponse.data.company_name_en || companyInfo.company_name_en,
            company_description_ar: infoResponse.data.company_description_ar || companyInfo.company_description_ar,
            company_description_en: infoResponse.data.company_description_en || companyInfo.company_description_en,
            mission_ar: infoResponse.data.mission_ar || companyInfo.mission_ar,
            mission_en: infoResponse.data.mission_en || companyInfo.mission_en,
            vision_ar: infoResponse.data.vision_ar || companyInfo.vision_ar,
            vision_en: infoResponse.data.vision_en || companyInfo.vision_en,
            logo_text: infoResponse.data.logo_text || companyInfo.logo_text,
            founded_year: infoResponse.data.founded_year || companyInfo.founded_year,
            employees_count: infoResponse.data.employees_count || companyInfo.employees_count,
            id: infoResponse.data.id,
            created_at: infoResponse.data.created_at,
            updated_at: infoResponse.data.updated_at
          };
          
          console.log('✅ About Page - Mapped Company Info:', mappedInfo);
          setCompanyInfo(mappedInfo);
        } else {
          console.log('❌ About Page - Failed to load company info:', infoResponse);
        }

        // Load company values using public API
        const valuesResponse = await ApiService.getPublicCompanyValues();
        if (valuesResponse.success && valuesResponse.data) {
          const activeValues = valuesResponse.data.sort((a, b) => a.order_index - b.order_index);
          setCompanyValues(activeValues);
        }

        // Load team members using public API
        const teamResponse = await ApiService.getPublicTeamMembers();
        if (teamResponse.success && teamResponse.data) {
          const activeTeam = teamResponse.data
            .filter(member => member.is_active)
            .sort((a, b) => a.order - b.order);
          setTeamMembers(activeTeam);
        }

        // Load milestones using public API
        const milestonesResponse = await ApiService.getPublicCompanyMilestones();
        if (milestonesResponse.success && milestonesResponse.data) {
          const activeMilestones = milestonesResponse.data
            .filter(milestone => milestone.is_active)
            .sort((a, b) => a.order - b.order);
          setMilestones(activeMilestones);
        }

        // Load company story using public API
        const storyResponse = await ApiService.getPublicCompanyStory();
        if (storyResponse.success && storyResponse.data) {
          setCompanyStory(storyResponse.data);
        }

        // Load certifications using public API
        const certsResponse = await ApiService.getPublicCertifications();
        if (certsResponse.success && certsResponse.data) {
          const activeCerts = certsResponse.data
            .filter(cert => cert.is_active)
            .sort((a, b) => a.order - b.order);
          setCertifications(activeCerts);
        }

      } catch (error) {
        console.log('About page: Using fallback data due to API error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Prepare stats for display using unified formatter
  const stats = [
    { 
      value: formatStat('years_experience', companyStats.years_experience, language).formatted, 
      label: t('about.stats.experience'), 
      icon: '🏆' 
    },
    { 
      value: formatStat('happy_customers', companyStats.happy_customers, language).formatted, 
      label: t('about.stats.customers'), 
      icon: '👥' 
    },
    { 
      value: formatStat('completed_projects', companyStats.completed_projects, language).formatted, 
      label: t('about.stats.projects'), 
      icon: '🏗️' 
    },
    { 
      value: formatStat('support_available', companyStats.support_available, language).formatted, 
      label: t('about.stats.support'), 
      icon: '🛟' 
    }
  ];

  // Fallback values if empty arrays
  const values = companyValues.length > 0 ? companyValues.map(value => ({
    title: language === 'ar' ? value.title_ar : value.title_en,
    description: language === 'ar' ? value.description_ar : value.description_en,
    icon: value.icon,
    color: getGradientColor(value.order_index)
  })) : [
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

  const team = teamMembers.length > 0 ? teamMembers.map(member => ({
    name: language === 'ar' ? member.name_ar : member.name_en,
    role: language === 'ar' ? member.role_ar : member.role_en,
    experience: language === 'ar' ? member.experience_ar : member.experience_en,
    image: member.image || '👤'
  })) : [
    {
      name: t('about.team.ahmed.name'),
      role: t('about.team.ahmed.role'),
      experience: t('about.team.ahmed.experience'),
      image: '👨‍💼'
    },
    {
      name: t('about.team.sarah.name'),
      role: t('about.team.sarah.role'),
      experience: t('about.team.sarah.experience'),
      image: '👩‍💼'
    },
    {
      name: t('about.team.omar.name'),
      role: t('about.team.omar.role'),
      experience: t('about.team.omar.experience'),
      image: '👨‍🔧'
    },
    {
      name: t('about.team.fatima.name'),
      role: t('about.team.fatima.role'),
      experience: t('about.team.fatima.experience'),
      image: '👩‍💻'
    }
  ];

  const milestonesData = milestones.length > 0 ? milestones.map(milestone => ({
    year: milestone.year,
    event: language === 'ar' ? milestone.event_ar : milestone.event_en,
    description: language === 'ar' ? milestone.description_ar : milestone.description_en
  })) : [
    { year: '2009', event: t('about.milestones.2009.event'), description: t('about.milestones.2009.desc') },
    { year: '2012', event: t('about.milestones.2012.event'), description: t('about.milestones.2012.desc') },
    { year: '2015', event: t('about.milestones.2015.event'), description: t('about.milestones.2015.desc') },
    { year: '2018', event: t('about.milestones.2018.event'), description: t('about.milestones.2018.desc') },
    { year: '2021', event: t('about.milestones.2021.event'), description: t('about.milestones.2021.desc') },
    { year: '2024', event: t('about.milestones.2024.event'), description: t('about.milestones.2024.desc') }
  ];

  const certificationsData = certifications.length > 0 ? certifications.map(cert => ({
    name: language === 'ar' ? cert.name_ar : cert.name_en,
    description: language === 'ar' ? cert.description_ar : cert.description_en,
    issuer: language === 'ar' ? cert.issuer_ar : cert.issuer_en,
    issue_date: cert.issue_date,
    expiry_date: cert.expiry_date,
    image: cert.image
  })) : [
    { name: t('about.certifications.iso.name'), description: t('about.certifications.iso.desc'), issuer: 'ISO', issue_date: '2020-01-15', expiry_date: '2023-01-15' },
    { name: t('about.certifications.osha.name'), description: t('about.certifications.osha.desc'), issuer: 'OSHA', issue_date: '2022-03-20', expiry_date: '2025-03-20' },
    { name: t('about.certifications.dewalt.name'), description: t('about.certifications.dewalt.desc'), issuer: 'DeWalt', issue_date: '2021-06-10', expiry_date: '2024-06-10' },
    { name: t('about.certifications.leader.name'), description: t('about.certifications.leader.desc'), issuer: 'Industry Leader', issue_date: '2023-01-01' }
  ];

  // Helper function for gradient colors
  function getGradientColor(index: number): string {
    const colors = [
      'from-yellow-500 to-orange-500',
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[index % colors.length];
  }

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
                    {language === 'ar' ? pageContent.about_page.badge_ar : pageContent.about_page.badge_en}
                  </span>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-modern-heading mb-8">
                  {language === 'ar' ? pageContent.about_page.title_ar : pageContent.about_page.title_en}
                </h1>
                
                {/* Description */}
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  {language === 'ar' ? companyInfo.company_description_ar : companyInfo.company_description_en}
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
                      {language === 'ar' ? companyInfo.mission_ar : companyInfo.mission_en}
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
                  <p>{language === 'ar' ? companyStory.paragraph1_ar : companyStory.paragraph1_en}</p>
                  <p>{language === 'ar' ? companyStory.paragraph2_ar : companyStory.paragraph2_en}</p>
                  <p>{language === 'ar' ? companyStory.paragraph3_ar : companyStory.paragraph3_en}</p>
                </div>
              </div>
              <div className="relative animate-slide-modern" style={{animationDelay: '0.2s'}}>
                <div className="grid grid-cols-2 gap-6">
                  {companyStory.features.map((feature, index) => (
                    <div key={index} className="card-modern-2030 group text-center p-6">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
                        {['🔨', '🛡️', '⚡', '🎯'][index] || '⭐'}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {language === 'ar' ? feature.title_ar : feature.title_en}
                      </div>
                    </div>
                  ))}
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
                {milestonesData.map((milestone, index) => (
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
              {certificationsData.map((cert, index) => (
                <div 
                  key={index} 
                  className="card-social-modern group p-8 text-center backdrop-blur-lg animate-slide-modern"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {cert.image ? (
                      <img src={cert.image} alt={cert.name} className="w-full h-full object-contain rounded-xl" />
                    ) : (
                      <span>📜</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-4 text-gray-800 group-hover:text-red-600 transition-colors">{cert.name}</h3>
                  <p className="text-gray-600 leading-relaxed mb-3">{cert.description}</p>
                  {cert.issuer && (
                    <p className="text-sm text-gray-500 font-medium">{language === 'ar' ? 'من: ' : 'Issued by: '}{cert.issuer}</p>
                  )}
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