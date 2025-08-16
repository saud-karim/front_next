# 🚀 دليل APIs الشامل للفرونت إند - BuildTools BS

## 📋 معلومات أساسية

### 🌐 Base URL
```
http://localhost:8000/api/v1
```

### 🔑 Authentication Headers
لجميع الطلبات المحمية:
```javascript
headers: {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}
```

### 🌍 Language Support
أضف معامل `lang` لجميع الطلبات:
- `?lang=ar` للعربية
- `?lang=en` للإنجليزية (افتراضية)

---

## 🔐 Authentication APIs

### 1. تسجيل مستخدم جديد
```javascript
POST /auth/register

// Request Body
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+201234567890", // اختياري
  "company": "شركة البناء المتقدم" // اختياري
}

// Response (Success)
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "user": {
      "id": 1,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+201234567890",
      "company": "شركة البناء المتقدم",
      "role": "customer",
      "created_at": "2024-01-15T10:30:00.000000Z"
    },
    "token": "1|abc123..."
  }
}

// Response (Error)
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

### 2. تسجيل الدخول
```javascript
POST /auth/login

// Request Body
{
  "email": "ahmed@example.com",
  "password": "password123"
}

// Response (Success)
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": { /* نفس بيانات المستخدم */ },
    "token": "2|def456..."
  }
}

// Response (Error)
{
  "message": "These credentials do not match our records.",
  "errors": {
    "email": ["These credentials do not match our records."]
  }
}
```

### 3. تسجيل الخروج
```javascript
POST /auth/logout
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

### 4. معلومات المستخدم الحالي
```javascript
GET /profile
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+201234567890",
      "company": "شركة البناء المتقدم",
      "role": "customer",
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    }
  }
}
```

### 5. تحديث معلومات المستخدم
```javascript
PUT /profile
// Headers: Authorization: Bearer {token}

// Request Body
{
  "name": "أحمد محمد المحدث",
  "phone": "+201234567891",
  "company": "شركة البناء المتطور"
}

// Response
{
  "success": true,
  "message": "تم تحديث المعلومات بنجاح",
  "data": {
    "user": { /* بيانات المستخدم المحدثة */ }
  }
}
```

---

## 🛍️ Products APIs

### 1. قائمة المنتجات (مع فلاتر وبحث)
```javascript
GET /products?lang=ar&page=1&per_page=12&search=مثقاب&category=2&min_price=100&max_price=500&featured=1&sort=price&order=asc

// Query Parameters (جميعها اختيارية):
// - lang: ar|en
// - page: رقم الصفحة (افتراضي: 1)  
// - per_page: عدد العناصر (افتراضي: 15، الحد الأقصى: 50)
// - search: البحث في الاسم والوصف
// - category: ID الفئة
// - min_price: أقل سعر
// - max_price: أعلى سعر
// - featured: 1 للمنتجات المميزة فقط
// - sort: price|name|rating|created_at
// - order: asc|desc

// Response
{
  "data": [
    {
      "id": 8,
      "name": "حديد تسليح ممتاز 10 مم",
      "description": "حديد تسليح عالي الجودة للخرسانة المسلحة...",
      "price": "28.50",
      "original_price": null,
      "rating": "4.8",
      "reviews_count": 247,
      "stock": 2000,
      "status": "active",
      "featured": false,
      "images": ["rebar10mm.jpg"],
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات",
        "description": "الأدوات والمعدات احترافية..."
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة",
        "rating": "4.5"
      },
      "is_in_stock": true,
      "has_low_stock": false
    }
  ],
  "links": {
    "first": "http://localhost:8000/api/v1/products?page=1",
    "last": "http://localhost:8000/api/v1/products?page=4",
    "prev": null,
    "next": "http://localhost:8000/api/v1/products?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 4,
    "per_page": 15,
    "to": 15,
    "total": 55
  }
}
```

### 2. تفاصيل منتج محدد
```javascript
GET /products/{id}?lang=ar

// Response
{
  "product": {
    "id": 8,
    "name": "حديد تسليح ممتاز 10 مم",
    "description": "حديد تسليح عالي الجودة...",
    "price": "28.50",
    "original_price": null,
    "rating": "4.8",
    "reviews_count": 247,
    "stock": 2000,
    "status": "active",
    "featured": false,
    "images": ["rebar10mm.jpg"],
    "category": { /* تفاصيل الفئة */ },
    "supplier": { /* تفاصيل المورد */ },
    "brand": { /* تفاصيل العلامة التجارية */ },
    "features": [
      {
        "id": 1,
        "feature": "جودة عالية وضمان الشركة",
        "sort_order": 1
      }
    ],
    "specifications": [
      {
        "id": 1,
        "spec_key": "warranty",
        "spec_value": "سنتان"
      }
    ],
    "is_in_stock": true,
    "has_low_stock": false
  }
}
```

