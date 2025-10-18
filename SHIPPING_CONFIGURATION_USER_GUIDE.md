# 📖 Shipping Configuration - دليل المستخدم

## 🎯 **ما هو Shipping Configuration?**

ميزة تسمح لك بتحديد **بالضبط** أي بيانات من الطلبات سيتم إرسالها لشركة الشحن!

**لماذا تحتاجها؟**
- ✅ شركات الشحن المختلفة تحتاج بيانات مختلفة
- ✅ بعض الشركات لا تحتاج كل البيانات
- ✅ يمكنك تغيير الشركة بسهولة دون تعديل الكود
- ✅ يمكنك استخدام شركات شحن مخصصة (Custom APIs)

---

## 🚀 **كيفية الاستخدام:**

### **الخطوة 1: افتح صفحة الطلبات**

```
Dashboard → Orders
```

### **الخطوة 2: حدد طلبات**

- ✅ اختر طلب واحد أو أكثر من الجدول

### **الخطوة 3: افتح إعدادات الشحن**

- اضغط على زر **"إعدادات"** (Settings) ⚙️ الأرجواني في Bulk Actions Bar

![Configuration Button](https://via.placeholder.com/800x100/9333ea/ffffff?text=Configure+Button)

---

## ⚙️ **شاشة الإعدادات:**

### **1. اختر شركة الشحن:**

```
┌─────────────────────────────┐
│ Shipping Company: [Bosta ▼]│
└─────────────────────────────┘

Options:
- Bosta      (شركة بوسطة)
- Aramex     (شركة أرامكس)
- DHL        (شركة DHL)
- FedEx      (شركة فيديكس)
- Custom     (شركة مخصصة)
```

---

### **2. إذا اخترت "Custom" - أدخل التفاصيل:**

```
┌──────────────────────────────────────────────┐
│ Custom API URL:                              │
│ https://api.example.com/v1/shipments         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ API Key:                                     │
│ ••••••••••••••••                             │
└──────────────────────────────────────────────┘
```

---

### **3. حدد البيانات المطلوبة:**

#### **Categories (التصنيفات):**

```
┌────┬──────────┬─────────┬───────────┬─────────┬─────────┐
│All │  Order   │Customer │ Products  │ Address │ Payment │
└────┴──────────┴─────────┴───────────┴─────────┴─────────┘
```

#### **Available Fields:**

**📦 Order Info (بيانات الطلب):**

| Field | Description | Default |
|-------|-------------|---------|
| ☑ Order ID | معرف الطلب | ✅ |
| ☑ Order Number | رقم الطلب | ✅ |
| ☑ Total Amount | الإجمالي | ✅ |
| ☐ Subtotal | المجموع الفرعي | ❌ |
| ☐ Shipping Cost | تكلفة الشحن | ❌ |
| ☐ Tax Amount | قيمة الضريبة | ❌ |
| ☐ Discount | الخصم | ❌ |
| ☐ Order Notes | ملاحظات | ❌ |
| ☐ Order Date | تاريخ الطلب | ❌ |

---

**👤 Customer Info (بيانات العميل):**

| Field | Description | Default |
|-------|-------------|---------|
| ☑ Customer Name | اسم العميل | ✅ |
| ☑ Customer Phone | هاتف العميل | ✅ |
| ☐ Customer Email | بريد العميل | ❌ |

---

**📦 Products (المنتجات):**

| Field | Description | Default |
|-------|-------------|---------|
| ☑ Product Name | اسم المنتج | ✅ |
| ☑ Quantity | الكمية | ✅ |
| ☐ Product SKU | كود المنتج | ❌ |
| ☐ Unit Price | سعر الوحدة | ❌ |
| ☐ Item Subtotal | إجمالي المنتج | ❌ |
| ☐ Variant Name | اسم النسخة | ❌ |
| ☐ Product Weight | الوزن | ❌ |

---

**📍 Shipping Address (عنوان الشحن):**

| Field | Description | Default |
|-------|-------------|---------|
| ☑ Street Address | الشارع | ✅ |
| ☑ City | المدينة | ✅ |
| ☑ Governorate | المحافظة | ✅ |
| ☐ District | الحي | ❌ |
| ☐ Building Number | رقم المبنى | ❌ |
| ☐ Floor | الطابق | ❌ |
| ☐ Apartment | الشقة | ❌ |
| ☐ Postal Code | الرمز البريدي | ❌ |

---

**💰 Payment (الدفع):**

| Field | Description | Default |
|-------|-------------|---------|
| ☑ Payment Method | طريقة الدفع | ✅ |
| ☐ Payment Status | حالة الدفع | ❌ |

---

### **4. استخدم الأزرار السريعة:**

```
┌──────────────┬─────────────────┐
│ Select All   │  Deselect All   │
└──────────────┴─────────────────┘
```

- **Select All:** تحديد جميع الحقول
- **Deselect All:** إلغاء تحديد الحقول غير المطلوبة (Required fields تبقى محددة)

---

### **5. احفظ الإعدادات:**

```
┌─────────────────────────────────────────────┐
│  ✓ Selected 15 of 35 fields                 │
└─────────────────────────────────────────────┘

    [Cancel]  [Save Configuration ✓]
```

---

## 🎯 **أمثلة عملية:**

### **مثال 1: Bosta - بيانات أساسية فقط**

**الهدف:** إرسال الحد الأدنى من البيانات

**الحقول المحددة:**
- ✅ Order Number
- ✅ Customer Name
- ✅ Customer Phone
- ✅ Street Address
- ✅ City
- ✅ Governorate
- ✅ Total Amount

**النتيجة:** سيتم إرسال البيانات الأساسية فقط لـ Bosta

---

### **مثال 2: Aramex - بيانات تفصيلية**

**الهدف:** إرسال معلومات كاملة عن المنتجات

**الحقول المحددة:**
- ✅ كل حقول Order Info
- ✅ كل حقول Customer Info
- ✅ Product Name + SKU + Quantity + Unit Price + Weight
- ✅ كل حقول Shipping Address
- ✅ Payment Method

**النتيجة:** سيتم إرسال تفاصيل دقيقة جداً لـ Aramex

---

### **مثال 3: Custom API - شركة محلية**

**الهدف:** إرسال لشركة شحن محلية بـ API خاص

**الإعدادات:**
```
Company: Custom
API URL: https://local-shipping.eg/api/v1/orders
API Key: sk_live_xyz789
```

**الحقول المحددة:**
- ✅ Order Number
- ✅ Customer Name + Phone
- ✅ Product Name + Quantity
- ✅ Address (كامل)
- ✅ Total Amount + Payment Method

**النتيجة:** سيتم إرسال البيانات للـ API المخصص

---

## 💾 **حفظ الإعدادات:**

### **التخزين التلقائي:**

عند حفظ الإعدادات، يتم تخزينها في:
```
localStorage → 'shipping_config'
```

**معنى ذلك:**
- ✅ الإعدادات تبقى محفوظة حتى بعد إغلاق المتصفح
- ✅ لا تحتاج لإعادة الإعدادات في كل مرة
- ✅ يمكنك تعديلها في أي وقت

---

## 🔄 **استخدام الإعدادات المحفوظة:**

### **عند إرسال الطلبات:**

1. **حدد الطلبات**
2. **اضغط "معاينة البيانات"** - سترى البيانات حسب الإعدادات المحفوظة
3. **اضغط "تأكيد الإرسال"** - سيتم الإرسال باستخدام الإعدادات المحفوظة

---

## ⚠️ **ملاحظات مهمة:**

### **الحقول المطلوبة (Required):**

بعض الحقول **لا يمكن إلغاؤها** لأنها ضرورية:
- 🔒 Order ID
- 🔒 Order Number
- 🔒 Customer Name
- 🔒 Customer Phone
- 🔒 Street Address
- 🔒 City
- 🔒 Governorate

هذه الحقول ستظهر بـ **(Required)** ولا يمكن إلغاؤها.

---

### **التحقق من البيانات:**

قبل الإرسال، تأكد من:
- ✅ رقم الهاتف صحيح
- ✅ العنوان كامل
- ✅ الطلب يحتوي على منتجات

إذا كانت بيانات الطلب ناقصة، ستظهر **⚠️ تحذير** في شاشة المعاينة.

---

## 🎨 **الواجهة:**

### **شاشة الإعدادات:**

```
┌────────────────────────────────────────────────┐
│  ⚙️ Shipping Configuration                    │
├────────────────────────────────────────────────┤
│                                                 │
│  Shipping Company: [Bosta ▼]                   │
│                                                 │
│  ┌─ Select Data Fields to Send ──────────────┐ │
│  │                                             │ │
│  │  [All] [Order] [Customer] [Products] ...   │ │
│  │                                             │ │
│  │  ☑ Order Number      (order.order_number)  │ │
│  │  ☑ Customer Name     (customer.name)       │ │
│  │  ☑ Product Name      (items[].product...)  │ │
│  │  ☐ Product SKU       (items[].product...)  │ │
│  │  ...                                        │ │
│  └─────────────────────────────────────────────┘ │
│                                                 │
│  ✓ Selected 15 of 35 fields                    │
│                                                 │
│              [Cancel]  [Save ✓]                 │
└────────────────────────────────────────────────┘
```

---

## 📱 **على الموبايل:**

الشاشة **Responsive**:
- ✅ تعمل على الموبايل والتابلت
- ✅ الحقول تظهر في عمود واحد
- ✅ الأزرار كبيرة وسهلة الضغط

---

## 🔧 **استكشاف الأخطاء:**

### **مشكلة: الإعدادات لا تُحفظ**

**الحل:**
- تأكد من أن المتصفح يدعم localStorage
- جرب مسح الـ cache وإعادة المحاولة

### **مشكلة: لا أرى زر "إعدادات"**

**الحل:**
- تأكد من تحديد طلب واحد على الأقل
- Bulk Actions Bar يظهر فقط عند تحديد طلبات

### **مشكلة: الإرسال يفشل دائماً**

**الحل:**
- تأكد من صحة API URL و API Key (للـ Custom APIs)
- راجع الحقول المطلوبة - قد تكون بيانات الطلب ناقصة
- تحقق من اتصال الإنترنت

---

## 📊 **أمثلة حسب الشركة:**

### **Bosta:**
```
Minimum Fields:
- Order Number
- Customer Name + Phone
- Address (Street, City, Governorate)
- Total Amount
```

### **Aramex:**
```
Recommended Fields:
- Order Number
- Customer (Name, Phone, Email)
- Items (Name, Quantity, Weight)
- Full Address
- Payment Method + COD Amount
```

### **DHL:**
```
Required Fields:
- Order Number
- Customer Full Details
- Product Details (with Weight)
- Complete Address (with Postal Code)
- Payment Method
```

---

## 💡 **نصائح:**

1. **ابدأ بالحد الأدنى:** حدد الحقول الأساسية فقط أولاً
2. **اختبر أولاً:** جرب على طلب واحد قبل الإرسال المجمع
3. **احفظ Configurations مختلفة:** يمكنك تغيير الإعدادات حسب الشركة
4. **راجع المعاينة:** دائماً استخدم "Preview" قبل "Send"

---

## 🎯 **Workflow المثالي:**

```
1. فتح صفحة الطلبات
   ↓
2. فتح الإعدادات (أول مرة فقط)
   ↓
3. اختيار الشركة والحقول
   ↓
4. حفظ الإعدادات
   ↓
5. تحديد الطلبات
   ↓
6. معاينة البيانات
   ↓
7. تأكيد الإرسال
   ↓
8. ✅ تم الإرسال بنجاح!
```

---

**هل تحتاج مساعدة؟** راجع:
- `SHIPPING_QUICK_REFERENCE_AR.md` - المرجع السريع
- `SHIPPING_API_FLOW_EXPLAINED.md` - الشرح التفصيلي

---

**تاريخ الإنشاء:** 8 أكتوبر 2025  
**الإصدار:** 1.0


