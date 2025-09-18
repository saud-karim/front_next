/**
 * Utilities for formatting company statistics display
 */

// تنسيق الأرقام مع علامة + والفاصلة للآلاف
export const formatNumber = (value: any): string => {
  const num = typeof value === 'number' ? value : parseInt(value) || 0;
  
  if (num <= 0) {
    return '0';
  }
  
  // إذا كان الرقم أكبر من أو يساوي 1000، استخدم K
  if (num >= 1000) {
    const kValue = Math.floor(num / 1000);
    const remainder = num % 1000;
    
    if (remainder === 0) {
      return `${kValue}K+`;
    } else {
      // للأرقام مثل 1500 -> 1.5K+
      return `${(num / 1000).toFixed(1).replace('.0', '')}K+`;
    }
  }
  
  // للأرقام أقل من 1000، أضف الفاصلة وعلامة +
  return `${num.toLocaleString()}+`;
};

// تنسيق توفر الدعم
export const formatSupportAvailability = (available: boolean, language: 'ar' | 'en' = 'ar'): string => {
  if (available) {
    return '24/7';
  }
  return language === 'ar' ? 'غير متاح' : 'Unavailable';
};

// تنسيق إحصائية واحدة مع icon وlabel
export const formatStat = (
  key: string, 
  value: any, 
  language: 'ar' | 'en' = 'ar'
): { value: string; formatted: string } => {
  switch (key) {
    case 'support_available':
    case 'support_availability':
      const formatted = formatSupportAvailability(value as boolean, language);
      return { value: String(value), formatted };
    
    case 'years_experience':
    case 'happy_customers':
    case 'total_customers':
    case 'completed_projects':
      const formattedNum = formatNumber(value);
      return { value: String(value), formatted: formattedNum };
    
    default:
      return { value: String(value || 0), formatted: formatNumber(value) };
  }
}; 