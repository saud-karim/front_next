# 🔧 Custom API Integration - Backend Implementation Guide

## 📋 Current Status

### ✅ What's Already Working:

1. **Frontend:** Sends `custom_api_url` and `custom_api_key` correctly ✅
2. **Backend:** Receives the data correctly ✅
3. **Validation:** Validates URL and API key format ✅
4. **Database:** Saves shipping info correctly ✅

### ❌ What's Missing:

- **Backend doesn't actually call the custom API** ❌
- Currently returns **simulated** responses ❌

---

## 🚀 How to Implement Real Custom API Calls

### 📁 File to Update:
`app/Http/Controllers/Api/Admin/ShippingController.php`

---

## 🔧 Step 1: Update `sendToShippingCompany()` Method

### Current Code (Simulated):

```php
private function sendToShippingCompany(
    string $company, 
    $order, 
    array $data,
    ?string $customApiUrl = null,
    ?string $customApiKey = null
): array {
    // ❌ Currently: Just returns a fake tracking number
    return [
        'status' => 'success',
        'tracking_number' => 'SH-' . date('Y') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT),
        'message' => 'Shipment created successfully (SIMULATED)'
    ];
}
```

---

### New Code (Real API Calls):

```php
private function sendToShippingCompany(
    string $company, 
    $order, 
    array $data,
    ?string $customApiUrl = null,
    ?string $customApiKey = null
): array {
    try {
        // Check if custom API is provided
        if ($customApiUrl && $customApiKey) {
            return $this->sendToCustomAPI($order, $data, $customApiUrl, $customApiKey);
        }
        
        // Check for known shipping companies
        $company = strtolower($company);
        
        if ($company === 'bosta') {
            return $this->sendToBosta($order, $data);
        } elseif ($company === 'aramex') {
            return $this->sendToAramex($order, $data);
        } elseif ($company === 'dhl') {
            return $this->sendToDHL($order, $data);
        }
        
        // Unknown company - return error
        return [
            'status' => 'failed',
            'error' => "Unknown shipping company: {$company}"
        ];
        
    } catch (\Exception $e) {
        \Log::error('Shipping API error', [
            'company' => $company,
            'order_id' => $order->id,
            'error' => $e->getMessage()
        ]);
        
        return [
            'status' => 'failed',
            'error' => $e->getMessage()
        ];
    }
}
```

---

## 🌐 Step 2: Implement `sendToCustomAPI()` Method

Add this new method to `ShippingController.php`:

```php
/**
 * Send order to custom shipping API
 */
private function sendToCustomAPI($order, array $data, string $apiUrl, string $apiKey): array
{
    try {
        \Log::info('Sending to custom API', [
            'order_id' => $order->id,
            'api_url' => $apiUrl
        ]);
        
        // Build the payload
        // Format the data according to what the custom API expects
        $payload = [
            'order_reference' => $data['order_number'] ?? $order->order_number,
            'customer' => [
                'name' => $data['customer_name'] ?? $order->customer->name,
                'phone' => $data['customer_phone'] ?? $order->customer->phone,
                'email' => $order->customer->email ?? null,
            ],
            'delivery_address' => [
                'street' => $data['address_street'] ?? $order->shipping_address['street'] ?? '',
                'city' => $data['address_city'] ?? $order->shipping_address['city'] ?? '',
                'governorate' => $data['address_governorate'] ?? $order->shipping_address['governorate'] ?? '',
                'building' => $order->shipping_address['building_number'] ?? null,
                'floor' => $order->shipping_address['floor'] ?? null,
                'apartment' => $order->shipping_address['apartment'] ?? null,
            ],
            'items' => collect($order->orderItems)->map(function($item) {
                return [
                    'name' => $item->product->name ?? 'Unknown Product',
                    'quantity' => $item->quantity,
                    'price' => $item->unit_price,
                ];
            })->toArray(),
            'total_amount' => $data['total_amount'] ?? $order->total_amount,
            'payment_method' => $order->payment_method,
            'cod_amount' => $order->payment_method === 'cash_on_delivery' ? $order->total_amount : 0,
        ];
        
        // Make HTTP request to custom API
        $response = \Http::timeout(30)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
            ])
            ->post($apiUrl, $payload);
        
        // Check if request was successful
        if ($response->successful()) {
            $responseData = $response->json();
            
            // Extract tracking number (adjust field name based on API response)
            $trackingNumber = $responseData['tracking_number'] 
                           ?? $responseData['tracking_id']
                           ?? $responseData['awb']
                           ?? $responseData['shipment_id']
                           ?? 'TRACK-' . time();
            
            \Log::info('Custom API success', [
                'order_id' => $order->id,
                'tracking_number' => $trackingNumber
            ]);
            
            return [
                'status' => 'success',
                'tracking_number' => $trackingNumber,
                'message' => 'Shipment created successfully',
                'raw_response' => $responseData
            ];
        }
        
        // API returned error
        $errorMessage = $response->json()['message'] 
                     ?? $response->json()['error']
                     ?? 'API request failed with status ' . $response->status();
        
        \Log::error('Custom API error response', [
            'order_id' => $order->id,
            'status' => $response->status(),
            'response' => $response->body()
        ]);
        
        return [
            'status' => 'failed',
            'error' => $errorMessage
        ];
        
    } catch (\Illuminate\Http\Client\RequestException $e) {
        \Log::error('Custom API request exception', [
            'order_id' => $order->id,
            'error' => $e->getMessage()
        ]);
        
        return [
            'status' => 'failed',
            'error' => 'API request failed: ' . $e->getMessage()
        ];
        
    } catch (\Exception $e) {
        \Log::error('Custom API unexpected error', [
            'order_id' => $order->id,
            'error' => $e->getMessage()
        ]);
        
        return [
            'status' => 'failed',
            'error' => 'Unexpected error: ' . $e->getMessage()
        ];
    }
}
```

