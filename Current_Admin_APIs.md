# 🔒 **الـ Dynamic Content Admin APIs الموجودة حالياً**

## 🆕 **آخر التحديثات (2025-09-20)**

### **✅ تم إكمال وتحديث Certifications Admin API:**
- 🔧 **إكمال جدول قاعدة البيانات** بجميع الحقول المطلوبة
- 📊 **إضافة حقول جديدة:** `issuer_ar`, `issuer_en`, `issue_date`, `expiry_date`
- 🖼️ **تحسين معالجة الصور:** رفع، تحديث، وحذف تلقائي للصور
- ✅ **تحديث Validation Rules** لدعم التواريخ والصور
- 📝 **إنشاء CertificationSeeder** مع بيانات تجريبية حقيقية
- 🔄 **تحديث JavaScript Examples** لدعم رفع الصور مع FormData

---

## 🎯 **حالة النظام**

**Base URL:** `http://localhost:8000/api/v1/admin/`

**🔐 Authentication Required:** `Bearer Token` (Admin Role)

---

## 📋 **Admin APIs Status**

من خلال فحص الكود الفعلي، هذه هي حالة الـ Admin APIs:

| # | API | Status | Methods | Type | Notes |
|---|-----|--------|---------|------|-------|
| 1️⃣ | `company-info` | ✅ Working | GET, PUT | Singleton | Company Information |
| 2️⃣ | `company-stats` | ✅ Working | GET, PUT | Singleton | Company Statistics |
| 3️⃣ | `contact-info` | ✅ Working | GET, PUT | Singleton | Contact Information |
| 4️⃣ | `social-links` | ✅ Working | GET, POST, PUT, DELETE | Collection | Social Media Links |
| 5️⃣ | `page-content` | ✅ Working | GET, PUT | Singleton | Page Content |
| 6️⃣ | `company-values` | ✅ Working | GET, POST, PUT, DELETE | Collection | Company Values |
| 7️⃣ | `company-milestones` | ✅ Working | GET, POST, PUT, DELETE | Collection | Company Milestones |
| 8️⃣ | `company-story` | ✅ Working | GET, PUT | Singleton | Company Story |
| 9️⃣ | `team-members` | ✅ Working | GET, POST, PUT, DELETE | Collection | Team Members |
| 🔟 | `departments` | ✅ Working | GET, POST, PUT, DELETE | Collection | Departments |
| 1️⃣1️⃣ | `faqs` | ✅ Working | GET, POST, PUT, DELETE | Collection | FAQs |
| 1️⃣2️⃣ | `certifications` | ✅ Working | GET, POST, PUT, DELETE | Collection | Certifications |

**✅ Working: 12/12 APIs (100%)**

---

## ✅ **Working Admin APIs (البيانات الحقيقية)**

### **1️⃣ Company Info Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/company-info` - عرض البيانات
- `PUT /api/v1/admin/company-info` - تحديث البيانات

#### **GET Response (الحقيقية):**
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

#### **PUT Request Example:**
```json
{
  "company_name_ar": "بي إس تولز المحدثة",
  "company_name_en": "BS Tools Updated",
  "company_description_ar": "وصف الشركة المحدث بالعربية",
  "company_description_en": "Updated company description in English",
  "mission_ar": "الرسالة المحدثة بالعربية",
  "mission_en": "Updated mission in English",
  "vision_ar": "الرؤية المحدثة بالعربية",
  "vision_en": "Updated vision in English",
  "logo_text": "BS",
  "founded_year": "2009",
  "employees_count": "200+"
}
```

---

### **2️⃣ Company Stats Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/company-stats` - عرض الإحصائيات
- `PUT /api/v1/admin/company-stats` - تحديث الإحصائيات

#### **GET Response (الحقيقية):**
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

#### **PUT Request Example:**
```json
{
  "years_experience": "16+",
  "total_customers": "60K+",
  "completed_projects": "1200+",
  "support_availability": "24/7"
}
```

---

### **3️⃣ Contact Info Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/contact-info` - عرض معلومات الاتصال
- `PUT /api/v1/admin/contact-info` - تحديث معلومات الاتصال

#### **GET Response (الحقيقية):**
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

