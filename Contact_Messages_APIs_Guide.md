# 📧 Contact Messages APIs - دليل شامل

## 📋 نظرة عامة

تم إنشاء نظام إدارة شامل لرسائل الاتصال يتضمن:
- **APIs للعملاء** لإرسال الرسائل
- **APIs للإدارة** لإدارة ومعالجة الرسائل
- **نظام إحصائيات وتحليلات** متقدم

---

## 🔐 Customer APIs (عامة - بدون تسجيل دخول)

### 1. إرسال رسالة جديدة
```http
POST /api/v1/contact
Content-Type: application/json

{
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+201234567890",
    "company": "شركة البناء المتطور",
    "subject": "استفسار عن أسعار المواد",
    "message": "أود الاستفسار عن أسعار الأسمنت والحديد.",
    "project_type": "residential"
}
```

**المعاملات:**
- `name` (مطلوب): اسم المرسل
- `email` (مطلوب): البريد الإلكتروني
- `phone` (اختياري): رقم الهاتف
- `company` (اختياري): اسم الشركة
- `subject` (مطلوب): موضوع الرسالة
- `message` (مطلوب): نص الرسالة
- `project_type` (اختياري): `residential`, `commercial`, `industrial`, `other`

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم إرسال رسالتك بنجاح، سنتواصل معك قريباً",
    "data": {
        "ticket_id": "TKT-2025-001"
    }
}
```

### 2. جلب أقسام الاتصال
```http
GET /api/v1/contact/departments
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "departments": [
            {
                "id": "sales",
                "name": {
                    "ar": "المبيعات",
                    "en": "Sales"
                },
                "email": "sales@buildtools.com",
                "phone": "+201234567890"
            }
        ]
    }
}
```

### 3. جلب معلومات التواصل
```http
GET /api/v1/contact/info
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "company": {
            "name": {
                "ar": "بيلد تولز",
                "en": "BuildTools"
            }
        },
        "contact": {
            "email": "info@buildtools.com",
            "phone": "+201234567890"
        }
    }
}
```

---

## 👑 Admin APIs (تتطلب تسجيل دخول كإداري)

### 1. إحصائيات الرسائل
```http
GET /api/v1/admin/contact-messages/stats
Authorization: Bearer {token}
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "overview": {
            "total_messages": 25,
            "new_messages": 8,
            "in_progress_messages": 5,
            "resolved_messages": 10,
            "closed_messages": 2,
            "this_month_messages": 15,
            "weekly_growth": 12.5
        },
        "status_breakdown": {
            "new": 8,
            "in_progress": 5,
            "resolved": 10,
            "closed": 2
        },
        "project_types": {
            "residential": 12,
            "commercial": 8,
            "industrial": 3,
            "other": 2
        },
        "recent_messages": [
            {
                "id": "TKT-2025-025",
                "name": "سارة أحمد",
                "email": "sara@example.com",
                "subject": "استفسار عن التوصيل",
                "status": "new",
                "created_at": "2025-01-15 14:30:00",
                "time_ago": "منذ ساعتين"
            }
        ]
    }
}
```

### 2. عرض جميع الرسائل (مع فلترة وبحث)
```http
GET /api/v1/admin/contact-messages?page=1&per_page=20&status=new&search=أحمد
Authorization: Bearer {token}
```

**معاملات الاستعلام:**
- `page`: رقم الصفحة
- `per_page`: عدد الرسائل في الصفحة (1-100)
- `status`: `new`, `in_progress`, `resolved`, `closed`
- `project_type`: `residential`, `commercial`, `industrial`, `other`
- `search`: البحث في الاسم، البريد، الموضوع، الشركة
- `sort_by`: `created_at`, `name`, `email`, `subject`, `status`
- `sort_order`: `asc`, `desc`
- `date_from`: تاريخ البداية (YYYY-MM-DD)
- `date_to`: تاريخ النهاية (YYYY-MM-DD)

**الاستجابة:**
```json
{
    "success": true,
    "data": [
        {
            "id": "TKT-2025-001",
            "name": "أحمد محمد",
            "email": "ahmed@example.com",
            "phone": "+201234567890",
            "company": "شركة البناء",
            "subject": "استفسار عن المنتجات",
            "message": "نص الرسالة مقطوع...",
            "full_message": "النص الكامل للرسالة",
            "project_type": "residential",
            "project_type_name": "سكني",
            "status": "new",
            "status_name": "جديد",
            "admin_notes": null,
            "created_at": "2025-01-15 10:30:00",
            "time_ago": "منذ 4 ساعات"
        }
    ],
    "meta": {
        "current_page": 1,
        "per_page": 20,
        "total": 25,
        "last_page": 2
    }
}
```

### 3. عرض رسالة واحدة بالتفصيل
```http
GET /api/v1/admin/contact-messages/TKT-2025-001
Authorization: Bearer {token}
```

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "id": "TKT-2025-001",
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "phone": "+201234567890",
        "company": "شركة البناء المتطور",
        "subject": "استفسار عن أسعار المواد",
        "message": "النص الكامل للرسالة هنا...",
        "project_type": "residential",
        "project_type_name": "سكني",
        "status": "new",
        "status_name": "جديد",
        "admin_notes": null,
        "created_at": "2025-01-15 10:30:45",
        "updated_at": "2025-01-15 10:30:45",
        "time_ago": "منذ 4 ساعات",
        "formatted_date": "15/01/2025 - 10:30 AM"
    }
}
```

