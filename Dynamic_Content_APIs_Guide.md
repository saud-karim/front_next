# 🏢 Dynamic Content Management APIs - دليل كامل

## 🎯 **Overview (نظرة عامة)**

تم تطوير **12 API** كاملة لإدارة جميع محتويات الموقع الديناميكية بشكل شامل ومرن.

---

## 🔐 **Authentication (المصادقة)**

```http
Authorization: Bearer {admin_token}
Content-Type: application/json
Accept: application/json
```

**Middleware Required:** `auth:sanctum` + `role:admin`

---

## 📋 **الـ APIs المتاحة (12 APIs)**

---

## 1. 🏢 **Company Information API**

### **GET** `/api/v1/admin/company-info`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "شركة البناء المتطورة",
    "company_description": "نحن شركة رائدة في مجال أدوات ومواد البناء",
    "mission_ar": "توفير أفضل أدوات البناء بأعلى جودة",
    "mission_en": "Providing the best construction tools with highest quality",
    "vision_ar": "أن نكون الشركة الأولى في المنطقة",
    "vision_en": "To be the leading company in the region",
    "founded_year": "2009",
    "employees_count": 150,
    "created_at": "2025-09-16 10:00:00",
    "updated_at": "2025-09-16 16:30:00"
  }
}
```

### **PUT** `/api/v1/admin/company-info`
```json
{
  "company_name": "اسم الشركة الجديد",
  "company_description": "وصف الشركة المحدث",
  "mission_ar": "رسالة الشركة بالعربية",
  "mission_en": "Company mission in English",
  "vision_ar": "رؤية الشركة بالعربية", 
  "vision_en": "Company vision in English",
  "founded_year": "2009",
  "employees_count": 200
}
```

---

## 2. 📊 **Company Statistics API**

### **GET** `/api/v1/admin/company-stats`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "years_experience": 15,
    "happy_customers": 5000,
    "completed_projects": 1200,
    "support_available": true,
    "created_at": "2025-09-16 10:00:00",
    "updated_at": "2025-09-16 16:30:00"
  }
}
```

### **PUT** `/api/v1/admin/company-stats`
```json
{
  "years_experience": 16,
  "happy_customers": 6000,
  "completed_projects": 1500,
  "support_available": true
}
```

---

## 3. 📞 **Contact Information API**

### **GET** `/api/v1/admin/contact-info`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "main_phone": "+20123456789",
    "secondary_phone": "+20987654321",
    "whatsapp": "+20123456789",
    "main_email": "info@company.com",
    "support_email": "support@company.com",
    "address_ar": "123 شارع الأهرام، الجيزة، مصر",
    "address_en": "123 Pyramids Street, Giza, Egypt",
    "working_hours_ar": "السبت - الخميس: 9:00 ص - 6:00 م",
    "working_hours_en": "Saturday - Thursday: 9:00 AM - 6:00 PM",
    "created_at": "2025-09-16 10:00:00",
    "updated_at": "2025-09-16 16:30:00"
  }
}
```

### **PUT** `/api/v1/admin/contact-info`
```json
{
  "main_phone": "+20111222333",
  "secondary_phone": "+20444555666",
  "whatsapp": "+20111222333",
  "main_email": "info@newcompany.com",
  "support_email": "support@newcompany.com",
  "address_ar": "العنوان الجديد بالعربية",
  "address_en": "New address in English",
  "working_hours_ar": "الأحد - الخميس: 8:00 ص - 5:00 م",
  "working_hours_en": "Sunday - Thursday: 8:00 AM - 5:00 PM"
}
```

---

## 4. 🏢 **Departments API**

### **GET** `/api/v1/admin/departments`
```json
{
  "data": [
    {
      "id": 1,
      "name_ar": "قسم المبيعات",
      "name_en": "Sales Department", 
      "description_ar": "قسم مختص بالمبيعات والاستفسارات",
      "description_en": "Department specialized in sales and inquiries",
      "phone": "+20123456789",
      "email": "sales@company.com",
      "icon": "💼",
      "color": "bg-blue-500",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-16 16:30:00",
      "updated_at": "2025-09-16 16:30:00"
    }
  ],
  "meta": {
    "total": 5,
    "active_count": 4
  }
}
```

### **POST** `/api/v1/admin/departments`
```json
{
  "name_ar": "قسم جديد",
  "name_en": "New Department",
  "description_ar": "وصف القسم الجديد",
  "description_en": "New department description",
  "phone": "+20123456789",
  "email": "dept@company.com",
  "icon": "🏢",
  "color": "bg-green-500",
  "order": 2,
  "is_active": true
}
```

### **GET** `/api/v1/admin/departments/{id}`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name_ar": "قسم المبيعات",
    "name_en": "Sales Department",
    "description_ar": "قسم مختص بالمبيعات والاستفسارات",
    "description_en": "Department specialized in sales and inquiries",
    "phone": "+20123456789",
    "email": "sales@company.com",
    "icon": "💼",
    "color": "bg-blue-500",
    "order": 1,
    "is_active": true
  }
}
```

