# 🚀 Laravel Backend Plan - BS Company E-commerce

## 📋 نظرة عامة

هذا الملف يحتوي على **كل ما تحتاجه لبناء Laravel Backend** للمتجر الإلكتروني بناءً على الـ Frontend الموجود + Admin Dashboard.

---

## 🔍 تحليل Frontend الموجود

### ✅ **الصفحات والوظائف الحالية:**

#### 🏠 **الصفحة الرئيسية (`/`)**
- عرض منتجات مميزة
- إحصائيات الشركة
- نظرة عامة على الفئات

#### 🛍️ **صفحة المنتجات (`/products`)**
- قائمة المنتجات مع فلترة
- البحث بالاسم
- ترتيب حسب السعر/التقييم
- فلترة حسب الفئة
- إضافة للسلة والـ wishlist

#### 📦 **تفاصيل المنتج (`/products/[id]`)**
- معلومات المنتج الكاملة
- صور المنتج
- المواصفات التقنية
- إضافة للسلة/wishlist
- منتجات مشابهة

#### 🛒 **سلة التسوق (`/cart`)**
- عرض المنتجات المضافة
- تعديل الكميات
- حساب الإجمالي والضرائب
- تطبيق كوبونات الخصم
- إجراء الطلب

#### ❤️ **قائمة الأمنيات (`/wishlist`)**
- عرض المنتجات المحفوظة
- إضافة للسلة
- إزالة من القائمة

#### 🔐 **صفحة المصادقة (`/auth`)**
- تسجيل دخول
- إنشاء حساب جديد
- validation كامل

#### 👤 **لوحة المستخدم (`/dashboard`)**
- معلومات الحساب
- سجل الطلبات
- إدارة الملف الشخصي
- قائمة الأمنيات

#### 📂 **صفحة الفئات (`/categories`)**
- عرض جميع الفئات
- منتجات كل فئة

#### 📄 **صفحات إضافية**
- صفحة عن الشركة (`/about`)
- صفحة اتصل بنا (`/contact`)

---

## 🌍 **نظام متعدد اللغات (Localization)**

### **📋 المتطلبات:**
- **دعم اللغتين:** العربية (افتراضي) والإنجليزية
- **هيكل قاعدة البيانات:** تخزين المحتوى بكلا اللغتين
- **استجابة API:** إرجاع المحتوى حسب معامل `lang`
- **واجهة الإدارة:** حقول إدخال لكلا اللغتين

### **🔧 التنفيذ:**

#### **الخيار الأول: JSON Columns (موصى به)**
```sql
-- مثال جدول products
name_ar VARCHAR(255) NOT NULL,
name_en VARCHAR(255) NOT NULL,
description_ar TEXT NOT NULL,
description_en TEXT NOT NULL,
-- أو استخدام JSON
translations JSON NOT NULL -- {"ar": {"name": "...", "description": "..."}, "en": {...}}
```

#### **الخيار الثاني: جدول ترجمة منفصل**
```sql
CREATE TABLE translations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    translatable_type VARCHAR(255) NOT NULL, -- 'Product', 'Category', etc.
    translatable_id BIGINT NOT NULL,
    language_code VARCHAR(2) NOT NULL,       -- 'ar' or 'en'
    field_name VARCHAR(50) NOT NULL,         -- 'name', 'description', etc.
    field_value TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_translation (translatable_type, translatable_id, language_code, field_name)
);
```

#### **🚀 Laravel Package الموصى به:**
```bash
composer require spatie/laravel-translatable
```

#### **📝 مثال API Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "مثقاب كهربائي احترافي", // Arabic when lang=ar
        "description": "مثقاب كهربائي بمحرك قوي...",
        "price": "$299"
      }
    ]
  },
  "message": "تم جلب المنتجات بنجاح"
}
```

---

## 🗄️ هيكل قاعدة البيانات المطلوب

### 📊 **الجداول الأساسية:**

#### 1. **users**
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    address TEXT,
    role ENUM('user', 'admin') DEFAULT 'user',
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. **categories**
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    image VARCHAR(255),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3. **products**
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2) NOT NULL,
    category_id BIGINT NOT NULL,
    image VARCHAR(255) NOT NULL,
    images JSON,
    rating DECIMAL(3,1) DEFAULT 0.0,
    reviews_count INT DEFAULT 0,
    features JSON,
    specifications JSON,
    badge VARCHAR(100),
    badge_color VARCHAR(50),
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

#### 4. **cart_items**
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

#### 5. **wishlist_items**
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

#### 6. **orders**
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) DEFAULT 0.00,
    discount DECIMAL(10,2) DEFAULT 0.00,
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### 7. **order_items**
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

#### 8. **promo_codes**
```sql
CREATE TABLE promo_codes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0.00,
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 9. **contact_messages**
```sql
CREATE TABLE contact_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    department VARCHAR(50) NOT NULL,
    status ENUM('new', 'in_progress', 'resolved') DEFAULT 'new',
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 10. **settings**
```sql
CREATE TABLE settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    `key` VARCHAR(255) UNIQUE NOT NULL,
    `value` TEXT NOT NULL,
    `type` ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔧 APIs المطلوبة للـ Frontend

