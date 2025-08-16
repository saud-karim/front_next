# 🏗️ Laravel Backend Structure - BuildTools BS

## 📁 Project Structure

```
laravel-backend/
├── app/
│   ├── Console/
│   │   ├── Commands/
│   │   └── Kernel.php
│   ├── Exceptions/
│   │   └── Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── API/
│   │   │   │   ├── V1/
│   │   │   │   │   ├── AuthController.php
│   │   │   │   │   ├── ProductController.php
│   │   │   │   │   ├── CategoryController.php
│   │   │   │   │   ├── CartController.php
│   │   │   │   │   ├── OrderController.php
│   │   │   │   │   ├── WishlistController.php
│   │   │   │   │   ├── ContactController.php
│   │   │   │   │   ├── NewsletterController.php
│   │   │   │   │   ├── SearchController.php
│   │   │   │   │   └── UserDashboardController.php
│   │   │   │   └── BaseApiController.php
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── UserController.php
│   │   │   │   ├── ContactController.php
│   │   │   │   ├── CouponController.php
│   │   │   │   ├── ReportController.php
│   │   │   │   └── AnalyticsController.php
│   │   │   └── Controller.php
│   │   ├── Middleware/
│   │   │   ├── AdminMiddleware.php
│   │   │   ├── ApiVersionMiddleware.php
│   │   │   ├── LanguageMiddleware.php
│   │   │   ├── RateLimitMiddleware.php
│   │   │   ├── LogRequestMiddleware.php
│   │   │   └── Authenticate.php
│   │   ├── Requests/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   └── RegisterRequest.php
│   │   │   ├── Product/
│   │   │   │   ├── CreateProductRequest.php
│   │   │   │   ├── UpdateProductRequest.php
│   │   │   │   └── ProductFilterRequest.php
│   │   │   ├── Order/
│   │   │   │   └── CreateOrderRequest.php
│   │   │   ├── Contact/
│   │   │   │   └── ContactMessageRequest.php
│   │   │   └── BaseRequest.php
│   │   ├── Resources/
│   │   │   ├── Product/
│   │   │   │   ├── ProductResource.php
│   │   │   │   ├── ProductCollection.php
│   │   │   │   └── ProductDetailResource.php
│   │   │   ├── Category/
│   │   │   │   ├── CategoryResource.php
│   │   │   │   └── CategoryCollection.php
│   │   │   ├── User/
│   │   │   │   ├── UserResource.php
│   │   │   │   └── ProfileResource.php
│   │   │   ├── Order/
│   │   │   │   ├── OrderResource.php
│   │   │   │   ├── OrderCollection.php
│   │   │   │   └── OrderDetailResource.php
│   │   │   └── BaseResource.php
│   │   └── Kernel.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── ProductFeature.php
│   │   ├── ProductSpecification.php
│   │   ├── ProductImage.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   ├── CartItem.php
│   │   ├── WishlistItem.php
│   │   ├── Coupon.php
│   │   ├── ContactMessage.php
│   │   ├── NewsletterSubscription.php
│   │   └── ActivityLog.php
│   ├── Services/
│   │   ├── Auth/
│   │   │   ├── AuthService.php
│   │   │   └── JWTService.php
│   │   ├── Product/
│   │   │   ├── ProductService.php
│   │   │   ├── ProductSearchService.php
│   │   │   └── ProductRecommendationService.php
│   │   ├── Cart/
│   │   │   ├── CartService.php
│   │   │   └── CouponService.php
│   │   ├── Order/
│   │   │   ├── OrderService.php
│   │   │   └── OrderStatusService.php
│   │   ├── Payment/
│   │   │   ├── PaymentService.php
│   │   │   └── PaymentGatewayService.php
│   │   ├── Notification/
│   │   │   ├── EmailService.php
│   │   │   ├── SMSService.php
│   │   │   └── NotificationService.php
│   │   ├── Analytics/
│   │   │   ├── AnalyticsService.php
│   │   │   └── ReportService.php
│   │   ├── File/
│   │   │   ├── FileUploadService.php
│   │   │   └── ImageProcessingService.php
│   │   └── Cache/
│   │       └── CacheService.php
│   ├── Repositories/
│   │   ├── Contracts/
│   │   │   ├── ProductRepositoryInterface.php
│   │   │   ├── CategoryRepositoryInterface.php
│   │   │   ├── OrderRepositoryInterface.php
│   │   │   └── UserRepositoryInterface.php
│   │   ├── Eloquent/
│   │   │   ├── ProductRepository.php
│   │   │   ├── CategoryRepository.php
│   │   │   ├── OrderRepository.php
│   │   │   └── UserRepository.php
│   │   └── BaseRepository.php
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   ├── AuthServiceProvider.php
│   │   ├── EventServiceProvider.php
│   │   ├── RouteServiceProvider.php
│   │   ├── RepositoryServiceProvider.php
│   │   ├── PaymentServiceProvider.php
│   │   └── CacheServiceProvider.php
│   ├── Events/
│   │   ├── User/
│   │   │   ├── UserRegistered.php
│   │   │   └── UserLoggedIn.php
│   │   ├── Order/
│   │   │   ├── OrderCreated.php
│   │   │   ├── OrderStatusChanged.php
│   │   │   └── OrderDelivered.php
│   │   └── Product/
│   │       └── ProductViewed.php
│   ├── Listeners/
│   │   ├── User/
│   │   │   ├── SendWelcomeEmail.php
│   │   │   └── LogUserActivity.php
│   │   ├── Order/
│   │   │   ├── SendOrderConfirmation.php
│   │   │   ├── NotifyAdminNewOrder.php
│   │   │   └── UpdateInventory.php
│   │   └── Product/
│   │       └── IncrementViewCount.php
│   ├── Jobs/
│   │   ├── Email/
│   │   │   ├── SendEmailJob.php
│   │   │   └── SendNewsletterJob.php
│   │   ├── Order/
│   │   │   └── ProcessOrderJob.php
│   │   ├── Analytics/
│   │   │   └── GenerateReportJob.php
│   │   └── Cache/
│   │       └── ClearCacheJob.php
│   ├── Traits/
│   │   ├── ApiResponseTrait.php
│   │   ├── MultilingualTrait.php
│   │   ├── CacheableTrait.php
│   │   ├── LoggableTrait.php
│   │   └── UuidTrait.php
│   ├── Enums/
│   │   ├── OrderStatus.php
│   │   ├── PaymentStatus.php
│   │   ├── UserRole.php
│   │   └── ProductStatus.php
│   └── Rules/
│       ├── ValidCouponCode.php
│       ├── ValidCategory.php
│       └── ValidProductId.php
├── bootstrap/
│   ├── app.php
│   └── cache/
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── cors.php
│   ├── database.php
│   ├── filesystems.php
│   ├── jwt.php
│   ├── mail.php
│   ├── payment.php
│   ├── services.php
│   └── sanctum.php
├── database/
│   ├── factories/
│   │   ├── UserFactory.php
│   │   ├── ProductFactory.php
│   │   ├── CategoryFactory.php
│   │   └── OrderFactory.php
│   ├── migrations/
│   │   ├── 2024_01_01_create_users_table.php
│   │   ├── 2024_01_02_create_categories_table.php
│   │   ├── 2024_01_03_create_products_table.php
│   │   ├── 2024_01_04_create_product_features_table.php
│   │   ├── 2024_01_05_create_product_specifications_table.php
│   │   ├── 2024_01_06_create_product_images_table.php
│   │   ├── 2024_01_07_create_orders_table.php
│   │   ├── 2024_01_08_create_order_items_table.php
│   │   ├── 2024_01_09_create_cart_items_table.php
│   │   ├── 2024_01_10_create_wishlist_items_table.php
│   │   ├── 2024_01_11_create_coupons_table.php
│   │   ├── 2024_01_12_create_contact_messages_table.php
│   │   └── 2024_01_13_create_newsletter_subscriptions_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       ├── CategorySeeder.php
│       ├── ProductSeeder.php
│       └── CouponSeeder.php
├── public/
│   ├── index.php
│   └── storage/
│       └── uploads/
├── resources/
│   ├── lang/
│   │   ├── en/
│   │   │   ├── auth.php
│   │   │   ├── validation.php
│   │   │   └── messages.php
│   │   └── ar/
│   │       ├── auth.php
│   │       ├── validation.php
│   │       └── messages.php
│   └── views/
│       └── emails/
│           ├── welcome.blade.php
│           ├── order-confirmation.blade.php
│           └── newsletter.blade.php
├── routes/
│   ├── api.php
│   ├── admin.php
│   ├── web.php
│   └── channels.php
├── storage/
│   ├── app/
│   │   ├── public/
│   │   └── uploads/
│   ├── framework/
│   │   ├── cache/
│   │   ├── sessions/
│   │   └── views/
│   └── logs/
├── tests/
│   ├── Feature/
│   │   ├── Auth/
│   │   │   ├── LoginTest.php
│   │   │   └── RegisterTest.php
│   │   ├── Product/
│   │   │   ├── ProductListTest.php
│   │   │   └── ProductDetailTest.php
│   │   ├── Cart/
│   │   │   └── CartTest.php
│   │   └── Order/
│   │       └── OrderTest.php
│   ├── Unit/
│   │   ├── Services/
│   │   │   ├── ProductServiceTest.php
│   │   │   └── CartServiceTest.php
│   │   └── Models/
│   │       ├── ProductTest.php
│   │       └── UserTest.php
│   ├── TestCase.php
│   └── CreatesApplication.php
├── vendor/
├── .env
├── .gitignore
├── artisan
├── composer.json
└── composer.lock
```