### **PUT** `/api/v1/admin/departments/{id}`
```json
{
  "name_ar": "قسم محدث",
  "name_en": "Updated Department",
  "phone": "+20111222333",
  "is_active": false
}
```

### **DELETE** `/api/v1/admin/departments/{id}`
```json
{
  "success": true,
  "message": "تم حذف القسم بنجاح"
}
```

### **PUT** `/api/v1/admin/departments/order` (ترتيب الأقسام)
```json
{
  "departments": [
    { "id": 1, "order": 1 },
    { "id": 2, "order": 2 },
    { "id": 3, "order": 3 }
  ]
}
```

---

## 5. 📱 **Social Links API**

### **GET** `/api/v1/admin/social-links`
```json
{
  "data": [
    {
      "id": 1,
      "platform": "Facebook",
      "url": "https://facebook.com/company",
      "icon": "📘",
      "color": "bg-blue-600",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-16 16:30:00",
      "updated_at": "2025-09-16 16:30:00"
    },
    {
      "id": 2,
      "platform": "Instagram", 
      "url": "https://instagram.com/company",
      "icon": "📷",
      "color": "bg-pink-500",
      "order": 2,
      "is_active": true
    }
  ],
  "meta": {
    "total": 4,
    "active_count": 3
  }
}
```

### **POST** `/api/v1/admin/social-links`
```json
{
  "platform": "Twitter",
  "url": "https://twitter.com/company",
  "icon": "🐦",
  "color": "bg-sky-500",
  "order": 3,
  "is_active": true
}
```

