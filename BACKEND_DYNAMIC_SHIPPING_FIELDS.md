# 🔧 Backend: Dynamic Shipping Fields Implementation

## 📋 **Overview**

الفرونت إند الآن بيبعت **field mapping** ديناميكي - يعني الأدمن بيحدد بنفسه أي بيانات من الأوردر تتبعت لشركة الشحن!

---

## 🎯 **What the Frontend Sends:**

### **Request Structure:**

```http
POST /api/v1/admin/shipping/send
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_ids": [45, 44, 43],
  "shipping_company": "bosta",  // or "aramex", "dhl", "custom"
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
      "id": "address_street",
      "field_path": "shipping_address.street",
      "enabled": true
    }
  ],
  "custom_api_url": "https://custom-shipping.com/api/v1/shipments",  // if company = "custom"
  "custom_api_key": "sk_live_abc123"  // if company = "custom"
}
```

---

## 📦 **Field Mapping Structure:**

Each field in the `field_mapping` array has:

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier (e.g., `"customer_name"`) |
| `field_path` | string | Dot notation path to the data (e.g., `"customer.name"`) |
| `label_en` | string | English label (e.g., `"Customer Name"`) |
| `label_ar` | string | Arabic label (e.g., `"اسم العميل"`) |
| `category` | string | Category: `"order"`, `"customer"`, `"items"`, `"address"`, `"payment"` |
| `enabled` | boolean | Whether to include this field |

---

## 🛠️ **Backend Implementation:**

### **Step 1: Update Request Validation**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendToShippingRequest extends FormRequest
{
    public function rules()
    {
        return [
            'order_ids' => 'required|array|min:1',
            'order_ids.*' => 'required|integer|exists:orders,id',
            'shipping_company' => 'required|string|in:bosta,aramex,dhl,custom',
            'field_mapping' => 'nullable|array',
            'field_mapping.*.id' => 'required|string',
            'field_mapping.*.field_path' => 'required|string',
            'field_mapping.*.enabled' => 'required|boolean',
            'custom_api_url' => 'required_if:shipping_company,custom|url',
            'custom_api_key' => 'required_if:shipping_company,custom|string',
        ];
    }
}
```

---

### **Step 2: Create Field Mapper Service**

```php
<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Arr;

class OrderFieldMapper
{
    /**
     * Extract data from order based on field mapping
     * 
     * @param Order $order
     * @param array $fieldMapping
     * @return array
     */
    public function mapOrderFields(Order $order, array $fieldMapping): array
    {
        $mapped = [];
        
        foreach ($fieldMapping as $field) {
            if (!$field['enabled']) {
                continue;
            }
            
            $path = $field['field_path'];
            $value = $this->extractValueFromPath($order, $path);
            
            if ($value !== null) {
                $mapped[$field['id']] = $value;
            }
        }
        
        return $mapped;
    }
    
    /**
     * Extract value from order using dot notation path
     * 
     * @param Order $order
     * @param string $path
     * @return mixed
     */
    protected function extractValueFromPath(Order $order, string $path)
    {
        // Handle array paths (e.g., "items[].product.name")
        if (str_contains($path, '[]')) {
            return $this->extractArrayPath($order, $path);
        }
        
        // Handle simple paths (e.g., "order.order_number", "customer.name")
        return $this->extractSimplePath($order, $path);
    }
    
    /**
     * Extract simple path value
     */
    protected function extractSimplePath(Order $order, string $path)
    {
        $parts = explode('.', $path);
        $context = $parts[0]; // 'order', 'customer', 'shipping_address', etc.
        $field = $parts[1] ?? null;
        
        switch ($context) {
            case 'order':
                return $field ? $order->{$field} : null;
                
            case 'customer':
                return $field && $order->user ? $order->user->{$field} : null;
                
            case 'shipping_address':
                $address = is_array($order->shipping_address) 
                    ? $order->shipping_address 
                    : json_decode($order->shipping_address, true);
                return $field && $address ? ($address[$field] ?? null) : null;
                
            default:
                return null;
        }
    }
    