### 3. المنتجات المميزة
```javascript
GET /products/featured?lang=ar&per_page=10

// Response
{
  "data": [ /* قائمة المنتجات المميزة */ ],
  "meta": { /* معلومات الصفحات */ }
}
```

### 4. البحث في المنتجات
```javascript
GET /search?q=مثقاب&lang=ar&type=products

// Response
{
  "success": true,
  "data": {
    "results": [ /* نتائج البحث */ ],
    "total_results": 15,
    "search_time": "0.05s",
    "suggestions": ["مثقاب كهربائي", "مثقاب يدوي"]
  }
}
```

---

## 📂 Categories APIs

### 1. قائمة الفئات
```javascript
GET /categories?lang=ar

// Response
{
  "data": [
    {
      "id": 2,
      "name": "الأدوات والمعدات",
      "description": "الأدوات والمعدات احترافية...",
      "image": null,
      "status": "active",
      "sort_order": 0,
      "parent_id": null,
      "full_path": "الأدوات والمعدات",
      "products_count": 25, // إذا كان متاح
      "children": [ /* الفئات الفرعية */ ]
    }
  ]
}
```

### 2. منتجات فئة محددة
```javascript
GET /categories/{id}/products?lang=ar&page=1&per_page=12

// Response
{
  "category": { /* تفاصيل الفئة */ },
  "products": {
    "data": [ /* المنتجات */ ],
    "meta": { /* معلومات الصفحات */ }
  }
}
```

---

## 🛒 Cart APIs

### 1. عرض سلة التسوق
```javascript
GET /cart
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "id": 1,
          "product_id": 8,
          "quantity": 2,
          "product": {
            "id": 8,
            "name": "حديد تسليح ممتاز 10 مم",
            "price": "28.50",
            "images": ["rebar10mm.jpg"]
          },
          "subtotal": "57.00"
        }
      ],
      "subtotal": "57.00",
      "tax": "5.70",
      "shipping": "0.00",
      "discount": "0.00",
      "total": "62.70",
      "currency": "EGP",
      "items_count": 1
    }
  }
}
```

### 2. إضافة منتج للسلة
```javascript
POST /cart/add
// Headers: Authorization: Bearer {token}

// Request Body
{
  "product_id": 8,
  "quantity": 2
}

// Response
{
  "success": true,
  "message": "تم إضافة المنتج للسلة بنجاح",
  "data": {
    "cart": { /* بيانات السلة المحدثة */ }
  }
}
```

### 3. تحديث كمية في السلة
```javascript
PUT /cart/update
// Headers: Authorization: Bearer {token}

// Request Body
{
  "cart_item_id": 1,
  "quantity": 3
}

// Response
{
  "success": true,
  "message": "تم تحديث الكمية بنجاح",
  "data": {
    "cart": { /* بيانات السلة المحدثة */ }
  }
}
```

### 4. إزالة منتج من السلة
```javascript
DELETE /cart/remove/{cart_item_id}
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم إزالة المنتج من السلة",
  "data": {
    "cart": { /* بيانات السلة المحدثة */ }
  }
}
```

### 5. تطبيق كوبون خصم
```javascript
POST /cart/apply-coupon
// Headers: Authorization: Bearer {token}

// Request Body
{
  "coupon_code": "SAVE10"
}

// Response
{
  "success": true,
  "message": "تم تطبيق كوبون الخصم بنجاح",
  "data": {
    "cart": { /* بيانات السلة مع الخصم */ },
    "coupon": {
      "code": "SAVE10",
      "type": "percentage",
      "value": "10.00",
      "discount_amount": "5.70"
    }
  }
}
```

### 6. إزالة كوبون الخصم
```javascript
POST /cart/remove-coupon
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم إزالة كوبون الخصم",
  "data": {
    "cart": { /* بيانات السلة بدون خصم */ }
  }
}
```

