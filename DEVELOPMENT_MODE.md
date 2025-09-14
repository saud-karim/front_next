# 🚧 وضع التطوير - Development Mode

## حالة النظام الحالية

### ✅ الفرونت إند (Frontend)
- **Port**: http://localhost:3000
- **Status**: يعمل بنجاح
- **Authentication**: نظام Fallback نشط

### ⚠️ الباك إند (Backend)
- **Port**: http://localhost:8000  
- **Status**: يعمل لكن API routes غير مُعرفة
- **Issue**: Laravel APIs `/api/v1/*` غير متاحة

## 🔐 تسجيل الدخول في وضع التطوير

### للمديرين (Admin Access):
1. **اذهب إلى**: `/dashboard` 
2. **Email**: أي email يحتوي على "admin" (مثل: `admin@test.com`)
3. **Password**: أي كلمة مرور
4. **Result**: سيحصل على admin token تلقائياً

### للمستخدمين العاديين:
1. **اذهب إلى**: `/auth`
2. **Email**: أي email (مثل: `user@test.com`)  
3. **Password**: أي كلمة مرور
4. **Result**: سيحصل على user token عادي

## 🎯 الصفحات المتاحة

| الصفحة | الرابط | الحالة |
|--------|--------|---------|
| الرئيسية | `/` | ✅ تعمل |
| تسجيل الدخول | `/auth` | ✅ تعمل (Fallback) |
| الداشبورد | `/dashboard` | ✅ تعمل (Fallback) |
| إدارة المنتجات | `/dashboard/products` | ✅ تعمل |
| إدارة العملاء | `/dashboard/customers` | ✅ تعمل |
| إدارة الطلبات | `/dashboard/orders` | ✅ تعمل |
| إدارة الفئات | `/dashboard/categories` | ✅ تعمل |
| التحليلات | `/dashboard/analytics` | ✅ تعمل |
| إدارة التقييمات | `/dashboard/reviews` | ✅ تعمل |

## 🛠️ إصلاح Laravel Backend

لتفعيل APIs الحقيقية، قم بما يلي:

### 1. تأكد من Laravel routes:
```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/register', [AuthController::class, 'register']);
    // باقي الـ routes...
});
```

### 2. تشغيل Laravel:
```bash
cd backend_project_folder
php artisan serve --port=8000
```

### 3. تحقق من CORS:
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

## 📝 ملاحظات التطوير

- **نظام Fallback**: يتم تفعيله تلقائياً عند فشل Backend APIs
- **Mock Data**: البيانات الوهمية تُحفظ في localStorage
- **Token Management**: يتم إنشاء tokens وهمية للاختبار
- **Admin Detection**: يتم اكتشاف المديرين من الـ email

## 🔄 التبديل للوضع الحقيقي

عندما يصبح Laravel Backend جاهزاً:
1. تأكد من تشغيل `php artisan serve --port=8000`
2. احذف localStorage: `localStorage.clear()`
3. حدث الصفحة
4. سيتم استخدام APIs الحقيقية تلقائياً

---

**آخر تحديث**: 9 سبتمبر 2025  
**المطور**: Claude Assistant 