# 📋 خطة Backend شاملة لمشروع BuildTools BS

## 🔍 تحليل الواجهة الأمامية (Frontend Analysis)

### 📱 الصفحات المُنفذة
1. **Home (`/`)** - صفحة رئيسية شاملة
2. **Products (`/products`)** - كتالوج المنتجات مع فلاتر وبحث
3. **Product Details (`/products/[id]`)** - تفاصيل المنتج الفردي
4. **Categories (`/categories`)** - عرض الفئات والمنتجات المميزة
5. **Cart (`/cart`)** - سلة التسوق مع إدارة الكمية وكوبونات الخصم
6. **Wishlist (`/wishlist`)** - قائمة الأمنيات الشخصية
7. **Auth (`/auth`)** - تسجيل دخول وإنشاء حساب
8. **Dashboard (`/dashboard`)** - لوحة تحكم المستخدم
9. **About (`/about`)** - معلومات الشركة والفريق
10. **Contact (`/contact`)** - نموذج التواصل ومعلومات الاتصال

### 🔧 المكونات الرئيسية (Components)
- **Header** - شريط التنقل مع سلة التسوق وقائمة الأمنيات
- **Footer** - معلومات الشركة والاشتراك في النشرة البريدية
- **Hero** - قسم البطل الرئيسي
- **Categories** - عرض فئات المنتجات
- **FeaturedProducts** - المنتجات المميزة مع فلاتر
- **About** - معلومات الشركة

### 📊 إدارة الحالة (State Management)
- **CartContext** - إدارة سلة التسوق
- **UserContext** - إدارة المستخدمين والمصادقة
- **LanguageContext** - دعم متعدد اللغات (عربي/إنجليزي)
- **ToastContext** - رسائل الإشعارات

### 🗃️ هياكل البيانات الحالية

#### Product Structure
```typescript
interface Product {
  id: number;
  name: MultilingualText;
  description: MultilingualText;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  features: MultilingualText[];
  badge: MultilingualText;
  badgeColor: string;
  specifications: { [key: string]: MultilingualText };
}
```

#### Category Structure  
```typescript
interface Category {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  icon: string;
  count: number;
  color: string;
  bgColor: string;
  items: MultilingualText[];
}
```

#### User Structure
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  joinDate: string;
  orders: Order[];
  wishlist: WishlistItem[];
}
```

#### Order Structure
```typescript
interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: CartItem[];
}
```

---

## 🚀 APIs المطلوبة للنظام

### 🔐 Authentication APIs

#### `POST /api/auth/register`
**الغرض:** إنشاء حساب جديد
```json
// Request Body
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com", 
  "password": "securePassword123",
  "phone": "+201234567890",
  "company": "شركة البناء المتقدم"
}

// Response
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "user": {
      "id": "usr_123",
      "name": "أحمد محمد",
      "email": "ahmed@example.com",
      "phone": "+201234567890",
      "company": "شركة البناء المتقدم",
      "joinDate": "2024-01-15T10:30:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### `POST /api/auth/login`
**الغرض:** تسجيل الدخول
```json
// Request Body
{
  "email": "ahmed@example.com",
  "password": "securePassword123"
}

// Response  
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "user": { /* User Object */ },
    "token": "jwt_token_here"
  }
}
```

#### `POST /api/auth/logout`
**الغرض:** تسجيل الخروج
```json
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

#### `GET /api/auth/profile`
**الغرض:** جلب معلومات المستخدم الحالي
```json
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "user": { /* User Object */ }
  }
}
```

#### `PUT /api/auth/profile`
**الغرض:** تحديث معلومات المستخدم
```json
// Request Body
{
  "name": "أحمد محمد المحدث",
  "phone": "+201234567891",
  "address": "شارع التحرير، القاهرة",
  "company": "شركة البناء المتطور"
}

// Response
{
  "success": true,
  "message": "تم تحديث المعلومات بنجاح",
  "data": {
    "user": { /* Updated User Object */ }
  }
}
```

### 🛍️ Products APIs

#### `GET /api/products`
**الغرض:** جلب قائمة المنتجات مع فلتر وبحث
```json
// Query Parameters
?page=1&limit=12&category=power-tools&search=مثقاب&sort=price&order=asc&lang=ar