### 4. تحديث حالة الرسالة
```http
PUT /api/v1/admin/contact-messages/TKT-2025-001
Authorization: Bearer {token}
Content-Type: application/json

{
    "status": "in_progress",
    "admin_notes": "تم التواصل مع العميل عبر الهاتف، سيتم إرسال عرض سعر خلال 24 ساعة."
}
```

**المعاملات:**
- `status` (مطلوب): `new`, `in_progress`, `resolved`, `closed`
- `admin_notes` (اختياري): ملاحظات إدارية (حد أقصى 1000 حرف)

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث الرسالة بنجاح",
    "data": {
        "id": "TKT-2025-001",
        "status": "in_progress",
        "status_name": "قيد المعالجة",
        "admin_notes": "تم التواصل مع العميل...",
        "updated_at": "2025-01-15 15:45:30"
    }
}
```

### 5. حذف رسالة
```http
DELETE /api/v1/admin/contact-messages/TKT-2025-001
Authorization: Bearer {token}
```

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم حذف الرسالة بنجاح"
}
```

### 6. معالجة مجمعة للرسائل
```http
POST /api/v1/admin/contact-messages/bulk
Authorization: Bearer {token}
Content-Type: application/json

{
    "action": "update_status",
    "message_ids": ["TKT-2025-001", "TKT-2025-002", "TKT-2025-003"],
    "status": "resolved",
    "admin_notes": "تم حل جميع الاستفسارات"
}
```

**أنواع العمليات:**
- `update_status`: تحديث حالة متعددة
- `delete`: حذف متعدد

**الاستجابة:**
```json
{
    "success": true,
    "message": "تم تحديث حالة الرسائل بنجاح",
    "data": {
        "processed_count": 3,
        "total_requested": 3
    }
}
```

### 7. تحليلات متقدمة
```http
GET /api/v1/admin/contact-messages/analytics?period=month&date_from=2025-01-01&date_to=2025-01-31
Authorization: Bearer {token}
```

**معاملات الاستعلام:**
- `period`: `week`, `month`, `quarter`, `year`
- `date_from`: تاريخ البداية
- `date_to`: تاريخ النهاية

**الاستجابة:**
```json
{
    "success": true,
    "data": {
        "period": "month",
        "date_range": {
            "from": "2025-01-01",
            "to": "2025-01-31"
        },
        "time_stats": {
            "2025-01": {
                "count": 25,
                "new": 8,
                "resolved": 15
            }
        },
        "common_subjects": [
            {
                "subject": "استفسار عن الأسعار",
                "count": 12
            }
        ],
        "peak_hours": {
            "9": {"hour": 9, "count": 5},
            "14": {"hour": 14, "count": 8}
        },
        "average_response_time_hours": 4.2,
        "summary": {
            "total_messages": 25,
            "resolution_rate": 68.0
        }
    }
}
```

---

## 🔧 حالات الرسائل

| الحالة | الوصف | اللون |
|--------|--------|-------|
| `new` | رسالة جديدة لم يتم الرد عليها | أزرق |
| `in_progress` | قيد المعالجة من قبل الفريق | برتقالي |
| `resolved` | تم حل الاستفسار | أخضر |
| `closed` | تم إغلاق الرسالة | رمادي |

## 🏗️ أنواع المشاريع

| النوع | الوصف |
|-------|--------|
| `residential` | مشاريع سكنية |
| `commercial` | مشاريع تجارية |
| `industrial` | مشاريع صناعية |
| `other` | أنواع أخرى |

---

## 🛡️ التحقق من الصلاحيات

جميع Admin APIs تتطلب:
1. **تسجيل دخول صحيح** (`auth:sanctum`)
2. **صلاحية إداري** (`role:admin`)

```http
Authorization: Bearer {your_admin_token}
```

---

## 📊 رموز الاستجابة

| الكود | الوصف |
|-------|--------|
| `200` | نجح الطلب |
| `201` | تم إنشاء المورد بنجاح |
| `422` | بيانات غير صحيحة |
| `401` | غير مصرح بالدخول |
| `403` | ليس لديك صلاحية |
| `404` | المورد غير موجود |
| `500` | خطأ في الخادم |

---

## 🎯 المميزات الرئيسية

### ✅ للعملاء:
- إرسال رسائل بسهولة
- إنشاء ticket ID تلقائي
- دعم أنواع مشاريع متعددة
- معلومات تواصل شاملة

### ✅ للإدارة:
- **إحصائيات شاملة**: عدد الرسائل، معدل النمو، التوزيع
- **فلترة متقدمة**: حسب الحالة، النوع، التاريخ
- **بحث ذكي**: في جميع الحقول
- **إدارة الحالات**: تحديث حالة الرسائل
- **ملاحظات إدارية**: لتتبع المتابعة
- **معالجة مجمعة**: تحديث أو حذف متعدد
- **تحليلات متقدمة**: أوقات الذروة، معدل الاستجابة
- **Soft Delete**: حذف آمن قابل للاسترداد

### ✅ تقنياً:
- **Validation شامل** لجميع المدخلات
- **Error Handling محسن** مع رسائل واضحة
- **Logging** لجميع العمليات المهمة
- **Resource Formatting** لاستجابات منظمة
- **Pagination** للأداء الأمثل
- **Security** مع middleware وصلاحيات

---

## 🚀 جاهز للاستخدام!

جميع الـ APIs تم اختبارها وهي جاهزة للاستخدام الفوري في الإنتاج. 