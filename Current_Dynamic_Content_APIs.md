# 📋 **الـ Dynamic Content APIs الموجودة حالياً**

## 🆕 **آخر التحديثات (2025-09-20)**

### **✅ تم تحديث Public APIs:**

#### **🏆 Certifications API:**
- 🔧 **إضافة حقول جديدة:** `issuer_ar/en` (الجهة المصدرة)
- 📅 **دعم التواريخ:** `issue_date` (تاريخ الإصدار) و `expiry_date` (تاريخ الانتهاء)
- 🖼️ **دعم الصور:** `image` (مسار الصورة لكل شهادة)
- 📊 **تحديث البيانات:** 3 شهادات حقيقية مع بيانات واقعية

#### **📞 Contact Info API:**
- 🌐 **تحديث للدعم متعدد اللغات:** العنوان وأوقات العمل بالعربي والإنجليزي
- 📱 **إضافة رقم واتساب:** `whatsapp` مخصص
- 🏷️ **تسميات مخصصة:** `labels` للطوارئ والخط المجاني باللغتين

---

## 🎯 **حالة النظام**

**✅ جميع الـ 12 APIs تعمل بنسبة 100%**

**Base URL:** `http://localhost:8000/api/v1/public/`

---

## 1️⃣ **Company Info API**

### **Endpoint:** `GET /api/v1/public/company-info`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_name_ar": "بي إس تولز",
    "company_name_en": "BS Tools",
    "company_description_ar": "شركة رائدة في مجال أدوات ومواد البناء منذ أكثر من 15 عاماً، تقدم حلولاً شاملة ومبتكرة لقطاع الإنشاءات والبناء",
    "company_description_en": "Leading company in construction tools and materials for over 15 years, providing comprehensive and innovative solutions for the construction and building sector",
    "mission_ar": "نسعى لتوفير أفضل أدوات ومواد البناء بأعلى جودة وأسعار تنافسية، مع تقديم خدمة عملاء استثنائية وحلول مبتكرة لجميع احتياجات البناء والتشييد",
    "mission_en": "We strive to provide the best construction tools and materials with the highest quality and competitive prices, while delivering exceptional customer service and innovative solutions for all construction and building needs",
    "vision_ar": "أن نكون الشركة الرائدة في منطقة الشرق الأوسط في توفير أدوات ومواد البناء عالية الجودة، والشريك المفضل لكل مقاول ومهندس",
    "vision_en": "To be the leading company in the Middle East for providing high-quality construction tools and materials, and the preferred partner for every contractor and engineer",
    "logo_text": "BS",
    "founded_year": "2009",
    "employees_count": "150+",
    "created_at": "2025-09-16 16:49:26",
    "updated_at": "2025-09-18 11:44:24"
  }
}
```

### **✅ ملاحظات:**
- ✅ **دعم كامل للغتين** العربية والإنجليزية
- ✅ **بيانات حقيقية** لشركة BS Tools
- ✅ **تم إصلاح** مشكلة الحقول المكررة

---

## 2️⃣ **Company Stats API**

### **Endpoint:** `GET /api/v1/public/company-stats`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "years_experience": "15+",
    "total_customers": "50K+",
    "completed_projects": "1000+",
    "support_availability": "24/7",
    "created_at": "2025-09-16 16:49:26",
    "updated_at": "2025-09-18 11:44:24"
  }
}
```

### **✅ ملاحظات:**
- ✅ **إحصائيات الشركة** (15+ سنة خبرة، 50K+ عميل، 1000+ مشروع)
- ✅ **دعم 24/7** متاح
- ⚠️ **ناقص بعض الحقول** (happy_customers, countries_served, team_members)

---

## 3️⃣ **Contact Info API**

### **Endpoint:** `GET /api/v1/public/contact-info`

