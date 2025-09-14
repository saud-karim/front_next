# 👥 دليل Customer Management APIs للفرونت إند

## 🎯 نظرة عامة

تم تطبيق **8 APIs كاملة** لإدارة العملاء في لوحة تحكم الإدارة. جميع الـ APIs تعمل تحت مسار `/api/v1/admin/customers` وتتطلب:
- **Authentication:** Bearer Token
- **Authorization:** Admin Role  
- **Content-Type:** application/json

---

## 🔗 جميع الـ Endpoints

| **#** | **Method** | **Endpoint** | **الوصف** |
|-------|-----------|-------------|-----------|
| 1 | `GET` | `/admin/customers/stats` | إحصائيات العملاء |
| 2 | `GET` | `/admin/customers` | قائمة العملاء + فلاتر |
| 3 | `GET` | `/admin/customers/{id}` | تفاصيل عميل |
| 4 | `PATCH` | `/admin/customers/{id}/status` | تحديث حالة العميل |
| 5 | `GET` | `/admin/customers/activity-stats` | إحصائيات الأنشطة |
| 6 | `POST` | `/admin/customers/advanced-search` | البحث المتقدم |
| 7 | `GET` | `/admin/customers/export` | تصدير البيانات |
| 8 | `POST` | `/admin/customers/send-notification` | إرسال إشعارات |

---

## 📊 **1. إحصائيات العملاء**

### `GET /admin/customers/stats`

```bash
curl -X GET "http://localhost:8000/api/v1/admin/customers/stats" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### Response:
```json
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

---

## 📋 **2. قائمة العملاء مع فلاتر متقدمة**

### `GET /admin/customers`

```bash
curl -X GET "http://localhost:8000/api/v1/admin/customers?page=1&per_page=20&search=أحمد&status=active&sort=created_at&order=desc" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### **Query Parameters:**
- `page`: رقم الصفحة (افتراضي: 1)
- `per_page`: عدد العناصر (افتراضي: 15، حد أقصى: 50)
- `search`: البحث في الاسم، الإيميل، الهاتف
- `status`: `active|inactive|banned`
- `company`: البحث بالشركة
- `registration_date_from`: تاريخ التسجيل من (YYYY-MM-DD)
- `registration_date_to`: تاريخ التسجيل إلى (YYYY-MM-DD)
- `min_orders`: أقل عدد طلبات
- `max_orders`: أكبر عدد طلبات
- `min_spent`: أقل مبلغ مشتريات
- `max_spent`: أكبر مبلغ مشتريات
- `sort`: `name|email|created_at|last_activity|orders_count|total_spent`
- `order`: `asc|desc`

### Response:
```json
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

---

## 👤 **3. تفاصيل عميل محدد**

### `GET /admin/customers/{id}`

```bash
curl -X GET "http://localhost:8000/api/v1/admin/customers/15" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### Response:
```json
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

---

## ⚡ **4. تحديث حالة العميل**

### `PATCH /admin/customers/{id}/status`

```bash
curl -X PATCH "http://localhost:8000/api/v1/admin/customers/15/status" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "banned",
    "reason": "مخالفة شروط الاستخدام"
  }'
```

### Request Body:
```json
{
  "status": "banned",  // active|inactive|banned
  "reason": "مخالفة شروط الاستخدام"  // اختياري
}
```

### Response:
```json
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

---

## 📈 **5. إحصائيات الأنشطة**

### `GET /admin/customers/activity-stats`

```bash
curl -X GET "http://localhost:8000/api/v1/admin/customers/activity-stats?period=month" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### **Query Parameters:**
- `period`: `today|week|month|year` (افتراضي: month)

### Response:
```json
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

---

## 🔍 **6. البحث المتقدم**

### `POST /admin/customers/advanced-search`

```bash
curl -X POST "http://localhost:8000/api/v1/admin/customers/advanced-search" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "name": "أحمد محمد علي",
      "email": "ahmed@gmail.com"
      // ... باقي بيانات العميل
    }
  ],
  "meta": {
    "current_page": 1,
    "total": 45,
    "per_page": 20,
    "last_page": 3
  }
}
```

---

## 📤 **7. تصدير بيانات العملاء**

### `GET /admin/customers/export`

```bash
curl -X GET "http://localhost:8000/api/v1/admin/customers/export?format=excel&status=active" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### **Query Parameters:**
- `format`: `csv|excel|pdf` (افتراضي: excel)
- جميع فلاتر قائمة العملاء العادية

### Response:
```json
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

---

## 📢 **8. إرسال إشعارات**

### `POST /admin/customers/send-notification`

```bash
curl -X POST "http://localhost:8000/api/v1/admin/customers/send-notification" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_ids": [15, 23, 45],
    "title": "عرض خاص لعملائنا المميزين",
    "message": "احصل على خصم 20% على جميع المنتجات",
    "type": "promotion",
    "send_email": true,
    "send_sms": false
  }'
```

### Request Body:
```json
{
  "customer_ids": [15, 23, 45], // أو ["all"] للجميع
  "title": "عرض خاص لعملائنا المميزين",
  "message": "احصل على خصم 20% على جميع المنتجات", 
  "type": "promotion", // info|warning|promotion|announcement
  "send_email": true,
  "send_sms": false
}
```

### Response:
```json
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

---

## 🎯 **مثال شامل للاستخدام في React**

```javascript
// ===== Custom Hook لإدارة العملاء =====
const useAdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
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

---

## 💡 **نصائح للاستخدام الأمثل**

### 1. **معالجة الأخطاء المتقدمة**
```javascript
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
```

### 2. **تحسين الأداء مع React Query**
```javascript
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
      await queryClient.cancelQueries(['admin-customers']);
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
```

### 3. **فلترة وبحث متقدم**
```javascript
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

  return {
    filters,
    applyFilters,
    resetFilters,
    hasActiveFilters: Object.values(filters).some(v => 
      v !== '' && v !== null && JSON.stringify(v) !== JSON.stringify({ from: '', to: '' })
    )
  };
};
```

---

## 🔐 **Authentication & Authorization**

### **Headers مطلوبة:**
```bash
Authorization: Bearer YOUR_ADMIN_TOKEN
Accept: application/json
Content-Type: application/json  # للـ POST/PATCH requests
```

### **الحصول على Admin Token:**
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shop.com",
    "password": "your_password"
  }'
```

---

## ✅ **اختبار سريع**

### **1. اختبار الإحصائيات:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/customers/stats" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### **2. اختبار قائمة العملاء:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/customers?page=1&per_page=5" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### **3. اختبار تفاصيل عميل:**
```bash
curl -X GET "http://localhost:8000/api/v1/admin/customers/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

---

## 🎯 **الخلاصة النهائية**

**🟢 تم تطبيق 100% من Customer Management APIs**

- ✅ **8 APIs كاملة** مع جميع الفلاتر والإحصائيات
- ✅ **React Integration** جاهزة للاستخدام الفوري
- ✅ **Advanced Search** مع فلاتر متقدمة  
- ✅ **Real-time Updates** مع optimistic updates
- ✅ **Export Functionality** للـ Excel/CSV/PDF
- ✅ **Notification System** لإرسال إشعارات
- ✅ **Security** محمية بـ admin middleware
- ✅ **Performance** محسنة مع React Query

**🚀 النظام جاهز لبناء صفحة `/dashboard/customers` الاحترافية!**

---

**📅 تاريخ الإكمال:** 9 سبتمبر 2025  
**🎯 نسبة الإنجاز:** 100% ✅ 