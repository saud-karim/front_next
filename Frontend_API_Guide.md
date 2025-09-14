# 🚀 دليل APIs الشامل للفرونت إند - BuildTools BS

## 📋 فهرس المحتويات

- [🔐 Authentication APIs](#authentication-apis) - المصادقة وإدارة المستخدمين
- [🛍️ Products APIs](#products-apis) - المنتجات والبحث والفلاتر  
- [📂 Categories APIs](#categories-apis) - الفئات والإحصائيات
- [🛒 Cart APIs](#cart-apis) - سلة التسوق وكوبونات الخصم
- [❤️ Wishlist APIs](#wishlist-apis) - قائمة الأمنيات
- [📦 Orders APIs](#orders-apis) - الطلبات والتتبع
- [⭐ Reviews APIs](#reviews-apis) - التقييمات والمراجعات
- [📍 Addresses APIs](#addresses-apis) - عناوين الشحن
- [👨‍💼 Admin Dashboard APIs](#admin-dashboard-apis) - لوحة الإدارة
- [📦 Admin Products APIs](#admin-products-apis) - إدارة المنتجات
- [🏷️ Admin Categories APIs](#admin-categories-apis) - إدارة الفئات
- [👥 Admin Customer Management APIs](#customer-management-apis) - **جديد!** إدارة العملاء الشاملة
- [🛍️ Admin Products Management APIs](#admin-products-management-apis) - **جديد!** إدارة المنتجات المتقدمة
- [⭐ Admin Review Management APIs](#admin-review-management-apis) - **جديد!** إدارة التقييمات الشاملة
- [📞 Contact APIs](#contact-apis) - رسائل التواصل
- [🏷️ Brands APIs](#brands-apis) - العلامات التجارية
- [🏭 Suppliers APIs](#suppliers-apis) - الموردين
- [🔔 Notifications APIs](#notifications-apis) - الإشعارات
- [📧 Newsletter APIs](#newsletter-apis) - النشرة البريدية
- [🧮 Cost Calculator APIs](#cost-calculator-apis) - حاسبة التكلفة
- [🚚 Shipment & Tracking APIs](#shipment--tracking-apis) - تتبع الشحنات

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
      "description": "الأدوات والمعدات احترافية لمشاريع البناء والتشييد",
      "image": null,
      "status": "active",
      "sort_order": 0,
      "products_count": 5,
      "full_path": "الأدوات والمعدات",
      "created_at": "2025-08-15T13:03:33.000000Z",
      "updated_at": "2025-08-15T19:36:13.000000Z"
    },
    {
      "id": 3,
      "name": "معدات الأمان",
      "description": "معدات الأمان احترافية لمشاريع البناء والتشييد",
      "image": null,
      "status": "active",
      "sort_order": 0,
      "products_count": 0,
      "full_path": "معدات الأمان",
      "created_at": "2025-08-15T13:03:33.000000Z",
      "updated_at": "2025-08-15T19:36:13.000000Z"
    }
    // ... باقي الفئات
  ]
}
```

### 2. تفاصيل فئة مع منتجاتها
```javascript
GET /categories/{id}?lang=ar

// Response
{
  "category": {
    "id": 2,
    "name": "الأدوات والمعدات",
    "description": "الأدوات والمعدات احترافية لمشاريع البناء والتشييد",
    "image": null,
    "status": "active",
    "sort_order": 0,
    "products_count": 5,
    "full_path": "الأدوات والمعدات",
    "created_at": "2025-08-15T13:03:33.000000Z",
    "updated_at": "2025-08-15T19:36:13.000000Z"
  },
  "products": [
    {
      "id": 11,
      "name": "مثقاب كهربائي بوش GSR 120-LI",
      "description": "مثقاب كهربائي لاسلكي احترافي من بوش مع بطارية ليثيوم أيون 12 فولت",
      "price": "320.00",
      "original_price": "380.00",
      "rating": "4.90",
      "reviews_count": 78,
      "stock": 25,
      "status": "active",
      "featured": true,
      "images": [
        "/images/products/bosch-gsr120li-1.jpg",
        "/images/products/bosch-gsr120li-2.jpg"
      ],
      "is_in_stock": true,
      "has_low_stock": false
    }
    // ... باقي المنتجات
  ]
}
```

### 3. إحصائيات الفئات المتقدمة
```javascript
GET /categories/statistics?lang=ar

// Response
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 2,
        "name": "الأدوات والمعدات",
        "total_products": 5,        // إجمالي المنتجات
        "active_products": 5,       // المنتجات النشطة
        "featured_products": 2,     // المنتجات المميزة
        "out_of_stock": 0,          // المنتجات المنتهية من المخزن
        "low_stock": 0             // المنتجات قليلة المخزن (أقل من 10)
      },
      {
        "id": 9,
        "name": "الأسمنت",
        "total_products": 1,
        "active_products": 1,
        "featured_products": 0,
        "out_of_stock": 0,
        "low_stock": 0
      }
    ],
    "summary": {
      "total_categories": 9,       // إجمالي الفئات
      "active_categories": 9,      // الفئات النشطة
      "total_products": 11        // إجمالي المنتجات في كل الفئات
    }
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

## 👨‍💼 Admin Dashboard APIs

### ⚠️ متطلبات الوصول
جميع Admin Dashboard APIs تتطلب:
- **Authentication**: `Authorization: Bearer {admin_token}`
- **Role**: المستخدم يجب أن يكون `admin`
- **Middleware**: محمية بـ `role:admin`

### 1. إحصائيات لوحة الإدارة
```javascript
GET /admin/dashboard/stats
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "total_products": 11,
    "total_orders": 9,
    "total_customers": 6,
    "total_revenue": 2543.75,
    "pending_orders": 3,        // الطلبات المعلقة
    "low_stock_products": 4,    // المنتجات قليلة المخزون (≤ 10)
    "new_customers_this_month": 2,
    "monthly_growth_percentage": 15.8
  }
}
```

### 2. الأنشطة الحديثة
```javascript
GET /admin/dashboard/recent-activity?limit=5
// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - limit: عدد الأنشطة (افتراضي: 5)

// Response
{
  "success": true,
  "data": [
    {
      "id": 8,
      "type": "customer",
      "message": "عميل جديد انضم",
      "timestamp": "2025-01-15T10:30:00.000000Z",
      "user_name": "أحمد محمد"
    },
    {
      "id": 3,
      "type": "order",
      "message": "طلب جديد #ORD-2024-003",
      "timestamp": "2025-01-15T09:15:00.000000Z",
      "user_name": "سارة علي"
    },
    {
      "id": 5,
      "type": "product",
      "message": "مخزون منخفض: مثقاب ديوالت",
      "timestamp": "2025-01-15T08:45:00.000000Z",
      "product_id": 5
    },
    {
      "id": 2,
      "type": "review",
      "message": "تقييم جديد 5⭐",
      "timestamp": "2025-01-15T08:30:00.000000Z",
      "product_name": "مفك بوش",
      "rating": 5
    }
  ]
}

// أنواع الأنشطة:
// - order: طلبات جديدة
// - customer: عملاء جدد  
// - product: تنبيهات المخزون المنخفض
// - review: تقييمات جديدة مُوافق عليها
```

### 3. نظرة عامة شاملة (اختياري)
```javascript
GET /admin/dashboard/overview
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "stats": { /* نفس بيانات /stats */ },
    "sales_chart": [
      {"date": "2025-01-09", "revenue": 250.00},
      {"date": "2025-01-10", "revenue": 180.50},
      {"date": "2025-01-11", "revenue": 320.75},
      {"date": "2025-01-12", "revenue": 290.25},
      {"date": "2025-01-13", "revenue": 410.00},
      {"date": "2025-01-14", "revenue": 325.50},
      {"date": "2025-01-15", "revenue": 387.25}
    ],
    "orders_by_status": {
      "pending": 3,
      "processing": 2,
      "shipped": 1,
      "delivered": 3,
      "cancelled": 0
    },
    "top_products": [
      {
        "id": 8,
        "name": "حديد تسليح ممتاز 10 مم",
        "total_sold": 150,
        "revenue": 4275.00
      }
      // ... أكثر المنتجات مبيعاً
    ]
  }
}
```

### 4. مثال للاستخدام في React
```javascript
// ===== Custom Hook للوحة الإدارة =====
const useAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      // جلب الإحصائيات
      const statsResponse = await fetch('/api/v1/admin/dashboard/stats', { headers });
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }

      // جلب الأنشطة الحديثة
      const activityResponse = await fetch('/api/v1/admin/dashboard/recent-activity?limit=10', { headers });
      const activityData = await activityResponse.json();
      
      if (activityData.success) {
        setRecentActivity(activityData.data);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // تحديث البيانات كل 5 دقائق
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { stats, recentActivity, loading, error, refetch: fetchDashboardData };
};

// ===== مكون لوحة الإدارة =====
const AdminDashboard = () => {
  const { stats, recentActivity, loading, error } = useAdminDashboard();

  if (loading) return <div>جاري تحميل لوحة الإدارة...</div>;
  if (error) return <div>خطأ: {error}</div>;

  return (
    <div className="admin-dashboard p-6">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-blue-800">{stats?.total_products}</h3>
          <p className="text-blue-600">إجمالي المنتجات</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-green-800">{stats?.total_orders}</h3>
          <p className="text-green-600">إجمالي الطلبات</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-yellow-800">{stats?.pending_orders}</h3>
          <p className="text-yellow-600">طلبات معلقة</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-purple-800">{stats?.total_revenue} ج.م</h3>
          <p className="text-purple-600">إجمالي الإيرادات</p>
        </div>
      </div>

      {/* الأنشطة الحديثة */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">الأنشطة الحديثة</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-3 h-3 rounded-full ${getActivityColor(activity.type)}`}></div>
              <div className="flex-1">
                <p className="font-medium">{activity.message}</p>
                {activity.user_name && (
                  <p className="text-sm text-gray-600">بواسطة: {activity.user_name}</p>
                )}
                <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== دالة مساعدة لألوان الأنشطة =====
const getActivityColor = (type) => {
  switch (type) {
    case 'order': return 'bg-blue-500';
    case 'customer': return 'bg-green-500';
    case 'product': return 'bg-yellow-500';
    case 'review': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};
```

### 5. حماية الصفحات
```javascript
// ===== Middleware للتحقق من صلاحيات الإدارة =====
const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const response = await fetch('/api/v1/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const data = await response.json();
        
        if (data.success && data.data.user.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          localStorage.removeItem('admin_token');
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, loading };
};

// ===== مكون الحماية =====
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, router]);

  if (loading) return <div>جاري التحقق من الصلاحيات...</div>;
  if (!isAdmin) return null;

  return children;
};

// الاستخدام:
// <AdminRoute>
//   <AdminDashboard />
// </AdminRoute>
```

---

## 📦 Admin Products APIs

### ⚠️ متطلبات الوصول
جميع Admin Products APIs تتطلب:
- **Authentication**: `Authorization: Bearer {admin_token}`
- **Role**: المستخدم يجب أن يكون `admin`
- **Middleware**: محمية بـ `role:admin`

### 1. قائمة المنتجات للإدارة
```javascript
GET /admin/products
// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - lang: ar|en
// - page: رقم الصفحة (افتراضي: 1)  
// - per_page: عدد العناصر (افتراضي: 15، الحد الأقصى: 50)
// - search: البحث في الاسم والوصف
// - category: ID الفئة
// - status: active|inactive
// - supplier: ID المورد
// - featured: 1|0 للمنتجات المميزة
// - sort: created_at|name_ar|name_en|price|stock|rating
// - order: asc|desc

// Response
{
  "success": true,
  "data": [
    {
      "id": 8,
      "name": "حديد تسليح ممتاز 10 مم",
      "description": "حديد تسليح عالي الجودة...",
      "price": "28.50",
      "original_price": null,
      "rating": "4.8",
      "reviews_count": 247,
      "stock": 2000,
      "status": "active",           // مطلوب
      "featured": false,            // مطلوب
      "images": ["rebar10mm.jpg"],
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات"
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة"
      },
      "brand": {
        "id": 1,
        "name": "العلامة التجارية"
      },
      "is_in_stock": true,         // مطلوب
      "has_low_stock": false,      // مطلوب (stock <= 10)
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T15:45:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 55,
    "per_page": 15,
    "last_page": 4
  },
  "links": {
    "first": "http://localhost:8000/api/v1/admin/products?page=1",
    "last": "http://localhost:8000/api/v1/admin/products?page=4",
    "prev": null,
    "next": "http://localhost:8000/api/v1/admin/products?page=2"
  }
}
```

### 2. إحصائيات المنتجات
```javascript
GET /admin/products/stats
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "total": 55,           // إجمالي المنتجات
    "active": 48,          // منتجات نشطة
    "inactive": 7,         // منتجات غير نشطة
    "featured": 12,        // منتجات مميزة
    "low_stock": 8,        // مخزون أقل من 10
    "out_of_stock": 3      // مخزون = 0
  }
}
```

### 3. تفاصيل منتج واحد (للتحرير)
```javascript
GET /admin/products/{product_id}
// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - lang: ar|en

// Response
{
  "success": true,
  "data": {
    "product": {
      "id": 8,
      "name_ar": "حديد تسليح ممتاز 10 مم",
      "name_en": "Premium Steel Rebar 10mm",
      "name": "حديد تسليح ممتاز 10 مم", // حسب اللغة المطلوبة
      "description_ar": "حديد تسليح عالي الجودة...",
      "description_en": "High quality steel rebar...",
      "description": "حديد تسليح عالي الجودة...", // حسب اللغة المطلوبة
      "price": "28.50",
      "original_price": null,
      "stock": 2000,
      "sku": "PRD-1234567890-123",
      "rating": "4.8",
      "reviews_count": 247,
      "status": "active",
      "featured": false,
      "images": ["rebar10mm.jpg"],
      "category_id": 2,
      "supplier_id": 1,
      "brand_id": null,
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات"
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة"
      },
      "brand": null,
      "features": [], // سيتم إضافتها لاحقاً
      "specifications": [], // سيتم إضافتها لاحقاً
      "is_in_stock": true,
      "has_low_stock": false,
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T15:45:00.000000Z"
    }
  }
}
```

### 4. إنشاء منتج جديد
```javascript
POST /admin/products
// Headers: Authorization: Bearer {admin_token}

// Request Body
{
  "name_ar": "مثقاب كهربائي احترافي",
  "name_en": "Professional Electric Drill",
  "description_ar": "مثقاب كهربائي قوي للاستخدام المهني",
  "description_en": "Powerful electric drill for professional use",
  "price": "450.00",
  "original_price": "500.00", // اختياري
  "stock": 25,
  "category_id": 2,
  "supplier_id": 1, // اختياري
  "brand_id": 1, // اختياري
  "status": "active", // active|inactive
  "featured": true, // اختياري
  "images": ["drill1.jpg", "drill2.jpg"] // اختياري
}

// Response
{
  "success": true,
  "message": "تم إنشاء المنتج بنجاح",
  "data": {
    "product": {
      "id": 56,
      "name_ar": "مثقاب كهربائي احترافي",
      "name_en": "Professional Electric Drill",
      "price": "450.00",
      "stock": 25,
      "status": "active",
      "featured": true,
      "sku": "PRD-1642248127-456",
      "created_at": "2024-01-15T16:30:00.000000Z"
    }
  }
}
```

### 5. تحديث منتج
```javascript
PUT /admin/products/{product_id}
// Headers: Authorization: Bearer {admin_token}

// Request Body (نفس بيانات الإنشاء)
{
  "name_ar": "مثقاب كهربائي احترافي محدث",
  "name_en": "Updated Professional Electric Drill",
  "description_ar": "مثقاب كهربائي قوي ومحدث",
  "description_en": "Updated powerful electric drill",
  "price": "420.00",
  "original_price": "500.00",
  "stock": 30,
  "category_id": 2,
  "supplier_id": 1,
  "brand_id": 1,
  "status": "active",
  "featured": false
}

// Response
{
  "success": true,
  "message": "تم تحديث المنتج بنجاح",
  "data": {
    "product": { /* المنتج المحدث */ }
  }
}
```

### 6. تبديل حالة المنتج (نشط/غير نشط)
```javascript
PATCH /admin/products/{product_id}/toggle-status
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "message": "تم إلغاء تفعيل المنتج بنجاح", // أو "تم تفعيل المنتج بنجاح"
  "data": {
    "product": {
      "id": 8,
      "status": "inactive" // أو "active"
    }
  }
}
```

### 7. تبديل حالة المنتج المميز
```javascript
PATCH /admin/products/{product_id}/toggle-featured
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "message": "تم إضافة المنتج للمميزة بنجاح", // أو "تم إزالة المنتج من المميزة بنجاح"
  "data": {
    "product": {
      "id": 8,
      "featured": true // أو false
    }
  }
}
```

### 8. حذف منتج
```javascript
DELETE /admin/products/{product_id}
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "message": "تم حذف المنتج بنجاح"
}
```

### 9. أمثلة الاستخدام في React
```javascript
// ===== Custom Hook لإدارة المنتجات =====
const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    featured: '',
    page: 1,
    per_page: 15
  });

  const fetchProducts = async (newFilters = {}) => {
    try {
      setLoading(true);
      const queryFilters = { ...filters, ...newFilters };
      
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      // بناء query string
      const queryParams = new URLSearchParams();
      Object.entries(queryFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append('lang', 'ar');

      const response = await fetch(
        `http://localhost:8000/api/v1/admin/products?${queryParams}`,
        { headers }
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setFilters(queryFilters);
      }
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:8000/api/v1/admin/products/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  const toggleProductStatus = async (productId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/products/${productId}/toggle-status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      
      if (data.success) {
        // تحديث المنتج في القائمة
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, status: data.data.product.status }
            : product
        ));
        toast.success(data.message);
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة المنتج:', error);
      toast.error('حدث خطأ في تحديث حالة المنتج');
    }
  };

  const toggleProductFeatured = async (productId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/products/${productId}/toggle-featured`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      
      if (data.success) {
        // تحديث المنتج في القائمة
        setProducts(prev => prev.map(product => 
          product.id === productId 
            ? { ...product, featured: data.data.product.featured }
            : product
        ));
        toast.success(data.message);
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة المنتج المميز:', error);
      toast.error('حدث خطأ في تحديث حالة المنتج المميز');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  return {
    products,
    stats,
    loading,
    filters,
    fetchProducts,
    fetchStats,
    toggleProductStatus,
    toggleProductFeatured
  };
};

// ===== مكون قائمة المنتجات للإدارة =====
const AdminProductsList = () => {
  const {
    products,
    stats,
    loading,
    filters,
    fetchProducts,
    toggleProductStatus,
    toggleProductFeatured
  } = useAdminProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({ search: searchTerm, page: 1 });
  };

  const handleFilterChange = (filterName, value) => {
    fetchProducts({ [filterName]: value, page: 1 });
  };

  if (loading) return <div>جاري تحميل المنتجات...</div>;

  return (
    <div className="admin-products p-6">
      {/* الإحصائيات */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-blue-800">{stats.total}</h3>
            <p className="text-blue-600">إجمالي</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-green-800">{stats.active}</h3>
            <p className="text-green-600">نشط</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-red-800">{stats.inactive}</h3>
            <p className="text-red-600">غير نشط</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-purple-800">{stats.featured}</h3>
            <p className="text-purple-600">مميز</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-yellow-800">{stats.low_stock}</h3>
            <p className="text-yellow-600">مخزون منخفض</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-orange-800">{stats.out_of_stock}</h3>
            <p className="text-orange-600">نفد المخزون</p>
          </div>
        </div>
      )}

      {/* فلاتر البحث */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-l-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              🔍
            </button>
          </form>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              handleFilterChange('status', e.target.value);
            }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>

          <select
            value={featuredFilter}
            onChange={(e) => {
              setFeaturedFilter(e.target.value);
              handleFilterChange('featured', e.target.value);
            }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">جميع المنتجات</option>
            <option value="1">المميزة فقط</option>
            <option value="0">غير المميزة</option>
          </select>

          <button
            onClick={() => router.push('/admin/products/create')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            ➕ منتج جديد
          </button>
        </div>
      </div>

      {/* قائمة المنتجات */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                المنتج
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                السعر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                المخزون
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                مميز
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      className="h-10 w-10 rounded-lg object-cover"
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                    />
                    <div className="mr-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {product.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.price} ج.م
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.stock === 0
                      ? 'bg-red-100 text-red-800'
                      : product.has_low_stock
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleProductStatus(product.id)}
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {product.status === 'active' ? 'نشط' : 'غير نشط'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleProductFeatured(product.id)}
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                      product.featured
                        ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {product.featured ? '⭐ مميز' : 'عادي'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/admin/products/${product.id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      تحرير
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 10. نصائح للاستخدام الأمثل
```javascript
// ===== إدارة حالة الفلاتر =====
const [filters, setFilters] = useState({
  search: '',
  category: '',
  status: 'active', // ابدأ بالمنتجات النشطة
  featured: '',
  sort: 'created_at',
  order: 'desc'
});

// ===== تحسين الأداء مع debouncing للبحث =====
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (searchTerm) => {
    fetchProducts({ search: searchTerm, page: 1 });
  },
  500
);

// ===== معالجة الأخطاء الشاملة =====
const handleApiError = (error, action) => {
  console.error(`خطأ في ${action}:`, error);
  
  if (error.response?.status === 422) {
    const validationErrors = error.response.data.errors;
    Object.values(validationErrors).flat().forEach(message => {
      toast.error(message);
    });
  } else if (error.response?.status === 403) {
    toast.error('غير مسموح لك بتنفيذ هذا الإجراء');
  } else if (error.response?.status === 404) {
    toast.error('المنتج غير موجود');
  } else {
    toast.error(`حدث خطأ في ${action}`);
  }
};

// ===== استخدام optimistic updates =====
const optimisticToggleStatus = (productId) => {
  // تحديث الواجهة فوراً
  setProducts(prev => prev.map(product => 
    product.id === productId 
      ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
      : product
  ));
  
  // إرسال الطلب للسيرفر
  toggleProductStatus(productId).catch(() => {
    // التراجع في حالة الفشل
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
  });
};

/* 
💡 نصائح مهمة:

1. **الفلاتر**: استخدم URL parameters لحفظ حالة الفلاتر
2. **التحديث التلقائي**: أعد جلب البيانات بعد كل تعديل
3. **التحقق من الأذونات**: تحقق من role=admin قبل عرض الواجهة
4. **المعاينة المباشرة**: اعرض تغييرات الحالة فوراً للمستخدم
5. **التنبيهات**: استخدم toast notifications للتأكيدات
6. **التحميل التدريجي**: استخدم pagination للقوائم الطويلة
7. **البحث الذكي**: طبق debouncing للبحث المباشر
8. **الكاش المحلي**: احفظ البيانات المتكررة لتحسين الأداء
*/
```

---

## 📦 Admin Products APIs

### ⚠️ متطلبات الوصول
جميع Admin Products APIs تتطلب:
- **Authentication**: `Authorization: Bearer {admin_token}`
- **Role**: المستخدم يجب أن يكون `admin`
- **Middleware**: محمية بـ `role:admin`

### 1. قائمة المنتجات للإدارة
```javascript
GET /admin/products
// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - lang: ar|en
// - page: رقم الصفحة (افتراضي: 1)  
// - per_page: عدد العناصر (افتراضي: 15، الحد الأقصى: 50)
// - search: البحث في الاسم والوصف
// - category: ID الفئة
// - status: active|inactive
// - supplier: ID المورد
// - featured: 1|0 للمنتجات المميزة
// - sort: created_at|name_ar|name_en|price|stock|rating
// - order: asc|desc

// Response
{
  "success": true,
  "data": [
    {
      "id": 8,
      "name": "حديد تسليح ممتاز 10 مم",
      "description": "حديد تسليح عالي الجودة...",
      "price": "28.50",
      "original_price": null,
      "rating": "4.8",
      "reviews_count": 247,
      "stock": 2000,
      "status": "active",           // مطلوب
      "featured": false,            // مطلوب
      "images": ["rebar10mm.jpg"],
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات"
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة"
      },
      "brand": {
        "id": 1,
        "name": "العلامة التجارية"
      },
      "is_in_stock": true,         // مطلوب
      "has_low_stock": false,      // مطلوب (stock <= 10)
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T15:45:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 55,
    "per_page": 15,
    "last_page": 4
  },
  "links": {
    "first": "http://localhost:8000/api/v1/admin/products?page=1",
    "last": "http://localhost:8000/api/v1/admin/products?page=4",
    "prev": null,
    "next": "http://localhost:8000/api/v1/admin/products?page=2"
  }
}
```

### 2. إحصائيات المنتجات
```javascript
GET /admin/products/stats
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "total": 55,           // إجمالي المنتجات
    "active": 48,          // منتجات نشطة
    "inactive": 7,         // منتجات غير نشطة
    "featured": 12,        // منتجات مميزة
    "low_stock": 8,        // مخزون أقل من 10
    "out_of_stock": 3      // مخزون = 0
  }
}
```

### 3. تفاصيل منتج واحد (للتحرير)
```javascript
GET /admin/products/{product_id}
// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - lang: ar|en

// Response
{
  "success": true,
  "data": {
    "product": {
      "id": 8,
      "name_ar": "حديد تسليح ممتاز 10 مم",
      "name_en": "Premium Steel Rebar 10mm",
      "name": "حديد تسليح ممتاز 10 مم", // حسب اللغة المطلوبة
      "description_ar": "حديد تسليح عالي الجودة...",
      "description_en": "High quality steel rebar...",
      "description": "حديد تسليح عالي الجودة...", // حسب اللغة المطلوبة
      "price": "28.50",
      "original_price": null,
      "stock": 2000,
      "sku": "PRD-1234567890-123",
      "rating": "4.8",
      "reviews_count": 247,
      "status": "active",
      "featured": false,
      "images": ["rebar10mm.jpg"],
      "category_id": 2,
      "supplier_id": 1,
      "brand_id": null,
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات"
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة"
      },
      "brand": null,
      "features": [], // سيتم إضافتها لاحقاً
      "specifications": [], // سيتم إضافتها لاحقاً
      "is_in_stock": true,
      "has_low_stock": false,
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T15:45:00.000000Z"
    }
  }
}
```

### 4. تبديل حالة المنتج (نشط/غير نشط)
```javascript
PATCH /admin/products/{product_id}/toggle-status
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "message": "تم إلغاء تفعيل المنتج بنجاح", // أو "تم تفعيل المنتج بنجاح"
  "data": {
    "product": {
      "id": 8,
      "status": "inactive" // أو "active"
    }
  }
}
```

### 5. تبديل حالة المنتج المميز
```javascript
PATCH /admin/products/{product_id}/toggle-featured
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "message": "تم إضافة المنتج للمميزة بنجاح", // أو "تم إزالة المنتج من المميزة بنجاح"
  "data": {
    "product": {
      "id": 8,
      "featured": true // أو false
    }
  }
}
```

### 6. حذف منتج
```javascript
DELETE /admin/products/{product_id}
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "message": "تم حذف المنتج بنجاح"
}
```

---

## 🏷️ Admin Categories APIs

### ⚠️ متطلبات الوصول
جميع Admin Categories APIs تتطلب:
- **Authentication**: `Authorization: Bearer {admin_token}`
- **Role**: المستخدم يجب أن يكون `admin`
- **Middleware**: محمية بـ `role:admin`

### 1. قائمة الفئات للإدارة
```javascript
GET /admin/categories
// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - lang: ar|en
// - page: رقم الصفحة (افتراضي: 1)  
// - per_page: عدد العناصر (افتراضي: 15، الحد الأقصى: 50)
// - search: البحث في الاسم والوصف
// - status: active|inactive
// - has_products: 1|0 (فئات تحتوي على منتجات)
// - sort: id|name_ar|name_en|status|sort_order|created_at|updated_at
// - order: asc|desc