#### **PUT Request Example:**
```json
{
  "main_phone": "+20 123 456 7890",
  "secondary_phone": "+20 987 654 3210",
  "toll_free": "+20 800 123 456",
  "main_email": "info@bstools.com",
  "sales_email": "sales@bstools.com",
  "support_email": "support@bstools.com",
  "whatsapp": "+20 100 000 0001",
  "address_street_ar": "شارع التحرير الجديد، المعادي",
  "address_street_en": "New Tahrir Street, Maadi",
  "address_district_ar": "المعادي",
  "address_district_en": "Maadi",
  "address_city_ar": "القاهرة",
  "address_city_en": "Cairo",
  "address_country_ar": "مصر",
  "address_country_en": "Egypt",
  "working_hours_weekdays_ar": "الأحد - الخميس: 9:00 ص - 7:00 م",
  "working_hours_weekdays_en": "Sunday - Thursday: 9:00 AM - 7:00 PM",
  "working_hours_friday_ar": "الجمعة: مغلق",
  "working_hours_friday_en": "Friday: Closed",
  "working_hours_saturday_ar": "السبت: 9:00 ص - 3:00 م",
  "working_hours_saturday_en": "Saturday: 9:00 AM - 3:00 PM",
  "emergency_phone_label_ar": "الطوارئ",
  "emergency_phone_label_en": "Emergency",
  "toll_free_label_ar": "الخط المجاني",
  "toll_free_label_en": "Toll Free"
}
```

---

### **4️⃣ Social Links Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/social-links` - عرض الروابط
- `POST /api/v1/admin/social-links` - إضافة رابط جديد
- `GET /api/v1/admin/social-links/{id}` - عرض رابط محدد
- `PUT /api/v1/admin/social-links/{id}` - تحديث رابط
- `DELETE /api/v1/admin/social-links/{id}` - حذف رابط
- `PUT /api/v1/admin/social-links/order` - تحديث ترتيب الروابط

#### **GET Response:**
```json
{
  "data": [
    {
      "id": 1,
      "platform": "facebook",
      "url": "https://facebook.com/bstools",
      "icon": "fab fa-facebook",
      "color": "#1877F2",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-19 10:30:00",
      "updated_at": "2025-09-19 10:30:00"
    }
  ],
  "meta": {
    "total": 5,
    "active_count": 5
  }
}
```

#### **POST Request Example:**
```json
{
  "platform": "instagram",
  "url": "https://instagram.com/bstools",
  "icon": "fab fa-instagram",
  "color": "#E4405F",
  "order": 2,
  "is_active": true
}
```

---

### **5️⃣ Page Content Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/page-content` - عرض محتوى الصفحات
- `PUT /api/v1/admin/page-content` - تحديث محتوى الصفحات

#### **GET Response (الحقيقية):**
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
    },
    "created_at": "2025-09-16 16:49:55",
    "updated_at": "2025-09-17 08:56:47"
  }
}
```

---

### **6️⃣ Company Story Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/company-story` - عرض قصة الشركة
- `PUT /api/v1/admin/company-story` - تحديث قصة الشركة

#### **GET Response (الحقيقية):**
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

---

### **7️⃣ Company Values Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/company-values` - عرض قيم الشركة
- `POST /api/v1/admin/company-values` - إضافة قيمة جديدة
- `GET /api/v1/admin/company-values/{id}` - عرض قيمة محددة
- `PUT /api/v1/admin/company-values/{id}` - تحديث قيمة
- `DELETE /api/v1/admin/company-values/{id}` - حذف قيمة

