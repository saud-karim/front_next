# 🔍 Shipping Integration - Debug Guide

## ❌ خطأ: HTTP ERROR DETECTED

### 🔎 **تحديد المشكلة:**

الخطأ ده معناه إن الـ API request فشل. محتاجين نعرف:

1. **Status Code** - رقم الخطأ (401, 403, 422, 500, etc.)
2. **Error Message** - رسالة الخطأ من الباك إند
3. **Request Data** - البيانات اللي اتبعتت

---

## 🛠️ **خطوات التشخيص:**

### 1️⃣ **افتح Console في المتصفح:**
```
F12 → Console Tab
```

### 2️⃣ **شوف الأخطاء:**

ابحث عن:
```
🚨 HTTP ERROR DETECTED!
📊 Status: XXX          ← رقم الخطأ
📋 Response OK? false
📄 Response Data: {...} ← التفاصيل
```

---

## ⚠️ **الأخطاء الشائعة:**

### **1. Status: 401 - Unauthorized**
```
خطأ: يجب تسجيل الدخول أولاً
```

**السبب:**
- ❌ User مش مسجل دخول
- ❌ Token انتهى
- ❌ Token غير صالح

**الحل:**
```typescript
1. تسجيل الدخول مرة أخرى
2. تحديث الصفحة
3. تأكد من وجود Token في localStorage
```

---

### **2. Status: 403 - Forbidden**
```
خطأ: غير مصرح لك بهذا الإجراء
```

**السبب:**
- ❌ User ليس Admin
- ❌ ليس لديه صلاحيات الوصول

**الحل:**
```typescript
1. تأكد من أن User هو Admin
2. تحقق من Role في Database
3. تأكد من middleware: role:admin
```

---

### **3. Status: 422 - Validation Error**
```
خطأ: خطأ في البيانات المُدخلة
```

**السبب:**
- ❌ `custom_api_url` مش موجود
- ❌ `order_ids` فاضي
- ❌ `shipping_company` مش موجود

**الحل:**
```typescript
// تأكد من إرسال كل البيانات المطلوبة:

const payload = {
  order_ids: [1, 2, 3],              // ✅ Required
  shipping_company: 'Bosta',         // ✅ Required
  custom_api_url: 'https://...',     // ✅ Required (بعد التحديث الجديد)
  custom_api_key: 'sk_live_...',     // ⚠️ Optional
  field_mapping: [...]               // ⚠️ Optional
};
```

**⚠️ تحديث هام:**
بعد التحديث الأخير، `custom_api_url` **مطلوب** (Required) لجميع الشركات!

---

### **4. Status: 500 - Server Error**
```
خطأ: خطأ في السيرفر
```

**السبب:**
- ❌ خطأ في الباك إند
- ❌ Database error
- ❌ Missing migration

**الحل:**
```bash
# تحقق من Laravel logs:
tail -f storage/logs/laravel.log

# تأكد من تطبيق Migration:
php artisan migrate

# تحقق من Database connection:
php artisan tinker
>>> DB::connection()->getPdo();
```

---

## 🔧 **التأكد من الإعدادات:**

### **Frontend Config:**

```typescript
// تأكد من وجود Config كامل:
const shippingConfig = {
  company: 'Bosta',                                          // ✅
  custom_api_url: 'https://app.bosta.co/api/v2/deliveries', // ✅
  custom_api_key: 'Bearer_YOUR_KEY',                         // ✅
  fields: [
    { id: 'order_number', field_path: 'order.order_number', enabled: true },
    { id: 'customer_name', field_path: 'customer.name', enabled: true },
    // ...
  ]
};
```

### **Backend Validation:**

```php
// SendToShippingRequest.php

public function rules(): array
{
    return [
        'order_ids' => 'required|array|min:1|max:100',
        'order_ids.*' => 'required|integer|exists:orders,id',
        'shipping_company' => 'required|string|max:50',
        'custom_api_url' => 'required|url|max:500',  // ← REQUIRED!
        'custom_api_key' => 'nullable|string|max:255',
        'field_mapping' => 'nullable|array',
    ];
}
```

---

