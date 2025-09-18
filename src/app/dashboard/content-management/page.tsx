'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

// Tab Components
import CompanyInfoTab from './components/CompanyInfoTab';
import CompanyStatsTab from './components/CompanyStatsTab';
import ContactInfoTab from './components/ContactInfoTab';
import DepartmentsTab from './components/DepartmentsTab';
import SocialLinksTab from './components/SocialLinksTab';
import TeamMembersTab from './components/TeamMembersTab';
import CompanyValuesTab from './components/CompanyValuesTab';
import MilestonesTab from './components/MilestonesTab';
import CompanyStoryTab from './components/CompanyStoryTab';
import PageContentTab from './components/PageContentTab';
import FAQsTab from './components/FAQsTab';
import CertificationsTab from './components/CertificationsTab';

type TabKey = 'company-info' | 'company-stats' | 'contact-info' | 'departments' | 
              'social-links' | 'team-members' | 'company-values' | 'milestones' | 
              'company-story' | 'page-content' | 'faqs' | 'certifications';

interface Tab {
  key: TabKey;
  nameAr: string;
  nameEn: string;
  icon: string;
  description: string;
}

const TABS: Tab[] = [
  {
    key: 'company-info',
    nameAr: 'معلومات الشركة',
    nameEn: 'Company Info',
    icon: '🏢',
    description: 'اسم الشركة، الوصف، الرسالة والرؤية'
  },
  {
    key: 'company-stats',
    nameAr: 'الإحصائيات',
    nameEn: 'Statistics',
    icon: '📊',
    description: 'سنوات الخبرة، العملاء، المشاريع المكتملة'
  },
  {
    key: 'contact-info',
    nameAr: 'معلومات الاتصال',
    nameEn: 'Contact Info',
    icon: '📞',
    description: 'الهواتف، الإيميلات، العنوان، ساعات العمل'
  },
  {
    key: 'departments',
    nameAr: 'الأقسام',
    nameEn: 'Departments',
    icon: '🏢',
    description: 'أقسام الشركة وتفاصيل الاتصال'
  },
  {
    key: 'social-links',
    nameAr: 'التواصل الاجتماعي',
    nameEn: 'Social Links',
    icon: '📱',
    description: 'روابط منصات التواصل الاجتماعي'
  },
  {
    key: 'team-members',
    nameAr: 'فريق العمل',
    nameEn: 'Team Members',
    icon: '👥',
    description: 'أعضاء فريق العمل وتفاصيلهم'
  },
  {
    key: 'company-values',
    nameAr: 'القيم الأساسية',
    nameEn: 'Company Values',
    icon: '⭐',
    description: 'قيم الشركة الأساسية'
  },
  {
    key: 'milestones',
    nameAr: 'المعالم التاريخية',
    nameEn: 'Milestones',
    icon: '📅',
    description: 'المعالم والأحداث المهمة في تاريخ الشركة'
  },
  {
    key: 'company-story',
    nameAr: 'قصة الشركة',
    nameEn: 'Company Story',
    icon: '📖',
    description: 'قصة تأسيس الشركة ونموها'
  },
  {
    key: 'page-content',
    nameAr: 'محتوى الصفحات',
    nameEn: 'Page Content',
    icon: '📄',
    description: 'النصوص الثابتة في صفحات About و Contact'
  },
  {
    key: 'faqs',
    nameAr: 'الأسئلة الشائعة',
    nameEn: 'FAQs',
    icon: '❓',
    description: 'الأسئلة المتكررة وإجاباتها'
  },
  {
    key: 'certifications',
    nameAr: 'الشهادات والشراكات',
    nameEn: 'Certifications',
    icon: '🏅',
    description: 'شهادات الجودة والشراكات التجارية'
  }
];