    /**
     * Extract array path value (for items)
     */
    protected function extractArrayPath(Order $order, string $path)
    {
        // e.g., "items[].product.name" -> ["items", "product.name"]
        [$arrayContext, $itemPath] = explode('[]', $path, 2);
        $itemPath = ltrim($itemPath, '.');
        
        if ($arrayContext === 'items') {
            return $order->orderItems->map(function ($item) use ($itemPath) {
                return $this->extractFromItem($item, $itemPath);
            })->filter()->values()->all();
        }
        
        return null;
    }
    
    /**
     * Extract value from order item
     */
    protected function extractFromItem($item, string $path)
    {
        $parts = explode('.', $path);
        
        if (count($parts) === 1) {
            // Direct item field: "quantity", "unit_price"
            return $item->{$parts[0]} ?? null;
        }
        
        // Nested field: "product.name", "product.sku"
        $relation = $parts[0]; // 'product'
        $field = $parts[1] ?? null;
        
        if ($relation === 'product' && $item->product && $field) {
            return $item->product->{$field};
        }
        
        return null;
    }
}
```

---

### **Step 3: Update Shipping Service**

```php
<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;

class ShippingService
{
    protected $fieldMapper;
    
    public function __construct(OrderFieldMapper $fieldMapper)
    {
        $this->fieldMapper = $fieldMapper;
    }
    
    /**
     * Send orders to shipping company
     */
    public function sendToShipping(
        array $orderIds, 
        string $company, 
        ?array $fieldMapping = null,
        ?string $customApiUrl = null,
        ?string $customApiKey = null
    ) {
        $orders = Order::with(['user', 'orderItems.product', 'shippingAddress'])
            ->whereIn('id', $orderIds)
            ->get();
        
        $results = [];
        
        foreach ($orders as $order) {
            try {
                // If field mapping provided, use it; otherwise use defaults
                $shippingData = $fieldMapping
                    ? $this->prepareDynamicShippingData($order, $fieldMapping)
                    : $this->prepareDefaultShippingData($order);
                
                // Send to appropriate company
                $response = match($company) {
                    'bosta' => $this->sendToBosta($shippingData),
                    'aramex' => $this->sendToAramex($shippingData),
                    'dhl' => $this->sendToDHL($shippingData),
                    'custom' => $this->sendToCustomAPI($shippingData, $customApiUrl, $customApiKey),
                    default => throw new \Exception("Unknown shipping company: {$company}")
                };
                
                // Save tracking info
                $order->update([
                    'tracking_number' => $response['tracking_number'] ?? null,
                    'shipping_company' => $company,
                    'shipping_status' => 'sent'
                ]);
                
                $results[] = [
                    'order_id' => $order->id,
                    'status' => 'success',
                    'tracking_number' => $response['tracking_number'] ?? null,
                ];
                
            } catch (\Exception $e) {
                $results[] = [
                    'order_id' => $order->id,
                    'status' => 'failed',
                    'error' => $e->getMessage(),
                ];
            }
        }
        
        return $results;
    }
    
    /**
     * Prepare shipping data using dynamic field mapping
     */
    protected function prepareDynamicShippingData(Order $order, array $fieldMapping): array
    {
        $mapped = $this->fieldMapper->mapOrderFields($order, $fieldMapping);
        
        // Transform mapped data into shipping API format
        return [
            'business_reference' => $mapped['order_number'] ?? $order->order_number,
            
            'receiver' => [
                'firstName' => $this->extractFirstName($mapped['customer_name'] ?? ''),
                'lastName' => $this->extractLastName($mapped['customer_name'] ?? ''),
                'phone' => $mapped['customer_phone'] ?? '',
                'email' => $mapped['customer_email'] ?? null,
            ],
            
            'dropOffAddress' => [
                'firstLine' => $mapped['address_street'] ?? '',
                'city' => ['name' => $mapped['address_governorate'] ?? 'Cairo'],
                'zone' => $mapped['address_city'] ?? '',
                'buildingNumber' => $mapped['address_building'] ?? '',
                'floor' => $mapped['address_floor'] ?? null,
                'apartment' => $mapped['address_apartment'] ?? null,
            ],
            
            'specs' => [
                'packageType' => 'Package',
                'size' => 'SMALL',
                'packageDetails' => [
                    'itemsCount' => count($mapped['items_product_name'] ?? []),
                    'description' => $this->formatItemsDescription($mapped),
                ],
            ],
            
            'cod' => (float) ($mapped['order_total'] ?? $order->total_amount),
            'notes' => $mapped['order_notes'] ?? null,
        ];
    }
    