### **GET** `/api/v1/admin/social-links/{id}`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "platform": "Facebook",
    "url": "https://facebook.com/company",
    "icon": "📘",
    "color": "bg-blue-600",
    "order": 1,
    "is_active": true
  }
}
```

### **PUT** `/api/v1/admin/social-links/{id}`
```json
{
  "platform": "Facebook Updated",
  "url": "https://facebook.com/newcompany",
  "icon": "📘",
  "color": "bg-blue-700",
  "is_active": false
}
```

### **DELETE** `/api/v1/admin/social-links/{id}`
```json
{
  "success": true,
  "message": "تم حذف رابط التواصل بنجاح"
}
```

### **PUT** `/api/v1/admin/social-links/order` (ترتيب الروابط)
```json
{
  "social_links": [
    { "id": 1, "order": 1 },
    { "id": 2, "order": 2 },
    { "id": 3, "order": 3 }
  ]
}
```

---

## 6. 👥 **Team Members API**

### **GET** `/api/v1/admin/team-members`
```json
{
  "data": [
    {
      "id": 1,
      "name_ar": "أحمد محمد",
      "name_en": "Ahmed Mohammed",
      "role_ar": "مدير المبيعات",
      "role_en": "Sales Manager",
      "experience_ar": "10 سنوات خبرة في مجال المبيعات",
      "experience_en": "10 years experience in sales field",
      "specialty_ar": "إدارة العملاء والمبيعات",
      "specialty_en": "Customer and sales management",
      "image": "👨‍💼",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-16 16:30:00",
      "updated_at": "2025-09-16 16:30:00"
    }
  ],
  "meta": {
    "total": 8,
    "active_count": 6
  }
}
```

### **POST** `/api/v1/admin/team-members`
```json
{
  "name_ar": "سارة علي",
  "name_en": "Sara Ali",
  "role_ar": "مديرة التسويق",
  "role_en": "Marketing Manager",
  "experience_ar": "8 سنوات خبرة في التسويق الرقمي",
  "experience_en": "8 years experience in digital marketing",
  "specialty_ar": "التسويق الإلكتروني ووسائل التواصل",
  "specialty_en": "Digital marketing and social media",
  "image": "👩‍💼",
  "order": 2,
  "is_active": true
}
```

### **GET** `/api/v1/admin/team-members/{id}`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name_ar": "أحمد محمد",
    "name_en": "Ahmed Mohammed",
    "role_ar": "مدير المبيعات",
    "role_en": "Sales Manager",
    "experience_ar": "10 سنوات خبرة في مجال المبيعات",
    "experience_en": "10 years experience in sales field",
    "specialty_ar": "إدارة العملاء والمبيعات",
    "specialty_en": "Customer and sales management",
    "image": "👨‍💼",
    "order": 1,
    "is_active": true
  }
}
```

### **PUT** `/api/v1/admin/team-members/{id}`
```json
{
  "name_ar": "أحمد محمد المحدث",
  "name_en": "Ahmed Mohammed Updated",
  "role_ar": "المدير التنفيذي",
  "role_en": "Executive Manager",
  "is_active": false
}
```

### **DELETE** `/api/v1/admin/team-members/{id}`
```json
{
  "success": true,
  "message": "تم حذف عضو الفريق بنجاح"
}
```

---

## 7. ⭐ **Company Values API**

### **GET** `/api/v1/admin/company-values`
```json
{
  "data": [
    {
      "id": 1,
      "title_ar": "الجودة العالية",
      "title_en": "High Quality",
      "description_ar": "نلتزم بتقديم أعلى معايير الجودة في جميع منتجاتنا",
      "description_en": "We commit to providing highest quality standards in all our products",
      "icon": "⭐",
      "color": "from-yellow-500 to-orange-500",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-16 16:30:00",
      "updated_at": "2025-09-16 16:30:00"
    },
    {
      "id": 2,
      "title_ar": "خدمة العملاء المتميزة",
      "title_en": "Excellent Customer Service",
      "description_ar": "نضع رضا العملاء في المقدمة",
      "description_en": "We put customer satisfaction first",
      "icon": "🤝",
      "color": "from-blue-500 to-cyan-500",
      "order": 2,
      "is_active": true
    }
  ],
  "meta": {
    "total": 6,
    "active_count": 5
  }
}
```

### **POST** `/api/v1/admin/company-values`
```json
{
  "title_ar": "الابتكار والتطوير",
  "title_en": "Innovation & Development", 
  "description_ar": "نستثمر في التكنولوجيا والابتكار المستمر",
  "description_en": "We invest in technology and continuous innovation",
  "icon": "🚀",
  "color": "from-purple-500 to-pink-500",
  "order": 3,
  "is_active": true
}
```