### 7. إفراغ السلة
```javascript
DELETE /cart/clear
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم إفراغ السلة بنجاح"
}
```

---

## ❤️ Wishlist APIs

### 1. عرض قائمة الأمنيات
```javascript
GET /wishlist
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "wishlist": [
      {
        "id": 1,
        "product_id": 8,
        "product": {
          "id": 8,
          "name": "حديد تسليح ممتاز 10 مم",
          "price": "28.50",
          "images": ["rebar10mm.jpg"],
          "is_in_stock": true
        },
        "created_at": "2024-01-15T10:30:00.000000Z"
      }
    ],
    "total_items": 5
  }
}
```

### 2. إضافة منتج لقائمة الأمنيات
```javascript
POST /wishlist/add
// Headers: Authorization: Bearer {token}

// Request Body
{
  "product_id": 8
}

// Response
{
  "success": true,
  "message": "تم إضافة المنتج لقائمة الأمنيات"
}
```

### 3. إزالة منتج من قائمة الأمنيات
```javascript
DELETE /wishlist/remove/{product_id}
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم إزالة المنتج من قائمة الأمنيات"
}
```

### 4. فحص وجود منتج في قائمة الأمنيات
```javascript
GET /wishlist/check/{product_id}
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "in_wishlist": true
  }
}
```

### 5. تبديل المنتج في قائمة الأمنيات
```javascript
POST /wishlist/toggle
// Headers: Authorization: Bearer {token}

// Request Body
{
  "product_id": 8
}

// Response
{
  "success": true,
  "message": "تم إضافة المنتج لقائمة الأمنيات", // أو "تم إزالة المنتج من قائمة الأمنيات"
  "data": {
    "in_wishlist": true // أو false
  }
}
```

### 6. نقل منتج من قائمة الأمنيات للسلة
```javascript
POST /wishlist/move-to-cart
// Headers: Authorization: Bearer {token}

// Request Body
{
  "product_id": 8,
  "quantity": 1 // اختياري، افتراضي: 1
}

// Response
{
  "success": true,
  "message": "تم نقل المنتج للسلة بنجاح",
  "data": {
    "cart_item": { /* بيانات العنصر في السلة */ }
  }
}
```

---

## 📦 Orders APIs

### 1. إنشاء طلب جديد
```javascript
POST /orders
// Headers: Authorization: Bearer {token}

// Request Body
{
  "address_id": 1, // أو shipping_address كـ object
  "shipping_address": { // إذا لم يكن address_id محدد
    "name": "أحمد محمد",
    "phone": "+201234567890",
    "street": "شارع التحرير، المعادي",
    "city": "القاهرة",
    "state": "القاهرة",
    "postal_code": "12345",
    "country": "مصر"
  },
  "payment_method": "credit_card", // credit_card|cash_on_delivery|bank_transfer
  "notes": "توصيل صباحي مفضل" // اختياري
}

// Response
{
  "success": true,
  "message": "تم إنشاء الطلب بنجاح",
  "data": {
    "order": {
      "id": "ORD-2024-001",
      "user_id": 1,
      "status": "pending",
      "subtotal": "57.00",
      "tax_amount": "5.70",
      "shipping_amount": "0.00",
      "discount_amount": "0.00",
      "total_amount": "62.70",
      "currency": "EGP",
      "payment_method": "credit_card",
      "payment_status": "pending",
      "shipping_address": { /* عنوان الشحن */ },
      "notes": "توصيل صباحي مفضل",
      "tracking_number": null,
      "estimated_delivery": "2024-01-22",
      "created_at": "2024-01-15T10:30:00.000000Z"
    }
  }
}
```

### 2. قائمة طلبات المستخدم
```javascript
GET /orders?page=1&per_page=10&status=pending
// Headers: Authorization: Bearer {token}

// Query Parameters (اختيارية):
// - status: pending|processing|shipped|delivered|cancelled
// - page: رقم الصفحة
// - per_page: عدد العناصر

// Response
{
  "data": [
    {
      "id": "ORD-2024-001",
      "status": "pending",
      "subtotal": "57.00",
      "total_amount": "62.70",
      "currency": "EGP",
      "payment_status": "pending",
      "items_count": 2,
      "estimated_delivery": "2024-01-22",
      "created_at": "2024-01-15T10:30:00.000000Z"
    }
  ],
  "meta": { /* معلومات الصفحات */ }
}
```