#### **GET Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title_ar": "الجودة",
      "title_en": "Quality",
      "description_ar": "نضمن أعلى معايير الجودة في جميع منتجاتنا",
      "description_en": "We guarantee the highest quality standards in all our products",
      "icon": "fas fa-award",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-19 10:30:00",
      "updated_at": "2025-09-19 10:30:00"
    }
  ],
  "meta": {
    "total": 4,
    "active_count": 4
  }
}
```

#### **POST Request Example:**
```json
{
  "title_ar": "الابتكار",
  "title_en": "Innovation",
  "description_ar": "نسعى للابتكار المستمر في حلولنا",
  "description_en": "We strive for continuous innovation in our solutions",
  "icon": "fas fa-lightbulb",
  "order": 2,
  "is_active": true
}
```

---

### **8️⃣ Company Milestones Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/company-milestones` - عرض معالم الشركة
- `POST /api/v1/admin/company-milestones` - إضافة معلم جديد
- `GET /api/v1/admin/company-milestones/{id}` - عرض معلم محدد
- `PUT /api/v1/admin/company-milestones/{id}` - تحديث معلم
- `DELETE /api/v1/admin/company-milestones/{id}` - حذف معلم

#### **GET Response:**
```json
{
  "data": [
    {
      "id": 1,
      "year": "2009",
      "title_ar": "تأسيس الشركة",
      "title_en": "Company Establishment",
      "description_ar": "بداية رحلتنا في مجال أدوات ومواد البناء",
      "description_en": "The beginning of our journey in construction tools and materials",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-19 10:30:00",
      "updated_at": "2025-09-19 10:30:00"
    }
  ],
  "meta": {
    "total": 5,
    "active_count": 5
  }
}
```

#### **POST Request Example:**
```json
{
  "year": "2015",
  "title_ar": "التوسع الإقليمي",
  "title_en": "Regional Expansion",
  "description_ar": "افتتاح فروع جديدة في المنطقة",
  "description_en": "Opening new branches in the region",
  "order": 2,
  "is_active": true
}
```

---

### **9️⃣ Team Members Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/team-members` - عرض أعضاء الفريق
- `POST /api/v1/admin/team-members` - إضافة عضو جديد
- `GET /api/v1/admin/team-members/{id}` - عرض عضو محدد
- `PUT /api/v1/admin/team-members/{id}` - تحديث عضو
- `DELETE /api/v1/admin/team-members/{id}` - حذف عضو

#### **GET Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name_ar": "أحمد محمد",
      "name_en": "Ahmed Mohamed",
      "role_ar": "مدير المبيعات",
      "role_en": "Sales Manager",
      "experience_ar": "خبرة 10 سنوات في مجال المبيعات",
      "experience_en": "10 years experience in sales",
      "image": "/storage/team/ahmed.jpg",
      "email": "ahmed@bstools.com",
      "phone": "+20 123 456 789",
      "linkedin": "https://linkedin.com/in/ahmed",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-19 10:30:00",
      "updated_at": "2025-09-19 10:30:00"
    }
  ],
  "meta": {
    "total": 8,
    "active_count": 8
  }
}
```

#### **POST Request Example:**
```json
{
  "name_ar": "فاطمة علي",
  "name_en": "Fatma Ali",
  "role_ar": "مديرة التسويق",
  "role_en": "Marketing Manager",
  "experience_ar": "خبرة 8 سنوات في التسويق الرقمي",
  "experience_en": "8 years experience in digital marketing",
  "email": "fatma@bstools.com",
  "phone": "+20 987 654 321",
  "order": 2,
  "is_active": true
}
```

---

### **🔟 Departments Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/departments` - عرض الأقسام
- `POST /api/v1/admin/departments` - إضافة قسم جديد
- `GET /api/v1/admin/departments/{id}` - عرض قسم محدد
- `PUT /api/v1/admin/departments/{id}` - تحديث قسم
- `DELETE /api/v1/admin/departments/{id}` - حذف قسم
- `PUT /api/v1/admin/departments/order` - تحديث ترتيب الأقسام