### **GET** `/api/v1/admin/company-values/{id}`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title_ar": "الجودة العالية",
    "title_en": "High Quality",
    "description_ar": "نلتزم بتقديم أعلى معايير الجودة في جميع منتجاتنا",
    "description_en": "We commit to providing highest quality standards in all our products",
    "icon": "⭐",
    "color": "from-yellow-500 to-orange-500",
    "order": 1,
    "is_active": true
  }
}
```

### **PUT** `/api/v1/admin/company-values/{id}`
```json
{
  "title_ar": "الجودة الفائقة",
  "title_en": "Superior Quality",
  "description_ar": "وصف محدث للجودة",
  "description_en": "Updated quality description",
  "is_active": false
}
```

### **DELETE** `/api/v1/admin/company-values/{id}`
```json
{
  "success": true,
  "message": "تم حذف قيمة الشركة بنجاح"
}
```

---

## 8. 📅 **Company Milestones API**

### **GET** `/api/v1/admin/company-milestones`
```json
{
  "data": [
    {
      "id": 1,
      "year": "2009",
      "event_ar": "تأسيس الشركة",
      "event_en": "Company Foundation",
      "description_ar": "بداية رحلتنا في عالم البناء والتطوير",
      "description_en": "The beginning of our journey in construction and development",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-16 16:30:00",
      "updated_at": "2025-09-16 16:30:00"
    },
    {
      "id": 2,
      "year": "2015",
      "event_ar": "افتتاح أول فرع",
      "event_en": "First Branch Opening",
      "description_ar": "توسعنا لخدمة المزيد من العملاء",
      "description_en": "We expanded to serve more customers",
      "order": 2,
      "is_active": true
    }
  ],
  "meta": {
    "total": 10,
    "active_count": 8
  }
}
```

### **POST** `/api/v1/admin/company-milestones`
```json
{
  "year": "2020",
  "event_ar": "إطلاق المتجر الإلكتروني",
  "event_en": "E-commerce Launch",
  "description_ar": "دخولنا عالم التجارة الإلكترونية",
  "description_en": "Our entry into the e-commerce world",
  "order": 3,
  "is_active": true
}
```

### **GET** `/api/v1/admin/company-milestones/{id}`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "year": "2009",
    "event_ar": "تأسيس الشركة",
    "event_en": "Company Foundation",
    "description_ar": "بداية رحلتنا في عالم البناء والتطوير",
    "description_en": "The beginning of our journey in construction and development",
    "order": 1,
    "is_active": true
  }
}
```

### **PUT** `/api/v1/admin/company-milestones/{id}`
```json
{
  "year": "2009",
  "event_ar": "تأسيس الشركة المحدث",
  "event_en": "Updated Company Foundation",
  "description_ar": "وصف محدث لبداية الرحلة",
  "description_en": "Updated description of the beginning",
  "is_active": false
}
```

### **DELETE** `/api/v1/admin/company-milestones/{id}`
```json
{
  "success": true,
  "message": "تم حذف المعلم التاريخي بنجاح"
}
```

---

## 9. 📖 **Company Story API**

### **GET** `/api/v1/admin/company-story`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "paragraph1_ar": "تأسست شركتنا في عام 2009 بهدف تقديم أفضل أدوات ومواد البناء",
    "paragraph1_en": "Our company was founded in 2009 with the goal of providing the best construction tools and materials",
    "paragraph2_ar": "على مدار السنوات، نمت الشركة وتطورت لتصبح واحدة من الشركات الرائدة",
    "paragraph2_en": "Over the years, the company has grown and evolved to become one of the leading companies",
    "paragraph3_ar": "اليوم، نخدم آلاف العملاء ونفتخر بالثقة التي وضعوها فينا",
    "paragraph3_en": "Today, we serve thousands of customers and take pride in the trust they have placed in us",
    "features": [
      {
        "name_ar": "جودة عالية",
        "name_en": "High Quality"
      },
      {
        "name_ar": "خدمة مميزة",
        "name_en": "Excellent Service"
      }
    ],
    "created_at": "2025-09-16 16:30:00",
    "updated_at": "2025-09-16 16:30:00"
  }
}
```

### **PUT** `/api/v1/admin/company-story`
```json
{
  "paragraph1_ar": "فقرة جديدة تحكي عن بداية الشركة",
  "paragraph1_en": "New paragraph telling about company beginning",
  "paragraph2_ar": "فقرة ثانية عن تطور الشركة",
  "paragraph2_en": "Second paragraph about company development",
  "paragraph3_ar": "فقرة ثالثة عن الإنجازات",
  "paragraph3_en": "Third paragraph about achievements",
  "features": [
    {
      "name_ar": "الابتكار",
      "name_en": "Innovation"
    },
    {
      "name_ar": "الخبرة",
      "name_en": "Experience"
    }
  ]
}
```

---

## 10. 📄 **Page Content API**

### **GET** `/api/v1/admin/page-content`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "about_page": {
      "badge_ar": "من نحن",
      "badge_en": "About Us",
      "title_ar": "نبني المستقبل معاً",
      "title_en": "Building the Future Together",
      "subtitle_ar": "شركة رائدة في مجال أدوات ومواد البناء منذ أكثر من 15 عاماً",
      "subtitle_en": "A leading company in construction tools and materials for over 15 years"
    },
    "contact_page": {
      "badge_ar": "تواصل معنا",
      "badge_en": "Contact Us",
      "title_ar": "اتصل بنا",
      "title_en": "Contact Us", 
      "subtitle_ar": "نحن هنا لمساعدتك. تواصل معنا في أي وقت",
      "subtitle_en": "We're here to help you. Contact us anytime"
    },
    "created_at": "2025-09-16 16:30:00",
    "updated_at": "2025-09-16 16:30:00"
  }
}
```