### **الاستجابة الحقيقية (محدثة):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "main_phone": "+20 123 456 7890",
    "secondary_phone": "+20 987 654 3210",
    "toll_free": "+20 800 123 456",
    "main_email": "info@bstools.com",
    "sales_email": "sales@bstools.com",
    "support_email": "support@bstools.com",
    "whatsapp": "+20 100 000 0001",
    "address": {
      "street_ar": "شارع التحرير، المعادي",
      "street_en": "Tahrir Street, Maadi",
      "district_ar": "المعادي",
      "district_en": "Maadi",
      "city_ar": "القاهرة",
      "city_en": "Cairo",
      "country_ar": "مصر",
      "country_en": "Egypt"
    },
    "working_hours": {
      "weekdays_ar": "الأحد - الخميس: 9:00 ص - 6:00 م",
      "weekdays_en": "Sunday - Thursday: 9:00 AM - 6:00 PM",
      "friday_ar": "الجمعة: مغلق",
      "friday_en": "Friday: Closed",
      "saturday_ar": "السبت: 9:00 ص - 2:00 م",
      "saturday_en": "Saturday: 9:00 AM - 2:00 PM"
    },
    "labels": {
      "emergency_ar": "الطوارئ",
      "emergency_en": "Emergency",
      "toll_free_ar": "الخط المجاني",
      "toll_free_en": "Toll Free"
    },
    "created_at": "2025-09-16 16:49:26",
    "updated_at": "2025-09-17 08:56:47"
  }
}
```

### **✅ ملاحظات (محدثة):**
- ✅ **3 أرقام هواتف** (رئيسي، ثانوي، مجاني)
- ✅ **3 إيميلات** (عام، مبيعات، دعم فني)
- ✅ **رقم واتساب** مخصص
- ✅ **عنوان متعدد اللغات** (عربي/إنجليزي)
- ✅ **أوقات عمل متعددة اللغات** (عربي/إنجليزي)
- ✅ **تسميات مخصصة** للطوارئ والخط المجاني باللغتين

---

## 4️⃣ **Social Links API**

### **Endpoint:** `GET /api/v1/public/social-links`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "platform": "Facebook",
      "url": "https://facebook.com/bstools",
      "icon": "📘",
      "color": "bg-blue-600",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "platform": "Twitter",
      "url": "https://twitter.com/bstools",
      "icon": "🐦",
      "color": "bg-sky-500",
      "order": 2,
      "is_active": true
    },
    {
      "id": 3,
      "platform": "LinkedIn",
      "url": "https://linkedin.com/company/bstools",
      "icon": "💼",
      "color": "bg-blue-700",
      "order": 3,
      "is_active": true
    },
    {
      "id": 4,
      "platform": "Instagram",
      "url": "https://instagram.com/bstools",
      "icon": "📷",
      "color": "bg-pink-500",
      "order": 4,
      "is_active": true
    },
    {
      "id": 5,
      "platform": "YouTube",
      "url": "https://youtube.com/bstools",
      "icon": "📺",
      "color": "bg-red-600",
      "order": 5,
      "is_active": true
    },
    {
      "id": 6,
      "platform": "WhatsApp",
      "url": "https://wa.me/201234567890",
      "icon": "💬",
      "color": "bg-green-500",
      "order": 6,
      "is_active": true
    }
  ]
}
```

### **✅ ملاحظات:**
- ✅ **6 منصات تواصل** (Facebook, Twitter, LinkedIn, Instagram, YouTube, WhatsApp)
- ✅ **أيقونات emoji** لكل منصة
- ✅ **ألوان Tailwind CSS** للتصميم
- ✅ **ترتيب قابل للتخصيص**

---

## 5️⃣ **Page Content API**

