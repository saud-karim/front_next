# 📡 Shipping APIs - Complete Reference

## 🔗 All Required APIs

---

## 1️⃣ Preview Shipping Data

**Endpoint:** `POST /api/v1/admin/shipping/preview`

### Request:
```json
{
  "order_ids": [45, 44, 43]
}
```

### Response:
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": 45,
        "order_number": "ORD-2025-00035",
        "customer": {
          "name": "محمد أحمد",
          "phone": "+201012345678",
          "email": "mohamed@example.com"
        },
        "shipping_address": {
          "street": "شارع 15، الحي السابع",
          "city": "مدينة نصر",
          "governorate": "القاهرة",
          "district": "الحي السابع",
          "building_number": "15",
          "floor": "3",
          "apartment": "5",
          "postal_code": "11371"
        },
        "items": [
          {
            "product_id": 10,
            "product_name": "iPhone 15 Pro",
            "sku": "IP15PRO256",
            "quantity": 2,
            "unit_price": 500.00,
            "subtotal": 1000.00,
            "weight": 0.5
          }
        ],
        "total_amount": 1500.00,
        "subtotal": 1400.00,
        "shipping_cost": 50.00,
        "tax_amount": 50.00,
        "discount_amount": 0.00,
        "payment_method": "cash_on_delivery",
        "payment_status": "pending",
        "notes": "اتصل قبل التوصيل",
        "created_at": "2025-10-08T10:30:00Z",
        
        "validation": {
          "is_valid": true,
          "warnings": [],
          "errors": []
        }
      }
    ],
    "summary": {
      "total_orders": 3,
      "valid_orders": 3,
      "invalid_orders": 0,
      "total_amount": 4500.00
    }
  }
}
```

### Response (with warnings):
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "order_id": 46,
        "order_number": "ORD-2025-00036",
        "validation": {
          "is_valid": false,
          "warnings": [
            "Missing customer phone number",
            "Incomplete shipping address"
          ],
          "errors": []
        }
      }
    ]
  }
}
```

---

## 2️⃣ Send to Shipping (Dynamic Fields)

**Endpoint:** `POST /api/v1/admin/shipping/send`

### Request (Default - no field mapping):
```json
{
  "order_ids": [45, 44, 43],
  "shipping_company": "bosta"
}
```

### Request (With Dynamic Field Mapping):
```json
{
  "order_ids": [45, 44, 43],
  "shipping_company": "bosta",
  "field_mapping": [
    {
      "id": "order_number",
      "field_path": "order.order_number",
      "enabled": true
    },
    {
      "id": "customer_name",
      "field_path": "customer.name",
      "enabled": true
    },
    {
      "id": "customer_phone",
      "field_path": "customer.phone",
      "enabled": true
    },
    {
      "id": "items_product_name",
      "field_path": "items[].product.name",
      "enabled": true
    },
    {
      "id": "items_quantity",
      "field_path": "items[].quantity",
      "enabled": true
    },
    {
      "id": "items_unit_price",
      "field_path": "items[].unit_price",
      "enabled": true
    },
    {
      "id": "address_street",
      "field_path": "shipping_address.street",
      "enabled": true
    },
    {
      "id": "address_city",
      "field_path": "shipping_address.city",
      "enabled": true
    },
    {
      "id": "address_governorate",
      "field_path": "shipping_address.governorate",
      "enabled": true
    },
    {
      "id": "order_total",
      "field_path": "order.total_amount",
      "enabled": true
    }
  ]
}
```

### Request (Custom API):
```json
{
  "order_ids": [45],
  "shipping_company": "custom",
  "custom_api_url": "https://custom-shipping.com/api/v1/shipments",
  "custom_api_key": "sk_live_abc123xyz",
  "field_mapping": [...]
}
```

