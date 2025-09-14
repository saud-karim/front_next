// API Response Types
export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}

// Product Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  status: string;
  sort_order: number;
  parent_id?: number;
  full_path: string;
  products_count?: number;
  children?: Category[];
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  original_price?: string;
  rating?: string;
  reviews_count: number;
  stock: number;
  status: string;
  featured: boolean;
  images: string[];
  category?: Category;
  supplier?: {
    id: number;
    name: string;
    rating?: string;
  };
  is_in_stock: boolean;
  has_low_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  status: string;
  featured: boolean;
  sort_order: number;
  products_count?: number;
}

export interface Supplier {
  id: number;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  rating?: string;
  certifications?: string[];
  certification_count?: number;
  verified: boolean;
  status: string;
  products_count?: number;
}

// Cart Types  
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: string;
    images: string[];
    category?: Category;
    supplier?: {
      id: number;
      name: string;
      rating?: string;
    };
  };
  subtotal: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: string;
  tax: string;
  shipping: string;
  discount: string;
  total: string;
  currency: string;
  items_count: number;
}

export interface CartResponse {
  cart: Cart;
  coupon?: {
    code: string;
    type: string;
    value: string;
    discount_amount: string;
  };
}

// Wishlist Types
export interface WishlistItem {
  id: number;
  product_id: number;
  product: {
    id: number;
    name: string;
    price: string;
    images: string[];
    stock: number;
    category?: Category;
    supplier?: {
      id: number;
      name: string;
      rating?: string;
    };
    is_in_stock: boolean;
  };
  date_added: string;
}

// Additional Types for API Service
export interface ProductsResponse {
  products?: Product[];
  data?: Product[];
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ProductsQuery {
  page?: number;
  per_page?: number;
  search?: string;
  category?: number;
  min_price?: number;
  max_price?: number;
  featured?: number;
  sort?: string;
  order?: string;
}

export interface WishlistResponse {
  wishlist: WishlistItem[];
  total_items: number;
}

// Order Types
export interface Order {
  id: string;
  status: string;
  subtotal: string;
  total_amount: string;
  currency: string;
  payment_status: string;
  items_count: number;
  estimated_delivery: string;
  created_at: string;
}

export interface OrderDetails extends Order {
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  payment_method: string;
  shipping_address: Address;
  notes?: string;
  tracking_number?: string;
}

export interface OrdersQuery {
  page?: number;
  per_page?: number;
  status?: string;
}

// Address Types
export interface Address {
  id: number;
  type: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

// Reviews Types
export interface ReviewsQuery {
  page?: number;
  per_page?: number;
  rating?: number;
  include_pending?: boolean;
}

export interface ProductReviewsResponse {
  data: Array<{
    id: number;
    user_name: string;
    rating: number;
    review: string;
    status: string;
    verified_purchase: boolean;
    helpful_count: number;
    images: string[];
    created_at: string;
  }>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Notifications Types
export interface NotificationsResponse {
  data: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    read_at: string | null;
    data: Record<string, unknown>;
    created_at: string;
  }>;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
} 