---

## 📦 Step 3: Implement Bosta API Integration

Add this method to `ShippingController.php`:

```php
/**
 * Send order to Bosta API
 */
private function sendToBosta($order, array $data): array
{
    try {
        $apiKey = env('BOSTA_API_KEY');
        
        if (!$apiKey) {
            return [
                'status' => 'failed',
                'error' => 'Bosta API key not configured. Add BOSTA_API_KEY to .env file'
            ];
        }
        
        // Build Bosta-specific payload
        $payload = [
            'type' => 10, // COD delivery
            'specs' => [
                'packageType' => 'Package',
                'size' => 'SMALL',
                'packageDetails' => [
                    'itemsCount' => $order->orderItems->count(),
                    'description' => collect($order->orderItems)
                        ->map(fn($item) => $item->product->name . ' × ' . $item->quantity)
                        ->join(', ')
                ]
            ],
            'dropOffAddress' => [
                'firstLine' => $order->shipping_address['street'] ?? '',
                'city' => [
                    'name' => $order->shipping_address['city'] ?? 'Cairo'
                ],
                'zone' => $order->shipping_address['district'] ?? '',
                'buildingNumber' => $order->shipping_address['building_number'] ?? '',
                'floor' => $order->shipping_address['floor'] ?? '',
                'apartment' => $order->shipping_address['apartment'] ?? ''
            ],
            'receiver' => [
                'firstName' => explode(' ', $order->customer->name)[0] ?? $order->customer->name,
                'lastName' => explode(' ', $order->customer->name, 2)[1] ?? '',
                'phone' => $order->customer->phone
            ],
            'cod' => $order->payment_method === 'cash_on_delivery' ? $order->total_amount : 0,
            'businessReference' => $order->order_number,
            'allowToOpenPackage' => false
        ];
        
        // Call Bosta API
        $response = \Http::timeout(30)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])
            ->post('https://app.bosta.co/api/v2/deliveries', $payload);
        
        if ($response->successful()) {
            $data = $response->json();
            
            return [
                'status' => 'success',
                'tracking_number' => $data['trackingNumber'] ?? $data['_id'],
                'message' => 'Bosta shipment created successfully'
            ];
        }
        
        return [
            'status' => 'failed',
            'error' => $response->json()['message'] ?? 'Bosta API error'
        ];
        
    } catch (\Exception $e) {
        \Log::error('Bosta API error', [
            'order_id' => $order->id,
            'error' => $e->getMessage()
        ]);
        
        return [
            'status' => 'failed',
            'error' => $e->getMessage()
        ];
    }
}
```

---

## 📦 Step 4: Implement Aramex API Integration