---

## 🏛️ Models Description

### Core Models

#### **User Model**
- **Purpose:** إدارة بيانات المستخدمين والمصادقة
- **Features:** Profile management, authentication, roles
- **Relationships:** HasMany Orders, HasMany WishlistItems, HasMany CartItems
- **Attributes:** name, email, password, phone, address, company, role, status

#### **Product Model**
- **Purpose:** إدارة بيانات المنتجات متعددة اللغات
- **Features:** Multilingual support, SEO, inventory tracking
- **Relationships:** BelongsTo Category, HasMany ProductFeatures, HasMany ProductImages, HasMany ProductSpecifications
- **Attributes:** name_ar, name_en, description_ar, description_en, price, stock_quantity, rating

#### **Category Model**
- **Purpose:** تصنيف المنتجات بشكل هيكلي
- **Features:** Hierarchical categories, multilingual names
- **Relationships:** HasMany Products, BelongsTo Parent Category, HasMany Children Categories
- **Attributes:** id, name_ar, name_en, description_ar, description_en, parent_id, sort_order

#### **Order Model**
- **Purpose:** إدارة طلبات الشراء ومراحلها
- **Features:** Order tracking, status management, payment integration
- **Relationships:** BelongsTo User, HasMany OrderItems
- **Attributes:** id, user_id, status, total_amount, payment_status, shipping_address