// Response
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": {
          "ar": "مثقاب ديوالت 20 فولت",
          "en": "DeWalt 20V Drill"
        },
        "description": {
          "ar": "مثقاب احترافي لاسلكي",
          "en": "Professional cordless drill"
        },
        "category": "power-tools",
        "price": 299,
        "originalPrice": 349,
        "rating": 4.8,
        "reviews": 1247,
        "image": "/images/products/drill-1.jpg",
        "badge": {
          "ar": "الأكثر مبيعاً",
          "en": "Best Seller"
        },
        "features": [
          {"ar": "محرك بدون فرش", "en": "Brushless Motor"}
        ],
        "specifications": {
          "voltage": {"ar": "20 فولت", "en": "20V"}
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_products": 60,
      "per_page": 12
    },
    "filters": {
      "categories": ["power-tools", "hand-tools"],
      "price_range": {"min": 50, "max": 1000},
      "brands": ["DeWalt", "Makita", "Bosch"]
    }
  }
}
```

#### `GET /api/products/{id}`
**الغرض:** جلب تفاصيل منتج محدد
```json
// Response
{
  "success": true,
  "data": {
    "product": { /* Complete Product Object */ },
    "related_products": [ /* Array of related products */ ],
    "reviews": [
      {
        "id": 1,
        "user_name": "أحمد محمد",
        "rating": 5,
        "comment": "منتج ممتاز وجودة عالية",
        "date": "2024-01-10T15:30:00Z",
        "verified_purchase": true
      }
    ]
  }
}
```

#### `GET /api/products/featured`
**الغرض:** جلب المنتجات المميزة
```json
// Response
{
  "success": true,
  "data": {
    "products": [ /* Array of featured products */ ]
  }
}
```

#### `GET /api/products/recommendations`
**الغرض:** جلب المنتجات المقترحة للمستخدم
```json
// Headers: Authorization: Bearer {token} (Optional)

// Response
{
  "success": true,
  "data": {
    "products": [ /* Array of recommended products */ ],
    "reason": "based_on_cart" // or "popular", "similar_users"
  }
}
```

### 📂 Categories APIs

#### `GET /api/categories`
**الغرض:** جلب قائمة الفئات
```json
// Query: ?lang=ar

// Response
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "power-tools",
        "name": {
          "ar": "الأدوات الكهربائية",
          "en": "Power Tools"
        },
        "description": {
          "ar": "أدوات كهربائية احترافية",
          "en": "Professional electric tools"
        },
        "icon": "🔋",
        "count": 120,
        "image": "/images/categories/power-tools.jpg",
        "subcategories": [
          {
            "id": "drills",
            "name": {"ar": "مثاقب", "en": "Drills"},
            "count": 25
          }
        ]
      }
    ]
  }
}
```

#### `GET /api/categories/{id}/products`
**الغرض:** جلب منتجات فئة محددة
```json
// Response
{
  "success": true,
  "data": {
    "category": { /* Category Object */ },
    "products": [ /* Array of products */ ],
    "pagination": { /* Pagination info */ }
  }
}
```

### 🛒 Cart APIs

#### `GET /api/cart`
**الغرض:** جلب محتويات السلة
```json
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "cart": {
      "id": "cart_123",
      "user_id": "usr_123",
      "items": [
        {
          "id": 1,
          "product_id": 1,
          "quantity": 2,
          "product": { /* Product Object */ }
        }
      ],
      "subtotal": 598,
      "tax": 59.8,
      "shipping": 0,
      "discount": 0,
      "total": 657.8,
      "currency": "EGP"
    }
  }
}
```

#### `POST /api/cart/add`
**الغرض:** إضافة منتج للسلة
```json
// Request Body
{
  "product_id": 1,
  "quantity": 2
}

// Response
{
  "success": true,
  "message": "تم إضافة المنتج للسلة",
  "data": {
    "cart": { /* Updated Cart Object */ }
  }
}
```

#### `PUT /api/cart/update`
**الغرض:** تحديث كمية منتج في السلة
```json
// Request Body
{
  "product_id": 1,
  "quantity": 3
}