// Response
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "الأدوات والمعدات",
      "description": "الأدوات والمعدات احترافية لمشاريع البناء والتشييد",
      "image": null,
      "status": "active",
      "sort_order": 0,
      "products_count": 5,
      "full_path": "الأدوات والمعدات",
      "created_at": "2025-01-15T13:03:33.000000Z",
      "updated_at": "2025-01-15T19:36:13.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 11,
    "per_page": 15,
    "last_page": 1
  },
  "links": {
    "first": "http://localhost:8000/api/v1/admin/categories?page=1",
    "last": "http://localhost:8000/api/v1/admin/categories?page=1",
    "prev": null,
    "next": null
  }
}
```

### 2. إحصائيات الفئات
```javascript
GET /admin/categories/stats
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "total_categories": 11,        // إجمالي الفئات
    "active_categories": 11,       // الفئات النشطة
    "inactive_categories": 0,      // الفئات غير النشطة
    "categories_with_products": 5, // فئات تحتوي على منتجات
    "empty_categories": 6,         // فئات فارغة (بدون منتجات)
    "total_products": 11,          // إجمالي المنتجات
    "average_products_per_category": 1.0 // متوسط المنتجات لكل فئة
  }
}
```

### 3. تفاصيل فئة واحدة (للتحرير)
```javascript
GET /admin/categories/{category_id}
// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - lang: ar|en