#### **ProductFeature Model**
- **Purpose:** خصائص المنتجات متعددة اللغات
- **Features:** Multilingual feature descriptions
- **Relationships:** BelongsTo Product
- **Attributes:** product_id, feature_ar, feature_en, sort_order

#### **ProductSpecification Model**
- **Purpose:** مواصفات تقنية للمنتجات
- **Features:** Key-value specifications with multilingual support
- **Relationships:** BelongsTo Product
- **Attributes:** product_id, spec_key, spec_value_ar, spec_value_en

#### **CartItem Model**
- **Purpose:** عناصر سلة التسوق
- **Features:** Quantity management, user-specific carts
- **Relationships:** BelongsTo User, BelongsTo Product
- **Attributes:** user_id, product_id, quantity

#### **WishlistItem Model**
- **Purpose:** قائمة أمنيات المستخدم
- **Features:** Personal product bookmarking
- **Relationships:** BelongsTo User, BelongsTo Product
- **Attributes:** user_id, product_id, created_at

#### **Coupon Model**
- **Purpose:** إدارة كوبونات الخصم
- **Features:** Percentage/fixed discounts, usage limits, expiry dates
- **Relationships:** HasMany OrderCoupons
- **Attributes:** code, type, value, usage_limit, valid_from, valid_until