### Response:
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "order_id": 45,
        "status": "success",
        "tracking_number": "SH-2025-00123",
        "shipping_company": "bosta",
        "message": "Shipment created successfully"
      },
      {
        "order_id": 44,
        "status": "success",
        "tracking_number": "SH-2025-00124",
        "shipping_company": "bosta",
        "message": "Shipment created successfully"
      },
      {
        "order_id": 43,
        "status": "failed",
        "error": "Invalid phone number format",
        "shipping_company": "bosta"
      }
    ],
    "summary": {
      "total": 3,
      "success": 2,
      "failed": 1
    }
  }
}
```

### What Backend Should Do:

1. **Extract field values** based on `field_mapping`
2. **Format data** for the shipping company API
3. **Send to shipping company** (Bosta/Aramex/DHL/Custom)
4. **Save tracking number** to `orders` table
5. **Update order status** (optional)
6. **Return results**

---

## 3️⃣ Retry Failed Shipment

**Endpoint:** `POST /api/v1/admin/shipping/retry`

### Request:
```json
{
  "order_id": 45,
  "shipping_company": "bosta"
}
```

### Response:
```json
{
  "success": true,
  "data": {
    "order_id": 45,
    "status": "success",
    "tracking_number": "SH-2025-00125",
    "message": "Shipment retry successful"
  }
}
```

### Response (Failed):
```json
{
  "success": false,
  "data": {
    "order_id": 45,
    "status": "failed",
    "error": "Address validation failed: Missing building number"
  }
}
```

---

## 4️⃣ Get Shipping Status

**Endpoint:** `GET /api/v1/admin/shipping/status/{order_id}`

### Request:
```
GET /api/v1/admin/shipping/status/45
```

### Response:
```json
{
  "success": true,
  "data": {
    "order_id": 45,
    "tracking_number": "SH-2025-00123",
    "shipping_company": "bosta",
    "status": "in_transit",
    "status_ar": "قيد التوصيل",
    "current_location": "مركز التوزيع - القاهرة",
    "estimated_delivery": "2025-10-10",
    "history": [
      {
        "status": "created",
        "status_ar": "تم الإنشاء",
        "timestamp": "2025-10-08T10:00:00Z",
        "location": "مركز الفرز - القاهرة"
      },
      {
        "status": "picked_up",
        "status_ar": "تم الاستلام",
        "timestamp": "2025-10-08T14:00:00Z",
        "location": "مركز الفرز - القاهرة"
      },
      {
        "status": "in_transit",
        "status_ar": "قيد التوصيل",
        "timestamp": "2025-10-09T08:00:00Z",
        "location": "مركز التوزيع - القاهرة"
      }
    ]
  }
}
```

---

## 📊 Database Updates Required

### `orders` table - Add columns:
```sql
ALTER TABLE orders 
ADD COLUMN tracking_number VARCHAR(255) NULL,
ADD COLUMN shipping_company VARCHAR(50) NULL,
ADD COLUMN shipping_status VARCHAR(50) NULL DEFAULT 'not_sent',
ADD COLUMN shipped_at TIMESTAMP NULL;
```

### Shipping status values:
- `not_sent` - لم يتم الإرسال
- `sent` - تم الإرسال
- `failed` - فشل الإرسال
- `picked_up` - تم الاستلام من المخزن
- `in_transit` - قيد التوصيل
- `out_for_delivery` - خارج للتوصيل
- `delivered` - تم التسليم
- `returned` - تم الإرجاع

---

## 🔧 Field Mapping - Available Paths

### Order Fields:
```
order.id
order.order_number
order.total_amount
order.subtotal
order.shipping_cost
order.tax_amount
order.discount_amount
order.payment_method
order.payment_status
order.notes
order.created_at
```

### Customer Fields:
```
customer.id
customer.name
customer.phone
customer.email
```

### Items Fields (Array):
```
items[].product.id
items[].product.name
items[].product.sku
items[].product.weight
items[].quantity
items[].unit_price
items[].subtotal
items[].variant_name
```

### Shipping Address Fields:
```
shipping_address.name
shipping_address.phone
shipping_address.street
shipping_address.city
shipping_address.district
shipping_address.governorate
shipping_address.building_number
shipping_address.floor
shipping_address.apartment
shipping_address.postal_code
```

---

## 🌐 External Shipping Company APIs

### Bosta API Example:
```php
POST https://app.bosta.co/api/v2/deliveries
Authorization: Bearer {BOSTA_API_KEY}

{
  "type": 10,
  "specs": {
    "packageType": "Package",
    "size": "SMALL",
    "packageDetails": {
      "itemsCount": 2,
      "description": "iPhone 15 Pro × 2"
    }
  },
  "dropOffAddress": {
    "firstLine": "شارع 15، الحي السابع",
    "city": {"name": "Cairo"},
    "zone": "مدينة نصر",
    "buildingNumber": "15",
    "floor": "3",
    "apartment": "5"
  },
  "receiver": {
    "firstName": "محمد",
    "lastName": "أحمد",
    "phone": "+201012345678"
  },
  "cod": 1500.00,
  "businessReference": "ORD-2025-00035",
  "allowToOpenPackage": false
}

Response:
{
  "trackingNumber": "SH-2025-00123",
  "state": {
    "value": "created",
    "updatedAt": "2025-10-08T10:00:00Z"
  }
}
```

### Aramex API Example:
```php
POST https://api.aramex.com/v1/shipments
Authorization: Bearer {ARAMEX_API_KEY}

{
  "reference": "ORD-2025-00035",
  "shipper": {...},
  "consignee": {
    "name": "محمد أحمد",
    "phone": "+201012345678",
    "address": {
      "line1": "شارع 15، الحي السابع",
      "city": "Cairo",
      "country": "EG"
    }
  },
  "pieces": [
    {
      "weight": 1.0,
      "description": "iPhone 15 Pro × 2"
    }
  ],
  "cod": {
    "amount": 1500.00,
    "currency": "EGP"
  }
}

Response:
{
  "awb": "12345678901",
  "status": "created"
}
```

---

## 🔄 Backend Processing Flow

```
1. Frontend sends request with order_ids + field_mapping
   ↓