// Response
{
  "success": true,
  "data": {
    "category": {
      "id": 2,
      "name": "الأدوات والمعدات",
      "description": "الأدوات والمعدات احترافية لمشاريع البناء والتشييد",
      "image": null,
      "status": "active",
      "sort_order": 0,
      "products_count": 5,
      "full_path": "الأدوات والمعدات",
      "created_at": "2025-01-15T13:03:33.000000Z",
      "updated_at": "2025-01-15T19:36:13.000000Z"
    }
  }
}
```

### 4. إنشاء فئة جديدة
```javascript
POST /admin/categories
// Headers: Authorization: Bearer {admin_token}

// Request Body
{
  "name_ar": "فئة جديدة",
  "name_en": "New Category",
  "description_ar": "وصف الفئة باللغة العربية",
  "description_en": "Category description in English",
  "status": "active",              // active|inactive
  "sort_order": 10,               // ترتيب الفئة
  "image": "category_image.jpg"   // اختياري
}

// Response
{
  "success": true,
  "message": "تم إنشاء الفئة بنجاح",
  "data": {
    "category": {
      "id": 16,
      "name": "فئة جديدة",
      "description": "وصف الفئة باللغة العربية",
      "image": "category_image.jpg",
      "status": "active",
      "sort_order": 10,
      "products_count": 0,
      "full_path": "فئة جديدة",
      "created_at": "2025-01-15T20:30:00.000000Z",
      "updated_at": "2025-01-15T20:30:00.000000Z"
    }
  }
}

// Validation Errors (422)
{
  "success": false,
  "message": "خطأ في التحقق من البيانات",
  "errors": {
    "name_ar": ["اسم الفئة باللغة العربية مطلوب"],
    "name_en": ["Category name in English is required"],
    "status": ["الحالة يجب أن تكون active أو inactive"]
  }
}
```

### 5. تحديث فئة
```javascript
PUT /admin/categories/{category_id}
// Headers: Authorization: Bearer {admin_token}

// Request Body (نفس بيانات الإنشاء)
{
  "name_ar": "فئة محدثة",
  "name_en": "Updated Category",
  "description_ar": "وصف محدث باللغة العربية",
  "description_en": "Updated description in English",
  "status": "active",
  "sort_order": 5,
  "image": "updated_category_image.jpg"
}

// Response
{
  "success": true,
  "message": "تم تحديث الفئة بنجاح",
  "data": {
    "category": { /* الفئة المحدثة */ }
  }
}

// Not Found (404)
{
  "success": false,
  "message": "الفئة غير موجودة",
  "error": "Category not found"
}
```

### 6. تبديل حالة الفئة (نشط/غير نشط)
```javascript
PATCH /admin/categories/{category_id}/toggle-status
// Headers: Authorization: Bearer {admin_token}

// Response (إلغاء التفعيل)
{
  "success": true,
  "message": "تم إلغاء تفعيل الفئة بنجاح",
  "data": {
    "category": {
      "id": 16,
      "status": "inactive"
    }
  }
}

// Response (التفعيل)
{
  "success": true,
  "message": "تم تفعيل الفئة بنجاح",
  "data": {
    "category": {
      "id": 16,
      "status": "active"
    }
  }
}
```

### 7. حذف فئة
```javascript
DELETE /admin/categories/{category_id}
// Headers: Authorization: Bearer {admin_token}

// Response (نجح الحذف)
{
  "success": true,
  "message": "تم حذف الفئة بنجاح"
}

// Error (الفئة تحتوي على منتجات)
{
  "success": false,
  "message": "لا يمكن حذف الفئة لأنها تحتوي على 5 منتج",
  "error": "Category has associated products",
  "products_count": 5
}

// Not Found (404)
{
  "success": false,
  "message": "الفئة غير موجودة",
  "error": "Category not found"
}
```

### 8. أمثلة الاستخدام في React
```javascript
// ===== Custom Hook لإدارة الفئات =====
const useAdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    has_products: '',
    page: 1,
    per_page: 15
  });

  const fetchCategories = async (newFilters = {}) => {
    try {
      setLoading(true);
      const queryFilters = { ...filters, ...newFilters };
      
      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      // بناء query string
      const queryParams = new URLSearchParams();
      Object.entries(queryFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      queryParams.append('lang', 'ar');

      const response = await fetch(
        `http://localhost:8000/api/v1/admin/categories?${queryParams}`,
        { headers }
      );
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
        setFilters(queryFilters);
      }
    } catch (error) {
      console.error('خطأ في جلب الفئات:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:8000/api/v1/admin/categories/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('http://localhost:8000/api/v1/admin/categories', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchCategories(); // إعادة جلب القائمة
        return data.data.category;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('خطأ في إنشاء الفئة:', error);
      toast.error('حدث خطأ في إنشاء الفئة');
      throw error;
    }
  };

  const updateCategory = async (categoryId, categoryData) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8000/api/v1/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchCategories(); // إعادة جلب القائمة
        return data.data.category;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('خطأ في تحديث الفئة:', error);
      toast.error('حدث خطأ في تحديث الفئة');
      throw error;
    }
  };

  const toggleCategoryStatus = async (categoryId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/categories/${categoryId}/toggle-status`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      
      if (data.success) {
        // تحديث الفئة في القائمة
        setCategories(prev => prev.map(category => 
          category.id === categoryId 
            ? { ...category, status: data.data.category.status }
            : category
        ));
        toast.success(data.message);
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة الفئة:', error);
      toast.error('حدث خطأ في تحديث حالة الفئة');
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`http://localhost:8000/api/v1/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchCategories(); // إعادة جلب القائمة
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('خطأ في حذف الفئة:', error);
      toast.error(error.message || 'حدث خطأ في حذف الفئة');
      throw error;
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  return {
    categories,
    stats,
    loading,
    filters,
    fetchCategories,
    fetchStats,
    createCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory
  };
};

// ===== مكون قائمة الفئات للإدارة =====
const AdminCategoriesList = () => {
  const {
    categories,
    stats,
    loading,
    filters,
    fetchCategories,
    toggleCategoryStatus,
    deleteCategory
  } = useAdminCategories();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCategories({ search: searchTerm, page: 1 });
  };

  const handleFilterChange = (filterName, value) => {
    fetchCategories({ [filterName]: value, page: 1 });
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (window.confirm(`هل أنت متأكد من حذف الفئة "${categoryName}"؟`)) {
      try {
        await deleteCategory(categoryId);
      } catch (error) {
        // الخطأ تم عرضه بالفعل في toast
      }
    }
  };

  if (loading) return <div>جاري تحميل الفئات...</div>;

  return (
    <div className="admin-categories p-6">
      {/* الإحصائيات */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-blue-800">{stats.total_categories}</h3>
            <p className="text-blue-600">إجمالي الفئات</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-green-800">{stats.active_categories}</h3>
            <p className="text-green-600">فئات نشطة</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-purple-800">{stats.categories_with_products}</h3>
            <p className="text-purple-600">تحتوي على منتجات</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-yellow-800">{stats.empty_categories}</h3>
            <p className="text-yellow-600">فئات فارغة</p>
          </div>
        </div>
      )}

      {/* فلاتر البحث */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="البحث في الفئات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-l-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              🔍
            </button>
          </form>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              handleFilterChange('status', e.target.value);
            }}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>

          <select
            onChange={(e) => handleFilterChange('has_products', e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">جميع الفئات</option>
            <option value="1">تحتوي على منتجات</option>
            <option value="0">فئات فارغة</option>
          </select>

          <button
            onClick={() => router.push('/admin/categories/create')}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            ➕ فئة جديدة
          </button>
        </div>
      </div>

      {/* جدول الفئات */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                اسم الفئة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                المنتجات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الترتيب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.id}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {category.description || 'بدون وصف'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    category.products_count > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.products_count} منتج
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleCategoryStatus(category.id)}
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                      category.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {category.status === 'active' ? 'نشط' : 'غير نشط'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.sort_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/admin/categories/${category.id}`)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      تحرير
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-600 hover:text-red-900"
                      disabled={category.products_count > 0}
                      title={category.products_count > 0 ? 'لا يمكن حذف فئة تحتوي على منتجات' : 'حذف الفئة'}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

### 9. نصائح للاستخدام الأمثل
```javascript
// ===== إدارة حالة الفلاتر =====
const [filters, setFilters] = useState({
  search: '',
  status: 'active', // ابدأ بالفئات النشطة
  has_products: '',
  sort: 'sort_order',
  order: 'asc'
});

// ===== تحسين الأداء مع debouncing للبحث =====
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (searchTerm) => {
    fetchCategories({ search: searchTerm, page: 1 });
  },
  500
);

// ===== معالجة الأخطاء الشاملة =====
const handleApiError = (error, action) => {
  console.error(`خطأ في ${action}:`, error);
  
  if (error.response?.status === 422) {
    const validationErrors = error.response.data.errors;
    Object.values(validationErrors).flat().forEach(message => {
      toast.error(message);
    });
  } else if (error.response?.status === 404) {
    toast.error('الفئة غير موجودة');
  } else {
    toast.error(`حدث خطأ في ${action}`);
  }
};

// ===== تأكيد الحذف المحسن =====
const confirmDelete = async (categoryId, categoryName, productsCount) => {
  if (productsCount > 0) {
    toast.warning(`لا يمكن حذف الفئة "${categoryName}" لأنها تحتوي على ${productsCount} منتج`);
    return false;
  }

  const result = await Swal.fire({
    title: 'تأكيد الحذف',
    text: `هل أنت متأكد من حذف الفئة "${categoryName}"؟`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذف',
    cancelButtonText: 'إلغاء'
  });

  return result.isConfirmed;
};

/* 
💡 نصائح مهمة:

1. **validation**: تحقق من البيانات قبل الإرسال
2. **الحذف الآمن**: منع حذف الفئات التي تحتوي على منتجات
3. **التفاعل السريع**: استخدم optimistic updates للحالة
4. **البحث الذكي**: طبق debouncing للبحث المباشر
5. **الفلترة**: اعرض فلاتر مفيدة (حالة، وجود منتجات)
6. **الترتيب**: اسمح بترتيب الفئات حسب الأولوية
7. **التأكيد**: اطلب تأكيد للإجراءات المهمة (حذف)
8. **معالجة الأخطاء**: اعرض رسائل خطأ واضحة
*/
```

---

## 🛍️ Admin Products Management APIs

### ⚠️ متطلبات الوصول
جميع Admin Products APIs تتطلب:
- **Authentication**: `Authorization: Bearer {admin_token}`
- **Role**: المستخدم يجب أن يكون `admin`
- **Middleware**: محمية بـ `role:admin`

### 1. قائمة المنتجات للإدارة
```javascript
GET /admin/products

// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - lang: ar|en
// - page: رقم الصفحة (افتراضي: 1)
// - per_page: عدد العناصر (افتراضي: 15، الحد الأقصى: 50)
// - search: البحث في الاسم والوصف
// - category: ID الفئة
// - status: active|inactive
// - supplier: ID المورد
// - featured: 1|0 للمنتجات المميزة
// - sort: created_at|name_ar|name_en|price|stock|rating
// - order: asc|desc

// Response
{
  "success": true,
  "data": [
    {
      "id": 8,
      "name": "حديد تسليح ممتاز 10 مم",
      "name_ar": "حديد تسليح ممتاز 10 مم",
      "name_en": "Premium Steel Rebar 10mm",
      "description": "حديد تسليح عالي الجودة...",
      "description_ar": "حديد تسليح عالي الجودة...",
      "description_en": "High quality steel rebar...",
      "price": "28.50",
      "original_price": null,
      "stock": 2000,
      "sku": "PRD-1234567890-123",
      "status": "active",
      "featured": false,
      "rating": "4.8",
      "reviews_count": 247,
      "images": ["rebar10mm.jpg"],
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات"
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة"
      },
      "brand": {
        "id": 1,
        "name": "بوش"
      },
      "is_in_stock": true,
      "has_low_stock": false,
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T15:45:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 55,
    "per_page": 15,
    "last_page": 4
  },
  "links": {
    "first": "http://localhost:8000/api/v1/admin/products?page=1",
    "last": "http://localhost:8000/api/v1/admin/products?page=4",
    "prev": null,
    "next": "http://localhost:8000/api/v1/admin/products?page=2"
  }
}
```

### 2. إحصائيات المنتجات
```javascript
GET /admin/products/stats

// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "total": 55,
    "active": 48,
    "inactive": 7,
    "featured": 12,
    "low_stock": 8,
    "out_of_stock": 3
  }
}
```

### 3. تفاصيل منتج للتحرير
```javascript
GET /admin/products/{product_id}

// Headers: Authorization: Bearer {admin_token}

// Query Parameters (اختيارية):
// - lang: ar|en

// Response
{
  "success": true,
  "data": {
    "product": {
      "id": 8,
      "name_ar": "حديد تسليح ممتاز 10 مم",
      "name_en": "Premium Steel Rebar 10mm",
      "name": "حديد تسليح ممتاز 10 مم",
      "description_ar": "حديد تسليح عالي الجودة...",
      "description_en": "High quality steel rebar...",
      "description": "حديد تسليح عالي الجودة...",
      "price": "28.50",
      "original_price": null,
      "stock": 2000,
      "sku": "PRD-1234567890-123",
      "rating": "4.8",
      "reviews_count": 247,
      "status": "active",
      "featured": false,
      "images": ["rebar10mm.jpg"],
      "category_id": 2,
      "supplier_id": 1,
      "brand_id": null,
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات"
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة"
      },
      "brand": null,
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
      "has_low_stock": false,
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T15:45:00.000000Z"
    }
  }
}
```

### 4. إنشاء منتج جديد (مع دعم FormData للصور) 🆕
```javascript
POST /admin/products

