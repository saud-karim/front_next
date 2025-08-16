'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageManager } from '../services/api';

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
    'nav.search': 'البحث',
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
    
    // Hero Tool Cards
    'hero.tools.power.title': 'الأدوات الكهربائية',
    'hero.tools.power.desc': 'مثاقب ومناشير احترافية والمزيد',
    'hero.tools.smart.title': 'الأدوات الذكية',
    'hero.tools.smart.desc': 'معدات البناء المزودة بإنترنت الأشياء',
    'hero.tools.safety.title': 'معدات الأمان',
    'hero.tools.safety.desc': 'معدات حماية متقدمة',
    'hero.tools.precision.title': 'أدوات الدقة',
    'hero.tools.precision.desc': 'أدوات قياس موجهة بالليزر',

    // Products
    'products.title': 'كتالوج أدوات البناء',
    'products.subtitle': 'تصفح مجموعتنا الكاملة من أدوات البناء المهنية والمعدات ومعدات الأمان. منتجات عالية الجودة يثق بها المحترفون في جميع أنحاء العالم.',
    'products.showing': 'عرض',
    'products.of': 'من',
    'products.load.more': 'تحميل المزيد',
    
    // Product Details
    'product.not.found': 'المنتج غير موجود',
    'product.not.found.desc': 'المنتج الذي تبحث عنه غير موجود.',
    'product.back.to.products': 'العودة للمنتجات',
    'product.reviews': 'تقييم',
    'product.save': 'وفر',
    'product.features': 'المميزات',
    'product.quantity': 'الكمية',
    'product.specifications': 'المواصفات',
    'product.related': 'منتجات مماثلة',
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
    'cart.recommended.title': 'قد يعجبك أيضاً',
    'cart.recommended.subtitle': 'أكمل صندوق أدواتك بهذه العناصر الموصى بها',
    'cart.badge': 'عربة التسوق',
    
    // Cart Items
    'cart.items.title': 'منتجات العربة',
    'cart.save': 'وفر',
    
    // Order Summary
    'cart.summary.title': 'ملخص الطلب',
    'cart.summary.subtotal': 'المجموع الفرعي',
    'cart.summary.savings': 'توفر',
    'cart.summary.promo': 'خصم الكوبون',
    'cart.summary.tax': 'الضريبة',
    'cart.summary.shipping': 'الشحن',
    'cart.summary.free': 'مجاني',
    'cart.summary.total': 'المجموع الكلي',
    'cart.summary.free.shipping': 'شحن مجاني للطلبات التي تزيد عن 500 دولار',
    
    // Promo Code
    'cart.promo.label': 'كود الخصم',
    'cart.promo.applied': 'مُطبق',
    
    // Checkout
    'cart.checkout.button': 'متابعة الدفع',
    'cart.checkout.secure': 'دفع آمن مضمون',
    'cart.checkout.accept': 'نقبل',

    // Featured Products
    'featured.badge': 'المنتجات المميزة',
    'featured.title': 'مجموعة الأدوات',
    'featured.subtitle': 'اكتشف مجموعتنا المختارة يدوياً من أدوات البناء المتميزة، التي يثق بها المحترفون في جميع أنحاء العالم لجودتها وأدائها',
    
    // Featured Filters
    'featured.filters.all': 'جميع المنتجات',
    'featured.filters.power': 'الأدوات الكهربائية',
    'featured.filters.hand': 'الأدوات اليدوية',
    'featured.filters.safety': 'معدات الأمان',
    'featured.cant.find': 'لا تجد ما تبحث عنه؟',
    'featured.expert.section': 'خبراءنا هنا لمساعدتك في العثور على الأدوات المثالية لاحتياجاتك المحددة',
    'featured.custom.quote': 'عرض سعر مخصص',
    'featured.contact.expert': 'اتصل بخبير',
    
    // Partners
    'featured.partners.1': 'شريك 1',
    'featured.partners.2': 'شريك 2', 
    'featured.partners.3': 'شريك 3',
    'featured.partners.4': 'شريك 4',
    'featured.trusted.companies': 'موثوق به من قبل شركات البناء الرائدة',

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
    'about.badge': 'عن شركة BS لأدوات البناء',
    
    // Team Members
    'about.team.ahmed.name': 'أحمد حسن',
    'about.team.ahmed.role': 'المؤسس والمدير التنفيذي',
    'about.team.ahmed.experience': '20+ سنة في البناء',
    'about.team.ahmed.specialty': 'خبير المعدات الثقيلة',
    
    'about.team.sarah.name': 'سارة محمد',
    'about.team.sarah.role': 'رئيس العمليات',
    'about.team.sarah.experience': '15+ سنة في اللوجستيات',
    'about.team.sarah.specialty': 'إدارة سلسلة التوريد',
    
    'about.team.omar.name': 'عمر علي',
    'about.team.omar.role': 'المدير التقني',
    'about.team.omar.experience': '18+ سنة في الهندسة',
    'about.team.omar.specialty': 'متخصص الأدوات الكهربائية',
    
    'about.team.fatima.name': 'فاطمة أحمد',
    'about.team.fatima.role': 'مدير نجاح العملاء',
    'about.team.fatima.experience': '12+ سنة في خدمة العملاء',
    'about.team.fatima.specialty': 'علاقات العملاء',
    
    // Milestones
    'about.milestones.2009.event': 'تأسيس شركة BS لأدوات البناء',
    'about.milestones.2009.desc': 'بدأت كشركة عائلية صغيرة',
    'about.milestones.2012.event': 'أول عقد كبير',
    'about.milestones.2012.desc': 'توريد أدوات لمشروع إنشائي ضخم',
    'about.milestones.2015.event': 'توسيع خط الإنتاج',
    'about.milestones.2015.desc': 'إضافة معدات السلامة وأدوات القياس',
    'about.milestones.2018.event': 'التحول الرقمي',
    'about.milestones.2018.desc': 'إطلاق المنصة الإلكترونية والتجارة الإلكترونية',
    'about.milestones.2021.event': 'التوسع الدولي',
    'about.milestones.2021.desc': 'بدء خدمة العملاء في جميع أنحاء المنطقة',
    'about.milestones.2024.event': 'إطلاق مركز الابتكار',
    'about.milestones.2024.desc': 'افتتاح مركز البحث والتطوير للتقنيات الجديدة',
    
    // Story Section
    'about.story.title': 'قصتنا',
    'about.story.highlight': 'الخاصة',
    'about.story.paragraph1': 'تأسست شركة BS لأدوات البناء في عام 2009 من قبل فريق من خبراء صناعة البناء، بدأت برؤية بسيطة: توفير أدوات ومعدات عالية الجودة للبنائين.',
    'about.story.paragraph2': 'ما بدأ كشركة عائلية صغيرة نما ليصبح مورداً رائداً لأدوات البناء، يخدم آلاف المقاولين والبنائين وعشاق الأعمال اليدوية في جميع أنحاء المنطقة.',
    'about.story.paragraph3': 'اليوم، نواصل التمسك بمبادئنا التأسيسية في الجودة والموثوقية وخدمة العملاء الاستثنائية مع احتضان الابتكار والتقنيات الجديدة التي تساعد عملائنا على العمل بكفاءة وأمان أكبر.',
    'about.story.features.premium': 'أدوات ممتازة',
    'about.story.features.safety': 'السلامة أولاً',
    'about.story.features.innovation': 'الابتكار',
    'about.story.features.excellence': 'التميز',
    
    // Values Section  
    'about.values.title': 'قيمنا',
    'about.values.highlight': 'الأساسية',
    'about.values.description': 'هذه المبادئ توجه كل ما نقوم به وتشكل علاقاتنا مع العملاء والشركاء والمجتمعات التي نخدمها.',
    
    // Journey Section
    'about.journey.title': 'رحلتنا',
    'about.journey.highlight': 'التاريخية',
    'about.journey.description': 'المعالم الرئيسية التي شكلت شركتنا وحددت مسارنا نحو التميز',
    
    // Team Section
    'about.team.title': 'تعرف على',
    'about.team.highlight': 'فريقنا',
    'about.team.description': 'مختصون ذوو خبرة ملتزمون بتزويدك بأفضل الأدوات والخدمات',
    
    // Certifications Section
    'about.certifications.title': 'الشهادات و',
    'about.certifications.highlight': 'الشراكات',
    'about.certifications.description': 'نحافظ على أعلى المعايير الصناعية ونتشارك مع الشركات المصنعة الرائدة',
    'about.certifications.iso.name': 'ISO 9001:2015',
    'about.certifications.iso.desc': 'إدارة الجودة',
    'about.certifications.osha.name': 'معتمد OSHA',
    'about.certifications.osha.desc': 'معايير السلامة',
    'about.certifications.dewalt.name': 'شريك DeWalt',
    'about.certifications.dewalt.desc': 'وكيل معتمد',
    'about.certifications.leader.name': 'رائد الصناعة',
    'about.certifications.leader.desc': 'جائزة التميز',
    
    // CTA Section
    'about.cta.title': 'هل أنت مستعد لبدء مشروعك القادم؟',
    'about.cta.description': 'انضم إلى آلاف العملاء الراضين الذين يثقون في أدوات BS للبناء لمشاريعهم',
    'about.cta.shop': 'تسوق الآن',
    'about.cta.browse': 'تصفح الفئات',
    'about.home.badge': 'عن شركة BuildTools BS',
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
    
    // About Home Features  
    'about.home.features.premium': 'أدوات عالية الجودة من أفضل العلامات التجارية العالمية',
    'about.home.features.pricing': 'أسعار تنافسية مع خيارات دفع مرنة ومتنوعة',
    'about.home.features.support': 'دعم فني متخصص وخدمات استشارية احترافية',

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
    'categories.smart.title': 'أدوات ذكية',
    'categories.smart.desc': 'معدات بناء مزودة بتقنية إنترنت الأشياء',
    'categories.precision.title': 'أدوات دقيقة',
    'categories.precision.desc': 'أدوات قياس موجهة بالليزر',
    'categories.browse': 'تصفح الفئة',
    'categories.featured.products': 'منتجات مميزة',
    'categories.view.all.products': 'عرض جميع المنتجات',

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
    'contact.badge': 'اتصل بنا',
    
    // Contact Info
    'contact.info.office.title': 'المكتب الرئيسي',
    'contact.info.office.street': 'شارع البناء 123',
    'contact.info.office.district': 'حي البناء، المدينة 12345',
    'contact.info.office.country': 'مصر',
    'contact.info.phone.title': 'أرقام الهاتف',
    'contact.info.phone.toll': 'مجاني: 800-TOOLS',
    'contact.info.email.title': 'عناوين البريد الإلكتروني',
    'contact.info.hours.title': 'ساعات العمل',
    'contact.info.hours.weekdays': 'الاثنين - الجمعة: 8:00 ص - 6:00 م',
    'contact.info.hours.saturday': 'السبت: 9:00 ص - 4:00 م',
    'contact.info.hours.sunday': 'الأحد: مغلق',
    
    // Departments
    'contact.departments.sales.name': 'قسم المبيعات',
    'contact.departments.sales.desc': 'استفسارات المنتجات وعروض الأسعار والطلبات',
    'contact.departments.support.name': 'الدعم الفني',
    'contact.departments.support.desc': 'إرشادات المنتج والمساعدة التقنية',
    'contact.departments.service.name': 'خدمة العملاء',
    'contact.departments.service.desc': 'الاستفسارات العامة ورعاية العملاء',
    'contact.departments.partnerships.name': 'الشراكات',
    'contact.departments.partnerships.desc': 'الشراكات التجارية والتعاون',
    
    // Form Fields
    'contact.form.project': 'نوع المشروع',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'الرسالة',
    'contact.form.subject.placeholder': 'كيف يمكننا مساعدتك؟',
    'contact.form.project.residential': 'سكني',
    'contact.form.project.commercial': 'تجاري',
    'contact.form.project.industrial': 'صناعي',
    'contact.form.project.infrastructure': 'بنية تحتية',
    'contact.form.project.renovation': 'تجديد',
    'contact.form.project.other': 'أخرى',
    'contact.form.message.placeholder': 'أخبرنا عن متطلبات مشروعك...',
    
    // Contact Info Section
    'contact.info.title': 'معلومات',
    'contact.info.highlight': 'الاتصال',
    
    // Map Section
    'contact.map.title': 'خريطة تفاعلية',
    'contact.map.desc': 'اعثر علينا على الخريطة',
    
    // Departments Section  
    'contact.departments.title': 'اتصل حسب',
    'contact.departments.highlight': 'القسم',
    'contact.departments.description': 'تواصل مع القسم المناسب للحصول على مساعدة أسرع وأكثر تخصصاً',
    
    // FAQ Section
    'contact.faq.title': 'الأسئلة',
    'contact.faq.highlight': 'الشائعة',
    'contact.faq.description': 'إجابات سريعة على الأسئلة الشائعة حول منتجاتنا وخدماتنا',
    'contact.faq.return.question': 'ما هي سياسة الإرجاع؟',
    'contact.faq.return.answer': 'نقدم سياسة إرجاع لمدة 30 يوماً للعناصر غير المستخدمة في العبوة الأصلية. الأدوات المهنية لها فترة ضمان 90 يوماً.',
    'contact.faq.bulk.question': 'هل تقدمون خصومات للكميات الكبيرة؟',
    'contact.faq.bulk.answer': 'نعم، نقدم أسعار تنافسية للكميات الكبيرة للمقاولين والشركات. اتصل بفريق المبيعات للحصول على عروض أسعار مخصصة.',
    'contact.faq.shipping.question': 'كم يستغرق الشحن؟',
    'contact.faq.shipping.answer': 'الشحن العادي يستغرق 3-5 أيام عمل. الشحن السريع متاح للطلبات العاجلة خلال 1-2 يوم عمل.',
    'contact.faq.support.question': 'هل تقدمون دعماً فنياً؟',
    'contact.faq.support.answer': 'نعم، فريقنا التقني يقدم دعماً كاملاً لجميع المنتجات بما في ذلك إرشادات التركيب وحل المشاكل.',
    
    // Social Media Section
    'contact.social.title': 'تواصل',
    'contact.social.highlight': 'معنا',
    'contact.social.description': 'تابعنا على وسائل التواصل الاجتماعي للحصول على التحديثات والنصائح وآخر أخبار صناعة البناء',
    'contact.social.follow': 'تابعنا على',
    
    // CTA Section
    'contact.cta.title': 'تحتاج مساعدة فورية؟',
    'contact.cta.call': 'اتصل الآن',
    'contact.cta.email': 'البريد الإلكتروني',
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
    'footer.terms': 'شروط الخدمة',
    'footer.cookies': 'سياسة ملفات تعريف الارتباط',
    'footer.sitemap': 'خريطة الموقع',
    'footer.about.us': 'عن الشركة',
    'footer.contact.us': 'اتصل بنا',
    'footer.company.desc': 'شريكك الموثوق للأدوات والمعدات الإنشائية المتخصصة. نبني التميز، مشروع واحد في كل مرة منذ عام 1998.',
    'footer.address': 'شارع البناء رقم 123، المدينة الصناعية',
    'footer.phone': '4567-123 (555) 1+',
    'footer.email': 'info@buildtools-bs.com',
    
    // Services
    'footer.services.rental': 'تأجير الأدوات',
    'footer.services.maintenance': 'صيانة المعدات',
    'footer.services.support': 'الدعم الفني',
    'footer.services.training': 'برامج التدريب',
    'footer.services.custom': 'حلول مخصصة',
    
    // Company
    'footer.company.story': 'قصتنا',
    'footer.company.careers': 'الوظائف',
    'footer.company.news': 'الأخبار والتحديثات',
    'footer.company.partnerships': 'الشراكات',
    
    // Support
    'footer.support.help': 'مركز المساعدة',
    'footer.support.returns': 'المرتجعات والاستبدال',
    'footer.support.warranty': 'مطالبات الضمان',
    'footer.support.track': 'تتبع طلبك',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.search': 'Search',
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
    
    // Hero Tool Cards
    'hero.tools.power.title': 'Power Tools',
    'hero.tools.power.desc': 'Professional grade drills, saws, and more',
    'hero.tools.smart.title': 'Smart Tools',
    'hero.tools.smart.desc': 'IoT-enabled construction equipment',
    'hero.tools.safety.title': 'Safety Gear',
    'hero.tools.safety.desc': 'Advanced protection equipment',
    'hero.tools.precision.title': 'Precision Tools',
    'hero.tools.precision.desc': 'Laser-guided measuring tools',

    // Featured Products
    'featured.badge': 'Featured Products',
    'featured.title': 'Professional Tools',
    'featured.subtitle': 'Discover our hand-picked collection of premium construction tools, trusted by professionals worldwide for their quality and performance',
    
    // Featured Filters
    'featured.filters.all': 'All Products',
    'featured.filters.power': 'Power Tools',
    'featured.filters.hand': 'Hand Tools',
    'featured.filters.safety': 'Safety',
    'featured.cant.find': 'Can\'t find what you\'re looking for?',
    'featured.expert.section': 'Our experts are here to help you find the perfect tools for your specific needs',
    'featured.custom.quote': 'Custom Quote',
    'featured.contact.expert': 'Contact Expert',
    
    // Partners
    'featured.partners.1': 'Partner 1',
    'featured.partners.2': 'Partner 2',
    'featured.partners.3': 'Partner 3',
    'featured.partners.4': 'Partner 4',
    'featured.trusted.companies': 'Trusted by Leading Construction Companies',

    // Products
    'products.title': 'Construction Tools Catalog',
    'products.subtitle': 'Browse our complete collection of professional construction tools, equipment, and safety gear. Quality products trusted by professionals worldwide.',
    'products.showing': 'Showing',
    'products.of': 'of',
    'products.load.more': 'Load More',
    
    // Product Details
    'product.not.found': 'Product Not Found',
    'product.not.found.desc': 'The product you are looking for does not exist.',
    'product.back.to.products': 'Back to Products',
    'product.reviews': 'reviews',
    'product.save': 'Save',
    'product.features': 'Features',
    'product.quantity': 'Quantity',
    'product.specifications': 'Specifications',
    'product.related': 'Related Products',
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
    'cart.recommended.title': 'You might also like',
    'cart.recommended.subtitle': 'Complete your toolkit with these recommended items',
    'cart.badge': 'Shopping Cart',
    
    // Cart Items
    'cart.items.title': 'Cart Items',
    'cart.save': 'Save',
    
    // Order Summary
    'cart.summary.title': 'Order Summary',
    'cart.summary.subtotal': 'Subtotal',
    'cart.summary.savings': 'You Save',
    'cart.summary.promo': 'Promo Discount',
    'cart.summary.tax': 'Tax',
    'cart.summary.shipping': 'Shipping',
    'cart.summary.free': 'FREE',
    'cart.summary.total': 'Total',
    'cart.summary.free.shipping': 'Free shipping on orders over $500',
    
    // Promo Code
    'cart.promo.label': 'Promo Code',
    'cart.promo.applied': 'applied',
    
    // Checkout
    'cart.checkout.button': 'Proceed to Checkout',
    'cart.checkout.secure': 'Secure checkout guaranteed',
    'cart.checkout.accept': 'We accept',

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
    'about.badge': 'About BS Construction Tools',
    
    // Team Members  
    'about.team.ahmed.name': 'Ahmed Hassan',
    'about.team.ahmed.role': 'Founder & CEO',
    'about.team.ahmed.experience': '20+ years in construction',
    'about.team.ahmed.specialty': 'Heavy Machinery Expert',
    
    'about.team.sarah.name': 'Sarah Mohammed',
    'about.team.sarah.role': 'Head of Operations',
    'about.team.sarah.experience': '15+ years in logistics',
    'about.team.sarah.specialty': 'Supply Chain Management',
    
    'about.team.omar.name': 'Omar Ali',
    'about.team.omar.role': 'Technical Director',
    'about.team.omar.experience': '18+ years in engineering',
    'about.team.omar.specialty': 'Power Tools Specialist',
    
    'about.team.fatima.name': 'Fatima Ahmed',
    'about.team.fatima.role': 'Customer Success Manager',
    'about.team.fatima.experience': '12+ years in customer service',
    'about.team.fatima.specialty': 'Client Relations',
    
    // Milestones
    'about.milestones.2009.event': 'BS Construction Tools founded',
    'about.milestones.2009.desc': 'Started as a small family business',
    'about.milestones.2012.event': 'First major contract',
    'about.milestones.2012.desc': 'Supplied tools for mega construction project',
    'about.milestones.2015.event': 'Expanded product line',
    'about.milestones.2015.desc': 'Added safety equipment and measuring tools',
    'about.milestones.2018.event': 'Digital transformation',
    'about.milestones.2018.desc': 'Launched online platform and e-commerce',
    'about.milestones.2021.event': 'International expansion',
    'about.milestones.2021.desc': 'Started serving customers across the region',
    'about.milestones.2024.event': 'Innovation hub launch',
    'about.milestones.2024.desc': 'Opened R&D center for new technologies',
    
    // Story Section
    'about.story.title': 'Our',
    'about.story.highlight': 'Story',
    'about.story.paragraph1': 'Founded in 2009 by a team of construction industry veterans, BS Construction Tools began with a simple vision: to provide builders with access to the highest quality tools and equipment available.',
    'about.story.paragraph2': 'What started as a small family business has grown into a leading supplier of construction tools, serving thousands of contractors, builders, and DIY enthusiasts across the region.',
    'about.story.paragraph3': 'Today, we continue to uphold our founding principles of quality, reliability, and exceptional customer service while embracing innovation and new technologies that help our customers work more efficiently and safely.',
    'about.story.features.premium': 'Premium Tools',
    'about.story.features.safety': 'Safety First',
    'about.story.features.innovation': 'Innovation',
    'about.story.features.excellence': 'Excellence',
    
    // Values Section  
    'about.values.title': 'Our Core',
    'about.values.highlight': 'Values',
    'about.values.description': 'These principles guide everything we do and shape our relationships with customers, partners, and the communities we serve.',
    
    // Journey Section
    'about.journey.title': 'Our',
    'about.journey.highlight': 'Journey',
    'about.journey.description': 'Key milestones that have shaped our company and defined our path to excellence',
    
    // Team Section
    'about.team.title': 'Meet Our',
    'about.team.highlight': 'Team',
    'about.team.description': 'Experienced professionals dedicated to providing you with the best tools and service',
    
    // Certifications Section
    'about.certifications.title': 'Certifications &',
    'about.certifications.highlight': 'Partnerships',
    'about.certifications.description': 'We maintain the highest industry standards and partner with leading manufacturers',
    'about.certifications.iso.name': 'ISO 9001:2015',
    'about.certifications.iso.desc': 'Quality Management',
    'about.certifications.osha.name': 'OSHA Certified',
    'about.certifications.osha.desc': 'Safety Standards',
    'about.certifications.dewalt.name': 'DeWalt Partner',
    'about.certifications.dewalt.desc': 'Authorized Dealer',
    'about.certifications.leader.name': 'Industry Leader',
    'about.certifications.leader.desc': 'Excellence Award',
    
    // CTA Section
    'about.cta.title': 'Ready to Start Your Next Project?',
    'about.cta.description': 'Join thousands of satisfied customers who trust BS Construction Tools for their projects',
    'about.cta.shop': 'Shop Now',
    'about.cta.browse': 'Browse Categories',
    'about.home.badge': 'About BuildTools BS',
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
    
    // About Home Features
    'about.home.features.premium': 'Premium quality tools from leading global brands',
    'about.home.features.pricing': 'Competitive pricing with flexible payment options',
    'about.home.features.support': 'Expert technical support and consultation services',

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
    'categories.smart.title': 'Smart Tools',
    'categories.smart.desc': 'IoT-enabled construction equipment',
    'categories.precision.title': 'Precision Tools',
    'categories.precision.desc': 'Laser-guided measuring tools',
    'categories.browse': 'Browse Category',
    'categories.featured.products': 'Featured Products',
    'categories.view.all.products': 'View All Products',

    // Featured Products
    'featured.title': 'Professional Tool Collection',
    'featured.subtitle': 'Discover our hand-picked selection of premium construction tools, trusted by professionals worldwide for their quality and performance',
    'featured.cant.find': 'Can\'t Find What You\'re Looking For',
    'featured.expert.section': 'Our experts are here to help you find the perfect tools for your specific needs',
    'featured.custom.quote': 'Custom Quote',
    'featured.contact.expert': 'Contact Expert',
    
    // Partners
    'featured.partners.1': 'Partner 1',
    'featured.partners.2': 'Partner 2',
    'featured.partners.3': 'Partner 3', 
    'featured.partners.4': 'Partner 4',
    'featured.trusted.companies': 'Trusted by Leading Construction Companies',



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
    'contact.badge': 'Contact Us',
    
    // Contact Info
    'contact.info.office.title': 'Main Office',
    'contact.info.office.street': '123 Construction Street',
    'contact.info.office.district': 'Building District, City 12345',
    'contact.info.office.country': 'Egypt',
    'contact.info.phone.title': 'Phone Numbers',
    'contact.info.phone.toll': 'Toll Free: 800-TOOLS',
    'contact.info.email.title': 'Email Addresses',
    'contact.info.hours.title': 'Business Hours',
    'contact.info.hours.weekdays': 'Monday - Friday: 8:00 AM - 6:00 PM',
    'contact.info.hours.saturday': 'Saturday: 9:00 AM - 4:00 PM',
    'contact.info.hours.sunday': 'Sunday: Closed',
    
    // Departments
    'contact.departments.sales.name': 'Sales Department',
    'contact.departments.sales.desc': 'Product inquiries, quotes, and orders',
    'contact.departments.support.name': 'Technical Support',
    'contact.departments.support.desc': 'Product guidance and technical assistance',
    'contact.departments.service.name': 'Customer Service',
    'contact.departments.service.desc': 'General inquiries and customer care',
    'contact.departments.partnerships.name': 'Partnerships',
    'contact.departments.partnerships.desc': 'Business partnerships and collaborations',
    
    // Form Fields
    'contact.form.project': 'Project Type',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Message',
    'contact.form.subject.placeholder': 'How can we help you?',
    'contact.form.project.residential': 'Residential',
    'contact.form.project.commercial': 'Commercial',
    'contact.form.project.industrial': 'Industrial',
    'contact.form.project.infrastructure': 'Infrastructure',
    'contact.form.project.renovation': 'Renovation',
    'contact.form.project.other': 'Other',
    'contact.form.message.placeholder': 'Tell us about your project requirements...',
    
    // Contact Info Section
    'contact.info.title': 'Contact',
    'contact.info.highlight': 'Information',
    
    // Map Section
    'contact.map.title': 'Interactive Map',
    'contact.map.desc': 'Find us on the map',
    
    // Departments Section  
    'contact.departments.title': 'Contact by',
    'contact.departments.highlight': 'Department',
    'contact.departments.description': 'Reach out to the right department for faster and more specialized assistance',
    
    // FAQ Section
    'contact.faq.title': 'Frequently Asked',
    'contact.faq.highlight': 'Questions',
    'contact.faq.description': 'Quick answers to common questions about our products and services',
    'contact.faq.return.question': 'What is your return policy?',
    'contact.faq.return.answer': 'We offer a 30-day return policy for unused items in original packaging. Professional tools have a 90-day warranty period.',
    'contact.faq.bulk.question': 'Do you offer bulk discounts?',
    'contact.faq.bulk.answer': 'Yes, we provide competitive bulk pricing for contractors and businesses. Contact our sales team for custom quotes.',
    'contact.faq.shipping.question': 'How long does shipping take?',
    'contact.faq.shipping.answer': 'Standard shipping takes 3-5 business days. Express shipping is available for urgent orders within 1-2 business days.',
    'contact.faq.support.question': 'Do you provide technical support?',
    'contact.faq.support.answer': 'Yes, our technical team provides full support for all products including installation guidance and troubleshooting.',
    
    // Social Media Section
    'contact.social.title': 'Connect with',
    'contact.social.highlight': 'Us',
    'contact.social.description': 'Follow us on social media for updates, tips, and the latest construction industry news',
    'contact.social.follow': 'Follow us on',
    
    // CTA Section
    'contact.cta.title': 'Need Immediate Assistance?',
    'contact.cta.call': 'Call Now',
    'contact.cta.email': 'Email',
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
    'footer.terms': 'Terms of Service',
    'footer.cookies': 'Cookie Policy',
    'footer.sitemap': 'Sitemap',
    'footer.about.us': 'About Us',
    'footer.contact.us': 'Contact Us',
    'footer.company.desc': 'Your trusted partner for professional construction tools and equipment. Building excellence, one project at a time since 1998.',
    'footer.address': 'Construction Blvd, Industrial City 123',
    'footer.phone': '123-4567 (555) 1+',
    'footer.email': 'info@buildtools-bs.com',
    
    // Services
    'footer.services.rental': 'Tool Rental',
    'footer.services.maintenance': 'Equipment Maintenance',
    'footer.services.support': 'Technical Support',
    'footer.services.training': 'Training Programs',
    'footer.services.custom': 'Custom Solutions',
    
    // Company
    'footer.company.story': 'Our Story',
    'footer.company.careers': 'Careers',
    'footer.company.news': 'News & Updates',
    'footer.company.partnerships': 'Partnerships',
    
    // Support
    'footer.support.help': 'Help Center',
    'footer.support.returns': 'Returns & Exchanges',
    'footer.support.warranty': 'Warranty Claims',
    'footer.support.track': 'Track Your Order',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Initialize from LanguageManager
    return LanguageManager.getCurrentLang() as Language;
  });

  // Load language from localStorage on mount
  useEffect(() => {
    const currentLang = LanguageManager.getCurrentLang() as Language;
    if (currentLang && (currentLang === 'ar' || currentLang === 'en')) {
      setLanguage(currentLang);
    }
  }, []);

  // Save language to localStorage and update document direction
  useEffect(() => {
    localStorage.setItem('app_language', language);
    
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

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    LanguageManager.setLanguage(lang);
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
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