### 3. تفاصيل طلب محدد
```javascript
GET /orders/{order_id}
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "order": {
      "id": "ORD-2024-001",
      "status": "processing",
      "subtotal": "57.00",
      "tax_amount": "5.70",
      "shipping_amount": "0.00",
      "discount_amount": "0.00",
      "total_amount": "62.70",
      "currency": "EGP",
      "payment_method": "credit_card",
      "payment_status": "paid",
      "shipping_address": { /* عنوان الشحن */ },
      "notes": "توصيل صباحي مفضل",
      "tracking_number": "TRK123456789",
      "estimated_delivery": "2024-01-22",
      "items": [
        {
          "id": 1,
          "product_id": 8,
          "quantity": 2,
          "unit_price": "28.50",
          "total_price": "57.00",
          "product_name": "حديد تسليح ممتاز 10 مم",
          "product": { /* تفاصيل المنتج */ }
        }
      ],
      "timeline": [
        {
          "status": "pending",
          "date": "2024-01-15T10:30:00.000000Z",
          "note": "تم استلام الطلب"
        },
        {
          "status": "processing", 
          "date": "2024-01-16T09:00:00.000000Z",
          "note": "جاري تحضير الطلب"
        }
      ],
      "created_at": "2024-01-15T10:30:00.000000Z"
    }
  }
}
```

### 4. إلغاء طلب
```javascript
PUT /orders/{order_id}/cancel
// Headers: Authorization: Bearer {token}

// Request Body
{
  "reason": "تغيير في المتطلبات" // اختياري
}

// Response
{
  "success": true,
  "message": "تم إلغاء الطلب بنجاح",
  "data": {
    "order": { /* بيانات الطلب المحدثة */ }
  }
}
```

---

## ⭐ Reviews APIs

### 1. تقييمات منتج محدد
```javascript
GET /products/{product_id}/reviews?lang=ar&page=1&per_page=10&rating=5&include_pending=false

// Query Parameters (اختيارية):
// - rating: 1|2|3|4|5 (فلترة حسب التقييم)
// - include_pending: true|false (تضمين التقييمات المعلقة)

// Response
{
  "data": [
    {
      "id": 1,
      "user_name": "أحمد محمد",
      "rating": 5,
      "review": "منتج ممتاز وجودة عالية",
      "status": "approved",
      "verified_purchase": true,
      "helpful_count": 12,
      "images": ["review1.jpg", "review2.jpg"],
      "created_at": "2024-01-10T15:30:00.000000Z"
    }
  ],
  "meta": { /* معلومات الصفحات */ },
  "summary": {
    "average_rating": "4.8",
    "total_reviews": 247,
    "rating_breakdown": {
      "5": 180,
      "4": 45,
      "3": 15,
      "2": 5,
      "1": 2
    }
  }
}
```

### 2. إضافة تقييم لمنتج
```javascript
POST /products/{product_id}/reviews
// Headers: Authorization: Bearer {token}

// Request Body
{
  "rating": 5, // مطلوب: 1-5
  "review": "منتج رائع، أنصح بشرائه", // اختياري
  "images": ["review1.jpg", "review2.jpg"] // اختياري
}

// Response
{
  "success": true,
  "message": "تم إضافة التقييم بنجاح",
  "data": {
    "review": {
      "id": 15,
      "user_id": 1,
      "product_id": 8,
      "rating": 5,
      "review": "منتج رائع، أنصح بشرائه",
      "status": "approved",
      "verified_purchase": true,
      "helpful_count": 0,
      "images": ["review1.jpg", "review2.jpg"],
      "created_at": "2024-01-15T10:30:00.000000Z"
    }
  }
}
```

### 3. تحديث تقييم
```javascript
PUT /reviews/{review_id}
// Headers: Authorization: Bearer {token}

// Request Body
{
  "rating": 4,
  "review": "منتج جيد مع بعض الملاحظات"
}

// Response
{
  "success": true,
  "message": "تم تحديث التقييم بنجاح",
  "data": {
    "review": { /* التقييم المحدث */ }
  }
}
```

### 4. حذف تقييم
```javascript
DELETE /reviews/{review_id}
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم حذف التقييم بنجاح"
}
```

### 5. تمييز تقييم كمفيد
```javascript
POST /reviews/{review_id}/helpful
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم تمييز التقييم كمفيد",
  "data": {
    "helpful_count": 13
  }
}
```

---

## 📍 Addresses APIs