### 🔐 **1. Authentication APIs**
```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});
```

**المطلوب من Frontend:**
- POST `/api/auth/register` - إنشاء حساب جديد
- POST `/api/auth/login` - تسجيل دخول
- POST `/api/auth/logout` - تسجيل خروج
- GET `/api/auth/me` - معلومات المستخدم الحالي

### 🛍️ **2. Products APIs**
```php
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);              // قائمة المنتجات مع فلترة
    Route::get('featured', [ProductController::class, 'featured']);    // المنتجات المميزة
    Route::get('related/{id}', [ProductController::class, 'related']); // منتجات مشابهة
    Route::get('{id}', [ProductController::class, 'show']);            // تفاصيل منتج واحد
});
```

**المطلوب من Frontend (مع دعم اللغات):**
- GET `/api/products?lang=ar&category=power-tools&search=drill&sort=price&order=asc&page=1`
- GET `/api/products/featured?lang=ar` - للصفحة الرئيسية
- GET `/api/products/related/5?lang=ar` - للمنتجات المشابهة
- GET `/api/products/1?lang=ar` - تفاصيل المنتج

**📝 Parameters:**
- `lang` (string): اللغة المطلوبة (`ar` أو `en`) - افتراضي: `ar`
- `category` (string): فلترة حسب الفئة
- `search` (string): البحث في اسم المنتج ووصفه
- `sort` (string): ترتيب (`name`, `price`, `rating`, `created_at`)
- `order` (string): اتجاه الترتيب (`asc`, `desc`)
- `page` (int): رقم الصفحة للتصفح

### 📂 **3. Categories APIs**
```php
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);        // جميع الفئات
    Route::get('{slug}', [CategoryController::class, 'show']);    // فئة محددة مع منتجاتها
});
```

**المطلوب من Frontend (مع دعم اللغات):**
- GET `/api/categories?lang=ar` - لصفحة الفئات
- GET `/api/categories/power-tools?lang=ar` - منتجات فئة محددة

**📝 Parameters:**
- `lang` (string): اللغة المطلوبة (`ar` أو `en`) - افتراضي: `ar`

### 🛒 **4. Cart APIs**
```php
Route::middleware('auth:sanctum')->prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);                // عرض السلة
    Route::post('add', [CartController::class, 'add']);               // إضافة للسلة
    Route::put('update/{id}', [CartController::class, 'update']);     // تحديث الكمية
    Route::delete('remove/{id}', [CartController::class, 'remove']);  // إزالة من السلة
    Route::delete('clear', [CartController::class, 'clear']);         // مسح السلة
});
```

**المطلوب من Frontend:**
- GET `/api/cart` - عرض محتويات السلة
- POST `/api/cart/add` - إضافة منتج للسلة
- PUT `/api/cart/update/1` - تحديث كمية منتج
- DELETE `/api/cart/remove/1` - إزالة منتج
- DELETE `/api/cart/clear` - مسح السلة كاملة

### ❤️ **5. Wishlist APIs**
```php
Route::middleware('auth:sanctum')->prefix('wishlist')->group(function () {
    Route::get('/', [WishlistController::class, 'index']);                        // عرض القائمة
    Route::post('add', [WishlistController::class, 'add']);                       // إضافة للقائمة
    Route::delete('remove/{product_id}', [WishlistController::class, 'remove']); // إزالة من القائمة
    Route::get('check/{product_id}', [WishlistController::class, 'check']);      // فحص وجود المنتج
});
```

**المطلوب من Frontend:**
- GET `/api/wishlist` - قائمة الأمنيات
- POST `/api/wishlist/add` - إضافة للقائمة
- DELETE `/api/wishlist/remove/1` - إزالة من القائمة
- GET `/api/wishlist/check/1` - فحص إذا كان المنتج في القائمة

