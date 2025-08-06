'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation files
const translations = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.categories': 'الفئات',
    'nav.about': 'عن الشركة',
    'nav.contact': 'اتصل بنا',
    'nav.cart': 'السلة',
    'nav.wishlist': 'قائمة الأمنيات',
    'nav.login': 'تسجيل الدخول',
    'nav.dashboard': 'لوحة التحكم',
    'nav.logout': 'تسجيل الخروج',

    // Common
    'common.search': 'البحث...',
    'common.loading': 'جاري التحميل...',
    'common.error': 'حدث خطأ',
    'common.success': 'تم بنجاح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.view': 'عرض',
    'common.close': 'إغلاق',
    'common.price': 'السعر',
    'common.quantity': 'الكمية',
    'common.total': 'الإجمالي',

    // Hero Section
    'hero.badge': '🔥 جديد! مجموعة الأدوات المهنية 2030',
    'hero.title': 'ابني المستقبل مع',
    'hero.title.highlight': 'الأدوات المهنية',
    'hero.description': 'اكتشف أحدث أدوات ومعدات البناء المصممة للمستقبل. الكفاءة القصوى تلتقي بالجودة الاحترافية في مجموعة 2030.',
    'hero.explore.btn': '🛠️ استكشف الأدوات',
    'hero.quote.btn': '📞 احصل على عرض سعر',
    'hero.stats.tools': 'أداة متميزة',
    'hero.stats.customers': 'عميل سعيد',
    'hero.stats.experience': 'سنة خبرة',

    // Products
    'products.title': 'كتالوج أدوات البناء',
    'products.subtitle': 'تصفح مجموعتنا الكاملة من أدوات البناء المهنية والمعدات ومعدات الأمان. منتجات عالية الجودة يثق بها المحترفون في جميع أنحاء العالم.',
    'products.showing': 'عرض',
    'products.of': 'من',
    'products.load.more': 'تحميل المزيد',
    'products.no.results': 'لا توجد نتائج',
    'products.filter.all': 'الكل',
    'products.filter.power-tools': 'الأدوات الكهربائية',
    'products.filter.hand-tools': 'الأدوات اليدوية',
    'products.filter.safety': 'معدات الأمان',
    'products.filter.measuring': 'أدوات القياس',
    'products.filter.heavy-machinery': 'الآلات الثقيلة',
    'products.sort.name': 'الاسم',
    'products.sort.price-low': 'السعر: من الأقل للأعلى',
    'products.sort.price-high': 'السعر: من الأعلى للأقل',
    'products.sort.rating': 'التقييم',
    'products.sort.reviews': 'عدد المراجعات',
    'products.add.cart': 'أضف للسلة',
    'products.view.details': 'عرض التفاصيل',
    'products.add.wishlist': 'أضف لقائمة الأمنيات',
    'products.remove.wishlist': 'احذف من قائمة الأمنيات',

    // Cart
    'cart.title': 'سلتك',
    'cart.subtitle': 'راجع أدوات ومعدات البناء المختارة قبل الدفع.',
    'cart.empty.title': 'سلتك فارغة',
    'cart.empty.subtitle': 'أضف بعض الأدوات المهنية للبدء',
    'cart.browse.products': 'تصفح المنتجات',
    'cart.items': 'عنصر في سلتك',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.tax': 'الضرائب',
    'cart.shipping': 'الشحن',
    'cart.discount': 'الخصم',
    'cart.promo.placeholder': 'ادخل كود الخصم',
    'cart.promo.apply': 'تطبيق',
    'cart.checkout': 'إتمام الشراء',

    // Auth
    'auth.login.title': 'مرحباً بك',
    'auth.register.title': 'انضم بنا',
    'auth.login.subtitle': 'سجل دخولك للوصول إلى حسابك وإدارة طلباتك وقائمة الأمنيات',
    'auth.register.subtitle': 'أنشئ حسابك الجديد واستمتع بخدماتنا المتميزة وعروضنا الحصرية',
    'auth.name': 'الاسم',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.phone': 'رقم الهاتف',
    'auth.company': 'اسم الشركة',
    'auth.login.btn': 'تسجيل الدخول',
    'auth.register.btn': 'إنشاء حساب',
    'auth.switch.login': 'لديك حساب؟ سجل دخولك',
    'auth.switch.register': 'ليس لديك حساب؟ أنشئ واحداً',

    // About
    'about.title': 'بناء التميز معاً',
    'about.subtitle': 'لأكثر من 15 عاماً، كنا الشريك الموثوق للمهنيين في مجال البناء، ونقدم أدوات ومعدات متميزة تدعم أكثر المشاريع طموحاً في العالم.',
    'about.mission': 'مهمتنا',
    'about.mission.text': 'تمكين البناة والمقاولين بأدوات عالمية المستوى وخدمة استثنائية، مما يمكنهم من إنشاء هياكل رائعة تصمد أمام اختبار الزمن.',

    // Contact
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'هل لديك أسئلة حول منتجاتنا أو تحتاج نصائح خبراء لمشروعك؟ فريقنا هنا لمساعدتك في العثور على الأدوات والحلول المثالية.',
    'contact.form.title': 'أرسل لنا رسالة',
    'contact.form.subtitle': 'املأ النموذج أدناه وسنعود إليك في أقرب وقت ممكن. للأمور العاجلة، يرجى الاتصال بنا مباشرة.',
    'contact.subject': 'الموضوع',
    'contact.message': 'الرسالة',
    'contact.department': 'القسم',
    'contact.send': 'إرسال الرسالة',

    // Language Toggle
    'language.current': 'العربية',
    'language.switch': 'English',

    // Toast Messages
    'toast.cart.added': 'تمت الإضافة للسلة',
    'toast.cart.added.desc': 'تم إضافة المنتج إلى سلة التسوق',
    'toast.wishlist.added': 'تمت الإضافة بنجاح',
    'toast.wishlist.added.desc': 'تم إضافة المنتج لقائمة الأمنيات',
    'toast.wishlist.removed': 'تمت الإزالة بنجاح',
    'toast.wishlist.removed.desc': 'تم إزالة المنتج من قائمة الأمنيات',
    'toast.login.required': 'تسجيل الدخول مطلوب',
    'toast.login.required.desc': 'يرجى تسجيل الدخول أولاً لإضافة المنتجات لقائمة الأمنيات',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.wishlist': 'Wishlist',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',

    // Common
    'common.search': 'Search...',
    'common.loading': 'Loading...',
    'common.error': 'Error occurred',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.view': 'View',
    'common.close': 'Close',
    'common.price': 'Price',
    'common.quantity': 'Quantity',
    'common.total': 'Total',

    // Hero Section
    'hero.badge': '🔥 New! Professional Tools Collection 2030',
    'hero.title': 'Build Tomorrow with',
    'hero.title.highlight': 'Professional Tools',
    'hero.description': 'Discover cutting-edge construction tools and equipment designed for the future. Maximum efficiency meets professional-grade quality in our 2030 collection.',
    'hero.explore.btn': '🛠️ Explore Tools',
    'hero.quote.btn': '📞 Get Quote',
    'hero.stats.tools': 'Premium Tools',
    'hero.stats.customers': 'Happy Customers',
    'hero.stats.experience': 'Years Experience',

    // Products
    'products.title': 'Construction Tools Catalog',
    'products.subtitle': 'Browse our complete collection of professional construction tools, equipment, and safety gear. Quality products trusted by professionals worldwide.',
    'products.showing': 'Showing',
    'products.of': 'of',
    'products.load.more': 'Load More',
    'products.no.results': 'No Results Found',
    'products.filter.all': 'All',
    'products.filter.power-tools': 'Power Tools',
    'products.filter.hand-tools': 'Hand Tools',
    'products.filter.safety': 'Safety Equipment',
    'products.filter.measuring': 'Measuring Tools',
    'products.filter.heavy-machinery': 'Heavy Machinery',
    'products.sort.name': 'Name',
    'products.sort.price-low': 'Price: Low to High',
    'products.sort.price-high': 'Price: High to Low',
    'products.sort.rating': 'Rating',
    'products.sort.reviews': 'Reviews',
    'products.add.cart': 'Add to Cart',
    'products.view.details': 'View Details',
    'products.add.wishlist': 'Add to Wishlist',
    'products.remove.wishlist': 'Remove from Wishlist',

    // Cart
    'cart.title': 'Your Cart',
    'cart.subtitle': 'Review your selected construction tools and equipment before checkout.',
    'cart.empty.title': 'Your cart is empty',
    'cart.empty.subtitle': 'Add some professional tools to get started',
    'cart.browse.products': 'Browse Products',
    'cart.items': 'items in your cart',
    'cart.subtotal': 'Subtotal',
    'cart.tax': 'Tax',
    'cart.shipping': 'Shipping',
    'cart.discount': 'Discount',
    'cart.promo.placeholder': 'Enter promo code',
    'cart.promo.apply': 'Apply',
    'cart.checkout': 'Proceed to Checkout',

    // Auth
    'auth.login.title': 'Welcome Back',
    'auth.register.title': 'Join Us',
    'auth.login.subtitle': 'Sign in to access your account and manage your orders and wishlist',
    'auth.register.subtitle': 'Create your new account and enjoy our premium services and exclusive offers',
    'auth.name': 'Name',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.phone': 'Phone',
    'auth.company': 'Company',
    'auth.login.btn': 'Sign In',
    'auth.register.btn': 'Create Account',
    'auth.switch.login': 'Have an account? Sign in',
    'auth.switch.register': 'Don\'t have an account? Create one',

    // About
    'about.title': 'Building Excellence Together',
    'about.subtitle': 'For over 15 years, we\'ve been the trusted partner for construction professionals, providing premium tools and equipment that power the world\'s most ambitious projects.',
    'about.mission': 'Our Mission',
    'about.mission.text': 'To empower builders and contractors with world-class tools and exceptional service, enabling them to create remarkable structures that stand the test of time.',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have questions about our products or need expert advice for your project? Our team is here to help you find the perfect tools and solutions.',
    'contact.form.title': 'Send us a Message',
    'contact.form.subtitle': 'Fill out the form below and we\'ll get back to you as soon as possible. For urgent matters, please call us directly.',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.department': 'Department',
    'contact.send': 'Send Message',

    // Language Toggle
    'language.current': 'English',
    'language.switch': 'العربية',

    // Toast Messages
    'toast.cart.added': 'Added to Cart',
    'toast.cart.added.desc': 'Product has been added to your shopping cart',
    'toast.wishlist.added': 'Added Successfully',
    'toast.wishlist.added.desc': 'Product has been added to your wishlist',
    'toast.wishlist.removed': 'Removed Successfully',
    'toast.wishlist.removed.desc': 'Product has been removed from your wishlist',
    'toast.login.required': 'Login Required',
    'toast.login.required.desc': 'Please sign in first to add products to your wishlist',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage and update document direction
  useEffect(() => {
    localStorage.setItem('language', language);
    
    // Update document direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update body classes for styling
    document.body.classList.toggle('rtl', language === 'ar');
    document.body.classList.toggle('ltr', language === 'en');
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 