#### **ContactMessage Model**
- **Purpose:** رسائل التواصل من العملاء
- **Features:** Message categorization, status tracking
- **Relationships:** None (standalone)
- **Attributes:** name, email, subject, message, status, project_type

---

## 🎮 Controllers Description

### API Controllers (Version 1)

#### **AuthController**
- **Purpose:** إدارة المصادقة والتسجيل
- **Methods:** register(), login(), logout(), profile(), updateProfile()
- **Features:** JWT token management, password validation, email verification
- **Security:** Rate limiting, input validation, password hashing

#### **ProductController**
- **Purpose:** عرض وإدارة المنتجات للمستخدمين
- **Methods:** index(), show(), featured(), recommendations(), search()
- **Features:** Filtering, sorting, pagination, multilingual responses
- **Caching:** Product lists, featured products, search results

#### **CategoryController**
- **Purpose:** إدارة فئات المنتجات
- **Methods:** index(), show(), products()
- **Features:** Hierarchical category display, product counts
- **Optimization:** Eager loading, category tree caching

#### **CartController**
- **Purpose:** إدارة سلة التسوق
- **Methods:** index(), add(), update(), remove(), applyCoupon()
- **Features:** Quantity validation, price calculation, coupon application
- **Business Logic:** Stock checking, price updates, tax calculation

#### **OrderController**
- **Purpose:** إدارة الطلبات
- **Methods:** store(), index(), show(), cancel()
- **Features:** Order creation, status tracking, payment integration
- **Notifications:** Order confirmation, status updates

#### **WishlistController**
- **Purpose:** إدارة قائمة الأمنيات
- **Methods:** index(), add(), remove()
- **Features:** Personal product bookmarking, quick cart addition
- **Authorization:** User-specific wishlist access

#### **ContactController**
- **Purpose:** معالجة رسائل التواصل
- **Methods:** store(), departments()
- **Features:** Message categorization, auto-responses
- **Notifications:** Admin notifications, customer confirmations

#### **SearchController**
- **Purpose:** البحث الشامل في الموقع
- **Methods:** search(), suggestions(), filters()
- **Features:** Multi-model search, search suggestions, advanced filters
- **Performance:** Search indexing, result caching

### Admin Controllers

#### **Admin/DashboardController**
- **Purpose:** لوحة تحكم الإدارة
- **Methods:** index(), stats(), charts()
- **Features:** Analytics display, KPI monitoring, real-time updates
- **Data Sources:** Sales reports, user statistics, inventory alerts

#### **Admin/ProductController**
- **Purpose:** إدارة المنتجات من لوحة الإدارة
- **Methods:** index(), create(), store(), show(), edit(), update(), destroy()
- **Features:** CRUD operations, bulk actions, image management
- **Validation:** Complex product validation, multilingual content

#### **Admin/OrderController**
- **Purpose:** إدارة الطلبات من لوحة الإدارة
- **Methods:** index(), show(), updateStatus(), reports()
- **Features:** Order processing, status management, tracking
- **Reports:** Sales reports, order analytics

#### **Admin/UserController**
- **Purpose:** إدارة المستخدمين
- **Methods:** index(), show(), ban(), unban(), reports()
- **Features:** User management, role assignment, activity monitoring
- **Security:** Admin-only access, audit logging

---

## 🔧 Services Description

### Authentication Services