### 👤 **6. User Profile APIs**
```php
Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('profile', [UserController::class, 'profile']);          // معلومات الحساب
    Route::put('profile', [UserController::class, 'updateProfile']);    // تحديث الملف الشخصي
    Route::put('password', [UserController::class, 'changePassword']);  // تغيير كلمة المرور
});
```

**المطلوب من Frontend:**
- GET `/api/user/profile` - معلومات الحساب
- PUT `/api/user/profile` - تحديث المعلومات
- PUT `/api/user/password` - تغيير كلمة المرور

### 📦 **7. Orders APIs**
```php
Route::middleware('auth:sanctum')->prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);          // سجل الطلبات
    Route::get('{id}', [OrderController::class, 'show']);        // تفاصيل طلب محدد
    Route::post('create', [OrderController::class, 'create']);   // إنشاء طلب جديد
});
```

**المطلوب من Frontend:**
- GET `/api/orders` - سجل الطلبات للمستخدم
- GET `/api/orders/ORD-123` - تفاصيل طلب محدد
- POST `/api/orders/create` - إنشاء طلب جديد من السلة

### 🎫 **8. Promo Codes APIs**
```php
Route::middleware('auth:sanctum')->prefix('promo-code')->group(function () {
    Route::post('validate', [PromoCodeController::class, 'validate']); // التحقق من صحة الكوبون
});
```

**المطلوب من Frontend:**
- POST `/api/promo-code/validate` - التحقق من كوبون الخصم

### 📧 **9. Contact APIs**
```php
Route::post('contact', [ContactController::class, 'submit']); // إرسال رسالة
```

**المطلوب من Frontend:**
- POST `/api/contact` - إرسال رسالة من صفحة اتصل بنا

### ⚙️ **10. Settings APIs**
```php
Route::get('settings', [SettingsController::class, 'index']); // إعدادات عامة
```

**المطلوب من Frontend:**
- GET `/api/settings` - إعدادات الموقع العامة

---

## 👨‍💼 Admin Dashboard APIs

### 📊 **1. Admin Dashboard Stats**
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('dashboard/stats', [AdminController::class, 'dashboardStats']);
});
```

### 🛍️ **2. Admin Products Management**
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/products')->group(function () {
    Route::get('/', [AdminProductController::class, 'index']);         // قائمة المنتجات
    Route::post('/', [AdminProductController::class, 'store']);        // إضافة منتج جديد
    Route::get('{id}', [AdminProductController::class, 'show']);       // تفاصيل منتج
    Route::put('{id}', [AdminProductController::class, 'update']);     // تحديث منتج
    Route::delete('{id}', [AdminProductController::class, 'destroy']); // حذف منتج
    Route::post('{id}/upload-image', [AdminProductController::class, 'uploadImage']); // رفع صورة
});
```

### 📂 **3. Admin Categories Management**
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/categories')->group(function () {
    Route::get('/', [AdminCategoryController::class, 'index']);
    Route::post('/', [AdminCategoryController::class, 'store']);
    Route::put('{id}', [AdminCategoryController::class, 'update']);
    Route::delete('{id}', [AdminCategoryController::class, 'destroy']);
});
```

### 📦 **4. Admin Orders Management**
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/orders')->group(function () {
    Route::get('/', [AdminOrderController::class, 'index']);              // جميع الطلبات
    Route::get('{id}', [AdminOrderController::class, 'show']);            // تفاصيل طلب
    Route::put('{id}/status', [AdminOrderController::class, 'updateStatus']); // تحديث حالة الطلب
});
```

### 👥 **5. Admin Users Management**
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/users')->group(function () {
    Route::get('/', [AdminUserController::class, 'index']);         // قائمة المستخدمين
    Route::get('{id}', [AdminUserController::class, 'show']);       // تفاصيل مستخدم
    Route::put('{id}/status', [AdminUserController::class, 'updateStatus']); // تفعيل/إلغاء المستخدم
});
```

### 📧 **6. Admin Contact Messages**
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/contact')->group(function () {
    Route::get('/', [AdminContactController::class, 'index']);              // جميع الرسائل
    Route::get('{id}', [AdminContactController::class, 'show']);            // تفاصيل رسالة
    Route::put('{id}/status', [AdminContactController::class, 'updateStatus']); // تحديث حالة الرسالة
});
```

### 🎫 **7. Admin Promo Codes Management**
```php
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin/promo-codes')->group(function () {
    Route::get('/', [AdminPromoCodeController::class, 'index']);
    Route::post('/', [AdminPromoCodeController::class, 'store']);
    Route::put('{id}', [AdminPromoCodeController::class, 'update']);
    Route::delete('{id}', [AdminPromoCodeController::class, 'destroy']);
});
```