2. Backend validates request
   ↓
3. Backend loads orders from database
   ↓
4. Backend extracts field values based on field_mapping
   ↓
5. Backend formats data for shipping company
   ↓
6. Backend calls shipping company API
   ↓
7. Backend saves tracking_number to database
   ↓
8. Backend returns results to frontend
```

---

## ✅ Success Response Format (Always):
```json
{
  "success": true,
  "data": { ... }
}
```

## ❌ Error Response Format (Always):
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error 1", "Error 2"]
  }
}
```

---

## 🔐 Authentication

All requests require:
```
Authorization: Bearer {admin_token}
```

---

## 📝 Notes

1. **field_mapping is optional** - if not provided, use default fields
2. **Support multiple shipping companies** - bosta, aramex, dhl, custom
3. **Validate phone numbers** before sending
4. **Validate addresses** before sending
5. **Save tracking_number** immediately after success
6. **Log all API calls** for debugging
7. **Handle timeouts** gracefully (30s max)
8. **Return partial success** if some orders fail

---

## 🎯 Default Field Mapping (When field_mapping is NULL)

If frontend doesn't send `field_mapping`, use these defaults:

```php
// Minimum required fields for shipping
$defaultFields = [
    'order.order_number',
    'order.total_amount',
    'customer.name',
    'customer.phone',
    'items[].product.name',
    'items[].quantity',
    'shipping_address.street',
    'shipping_address.city',
    'shipping_address.governorate',
];
```

**Format for shipping company:**
```php
// Example output
[
    'business_reference' => 'ORD-2025-00035',
    'cod_amount' => 1500.00,
    'customer_name' => 'محمد أحمد',
    'customer_phone' => '+201012345678',
    'items_description' => 'iPhone 15 Pro × 2, AirPods × 1',
    'address' => 'شارع 15، الحي السابع، مدينة نصر، القاهرة',
]
```

---

## ⚠️ Validation Rules

### Request Validation:
```php
// SendToShippingRequest validation
[
    'order_ids' => 'required|array|min:1|max:100',
    'order_ids.*' => 'required|integer|exists:orders,id',
    'shipping_company' => 'required|string|max:50',
    'field_mapping' => 'nullable|array',
    'field_mapping.*.id' => 'required_with:field_mapping|string',
    'field_mapping.*.field_path' => 'required_with:field_mapping|string',
    'field_mapping.*.enabled' => 'required_with:field_mapping|boolean',
    'custom_api_url' => 'nullable|url|max:500',
    'custom_api_key' => 'nullable|string|max:255',
]
```

### Data Validation Before Sending:
```php
// Check each order before sending
- customer.phone is required and valid format (+20xxxxxxxxxx)
- shipping_address.street is required and not empty
- shipping_address.city is required
- shipping_address.governorate is required
- total_amount > 0
- items count > 0

// If validation fails:
return [
    'order_id' => 45,
    'status' => 'failed',
    'error' => 'Validation failed: Missing customer phone number'
];
```

---

## 🔢 HTTP Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Success (even if some orders failed - check results) |
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Not admin |
| 422 | Validation Error | Invalid field values |
| 500 | Server Error | Internal error (catch all exceptions) |

---

## 🐛 Error Codes (Optional but Recommended)

```php
// Include error_code in failed responses for easier debugging
[
    'order_id' => 45,
    'status' => 'failed',
    'error_code' => 'INVALID_PHONE',
    'error' => 'Invalid phone number format: 0101234',
]
```

**Common Error Codes:**
- `INVALID_PHONE` - Phone number format invalid
- `MISSING_ADDRESS` - Address incomplete
- `SHIPPING_API_ERROR` - Shipping company API failed
- `SHIPPING_API_TIMEOUT` - Shipping company API timeout
- `ORDER_NOT_FOUND` - Order doesn't exist
- `ORDER_ALREADY_SHIPPED` - Order already has tracking number

---

## 📊 Example Complete Implementation

### Controller:
```php
public function send(SendToShippingRequest $request)
{
    try {
        $results = $this->shippingService->sendToShipping(
            $request->order_ids,
            $request->shipping_company,
            $request->field_mapping,
            $request->custom_api_url,
            $request->custom_api_key
        );
        
        return response()->json([
            'success' => true,
            'data' => [
                'results' => $results,
                'summary' => [
                    'total' => count($results),
                    'success' => count(array_filter($results, fn($r) => $r['status'] === 'success')),
                    'failed' => count(array_filter($results, fn($r) => $r['status'] === 'failed')),
                ]
            ]
        ]);
    } catch (\Exception $e) {
        \Log::error('Shipping send failed', [
            'error' => $e->getMessage(),
            'order_ids' => $request->order_ids
        ]);
        
        return response()->json([
            'success' => false,
            'message' => 'Failed to process shipping request',
            'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
        ], 500);
    }
}
```

---

**End of API Reference**