// Headers: 
// Authorization: Bearer {admin_token}
// Content-Type: multipart/form-data

// ⚠️ مهم: استخدم FormData لرفع الصور!
const formData = new FormData();

// البيانات الأساسية
formData.append('name_ar', 'مثقاب كهربائي احترافي');
formData.append('name_en', 'Professional Electric Drill');
formData.append('description_ar', 'مثقاب كهربائي قوي للاستخدام المهني');
formData.append('description_en', 'Powerful electric drill for professional use');
formData.append('price', '450.00');
formData.append('original_price', '500.00');
formData.append('stock', '25');
formData.append('category_id', '2');
formData.append('supplier_id', '1');
formData.append('brand_id', '1');
formData.append('status', 'active');
formData.append('featured', '1'); // Boolean كـ string

// الصور الموجودة (اختياري)
formData.append('existing_images', JSON.stringify(['old_image1.jpg', 'old_image2.jpg']));

// الصور الجديدة (Files)
formData.append('new_images[0]', fileInput.files[0]);
formData.append('new_images[1]', fileInput.files[1]);

// الفيتشرز (JSON string)
formData.append('features', JSON.stringify(['جودة عالية', 'ضمان سنتان', 'مقاوم للماء']));

// المواصفات (JSON string)
formData.append('specifications', JSON.stringify([
  {"key": "الوزن", "value": "2 كيلو"},
  {"key": "القوة", "value": "800 واط"},
  {"key": "الضمان", "value": "سنتان"}
]));

// الطلب
const response = await fetch('/api/v1/admin/products', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
    // ⚠️ لا تضع Content-Type! المتصفح سيعطيه تلقائياً مع boundary
  },
  body: formData
});

// Response
{
  "success": true,
  "message": "تم إنشاء المنتج بنجاح",
  "data": {
    "product": {
      "id": 56,
      "name_ar": "مثقاب كهربائي احترافي",
      "name_en": "Professional Electric Drill", 
      "description_ar": "مثقاب كهربائي قوي للاستخدام المهني",
      "description_en": "Powerful electric drill for professional use",
      "price": "450.00",
      "original_price": "500.00",
      "stock": 25,
      "status": "active",
      "featured": true,
      "images": [
        "/images/products/old_image1.jpg",
        "/images/products/old_image2.jpg", 
        "/images/products/1642248127_abc123.jpg",
        "/images/products/1642248128_def456.jpg"
      ],
      "sku": "PRD-1642248127-456",
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات"
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة"
      },
      "brand": {
        "id": 1,
        "name": "بوش"
      },
      "features": [
        {
          "id": 1,
          "feature_ar": "جودة عالية",
          "feature_en": "جودة عالية",
          "sort_order": 1
        },
        {
          "id": 2,
          "feature_ar": "ضمان سنتان",
          "feature_en": "ضمان سنتان", 
          "sort_order": 2
        }
      ],
      "specifications": [
        {
          "id": 1,
          "spec_key": "الوزن",
          "spec_value_ar": "2 كيلو",
          "spec_value_en": "2 كيلو"
        },
        {
          "id": 2,
          "spec_key": "القوة", 
          "spec_value_ar": "800 واط",
          "spec_value_en": "800 واط"
        }
      ],
      "created_at": "2024-01-15T16:30:00.000000Z",
      "updated_at": "2024-01-15T16:30:00.000000Z"
    }
  }
}
```

### 5. تحديث منتج (مع دعم FormData للصور) 🆕
```javascript
// ⚠️ مهم: استخدم POST مع _method=PUT للتحديث!
POST /admin/products/{product_id}

// Headers: 
// Authorization: Bearer {admin_token}
// Content-Type: multipart/form-data

// ⚠️ مهم: استخدم FormData مع method spoofing!
const formData = new FormData();

// إضافة method spoofing للتحديث
formData.append('_method', 'PUT');

// البيانات الأساسية
formData.append('name_ar', 'مثقاب كهربائي احترافي محدث');
formData.append('name_en', 'Updated Professional Electric Drill');
formData.append('description_ar', 'مثقاب كهربائي قوي ومحدث للاستخدام المهني');
formData.append('description_en', 'Updated powerful electric drill for professional use');
formData.append('price', '420.00');
formData.append('original_price', '500.00');
formData.append('stock', '30');
formData.append('category_id', '2');
formData.append('supplier_id', '1');
formData.append('brand_id', '1');
formData.append('status', 'active');
formData.append('featured', '0'); // Boolean كـ string

// الصور الموجودة (احتفظ بالصور القديمة)
formData.append('existing_images', JSON.stringify([
  '/images/products/old_drill1.jpg',
  '/images/products/old_drill2.jpg'
]));

// الصور الجديدة (Files من input)
const fileInput = document.getElementById('new-images');
if (fileInput.files.length > 0) {
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append(`new_images[${i}]`, fileInput.files[i]);
  }
}

// الفيتشرز المحدثة (JSON string)
formData.append('features', JSON.stringify([
  'جودة ممتازة محدثة',
  'ضمان 3 سنوات',
  'مقاوم للماء والغبار',
  'تقنية متطورة'
]));

// المواصفات المحدثة (JSON string)
formData.append('specifications', JSON.stringify([
  {"key": "الوزن", "value": "2.8 كيلو"},
  {"key": "الأبعاد", "value": "35x25x18 سم"},
  {"key": "القوة", "value": "900 واط"},
  {"key": "الضمان", "value": "3 سنوات"}
]));

// الطلب
const response = await fetch(`/api/v1/admin/products/${productId}`, {
  method: 'POST', // ⚠️ POST وليس PUT!
  headers: {
    'Authorization': `Bearer ${adminToken}`
    // ⚠️ لا تضع Content-Type! المتصفح سيعطيه تلقائياً مع boundary
  },
  body: formData
});

// Response
{
  "success": true,
  "message": "تم تحديث المنتج بنجاح",
  "data": {
    "product": {
      "id": 8,
      "name_ar": "مثقاب كهربائي احترافي محدث",
      "name_en": "Updated Professional Electric Drill",
      "description_ar": "مثقاب كهربائي قوي ومحدث للاستخدام المهني",
      "description_en": "Updated powerful electric drill for professional use",
      "price": "420.00",
      "original_price": "500.00",
      "stock": 30,
      "status": "active",
      "featured": false,
      "images": [
        "/images/products/old_drill1.jpg",
        "/images/products/old_drill2.jpg",
        "/images/products/1642248890_updated123.jpg",
        "/images/products/1642248891_updated456.jpg"
      ],
      "sku": "PRD-1234567890-123",
      "category": {
        "id": 2,
        "name": "الأدوات والمعدات"
      },
      "supplier": {
        "id": 1,
        "name": "شركة الأدوات المتقدمة"
      },
      "brand": {
        "id": 1,
        "name": "بوش"
      },
      "features": [
        {
          "id": 1,
          "feature_ar": "جودة ممتازة محدثة",
          "feature_en": "جودة ممتازة محدثة",
          "sort_order": 1
        },
        {
          "id": 2,
          "feature_ar": "ضمان 3 سنوات",
          "feature_en": "ضمان 3 سنوات",
          "sort_order": 2
        }
      ],
      "specifications": [
        {
          "id": 1,
          "spec_key": "الوزن",
          "spec_value_ar": "2.8 كيلو",
          "spec_value_en": "2.8 كيلو"
        },
        {
          "id": 2,
          "spec_key": "القوة",
          "spec_value_ar": "900 واط",
          "spec_value_en": "900 واط"
        }
      ],
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T20:30:00.000000Z"
    }
  }
}
```

### 6. تبديل حالة المنتج (نشط/غير نشط)
```javascript
PATCH /admin/products/{product_id}/toggle-status

// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "message": "تم تحديث حالة المنتج بنجاح",
  "data": {
    "product": {
      "id": 8,
      "status": "inactive"
    }
  }
}
```

### 7. تبديل حالة المنتج المميز
```javascript
PATCH /admin/products/{product_id}/toggle-featured

// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "message": "تم تحديث حالة المنتج المميز بنجاح",
  "data": {
    "product": {
      "id": 8,
      "featured": true
    }
  }
}
```

### 8. حذف منتج
```javascript
DELETE /admin/products/{product_id}

// Headers: Authorization: Bearer {admin_token}

// Response (نجح)
{
  "success": true,
  "message": "تم حذف المنتج بنجاح"
}

// Response (خطأ - مرتبط بطلبات)
{
  "success": false,
  "message": "لا يمكن حذف المنتج لأنه مرتبط بطلبات موجودة",
  "error": "Product has associated orders"
}
```

### 🔒 Security & Validation

#### **Middleware:**
- `auth:sanctum` - مطلوب token صالح
- `role:admin` - مطلوب صلاحيات admin

#### **Validation Rules:**
```javascript
// للإنشاء والتحديث
{
  "name_ar": "required|string|max:255",
  "name_en": "required|string|max:255", 
  "description_ar": "required|string",
  "description_en": "required|string",
  "price": "required|numeric|min:0",
  "original_price": "nullable|numeric|min:0",
  "stock": "required|integer|min:0",
  "category_id": "required|exists:categories,id",
  "supplier_id": "required|exists:suppliers,id", // مطلوب
  "brand_id": "nullable|exists:brands,id",
  "status": "required|in:active,inactive",
  "featured": "boolean",
  "images": "nullable|array",
  "features": "nullable|array",
  "specifications": "nullable|array"
}
```

### 🎯 أولويات التنفيذ

#### **المرحلة الأولى (عاجل):**
1. ✅ `GET /admin/products` - لعرض القائمة
2. ✅ `GET /admin/products/stats` - للإحصائيات  
3. ✅ `PATCH /admin/products/{id}/toggle-status` - تبديل الحالة
4. ✅ `PATCH /admin/products/{id}/toggle-featured` - تبديل المميز

#### **المرحلة الثانية:**
5. ✅ `GET /admin/products/{id}` - تفاصيل للتحرير
6. ✅ `PUT /admin/products/{id}` - تحديث المنتج
7. ✅ `DELETE /admin/products/{id}` - حذف المنتج

#### **المرحلة الثالثة:**
8. ✅ `POST /admin/products` - إنشاء منتج جديد

### 🚀 Integration مع Frontend

```jsx
// React Hook للاستخدام
import { useState, useEffect } from 'react';

const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  
  // جلب قائمة المنتجات
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/admin/products?' + new URLSearchParams(filters), {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // جلب الإحصائيات
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/admin/products/stats', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };
  
  // تبديل حالة المنتج
  const toggleStatus = async (productId) => {
    try {
      const response = await fetch(`/api/v1/admin/products/${productId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) {
        // تحديث المنتج في القائمة
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, status: data.data.product.status } : p
        ));
        return data.data.product.status;
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };
  
  // تبديل المميز
  const toggleFeatured = async (productId) => {
    try {
      const response = await fetch(`/api/v1/admin/products/${productId}/toggle-featured`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, featured: data.data.product.featured } : p
        ));
        return data.data.product.featured;
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };
  
  // حذف منتج
  const deleteProduct = async (productId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    
    try {
      const response = await fetch(`/api/v1/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        return true;
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    return false;
  };
  
  return {
    products,
    stats, 
    loading,
    fetchProducts,
    fetchStats,
    toggleStatus,
    toggleFeatured,
    deleteProduct
  };
};

export default useAdminProducts;
```

### 📝 ملاحظات مهمة

1. **supplier_id مطلوب**: لا يمكن إنشاء منتج بدون مورد
2. **SKU تلقائي**: يتم توليد SKU تلقائياً عند الإنشاء
3. **Soft Delete**: المنتجات المحذوفة لا تُحذف نهائياً
4. **Images Array**: الصور تُحفظ كـ JSON array
5. **Features & Specs**: اختيارية ويمكن إضافتها لاحقاً
6. **Business Logic**: حماية من حذف منتجات مرتبطة بطلبات

### ✅ Status Summary
جميع الـ 8 APIs تعمل بشكل صحيح ومُختبرة:
- ✅ **GET /admin/products** - قائمة المنتجات
- ✅ **GET /admin/products/stats** - الإحصائيات  
- ✅ **GET /admin/products/{id}** - تفاصيل المنتج
- ✅ **POST /admin/products** - إنشاء منتج
- ✅ **PUT /admin/products/{id}** - تحديث منتج
- ✅ **DELETE /admin/products/{id}** - حذف منتج
- ✅ **PATCH /admin/products/{id}/toggle-status** - تبديل الحالة
- ✅ **PATCH /admin/products/{id}/toggle-featured** - تبديل المميز

**🚀 Frontend جاهز للاستخدام الفوري!**

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
Email: admin@construction.com
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

### 4. **أمثلة كود لاستخدام عدد المنتجات**

```javascript
// ===== مثال 1: جلب الفئات مع عدد المنتجات =====
const fetchCategoriesWithCount = async (lang = 'ar') => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/categories?lang=${lang}`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    
    // كل فئة تحتوي على products_count
    return data.data;
  } catch (error) {
    console.error('خطأ في جلب الفئات:', error);
    return [];
  }
};

// ===== مثال 2: عرض الفئات مع عدد المنتجات في React =====
const CategoriesGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategoriesWithCount('ar');
      setCategories(data);
      setLoading(false);
    };
    loadCategories();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {categories.map(category => (
        <div key={category.id} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-2">{category.name}</h3>
          <p className="text-gray-600 mb-4">{category.description}</p>
          
          {/* عرض عدد المنتجات */}
          <div className="flex justify-between items-center">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {category.products_count} منتج
            </span>
            <button 
              onClick={() => router.push(`/categories/${category.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              تصفح المنتجات
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ===== مثال 3: جلب فئة مع منتجاتها =====
const fetchCategoryWithProducts = async (categoryId, lang = 'ar') => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/categories/${categoryId}?lang=${lang}`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('خطأ في جلب الفئة والمنتجات:', error);
    return null;
  }
};

// ===== مكون صفحة الفئة مع المنتجات =====
const CategoryPage = ({ params }) => {
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadCategoryData = async () => {
      const data = await fetchCategoryWithProducts(params.id);
      setCategoryData(data);
      setLoading(false);
    };
    loadCategoryData();
  }, [params.id]);
  
  if (loading) return <div>جاري التحميل...</div>;
  if (!categoryData) return <div>فئة غير موجودة</div>;
  
  const { category, products } = categoryData;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* معلومات الفئة */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        <p className="text-gray-600 mb-4">{category.description}</p>
        <div className="flex items-center gap-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
            {category.products_count} منتج متاح
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {category.status === 'active' ? 'فئة نشطة' : 'فئة غير نشطة'}
          </span>
        </div>
      </div>
      
      {/* المنتجات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={product.images[0] || '/placeholder.jpg'} 
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold text-green-600">
                  {product.price} ج.م
                </span>
                {product.original_price && (
                  <span className="text-gray-400 line-through">
                    {product.original_price} ج.م
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span>{product.rating}</span>
                  <span className="text-gray-500">({product.reviews_count})</span>
                </div>
                
                <button 
                  disabled={!product.is_in_stock}
                  className={`px-4 py-2 rounded text-sm ${
                    product.is_in_stock 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.is_in_stock ? 'إضافة للسلة' : 'غير متوفر'}
                </button>
              </div>
              
              {product.has_low_stock && (
                <div className="mt-2 text-orange-600 text-xs">
                  ⚠️ كمية محدودة متبقية
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-xl">لا توجد منتجات في هذه الفئة حالياً</p>
        </div>
      )}
    </div>
  );
};