#### **GET Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name_ar": "قسم المبيعات",
      "name_en": "Sales Department",
      "description_ar": "مسؤول عن جميع عمليات البيع والتسويق",
      "description_en": "Responsible for all sales and marketing operations",
      "icon": "fas fa-chart-line",
      "color": "#3B82F6",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-19 10:30:00",
      "updated_at": "2025-09-19 10:30:00"
    }
  ],
  "meta": {
    "total": 6,
    "active_count": 6
  }
}
```

#### **POST Request Example:**
```json
{
  "name_ar": "قسم خدمة العملاء",
  "name_en": "Customer Service Department",
  "description_ar": "يقدم الدعم والمساعدة للعملاء",
  "description_en": "Provides support and assistance to customers",
  "icon": "fas fa-headset",
  "color": "#10B981",
  "order": 2,
  "is_active": true
}
```

---

### **1️⃣1️⃣ FAQs Admin API**

#### **Endpoints:**
- `GET /api/v1/admin/faqs` - عرض الأسئلة الشائعة
- `POST /api/v1/admin/faqs` - إضافة سؤال جديد
- `GET /api/v1/admin/faqs/{id}` - عرض سؤال محدد
- `PUT /api/v1/admin/faqs/{id}` - تحديث سؤال
- `DELETE /api/v1/admin/faqs/{id}` - حذف سؤال

#### **GET Response:**
```json
{
  "data": [
    {
      "id": 1,
      "question_ar": "ما هي طرق الدفع المتاحة؟",
      "question_en": "What payment methods are available?",
      "answer_ar": "نقبل جميع طرق الدفع: نقداً، تحويل بنكي، بطاقات ائتمان",
      "answer_en": "We accept all payment methods: cash, bank transfer, credit cards",
      "category": "payment",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-19 10:30:00",
      "updated_at": "2025-09-19 10:30:00"
    }
  ],
  "meta": {
    "total": 15,
    "active_count": 15,
    "categories": ["payment", "shipping", "products", "support"]
  }
}
```

#### **POST Request Example:**
```json
{
  "question_ar": "ما هي أوقات التسليم؟",
  "question_en": "What are the delivery times?",
  "answer_ar": "التسليم خلال 2-5 أيام عمل داخل القاهرة",
  "answer_en": "Delivery within 2-5 business days in Cairo",
  "category": "shipping",
  "order": 2,
  "is_active": true
}
```

---

### **1️⃣2️⃣ Certifications Admin API** ✅ **محدث بالكامل**

#### **Endpoints:**
- `GET /api/v1/admin/certifications` - عرض الشهادات
- `POST /api/v1/admin/certifications` - إضافة شهادة جديدة (مع رفع الصور)
- `GET /api/v1/admin/certifications/{id}` - عرض شهادة محددة
- `PUT /api/v1/admin/certifications/{id}` - تحديث شهادة (مع رفع الصور)
- `DELETE /api/v1/admin/certifications/{id}` - حذف شهادة (مع حذف الصورة)

#### **GET Response (محدث):**
```json
{
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
    }
  ],
  "meta": {
    "total": 3,
    "active_count": 3
  }
}
```

#### **POST Request Example (محدث):**
```json
{
  "name_ar": "شهادة السلامة المهنية",
  "name_en": "Occupational Safety Certificate",
  "description_ar": "شهادة معتمدة للسلامة المهنية",
  "description_en": "Certified occupational safety certificate",
  "issuer_ar": "وزارة القوى العاملة",
  "issuer_en": "Ministry of Manpower",
  "issue_date": "2022-03-20",
  "expiry_date": "2025-03-20",
  "image": "ملف الصورة (multipart/form-data)",
  "order": 2,
  "is_active": true
}
```

#### **🎯 الميزات الجديدة المضافة:**
- ✅ **معالجة رفع الصور:** دعم كامل لرفع صور الشهادات
- ✅ **حقول الجهة المصدرة:** `issuer_ar` و `issuer_en`
- ✅ **تواريخ الإصدار والانتهاء:** `issue_date` و `expiry_date`
- ✅ **التحقق المتقدم:** validation للتواريخ والصور
- ✅ **إدارة الصور:** حذف تلقائي للصور القديمة عند التحديث/الحذف
- ✅ **بيانات تجريبية:** 3 شهادات مُدرجة بالفعل في قاعدة البيانات

#### **📋 Validation Rules:**
```php
// POST/PUT Request Validation
'name_ar' => 'required|string|max:255',
'name_en' => 'required|string|max:255',
'description_ar' => 'nullable|string',
'description_en' => 'nullable|string',
'issuer_ar' => 'required|string|max:255',
'issuer_en' => 'required|string|max:255',
'issue_date' => 'required|date',
'expiry_date' => 'nullable|date|after:issue_date',
'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
'order' => 'nullable|integer|min:0',
'is_active' => 'nullable|boolean'
```

#### **📁 مجلد حفظ الصور:**
- **المسار:** `/storage/certifications/`
- **الأنواع المدعومة:** jpeg, png, jpg, gif
- **الحد الأقصى:** 2MB

---

## 💻 **JavaScript Usage Examples (للـ Working APIs)**

### **🔐 Headers Required:**
```javascript
const headers = {
  'Authorization': 'Bearer YOUR_ADMIN_TOKEN',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
```

### **📋 Singleton APIs (Company Info, Stats, Contact, Page Content, Story):**

```javascript
// Get singleton data
const getSingletonData = async (token, endpoint) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/admin/${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Update singleton data
const updateSingletonData = async (token, endpoint, updateData) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/admin/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Examples
await getSingletonData(token, 'company-info');
await updateSingletonData(token, 'company-stats', { years_experience: "16+" });
```

### **🏢 Contact Info Specific Example (Multilingual):**

```javascript
// Update contact info with multilingual data
const updateContactInfo = async (token, contactData) => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/admin/contact-info', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        main_phone: "+20 123 456 7890",
        secondary_phone: "+20 987 654 3210",
        toll_free: "+20 800 123 456",
        main_email: "info@bstools.com",
        sales_email: "sales@bstools.com",
        support_email: "support@bstools.com",
        whatsapp: "+20 100 000 0001",
        // Multilingual Address
        address_street_ar: "شارع التحرير الجديد، المعادي",
        address_street_en: "New Tahrir Street, Maadi",
        address_district_ar: "المعادي",
        address_district_en: "Maadi",
        address_city_ar: "القاهرة",
        address_city_en: "Cairo",
        address_country_ar: "مصر",
        address_country_en: "Egypt",
        // Multilingual Working Hours
        working_hours_weekdays_ar: "الأحد - الخميس: 9:00 ص - 7:00 م",
        working_hours_weekdays_en: "Sunday - Thursday: 9:00 AM - 7:00 PM",
        working_hours_friday_ar: "الجمعة: مغلق",
        working_hours_friday_en: "Friday: Closed",
        working_hours_saturday_ar: "السبت: 9:00 ص - 3:00 م",
        working_hours_saturday_en: "Saturday: 9:00 AM - 3:00 PM",
        // Multilingual Labels
        emergency_phone_label_ar: "الطوارئ",
        emergency_phone_label_en: "Emergency",
        toll_free_label_ar: "الخط المجاني",
        toll_free_label_en: "Toll Free"
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### **📂 Collection APIs (Social Links, Values, Milestones, Team, etc.):**

```javascript
// Get collection data
const getCollectionData = async (token, endpoint) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/admin/${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Create new item
const createCollectionItem = async (token, endpoint, itemData) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/admin/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(itemData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Update item
const updateCollectionItem = async (token, endpoint, itemId, updateData) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/admin/${endpoint}/${itemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Delete item
const deleteCollectionItem = async (token, endpoint, itemId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/admin/${endpoint}/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Examples
await getCollectionData(token, 'social-links');
await createCollectionItem(token, 'company-values', { title_ar: "الجودة", title_en: "Quality" });
await updateCollectionItem(token, 'team-members', 1, { name_ar: "أحمد محمد المحدث" });
await deleteCollectionItem(token, 'departments', 5);
```

### **🔄 Order Management (Social Links, Departments):**

```javascript
// Update items order
const updateItemsOrder = async (token, endpoint, orderData) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/admin/${endpoint}/order`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example
await updateItemsOrder(token, 'social-links', {
  items: [
    { id: 1, order: 1 },
    { id: 2, order: 2 },
    { id: 3, order: 3 }
  ]
});
```

### **🏆 Certifications API with Image Upload:**

```javascript
// Create certification with image
const createCertificationWithImage = async (token, certificationData, imageFile) => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name_ar', certificationData.name_ar);
    formData.append('name_en', certificationData.name_en);
    formData.append('description_ar', certificationData.description_ar || '');
    formData.append('description_en', certificationData.description_en || '');
    formData.append('issuer_ar', certificationData.issuer_ar);
    formData.append('issuer_en', certificationData.issuer_en);
    formData.append('issue_date', certificationData.issue_date);
    formData.append('expiry_date', certificationData.expiry_date || '');
    formData.append('order', certificationData.order || 1);
    formData.append('is_active', certificationData.is_active !== undefined ? certificationData.is_active : true);
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch('http://localhost:8000/api/v1/admin/certifications', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
        // Note: Don't set Content-Type for FormData, browser will set it automatically
      },
      body: formData
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Update certification with image
const updateCertificationWithImage = async (token, certificationId, certificationData, imageFile) => {
  try {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name_ar', certificationData.name_ar);
    formData.append('name_en', certificationData.name_en);
    formData.append('description_ar', certificationData.description_ar || '');
    formData.append('description_en', certificationData.description_en || '');
    formData.append('issuer_ar', certificationData.issuer_ar);
    formData.append('issuer_en', certificationData.issuer_en);
    formData.append('issue_date', certificationData.issue_date);
    formData.append('expiry_date', certificationData.expiry_date || '');
    formData.append('order', certificationData.order || 1);
    formData.append('is_active', certificationData.is_active !== undefined ? certificationData.is_active : true);
    
    // Add _method for Laravel to handle PUT request with FormData
    formData.append('_method', 'PUT');
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`http://localhost:8000/api/v1/admin/certifications/${certificationId}`, {
      method: 'POST', // Use POST with _method=PUT for file uploads
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: formData
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Example usage
const imageFile = document.getElementById('certification-image').files[0];
await createCertificationWithImage(token, {
  name_ar: "شهادة الأيزو 9001",
  name_en: "ISO 9001 Certificate",
  description_ar: "شهادة إدارة الجودة الدولية",
  description_en: "International Quality Management Certificate",
  issuer_ar: "منظمة المعايير الدولية",
  issuer_en: "International Standards Organization",
  issue_date: "2020-01-15",
  expiry_date: "2023-01-15",
  order: 1,
  is_active: true
}, imageFile);
```

---

## 📊 **Summary**

### **✅ Working Admin APIs (12):**
1. **Company Info** - GET, PUT (Singleton)
2. **Company Stats** - GET, PUT (Singleton)  
3. **Contact Info** - GET, PUT (Singleton)
4. **Social Links** - GET, POST, PUT, DELETE + Order (Collection)
5. **Page Content** - GET, PUT (Singleton)
6. **Company Values** - GET, POST, PUT, DELETE (Collection)
7. **Company Milestones** - GET, POST, PUT, DELETE (Collection)
8. **Company Story** - GET, PUT (Singleton)
9. **Team Members** - GET, POST, PUT, DELETE (Collection)
10. **Departments** - GET, POST, PUT, DELETE + Order (Collection)
11. **FAQs** - GET, POST, PUT, DELETE (Collection)
12. **Certifications** - GET, POST, PUT, DELETE (Collection)

### **📈 Current Status:**
- **Working:** 12/12 APIs (100%)
- **System Status:** All Dynamic Content Admin APIs are operational

### **🎯 Features:**
- ✅ **Multilingual Support** (Arabic/English)
- ✅ **CRUD Operations** for Collections
- ✅ **Singleton Management** for Company Data
- ✅ **Order Management** for Social Links & Departments
- ✅ **Advanced Image Upload** Support (Team Members, Certifications)
- ✅ **File Management** (Auto-delete old images on update/delete)
- ✅ **Category Filtering** (FAQs)
- ✅ **Date Validation** (Issue/Expiry dates for Certifications)
- ✅ **Active/Inactive Status** Management
- ✅ **Proper JSON Responses** for Admin Panel Integration
- ✅ **FormData Support** for File Uploads with Form Fields

---

## 🔧 **Admin Token Generation**

```bash
# Create admin user and get token
php artisan tinker
```

```php
$admin = App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@bstools.com', 
    'password' => bcrypt('admin123')
]);

$admin->assignRole('admin');
$token = $admin->createToken('admin-panel')->plainTextToken;
echo "Admin Token: " . $token;
```

---

**🎉 جميع الـ 12 Admin APIs جاهزة للاستخدام في لوحة التحكم!** 