## 🧪 **اختبار الـ API مباشرة:**

### **Test 1: Check if API is working**

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/admin/shipping/preview" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"order_ids": [1]}'
```

**Expected:**
- ✅ Status: 200
- ✅ Returns order data

---

### **Test 2: Send to Shipping**

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/admin/shipping/send" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_ids": [1],
    "shipping_company": "TestCompany",
    "custom_api_url": "https://httpbin.org/post",
    "custom_api_key": "test123"
  }'
```

**Expected:**
- ✅ Status: 200
- ✅ Returns tracking_number

---

## 📊 **Console Debugging:**

### **في Frontend - افتح Console واكتب:**

```javascript
// 1. تحقق من Token:
localStorage.getItem('token')

// 2. تحقق من User:
localStorage.getItem('user')

// 3. تحقق من Shipping Config:
localStorage.getItem('shippingConfig')

// 4. شوف كل الـ localStorage:
console.table(localStorage)
```

---

## 🔍 **تتبع الـ Request:**

### **في page.tsx - أضف المزيد من Logs:**

```typescript
const handleConfirmSendToShipping = async () => {
  console.group('🚚 Shipping Request Debug');
  
  console.log('1️⃣ Selected Orders:', selectedOrders);
  console.log('2️⃣ Shipping Config:', shippingConfig);
  console.log('3️⃣ Shipping Company:', shippingConfig?.company);
  console.log('4️⃣ Custom API URL:', shippingConfig?.custom_api_url);
  console.log('5️⃣ Custom API Key:', shippingConfig?.custom_api_key ? '***' : 'MISSING');
  console.log('6️⃣ Field Mapping:', shippingConfig?.fields);
  
  const shippingOptions = {
    field_mapping: shippingConfig?.fields,
    custom_api_url: shippingConfig?.custom_api_url,
    custom_api_key: shippingConfig?.custom_api_key,
  };
  
  console.log('7️⃣ Options to Send:', shippingOptions);
  console.groupEnd();
  
  // ... rest of code
};
```

---

## ⚡ **Quick Fix - الحل السريع:**

### **المشكلة الأكثر شيوعاً:**

**`custom_api_url` مش موجود!**

### **الحل:**

1. **افتح ShippingConfigModal**
2. **اكتب API URL** (حتى لو dummy):
   ```
   Company: Bosta
   API URL: https://app.bosta.co/api/v2/deliveries
   API Key: test123
   ```
3. **Save**
4. **حاول تاني**

---

## 📋 **Checklist - قبل الإرسال:**

```
□ User مسجل دخول؟
□ User هو Admin؟
□ Token موجود في localStorage؟
□ Shipping Config محفوظ؟
□ custom_api_url موجود؟
□ shipping_company موجود؟
□ Orders محددة؟
□ Backend APIs شغالة؟
□ Database migration مطبق؟
```

---

## 🔄 **إعادة التشغيل:**

إذا كل حاجة صح والـ error لسه موجود:

```bash
# 1. Clear browser cache
Ctrl + Shift + Delete

# 2. Clear localStorage
localStorage.clear()

# 3. Refresh page
F5

# 4. Login again
# 5. Configure shipping again
# 6. Try again
```

---

## 📞 **طلب المساعدة:**

إذا المشكلة لسه موجودة، ابعتلي:

1. **Screenshot من Console** (كل الأخطاء)
2. **Status Code** (401, 403, 422, 500?)
3. **Error Message** (النص الكامل)
4. **Shipping Config** (من localStorage)
5. **Laravel Log** (آخر 20 سطر من `storage/logs/laravel.log`)

---

## 🎯 **التشخيص السريع:**

| Status | المعنى | الحل السريع |
|--------|--------|-------------|
| 401 | غير مسجل دخول | سجل دخول مرة أخرى |
| 403 | ليس Admin | تأكد من Role |
| 422 | بيانات ناقصة | أضف custom_api_url |
| 500 | خطأ في السيرفر | تحقق من Laravel logs |

---

**تم إنشاء الدليل:** 15 أكتوبر 2025  
**الهدف:** مساعدة في تشخيص أخطاء Shipping Integration