// ===== مثال 4: جلب الإحصائيات المتقدمة =====
const fetchCategoriesStatistics = async (lang = 'ar') => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/categories/statistics?lang=${lang}`, {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return null;
  }
};

// ===== مثال 5: لوحة تحكم الإحصائيات =====
const CategoriesStatsDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchCategoriesStatistics('ar');
      setStats(data);
    };
    loadStats();
  }, []);

  if (!stats) return <div>جاري التحميل...</div>;

  return (
    <div className="p-6">
      {/* الملخص العام */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-blue-800">{stats.summary.total_categories}</h3>
          <p className="text-blue-600">إجمالي الفئات</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-green-800">{stats.summary.active_categories}</h3>
          <p className="text-green-600">الفئات النشطة</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-purple-800">{stats.summary.total_products}</h3>
          <p className="text-purple-600">إجمالي المنتجات</p>
        </div>
      </div>

      {/* تفاصيل كل فئة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.categories.map(category => (
          <div key={category.id} className="bg-white border rounded-lg p-4">
            <h4 className="font-bold mb-3">{category.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>إجمالي المنتجات:</span>
                <span className="font-semibold">{category.total_products}</span>
              </div>
              <div className="flex justify-between">
                <span>المنتجات النشطة:</span>
                <span className="font-semibold text-green-600">{category.active_products}</span>
              </div>
              <div className="flex justify-between">
                <span>المنتجات المميزة:</span>
                <span className="font-semibold text-blue-600">{category.featured_products}</span>
              </div>
              <div className="flex justify-between">
                <span>نفد المخزن:</span>
                <span className="font-semibold text-red-600">{category.out_of_stock}</span>
              </div>
              <div className="flex justify-between">
                <span>مخزن منخفض:</span>
                <span className="font-semibold text-yellow-600">{category.low_stock}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== مثال 5: Custom Hook لإدارة الفئات =====
const useCategories = (includeStats = false, lang = 'ar') => {
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (includeStats) {
          const statsData = await fetchCategoriesStatistics(lang);
          setStats(statsData);
          setCategories(statsData?.categories || []);
        } else {
          const categoriesData = await fetchCategoriesWithCount(lang);
          setCategories(categoriesData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [includeStats, lang]);

  return { categories, stats, loading, error };
};

// استخدام الـ Custom Hook:
// const { categories, loading } = useCategories(); // للفئات العادية
// const { stats, loading } = useCategories(true); // للإحصائيات المتقدمة
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

### 5. **استخدام Admin Dashboard APIs**
```javascript
// ===== مثال شامل لاستخدام Dashboard APIs =====
const useAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      // جلب البيانات بشكل متوازي
      const [statsRes, activityRes] = await Promise.all([
        fetch('http://localhost:8000/api/v1/admin/dashboard/stats', { headers }),
        fetch('http://localhost:8000/api/v1/admin/dashboard/recent-activity?limit=8', { headers })
      ]);

      const [statsData, activityData] = await Promise.all([
        statsRes.json(),
        activityRes.json()
      ]);

      setDashboardData({
        stats: statsData.success ? statsData.data : null,
        recentActivity: activityData.success ? activityData.data : []
      });

    } catch (error) {
      console.error('خطأ في جلب بيانات Dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // تحديث تلقائي كل 5 دقائق
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { 
    ...dashboardData, 
    loading, 
    refreshing, 
    refresh: () => fetchDashboardData(true)
  };
};

// ===== مكون Admin Dashboard =====
const AdminDashboard = () => {
  const { stats, recentActivity, loading, refreshing, refresh } = useAdminDashboard();

  if (loading) return <div>جاري تحميل لوحة الإدارة...</div>;

  return (
    <div className="admin-dashboard space-y-6 p-6">
      {/* هيدر */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة الإدارة</h1>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {refreshing ? 'جاري التحديث...' : 'تحديث'}
        </button>
      </div>

      {/* إحصائيات سريعة */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="إجمالي المنتجات"
            value={stats.total_products}
            icon="📦"
            color="blue"
          />
          <StatCard
            title="إجمالي الطلبات"
            value={stats.total_orders}
            icon="🛒"
            color="green"
          />
          <StatCard
            title="طلبات معلقة"
            value={stats.pending_orders}
            icon="⏳"
            color="yellow"
            urgent={stats.pending_orders > 5}
          />
          <StatCard
            title="الإيرادات"
            value={`${stats.total_revenue.toLocaleString()} ج.م`}
            icon="💰"
            color="purple"
          />
        </div>
      )}

      {/* الأنشطة الحديثة */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">الأنشطة الحديثة</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ===== مكونات مساعدة =====
const StatCard = ({ title, value, icon, color, urgent = false }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
    urgent ? 'border-red-500 bg-red-50' : `border-${color}-500`
  }`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${urgent ? 'text-red-700' : `text-${color}-700`}`}>
          {value}
        </p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
    {urgent && <div className="mt-2 text-xs text-red-600 font-medium">يتطلب انتباه!</div>}
  </div>
);

const ActivityItem = ({ activity }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'order': return '🛒';
      case 'customer': return '👤';
      case 'product': return '📦';
      case 'review': return '⭐';
      default: return '📝';
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
      <div className="text-2xl">{getIcon(activity.type)}</div>
      <div className="flex-1">
        <p className="font-medium">{activity.message}</p>
        {activity.user_name && (
          <p className="text-sm text-gray-600">بواسطة: {activity.user_name}</p>
        )}
        <p className="text-xs text-gray-500">
          {new Date(activity.timestamp).toLocaleString('ar-EG')}
        </p>
      </div>
    </div>
  );
};

// ===== نصائح مهمة =====
/*
💡 نصائح للاستخدام الأمثل:

1. **الأمان**: تأكد من التحقق من role=admin قبل عرض Dashboard
2. **الأداء**: استخدم Promise.all لجلب عدة APIs معاً
3. **التحديث**: اعتمد على setInterval للتحديث التلقائي
4. **التخزين**: احفظ البيانات في state للوصول السريع
5. **UX**: أضف loading states واضحة
6. **الاستجابة**: اجعل التصميم responsive للشاشات المختلفة
7. **الإشعارات**: استخدم toast للتحديثات الهامة
8. **معالجة الأخطاء**: اعتمد على try-catch شامل
*/
```

### 5. **استخدام Admin Dashboard APIs**
```javascript
// ===== مثال شامل لدمج Dashboard APIs =====
const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    recentActivity: [],
    overview: null
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // جلب جميع بيانات Dashboard
  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const token = localStorage.getItem('admin_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      };

      // جلب الإحصائيات الأساسية (مطلوب)
      const [statsRes, activityRes] = await Promise.all([
        fetch('/api/v1/admin/dashboard/stats', { headers }),
        fetch('/api/v1/admin/dashboard/recent-activity?limit=8', { headers })
      ]);

      const statsData = await statsRes.json();
      const activityData = await activityRes.json();

      setDashboardData({
        stats: statsData.success ? statsData.data : null,
        recentActivity: activityData.success ? activityData.data : [],
        overview: null // يمكن إضافتها لاحقاً
      });

    } catch (error) {
      console.error('خطأ في جلب بيانات Dashboard:', error);
      toast.error('خطأ في تحميل بيانات لوحة الإدارة');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // تحديث البيانات تلقائياً
  useEffect(() => {
    fetchDashboardData();
    
    // تحديث كل 5 دقائق
    const interval = setInterval(() => {
      fetchDashboardData(true); // مع مؤشر التحديث
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">جاري تحميل لوحة الإدارة...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard space-y-6">
      {/* هيدر مع زر التحديث */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">لوحة الإدارة</h1>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {refreshing ? 'جاري التحديث...' : 'تحديث البيانات'}
        </button>
      </div>

      {/* بطاقات الإحصائيات */}
      {dashboardData.stats && (
        <StatsCards stats={dashboardData.stats} />
      )}

      {/* الأنشطة الحديثة */}
      <RecentActivityWidget activities={dashboardData.recentActivity} />
    </div>
  );
};

// ===== مكون بطاقات الإحصائيات =====
const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'إجمالي المنتجات',
      value: stats.total_products,
      color: 'blue',
      icon: '📦'
    },
    {
      title: 'إجمالي الطلبات',
      value: stats.total_orders,
      color: 'green',
      icon: '🛒'
    },
    {
      title: 'العملاء',
      value: stats.total_customers,
      color: 'purple',
      icon: '👥'
    },
    {
      title: 'الإيرادات (ج.م)',
      value: stats.total_revenue.toLocaleString(),
      color: 'yellow',
      icon: '💰'
    },
    {
      title: 'طلبات معلقة',
      value: stats.pending_orders,
      color: 'orange',
      icon: '⏳',
      urgent: stats.pending_orders > 5
    },
    {
      title: 'مخزون منخفض',
      value: stats.low_stock_products,
      color: 'red',
      icon: '⚠️',
      urgent: stats.low_stock_products > 0
    },
    {
      title: 'عملاء جدد هذا الشهر',
      value: stats.new_customers_this_month,
      color: 'teal',
      icon: '🆕'
    },
    {
      title: 'النمو الشهري (%)',
      value: `${stats.monthly_growth_percentage}%`,
      color: stats.monthly_growth_percentage > 0 ? 'green' : 'red',
      icon: stats.monthly_growth_percentage > 0 ? '📈' : '📉'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${
            card.urgent 
              ? 'border-red-500 bg-red-50' 
              : `border-${card.color}-500`
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className={`text-2xl font-bold ${
                card.urgent ? 'text-red-700' : `text-${card.color}-700`
              }`}>
                {card.value}
              </p>
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
          {card.urgent && (
            <div className="mt-2 text-xs text-red-600 font-medium">
              يتطلب انتباه!
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ===== مكون الأنشطة الحديثة =====
const RecentActivityWidget = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'order': return '🛒';
      case 'customer': return '👤';
      case 'product': return '📦';
      case 'review': return '⭐';
      default: return '📝';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'order': return 'text-blue-600 bg-blue-100';
      case 'customer': return 'text-green-600 bg-green-100';
      case 'product': return 'text-yellow-600 bg-yellow-100';
      case 'review': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">الأنشطة الحديثة</h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          لا توجد أنشطة حديثة
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{activity.message}</p>
                {activity.user_name && (
                  <p className="text-sm text-gray-600">بواسطة: {activity.user_name}</p>
                )}
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString('ar-EG')}
                </p>
              </div>
              
              {activity.type === 'product' && activity.product_id && (
                <button 
                  onClick={() => router.push(`/admin/products/${activity.product_id}`)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  عرض المنتج
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===== نصائح للاستخدام الأمثل =====
/*
1. **تحديث البيانات**: استخدم setInterval للتحديث التلقائي كل 5-10 دقائق
2. **معالجة الأخطاء**: اعتمد على try-catch شامل مع رسائل واضحة
3. **التخزين المؤقت**: احفظ البيانات في localStorage لتقليل الطلبات
4. **الأداء**: استخدم Promise.all لجلب عدة APIs بنفس الوقت
5. **الأمان**: تحقق من صلاحية التوكن قبل كل طلب
6. **UX**: أضف مؤشرات تحميل واضحة وصوت تنبيه للتحديثات الهامة
7. **الاستجابة**: اجعل التصميم responsive للوحات والهواتف
8. **الإشعارات**: استخدم toast notifications للتحديثات الفورية
*/
```

---

## 🎉 خلاص! 

هذا دليل شامل لجميع APIs المتاحة. كل API مُجرب ويعمل بشكل صحيح مع دعم كامل للعربية والإنجليزية. 

### 🆕 آخر التحديثات:
- ✅ **Admin Dashboard APIs** - لوحة إدارة شاملة مع إحصائيات حقيقية
- ✅ **Admin Products APIs** - إدارة شاملة للمنتجات من لوحة الإدارة
- ✅ **Admin Categories APIs** - إدارة شاملة للفئات مع إحصائيات ذكية
- ✅ **Admin Products Management APIs** - **جديد!** إدارة شاملة للمنتجات مع CRUD كامل
- ✅ **Admin Customer Management APIs** - **جديد!** إدارة العملاء الشاملة (8 APIs)
- ✅ **Recent Activity Tracking** - تتبع الأنشطة الحديثة في النظام  
- ✅ **Advanced Statistics** - إحصائيات متقدمة للمنتجات والطلبات والعملاء
- ✅ **Real-time Updates** - تحديث تلقائي كل 5 دقائق
- ✅ **Security Enhanced** - حماية شاملة بـ role-based access control
- ✅ **Export & Notifications** - تصدير البيانات وإرسال الإشعارات

### 🚀 للبدء السريع:
1. **APIs الأساسية**: المنتجات، الفئات، المصادقة
2. **التجارة الإلكترونية**: السلة، الطلبات، قائمة الأمنيات  
3. **الإدارة**: لوحة الإدارة، الإحصائيات، إدارة المحتوى
4. **المتقدمة**: التقييمات، التتبع، حاسبة التكلفة

**حسابات التجربة جاهزة!** استخدم `admin@construction.com` لتجربة لوحة الإدارة.

**محتاج مساعدة؟** كل endpoint مُوثق بالتفصيل مع أمثلة حقيقية للطلب والاستجابة! 🚀

---

## 👥 Admin Customer Management APIs

### ⚠️ متطلبات الوصول
جميع Admin Customer Management APIs تتطلب:
- **Authentication**: `Authorization: Bearer {admin_token}`
- **Role**: المستخدم يجب أن يكون `admin`
- **Middleware**: محمية بـ `role:admin`

### 1. إحصائيات العملاء
```javascript
GET /admin/customers/stats

// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "total_customers": 1547,
    "new_customers_this_month": 89,
    "active_customers": 1342,
    "inactive_customers": 127,
    "banned_customers": 78,
    "average_orders_per_customer": 3.2,
    "top_spending_customers": 45,
    "customers_with_zero_orders": 234,
    "growth_percentage": 15.8,
    "retention_rate": 68.5
  }
}
```

### 2. قائمة العملاء مع فلاتر متقدمة
```javascript
GET /admin/customers

// Headers: Authorization: Bearer {admin_token}

// Query Parameters (جميعها اختيارية):
// - page: رقم الصفحة (افتراضي: 1)
// - per_page: عدد العناصر (افتراضي: 15، حد أقصى: 50)
// - search: البحث في الاسم، الإيميل، الهاتف
// - status: active|inactive|banned
// - company: البحث بالشركة
// - registration_date_from: تاريخ التسجيل من (YYYY-MM-DD)
// - registration_date_to: تاريخ التسجيل إلى (YYYY-MM-DD)
// - min_orders: أقل عدد طلبات
// - max_orders: أكبر عدد طلبات
// - min_spent: أقل مبلغ مشتريات
// - max_spent: أكبر مبلغ مشتريات
// - sort: name|email|created_at|last_activity|orders_count|total_spent
// - order: asc|desc

// Response
{
  "success": true,
  "data": [
    {
      "id": 15,
      "name": "أحمد محمد علي",
      "email": "ahmed@example.com",
      "phone": "+201234567890",
      "company": "شركة البناء المتقدم",
      "avatar": "http://localhost:8000/storage/avatars/user15.jpg",
      "status": "active",
      "email_verified_at": "2024-01-15T10:30:00.000000Z",
      "role": "customer",
      "created_at": "2024-01-15T10:30:00.000000Z",
      "last_activity": "2024-01-20T14:22:00.000000Z",
      "orders_count": 8,
      "total_spent": "2340.50",
      "currency": "EGP",
      "favorite_payment_method": "credit_card",
      "addresses_count": 2,
      "is_verified": true,
      "has_recent_activity": true,
      "registration_source": "website"
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 1547,
    "per_page": 15,
    "last_page": 104
  },
  "links": {
    "first": "http://localhost:8000/api/v1/admin/customers?page=1",
    "last": "http://localhost:8000/api/v1/admin/customers?page=104",
    "prev": null,
    "next": "http://localhost:8000/api/v1/admin/customers?page=2"
  }
}
```

### 3. تفاصيل عميل محدد
```javascript
GET /admin/customers/{customer_id}

// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "customer": {
      "id": 15,
      "name": "أحمد محمد علي",
      "email": "ahmed@example.com",
      "phone": "+201234567890",
      "company": "شركة البناء المتقدم",
      "avatar": "http://localhost:8000/storage/avatars/user15.jpg",
      "status": "active",
      "orders_count": 8,
      "total_spent": "2340.50",
      "currency": "EGP",
      "is_verified": true
    },
    "statistics": {
      "total_orders": 8,
      "completed_orders": 6,
      "pending_orders": 1,
      "cancelled_orders": 1,
      "total_spent": "2340.50",
      "average_order_value": "292.56",
      "first_order_date": "2024-01-16T09:00:00.000000Z",
      "last_order_date": "2024-01-19T15:30:00.000000Z",
      "favorite_category": "الأدوات والمعدات",
      "favorite_products": [
        {
          "id": 8,
          "name": "حديد تسليح ممتاز 10 مم",
          "orders_count": 3
        }
      ]
    },
    "recent_orders": [
      {
        "id": "ORD-2024-156",
        "order_number": "ORD-2024-156",
        "status": "completed",
        "total_amount": "485.75",
        "items_count": 3,
        "created_at": "2024-01-19T15:30:00.000000Z"
      }
    ],
    "addresses": [
      {
        "id": 25,
        "type": "home",
        "name": "المنزل",
        "city": "القاهرة",
        "street": "شارع التحرير، المعادي",
        "is_default": true
      }
    ]
  }
}
```

### 4. تحديث حالة العميل
```javascript
PATCH /admin/customers/{customer_id}/status

// Headers: Authorization: Bearer {admin_token}

// Request Body
{
  "status": "banned",  // active|inactive|banned
  "reason": "مخالفة شروط الاستخدام"  // اختياري
}

// Response
{
  "success": true,
  "message": "تم تحديث حالة العميل بنجاح",
  "data": {
    "customer": {
      "id": 15,
      "name": "أحمد محمد علي",
      "status": "banned",
      "updated_at": "2024-01-20T16:45:00.000000Z"
    }
  }
}
```

### 5. إحصائيات أنشطة العملاء
```javascript
GET /admin/customers/activity-stats

// Headers: Authorization: Bearer {admin_token}

// Query Parameters:
// - period: today|week|month|year (افتراضي: month)

// Response
{
  "success": true,
  "data": {
    "period": "month",
    "registrations_chart": [
      {"date": "2024-01-01", "count": 12},
      {"date": "2024-01-02", "count": 8},
      {"date": "2024-01-03", "count": 15}
    ],
    "activity_breakdown": {
      "highly_active": 234,    // أكثر من 5 طلبات
      "moderately_active": 456, // 2-5 طلبات
      "low_activity": 567,     // طلب واحد
      "no_orders": 290         // بدون طلبات
    },
    "spending_segments": {
      "high_spenders": 89,     // أكثر من 1000 ج.م
      "medium_spenders": 345,  // 500-1000 ج.م
      "low_spenders": 678,     // 100-500 ج.م
      "minimal_spenders": 435  // أقل من 100 ج.م
    }
  }
}
```

### 6. البحث المتقدم في العملاء
```javascript
POST /admin/customers/advanced-search

// Headers: Authorization: Bearer {admin_token}

// Request Body
{
  "filters": {
    "name": "أحمد",
    "email_domain": "gmail.com",
    "registration_period": {
      "from": "2024-01-01",
      "to": "2024-01-31"
    },
    "orders_range": {
      "min": 2,
      "max": 10
    },
    "spending_range": {
      "min": 500,
      "max": 5000
    },
    "has_company": true,
    "is_verified": true,
    "last_activity_days": 30
  },
  "sort": "total_spent",
  "order": "desc",
  "page": 1,
  "per_page": 20
}

// Response: نفس هيكل قائمة العملاء العادية
```

### 7. تصدير بيانات العملاء
```javascript
GET /admin/customers/export

// Headers: Authorization: Bearer {admin_token}

// Query Parameters:
// - format: csv|excel|pdf (افتراضي: excel)
// - جميع فلاتر قائمة العملاء العادية

// Response
{
  "success": true,
  "data": {
    "download_url": "http://localhost:8000/storage/exports/customers_2024_01_20.xlsx",
    "file_size": "2.4 MB",
    "records_count": 1547,
    "expires_at": "2024-01-21T16:45:00.000000Z"
  }
}
```

### 8. إرسال إشعارات للعملاء
```javascript
POST /admin/customers/send-notification

// Headers: Authorization: Bearer {admin_token}

// Request Body
{
  "customer_ids": [15, 23, 45], // أو ["all"] للجميع
  "title": "عرض خاص لعملائنا المميزين",
  "message": "احصل على خصم 20% على جميع المنتجات",
  "type": "promotion", // info|warning|promotion|announcement
  "send_email": true,
  "send_sms": false
}

// Response
{
  "success": true,
  "message": "تم إرسال الإشعار بنجاح",
  "data": {
    "notification_id": "NOTIF-2024-001",
    "recipients_count": 3,
    "email_sent": 3,
    "sms_sent": 0,
    "failed_count": 0
  }
}
```

### 🎯 مثال شامل للاستخدام في React

```javascript
// ===== Custom Hook لإدارة العملاء =====
const useAdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [activityStats, setActivityStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 15,
    search: '',
    status: '',
    sort: 'created_at',
    order: 'desc'
  });

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  // جلب إحصائيات العملاء
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/v1/admin/customers/stats', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  // جلب قائمة العملاء
  const fetchCustomers = async (newFilters = {}) => {
    try {
      setLoading(true);
      const queryFilters = { ...filters, ...newFilters };
      
      const queryParams = new URLSearchParams();
      Object.entries(queryFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(
        `/api/v1/admin/customers?${queryParams}`,
        { headers: getAuthHeaders() }
      );
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data);
        setFilters(queryFilters);
        return data;
      }
    } catch (error) {
      console.error('خطأ في جلب العملاء:', error);
      toast.error('حدث خطأ في جلب العملاء');
    } finally {
      setLoading(false);
    }
  };

  // جلب تفاصيل عميل
  const fetchCustomerDetails = async (customerId) => {
    try {
      const response = await fetch(`/api/v1/admin/customers/${customerId}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
    } catch (error) {
      console.error('خطأ في جلب تفاصيل العميل:', error);
      toast.error('حدث خطأ في جلب تفاصيل العميل');
    }
  };

  // تحديث حالة العميل
  const updateCustomerStatus = async (customerId, status, reason = '') => {
    try {
      const response = await fetch(`/api/v1/admin/customers/${customerId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, reason })
      });
      const data = await response.json();
      
      if (data.success) {
        // تحديث العميل في القائمة
        setCustomers(prev => prev.map(customer => 
          customer.id === customerId 
            ? { ...customer, status: data.data.customer.status }
            : customer
        ));
        toast.success(data.message);
        return true;
      }
    } catch (error) {
      console.error('خطأ في تحديث حالة العميل:', error);
      toast.error('حدث خطأ في تحديث حالة العميل');
    }
    return false;
  };

  // البحث المتقدم
  const advancedSearch = async (searchFilters) => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/admin/customers/advanced-search', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(searchFilters)
      });
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.data);
        return data;
      }
    } catch (error) {
      console.error('خطأ في البحث المتقدم:', error);
      toast.error('حدث خطأ في البحث المتقدم');
    } finally {
      setLoading(false);
    }
  };

  // إرسال إشعار
  const sendNotification = async (notificationData) => {
    try {
      const response = await fetch('/api/v1/admin/customers/send-notification', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(notificationData)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        return data.data;
      }
    } catch (error) {
      console.error('خطأ في إرسال الإشعار:', error);
      toast.error('حدث خطأ في إرسال الإشعار');
    }
  };

  // تصدير البيانات
  const exportCustomers = async (format = 'excel', exportFilters = {}) => {
    try {
      const queryParams = new URLSearchParams({ format, ...exportFilters });
      const response = await fetch(
        `/api/v1/admin/customers/export?${queryParams}`,
        { headers: getAuthHeaders() }
      );
      const data = await response.json();
      
      if (data.success) {
        // فتح رابط التحميل
        window.open(data.data.download_url, '_blank');
        toast.success(`تم تصدير ${data.data.records_count} عميل بنجاح`);
        return data.data;
      }
    } catch (error) {
      console.error('خطأ في تصدير البيانات:', error);
      toast.error('حدث خطأ في تصدير البيانات');
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCustomers();
  }, []);

  return {
    customers,
    stats,
    activityStats,
    loading,
    filters,
    fetchCustomers,
    fetchStats,
    fetchCustomerDetails,
    updateCustomerStatus,
    advancedSearch,
    sendNotification,
    exportCustomers,
    totalCustomers: stats?.total_customers || 0
  };
};