#### **AuthService**
- **Purpose:** خدمات المصادقة المركزية
- **Features:** User registration, login validation, password management
- **Methods:** register(), authenticate(), refreshToken(), resetPassword()
- **Security:** Password hashing, token generation, rate limiting

#### **JWTService**
- **Purpose:** إدارة JWT tokens
- **Features:** Token generation, validation, refresh, blacklisting
- **Methods:** generateToken(), validateToken(), refreshToken(), blacklistToken()
- **Configuration:** Token expiry, refresh intervals, secret management

### Product Services

#### **ProductService**
- **Purpose:** منطق الأعمال للمنتجات
- **Features:** Product CRUD, inventory management, price calculations
- **Methods:** getProducts(), getProduct(), updateStock(), calculatePrices()
- **Business Rules:** Stock validation, pricing rules, availability checks

#### **ProductSearchService**
- **Purpose:** خدمة البحث المتقدم
- **Features:** Full-text search, filters, sorting, suggestions
- **Methods:** search(), suggest(), applyFilters(), getSortOptions()
- **Performance:** Search indexing, query optimization, result caching

#### **ProductRecommendationService**
- **Purpose:** نظام التوصيات
- **Features:** Personalized recommendations, related products, trending items
- **Methods:** getRecommendations(), getRelatedProducts(), getTrendingProducts()
- **Algorithms:** Collaborative filtering, content-based recommendations

### Cart & Order Services

#### **CartService**
- **Purpose:** إدارة سلة التسوق
- **Features:** Cart operations, price calculations, validation
- **Methods:** addItem(), updateQuantity(), removeItem(), calculateTotal()
- **Business Logic:** Stock verification, price updates, quantity limits

#### **OrderService**
- **Purpose:** معالجة الطلبات
- **Features:** Order creation, validation, status management
- **Methods:** createOrder(), validateOrder(), updateStatus(), cancelOrder()
- **Integration:** Payment processing, inventory updates, notifications

#### **CouponService**
- **Purpose:** إدارة كوبونات الخصم
- **Features:** Coupon validation, discount calculation, usage tracking
- **Methods:** validateCoupon(), applyDiscount(), trackUsage()
- **Rules:** Usage limits, expiry validation, minimum order amounts

### Notification Services

#### **EmailService**
- **Purpose:** خدمة البريد الإلكتروني
- **Features:** Email sending, template management, queue handling
- **Methods:** sendEmail(), sendBulkEmail(), sendTemplate()
- **Templates:** Welcome emails, order confirmations, newsletters

#### **NotificationService**
- **Purpose:** نظام الإشعارات المركزي
- **Features:** Multi-channel notifications, user preferences
- **Methods:** send(), sendToUser(), sendToGroup(), schedule()
- **Channels:** Email, SMS, push notifications, in-app notifications

### Analytics Services

#### **AnalyticsService**
- **Purpose:** تحليلات وإحصائيات
- **Features:** Data collection, report generation, KPI calculation
- **Methods:** trackEvent(), generateReport(), getKPIs()
- **Metrics:** Sales analytics, user behavior, product performance

---

## 🛡️ Middleware Description

#### **AdminMiddleware**
- **Purpose:** التحقق من صلاحيات الإدارة
- **Features:** Admin role verification, admin area protection
- **Logic:** Check user role, redirect unauthorized users
- **Security:** Session validation, role-based access control

#### **ApiVersionMiddleware**
- **Purpose:** إدارة إصدارات API
- **Features:** API versioning, backward compatibility
- **Logic:** Route version resolution, version validation
- **Flexibility:** Multiple API versions support

#### **LanguageMiddleware**
- **Purpose:** تحديد لغة المحتوى
- **Features:** Language detection, locale setting, RTL support
- **Logic:** Header parsing, user preference detection
- **Fallback:** Default language handling

#### **RateLimitMiddleware**
- **Purpose:** تحديد معدل الطلبات
- **Features:** Request throttling, abuse prevention
- **Logic:** Request counting, time window validation
- **Configuration:** Different limits per endpoint