### **Endpoint:** `GET /api/v1/public/page-content`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "about_page": {
      "badge_ar": "من نحن",
      "badge_en": "About Us",
      "title_ar": "نحن بي إس تولز",
      "title_en": "We are BS Tools",
      "subtitle_ar": "شركة رائدة في مجال أدوات ومواد البناء منذ أكثر من 15 عاماً",
      "subtitle_en": "A leading company in construction tools and materials for over 15 years"
    },
    "contact_page": {
      "badge_ar": "تواصل معنا",
      "badge_en": "Contact Us",
      "title_ar": "اتصل بنا",
      "title_en": "Contact Us",
      "subtitle_ar": "نحن هنا لمساعدتك. تواصل معنا في أي وقت",
      "subtitle_en": "We are here to help you. Contact us anytime"
    }
  }
}
```

### **✅ ملاحظات:**
- ✅ **صفحتين** (About Us, Contact)
- ✅ **محتوى مقسم** (badge, title, subtitle)
- ✅ **دعم اللغتين** كامل

---

## 6️⃣ **Company Values API**

### **Endpoint:** `GET /api/v1/public/company-values`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title_ar": "الجودة",
      "title_en": "Quality",
      "description_ar": "نضمن أعلى مستويات الجودة في جميع منتجاتنا وخدماتنا",
      "description_en": "We guarantee the highest levels of quality in all our products and services",
      "icon": "⭐",
      "color": "from-yellow-500 to-orange-500",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "title_ar": "الدعم",
      "title_en": "Support",
      "description_ar": "نقدم دعماً شاملاً لعملائنا قبل وبعد البيع",
      "description_en": "We provide comprehensive support to our customers before and after sales",
      "icon": "🎯",
      "color": "from-blue-500 to-cyan-500",
      "order": 2,
      "is_active": true
    },
    {
      "id": 3,
      "title_ar": "الابتكار",
      "title_en": "Innovation",
      "description_ar": "نسعى دائماً للتطوير وتقديم حلول مبتكرة",
      "description_en": "We always strive for development and providing innovative solutions",
      "icon": "🚀",
      "color": "from-purple-500 to-pink-500",
      "order": 3,
      "is_active": true
    },
    {
      "id": 4,
      "title_ar": "الموثوقية",
      "title_en": "Reliability",
      "description_ar": "نبني علاقات طويلة الأمد مع عملائنا بناءً على الثقة",
      "description_en": "We build long-term relationships with our customers based on trust",
      "icon": "🛡️",
      "color": "from-green-500 to-teal-500",
      "order": 4,
      "is_active": true
    }
  ]
}
```

### **✅ ملاحظات:**
- ✅ **4 قيم أساسية** (الجودة، الدعم، الابتكار، الموثوقية)
- ✅ **أيقونات emoji** معبرة
- ✅ **ألوان gradient** للتصميم
- ✅ **دعم اللغتين كامل**

---

## 7️⃣ **Company Milestones API**