---

## 🏗️ Laravel Setup Commands

### 1. **إنشاء المشروع**
```bash
composer create-project laravel/laravel bs-backend
cd bs-backend
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 2. **إنشاء Models**
```bash
php artisan make:model Category -m
php artisan make:model Product -m
php artisan make:model CartItem -m
php artisan make:model WishlistItem -m
php artisan make:model Order -m
php artisan make:model OrderItem -m
php artisan make:model PromoCode -m
php artisan make:model ContactMessage -m
php artisan make:model Setting -m
```

### 3. **إنشاء Controllers**
```bash
# User Controllers
php artisan make:controller Api/AuthController
php artisan make:controller Api/UserController
php artisan make:controller Api/ProductController
php artisan make:controller Api/CategoryController
php artisan make:controller Api/CartController
php artisan make:controller Api/WishlistController
php artisan make:controller Api/OrderController
php artisan make:controller Api/PromoCodeController
php artisan make:controller Api/ContactController
php artisan make:controller Api/SettingsController

# Admin Controllers
php artisan make:controller Api/Admin/AdminController
php artisan make:controller Api/Admin/AdminProductController
php artisan make:controller Api/Admin/AdminCategoryController
php artisan make:controller Api/Admin/AdminOrderController
php artisan make:controller Api/Admin/AdminUserController
php artisan make:controller Api/Admin/AdminContactController
php artisan make:controller Api/Admin/AdminPromoCodeController
```

### 4. **إنشاء Requests للـ Validation**
```bash
php artisan make:request Auth/RegisterRequest
php artisan make:request Auth/LoginRequest
php artisan make:request Product/StoreProductRequest
php artisan make:request Cart/AddToCartRequest
php artisan make:request Order/CreateOrderRequest
```

### 5. **إنشاء Middleware للـ Admin**
```bash
php artisan make:middleware AdminMiddleware
```

---

## 🔒 إعدادات الأمان

### 1. **في `.env`**
```env
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000
```

### 2. **في `config/cors.php`**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'supports_credentials' => true,
```

### 3. **في `app/Http/Kernel.php`**
```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

---

## 📊 Sample Data للاختبار

### Categories
```sql
INSERT INTO categories (name, slug, description, icon) VALUES
('Power Tools', 'power-tools', 'Professional power tools', '🔧'),
('Hand Tools', 'hand-tools', 'Quality hand tools', '🔨'),
('Safety Equipment', 'safety-equipment', 'Safety gear', '🦺'),
('Hardware', 'hardware', 'Bolts and screws', '⚙️'),
('Heavy Machinery', 'heavy-machinery', 'Industrial machinery', '🚜');
```

### Settings
```sql
INSERT INTO settings (`key`, `value`, `type`) VALUES
('tax_rate', '0.10', 'number'),
('shipping_cost', '29.00', 'number'),
('currency', 'USD', 'string'),
('company_name', 'BS Company', 'string'),
('company_email', 'info@bscompany.com', 'string');
```

### Admin User
```sql
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@bscompany.com', '$2y$10$hashed_password', 'admin');
```

---

## 🚦 خطة التطوير

### 🟢 **أسبوع 1 - الأساسيات**
1. إعداد Laravel + Sanctum
2. إنشاء Database Schema
3. Authentication APIs
4. Products APIs الأساسية

### 🟡 **أسبوع 2 - الوظائف الرئيسية**
1. Cart APIs
2. Wishlist APIs  
3. Categories APIs
4. User Profile APIs

### 🔴 **أسبوع 3 - اكتمال النظام**
1. Orders APIs
2. Admin Dashboard APIs
3. Contact & Settings APIs
4. Testing & Integration

---

## 🎯 ملاحظات مهمة

### ✅ **أولويات:**
1. **ابدأ بـ Authentication** - أساسي لكل شيء
2. **Products APIs** - قلب المتجر
3. **Cart & Wishlist** - تجربة المستخدم
4. **Admin Dashboard** - إدارة المحتوى

### 🔧 **التكامل مع Frontend:**
- استخدم نفس أسماء الحقول الموجودة في Frontend
- تأكد من format البيانات المطلوب
- اختبر كل API مع Frontend

### 🚀 **للإنتاج:**
- إعداد Rate Limiting
- إضافة Logging شامل
- تحسين Database Queries
- إعداد Backup تلقائي

---

**🎯 الهدف: ربط سريع ومباشر مع Frontend الموجود + Admin Dashboard كامل!** 