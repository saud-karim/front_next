// Order Types & Interfaces for Complete Orders System

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_name_en: string;
  product_image: string;
  variant?: {
    id: number;
    name: string;
    name_en?: string;
  } | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  stock_available: number;
  notes?: string;
}

export interface CartData {
  cart_id: number | null;
  user_id?: number;
  items_count: number;
  items: CartItem[];
  summary: {
    subtotal: number;
    estimated_shipping: number;
    estimated_tax: number;
    estimated_total: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  variant_id?: number;
  notes?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface ShippingAddress {
  governorate: string;
  city: string;
  area?: string;
  street: string;
  building_number?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  full_address?: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  name_en: string;
  cost: number;
  estimated_days: string;
  company: string;
}

export interface CalculateShippingRequest {
  governorate: string;
  city: string;
  cart_items?: Array<{
    product_id: number;
    quantity: number;
    weight?: number;
  }>;
}

export interface CalculateShippingResponse {
  shipping_methods: ShippingMethod[];
  default_method_id: number;
}

export interface CouponData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount_amount: number;
  description: string;
}

export interface ApplyCouponRequest {
  coupon_code: string;
  subtotal: number;
}

export interface ApplyCouponResponse {
  coupon: CouponData;
  new_totals: {
    subtotal: number;
    discount: number;
    after_discount: number;
    shipping: number;
    total: number;
  };
}

export interface ValidateStockItem {
  product_id: number;
  variant_id?: number;
  quantity: number;
}

export interface ValidateStockRequest {
  items: ValidateStockItem[];
}

export interface ValidateStockResponse {
  all_available: boolean;
  items: Array<{
    product_id: number;
    variant_id?: number;
    requested_quantity: number;
    available_quantity: number;
    is_available: boolean;
  }>;
}

export interface OrderCustomer {
  id?: number;
  name: string;
  phone: string;
  email: string;
  is_guest?: boolean;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_name_en: string;
  product_slug?: string;
  product_image: string;
  product_sku?: string;
  variant?: {
    id: number;
    name: string;
    name_en?: string;
    sku?: string;
  } | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_url?: string;
  notes?: string;
}

export interface OrderAmounts {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

export interface OrderPayment {
  method: 'cash_on_delivery' | 'credit_card' | 'mobile_wallet' | 'bank_transfer';
  method_ar: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  status_ar: string;
  amount_to_pay?: number;
}

export interface OrderShipping {
  method: string;
  method_en?: string;
  company: string;
  company_en?: string;
  cost: number;
  tracking_number?: string;
  tracking_url?: string;
  estimated_delivery?: string;
  shipped_at?: string;
}

export interface OrderStatusHistoryItem {
  id: number;
  status: string;
  status_ar: string;
  previous_status: string | null;
  notes: string;
  changed_by: {
    id: number;
    name: string;
    type: 'system' | 'admin' | 'customer';
  };
  created_at: string;
}

export interface OrderTimelineItem {
  status: string;
  status_ar: string;
  is_completed: boolean;
  is_current?: boolean;
  date: string | null;
}

export interface CreateOrderRequest {
  customer: {
    name: string;
    phone: string;
    email: string;
    is_guest?: boolean;
  };
  shipping_address: ShippingAddress;
  items: Array<{
    product_id: number;
    variant_id?: number;
    quantity: number;
    unit_price: number;
  }>;
  payment: {
    method: 'cash_on_delivery' | 'credit_card' | 'mobile_wallet' | 'bank_transfer';
    currency: string;
  };
  shipping: {
    method_id: number;
    cost: number;
  };
  coupon_code?: string;
  notes?: string;
  source?: string;
}

export interface OrderData {
  id: number;
  order_number: string;
  status: string;
  status_ar: string;
  payment_status: string;
  payment_status_ar: string;
  
  customer: OrderCustomer;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  amounts: OrderAmounts;
  payment: OrderPayment;
  shipping: OrderShipping;
  
  coupon?: {
    code: string;
    type?: string;
    value?: number;
    discount_amount: number;
  };
  
  status_history?: OrderStatusHistoryItem[];
  timeline?: OrderTimelineItem[];
  
  notes?: string;
  source?: string;
  can_cancel?: boolean;
  can_return?: boolean;
  
  created_at: string;
  updated_at: string;
  estimated_delivery_date?: string;
  delivered_at?: string;
  cancelled_at?: string;
}

export interface OrderListItem {
  id: number;
  order_number: string;
  status: string;
  status_ar: string;
  payment_status: string;
  payment_status_ar: string;
  
  items_count: number;
  items_preview: Array<{
    product_name: string;
    product_image: string;
    quantity: number;
  }>;
  
  amounts: {
    total: number;
    currency: string;
  };
  
  shipping?: {
    method: string;
    company: string;
    estimated_delivery?: string;
  };
  
  created_at: string;
  updated_at: string;
  delivered_at?: string;
}

export interface OrdersListQuery {
  page?: number;
  per_page?: number;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface CancelOrderRequest {
  reason?: string;
  notes?: string;
}

export interface TrackingEvent {
  id: number;
  status: string;
  status_ar: string;
  location: string;
  description: string;
  timestamp: string | null;
  is_completed: boolean;
  is_current?: boolean;
}

export interface OrderTrackingData {
  order_id: number;
  order_number: string;
  current_status: string;
  current_status_ar: string;
  
  shipping: {
    company: string;
    company_en: string;
    tracking_number: string;
    tracking_url: string;
    estimated_delivery: string;
    shipped_at: string;
  };
  
  current_location?: {
    location: string;
    location_en: string;
    city: string;
    updated_at: string;
  };
  
  tracking_events: TrackingEvent[];
  
  delivery_info: {
    recipient_name: string;
    phone: string;
    address: string;
    estimated_delivery_date: string;
    delivery_window: string;
  };
  
  customer_actions: {
    can_cancel: boolean;
    can_change_address: boolean;
    can_reschedule: boolean;
    contact_support_url: string;
  };
}

export interface GuestTrackingRequest {
  order_number: string;
  phone: string;
}

export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  icon: string;
  is_available: boolean;
  is_default: boolean;
  fees: number;
  min_order?: number;
  max_order?: number;
  supported_cards?: string[];
  supported_wallets?: string[];
  payment_gateway?: string;
  bank_details?: {
    bank_name: string;
    account_name: string;
    account_number: string;
    iban: string;
  };
}

export interface PaymentMethodsResponse {
  methods: PaymentMethod[];
  default_method: string;
}

export interface CreatePaymentRequest {
  order_id: number;
  payment_method: string;
  amount: number;
  currency: string;
  return_url: string;
}

export interface CreatePaymentResponse {
  payment_id: string;
  order_id: number;
  amount: number;
  currency: string;
  status: string;
  payment_url: string;
  expires_at: string;
  redirect_info: {
    should_redirect: boolean;
    url: string;
    method: string;
  };
}

export interface PaymentStatusResponse {
  payment_id: string;
  order_id: number;
  order_number: string;
  status: string;
  status_ar: string;
  amount: number;
  currency: string;
  payment_method: string;
  transaction_id: string;
  paid_at: string;
  receipt: {
    url: string;
    download_url: string;
  };
}

export interface SubscribeNotificationsRequest {
  notification_channels: ('email' | 'sms' | 'push')[];
  email?: string;
  phone?: string;
  push_token?: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}