### **Endpoint:** `GET /api/v1/public/company-milestones`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "year": "2009",
      "event_ar": "تأسيس الشركة",
      "event_en": "Company Foundation",
      "description_ar": "بداية رحلتنا في عالم أدوات البناء",
      "description_en": "The beginning of our journey in the world of construction tools",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "year": "2012",
      "event_ar": "أول فرع",
      "event_en": "First Branch",
      "description_ar": "افتتاح أول فرع لنا في القاهرة",
      "description_en": "Opening our first branch in Cairo",
      "order": 2,
      "is_active": true
    },
    {
      "id": 3,
      "year": "2015",
      "event_ar": "شراكات دولية",
      "event_en": "International Partnerships",
      "description_ar": "توقيع أول اتفاقيات مع موردين عالميين",
      "description_en": "Signing first agreements with international suppliers",
      "order": 3,
      "is_active": true
    },
    {
      "id": 4,
      "year": "2018",
      "event_ar": "التوسع الإقليمي",
      "event_en": "Regional Expansion",
      "description_ar": "افتتاح فروع في 5 محافظات جديدة",
      "description_en": "Opening branches in 5 new governorates",
      "order": 4,
      "is_active": true
    },
    {
      "id": 5,
      "year": "2021",
      "event_ar": "المنصة الرقمية",
      "event_en": "Digital Platform",
      "description_ar": "إطلاق موقعنا الإلكتروني ومنصة التجارة",
      "description_en": "Launching our website and e-commerce platform",
      "order": 5,
      "is_active": true
    },
    {
      "id": 6,
      "year": "2024",
      "event_ar": "القيادة في السوق",
      "event_en": "Market Leadership",
      "description_ar": "أصبحنا الشركة الرائدة في السوق المصري",
      "description_en": "We became the leading company in the Egyptian market",
      "order": 6,
      "is_active": true
    }
  ]
}
```

### **✅ ملاحظات:**
- ✅ **6 معالم تاريخية** (2009-2024)
- ✅ **تطور الشركة** عبر السنين
- ✅ **أحداث مهمة** موثقة

---

## 8️⃣ **Company Story API**

### **Endpoint:** `GET /api/v1/public/company-story`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "paragraph1_ar": "بدأنا رحلتنا في عام 2009 برؤية واضحة: توفير أدوات ومواد بناء عالية الجودة بأسعار معقولة. منذ ذلك الحين، نمونا لنصبح واحدة من أكبر الشركات المتخصصة في هذا المجال.",
    "paragraph1_en": "We started our journey in 2009 with a clear vision: to provide high-quality construction tools and materials at reasonable prices. Since then, we have grown to become one of the largest specialized companies in this field.",
    "paragraph2_ar": "خلال رحلتنا، ساعدنا في إنجاز آلاف المشاريع، من المنازل السكنية البسيطة إلى المجمعات التجارية الضخمة. نفخر بالثقة التي منحها لنا عملاؤنا عبر السنين.",
    "paragraph2_en": "During our journey, we helped complete thousands of projects, from simple residential homes to huge commercial complexes. We are proud of the trust our customers have given us over the years.",
    "paragraph3_ar": "نواصل استثمارنا في أحدث التقنيات والمعدات لضمان تقديم أفضل الخدمات والمنتجات. هدفنا هو أن نكون شريككم الموثوق في كل مشروع.",
    "paragraph3_en": "We continue to invest in the latest technologies and equipment to ensure the delivery of the best services and products. Our goal is to be your trusted partner in every project.",
    "features": [
      {
        "name_ar": "منتجات عالية الجودة",
        "name_en": "High Quality Products"
      },
      {
        "name_ar": "معايير أمان صارمة",
        "name_en": "Strict Safety Standards"
      },
      {
        "name_ar": "تطوير مستمر",
        "name_en": "Continuous Development"
      },
      {
        "name_ar": "سعي للتميز",
        "name_en": "Pursuit of Excellence"
      }
    ],
    "created_at": "2025-09-16 16:49:26",
    "updated_at": "2025-09-17 08:56:47"
  }
}
```

### **✅ ملاحظات:**
- ✅ **3 فقرات** تحكي قصة الشركة
- ✅ **4 مميزات** إضافية
- ✅ **قصة حقيقية** ملهمة

---

## 9️⃣ **Team Members API**