#### **LogRequestMiddleware**
- **Purpose:** تسجيل طلبات API
- **Features:** Request logging, response timing, error tracking
- **Data:** Request details, response status, execution time
- **Analysis:** Performance monitoring, usage analytics

---

## 📦 Packages & Dependencies

### Core Laravel Packages

#### **laravel/sanctum**
- **Purpose:** API authentication with tokens
- **Features:** SPA authentication, API token management
- **Usage:** Frontend authentication, secure API access

#### **spatie/laravel-permission**
- **Purpose:** إدارة الأدوار والصلاحيات
- **Features:** Role-based access control, permission management
- **Usage:** Admin roles, user permissions, access control

#### **spatie/laravel-query-builder**
- **Purpose:** بناء استعلامات API ديناميكية
- **Features:** Dynamic filtering, sorting, including relations
- **Usage:** Product filtering, search functionality

#### **tymon/jwt-auth**
- **Purpose:** JWT authentication
- **Features:** Token generation, validation, refresh
- **Usage:** API authentication, stateless sessions

### Multilingual Packages

#### **spatie/laravel-translatable**
- **Purpose:** دعم متعدد اللغات للنماذج
- **Features:** Model translation, fallback languages
- **Usage:** Product names, descriptions, categories

#### **mcamara/laravel-localization**
- **Purpose:** إدارة اللغات والمسارات
- **Features:** URL localization, language switching
- **Usage:** Language detection, locale management

### File & Image Packages

#### **spatie/laravel-medialibrary**
- **Purpose:** إدارة الملفات والصور
- **Features:** File uploads, image conversions, media collections
- **Usage:** Product images, user avatars, file management

#### **intervention/image**
- **Purpose:** معالجة الصور
- **Features:** Image resizing, cropping, optimization
- **Usage:** Thumbnail generation, image optimization

### Caching & Performance

#### **predis/predis**
- **Purpose:** Redis client for caching
- **Features:** Cache management, session storage, queue backend
- **Usage:** Application caching, session management

#### **spatie/laravel-responsecache**
- **Purpose:** تخزين استجابات API مؤقتاً
- **Features:** Response caching, cache invalidation
- **Usage:** API response caching, performance optimization

### Email & Notifications

#### **symfony/mailer**
- **Purpose:** خدمة البريد الإلكتروني
- **Features:** Email sending, template support, queue integration
- **Usage:** Order confirmations, newsletters, notifications

#### **laravel/horizon**
- **Purpose:** إدارة قوائم الانتظار
- **Features:** Queue monitoring, job processing, dashboard
- **Usage:** Email queues, background processing

### Payment Integration

#### **stripe/stripe-php**
- **Purpose:** معالجة المدفوعات
- **Features:** Payment processing, webhook handling
- **Usage:** Order payments, subscription management

#### **paypal/rest-api-sdk-php**
- **Purpose:** تكامل PayPal
- **Features:** PayPal payments, webhook integration
- **Usage:** Alternative payment method

### API Documentation

#### **darkaonline/l5-swagger**
- **Purpose:** توثيق API
- **Features:** Swagger/OpenAPI documentation generation
- **Usage:** API documentation, testing interface

#### **barryvdh/laravel-cors**
- **Purpose:** إدارة CORS
- **Features:** Cross-origin request handling
- **Usage:** Frontend API access, browser security

### Development & Testing

#### **laravel/telescope**
- **Purpose:** أداة تطوير ومراقبة
- **Features:** Query monitoring, request inspection, debugging
- **Usage:** Development debugging, performance monitoring

#### **phpunit/phpunit**
- **Purpose:** اختبار الوحدة
- **Features:** Unit testing, feature testing, mocking
- **Usage:** Code testing, quality assurance

#### **fakerphp/faker**
- **Purpose:** توليد بيانات تجريبية
- **Features:** Fake data generation, database seeding
- **Usage:** Testing data, development environment

---

