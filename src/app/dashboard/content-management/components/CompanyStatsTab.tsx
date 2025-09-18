'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import ApiService from '@/app/services/api';
import { useToast } from '@/app/context/ToastContext';
import { formatStat } from '@/app/utils/statsFormatter';

interface CompanyStatsData {
  id?: number;
  years_experience: number;
  happy_customers: number;
  completed_projects: number;
  support_available: boolean;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const STATS_CONFIG = [
  {
    key: 'years_experience' as const,
    nameAr: 'سنوات الخبرة',
    nameEn: 'Years Experience',
    icon: '🏆',
    color: 'bg-blue-500',
    defaultValue: 15
  },
  {
    key: 'happy_customers' as const,
    nameAr: 'العملاء السعداء',
    nameEn: 'Happy Customers',
    icon: '👥',
    color: 'bg-green-500',
    defaultValue: 5000
  },
  {
    key: 'completed_projects' as const,
    nameAr: 'المشاريع المكتملة',
    nameEn: 'Completed Projects',
    icon: '🚧',
    color: 'bg-orange-500',
    defaultValue: 1200
  },
  {
    key: 'support_available' as const,
    nameAr: 'توفر الدعم',
    nameEn: 'Support Available',
    icon: '⏰',
    color: 'bg-purple-500',
    defaultValue: true
  }
];

// Cache للإحصائيات
let companyStatsCache: CompanyStatsData | null = null;
let statsLastFetchTime = 0;
const STATS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function CompanyStatsTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [data, setData] = useState<CompanyStatsData>({
    years_experience: 15,
    happy_customers: 5000,
    completed_projects: 1200,
    support_available: true
  });
  const [saving, setSaving] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Cache variables
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  let companyStatsCache: CompanyStatsData | null = null;
  let lastFetchTime = 0;

  // تحميل البيانات مع Cache و Retry Logic
  const loadData = async (forceRefresh = false) => {
    try {
      // التحقق من Cache أولاً
      const now = Date.now();
      if (!forceRefresh && companyStatsCache && (now - lastFetchTime) < CACHE_DURATION) {
        console.log('📦 Using cached company stats data');
        setData(companyStatsCache);
        return;
      }

      setLoading(true);
      
      // إضافة delay لتجنب Rate Limiting
      if (retryCount > 0) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const response = await ApiService.getCompanyStats();
      
      if (response.success && response.data) {
        // تحويل البيانات القادمة من الـ backend إلى الأنواع المناسبة للـ frontend
        const convertedData = {
          ...response.data,
          years_experience: parseInt(response.data.years_experience) || 0,
          happy_customers: parseInt(response.data.total_customers || response.data.happy_customers) || 0, // Backend ترسل total_customers
          completed_projects: parseInt(response.data.completed_projects) || 0,
          support_available: response.data.support_availability === 'true' || response.data.support_availability === true // Backend ترسل string "true"/"false"
        };
        
        // تحديث Cache
        companyStatsCache = convertedData;
        lastFetchTime = now;
        setData(convertedData);
        setRetryCount(0); // إعادة تعيين عداد المحاولات عند النجاح
      }
    } catch (error: any) {
      console.error('Error loading company stats:', error);
      toast.error('خطأ', error.message || 'خطأ في تحميل إحصائيات الشركة');
    } finally {
      setLoading(false);
    }
  };

  // حفظ البيانات
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // تحويل جميع البيانات إلى strings حسب متطلبات الـ Backend
      const payload = {
        years_experience: String(data.years_experience || 0),
        total_customers: String(data.happy_customers || 0), // Backend يتوقع total_customers
        completed_projects: String(data.completed_projects || 0),
        support_availability: String(data.support_available) // Backend يتوقع string: "true"/"false"
      };
      
      const response = await ApiService.updateCompanyStats(payload);
      
      if (response.success) {
        toast.success(
          language === 'ar' ? 'نجح الحفظ' : 'Success',
          language === 'ar' ? 'تم حفظ الإحصائيات بنجاح' : 'Statistics saved successfully'
        );
        if (response.data) {
          // تحويل البيانات المُعادة من الـ backend إلى الأنواع المناسبة للـ frontend
          const convertedData = {
            ...response.data,
            years_experience: parseInt(response.data.years_experience) || 0,
            happy_customers: parseInt(response.data.total_customers || response.data.happy_customers) || 0,
            completed_projects: parseInt(response.data.completed_projects) || 0,
            support_available: response.data.support_availability === 'true' || response.data.support_availability === true
          };
          setData(convertedData);
        }
      } else {
        throw new Error(response.message || 'Failed to save statistics');
      }
    } catch (error: any) {
      console.error('Error saving company stats:', error);
      toast.error('خطأ', error.message || 'خطأ في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  // تحديث حقل
  const updateField = (field: keyof CompanyStatsData, value: string | number | boolean) => {
    setData(prev => ({ ...prev, [field]: value }));
  };



  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6">
      {/* معاينة الإحصائيات */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {language === 'ar' ? 'معاينة الإحصائيات' : 'Statistics Preview'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS_CONFIG.map((stat) => (
            <div key={stat.key} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 text-white text-xl`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatStat(stat.key, data[stat.key], language).formatted}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? stat.nameAr : stat.nameEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* نموذج التعديل */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {language === 'ar' ? 'تعديل الإحصائيات' : 'Edit Statistics'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STATS_CONFIG.map((stat) => (
            <div key={stat.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <span>{stat.icon}</span>
                  <span>{language === 'ar' ? stat.nameAr : stat.nameEn}</span>
                </div>
              </label>
              {stat.key === 'support_available' ? (
                <select
                  value={data[stat.key] ? 'true' : 'false'}
                  onChange={(e) => updateField(stat.key, e.target.value === 'true')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">{language === 'ar' ? '24/7' : '24/7'}</option>
                  <option value="false">{language === 'ar' ? 'غير متاح' : 'Unavailable'}</option>
                </select>
              ) : (
                <input
                  type="number"
                  value={data[stat.key] || 0}
                  onChange={(e) => updateField(stat.key, parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={String(stat.defaultValue)}
                />
              )}
              <p className="mt-1 text-xs text-gray-500">
                {language === 'ar' 
                  ? `مثال: ${stat.defaultValue}`
                  : `Example: ${stat.defaultValue}`
                }
              </p>
            </div>
          ))}
        </div>

        {/* نصائح */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-blue-600 text-lg">💡</div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">
                {language === 'ar' ? 'نصائح للكتابة:' : 'Writing Tips:'}
              </h4>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• {language === 'ar' ? 'الأرقام ستظهر تلقائياً مع علامة "+" (مثل: 1,500+)' : 'Numbers automatically display with "+" (e.g., 1,500+)'}</li>
                <li>• {language === 'ar' ? 'توفر الدعم يعرض كـ "24/7" عند التفعيل' : 'Support availability shows as "24/7" when enabled'}</li>
                <li>• {language === 'ar' ? 'استخدم أرقام مقربة للتأثير الأقوى' : 'Use rounded numbers for stronger impact'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* أزرار الحفظ */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => loadData(true)}
            disabled={saving || loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            title={language === 'ar' ? 'إعادة تحميل مع تجاهل الكاش' : 'Force refresh (ignore cache)'}
          >
            {loading ? '⟳' : '📊'} {language === 'ar' ? 'إعادة تحميل' : 'Reload'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
              </div>
            ) : (
              language === 'ar' ? 'حفظ الإحصائيات' : 'Save Statistics'
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 