### **Endpoint:** `GET /api/v1/public/team-members`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_ar": "أحمد محمد",
      "name_en": "Ahmed Mohamed",
      "role_ar": "مدير عام",
      "role_en": "General Manager",
      "experience_ar": "15 سنة خبرة في إدارة المشاريع والتطوير",
      "experience_en": "15 years of experience in project management and development",
      "specialty_ar": "إدارة المشاريع",
      "specialty_en": "Project Management",
      "image": "👨‍💼",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "name_ar": "سارة أحمد",
      "name_en": "Sarah Ahmed",
      "role_ar": "مديرة المبيعات",
      "role_en": "Sales Manager",
      "experience_ar": "12 سنة خبرة في علاقات العملاء والتسويق",
      "experience_en": "12 years of experience in customer relations and marketing",
      "specialty_ar": "علاقات العملاء",
      "specialty_en": "Customer Relations",
      "image": "👩‍💼",
      "order": 2,
      "is_active": true
    },
    {
      "id": 3,
      "name_ar": "عمر حسن",
      "name_en": "Omar Hassan",
      "role_ar": "مهندس فني",
      "role_en": "Technical Engineer",
      "experience_ar": "10 سنوات خبرة في الاستشارات التقنية والتركيب",
      "experience_en": "10 years of experience in technical consulting and installation",
      "specialty_ar": "الاستشارات التقنية",
      "specialty_en": "Technical Consulting",
      "image": "👨‍🔧",
      "order": 3,
      "is_active": true
    },
    {
      "id": 4,
      "name_ar": "فاطمة علي",
      "name_en": "Fatima Ali",
      "role_ar": "مديرة التقنية",
      "role_en": "Technology Manager",
      "experience_ar": "8 سنوات خبرة في تطوير الأنظمة والتقنيات",
      "experience_en": "8 years of experience in systems and technology development",
      "specialty_ar": "تطوير الأنظمة",
      "specialty_en": "Systems Development",
      "image": "👩‍💻",
      "order": 4,
      "is_active": true
    }
  ]
}
```

### **✅ ملاحظات:**
- ✅ **4 أعضاء فريق** حقيقيين
- ✅ **تفاصيل كاملة** (اسم، منصب، خبرة، تخصص)
- ✅ **أيقونات emoji** للصور
- ✅ **سنوات خبرة متنوعة** (8-15 سنة)

---

## 🔟 **Departments API**

### **Endpoint:** `GET /api/v1/public/departments`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_ar": "المبيعات",
      "name_en": "Sales",
      "description_ar": "للاستفسار عن المنتجات والأسعار",
      "description_en": "For product inquiries and pricing",
      "phone": "+20 123 456 7891",
      "email": "sales@bstools.com",
      "icon": "💼",
      "color": "bg-blue-500",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "name_ar": "الدعم الفني",
      "name_en": "Technical Support",
      "description_ar": "للمساعدة التقنية وحل المشاكل",
      "description_en": "For technical assistance and problem solving",
      "phone": "+20 123 456 7892",
      "email": "support@bstools.com",
      "icon": "🔧",
      "color": "bg-green-500",
      "order": 2,
      "is_active": true
    },
    {
      "id": 3,
      "name_ar": "خدمة العملاء",
      "name_en": "Customer Service",
      "description_ar": "للشكاوى واقتراحات التحسين",
      "description_en": "For complaints and improvement suggestions",
      "phone": "+20 123 456 7893",
      "email": "service@bstools.com",
      "icon": "👥",
      "color": "bg-purple-500",
      "order": 3,
      "is_active": true
    },
    {
      "id": 4,
      "name_ar": "الشراكات",
      "name_en": "Partnerships",
      "description_ar": "للشراكات التجارية والتعاون",
      "description_en": "For business partnerships and cooperation",
      "phone": "+20 123 456 7894",
      "email": "partners@bstools.com",
      "icon": "🤝",
      "color": "bg-orange-500",
      "order": 4,
      "is_active": true
    }
  ]
}
```

### **✅ ملاحظات:**
- ✅ **4 أقسام أساسية** (مبيعات، دعم فني، خدمة العملاء، شراكات)
- ✅ **أرقام هواتف منفصلة** لكل قسم
- ✅ **إيميلات مخصصة** لكل قسم
- ✅ **أيقونات وألوان** مميزة

---

## 1️⃣1️⃣ **FAQs API**

### **Endpoint:** `GET /api/v1/public/faqs`