// Response
{
  "success": true,
  "message": "تم تحديث الكمية",
  "data": {
    "cart": { /* Updated Cart Object */ }
  }
}
```

#### `DELETE /api/cart/remove/{product_id}`
**الغرض:** إزالة منتج من السلة
```json
// Response
{
  "success": true,
  "message": "تم إزالة المنتج من السلة",
  "data": {
    "cart": { /* Updated Cart Object */ }
  }
}
```

#### `POST /api/cart/apply-coupon`
**الغرض:** تطبيق كوبون خصم
```json
// Request Body
{
  "coupon_code": "SAVE10"
}

// Response
{
  "success": true,
  "message": "تم تطبيق كوبون الخصم",
  "data": {
    "cart": { /* Updated Cart Object */ },
    "discount": {
      "code": "SAVE10",
      "amount": 59.8,
      "percentage": 10
    }
  }
}
```

### ❤️ Wishlist APIs

#### `GET /api/wishlist`
**الغرض:** جلب قائمة الأمنيات
```json
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "wishlist": [
      {
        "id": 1,
        "product_id": 5,
        "date_added": "2024-01-15T10:30:00Z",
        "product": { /* Product Object */ }
      }
    ],
    "total_items": 3
  }
}
```

#### `POST /api/wishlist/add`
**الغرض:** إضافة منتج لقائمة الأمنيات
```json
// Request Body
{
  "product_id": 5
}

// Response
{
  "success": true,
  "message": "تم إضافة المنتج لقائمة الأمنيات"
}
```

#### `DELETE /api/wishlist/remove/{product_id}`
**الغرض:** إزالة منتج من قائمة الأمنيات
```json
// Response
{
  "success": true,
  "message": "تم إزالة المنتج من قائمة الأمنيات"
}
```

### 📦 Orders APIs

#### `POST /api/orders`
**الغرض:** إنشاء طلب جديد
```json
// Request Body
{
  "shipping_address": {
    "street": "شارع التحرير",
    "city": "القاهرة",
    "state": "القاهرة",
    "postal_code": "12345",
    "country": "مصر"
  },
  "payment_method": "credit_card",
  "notes": "توصيل صباحي مفضل"
}

// Response
{
  "success": true,
  "message": "تم إنشاء الطلب بنجاح",
  "data": {
    "order": {
      "id": "ORD-2024-001",
      "status": "pending",
      "total": 657.8,
      "estimated_delivery": "2024-01-20",
      "tracking_number": "TRK123456789"
    }
  }
}
```

#### `GET /api/orders`
**الغرض:** جلب طلبات المستخدم
```json
// Headers: Authorization: Bearer {token}
// Query: ?page=1&limit=10&status=pending

// Response
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-2024-001",
        "date": "2024-01-15T10:30:00Z",
        "status": "pending",
        "total": 657.8,
        "items_count": 3,
        "estimated_delivery": "2024-01-20"
      }
    ],
    "pagination": { /* Pagination info */ }
  }
}
```

#### `GET /api/orders/{id}`
**الغرض:** جلب تفاصيل طلب محدد
```json
// Response
{
  "success": true,
  "data": {
    "order": {
      "id": "ORD-2024-001",
      "date": "2024-01-15T10:30:00Z",
      "status": "processing",
      "items": [ /* Order items */ ],
      "shipping_address": { /* Address */ },
      "payment_info": { /* Payment details */ },
      "timeline": [
        {
          "status": "pending",
          "date": "2024-01-15T10:30:00Z",
          "note": "تم استلام الطلب"
        }
      ]
    }
  }
}
```

### 📞 Contact APIs

#### `POST /api/contact`
**الغرض:** إرسال رسالة اتصال
```json
// Request Body
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "phone": "+201234567890",
  "company": "شركة البناء",
  "subject": "استفسار عن المنتجات",
  "message": "أريد معرفة المزيد عن الأدوات الكهربائية",
  "project_type": "commercial"
}