### **PUT** `/api/v1/admin/page-content`
```json
{
  "about_page": {
    "badge_ar": "عن الشركة",
    "badge_en": "About Company",
    "title_ar": "رواد في عالم البناء",
    "title_en": "Construction Industry Leaders",
    "subtitle_ar": "نحن نقود التطوير في صناعة البناء",
    "subtitle_en": "We lead development in construction industry"
  },
  "contact_page": {
    "badge_ar": "راسلنا",
    "badge_en": "Contact",
    "title_ar": "تحدث معنا",
    "title_en": "Talk to Us",
    "subtitle_ar": "فريقنا جاهز للرد على استفساراتك",
    "subtitle_en": "Our team is ready to answer your inquiries"
  }
}
```

---

## 11. ❓ **FAQs API**

### **GET** `/api/v1/admin/faqs`
```json
{
  "data": [
    {
      "id": 1,
      "question_ar": "ما هي سياسة الإرجاع؟",
      "question_en": "What is the return policy?",
      "answer_ar": "يمكن إرجاع المنتجات خلال 30 يوماً من تاريخ الشراء",
      "answer_en": "Products can be returned within 30 days of purchase date",
      "category": "general",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-16 16:30:00",
      "updated_at": "2025-09-16 16:30:00"
    }
  ],
  "meta": {
    "total": 15,
    "active_count": 12,
    "categories": ["general", "shipping", "payment", "products"]
  }
}
```

### **GET** `/api/v1/admin/faqs?category=shipping`
```json
{
  "data": [
    {
      "id": 2,
      "question_ar": "كم تستغرق عملية الشحن؟",
      "question_en": "How long does shipping take?",
      "answer_ar": "عادة ما تستغرق من 2-5 أيام عمل حسب المنطقة",
      "answer_en": "Usually takes 2-5 business days depending on area",
      "category": "shipping",
      "order": 1,
      "is_active": true
    }
  ]
}
```

### **POST** `/api/v1/admin/faqs`
```json
{
  "question_ar": "هل تقدمون ضمان على المنتجات؟",
  "question_en": "Do you provide warranty on products?",
  "answer_ar": "نعم، نقدم ضمان لمدة عام على جميع المنتجات",
  "answer_en": "Yes, we provide one year warranty on all products",
  "category": "products",
  "order": 2,
  "is_active": true
}
```