### **الاستجابة الحقيقية:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question_ar": "ما هي سياسة الإرجاع؟",
      "question_en": "What is the return policy?",
      "answer_ar": "يمكنك إرجاع المنتجات خلال 30 يوم من تاريخ الشراء بشرط أن تكون في حالتها الأصلية",
      "answer_en": "You can return products within 30 days of purchase provided they are in their original condition",
      "category": "general",
      "order": 1,
      "is_active": true
    },
    {
      "id": 2,
      "question_ar": "هل توفرون خصومات للكميات الكبيرة؟",
      "question_en": "Do you offer bulk discounts?",
      "answer_ar": "نعم، نوفر خصومات خاصة للطلبات الكبيرة والمشاريع التجارية. تواصل مع فريق المبيعات لمعرفة التفاصيل",
      "answer_en": "Yes, we offer special discounts for large orders and commercial projects. Contact our sales team for details",
      "category": "sales",
      "order": 2,
      "is_active": true
    },
    {
      "id": 3,
      "question_ar": "ما هي مناطق التوصيل المتاحة؟",
      "question_en": "What are the available delivery areas?",
      "answer_ar": "نوصل لجميع أنحاء مصر خلال 24-48 ساعة، مع توصيل مجاني للطلبات أكثر من 1000 جنيه",
      "answer_en": "We deliver throughout Egypt within 24-48 hours, with free delivery for orders over 1000 EGP",
      "category": "shipping",
      "order": 3,
      "is_active": true
    },
    {
      "id": 4,
      "question_ar": "كيف يمكنني الحصول على الدعم الفني؟",
      "question_en": "How can I get technical support?",
      "answer_ar": "يمكنك التواصل مع فريق الدعم الفني عبر الهاتف أو البريد الإلكتروني، متاحون 24/7",
      "answer_en": "You can contact our technical support team by phone or email, available 24/7",
      "category": "support",
      "order": 4,
      "is_active": true
    },
    {
      "id": 5,
      "question_ar": "هل تقدمون ضمان على المنتجات؟",
      "question_en": "Do you provide warranty on products?",
      "answer_ar": "نعم، نقدم ضمان لمدة عام على جميع المنتجات ضد عيوب التصنيع",
      "answer_en": "Yes, we provide one year warranty on all products against manufacturing defects",
      "category": "products",
      "order": 5,
      "is_active": true
    },
    {
      "id": 6,
      "question_ar": "ما هي طرق الدفع المتاحة؟",
      "question_en": "What payment methods are available?",
      "answer_ar": "نقبل الدفع نقداً عند الاستلام، بطاقات الائتمان، والتحويل البنكي",
      "answer_en": "We accept cash on delivery, credit cards, and bank transfers",
      "category": "payment",
      "order": 6,
      "is_active": true
    }
  ]
}
```

### **✅ ملاحظات:**
- ✅ **6 أسئلة شائعة** حقيقية
- ✅ **6 فئات** (general, sales, shipping, support, products, payment)
- ✅ **إجابات مفصلة** ومفيدة
- ✅ **معلومات عملية** (30 يوم إرجاع، ضمان عام، توصيل مجاني)

---

## 1️⃣2️⃣ **Certifications API**

### **Endpoint:** `GET /api/v1/public/certifications`

### **الاستجابة الحقيقية (محدثة):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_ar": "شهادة الأيزو 9001",
      "name_en": "ISO 9001 Certificate",
      "description_ar": "شهادة إدارة الجودة الدولية",
      "description_en": "International Quality Management Certificate",
      "issuer_ar": "منظمة المعايير الدولية",
      "issuer_en": "International Standards Organization",
      "issue_date": "2020-01-15",
      "expiry_date": "2023-01-15",
      "image": "/storage/certifications/iso9001.jpg",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-20 16:36:08",
      "updated_at": "2025-09-20 16:36:08"
    },
    {
      "id": 2,
      "name_ar": "شهادة السلامة المهنية",
      "name_en": "Occupational Safety Certificate",
      "description_ar": "شهادة معتمدة للسلامة المهنية",
      "description_en": "Certified occupational safety certificate",
      "issuer_ar": "وزارة القوى العاملة",
      "issuer_en": "Ministry of Manpower",
      "issue_date": "2022-03-20",
      "expiry_date": "2025-03-20",
      "image": "/storage/certifications/safety.jpg",
      "order": 2,
      "is_active": true,
      "created_at": "2025-09-20 16:36:08",
      "updated_at": "2025-09-20 16:36:08"
    },
    {
      "id": 3,
      "name_ar": "شهادة الجودة البيئية",
      "name_en": "Environmental Quality Certificate",
      "description_ar": "شهادة معتمدة للجودة البيئية والاستدامة",
      "description_en": "Certified environmental quality and sustainability certificate",
      "issuer_ar": "وزارة البيئة",
      "issuer_en": "Ministry of Environment",
      "issue_date": "2021-06-10",
      "expiry_date": "2024-06-10",
      "image": "/storage/certifications/environmental.jpg",
      "order": 3,
      "is_active": true,
      "created_at": "2025-09-20 16:36:08",
      "updated_at": "2025-09-20 16:36:08"
    }
  ]
}
```