### 1. قائمة عناوين المستخدم
```javascript
GET /addresses
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": 1,
        "type": "home", // home|work|other
        "name": "المنزل",
        "phone": "+201234567890",
        "street": "شارع التحرير، المعادي",
        "city": "القاهرة",
        "state": "القاهرة", 
        "postal_code": "12345",
        "country": "مصر",
        "is_default": true,
        "created_at": "2024-01-15T10:30:00.000000Z"
      }
    ]
  }
}
```

### 2. تفاصيل عنوان محدد
```javascript
GET /addresses/{address_id}
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "address": { /* تفاصيل العنوان */ }
  }
}
```

### 3. إضافة عنوان جديد
```javascript
POST /addresses
// Headers: Authorization: Bearer {token}

// Request Body
{
  "type": "work", // home|work|other
  "name": "المكتب",
  "phone": "+201234567890",
  "street": "شارع النيل، الزمالك",
  "city": "القاهرة",
  "state": "القاهرة",
  "postal_code": "12346",
  "country": "مصر",
  "is_default": false // اختياري
}

// Response
{
  "success": true,
  "message": "تم إضافة العنوان بنجاح",
  "data": {
    "address": { /* العنوان الجديد */ }
  }
}
```

### 4. تحديث عنوان
```javascript
PUT /addresses/{address_id}
// Headers: Authorization: Bearer {token}

// Request Body (نفس بيانات الإضافة)
{
  "name": "المكتب الجديد",
  "street": "شارع طلعت حرب، وسط البلد"
}

// Response
{
  "success": true,
  "message": "تم تحديث العنوان بنجاح",
  "data": {
    "address": { /* العنوان المحدث */ }
  }
}
```

### 5. حذف عنوان
```javascript
DELETE /addresses/{address_id}
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم حذف العنوان بنجاح"
}
```

### 6. تعيين عنوان كافتراضي
```javascript
POST /addresses/{address_id}/make-default
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم تعيين العنوان كافتراضي",
  "data": {
    "address": { /* العنوان مع is_default: true */ }
  }
}
```

---

## 📞 Contact APIs

### 1. إرسال رسالة تواصل
```javascript
POST /contact
// لا يحتاج authentication

// Request Body
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "+201234567890", // اختياري
  "company": "شركة البناء", // اختياري
  "subject": "استفسار عن المنتجات",
  "message": "أريد معرفة المزيد عن الأدوات الكهربائية",
  "project_type": "commercial" // residential|commercial|industrial|other - اختياري
}

// Response
{
  "success": true,
  "message": "تم إرسال رسالتك بنجاح، سنتواصل معك قريباً",
  "data": {
    "ticket_id": "TKT-2024-001",
    "contact_message": {
      "id": "TKT-2024-001",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+201234567890",
      "company": "شركة البناء",
      "subject": "استفسار عن المنتجات",
      "message": "أريد معرفة المزيد...",
      "project_type": "commercial",
      "status": "new",
      "created_at": "2024-01-15T10:30:00.000000Z"
    }
  }
}
```

---

## 🏷️ Brands APIs

### 1. قائمة العلامات التجارية
```javascript
GET /brands?lang=ar&featured=1

// Query Parameters (اختيارية):
// - featured: 1 للعلامات المميزة فقط

// Response
{
  "data": [
    {
      "id": 1,
      "name": "بوش",
      "description": "علامة تجارية ألمانية رائدة...",
      "logo": "/images/brands/bosch.png",
      "website": "https://www.bosch.com",
      "status": "active",
      "featured": true,
      "sort_order": 1,
      "products_count": 85 // إذا كان متاح
    }
  ]
}
```

---

## 🏭 Suppliers APIs

### 1. قائمة الموردين
```javascript
GET /suppliers?lang=ar&page=1&rating_min=4&verified=1

// Query Parameters (اختيارية):
// - rating_min: أقل تقييم مطلوب
// - verified: 1 للموردين المعتمدين فقط

// Response
{
  "data": [
    {
      "id": 1,
      "name": "شركة الأدوات المتقدمة",
      "description": "مورد رائد في الأدوات الكهربائية...",
      "email": "info@advancedtools.com",
      "phone": "+201234567890",
      "rating": "4.5",
      "certifications": ["ISO 9001:2015", "OHSAS 18001:2007"],
      "certification_count": 2,
      "verified": true,
      "status": "active",
      "products_count": 150 // إذا كان متاح
    }
  ],
  "meta": { /* معلومات الصفحات */ }
}
```