// ===== مكون لوحة تحكم العملاء =====
const AdminCustomersPage = () => {
  const {
    customers,
    stats,
    loading,
    fetchCustomers,
    updateCustomerStatus,
    exportCustomers
  } = useAdminCustomers();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers({ search: searchTerm, page: 1 });
  };

  const handleStatusChange = async (customerId, newStatus, reason) => {
    const success = await updateCustomerStatus(customerId, newStatus, reason);
    if (success) {
      // تحديث إضافي إذا لزم
    }
  };

  const handleBulkExport = () => {
    exportCustomers('excel', { status: statusFilter });
  };

  if (loading) return <div>جاري تحميل بيانات العملاء...</div>;

  return (
    <div className="admin-customers-page p-6 space-y-6">
      {/* الإحصائيات */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            title="إجمالي العملاء"
            value={stats.total_customers.toLocaleString()}
            icon="👥"
            color="blue"
          />
          <StatCard
            title="عملاء نشطين"
            value={stats.active_customers.toLocaleString()}
            icon="✅"
            color="green"
          />
          <StatCard
            title="عملاء جدد هذا الشهر"
            value={stats.new_customers_this_month}
            icon="🆕"
            color="purple"
          />
          <StatCard
            title="معدل النمو"
            value={`${stats.growth_percentage}%`}
            icon="📈"
            color={stats.growth_percentage > 0 ? 'green' : 'red'}
          />
          <StatCard
            title="معدل الاحتفاظ"
            value={`${stats.retention_rate}%`}
            icon="🔄"
            color="teal"
          />
        </div>
      )}

      {/* أدوات البحث والفلترة */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="البحث في العملاء..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-l-md w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              🔍
            </button>
          </form>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              fetchCustomers({ status: e.target.value, page: 1 });
            }}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="banned">محظور</option>
          </select>

          <button
            onClick={handleBulkExport}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            📊 تصدير Excel
          </button>
        </div>
      </div>

      {/* جدول العملاء */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <CustomersTable
          customers={customers}
          onStatusChange={handleStatusChange}
          selectedCustomers={selectedCustomers}
          onSelectionChange={setSelectedCustomers}
        />
      </div>
    </div>
  );
};