// Response
{
  "success": true,
  "message": "تم إرسال رسالتك بنجاح، سنتواصل معك قريباً",
  "data": {
    "ticket_id": "TKT-2024-001"
  }
}
```

### 📧 Newsletter APIs

#### `POST /api/newsletter/subscribe`
**الغرض:** الاشتراك في النشرة البريدية
```json
// Request Body
{
  "email": "ahmed@example.com",
  "preferences": ["new_products", "offers", "industry_news"]
}

// Response
{
  "success": true,
  "message": "تم الاشتراك في النشرة البريدية بنجاح"
}
```

### 🔍 Search APIs

#### `GET /api/search`
**الغرض:** البحث الشامل
```json
// Query: ?q=مثقاب&type=products&lang=ar

// Response
{
  "success": true,
  "data": {
    "results": {
      "products": [ /* Matching products */ ],
      "categories": [ /* Matching categories */ ],
      "suggestions": ["مثقاب ديوالت", "مثقاب مكيتا"]
    },
    "total_results": 15,
    "search_time": "0.05s"
  }
}
```

### 📊 Analytics APIs

#### `GET /api/analytics/dashboard`
**الغرض:** إحصائيات لوحة التحكم
```json
// Headers: Authorization: Bearer {token}

// Response
{
  "success": true,
  "data": {
    "user_stats": {
      "total_orders": 5,
      "total_spent": 2500,
      "wishlist_items": 8,
      "last_order_date": "2024-01-10"
    },
    "recent_activity": [
      {
        "type": "order_placed",
        "description": "تم وضع طلب جديد",
        "date": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

## 🏢 Admin Dashboard APIs

### 📊 Admin Analytics

#### `GET /api/admin/dashboard/stats`
**الغرض:** إحصائيات عامة للإدارة
```json
// Response
{
  "success": true,
  "data": {
    "overview": {
      "total_products": 1250,
      "total_orders": 8500,
      "total_users": 3200,
      "total_revenue": 850000,
      "monthly_growth": 12.5
    },
    "recent_orders": [ /* Recent orders */ ],
    "top_products": [ /* Best selling products */ ],
    "low_stock_alerts": [ /* Products with low inventory */ ]
  }
}
```

### 👥 User Management

#### `GET /api/admin/users`
**الغرض:** إدارة المستخدمين
```json
// Query: ?page=1&limit=20&search=ahmed&status=active

// Response
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "usr_123",
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "status": "active",
        "join_date": "2024-01-01",
        "total_orders": 5,
        "total_spent": 2500
      }
    ],
    "pagination": { /* Pagination info */ }
  }
}
```

### 📦 Product Management

#### `POST /api/admin/products`
**الغرض:** إضافة منتج جديد
```json
// Request Body
{
  "name": {
    "ar": "مثقاب جديد",
    "en": "New Drill"
  },
  "description": {
    "ar": "وصف المنتج",
    "en": "Product description"
  },
  "category": "power-tools",
  "price": 299,
  "original_price": 349,
  "stock_quantity": 50,
  "features": [
    {"ar": "خاصية 1", "en": "Feature 1"}
  ],
  "specifications": {
    "voltage": {"ar": "20 فولت", "en": "20V"}
  },
  "images": ["image1.jpg", "image2.jpg"],
  "status": "active"
}

// Response
{
  "success": true,
  "message": "تم إضافة المنتج بنجاح",
  "data": {
    "product": { /* Created product */ }
  }
}
```

#### `PUT /api/admin/products/{id}`
**الغرض:** تحديث منتج
```json
// Request Body - Same as POST but for updating

// Response
{
  "success": true,
  "message": "تم تحديث المنتج بنجاح",
  "data": {
    "product": { /* Updated product */ }
  }
}
```

#### `DELETE /api/admin/products/{id}`
**الغرض:** حذف منتج
```json
// Response
{
  "success": true,
  "message": "تم حذف المنتج بنجاح"
}
```

### 📂 Category Management

#### `POST /api/admin/categories`
**الغرض:** إضافة فئة جديدة
```json
// Request Body
{
  "name": {
    "ar": "فئة جديدة",
    "en": "New Category"
  },
  "description": {
    "ar": "وصف الفئة",
    "en": "Category description"
  },
  "icon": "🔧",
  "parent_id": null, // For subcategories
  "status": "active"
}

// Response
{
  "success": true,
  "message": "تم إضافة الفئة بنجاح",
  "data": {
    "category": { /* Created category */ }
  }
}
```

### 📋 Order Management

#### `GET /api/admin/orders`
**الغرض:** إدارة الطلبات
```json
// Query: ?page=1&limit=20&status=pending&date_from=2024-01-01

// Response
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-2024-001",
        "customer": "أحمد محمد",
        "total": 657.8,
        "status": "pending",
        "date": "2024-01-15T10:30:00Z",
        "items_count": 3
      }
    ],
    "pagination": { /* Pagination info */ },
    "summary": {
      "total_orders": 100,
      "pending_orders": 15,
      "total_revenue": 50000
    }
  }
}
```

#### `PUT /api/admin/orders/{id}/status`
**الغرض:** تحديث حالة الطلب
```json
// Request Body
{
  "status": "processing",
  "note": "تم تأكيد الطلب وجاري التحضير"
}

// Response
{
  "success": true,
  "message": "تم تحديث حالة الطلب بنجاح"
}
```

### 💬 Contact Messages Management

#### `GET /api/admin/contacts`
**الغرض:** إدارة رسائل التواصل
```json
// Response
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "TKT-2024-001",
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "subject": "استفسار عن المنتجات",
        "status": "new",
        "date": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 🎫 Coupon Management

#### `POST /api/admin/coupons`
**الغرض:** إنشاء كوبون خصم
```json
// Request Body
{
  "code": "SAVE20",
  "type": "percentage", // or "fixed"
  "value": 20,
  "min_order_amount": 500,
  "max_discount": 100,
  "usage_limit": 1000,
  "valid_from": "2024-01-01T00:00:00Z",
  "valid_until": "2024-12-31T23:59:59Z",
  "status": "active"
}

// Response
{
  "success": true,
  "message": "تم إنشاء كوبون الخصم بنجاح",
  "data": {
    "coupon": { /* Created coupon */ }
  }
}
```

### 📊 Reports APIs

#### `GET /api/admin/reports/sales`
**الغرض:** تقارير المبيعات
```json
// Query: ?period=month&year=2024&month=1

// Response
{
  "success": true,
  "data": {
    "sales_summary": {
      "total_revenue": 150000,
      "total_orders": 500,
      "average_order": 300,
      "growth_rate": 15.5
    },
    "daily_sales": [ /* Daily breakdown */ ],
    "top_products": [ /* Best sellers */ ],
    "customer_segments": [ /* Customer analysis */ ]
  }
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    company VARCHAR(255),
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Categories Table
```sql
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    icon VARCHAR(10),
    image VARCHAR(255),
    parent_id VARCHAR(50),
    sort_order INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);
```

### Products Table
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    category_id VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    rating DECIMAL(3,2) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    badge_ar VARCHAR(100),
    badge_en VARCHAR(100),
    badge_color VARCHAR(50),
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### Product Features Table
```sql
CREATE TABLE product_features (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    feature_ar VARCHAR(255) NOT NULL,
    feature_en VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Product Specifications Table
```sql
CREATE TABLE product_specifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    spec_key VARCHAR(100) NOT NULL,
    spec_value_ar VARCHAR(255) NOT NULL,
    spec_value_en VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Product Images Table
```sql
CREATE TABLE product_images (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text_ar VARCHAR(255),
    alt_text_en VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Orders Table
```sql
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EGP',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_address TEXT,
    notes TEXT,
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    product_name_ar VARCHAR(255),
    product_name_en VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

### Cart Table
```sql
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);
```

### Wishlist Table
```sql
CREATE TABLE wishlist_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);
```

### Coupons Table
```sql
CREATE TABLE coupons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('percentage', 'fixed') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    project_type ENUM('residential', 'commercial', 'industrial', 'other'),
    status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Newsletter Subscriptions Table
```sql
CREATE TABLE newsletter_subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    preferences JSON,
    status ENUM('active', 'unsubscribed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔧 Technical Implementation

### Backend Framework: Laravel 10+
- **Language:** PHP 8.2+
- **Database:** MySQL 8.0
- **Cache:** Redis
- **Queue:** Laravel Queue with Redis
- **Storage:** Laravel Storage (Local/S3)
- **Authentication:** Laravel Sanctum

### API Standards
- **RESTful Architecture**
- **JSON Responses**
- **JWT Authentication**
- **Rate Limiting**
- **API Versioning** (`/api/v1/`)
- **CORS Support**
- **Request Validation**
- **Error Handling**

### Multilingual Support
- **Database Level:** Separate columns for Arabic/English
- **API Response:** Include both languages in response
- **Frontend Selection:** Based on `lang` parameter
- **Fallback:** English as default if Arabic missing

### File Structure
```
laravel-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── API/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── CartController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   └── WishlistController.php
│   │   │   └── Admin/
│   │   │       ├── DashboardController.php
│   │   │       ├── ProductController.php
│   │   │       ├── OrderController.php
│   │   │       └── UserController.php
│   │   ├── Middleware/
│   │   ├── Requests/
│   │   └── Resources/
│   ├── Models/
│   ├── Services/
│   └── Traits/
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── routes/
│   ├── api.php
│   └── admin.php
└── tests/
```

### Security Features
- **JWT Token Authentication**
- **CSRF Protection**
- **SQL Injection Protection**
- **XSS Protection**
- **Rate Limiting**
- **Input Validation**
- **Password Hashing**
- **Role-based Access Control**

### Performance Optimization
- **Database Indexing**
- **Query Optimization**
- **Redis Caching**
- **Image Optimization**
- **API Response Compression**
- **Database Connection Pooling**

---

## 📋 Development Priorities

### Phase 1: Core APIs (Week 1-2)
1. ✅ User Authentication APIs
2. ✅ Products APIs (List, Details, Search)
3. ✅ Categories APIs
4. ✅ Basic Cart APIs

### Phase 2: E-commerce Features (Week 3-4)
1. ✅ Advanced Cart Management
2. ✅ Wishlist APIs
3. ✅ Order Management
4. ✅ Payment Integration

### Phase 3: Admin Panel (Week 5-6)
1. ✅ Admin Authentication
2. ✅ Product Management
3. ✅ Order Management
4. ✅ User Management

### Phase 4: Advanced Features (Week 7-8)
1. ✅ Analytics & Reports
2. ✅ Contact Management
3. ✅ Newsletter System
4. ✅ Coupon System

### Phase 5: Testing & Optimization (Week 9-10)
1. ✅ API Testing
2. ✅ Performance Optimization
3. ✅ Security Hardening
4. ✅ Documentation

---

## 🚀 Deployment Plan

### Environment Setup
- **Development:** Local Laravel with MySQL
- **Staging:** Staging server for testing
- **Production:** Production server with load balancing

### Server Requirements
- **PHP:** 8.2+
- **MySQL:** 8.0+
- **Redis:** 6.0+
- **Composer:** 2.0+
- **Node.js:** 18+ (for admin panel assets)

### Deployment Steps
1. **Server Configuration**
2. **Database Setup**
3. **Environment Configuration**
4. **SSL Certificate Installation**
5. **Domain Configuration**
6. **Monitoring Setup**

---

## 📚 Documentation Requirements

### API Documentation
- **Postman Collection**
- **OpenAPI Specification**
- **Code Examples**
- **Authentication Guide**

### Developer Documentation
- **Setup Instructions**
- **Database Schema**
- **API Reference**
- **Testing Guide**

---

## 🎯 Success Metrics

### Performance Targets
- **API Response Time:** < 200ms
- **Database Queries:** < 5 per request
- **Cache Hit Rate:** > 80%
- **Uptime:** 99.9%

### Security Standards
- **OWASP Compliance**
- **Regular Security Audits**
- **Penetration Testing**
- **Vulnerability Scanning**

---

*هذه الخطة شاملة وتغطي جميع احتياجات المشروع بناءً على تحليل دقيق للواجهة الأمامية المُنفذة. يمكن البدء في التطوير فوراً باستخدام هذه المواصفات.* 