export default function ContentManagementPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('company-info');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState<Set<TabKey>>(new Set());

  // التبديل إلى تبويب مع Delay لمنع Rate Limiting
  const switchToTab = (tabKey: TabKey) => {
    if (tabKey === activeTab) return;
    
    setActiveTab(tabKey);
    
    // إضافة delay قصير للتبويبات المحتاجة API calls لتجنب Rate Limiting
    if (['company-info', 'company-stats', 'departments', 'contact-info', 'social-links', 'team-members', 'company-values', 'milestones', 'company-story', 'page-content', 'faqs', 'certifications'].includes(tabKey)) {
      if (!loadedTabs.has(tabKey)) {
        setTimeout(() => {
          setLoadedTabs(prev => new Set(prev).add(tabKey));
        }, 500);
      }
    } else {
      setLoadedTabs(prev => new Set(prev).add(tabKey));
    }
  };

  // عرض المكون الخاص بكل تبويب
  const renderTabContent = () => {
    // عرض loading إذا لم يتم تحميل التبويب بعد
    const needsLoading = ['company-info', 'company-stats', 'departments'].includes(activeTab);
    if (needsLoading && !loadedTabs.has(activeTab)) {
      return (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري تحضير التبويب...' : 'Preparing tab...'}
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'company-info':
        return <CompanyInfoTab loading={loading} setLoading={setLoading} />;
      case 'company-stats':
        return <CompanyStatsTab loading={loading} setLoading={setLoading} />;
      case 'contact-info':
        return <ContactInfoTab loading={loading} setLoading={setLoading} />;
      case 'departments':
        return <DepartmentsTab loading={loading} setLoading={setLoading} />;
      case 'social-links':
        return <SocialLinksTab loading={loading} setLoading={setLoading} />;
      case 'team-members':
        return <TeamMembersTab loading={loading} setLoading={setLoading} />;
      case 'company-values':
        return <CompanyValuesTab loading={loading} setLoading={setLoading} />;
      case 'milestones':
        return <MilestonesTab loading={loading} setLoading={setLoading} />;
      case 'company-story':
        return <CompanyStoryTab loading={loading} setLoading={setLoading} />;
      case 'page-content':
        return <PageContentTab loading={loading} setLoading={setLoading} />;
      case 'faqs':
        return <FAQsTab loading={loading} setLoading={setLoading} />;
      case 'certifications':
        return <CertificationsTab loading={loading} setLoading={setLoading} />;
      default:
        return null;
    }
  };

  const currentTab = TABS.find(tab => tab.key === activeTab);

  // تحميل التبويب الأول عند بدء الصفحة
  useEffect(() => {
    setLoadedTabs(new Set(['company-info']));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'إدارة المحتوى' : 'Content Management'}
              </h1>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'إدارة جميع محتويات الموقع من مكان واحد' 
                  : 'Manage all website content from one place'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                title={language === 'ar' ? 'إعادة تحميل الصفحة' : 'Refresh Page'}
              >
                🔄 {language === 'ar' ? 'تحديث' : 'Refresh'}
              </button>
              <div className="text-4xl">🎨</div>
            </div>
          </div>

          {/* نجاح تفعيل APIs */}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-green-600 text-lg mr-3">✅</div>
              <div>
                <h3 className="text-sm font-medium text-green-800 mb-1">
                  {language === 'ar' ? 'APIs نشطة' : 'APIs Active'}
                </h3>
                <p className="text-sm text-green-700">
                  {language === 'ar' 
                    ? 'جميع الـ 12 APIs تعمل بشكل مثالي. يمكنك الآن إدارة المحتوى بشكل حقيقي!'
                    : 'All 12 APIs are working perfectly. You can now manage content in real-time!'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Flex Layout with Sidebar */}
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-80 bg-white rounded-lg shadow-sm border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'أقسام المحتوى' : 'Content Sections'}
            </h3>
            <nav className="space-y-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => switchToTab(tab.key)}
                  className={`w-full text-right p-3 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <span className="text-lg">{tab.icon}</span>
                    <div className="flex-1 text-right">
                      <div className="font-medium">
                        {language === 'ar' ? tab.nameAr : tab.nameEn}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {tab.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-lg shadow-sm border">
            {/* Content Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <span className="text-2xl">
                  {TABS.find(tab => tab.key === activeTab)?.icon}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {language === 'ar' 
                      ? TABS.find(tab => tab.key === activeTab)?.nameAr
                      : TABS.find(tab => tab.key === activeTab)?.nameEn
                    }
                  </h2>
                  <p className="text-sm text-gray-600">
                    {TABS.find(tab => tab.key === activeTab)?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 