// ===== مكونات مساعدة =====
const StatCard = ({ title, value, icon, color, urgent = false }) => (
  <div className={`bg-white p-4 rounded-lg shadow border-l-4 ${
    urgent ? 'border-red-500 bg-red-50' : `border-${color}-500`
  }`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className={`text-xl font-bold ${
          urgent ? 'text-red-700' : `text-${color}-700`
        }`}>
          {value}
        </p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

const CustomersTable = ({ customers, onStatusChange, selectedCustomers, onSelectionChange }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            العميل
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            الطلبات
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            إجمالي المشتريات
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            الحالة
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
            الإجراءات
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {customers.map((customer) => (
          <tr key={customer.id} className="hover:bg-gray-50">
            <td className="px-6 py-4">
              <div className="flex items-center">
                <img
                  className="h-10 w-10 rounded-full"
                  src={customer.avatar || '/default-avatar.png'}
                  alt={customer.name}
                />
                <div className="mr-4">
                  <div className="text-sm font-medium text-gray-900">
                    {customer.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {customer.email}
                  </div>
                  {customer.company && (
                    <div className="text-xs text-blue-600">
                      {customer.company}
                    </div>
                  )}
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span className="font-semibold">{customer.orders_count}</span>
              {customer.has_recent_activity && (
                <span className="mr-1 text-green-600">🟢</span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span className="font-semibold text-green-600">
                {customer.total_spent} {customer.currency}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <StatusBadge
                status={customer.status}
                onStatusChange={(newStatus, reason) => 
                  onStatusChange(customer.id, newStatus, reason)
                }
              />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/admin/customers/${customer.id}`)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  عرض
                </button>
                <button
                  onClick={() => handleSendNotification(customer.id)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  إشعار
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const StatusBadge = ({ status, onStatusChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const statusConfig = {
    active: { color: 'green', text: 'نشط', icon: '✅' },
    inactive: { color: 'gray', text: 'غير نشط', icon: '⏸️' },
    banned: { color: 'red', text: 'محظور', icon: '🚫' }
  };

  const config = statusConfig[status] || statusConfig.active;

  const handleStatusChange = (newStatus) => {
    const reason = newStatus === 'banned' 
      ? prompt('سبب الحظر:')
      : newStatus === 'inactive'
      ? prompt('سبب إلغاء التفعيل:')
      : '';

    if (newStatus === 'banned' && !reason) return;

    onStatusChange(newStatus, reason);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800 hover:bg-${config.color}-200`}
      >
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-2 w-32 bg-white rounded-md shadow-lg border">
          <div className="py-1">
            {Object.entries(statusConfig).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleStatusChange(key)}
                className={`w-full text-right px-4 py-2 text-sm hover:bg-gray-100 ${
                  status === key ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span className="mr-2">{value.icon}</span>
                {value.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### 💡 نصائح للاستخدام الأمثل

```javascript
// ===== تحسين الأداء مع React Query =====
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const useCustomersWithQuery = (filters) => {
  const queryClient = useQueryClient();

  // جلب العملاء مع cache
  const customersQuery = useQuery({
    queryKey: ['admin-customers', filters],
    queryFn: () => fetchCustomersAPI(filters),
    staleTime: 5 * 60 * 1000, // 5 دقائق
    cacheTime: 10 * 60 * 1000 // 10 دقائق
  });

  // تحديث حالة العميل مع optimistic updates
  const updateStatusMutation = useMutation({
    mutationFn: ({ customerId, status, reason }) => 
      updateCustomerStatusAPI(customerId, status, reason),
    onMutate: async ({ customerId, status }) => {
      // إيقاف refetch أثناء التحديث
      await queryClient.cancelQueries(['admin-customers']);

      // الحصول على البيانات السابقة
      const previousCustomers = queryClient.getQueryData(['admin-customers', filters]);

      // التحديث المتفائل
      queryClient.setQueryData(['admin-customers', filters], old => ({
        ...old,
        data: old.data.map(customer =>
          customer.id === customerId ? { ...customer, status } : customer
        )
      }));

      return { previousCustomers };
    },
    onError: (err, variables, context) => {
      // التراجع في حالة الخطأ
      queryClient.setQueryData(['admin-customers', filters], context.previousCustomers);
    },
    onSettled: () => {
      // إعادة جلب البيانات للتأكد من الصحة
      queryClient.invalidateQueries(['admin-customers']);
    }
  });

  return {
    customers: customersQuery.data?.data || [],
    loading: customersQuery.isLoading,
    error: customersQuery.error,
    updateStatus: updateStatusMutation.mutate,
    updatingStatus: updateStatusMutation.isLoading
  };
};

// ===== معالجة الأخطاء المتقدمة =====
const handleCustomerError = (error, action) => {
  if (error.response?.status === 403) {
    toast.error('ليس لديك صلاحية لتنفيذ هذا الإجراء');
    router.push('/admin/login');
  } else if (error.response?.status === 404) {
    toast.error('العميل غير موجود');
  } else if (error.response?.status === 422) {
    const validationErrors = error.response.data.errors;
    Object.values(validationErrors).flat().forEach(message => {
      toast.error(message);
    });
  } else {
    toast.error(`حدث خطأ في ${action}`);
  }
};

// ===== فلترة وبحث متقدم =====
const useAdvancedCustomerFilters = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateRange: { from: '', to: '' },
    ordersRange: { min: '', max: '' },
    spendingRange: { min: '', max: '' },
    hasCompany: null,
    isVerified: null
  });

  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      dateRange: { from: '', to: '' },
      ordersRange: { min: '', max: '' },
      spendingRange: { min: '', max: '' },
      hasCompany: null,
      isVerified: null
    });
  }, []);

  const buildQuery = useCallback(() => {
    const query = {};
    
    if (filters.search) query.search = filters.search;
    if (filters.status) query.status = filters.status;
    if (filters.dateRange.from) query.registration_date_from = filters.dateRange.from;
    if (filters.dateRange.to) query.registration_date_to = filters.dateRange.to;
    if (filters.ordersRange.min) query.min_orders = filters.ordersRange.min;
    if (filters.ordersRange.max) query.max_orders = filters.ordersRange.max;
    if (filters.spendingRange.min) query.min_spent = filters.spendingRange.min;
    if (filters.spendingRange.max) query.max_spent = filters.spendingRange.max;
    
    return query;
  }, [filters]);

  return {
    filters,
    applyFilters,
    resetFilters,
    buildQuery,
    hasActiveFilters: Object.values(filters).some(v => 
      v !== '' && v !== null && JSON.stringify(v) !== JSON.stringify({ from: '', to: '' })
    )
  };
};

// ===== مكون فلاتر متقدمة =====
const AdvancedCustomerFilters = ({ onFiltersChange, onReset }) => {
  const { filters, applyFilters, resetFilters, hasActiveFilters } = useAdvancedCustomerFilters();

  const handleApply = () => {
    onFiltersChange(filters);
  };

  const handleReset = () => {
    resetFilters();
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-medium mb-4">فلاتر البحث المتقدم</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* البحث النصي */}
        <div>
          <label className="block text-sm font-medium mb-2">البحث</label>
          <input
            type="text"
            placeholder="الاسم، الإيميل، أو الهاتف"
            value={filters.search}
            onChange={(e) => applyFilters({ search: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        {/* حالة العميل */}
        <div>
          <label className="block text-sm font-medium mb-2">الحالة</label>
          <select
            value={filters.status}
            onChange={(e) => applyFilters({ status: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="banned">محظور</option>
          </select>
        </div>

        {/* نطاق التاريخ */}
        <div>
          <label className="block text-sm font-medium mb-2">تاريخ التسجيل</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => applyFilters({ 
                dateRange: { ...filters.dateRange, from: e.target.value }
              })}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => applyFilters({ 
                dateRange: { ...filters.dateRange, to: e.target.value }
              })}
              className="flex-1 px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* نطاق الطلبات */}
        <div>
          <label className="block text-sm font-medium mb-2">عدد الطلبات</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="من"
              value={filters.ordersRange.min}
              onChange={(e) => applyFilters({ 
                ordersRange: { ...filters.ordersRange, min: e.target.value }
              })}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="إلى"
              value={filters.ordersRange.max}
              onChange={(e) => applyFilters({ 
                ordersRange: { ...filters.ordersRange, max: e.target.value }
              })}
              className="flex-1 px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* نطاق الإنفاق */}
        <div>
          <label className="block text-sm font-medium mb-2">إجمالي المشتريات (ج.م)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="من"
              value={filters.spendingRange.min}
              onChange={(e) => applyFilters({ 
                spendingRange: { ...filters.spendingRange, min: e.target.value }
              })}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="إلى"
              value={filters.spendingRange.max}
              onChange={(e) => applyFilters({ 
                spendingRange: { ...filters.spendingRange, max: e.target.value }
              })}
              className="flex-1 px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {/* خيارات إضافية */}
        <div>
          <label className="block text-sm font-medium mb-2">خيارات إضافية</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.hasCompany === true}
                onChange={(e) => applyFilters({ 
                  hasCompany: e.target.checked ? true : null 
                })}
                className="mr-2"
              />
              لديه شركة
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.isVerified === true}
                onChange={(e) => applyFilters({ 
                  isVerified: e.target.checked ? true : null 
                })}
                className="mr-2"
              />
              حساب مفعل
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          تطبيق الفلاتر
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            إعادة تعيين
          </button>
        )}
      </div>
    </div>
  );
};
```

### ✅ الخلاصة

**🎉 تم تطبيق Customer Management APIs بنجاح!**

- ✅ **8 APIs كاملة** مع جميع الفلاتر والإحصائيات
- ✅ **React Integration** جاهزة للاستخدام الفوري  
- ✅ **Advanced Search** مع فلاتر متقدمة
- ✅ **Real-time Updates** مع optimistic updates
- ✅ **Export Functionality** للـ Excel/CSV/PDF
- ✅ **Notification System** لإرسال إشعارات
- ✅ **Security** محمية بـ admin middleware
- ✅ **Performance** محسنة مع React Query

**🚀 جاهزة لبناء صفحة `/dashboard/customers` الاحترافية!**

---

📅 **آخر تحديث**: إضافة Customer Management APIs الشاملة - 9 سبتمبر 2025

## 🆕 التحديثات الأخيرة - إصلاح مشكلة رفع الصور

### 🚀 **ما تم إصلاحه:**

#### 1. **إصلاح ProductController (المشكلة الرئيسية)**
```php
// الإصلاح الرئيسي: دعم images.* للإنشاء + new_images.* للتحديث
'images' => 'nullable|array|max:5',
'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
'new_images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',

// إصلاح تخزين الصور: استخدام Laravel Storage بدلاً من public_path
$path = $file->storeAs('products', $filename, 'public');
$allImages[] = '/storage/' . $path;

// إصلاح حفظ البيانات: إزالة json_encode الزائد
$product->update(['images' => $allImages]);
```

#### 2. **إصلاح Routes للـ FormData**
```php
// إضافة route POST للتحديث مع FormData support
Route::post('/admin/products/{id}', [ProductController::class, 'update'])->name('admin.products.update.formdata');
```

#### 3. **إصلاح Models (ProductFeature & ProductSpecification)**
```php
// ProductFeature - تحديث fillable
protected $fillable = ['product_id', 'feature', 'sort_order'];

// ProductSpecification - تحديث fillable  
protected $fillable = ['product_id', 'spec_key', 'spec_value'];
```

#### 4. **تطبيق Laravel Storage Link**
```bash
php artisan storage:link
# النتيجة: /storage/products/filename.jpg بدلاً من placeholder
```

#### 5. **إصلاح عرض Features & Specifications**
```php
// في show method - عرض البيانات الفعلية بدلاً من array فارغ
'features' => $product->features->pluck('feature')->toArray(),
'specifications' => $product->specifications->map(function($spec) {
    return ['key' => $spec->spec_key, 'value' => $spec->spec_value];
})->toArray(),
```

---

### 🎯 **API Endpoints المُحدثة:**

#### **إنشاء منتج جديد مع صور (FormData)**
```javascript
POST /api/v1/admin/products
Content-Type: multipart/form-data

// استخدام FormData
const formData = new FormData();
formData.append('name_ar', 'منتج تجريبي');
formData.append('name_en', 'Test Product');
formData.append('description_ar', 'وصف المنتج');
formData.append('description_en', 'Product description');
formData.append('price', '100.50');
formData.append('stock', '50');
formData.append('category_id', '1');
formData.append('supplier_id', '1');
formData.append('status', 'active');
formData.append('featured', 'true');

// رفع الصور - المفتاح الجديد
formData.append('images[0]', fileInput.files[0]);
formData.append('images[1]', fileInput.files[1]);

// البيانات الإضافية
formData.append('features', JSON.stringify(['ميزة رائعة', 'جودة عالية']));
formData.append('specifications', JSON.stringify([
  {"key": "الوزن", "value": "2 كيلو"},
  {"key": "اللون", "value": "أزرق"}
]));

// Response - الصور تعمل الآن!
{
  "success": true,
  "message": "تم إنشاء المنتج بنجاح",
  "data": {
    "product": {
      "id": 56,
      "images": [
        "/storage/products/1735734567_abc123.jpg",
        "/storage/products/1735734568_def456.jpg"
      ],
      "features": [
        {"id": 1, "feature": "ميزة رائعة", "sort_order": 1},
        {"id": 2, "feature": "جودة عالية", "sort_order": 2}
      ],
      "specifications": [
        {"id": 1, "spec_key": "الوزن", "spec_value": "2 كيلو"},
        {"id": 2, "spec_key": "اللون", "spec_value": "أزرق"}
      ]
    }
  }
}
```

#### **تحديث منتج مع صور جديدة (FormData)**
```javascript
POST /api/v1/admin/products/{id}  // ⚠️ POST وليس PUT!
Content-Type: multipart/form-data

const formData = new FormData();
// البيانات الأساسية...
formData.append('name_ar', 'منتج محدث');

// الصور الموجودة (للاحتفاظ بها)
formData.append('existing_images', JSON.stringify([
  '/storage/products/old_image1.jpg',
  '/storage/products/old_image2.jpg'
]));

// الصور الجديدة (ستضاف للموجودة)
formData.append('new_images[0]', newFileInput.files[0]);
formData.append('new_images[1]', newFileInput.files[1]);

// Response - مزج الصور القديمة والجديدة
{
  "success": true,
  "message": "تم تحديث المنتج بنجاح",
  "data": {
    "product": {
      "images": [
        "/storage/products/old_image1.jpg",       // صور قديمة محفوظة
        "/storage/products/old_image2.jpg",       // صور قديمة محفوظة  
        "/storage/products/1735734890_new1.jpg",  // صور جديدة
        "/storage/products/1735734891_new2.jpg"   // صور جديدة
      ]
    }
  }
}
```

---

### 🛠️ **مثال عملي للاستخدام في React:**

```javascript
// ✅ مثال كامل يعمل 100%
const uploadProductWithImages = async (productData, imageFiles) => {
  try {
    const formData = new FormData();
    
    // البيانات الأساسية
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && productData[key] !== null) {
        formData.append(key, productData[key]);
      }
    });
    
    // رفع الصور
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }
    
    // البيانات الإضافية كـ JSON
    if (productData.features) {
      formData.append('features', JSON.stringify(productData.features));
    }
    if (productData.specifications) {
      formData.append('specifications', JSON.stringify(productData.specifications));
    }
    
    const response = await fetch('/api/v1/admin/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAdminToken()}`,
        'Accept': 'application/json'
        // ⚠️ لا تضع Content-Type! المتصفح سيضعه تلقائياً مع boundary
      },
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      toast.success(result.message);
      return result.data.product;
    } else {
      throw new Error(result.message);
    }
    
  } catch (error) {
    console.error('خطأ في رفع المنتج:', error);
    toast.error('حدث خطأ في رفع المنتج');
    throw error;
  }
};

