'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface Department {
  id?: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface DepartmentsPreviewProps {
  data: Department[];
}

// نظام mapping بين الرموز القصيرة والفونت أوسوم (نفس النظام من DepartmentsTab)
const ICON_MAPPING = {
  '🏢': 'fas fa-building',
  '📈': 'fas fa-chart-line', 
  '🎧': 'fas fa-headset',
  '⚙️': 'fas fa-cogs',
  '👥': 'fas fa-users',
  '💰': 'fas fa-dollar-sign',
  '📢': 'fas fa-bullhorn',
  '🚛': 'fas fa-truck',
  '🛡️': 'fas fa-shield-alt',
  '🔬': 'fas fa-microscope',
  '🔧': 'fas fa-tools',
  '🤝': 'fas fa-handshake',
  '📋': 'fas fa-clipboard-check',
  '🏭': 'fas fa-industry',
  '📦': 'fas fa-warehouse'
};

// دالة للحصول على فونت أوسوم من الإيموجي
const getFontAwesomeIcon = (emoji: string): string => {
  return ICON_MAPPING[emoji as keyof typeof ICON_MAPPING] || 'fas fa-question';
};

export default function DepartmentsPreview({ data }: DepartmentsPreviewProps) {
  const { language } = useLanguage();

  // ترتيب الأقسام النشطة حسب order
  const activeDepartments = data
    .filter(dept => dept.is_active)
    .sort((a, b) => a.order - b.order);

  // تنسيق التاريخ بأمان (ميلادي)
  const formatDate = (dateString?: string) => {
    if (!dateString || dateString.trim() === '') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // إرجاع النص الأصلي إذا كان التاريخ غير صحيح
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      calendar: 'gregory', // فرض استخدام التقويم الميلادي
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {language === 'ar' ? 'أقسام الشركة' : 'Company Departments'}
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'أقسام وإدارات BuildTools BS المتخصصة في تقديم أفضل الخدمات' 
              : 'BuildTools BS specialized departments delivering the best services'
            }
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-2xl font-bold text-blue-900">{activeDepartments.length}</div>
              <p className="text-blue-700 font-medium">
                {language === 'ar' ? 'قسم نشط' : 'Active Departments'}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-3xl mb-2">⚙️</div>
              <div className="text-2xl font-bold text-green-900">24/7</div>
              <p className="text-green-700 font-medium">
                {language === 'ar' ? 'خدمة متواصلة' : 'Continuous Service'}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-purple-900">100%</div>
              <p className="text-purple-700 font-medium">
                {language === 'ar' ? 'التزام بالجودة' : 'Quality Commitment'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          {activeDepartments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeDepartments.map((dept) => (
                <div key={dept.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Department Header */}
                  <div 
                    className="h-32 flex items-center justify-center text-white relative"
                    style={{ backgroundColor: dept.color }}
                  >
                    <i className={`${getFontAwesomeIcon(dept.icon)} text-4xl`}></i>
                    <div className="absolute top-3 right-3 bg-white bg-opacity-20 rounded-full px-3 py-1 text-sm">
                      #{dept.order}
                    </div>
                  </div>

                  {/* Department Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {language === 'ar' ? dept.name_ar : dept.name_en}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {language === 'ar' ? dept.description_ar : dept.description_en}
                    </p>

                    {/* Department Details */}
                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center justify-between">
                        <span>{language === 'ar' ? 'الترتيب:' : 'Order:'}</span>
                        <span className="font-medium">{dept.order}</span>
                      </div>
                      {dept.created_at && (
                        <div className="flex items-center justify-between">
                          <span>{language === 'ar' ? 'تاريخ الإنشاء:' : 'Created:'}</span>
                          <span className="font-medium">
                            {formatDate(dept.created_at)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>{language === 'ar' ? 'الحالة:' : 'Status:'}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {language === 'ar' ? 'نشط' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد أقسام' : 'No departments available'}
              </h3>
              <p className="text-gray-600">
                {language === 'ar' 
                  ? 'أضف أقسام الشركة لتظهر هنا' 
                  : 'Add company departments to display here'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-blue-600 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            {language === 'ar' ? 'تواصل مع الأقسام' : 'Contact Departments'}
          </h3>
          <p className="text-blue-100 mb-6">
            {language === 'ar' 
              ? 'تواصل مباشرة مع القسم المناسب للحصول على أفضل خدمة' 
              : 'Contact the appropriate department directly for the best service'
            }
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            {language === 'ar' ? 'دليل الاتصال' : 'Contact Directory'}
          </button>
        </div>
      </div>
    </div>
  );
} 