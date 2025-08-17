import {
  APIResponse,
  User,
  LoginResponse,
  RegisterRequest,
  Product,
  ProductsResponse,
  ProductsQuery,
  Category,
  Cart,
  CartResponse,
  WishlistResponse,
  Order,
  OrderDetails,
  OrdersQuery,
  Address,
  ProductReviewsResponse,
  ReviewsQuery,
  NotificationsResponse,
  Brand,
  Supplier,
} from '../types/api';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Language management
class LanguageManager {
  private static readonly LANG_KEY = 'app_language';
  
  static getCurrentLang(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.LANG_KEY) || 'ar';
    }
    return 'ar';
  }
  
  static setLanguage(lang: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.LANG_KEY, lang);
    }
  }
}

// Token management
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
  
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }
  
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }
}

// HTTP Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();

    const defaultHeaders: HeadersInit = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is HTML (404 page) instead of JSON
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`);
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    let url = endpoint;
    const allParams = {
      lang: LanguageManager.getCurrentLang(),
      ...params
    };
    
    console.log('🌍 API Call:', endpoint, 'مع اللغة:', allParams.lang, 'والمعاملات:', allParams);

    const searchParams = new URLSearchParams();
    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<APIResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const allParams = {
        lang: LanguageManager.getCurrentLang(),
        ...params
      };
      const searchParams = new URLSearchParams();
      Object.entries(allParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<APIResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const allParams = {
        lang: LanguageManager.getCurrentLang(),
        ...params
      };
      const searchParams = new URLSearchParams();
      Object.entries(allParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const allParams = {
        lang: LanguageManager.getCurrentLang(),
        ...params
      };
      const searchParams = new URLSearchParams();
      Object.entries(allParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request<T>(url, { method: 'DELETE' });
  }
}

// API Service
export class ApiService {
  private static client = new ApiClient(API_BASE_URL);

  // Authentication APIs
  static async register(userData: RegisterRequest): Promise<APIResponse<LoginResponse>> {
    return this.client.post<LoginResponse>('/auth/register', userData);
  }

  static async login(email: string, password: string): Promise<APIResponse<LoginResponse>> {
    const response = await this.client.post<LoginResponse>('/auth/login', { email, password });
    
    if (response.success && response.data.token) {
      TokenManager.setToken(response.data.token);
      // Store user data for profile workaround
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  }

  static async logout(): Promise<APIResponse<any>> {
    try {
      const response = await this.client.post<any>('/auth/logout');
      TokenManager.removeToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
      }
      return response;
    } catch (error) {
      // Even if logout fails, remove local data
      TokenManager.removeToken();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_data');
      }
      throw error;
    }
  }

  static async getProfile(): Promise<APIResponse<{ user: User }>> {
    return this.client.get<{ user: User }>('/profile');
  }

  static async updateProfile(userData: Partial<User>): Promise<APIResponse<{ user: User }>> {
    return this.client.put<{ user: User }>('/profile', userData);
  }

  // Products APIs
  static async getProducts(params?: ProductsQuery): Promise<APIResponse<Product[]>> {
    return this.client.get<Product[]>('/products', params);
  }

  static async getProductDetails(id: number): Promise<APIResponse<Product>> {
    return this.client.get<Product>(`/products/${id}`);
  }

  static async getFeaturedProducts(params?: { per_page?: number }): Promise<APIResponse<Product[]>> {
    return this.client.get<Product[]>('/products/featured', params);
  }

  static async searchProducts(query: string, params?: any): Promise<APIResponse<any>> {
    return this.client.get<any>('/search', { q: query, type: 'products', ...params });
  }

  // Categories APIs
  static async getCategories(): Promise<APIResponse<Category[]>> {
    return this.client.get<Category[]>('/categories');
  }

  static async getCategoryProducts(categoryId: number, params?: any): Promise<any> {
    const response = await this.client.get<any>(`/categories/${categoryId}`, params);
    
    // This API returns data directly in response body, not in response.data
    return response;
  }

  // Cart APIs
  static async getCart(): Promise<APIResponse<Cart>> {
    return this.client.get<Cart>('/cart');
  }

  static async addToCart(productId: number, quantity: number = 1): Promise<APIResponse<CartResponse>> {
    return this.client.post<CartResponse>('/cart/add', { product_id: productId, quantity });
  }

  static async updateCartItem(cartItemId: number, quantity: number): Promise<APIResponse<CartResponse>> {
    return this.client.put<CartResponse>('/cart/update', { cart_item_id: cartItemId, quantity });
  }

  static async removeFromCart(cartItemId: number): Promise<APIResponse<CartResponse>> {
    return this.client.delete<CartResponse>(`/cart/remove/${cartItemId}`);
  }

  static async applyCoupon(couponCode: string): Promise<APIResponse<CartResponse>> {
    return this.client.post<CartResponse>('/cart/apply-coupon', { coupon_code: couponCode });
  }

  static async removeCoupon(): Promise<APIResponse<CartResponse>> {
    return this.client.post<CartResponse>('/cart/remove-coupon');
  }

  static async clearCart(): Promise<APIResponse<any>> {
    return this.client.delete<any>('/cart/clear');
  }

  // Wishlist APIs
  static async getWishlist(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/wishlist');
  }

  static async addToWishlist(productId: number): Promise<APIResponse<any>> {
    return this.client.post<any>('/wishlist/add', { product_id: productId });
  }

  static async removeFromWishlist(productId: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/wishlist/remove/${productId}`);
  }

  static async toggleWishlist(productId: number): Promise<APIResponse<any>> {
    return this.client.post<any>('/wishlist/toggle', { product_id: productId });
  }

  static async checkWishlist(productId: number): Promise<APIResponse<any>> {
    return this.client.get<any>(`/wishlist/check/${productId}`);
  }

  static async moveToCart(productId: number, quantity: number = 1): Promise<APIResponse<any>> {
    return this.client.post<any>('/wishlist/move-to-cart', { product_id: productId, quantity });
  }

  // Orders APIs
  static async createOrder(orderData: any): Promise<APIResponse<any>> {
    return this.client.post<any>('/orders', orderData);
  }

  static async getOrders(params?: OrdersQuery): Promise<APIResponse<Order[]>> {
    return this.client.get<Order[]>('/orders', params);
  }

  static async getOrderDetails(orderId: string): Promise<APIResponse<OrderDetails>> {
    return this.client.get<OrderDetails>(`/orders/${orderId}`);
  }

  static async cancelOrder(orderId: string, reason?: string): Promise<APIResponse<any>> {
    return this.client.put<any>(`/orders/${orderId}/cancel`, { reason });
  }

  // Reviews APIs
  static async getProductReviews(productId: number, params?: ReviewsQuery): Promise<APIResponse<any>> {
    return this.client.get<any>(`/products/${productId}/reviews`, params);
  }

  static async addReview(productId: number, reviewData: any): Promise<APIResponse<any>> {
    return this.client.post<any>(`/products/${productId}/reviews`, reviewData);
  }

  static async updateReview(reviewId: number, reviewData: any): Promise<APIResponse<any>> {
    return this.client.put<any>(`/reviews/${reviewId}`, reviewData);
  }

  static async deleteReview(reviewId: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/reviews/${reviewId}`);
  }

  static async markReviewHelpful(reviewId: number): Promise<APIResponse<any>> {
    return this.client.post<any>(`/reviews/${reviewId}/helpful`);
  }

  // Addresses APIs
  static async getAddresses(): Promise<APIResponse<Address[]>> {
    return this.client.get<Address[]>('/addresses');
  }

  static async getAddress(addressId: number): Promise<APIResponse<Address>> {
    return this.client.get<Address>(`/addresses/${addressId}`);
  }

  static async addAddress(addressData: any): Promise<APIResponse<Address>> {
    return this.client.post<Address>('/addresses', addressData);
  }

  static async updateAddress(addressId: number, addressData: any): Promise<APIResponse<Address>> {
    return this.client.put<Address>(`/addresses/${addressId}`, addressData);
  }

  static async deleteAddress(addressId: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/addresses/${addressId}`);
  }

  static async makeDefaultAddress(addressId: number): Promise<APIResponse<Address>> {
    return this.client.post<Address>(`/addresses/${addressId}/make-default`);
  }

  // Contact APIs
  static async sendContactMessage(contactData: any): Promise<APIResponse<any>> {
    return this.client.post<any>('/contact', contactData);
  }

  // Brands APIs
  static async getBrands(params?: { featured?: boolean }): Promise<APIResponse<Brand[]>> {
    return this.client.get<Brand[]>('/brands', params);
  }

  // Suppliers APIs
  static async getSuppliers(params?: any): Promise<APIResponse<Supplier[]>> {
    return this.client.get<Supplier[]>('/suppliers', params);
  }

  static async getSupplier(supplierId: number): Promise<APIResponse<any>> {
    return this.client.get<any>(`/suppliers/${supplierId}`);
  }

  // Notifications APIs
  static async getNotifications(params?: any): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/notifications', params);
  }

  static async markNotificationRead(notificationId: number): Promise<APIResponse<any>> {
    return this.client.put<any>(`/notifications/${notificationId}/read`);
  }

  static async markAllNotificationsRead(): Promise<APIResponse<any>> {
    return this.client.post<any>('/notifications/mark-all-read');
  }

  // Newsletter APIs
  static async subscribeNewsletter(email: string, preferences?: string[]): Promise<APIResponse<any>> {
    return this.client.post<any>('/newsletter/subscribe', { email, preferences });
  }

  static async unsubscribeNewsletter(email: string): Promise<APIResponse<any>> {
    return this.client.post<any>('/newsletter/unsubscribe', { email });
  }

  // Cost Calculator APIs
  static async calculateCost(calculationData: any): Promise<APIResponse<any>> {
    return this.client.post<any>('/cost-calculator', calculationData);
  }

  static async getCalculationHistory(params?: any): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/cost-calculator/history', params);
  }

  // Tracking APIs
  static async trackOrder(orderId: string): Promise<APIResponse<any>> {
    return this.client.get<any>(`/orders/${orderId}/tracking`);
  }

  // Health & Testing APIs
  static async healthCheck(): Promise<APIResponse<any>> {
    return this.client.get<any>('/health');
  }

  static async testConnection(): Promise<APIResponse<any>> {
    return this.client.get<any>('/test');
  }

  static async testAuth(): Promise<APIResponse<any>> {
    return this.client.get<any>('/auth-test');
  }
}

// Export Language Manager for use in components
export { LanguageManager };

export default ApiService; 