### 2. تفاصيل مورد محدد
```javascript
GET /suppliers/{supplier_id}?lang=ar

// Response
{
  "success": true,
  "data": {
    "supplier": {
      "id": 1,
      "name": "شركة الأدوات المتقدمة",
      "description": "مورد رائد في الأدوات الكهربائية...",
      "email": "info@advancedtools.com",
      "phone": "+201234567890",
      "rating": "4.5",
      "certifications": ["ISO 9001:2015", "OHSAS 18001:2007"],
      "verified": true,
      "status": "active"
    },
    "products": [ /* منتجات المورد */ ],
    "total_products": 150
  }
}
```

---

## 🔔 Notifications APIs

### 1. قائمة إشعارات المستخدم
```javascript
GET /notifications?page=1&unread_only=true
// Headers: Authorization: Bearer {token}

// Query Parameters (اختيارية):
// - unread_only: true لعرض غير المقروءة فقط

// Response
{
  "data": [
    {
      "id": 1,
      "type": "order_update",
      "title": "تحديث الطلب",
      "message": "تم شحن طلبك ORD-2024-001",
      "read_at": null,
      "data": {
        "order_id": "ORD-2024-001",
        "status": "shipped"
      },
      "created_at": "2024-01-15T10:30:00.000000Z"
    }
  ],
  "meta": { /* معلومات الصفحات */ },
  "unread_count": 5
}
```

### 2. تمييز إشعار كمقروء
```javascript
PUT /notifications/{notification_id}/read
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم تمييز الإشعار كمقروء"
}
```

### 3. تمييز جميع الإشعارات كمقروءة
```javascript
POST /notifications/mark-all-read
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم تمييز جميع الإشعارات كمقروءة",
  "data": {
    "marked_count": 5
  }
}
```

---

## 📧 Newsletter APIs

### 1. الاشتراك في النشرة البريدية
```javascript
POST /newsletter/subscribe
// لا يحتاج authentication

// Request Body
{
  "email": "ahmed@example.com",
  "preferences": ["new_products", "offers", "industry_news"] // اختياري
}

// Response
{
  "success": true,
  "message": "تم الاشتراك في النشرة البريدية بنجاح"
}
```

### 2. إلغاء الاشتراك
```javascript
POST /newsletter/unsubscribe

// Request Body
{
  "email": "ahmed@example.com"
}

// Response
{
  "success": true,
  "message": "تم إلغاء الاشتراك بنجاح"
}
```

---

## 🧮 Cost Calculator APIs

### 1. حساب تكلفة المشروع
```javascript
POST /cost-calculator
// Headers: Authorization: Bearer {token} (اختياري للحفظ)

// Request Body
{
  "project_name": "فيلا سكنية",
  "project_type": "residential", // residential|commercial|industrial|infrastructure
  "area_sqm": 200,
  "materials": [
    {
      "product_id": 6, // Portland Cement
      "quantity": 50,
      "unit": "bag"
    },
    {
      "product_id": 8, // Steel Rebar
      "quantity": 2000,
      "unit": "kg"
    }
  ],
  "labor_cost": 15000, // اختياري
  "additional_costs": 5000, // اختياري
  "save": true // اختياري - لحفظ الحساب
}

// Response
{
  "success": true,
  "data": {
    "calculation": {
      "id": "calc_123", // إذا تم الحفظ
      "project_name": "فيلا سكنية",
      "project_type": "residential",
      "area_sqm": 200,
      "materials_cost": 58250.00,
      "labor_cost": 15000.00,
      "additional_costs": 5000.00,
      "total_cost": 78250.00,
      "cost_per_sqm": 391.25,
      "currency": "EGP",
      "breakdown": [
        {
          "category": "Portland Cement",
          "quantity": 50,
          "unit_price": 25.00,
          "total": 1250.00,
          "percentage": 1.6
        },
        {
          "category": "Steel Rebar",
          "quantity": 2000,
          "unit_price": 28.50,
          "total": 57000.00,
          "percentage": 72.9
        }
      ],
      "recommendations": [
        "يمكن توفير 5% بشراء كميات أكبر",
        "هناك عرض خاص على الأسمنت هذا الأسبوع"
      ]
    }
  }
}
```