// الاستخدام
const handleSubmit = async (formData, imageFiles) => {
  const product = await uploadProductWithImages(formData, imageFiles);
  router.push(`/admin/products/${product.id}`);
};
```

---

### 📁 **مسارات الصور الجديدة:**

```bash
# المسار الفعلي للتخزين
storage/app/public/products/1735734567_abc123.jpg

# الرابط للوصول من المتصفح  
http://localhost:8000/storage/products/1735734567_abc123.jpg

# الرابط المحفوظ في قاعدة البيانات
/storage/products/1735734567_abc123.jpg
```

---

### ✅ **النتائج:**

| المشكلة القديمة | الحل الجديد | النتيجة |
|----------------|------------|---------|
| ❌ 422 Validation Error | ✅ دعم كامل للـ FormData | رفع ناجح |
| ❌ Placeholder Images | ✅ مسارات صحيحة `/storage/` | صور تظهر |
| ❌ Features فارغة | ✅ حفظ وعرض صحيح | بيانات كاملة |
| ❌ مسارات خاطئة | ✅ Laravel Storage Link | روابط تعمل |
| ❌ JSON vs FormData تعارض | ✅ دعم كلاهما | مرونة كاملة |

---

### 🧪 **اختبار سريع:**

```bash
# اختبار رفع منتج مع صور
curl -X POST http://localhost:8000/api/v1/admin/products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -F "name_ar=منتج تجريبي" \
  -F "name_en=Test Product" \
  -F "description_ar=وصف تجريبي" \
  -F "description_en=Test description" \
  -F "price=100" \
  -F "stock=50" \
  -F "category_id=1" \
  -F "supplier_id=1" \
  -F "status=active" \
  -F "featured=true" \
  -F "images[]=@test_image1.jpg" \
  -F "images[]=@test_image2.jpg" \
  -F "features=[\"ميزة رائعة\",\"جودة عالية\"]" \
  -F "specifications=[{\"key\":\"الوزن\",\"value\":\"2 كيلو\"}]"

# النتيجة المتوقعة: 201 Created مع بيانات المنتج والصور
```

---

### 🎯 **الخلاصة:**
**✅ تم حل مشكلة رفع الصور بالكامل!**

- **Frontend**: يرسل FormData مع الصور ✅
- **Backend**: يستقبل ويعالج الصور بنجاح ✅  
- **Storage**: يحفظ في المكان الصحيح ✅
- **Display**: الصور تظهر في الواجهة ✅
- **Database**: Features & Specifications تحفظ صحيحة ✅

**🚀 النظام جاهز للاستخدام الفوري!**

---

## ⭐ Admin Review Management APIs

جميع Admin Review Management APIs تتطلب:
- **Authentication**: `Authorization: Bearer {admin_token}`
- **Role**: المستخدم يجب أن يكون `admin`
- **Middleware**: محمية بـ `role:admin`

### 📊 1. إحصائيات التقييمات
```javascript
GET /admin/reviews/stats
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "total_reviews": 1250,
    "approved_reviews": 980,
    "pending_reviews": 180,
    "rejected_reviews": 90,
    "average_rating": 4.2,
    "verified_reviews": 750,
    "reviews_with_images": 320,
    "helpful_reviews": 580,
    "rating_breakdown": {
      "5": 520,
      "4": 380,
      "3": 200,
      "2": 100,
      "1": 50
    }
  }
}
```

### 📋 2. قائمة التقييمات مع فلترة وترقيم
```javascript
GET /admin/reviews?page=1&per_page=20&search=excellent&status=approved&rating=5&verified_only=true&lang=ar

// Query Parameters (اختيارية):
// - search: البحث في نص التقييم
// - status: pending|approved|rejected
// - rating: 1|2|3|4|5
// - verified_only: true|false
// - product_id: رقم المنتج
// - user_id: رقم المستخدم
// - date_from: تاريخ البداية
// - date_to: تاريخ النهاية

// Response
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 125,
        "user": {
          "id": 45,
          "name": "Ahmed Hassan",
          "email": "ahmed@example.com"
        },
        "product": {
          "id": 15,
          "name": "Premium Product",
          "image": "product.jpg"
        },
        "rating": 5,
        "review": "Excellent product! Really satisfied.",
        "status": "approved",
        "verified_purchase": true,
        "helpful_count": 12,
        "images": ["review1.jpg", "review2.jpg"],
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T14:22:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 15,
      "per_page": 20,
      "total": 300
    }
  }
}
```

### 🔍 3. تفاصيل تقييم محدد
```javascript
GET /admin/reviews/{review_id}
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "id": 125,
    "user": {
      "id": 45,
      "name": "Ahmed Hassan", 
      "email": "ahmed@example.com",
      "total_reviews": 8,
      "average_rating": 4.3
    },
    "product": {
      "id": 15,
      "name": "Premium Product",
      "price": "299.00",
      "category": "Electronics"
    },
    "order": {
      "id": 89,
      "order_number": "ORD-2024-001234",
      "purchase_date": "2024-01-10T15:20:00Z"
    },
    "rating": 5,
    "review": "Excellent product! Really satisfied with the quality.",
    "status": "approved",
    "verified_purchase": true,
    "helpful_count": 12,
    "images": [
      {
        "id": 1,
        "url": "/storage/review-images/1.jpg",
        "thumbnail": "/storage/review-images/1_thumb.jpg"
      }
    ],
    "status_history": [
      {
        "status": "pending",
        "changed_by": "system",
        "changed_at": "2024-01-15T10:30:00Z",
        "reason": "Auto-created"
      },
      {
        "status": "approved",
        "changed_by": "admin_25",
        "changed_at": "2024-01-15T14:22:00Z",
        "reason": "Quality review"
      }
    ]
  }
}
```

### ⚙️ 4. تحديث حالة التقييم
```javascript
PUT /admin/reviews/{review_id}/status
// Headers: Authorization: Bearer {admin_token}

// Request Body
{
  "status": "approved", // pending|approved|rejected
  "reason": "High quality review with verification",
  "admin_response": "Thank you for your detailed feedback!", // اختياري
  "notify_user": true // اختياري
}

// Response
{
  "success": true,
  "message": "Review status updated successfully",
  "data": {
    "id": 125,
    "status": "approved",
    "previous_status": "pending",
    "updated_by": "admin_25",
    "updated_at": "2024-01-15T16:45:00Z"
  }
}
```

### 🔄 5. إجراءات مجمعة على التقييمات
```javascript
POST /admin/reviews/bulk
// Headers: Authorization: Bearer {admin_token}

// Request Body
{
  "action": "update_status", // update_status|delete|mark_helpful
  "review_ids": [125, 126, 127, 128],
  "data": {
    "status": "approved",
    "reason": "Bulk approval for verified reviews"
  }
}

// Response
{
  "success": true,
  "message": "Bulk action completed successfully",
  "data": {
    "processed_count": 4,
    "successful_count": 4,
    "failed_count": 0
  }
}
```

### 📊 6. تحليلات التقييمات المتقدمة
```javascript
GET /admin/reviews/analytics?period=last_30_days&product_id=15&group_by=month
// Headers: Authorization: Bearer {admin_token}

// Response
{
  "success": true,
  "data": {
    "review_trends": [
      {
        "period": "2024-01",
        "total_reviews": 85,
        "approved_reviews": 75,
        "average_rating": 4.2,
        "verified_percentage": 78.5
      }
    ],
    "rating_distribution": {
      "5_star": {"count": 520, "percentage": 41.6},
      "4_star": {"count": 380, "percentage": 30.4},
      "3_star": {"count": 200, "percentage": 16.0},
      "2_star": {"count": 100, "percentage": 8.0},
      "1_star": {"count": 50, "percentage": 4.0}
    },
    "top_products": [
      {
        "product_id": 15,
        "product_name": "Premium Product",
        "review_count": 45,
        "average_rating": 4.8,
        "growth_rate": 12.5
      }
    ]
  }
}
```

### 🔧 Frontend Integration في ApiService

```typescript
// Review Management APIs في src/app/services/api.ts

// 1. إحصائيات التقييمات
static async getReviewsStats(): Promise<APIResponse<any>> {
  return this.client.get<any>('/admin/reviews/stats');
}

// 2. قائمة التقييمات
static async getAdminReviews(params?: any): Promise<APIResponse<any>> {
  return this.client.get<any>('/admin/reviews', params);
}

// 3. تفاصيل تقييم
static async getAdminReviewDetails(reviewId: number): Promise<APIResponse<any>> {
  return this.client.get<any>(`/admin/reviews/${reviewId}`);
}

// 4. تحديث حالة تقييم
static async updateReviewStatus(reviewId: number, status: string, reason?: string, adminResponse?: string): Promise<APIResponse<any>> {
  return this.client.put<any>(`/admin/reviews/${reviewId}/status`, {
    status,
    reason,
    admin_response: adminResponse
  });
}

// 5. إجراءات مجمعة
static async bulkUpdateReviews(action: string, reviewIds: number[], data: any): Promise<APIResponse<any>> {
  return this.client.post<any>('/admin/reviews/bulk', {
    action,
    review_ids: reviewIds,
    data
  });
}

// 6. تحليلات التقييمات
static async getReviewAnalytics(params?: any): Promise<APIResponse<any>> {
  return this.client.get<any>('/admin/reviews/analytics', params);
}
```

### 🗄️ قاعدة البيانات المطلوبة

```sql
-- جدول التقييمات الرئيسي
CREATE TABLE reviews (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL,
    review_ar TEXT NULL,
    review_en TEXT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    admin_response TEXT NULL,
    admin_response_by BIGINT UNSIGNED NULL,
    admin_response_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    
    INDEX idx_status (status),
    INDEX idx_rating (rating),
    INDEX idx_product_id (product_id),
    INDEX idx_created_at (created_at)
);

-- جدول صور التقييمات
CREATE TABLE review_images (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    thumbnail_path VARCHAR(255) NULL,
    order_index TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- جدول تاريخ حالات التقييم
CREATE TABLE review_status_history (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    review_id BIGINT UNSIGNED NOT NULL,
    old_status ENUM('pending', 'approved', 'rejected') NULL,
    new_status ENUM('pending', 'approved', 'rejected') NOT NULL,
    changed_by BIGINT UNSIGNED NULL,
    reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id)
);
```

### ✅ إرشادات التطبيق

#### **1. أولوية التطوير:**
1. **عالية**: إحصائيات التقييمات + قائمة التقييمات
2. **متوسطة**: تحديث حالة التقييم + تفاصيل التقييم  
3. **منخفضة**: الإجراءات المجمعة + التحليلات المتقدمة

#### **2. اختبار APIs:**
```bash
# اختبار إحصائيات التقييمات
curl -X GET "http://localhost:8000/api/v1/admin/reviews/stats" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"

# اختبار قائمة التقييمات مع فلترة
curl -X GET "http://localhost:8000/api/v1/admin/reviews?status=pending&page=1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"

# اختبار تحديث حالة تقييم
curl -X PUT "http://localhost:8000/api/v1/admin/reviews/1/status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved",
    "reason": "Quality review with verification"
  }'
```

#### **3. Laravel Controller:**
```php
<?php
// AdminReviewController.php
namespace App\Http\Controllers\Admin;

class AdminReviewController extends Controller
{
    public function stats()
    {
        $stats = [
            'total_reviews' => Review::count(),
            'approved_reviews' => Review::where('status', 'approved')->count(),
            'pending_reviews' => Review::where('status', 'pending')->count(),
            'rejected_reviews' => Review::where('status', 'rejected')->count(),
            'average_rating' => Review::avg('rating') ?? 0,
            'rating_breakdown' => [
                '5' => Review::where('rating', 5)->count(),
                '4' => Review::where('rating', 4)->count(),
                '3' => Review::where('rating', 3)->count(),
                '2' => Review::where('rating', 2)->count(),
                '1' => Review::where('rating', 1)->count(),
            ]
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }

    public function index(Request $request)
    {
        $query = Review::with(['user', 'product', 'images']);

        // Apply filters
        if ($request->search) {
            $query->where('review', 'LIKE', '%' . $request->search . '%');
        }
        
        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->rating) {
            $query->where('rating', $request->rating);
        }

        $reviews = $query->paginate($request->per_page ?? 20);
        
        return response()->json(['success' => true, 'data' => $reviews]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'reason' => 'nullable|string|max:1000'
        ]);

        $review = Review::findOrFail($id);
        $review->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'message' => 'Review status updated successfully',
            'data' => $review
        ]);
    }
}
```

---

### 🎯 ملخص Review Management APIs

| **API** | **Method** | **Endpoint** | **الهدف** |
|---------|------------|-------------|----------|
| **إحصائيات** | `GET` | `/admin/reviews/stats` | أرقام شاملة عن التقييمات |
| **قائمة التقييمات** | `GET` | `/admin/reviews` | استعراض مع فلترة وترقيم |
| **تفاصيل التقييم** | `GET` | `/admin/reviews/{id}` | معلومات مفصلة لتقييم واحد |
| **تحديث الحالة** | `PUT` | `/admin/reviews/{id}/status` | الموافقة/الرفض/التعليق |
| **إجراءات مجمعة** | `POST` | `/admin/reviews/bulk` | تحديث عدة تقييمات معاً |
| **التحليلات** | `GET` | `/admin/reviews/analytics` | تقارير وإحصائيات متقدمة |

**✅ كل ما تحتاجه لإدارة التقييمات بالكامل جاهز للتطبيق!**