    /**
     * Format items description from mapped data
     */
    protected function formatItemsDescription(array $mapped): string
    {
        $items = [];
        
        $names = $mapped['items_product_name'] ?? [];
        $quantities = $mapped['items_quantity'] ?? [];
        $prices = $mapped['items_unit_price'] ?? [];
        
        foreach ($names as $index => $name) {
            $item = $name;
            
            if (isset($quantities[$index])) {
                $item .= ' × ' . $quantities[$index];
            }
            
            if (isset($prices[$index])) {
                $item .= ' (' . number_format($prices[$index], 2) . ' EGP)';
            }
            
            $items[] = $item;
        }
        
        return implode(', ', $items);
    }
    
    /**
     * Prepare default shipping data (fallback)
     */
    protected function prepareDefaultShippingData(Order $order): array
    {
        $address = is_array($order->shipping_address) 
            ? $order->shipping_address 
            : json_decode($order->shipping_address, true);
        
        return [
            'business_reference' => $order->order_number,
            
            'receiver' => [
                'firstName' => explode(' ', $order->user->name)[0],
                'lastName' => explode(' ', $order->user->name)[1] ?? '',
                'phone' => $order->user->phone,
                'email' => $order->user->email,
            ],
            
            'dropOffAddress' => [
                'firstLine' => $address['street'] ?? '',
                'city' => ['name' => $address['governorate'] ?? 'Cairo'],
                'zone' => $address['city'] ?? '',
                'buildingNumber' => $address['building_number'] ?? '',
            ],
            
            'specs' => [
                'packageType' => 'Package',
                'packageDetails' => [
                    'itemsCount' => $order->orderItems->count(),
                    'description' => $order->orderItems->map(fn($item) => 
                        $item->product->name . ' × ' . $item->quantity
                    )->implode(', '),
                ],
            ],
            
            'cod' => (float) $order->total_amount,
        ];
    }
    
    /**
     * Send to custom API
     */
    protected function sendToCustomAPI(array $data, string $url, string $apiKey): array
    {
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->post($url, $data);
        
        if (!$response->successful()) {
            throw new \Exception('Custom API failed: ' . $response->body());
        }
        
        return $response->json();
    }
    
    // ... other methods (sendToBosta, sendToAramex, etc.)
}
```

---

### **Step 4: Update Controller**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SendToShippingRequest;
use App\Services\ShippingService;

class ShippingController extends Controller
{
    protected $shippingService;
    
    public function __construct(ShippingService $shippingService)
    {
        $this->shippingService = $shippingService;
    }
    
    /**
     * Send orders to shipping company
     */
    public function send(SendToShippingRequest $request)
    {
        $results = $this->shippingService->sendToShipping(
            orderIds: $request->order_ids,
            company: $request->shipping_company,
            fieldMapping: $request->field_mapping,
            customApiUrl: $request->custom_api_url,
            customApiKey: $request->custom_api_key
        );
        
        return response()->json([
            'success' => true,
            'data' => [
                'results' => $results,
            ],
        ]);
    }
}
```

---

## 📝 **Field Path Examples:**

### **Simple Paths:**

| Field Path | Extracted From |
|------------|----------------|
| `order.id` | `$order->id` |
| `order.order_number` | `$order->order_number` |
| `order.total_amount` | `$order->total_amount` |
| `order.payment_method` | `$order->payment_method` |
| `customer.name` | `$order->user->name` |
| `customer.phone` | `$order->user->phone` |
| `customer.email` | `$order->user->email` |
| `shipping_address.street` | `$order->shipping_address['street']` |
| `shipping_address.city` | `$order->shipping_address['city']` |

