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
    'cart.promo.success': 'تم تطبيق الكوبون بنجاح',
    'cart.promo.success.desc': 'حصلت على خصم 10% على طلبك',
    'cart.promo.error': 'كوبون غير صالح',
    'cart.promo.error.desc': 'الرجاء التحقق من رمز الكوبون والمحاولة مرة أخرى',

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
    'about.stats.experience': 'سنة خبرة',
    'about.stats.customers': 'عميل سعيد',
    'about.stats.projects': 'مشروع مكتمل',
    'about.stats.support': 'دعم فني',
    'about.values.quality.title': 'الجودة أولاً',
    'about.values.quality.desc': 'نحصل على أفضل أدوات البناء من أوثق المصنعين في العالم.',
    'about.values.support.title': 'دعم خبراء',
    'about.values.support.desc': 'فريقنا من خبراء البناء يوفر الإرشاد المتخصص لجميع مشاريعك.',
    'about.values.innovation.title': 'الابتكار',
    'about.values.innovation.desc': 'نواكب اتجاهات الصناعة لنقدم لك أحدث تقنيات البناء.',
    'about.values.reliability.title': 'الموثوقية',
    'about.values.reliability.desc': 'اعتمد علينا للحصول على جودة ثابتة وتسليم في الوقت المحدد وخدمة يمكن الاعتماد عليها.',
    'about.explore.products': 'استكشف منتجاتنا',
    'about.contact.us': 'اتصل بنا',
    'about.home.title': 'بناء الغد مع',
    'about.home.highlight': 'الأدوات المهنية',
    'about.home.desc': 'منذ أكثر من 25 عاماً، نوفر أدوات البناء عالية الجودة للمهنيين في جميع أنحاء العالم. شريكك الموثوق في كل مشروع.',
    'about.home.learn': 'تعرف علينا أكثر',
    'about.home.stats.experience': 'سنة خبرة',
    'about.home.stats.customers': 'عميل سعيد',
    'about.home.stats.tools': 'أداة متميزة',
    'about.home.stats.support': 'دعم فني',
    'about.home.delivery.title': 'توصيل سريع',
    'about.home.delivery.desc': 'توصيل في نفس اليوم للطلبات قبل الساعة 2 مساءً',
    'about.home.quality.title': 'ضمان الجودة',
    'about.home.quality.desc': 'جميع الأدوات بضمان الشركة المصنعة ووعد الجودة منا',
    'about.home.payment.title': 'دفع مرن',
    'about.home.payment.desc': 'خيارات دفع متعددة بما في ذلك التقسيط للطلبات الكبيرة',
    'about.home.expert.title': 'دعم خبراء',
    'about.home.expert.desc': 'استشارة مهنية ودعم فني من خبرائنا',

    // Categories
    'categories.title': 'فئات المنتجات',
    'categories.subtitle': 'تصفح مجموعتنا الواسعة من أدوات البناء المنظمة حسب الفئات للعثور على ما تحتاجه بسهولة.',
    'categories.view.all': 'عرض جميع المنتجات',
    'categories.home.title': 'تسوق حسب الفئة',
    'categories.home.subtitle': 'اعثر على الأدوات المثالية لمشروعك من مجموعتنا المتنوعة',
    'categories.power.title': 'الأدوات الكهربائية',
    'categories.power.desc': 'أدوات كهربائية وبطارية احترافية',
    'categories.power.count': '120+ أداة',
    'categories.hand.title': 'الأدوات اليدوية',
    'categories.hand.desc': 'أدوات يدوية أساسية لكل مشروع',
    'categories.hand.count': '200+ أداة',
    'categories.safety.title': 'معدات الأمان',
    'categories.safety.desc': 'معدات حماية متقدمة للبناء',
    'categories.safety.count': '80+ قطعة',
    'categories.measuring.title': 'أدوات القياس',
    'categories.measuring.desc': 'أجهزة دقيقة للعمل الصحيح',
    'categories.measuring.count': '50+ أداة',
    'categories.materials.title': 'مواد البناء',
    'categories.materials.desc': 'مواد عالية الجودة لمشاريع البناء',
    'categories.materials.count': '300+ قطعة',
    'categories.heavy.title': 'الآلات الثقيلة',
    'categories.heavy.desc': 'معدات صناعية للمشاريع الكبيرة',
    'categories.heavy.count': '40+ آلة',
    'categories.explore.title': 'استكشف فئات الأدوات',

    // Contact
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'هل لديك أسئلة حول منتجاتنا أو تحتاج نصائح خبراء لمشروعك؟ فريقنا هنا لمساعدتك في العثور على الأدوات والحلول المثالية.',
    'contact.form.title': 'أرسل لنا رسالة',
    'contact.form.subtitle': 'املأ النموذج أدناه وسنعود إليك في أقرب وقت ممكن. للأمور العاجلة، يرجى الاتصال بنا مباشرة.',
    'contact.subject': 'الموضوع',
    'contact.message': 'الرسالة',
    'contact.department': 'القسم',
    'contact.send': 'إرسال الرسالة',
    'contact.hero.quick': 'استجابة سريعة',
    'contact.hero.quick.desc': 'خلال ساعتين',
    'contact.hero.expert': 'نصائح خبراء',
    'contact.hero.expert.desc': 'إرشاد مهني',
    'contact.hero.support': 'دعم موثوق',
    'contact.hero.support.desc': 'نحن هنا دائماً لمساعدتك',
    'contact.form.name': 'الاسم الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.phone': 'رقم الهاتف',
    'contact.form.company': 'اسم الشركة',
    'contact.form.name.placeholder': 'اسمك الكامل',
    'contact.form.email.placeholder': 'بريدك الإلكتروني',
    'contact.form.phone.placeholder': 'رقم هاتفك',
    'contact.form.company.placeholder': 'اسم شركتك',
    'contact.form.success': 'شكراً لك! تم إرسال رسالتك بنجاح. سنعود إليك قريباً.',
    'contact.form.sending': 'جاري الإرسال...',

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

    // Footer
    'footer.products': 'المنتجات',
    'footer.services': 'الخدمات',
    'footer.company': 'الشركة',
    'footer.support': 'الدعم',
    'footer.newsletter': 'النشرة الإخبارية',
    'footer.newsletter.desc': 'اشترك للحصول على آخر الأخبار والعروض الحصرية',
    'footer.email.placeholder': 'أدخل بريدك الإلكتروني',
    'footer.subscribe': 'اشترك',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'الشروط والأحكام',
    'footer.about.us': 'عن الشركة',
    'footer.contact.us': 'اتصل بنا',
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
    'cart.promo.success': 'Promo Code Applied',
    'cart.promo.success.desc': 'You got 10% discount on your order',
    'cart.promo.error': 'Invalid Promo Code',
    'cart.promo.error.desc': 'Please check the promo code and try again',

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
    'about.stats.experience': 'Years Experience',
    'about.stats.customers': 'Happy Customers',
    'about.stats.projects': 'Projects Completed',
    'about.stats.support': 'Customer Support',
    'about.values.quality.title': 'Quality First',
    'about.values.quality.desc': 'We source only the finest construction tools from trusted manufacturers worldwide.',
    'about.values.support.title': 'Expert Support',
    'about.values.support.desc': 'Our team of construction professionals provides expert guidance for all your projects.',
    'about.values.innovation.title': 'Innovation',
    'about.values.innovation.desc': 'We stay ahead of industry trends, bringing you the latest in construction technology.',
    'about.values.reliability.title': 'Reliability',
    'about.values.reliability.desc': 'Count on us for consistent quality, timely delivery, and dependable service.',
    'about.explore.products': 'Explore Our Products',
    'about.contact.us': 'Contact Us',
    'about.home.title': 'Building Tomorrow with',
    'about.home.highlight': 'Professional Tools',
    'about.home.desc': 'For over 25 years, we have been providing high-quality construction tools to professionals worldwide. Your trusted partner in every project.',
    'about.home.learn': 'Learn More About Us',
    'about.home.stats.experience': 'Years Experience',
    'about.home.stats.customers': 'Happy Customers',
    'about.home.stats.tools': 'Premium Tools',
    'about.home.stats.support': 'Customer Support',
    'about.home.delivery.title': 'Fast Delivery',
    'about.home.delivery.desc': 'Same-day delivery available for orders placed before 2 PM',
    'about.home.quality.title': 'Quality Guarantee',
    'about.home.quality.desc': 'All tools come with manufacturer warranty and our quality promise',
    'about.home.payment.title': 'Flexible Payment',
    'about.home.payment.desc': 'Multiple payment options including installments for bulk orders',
    'about.home.expert.title': 'Expert Support',
    'about.home.expert.desc': 'Professional consultation and technical support from our experts',

    // Categories
    'categories.title': 'Product Categories',
    'categories.subtitle': 'Browse our extensive collection of construction tools organized by category to easily find what you need.',
    'categories.view.all': 'View All Products',
    'categories.home.title': 'Shop by Category',
    'categories.home.subtitle': 'Find the perfect tools for your project from our diverse collection',
    'categories.power.title': 'Power Tools',
    'categories.power.desc': 'Professional electric and battery-powered tools',
    'categories.power.count': '120+ Tools',
    'categories.hand.title': 'Hand Tools',
    'categories.hand.desc': 'Essential manual tools for every project',
    'categories.hand.count': '200+ Tools',
    'categories.safety.title': 'Safety Equipment',
    'categories.safety.desc': 'Advanced protection gear for construction',
    'categories.safety.count': '80+ Items',
    'categories.measuring.title': 'Measuring Tools',
    'categories.measuring.desc': 'Precision instruments for accurate work',
    'categories.measuring.count': '50+ Tools',
    'categories.materials.title': 'Construction Materials',
    'categories.materials.desc': 'Quality materials for building projects',
    'categories.materials.count': '300+ Items',
    'categories.heavy.title': 'Heavy Machinery',
    'categories.heavy.desc': 'Industrial equipment for large projects',
    'categories.heavy.count': '40+ Machines',
    'categories.explore.title': 'Explore Our Tool Categories',

    // Contact
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Have questions about our products or need expert advice for your project? Our team is here to help you find the perfect tools and solutions.',
    'contact.form.title': 'Send us a Message',
    'contact.form.subtitle': 'Fill out the form below and we\'ll get back to you as soon as possible. For urgent matters, please call us directly.',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.department': 'Department',
    'contact.send': 'Send Message',
    'contact.hero.quick': 'Quick Response',
    'contact.hero.quick.desc': 'Within 2 hours',
    'contact.hero.expert': 'Expert Advice',
    'contact.hero.expert.desc': 'Professional guidance',
    'contact.hero.support': 'Reliable Support',
    'contact.hero.support.desc': 'Always here to help',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.phone': 'Phone Number',
    'contact.form.company': 'Company Name',
    'contact.form.name.placeholder': 'Your full name',
    'contact.form.email.placeholder': 'Your email address',
    'contact.form.phone.placeholder': 'Your phone number',
    'contact.form.company.placeholder': 'Your company name',
    'contact.form.success': 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
    'contact.form.sending': 'Sending Message...',

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

    // Footer
    'footer.products': 'Products',
    'footer.services': 'Services',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.newsletter': 'Newsletter',
    'footer.newsletter.desc': 'Subscribe to get the latest news and exclusive offers',
    'footer.email.placeholder': 'Enter your email',
    'footer.subscribe': 'Subscribe',
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms & Conditions',
    'footer.about.us': 'About Us',
    'footer.contact.us': 'Contact Us',
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