### **GET** `/api/v1/admin/faqs/{id}`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "question_ar": "ما هي سياسة الإرجاع؟",
    "question_en": "What is the return policy?",
    "answer_ar": "يمكن إرجاع المنتجات خلال 30 يوماً من تاريخ الشراء",
    "answer_en": "Products can be returned within 30 days of purchase date",
    "category": "general",
    "order": 1,
    "is_active": true
  }
}
```

### **PUT** `/api/v1/admin/faqs/{id}`
```json
{
  "question_ar": "ما هي سياسة الإرجاع المحدثة؟",
  "question_en": "What is the updated return policy?",
  "answer_ar": "يمكن إرجاع المنتجات خلال 45 يوماً",
  "answer_en": "Products can be returned within 45 days",
  "category": "policies",
  "is_active": false
}
```

### **DELETE** `/api/v1/admin/faqs/{id}`
```json
{
  "success": true,
  "message": "تم حذف السؤال بنجاح"
}
```

---

## 12. 🏅 **Certifications API**

### **GET** `/api/v1/admin/certifications`
```json
{
  "data": [
    {
      "id": 1,
      "name_ar": "شهادة الآيزو 9001",
      "name_en": "ISO 9001 Certificate",
      "description_ar": "شهادة الجودة العالمية المعترف بها دولياً",
      "description_en": "Internationally recognized global quality certificate",
      "icon": "🏅",
      "order": 1,
      "is_active": true,
      "created_at": "2025-09-16 16:30:00",
      "updated_at": "2025-09-16 16:30:00"
    },
    {
      "id": 2,
      "name_ar": "شهادة السلامة المهنية",
      "name_en": "Occupational Safety Certificate",
      "description_ar": "شهادة معتمدة للسلامة في بيئة العمل",
      "description_en": "Certified workplace safety certificate",
      "icon": "🛡️",
      "order": 2,
      "is_active": true
    }
  ],
  "meta": {
    "total": 6,
    "active_count": 5
  }
}
```

### **POST** `/api/v1/admin/certifications`
```json
{
  "name_ar": "شهادة البيئة والاستدامة",
  "name_en": "Environmental & Sustainability Certificate",
  "description_ar": "شهادة الالتزام بالمعايير البيئية والاستدامة",
  "description_en": "Certificate of commitment to environmental standards and sustainability",
  "icon": "🌱",
  "order": 3,
  "is_active": true
}
```

### **GET** `/api/v1/admin/certifications/{id}`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name_ar": "شهادة الآيزو 9001",
    "name_en": "ISO 9001 Certificate",
    "description_ar": "شهادة الجودة العالمية المعترف بها دولياً",
    "description_en": "Internationally recognized global quality certificate",
    "icon": "🏅",
    "order": 1,
    "is_active": true
  }
}
```

### **PUT** `/api/v1/admin/certifications/{id}`
```json
{
  "name_ar": "شهادة الآيزو 9001 المحدثة",
  "name_en": "Updated ISO 9001 Certificate",
  "description_ar": "وصف محدث للشهادة",
  "description_en": "Updated certificate description",
  "is_active": false
}
```

### **DELETE** `/api/v1/admin/certifications/{id}`
```json
{
  "success": true,
  "message": "تم حذف الشهادة بنجاح"
}
```

---

## 🔧 **Error Responses (رسائل الأخطاء)**

### **Validation Error (422)**
```json
{
  "success": false,
  "message": "بيانات غير صحيحة",
  "errors": {
    "name_ar": ["حقل الاسم بالعربية مطلوب"],
    "email": ["صيغة الإيميل غير صحيحة"],
    "url": ["الرابط المدخل غير صالح"]
  }
}
```

### **Not Found Error (404)**
```json
{
  "success": false,
  "message": "العنصر المطلوب غير موجود"
}
```

### **Unauthorized Error (401)**
```json
{
  "success": false,
  "message": "غير مصرح لك بالوصول"
}
```

### **Server Error (500)**
```json
{
  "success": false,
  "message": "حدث خطأ في الخادم",
  "error": "Database connection failed"
}
```

---

## 💡 **استخدام JavaScript للاتصال بالـ APIs**

### **Setup Base Configuration:**
```javascript
const API_BASE_URL = '/api/v1/admin';
const token = localStorage.getItem('admin_token');

const apiHeaders = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
  const config = {
    method,
    headers: apiHeaders
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return await response.json();
}
```