## 🔗 Service Providers Description

#### **RepositoryServiceProvider**
- **Purpose:** ربط Repository Interfaces بـ Implementations
- **Features:** Dependency injection, interface binding
- **Usage:** Clean architecture, testable code

#### **PaymentServiceProvider**
- **Purpose:** تكوين خدمات الدفع
- **Features:** Payment gateway configuration, service binding
- **Usage:** Payment processing, gateway switching

#### **CacheServiceProvider**
- **Purpose:** إعداد نظام التخزين المؤقت
- **Features:** Cache driver configuration, optimization
- **Usage:** Performance improvement, data caching

#### **EventServiceProvider**
- **Purpose:** ربط الأحداث بالمستمعين
- **Features:** Event-listener mapping, queue configuration
- **Usage:** Order processing, notification sending

---

## 🎯 Repository Pattern

### Repository Interfaces
- **ProductRepositoryInterface:** Contract for product data operations
- **CategoryRepositoryInterface:** Contract for category data operations
- **OrderRepositoryInterface:** Contract for order data operations
- **UserRepositoryInterface:** Contract for user data operations

### Repository Implementations
- **ProductRepository:** Eloquent implementation for products
- **CategoryRepository:** Eloquent implementation for categories
- **OrderRepository:** Eloquent implementation for orders
- **UserRepository:** Eloquent implementation for users

### Benefits
- **Testability:** Easy mocking for unit tests
- **Flexibility:** Easy to switch between different data sources
- **Clean Code:** Separation of concerns, business logic isolation
- **Maintainability:** Centralized data access logic

---

## 🔄 Events & Listeners System

### User Events
- **UserRegistered:** Triggered when new user registers
- **UserLoggedIn:** Triggered on successful login

### Order Events
- **OrderCreated:** Triggered when new order is placed
- **OrderStatusChanged:** Triggered when order status updates
- **OrderDelivered:** Triggered when order is delivered

### Product Events
- **ProductViewed:** Triggered when product is viewed

### Event Listeners
- **SendWelcomeEmail:** Sends welcome email to new users
- **SendOrderConfirmation:** Sends order confirmation email
- **UpdateInventory:** Updates product inventory after order
- **LogUserActivity:** Logs user activities for analytics

---

## ⚙️ Jobs & Queues

### Email Jobs
- **SendEmailJob:** Handles email sending in background
- **SendNewsletterJob:** Processes newsletter sending

### Order Jobs
- **ProcessOrderJob:** Handles order processing workflows

### Analytics Jobs
- **GenerateReportJob:** Generates analytics reports

### Cache Jobs
- **ClearCacheJob:** Handles cache invalidation

---

## 🧪 Testing Structure

### Feature Tests
- **Authentication Tests:** Login, registration, logout
- **Product Tests:** Product listing, filtering, details
- **Cart Tests:** Add to cart, update, remove, checkout
- **Order Tests:** Order creation, status updates

### Unit Tests
- **Service Tests:** Business logic testing
- **Model Tests:** Model relationships, validation
- **Repository Tests:** Data access layer testing

### Testing Tools
- **PHPUnit:** Main testing framework
- **Faker:** Test data generation
- **Mockery:** Object mocking
- **Database Factories:** Model instance generation

---

## 🛠️ Configuration Files

### Core Configuration
- **app.php:** Application settings, timezone, locale
- **database.php:** Database connections, Redis configuration
- **cache.php:** Cache drivers, Redis settings
- **mail.php:** Email configuration, SMTP settings

### Security Configuration
- **auth.php:** Authentication guards, providers
- **cors.php:** CORS settings for API access
- **sanctum.php:** API token configuration

### Custom Configuration
- **jwt.php:** JWT token settings
- **payment.php:** Payment gateway configuration
- **services.php:** Third-party service configurations

---

*هذا التصميم يوفر structure شامل ومرن للـ Laravel backend مع أفضل الممارسات في تطوير APIs وإدارة البيانات متعددة اللغات.* 