### **Array Paths:**

| Field Path | Extracted From |
|------------|----------------|
| `items[].product.name` | `$order->orderItems->pluck('product.name')` |
| `items[].product.sku` | `$order->orderItems->pluck('product.sku')` |
| `items[].quantity` | `$order->orderItems->pluck('quantity')` |
| `items[].unit_price` | `$order->orderItems->pluck('unit_price')` |
| `items[].subtotal` | `$order->orderItems->pluck('subtotal')` |

---

## 🔄 **Example Flow:**

### **1. Frontend sends configuration:**

```json
{
  "order_ids": [45],
  "shipping_company": "bosta",
  "field_mapping": [
    {"id": "order_number", "field_path": "order.order_number", "enabled": true},
    {"id": "customer_name", "field_path": "customer.name", "enabled": true},
    {"id": "items_product_name", "field_path": "items[].product.name", "enabled": true},
    {"id": "items_quantity", "field_path": "items[].quantity", "enabled": true}
  ]
}
```

### **2. Backend extracts mapped data:**

```php
$mapped = [
  'order_number' => 'ORD-2025-00035',
  'customer_name' => 'محمد أحمد',
  'items_product_name' => ['iPhone 15 Pro', 'AirPods'],
  'items_quantity' => [2, 1]
];
```

### **3. Backend formats for Bosta:**

```php
$shippingData = [
  'business_reference' => 'ORD-2025-00035',
  'receiver' => [
    'firstName' => 'محمد',
    'lastName' => 'أحمد',
    'phone' => '+201012345678'
  ],
  'specs' => [
    'packageDetails' => [
      'description' => 'iPhone 15 Pro × 2, AirPods × 1'
    ]
  ]
];
```

### **4. Backend sends to Bosta and returns:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "order_id": 45,
        "status": "success",
        "tracking_number": "SH-2025-00123"
      }
    ]
  }
}
```

---

## 🧪 **Testing:**

### **Test 1: Send with default fields**

```bash
curl -X POST http://localhost:8000/api/v1/admin/shipping/send \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "order_ids": [45],
    "shipping_company": "bosta"
  }'
```

### **Test 2: Send with custom field mapping**

```bash
curl -X POST http://localhost:8000/api/v1/admin/shipping/send \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "order_ids": [45],
    "shipping_company": "bosta",
    "field_mapping": [
      {"id": "order_number", "field_path": "order.order_number", "enabled": true},
      {"id": "customer_name", "field_path": "customer.name", "enabled": true}
    ]
  }'
```

### **Test 3: Send to custom API**

```bash
curl -X POST http://localhost:8000/api/v1/admin/shipping/send \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "order_ids": [45],
    "shipping_company": "custom",
    "custom_api_url": "https://custom-shipping.com/api/v1/shipments",
    "custom_api_key": "sk_live_abc123",
    "field_mapping": [...]
  }'
```

---

## ⚙️ **Database Migration (Optional):**

إذا كنت عايز تحفظ الـ configuration:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('shipping_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('company'); // 'bosta', 'aramex', 'custom'
            $table->string('custom_api_url')->nullable();
            $table->text('custom_api_key')->nullable(); // encrypted
            $table->json('field_mapping'); // The selected fields
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('shipping_configurations');
    }
};
```

---

## 🎯 **Summary:**

✅ **Frontend:** Sends `field_mapping` array with selected fields  
✅ **Backend:** Uses `OrderFieldMapper` to extract values  
✅ **Backend:** Formats data for specific shipping company  
✅ **Backend:** Supports custom APIs with custom URLs/keys  
✅ **Backend:** Fallbacks to default if no mapping provided  

---

**Implementation Time:** ~2-3 hours  
**Difficulty:** Medium  
**Benefits:** ⭐⭐⭐⭐⭐ (Maximum flexibility!)