### **Example Usage:**
```javascript
// Get company info
const companyInfo = await apiCall('/company-info');

// Update company info  
const updated = await apiCall('/company-info', 'PUT', {
  company_name: 'اسم جديد',
  employees_count: 200
});

// Get all departments
const departments = await apiCall('/departments');

// Create new department
const newDept = await apiCall('/departments', 'POST', {
  name_ar: 'قسم جديد',
  name_en: 'New Department',
  email: 'dept@company.com',
  is_active: true
});

// Get specific department
const dept = await apiCall('/departments/1');

// Update department
const updateDept = await apiCall('/departments/1', 'PUT', {
  name_ar: 'قسم محدث',
  is_active: false
});

// Update department order
const reorder = await apiCall('/departments/order', 'PUT', {
  departments: [
    { id: 1, order: 1 },
    { id: 2, order: 2 }
  ]
});

// Delete department
const deleted = await apiCall('/departments/5', 'DELETE');

// CRUD Operations for Social Links
const socialLinks = await apiCall('/social-links');
const newLink = await apiCall('/social-links', 'POST', {
  platform: 'LinkedIn',
  url: 'https://linkedin.com/company',
  icon: '🔗',
  color: 'bg-blue-700'
});
const updateLink = await apiCall('/social-links/1', 'PUT', {
  platform: 'Facebook Updated'
});
const deleteLink = await apiCall('/social-links/1', 'DELETE');

// CRUD Operations for FAQs
const faqs = await apiCall('/faqs');
const faqsByCategory = await apiCall('/faqs?category=shipping');
const newFaq = await apiCall('/faqs', 'POST', {
  question_ar: 'سؤال جديد؟',
  question_en: 'New question?',
  answer_ar: 'الإجابة',
  answer_en: 'The answer',
  category: 'general'
});
const updateFaq = await apiCall('/faqs/1', 'PUT', {
  question_ar: 'سؤال محدث؟'
});
const deleteFaq = await apiCall('/faqs/1', 'DELETE');
```

---

## 🎯 **Summary (الخلاصة)**

### ✅ **المتاح الآن:**
- **12 APIs كاملة** للـ Content Management
- **CRUD Operations شاملة** (GET, POST, GET/{id}, PUT/{id}, DELETE/{id})
- **Multilingual Support** (عربي/إنجليزي)
- **Data Validation** متقدمة
- **Error Handling** واضح
- **Authentication & Authorization** محمي
- **Ordering System** للترتيب (Departments, Social Links)
- **Status Management** (تفعيل/إلغاء)
- **Category Filtering** (FAQs)

### 🚀 **جاهز للاستخدام:**
جميع الـ APIs مُختبرة وجاهزة للاستخدام في Dashboard الإدارة أو أي Frontend application مع **CRUD operations كاملة**.

### 📋 **الـ APIs التي تدعم CRUD كامل:**
- 🏢 **Departments** (GET, POST, GET/{id}, PUT/{id}, DELETE/{id}, PUT/order)
- 📱 **Social Links** (GET, POST, GET/{id}, PUT/{id}, DELETE/{id}, PUT/order)  
- 👥 **Team Members** (GET, POST, GET/{id}, PUT/{id}, DELETE/{id})
- ⭐ **Company Values** (GET, POST, GET/{id}, PUT/{id}, DELETE/{id})
- 📅 **Company Milestones** (GET, POST, GET/{id}, PUT/{id}, DELETE/{id})
- ❓ **FAQs** (GET, POST, GET/{id}, PUT/{id}, DELETE/{id})
- 🏅 **Certifications** (GET, POST, GET/{id}, PUT/{id}, DELETE/{id})

### 📄 **الـ APIs التي تدعم GET/PUT فقط (Singleton):**
- 🏢 **Company Info** (GET, PUT)
- 📊 **Company Stats** (GET, PUT)
- 📞 **Contact Info** (GET, PUT)
- 📖 **Company Story** (GET, PUT)
- 📄 **Page Content** (GET, PUT)

---

**📞 للاستفسار أو المساعدة في التطبيق، أنا متاح دائماً! 🎉** 