### 2. سجل الحسابات السابقة
```javascript
GET /cost-calculator/history?page=1
// Headers: Authorization: Bearer {token}

// Response
{
  "data": [
    {
      "id": "calc_123",
      "project_name": "فيلا سكنية",
      "project_type": "residential",
      "area_sqm": 200,
      "total_cost": 78250.00,
      "cost_per_sqm": 391.25,
      "created_at": "2024-01-15T10:30:00.000000Z"
    }
  ],
  "meta": { /* معلومات الصفحات */ }
}
```

---

## 🚚 Shipment & Tracking APIs

### 1. تتبع الشحنة
```javascript
GET /orders/{order_id}/tracking
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "tracking": {
      "order_id": "ORD-2024-001",
      "tracking_number": "TRK123456789",
      "carrier": "شركة النقل السريع",
      "status": "في الطريق",
      "estimated_delivery": "2024-01-20",
      "timeline": [
        {
          "status": "تم الاستلام",
          "date": "2024-01-15T10:00:00.000000Z",
          "location": "المستودع الرئيسي",
          "note": "تم استلام الطلب وجاري التحضير"
        },
        {
          "status": "خرج للتوصيل", 
          "date": "2024-01-18T08:00:00.000000Z",
          "location": "مركز التوزيع - القاهرة",
          "note": "الطلب في طريقه إليك"
        }
      ]
    }
  }
}
```

---

## 🧪 Testing & Health APIs

### 1. فحص صحة API
```javascript
GET /health
// لا يحتاج authentication

// Response
{
  "status": "OK",
  "message": "API is working properly",
  "timestamp": "2024-01-15T10:30:00.000000Z",
  "version": "1.0.0"
}
```

### 2. اختبار الاتصال
```javascript
GET /test
// لا يحتاج authentication

// Response
{
  "success": true,
  "message": "API connection successful"
}
```

### 3. اختبار المصادقة
```javascript
GET /auth-test
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "Authentication successful",
  "user": { /* بيانات المستخدم المسجل */ }
}
```

---

## 🎯 حسابات التجربة

### 👨‍💼 Admin Account
```
Email: admin@buildtools.com
Password: password
Role: admin
```

### 👤 Customer Account  
```
Email: customer@example.com
Password: password
Role: customer
```

### 🏭 Supplier Account
```
Email: supplier@example.com  
Password: password
Role: supplier
```

---

## 🛠️ نصائح للتطوير

### 1. **معالجة الأخطاء**
```javascript
// مثال معالجة الاستجابة
const handleApiResponse = async (apiCall) => {
  try {
    const response = await apiCall();
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    if (error.response?.status === 422) {
      // أخطاء التحقق
      const validationErrors = error.response.data.errors;
      console.log('Validation errors:', validationErrors);
    } else if (error.response?.status === 401) {
      // غير مصرح له
      console.log('Unauthorized - redirect to login');
    } else if (error.response?.status === 404) {
      // غير موجود
      console.log('Resource not found');
    }
    throw error;
  }
};
```

### 2. **إدارة التوكن**
```javascript
// حفظ التوكن
const saveToken = (token) => {
  localStorage.setItem('auth_token', token);
  // أو في cookies آمنة
};

// إضافة التوكن للطلبات
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. **إدارة اللغة**
```javascript
// إضافة معامل اللغة
const getCurrentLang = () => {
  return localStorage.getItem('app_language') || 'ar';
};

const addLangToUrl = (url) => {
  const lang = getCurrentLang();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}lang=${lang}`;
};
```

### 4. **Cache المنتجات**
```javascript
// مثال بسيط للـ cache
const productCache = new Map();

const getProduct = async (productId) => {
  if (productCache.has(productId)) {
    return productCache.get(productId);
  }
  
  const product = await apiCall(`/products/${productId}`);
  productCache.set(productId, product);
  return product;
};
```

---

## 🎉 خلاص! 

هذا دليل شامل لجميع APIs المتاحة. كل API مُجرب ويعمل بشكل صحيح مع دعم كامل للعربية والإنجليزية. 

**للتجربة السريعة:** استخدم الحسابات المُعدة مسبقاً وابدأ بـ APIs الأساسية مثل المنتجات والفئات، ثم انتقل لـ APIs المتقدمة كالسلة والطلبات.

**محتاج مساعدة؟** كل endpoint مُوثق بالتفصيل مع أمثلة حقيقية للطلب والاستجابة! 🚀