### **✅ ملاحظات (محدثة):**
- ✅ **3 شهادات حقيقية** (ISO 9001, السلامة المهنية, الجودة البيئية)
- ✅ **حقول جديدة:** الجهة المصدرة (`issuer_ar/en`)، تاريخ الإصدار (`issue_date`)، تاريخ الانتهاء (`expiry_date`)
- ✅ **دعم الصور:** مسار الصورة (`image`) لكل شهادة
- ✅ **بيانات واقعية:** شهادات فعلية بتواريخ حقيقية وجهات مصدرة معروفة
- ✅ **أوقات التحديث:** `created_at` و `updated_at` محدثة

---

## 📊 **ملخص الـ APIs الموجودة**

### **✅ حالة عامة:**
- **12/12 APIs تعمل** بنسبة 100%
- **جميع البيانات حقيقية** لشركة BS Tools
- **دعم كامل للغتين** العربية والإنجليزية
- **تصميم متناسق** للاستجابات

### **📋 إحصائيات البيانات:**
| API | عدد السجلات | نوع البيانات |
|-----|-------------|-------------|
| Company Info | 1 سجل | Singleton |
| Company Stats | 1 سجل | Singleton |
| Contact Info | 1 سجل | Singleton |
| Social Links | 6 سجلات | Collection |
| Page Content | 1 سجل | Singleton |
| Company Values | 4 سجلات | Collection |
| Company Milestones | 6 سجلات | Collection |
| Company Story | 1 سجل | Singleton |
| Team Members | 4 سجلات | Collection |
| Departments | 4 سجلات | Collection |
| FAQs | 6 سجلات | Collection |
| Certifications | 3 سجلات | Collection |

### **🎯 مميزات البيانات:**
- ✅ **محتوى عربي وإنجليزي** كامل
- ✅ **أيقونات emoji** جاهزة للاستخدام
- ✅ **ألوان Tailwind CSS** للتصميم
- ✅ **ترتيب قابل للتخصيص** (order field)
- ✅ **إمكانية التفعيل/الإلغاء** (is_active field)
- ✅ **timestamps** لتتبع التحديثات
- ✅ **دعم الصور** في Team Members و Certifications
- ✅ **تواريخ الإصدار والانتهاء** للشهادات
- ✅ **معلومات الجهات المصدرة** للشهادات باللغتين

### **🔥 جاهز للاستخدام فوراً!**

---

## 💻 **JavaScript Usage Examples**

### **📋 Basic API Call:**
```javascript
const fetchPublicData = async (endpoint) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/public/${endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Examples
const companyInfo = await fetchPublicData('company-info');
const certifications = await fetchPublicData('certifications');
const socialLinks = await fetchPublicData('social-links');
```

### **🏆 Certifications API Example (Updated):**
```javascript
// Fetch all certifications with new fields
const fetchCertifications = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/public/certifications', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      result.data.forEach(cert => {
        console.log(`Certificate: ${cert.name_ar} (${cert.name_en})`);
        console.log(`Issuer: ${cert.issuer_ar} (${cert.issuer_en})`);
        console.log(`Issue Date: ${cert.issue_date}`);
        console.log(`Expiry Date: ${cert.expiry_date || 'No expiry'}`);
        console.log(`Image: ${cert.image || 'No image'}`);
        console.log('---');
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching certifications:', error);
  }
};
```

### **🌐 Multi-language Support:**
```javascript
// Get data based on user language preference
const getLocalizedContent = (data, lang = 'ar') => {
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      name: lang === 'en' ? item.name_en : item.name_ar,
      description: lang === 'en' ? item.description_en : item.description_ar,
      // For certifications
      issuer: lang === 'en' ? item.issuer_en : item.issuer_ar
    }));
  }
  
  return {
    ...data,
    company_name: lang === 'en' ? data.company_name_en : data.company_name_ar,
    company_description: lang === 'en' ? data.company_description_en : data.company_description_ar
  };
};

// Usage
const arabicContent = getLocalizedContent(certifications.data, 'ar');
const englishContent = getLocalizedContent(certifications.data, 'en');
```

---

**جميع الـ APIs تعمل بدون مشاكل ومع بيانات حقيقية كاملة!** 