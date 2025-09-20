'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface Certification {
  id?: number;
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

interface CertificationsPreviewProps {
  data: Certification[];
}

export default function CertificationsPreview({ data }: CertificationsPreviewProps) {
  const { language } = useLanguage();

  const activeCertifications = data
    .filter(cert => cert.is_active)
    .sort((a, b) => a.order - b.order);

  // التحقق من انتهاء الشهادة
  const isExpired = (expiry_date?: string) => {
    if (!expiry_date || expiry_date.trim() === '') return false;
    const date = new Date(expiry_date);
    if (isNaN(date.getTime())) return false; // إذا كان التاريخ غير صحيح
    return date < new Date();
  };

  // التحقق من قرب انتهاء الشهادة (30 يوم)
  const isExpiringSoon = (expiry_date?: string) => {
    if (!expiry_date || expiry_date.trim() === '') return false;
    const today = new Date();
    const expiry = new Date(expiry_date);
    if (isNaN(expiry.getTime())) return false; // إذا كان التاريخ غير صحيح
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

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

  // تنسيق التاريخ مع الشهر الطويل (ميلادي)
  const formatDateWithMonth = (dateString?: string) => {
    if (!dateString || dateString.trim() === '') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // إرجاع النص الأصلي إذا كان التاريخ غير صحيح
    return date.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
      calendar: 'gregory', // فرض استخدام التقويم الميلادي
      year: 'numeric',
      month: 'long'
    });
  };

  // حساب الإحصائيات
  const totalCertifications = activeCertifications.length;
  const expiredCertifications = activeCertifications.filter(cert => isExpired(cert.expiry_date)).length;
  const expiringSoonCertifications = activeCertifications.filter(cert => isExpiringSoon(cert.expiry_date)).length;
  const validCertifications = totalCertifications - expiredCertifications;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'شهاداتنا واعتماداتنا' : 'Our Certifications & Accreditations'}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'نحن ملتزمون بأعلى معايير الجودة والتميز في جميع أعمالنا'
            : 'We are committed to the highest standards of quality and excellence in all our work'
          }
        </p>
      </div>

      {activeCertifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">📜</div>
          <p className="text-xl text-gray-500">
            {language === 'ar' ? 'لا توجد شهادات متاحة' : 'No certifications available'}
          </p>
        </div>
      ) : (
        <>
          {/* Statistics */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'إحصائيات الشهادات' : 'Certification Statistics'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">{totalCertifications}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'إجمالي الشهادات' : 'Total Certificates'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">{validCertifications}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'شهادات سارية' : 'Valid Certificates'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">{expiringSoonCertifications}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">{new Date().getFullYear()}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'العام الحالي' : 'Current Year'}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {activeCertifications.map((cert) => (
              <div key={cert.id} className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 overflow-hidden ${
                isExpired(cert.expiry_date) 
                  ? 'border-red-300 bg-red-50' 
                  : isExpiringSoon(cert.expiry_date) 
                  ? 'border-yellow-300 bg-yellow-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}>
                {/* Certificate Image */}
                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={language === 'ar' ? cert.name_ar : cert.name_en}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-4">📜</div>
                      <p className="text-blue-600 font-medium">
                        {language === 'ar' ? cert.name_ar : cert.name_en}
                      </p>
                    </div>
                  )}
                </div>

                {/* Certificate Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {language === 'ar' ? cert.name_ar : cert.name_en}
                  </h3>
                  
                  <p className="text-blue-600 font-medium mb-3">
                    {language === 'ar' ? cert.issuer_ar : cert.issuer_en}
                  </p>
                  
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {language === 'ar' ? cert.description_ar : cert.description_en}
                  </p>

                  {/* Dates */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="w-4 h-4 mr-2">📅</span>
                      <span className="text-gray-600">
                        {language === 'ar' ? 'تاريخ الإصدار: ' : 'Issue Date: '}
                      </span>
                      <span className="font-medium">
                        {formatDate(cert.issue_date)}
                      </span>
                    </div>
                    
                    {cert.expiry_date && (
                      <div className="flex items-center text-sm">
                        <span className="w-4 h-4 mr-2">
                          {isExpired(cert.expiry_date) ? '❌' : isExpiringSoon(cert.expiry_date) ? '⚠️' : '⏰'}
                        </span>
                        <span className="text-gray-600">
                          {language === 'ar' ? 'تاريخ الانتهاء: ' : 'Expiry Date: '}
                        </span>
                        <span className={`font-medium ${
                          isExpired(cert.expiry_date) 
                            ? 'text-red-600' 
                            : isExpiringSoon(cert.expiry_date) 
                            ? 'text-yellow-600' 
                            : 'text-gray-900'
                        }`}>
                          {formatDate(cert.expiry_date)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                      #{cert.order}
                    </span>
                    
                    {isExpired(cert.expiry_date) && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                        {language === 'ar' ? 'منتهية الصلاحية' : 'Expired'}
                      </span>
                    )}
                    
                    {isExpiringSoon(cert.expiry_date) && !isExpired(cert.expiry_date) && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                        {language === 'ar' ? 'تنتهي قريباً' : 'Expiring Soon'}
                      </span>
                    )}
                    
                    {!isExpired(cert.expiry_date) && !isExpiringSoon(cert.expiry_date) && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        {language === 'ar' ? 'سارية المفعول' : 'Valid'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quality Commitment Section */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {language === 'ar' ? 'التزامنا بالجودة' : 'Our Quality Commitment'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'معايير عالمية' : 'Global Standards'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' 
                    ? 'نلتزم بأعلى المعايير العالمية في جميع أعمالنا'
                    : 'We adhere to the highest global standards in all our work'
                  }
                </p>
              </div>
              
              <div>
                <div className="text-4xl mb-4">🔍</div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'مراقبة مستمرة' : 'Continuous Monitoring'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' 
                    ? 'نراقب ونطور أنظمة الجودة لدينا بشكل مستمر'
                    : 'We continuously monitor and improve our quality systems'
                  }
                </p>
              </div>
              
              <div>
                <div className="text-4xl mb-4">✅</div>
                <h4 className="font-bold text-gray-900 mb-2">
                  {language === 'ar' ? 'ضمان الجودة' : 'Quality Assurance'}
                </h4>
                <p className="text-gray-600 text-sm">
                  {language === 'ar' 
                    ? 'نضمن جودة المنتجات والخدمات المقدمة لعملائنا'
                    : 'We guarantee the quality of products and services provided to our customers'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {language === 'ar' ? 'رحلة الاعتماد' : 'Certification Journey'}
            </h3>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-300"></div>
                
                {activeCertifications
                  .sort((a, b) => new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime())
                  .map((cert, index) => (
                    <div key={cert.id} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-8`}>
                      {/* Timeline Node */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full z-10"></div>
                      
                      {/* Content */}
                      <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {language === 'ar' ? cert.name_ar : cert.name_en}
                          </h4>
                          <p className="text-blue-600 text-sm mb-2">
                            {language === 'ar' ? cert.issuer_ar : cert.issuer_en}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {formatDateWithMonth(cert.issue_date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {language === 'ar' ? 'تواصل معنا للحصول على مزيد من المعلومات' : 'Contact Us for More Information'}
            </h3>
            <p className="mb-6 text-blue-100 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'إذا كان لديك أي استفسارات حول شهاداتنا أو معايير الجودة لدينا، فلا تتردد في التواصل معنا'
                : 'If you have any questions about our certifications or quality standards, don\'t hesitate to contact us'
              }
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                {language === 'ar' ? '📞 اتصل بنا' : '📞 Call Us'}
              </button>
              <button className="px-6 py-3 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors">
                {language === 'ar' ? '💬 راسلنا' : '💬 Message Us'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 