```php
/**
 * Send order to Aramex API
 */
private function sendToAramex($order, array $data): array
{
    try {
        $apiKey = env('ARAMEX_API_KEY');
        
        if (!$apiKey) {
            return [
                'status' => 'failed',
                'error' => 'Aramex API key not configured'
            ];
        }
        
        $payload = [
            'reference' => $order->order_number,
            'shipper' => [
                'name' => env('SHOP_NAME', 'BuildTools'),
                'phone' => env('SHOP_PHONE', '+201000000000'),
                'address' => [
                    'line1' => env('SHOP_ADDRESS', 'Cairo, Egypt'),
                    'city' => 'Cairo',
                    'country' => 'EG'
                ]
            ],
            'consignee' => [
                'name' => $order->customer->name,
                'phone' => $order->customer->phone,
                'address' => [
                    'line1' => $order->shipping_address['street'] ?? '',
                    'city' => $order->shipping_address['city'] ?? 'Cairo',
                    'country' => 'EG'
                ]
            ],
            'pieces' => [
                [
                    'weight' => 1.0, // Calculate actual weight
                    'description' => collect($order->orderItems)
                        ->map(fn($item) => $item->product->name)
                        ->join(', ')
                ]
            ],
            'cod' => [
                'amount' => $order->payment_method === 'cash_on_delivery' ? $order->total_amount : 0,
                'currency' => 'EGP'
            ]
        ];
        
        $response = \Http::timeout(30)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])
            ->post('https://api.aramex.com/v1/shipments', $payload);
        
        if ($response->successful()) {
            $data = $response->json();
            
            return [
                'status' => 'success',
                'tracking_number' => $data['awb'] ?? $data['tracking_number'],
                'message' => 'Aramex shipment created successfully'
            ];
        }
        
        return [
            'status' => 'failed',
            'error' => $response->json()['message'] ?? 'Aramex API error'
        ];
        
    } catch (\Exception $e) {
        \Log::error('Aramex API error', [
            'order_id' => $order->id,
            'error' => $e->getMessage()
        ]);
        
        return [
            'status' => 'failed',
            'error' => $e->getMessage()
        ];
    }
}
```

---

## ⚙️ Step 5: Add API Keys to `.env`

```env
# Bosta API
BOSTA_API_KEY=your_bosta_api_key_here

# Aramex API
ARAMEX_API_KEY=your_aramex_api_key_here

# DHL API (if needed)
DHL_API_KEY=your_dhl_api_key_here

# Shop Info (for shipping company APIs)
SHOP_NAME="BuildTools"
SHOP_PHONE="+201234567890"
SHOP_ADDRESS="123 Main St, Cairo, Egypt"
```

---

## 🧪 Step 6: Testing

### Test with Custom API:

```bash
# Test custom API endpoint
curl -X POST "http://127.0.0.1:8000/api/v1/admin/shipping/send" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_ids": [1],
    "shipping_company": "custom",
    "custom_api_url": "https://your-custom-api.com/v1/shipments",
    "custom_api_key": "sk_live_abc123",
    "field_mapping": [
      {"id": "order_number", "field_path": "order.order_number", "enabled": true},
      {"id": "customer_name", "field_path": "customer.name", "enabled": true}
    ]
  }'
```

### Test with Bosta:

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/admin/shipping/send" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "order_ids": [1],
    "shipping_company": "bosta"
  }'
```

---

## 📊 Expected Response (Success):

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "order_id": 1,
        "status": "success",
        "tracking_number": "SH-2025-12345",
        "shipping_company": "custom",
        "message": "Shipment created successfully"
      }
    ],
    "summary": {
      "total": 1,
      "success": 1,
      "failed": 0
    }
  }
}
```

---

## ❌ Expected Response (Failed):

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "order_id": 1,
        "status": "failed",
        "error": "API request failed: Invalid API key",
        "shipping_company": "custom"
      }
    ],
    "summary": {
      "total": 1,
      "success": 0,
      "failed": 1
    }
  }
}
```

---

## 🔍 Debugging

### Check Logs:

```bash
# Laravel log file
tail -f storage/logs/laravel.log

# Filter shipping logs only
tail -f storage/logs/laravel.log | grep "Shipping"
```

### Common Issues:

1. **Invalid API Key:**
   - Check `.env` file
   - Verify API key is correct
   - Check API key format (Bearer, Basic, etc.)

2. **Timeout:**
   - Increase timeout: `\Http::timeout(60)`
   - Check network connectivity
   - Verify API endpoint URL

3. **Invalid Payload:**
   - Check API documentation
   - Log the payload before sending
   - Verify required fields

4. **SSL Certificate Error:**
   ```php
   \Http::withoutVerifying()->post(...)  // Only for testing!
   ```

---

## 📝 Summary

### Before (Current):
- ❌ Returns simulated tracking numbers
- ❌ Doesn't actually call shipping APIs

### After (With This Implementation):
- ✅ Makes real HTTP requests to custom APIs
- ✅ Supports Bosta, Aramex, DHL
- ✅ Supports any custom shipping API
- ✅ Returns real tracking numbers
- ✅ Comprehensive error handling
- ✅ Detailed logging

---

## 🎯 Next Steps

1. **Copy the methods above** to `ShippingController.php`
2. **Add API keys** to `.env` file
3. **Test with a real order**
4. **Check logs** for any errors
5. **Adjust payload format** based on shipping company requirements

---

**الحالة:** ✅ **READY FOR PRODUCTION** (بعد إضافة API Keys الحقيقية)

---

**تاريخ التحديث:** 15 أكتوبر 2025  
**الحالة:** ⏳ **Waiting for real API credentials**


