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
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Language management
class LanguageManager {
  private static readonly LANG_KEY = 'language';
  
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
      // 🔍 DETAILED DEBUG LOGGING - REMOVE AFTER FIXING
      console.group('🔍 API REQUEST DEBUG');
      console.log('📍 Endpoint:', endpoint);
      console.log('🌐 Full URL:', url);
      console.log('📋 Method:', config.method);
      console.log('📦 Headers:', config.headers);
      console.log('📄 Body:', config.body);
      console.log('🎯 Expected URL: http://127.0.0.1:8000/api/v1/login');
      console.log('✅ Our tests proved this URL works!');
      console.groupEnd();
      
      const response = await fetch(url, config);
      
      // 🔍 DETAILED RESPONSE DEBUG - REMOVE AFTER FIXING
      console.group('📡 API RESPONSE DEBUG');
      console.log('📊 Status:', response.status, response.statusText);
      console.log('🏷️ Content-Type:', response.headers.get('content-type'));
      console.log('🔗 Response URL:', response.url);
      console.log('✅ Expected: 200 OK with application/json');
      console.groupEnd();
      
      // Check if response is HTML (404 page) instead of JSON
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('🚨 CONTENT TYPE MISMATCH!');
        console.error('Expected: application/json');
        console.error('Got:', contentType);
        console.error('Response preview:', text.substring(0, 200));
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 100)}`);
      }
      
      const data = await response.json();
      
      console.group('📋 PARSED JSON DATA');
      console.log('🎯 Success?', data.success);
      console.log('💬 Message:', data.message);
      if (data.data && data.data.user) {
        console.log('👤 User:', data.data.user.name);
        console.log('🔑 Role:', data.data.user.role);
      }
      console.groupEnd();

      if (!response.ok) {
        console.error('🚨 HTTP ERROR DETECTED!');
        console.error('📊 Status:', response.status);
        console.error('📋 Response OK?', response.ok);
        
        // Handle specific Laravel errors
        if (response.status === 419) {
          throw new Error('CSRF token mismatch - يرجى تحديث الصفحة أو تسجيل الخروج والدخول مرة أخرى');
        }
        if (response.status === 422 && data.errors) {
          // Laravel validation errors
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join(', '));
        }
        // تحسين رسالة الخطأ للمستخدم
        let errorMessage = data.message || `HTTP ${response.status}: ${response.statusText}`;
        
        console.error('💥 THROWING ERROR:', errorMessage);
        
        // معالجة خطأ Rate Limiting (429)
        if (response.status === 429) {
          errorMessage = 'طلبات كثيرة جداً. يرجى الانتظار قليلاً والمحاولة مرة أخرى.';
          // إضافة delay قبل إعادة المحاولة
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // معالجة أخطاء محددة من Backend
        if (errorMessage.includes('Attempt to read property') && errorMessage.includes('null')) {
          errorMessage = 'هذا المنتج غير متوفر حالياً. يرجى تحديث الصفحة والمحاولة مرة أخرى.';
        } else if (errorMessage.includes('product') && errorMessage.includes('not found')) {
          errorMessage = 'المنتج المطلوب غير موجود أو تم حذفه.';
        } else if (errorMessage.includes('stock') && errorMessage.includes('insufficient')) {
          errorMessage = 'عذراً، الكمية المطلوبة غير متوفرة في المخزون.';
        }
        
        throw new Error(errorMessage);
      }

      console.log('✅ REQUEST SUCCESSFUL! Returning data...');
      return data;
    } catch (error) {
      console.error('💥 CATCH BLOCK TRIGGERED!');
      console.error('🔍 Error type:', (error as any).constructor?.name);
      console.error('📝 Error message:', (error as any).message);
      console.error('📍 Full error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    let url = endpoint;
    const currentLang = LanguageManager.getCurrentLang();
    const allParams = {
      lang: currentLang,
      ...params
    };
    
    console.log('🌐 API Request Language:', currentLang, 'for endpoint:', endpoint);
    
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

  async patch<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<APIResponse<T>> {
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
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// API Service
export class ApiService {
  private static client = new ApiClient(API_BASE_URL);

  // Authentication APIs
  static async register(userData: RegisterRequest): Promise<APIResponse<LoginResponse>> {
    const response = await this.client.post<LoginResponse>('/register', userData);
    
    if (response.success && response.data.token) {
      TokenManager.setToken(response.data.token);
      // Store user data for profile workaround
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
      }
    }
    
    return response;
  }

  static async login(email: string, password: string): Promise<APIResponse<LoginResponse>> {
    const response = await this.client.post<LoginResponse>('/login', { email, password });
    
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
      const response = await this.client.post<any>('/logout');
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

  static async getProductDetails(id: number, params?: { lang?: string }): Promise<APIResponse<Product>> {
    return this.client.get<Product>(`/products/${id}`, params);
  }

  static async getFeaturedProducts(params?: { per_page?: number }): Promise<APIResponse<Product[]>> {
    return this.client.get<Product[]>('/products/featured', params);
  }

  static async searchProducts(query: string, params?: any): Promise<APIResponse<any>> {
    return this.client.get<any>('/search', { q: query, type: 'products', ...params });
  }

  // Categories APIs
  static async getCategories(params?: Record<string, any>): Promise<APIResponse<Category[]>> {
    return this.client.get<Category[]>('/categories', params);
  }

  static async getAdminCategories(params?: Record<string, any>): Promise<APIResponse<Category[]>> {
    return this.client.get<Category[]>('/admin/categories', params);
  }

  static async createCategory(categoryData: any): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/categories', categoryData);
  }

  static async updateCategory(categoryId: number, categoryData: any): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/categories/${categoryId}`, categoryData);
  }

  static async deleteCategory(categoryId: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/categories/${categoryId}`);
  }

  static async toggleCategoryStatus(categoryId: number): Promise<APIResponse<any>> {
    return this.client.patch<any>(`/admin/categories/${categoryId}/toggle-status`);
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

  static async updateCartItem(productId: number, quantity: number): Promise<APIResponse<CartResponse>> {
    return this.client.put<CartResponse>('/cart/update', { product_id: productId, quantity });
  }

  static async removeFromCart(productId: number): Promise<APIResponse<CartResponse>> {
    return this.client.delete<CartResponse>(`/cart/remove/${productId}`);
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

  // Get user's orders
  static async getUserOrders(params?: OrdersQuery): Promise<APIResponse<Order[]>> {
    return this.client.get<Order[]>('/user/orders', params);
  }

  // Update user profile
  static async updateUserProfile(profileData: {
    name: string;
    phone?: string;
    address?: string;
    company?: string;
  }): Promise<APIResponse<User>> {
    return this.client.put<User>('/user/profile', profileData);
  }

  static async getOrderDetails(orderId: string): Promise<APIResponse<OrderDetails>> {
    return this.client.get<OrderDetails>(`/orders/${orderId}`);
  }

  static async cancelOrder(orderId: string, reason?: string): Promise<APIResponse<any>> {
    return this.client.put<any>(`/orders/${orderId}/cancel`, { reason });
  }

  // Admin Orders APIs (using regular orders endpoint for now)
  static async getAdminOrders(params?: any): Promise<APIResponse<any>> {
    // Note: Using regular orders endpoint since admin/orders is not available in backend
    return this.client.get<any>('/orders', params);
  }

  static async getAdminOrderDetails(orderId: string): Promise<APIResponse<any>> {
    // Note: Using regular order details endpoint
    return this.client.get<any>(`/orders/${orderId}`);
  }

  static async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    // For now, return a mock response
    console.warn('⚠️ Admin order status update API not available in backend');
    return Promise.resolve({
      success: false,
      message: 'Admin order status update API not available in current backend version',
      data: null
    });
  }

  static async getOrdersStats(): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    // For now, return mock stats
    console.warn('⚠️ Admin orders stats API not available in backend');
    return Promise.resolve({
      success: true,
      data: {
        total_orders: 0,
        pending_orders: 0,
        processing_orders: 0,
        shipped_orders: 0,
        delivered_orders: 0,
        cancelled_orders: 0,
        total_revenue: 0,
        today_orders: 0,
        this_month_orders: 0
      }
    });
  }

  // Admin Customers APIs (Mock - not available in current backend)
  static async getAdminCustomers(params?: any): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    // For now, return mock customer data
    console.warn('⚠️ Admin customers API not available in backend');
    
    // Mock customer data
    const mockCustomers = [
      {
        id: 1,
        name: 'أحمد محمد علي',
        email: 'ahmed@example.com',
        phone: '+201234567890',
        company: 'شركة البناء المتقدم',
        role: 'customer',
        status: 'active',
        total_orders: 5,
        total_spent: 1250.50,
        last_order_date: '2024-01-15T10:30:00.000000Z',
        created_at: '2024-01-01T10:30:00.000000Z',
        updated_at: '2024-01-15T10:30:00.000000Z'
      },
      {
        id: 2,
        name: 'سارة أحمد محمود',
        email: 'sara@example.com',
        phone: '+201234567891',
        company: 'مؤسسة الإنشاء الحديث',
        role: 'customer',
        status: 'active',
        total_orders: 12,
        total_spent: 3450.75,
        last_order_date: '2024-01-14T09:15:00.000000Z',
        created_at: '2023-12-15T10:30:00.000000Z',
        updated_at: '2024-01-14T09:15:00.000000Z'
      },
      {
        id: 3,
        name: 'محمد عبد الرحمن',
        email: 'mohamed@example.com',
        phone: '+201234567892',
        company: 'شركة التطوير العقاري',
        role: 'customer',
        status: 'inactive',
        total_orders: 2,
        total_spent: 850.25,
        last_order_date: '2023-12-20T14:20:00.000000Z',
        created_at: '2023-11-10T10:30:00.000000Z',
        updated_at: '2023-12-20T14:20:00.000000Z'
      },
      {
        id: 4,
        name: 'فاطمة حسن',
        email: 'fatma@example.com',
        phone: '+201234567893',
        company: 'مكتب الهندسة المعمارية',
        role: 'customer',
        status: 'active',
        total_orders: 8,
        total_spent: 2100.00,
        last_order_date: '2024-01-12T11:45:00.000000Z',
        created_at: '2023-10-05T10:30:00.000000Z',
        updated_at: '2024-01-12T11:45:00.000000Z'
      },
      {
        id: 5,
        name: 'عمر الشريف',
        email: 'omar@example.com',
        phone: '+201234567894',
        company: 'شركة المقاولات الكبرى',
        role: 'customer',
        status: 'active',
        total_orders: 15,
        total_spent: 5200.80,
        last_order_date: '2024-01-16T08:30:00.000000Z',
        created_at: '2023-08-15T10:30:00.000000Z',
        updated_at: '2024-01-16T08:30:00.000000Z'
      }
    ];

    // Apply basic filtering
    let filteredCustomers = [...mockCustomers];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.company.toLowerCase().includes(search)
      );
    }

    if (params?.status) {
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.status === params.status
      );
    }

    // Sort by creation date (newest first)
    filteredCustomers.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Basic pagination
    const page = parseInt(params?.page) || 1;
    const perPage = parseInt(params?.per_page) || 20;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedCustomers = filteredCustomers.slice(start, end);

    return Promise.resolve({
      success: true,
      data: {
        data: paginatedCustomers,
        meta: {
          current_page: page,
          total: filteredCustomers.length,
          per_page: perPage,
          last_page: Math.ceil(filteredCustomers.length / perPage)
        }
      }
    });
  }

  static async getCustomerDetails(customerId: number): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    console.warn('⚠️ Customer details API not available in backend');
    
    // Mock customer details - would typically include order history, addresses, etc.
    const mockCustomer = {
      id: customerId,
      name: 'أحمد محمد علي',
      email: 'ahmed@example.com',
      phone: '+201234567890',
      company: 'شركة البناء المتقدم',
      role: 'customer',
      status: 'active',
      total_orders: 5,
      total_spent: 1250.50,
      last_order_date: '2024-01-15T10:30:00.000000Z',
      created_at: '2024-01-01T10:30:00.000000Z',
      updated_at: '2024-01-15T10:30:00.000000Z',
      addresses: [
        {
          id: 1,
          type: 'home',
          name: 'المنزل',
          street: 'شارع التحرير، المعادي',
          city: 'القاهرة',
          state: 'القاهرة',
          country: 'مصر',
          is_default: true
        }
      ],
      recent_orders: [
        {
          id: 'ORD-2024-001',
          status: 'delivered',
          total_amount: '250.50',
          created_at: '2024-01-15T10:30:00.000000Z'
        }
      ]
    };

    return Promise.resolve({
      success: true,
      data: { customer: mockCustomer }
    });
  }

  static async updateCustomerStatus(customerId: number, status: string): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    console.warn('⚠️ Customer status update API not available in backend');
    
    return Promise.resolve({
      success: false,
      message: 'Customer status update API not available in current backend version',
      data: null
    });
  }

  static async getCustomersStats(): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    console.warn('⚠️ Customers stats API not available in backend');
    
    return Promise.resolve({
      success: true,
      data: {
        total_customers: 5,
        active_customers: 4,
        inactive_customers: 1,
        new_customers_this_month: 2,
        total_orders_by_customers: 42,
        total_revenue_from_customers: 12851.30,
        average_order_value: 305.98,
        top_customers: 3
      }
    });
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

  // Admin Reviews APIs (Mock - not available in current backend)
  static async getAdminReviews(params?: any): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    // For now, return mock review data
    console.warn('⚠️ Admin reviews API not available in backend');
    
    // Mock reviews data
    const mockReviews = [
      {
        id: 1,
        user: {
          id: 1,
          name: 'أحمد محمد علي',
          email: 'ahmed@example.com'
        },
        product: {
          id: 8,
          name: 'حديد تسليح ممتاز 10 مم',
          image: '/images/products/rebar.jpg'
        },
        rating: 5,
        review: 'منتج ممتاز وجودة عالية، أنصح بشرائه بشدة. وصل في الوقت المحدد والتعامل كان احترافي.',
        status: 'approved',
        verified_purchase: true,
        helpful_count: 15,
        images: ['review1.jpg', 'review2.jpg'],
        created_at: '2024-01-15T10:30:00.000000Z',
        updated_at: '2024-01-15T10:30:00.000000Z'
      },
      {
        id: 2,
        user: {
          id: 2,
          name: 'سارة أحمد محمود',
          email: 'sara@example.com'
        },
        product: {
          id: 11,
          name: 'مثقاب كهربائي بوش GSR 120-LI',
          image: '/images/products/drill.jpg'
        },
        rating: 4,
        review: 'مثقاب جيد وعملي، لكن البطارية تحتاج لشحن متكرر. بشكل عام راضية عن الشراء.',
        status: 'pending',
        verified_purchase: true,
        helpful_count: 8,
        images: [],
        created_at: '2024-01-14T14:20:00.000000Z',
        updated_at: '2024-01-14T14:20:00.000000Z'
      },
      {
        id: 3,
        user: {
          id: 3,
          name: 'محمد عبد الرحمن',
          email: 'mohamed@example.com'
        },
        product: {
          id: 6,
          name: 'أسمنت بورتلاند ممتاز',
          image: '/images/products/cement.jpg'
        },
        rating: 3,
        review: 'جودة متوسطة، السعر مناسب لكن توقعت أفضل من ذلك.',
        status: 'approved',
        verified_purchase: false,
        helpful_count: 3,
        images: [],
        created_at: '2024-01-13T09:15:00.000000Z',
        updated_at: '2024-01-13T09:15:00.000000Z'
      },
      {
        id: 4,
        user: {
          id: 4,
          name: 'فاطمة حسن',
          email: 'fatma@example.com'
        },
        product: {
          id: 8,
          name: 'حديد تسليح ممتاز 10 مم',
          image: '/images/products/rebar.jpg'
        },
        rating: 1,
        review: 'للأسف المنتج وصل معيب وبه صدأ، خدمة العملاء لم تتجاوب معي. لا أنصح بالشراء.',
        status: 'rejected',
        verified_purchase: true,
        helpful_count: 22,
        images: ['defect1.jpg'],
        created_at: '2024-01-12T16:45:00.000000Z',
        updated_at: '2024-01-12T18:30:00.000000Z'
      },
      {
        id: 5,
        user: {
          id: 5,
          name: 'عمر الشريف',
          email: 'omar@example.com'
        },
        product: {
          id: 11,
          name: 'مثقاب كهربائي بوش GSR 120-LI',
          image: '/images/products/drill.jpg'
        },
        rating: 5,
        review: 'ممتاز! يعمل بكفاءة عالية ومناسب لجميع الأعمال. التعبئة كانت ممتازة والشحن سريع.',
        status: 'approved',
        verified_purchase: true,
        helpful_count: 19,
        images: ['unboxing.jpg', 'inuse.jpg'],
        created_at: '2024-01-11T11:20:00.000000Z',
        updated_at: '2024-01-11T11:20:00.000000Z'
      }
    ];

    // Apply basic filtering
    let filteredReviews = [...mockReviews];
    
    if (params?.search) {
      const search = params.search.toLowerCase();
      filteredReviews = filteredReviews.filter(review =>
        review.user.name.toLowerCase().includes(search) ||
        review.product.name.toLowerCase().includes(search) ||
        review.review.toLowerCase().includes(search)
      );
    }

    if (params?.status) {
      filteredReviews = filteredReviews.filter(review => 
        review.status === params.status
      );
    }

    if (params?.rating) {
      filteredReviews = filteredReviews.filter(review => 
        review.rating === parseInt(params.rating)
      );
    }

    if (params?.verified_only === 'true') {
      filteredReviews = filteredReviews.filter(review => 
        review.verified_purchase === true
      );
    }

    // Sort by creation date (newest first)
    filteredReviews.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Basic pagination
    const page = parseInt(params?.page) || 1;
    const perPage = parseInt(params?.per_page) || 20;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedReviews = filteredReviews.slice(start, end);

    return Promise.resolve({
      success: true,
      data: {
        data: paginatedReviews,
        meta: {
          current_page: page,
          total: filteredReviews.length,
          per_page: perPage,
          last_page: Math.ceil(filteredReviews.length / perPage)
        }
      }
    });
  }

  static async updateReviewStatus(reviewId: number, status: string, reason?: string): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    console.warn('⚠️ Review status update API not available in backend');
    
    return Promise.resolve({
      success: false,
      message: 'Review status update API not available in current backend version',
      data: null
    });
  }

  static async getReviewsStats(): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    console.warn('⚠️ Reviews stats API not available in backend');
    
    return Promise.resolve({
      success: true,
      data: {
        total_reviews: 5,
        approved_reviews: 3,
        pending_reviews: 1,
        rejected_reviews: 1,
        average_rating: 3.6,
        verified_reviews: 4,
        reviews_with_images: 3,
        helpful_reviews: 5,
        rating_breakdown: {
          5: 2,
          4: 1,
          3: 1,
          2: 0,
          1: 1
        }
      }
    });
  }

  // Admin Analytics APIs (Mock - not available in current backend)
  static async getAnalyticsOverview(): Promise<APIResponse<any>> {
    // Note: This endpoint is not available in current backend
    console.warn('⚠️ Analytics overview API not available in backend');
    
    return Promise.resolve({
      success: true,
      data: {
        total_revenue: 125430.75,
        total_orders: 342,
        total_customers: 156,
        total_products: 89,
        revenue_growth: 15.8,
        orders_growth: 12.4,
        customers_growth: 8.7,
        conversion_rate: 3.2,
        average_order_value: 366.86,
        repeat_customer_rate: 34.5,
        top_selling_product: 'حديد تسليح ممتاز 10 مم',
        top_category: 'الأدوات والمعدات'
      }
    });
  }

  static async getSalesAnalytics(period: string = '7days'): Promise<APIResponse<any>> {
    console.warn('⚠️ Sales analytics API not available in backend');
    
    const generateSalesData = (days: number) => {
      const data = [];
      const today = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 5000) + 1000,
          orders: Math.floor(Math.random() * 20) + 5,
          customers: Math.floor(Math.random() * 15) + 3
        });
      }
      return data;
    };

    const periodData = {
      '7days': generateSalesData(7),
      '30days': generateSalesData(30),
      '90days': generateSalesData(90)
    };

    return Promise.resolve({
      success: true,
      data: periodData[period as keyof typeof periodData] || periodData['7days']
    });
  }

  static async getTopProducts(limit: number = 10): Promise<APIResponse<any>> {
    console.warn('⚠️ Top products analytics API not available in backend');
    
    const topProducts = [
      {
        id: 8,
        name: 'حديد تسليح ممتاز 10 مم',
        category: 'الأدوات والمعدات',
        sales_count: 145,
        revenue: 4132.50,
        growth: 18.5
      },
      {
        id: 11,
        name: 'مثقاب كهربائي بوش GSR 120-LI',
        category: 'الأدوات والمعدات',
        sales_count: 89,
        revenue: 28480.00,
        growth: 12.3
      },
      {
        id: 6,
        name: 'أسمنت بورتلاند ممتاز',
        category: 'الأسمنت',
        sales_count: 234,
        revenue: 5850.00,
        growth: -2.1
      },
      {
        id: 15,
        name: 'مفك كهربائي ديوالت',
        category: 'الأدوات والمعدات',
        sales_count: 67,
        revenue: 13400.00,
        growth: 25.7
      },
      {
        id: 22,
        name: 'خلاطة خرسانة 350 لتر',
        category: 'المعدات الثقيلة',
        sales_count: 12,
        revenue: 36000.00,
        growth: 8.9
      }
    ];

    return Promise.resolve({
      success: true,
      data: topProducts.slice(0, limit)
    });
  }

  static async getCustomerAnalytics(): Promise<APIResponse<any>> {
    console.warn('⚠️ Customer analytics API not available in backend');
    
    return Promise.resolve({
      success: true,
      data: {
        total_customers: 156,
        new_customers_this_month: 23,
        returning_customers: 54,
        customer_lifetime_value: 2450.30,
        churn_rate: 5.2,
        acquisition_cost: 85.40,
        demographics: {
          age_groups: {
            '18-25': 12,
            '26-35': 45,
            '36-45': 67,
            '46-55': 28,
            '55+': 4
          },
          locations: {
            'القاهرة': 78,
            'الجيزة': 34,
            'الإسكندرية': 22,
            'أخرى': 22
          }
        },
        top_customers: [
          { name: 'شركة المقاولات الكبرى', orders: 15, revenue: 5200.80 },
          { name: 'مؤسسة الإنشاء الحديث', orders: 12, revenue: 3450.75 },
          { name: 'شركة البناء المتقدم', orders: 8, revenue: 2890.50 }
        ]
      }
    });
  }

  static async getCategoryAnalytics(): Promise<APIResponse<any>> {
    console.warn('⚠️ Category analytics API not available in backend');
    
    return Promise.resolve({
      success: true,
      data: [
        {
          id: 2,
          name: 'الأدوات والمعدات',
          products_count: 25,
          revenue: 45230.80,
          orders: 156,
          growth: 18.7,
          percentage: 36.1
        },
        {
          id: 3,
          name: 'معدات الأمان',
          products_count: 12,
          revenue: 15670.40,
          orders: 89,
          growth: 8.3,
          percentage: 12.5
        },
        {
          id: 9,
          name: 'الأسمنت',
          products_count: 8,
          revenue: 28440.20,
          orders: 234,
          growth: -2.1,
          percentage: 22.7
        },
        {
          id: 4,
          name: 'المواد الخام',
          products_count: 18,
          revenue: 22890.15,
          orders: 123,
          growth: 12.9,
          percentage: 18.3
        },
        {
          id: 5,
          name: 'المعدات الثقيلة',
          products_count: 6,
          revenue: 13199.20,
          orders: 34,
          growth: 25.4,
          percentage: 10.5
        }
      ]
    });
  }

  static async getOrdersAnalytics(): Promise<APIResponse<any>> {
    console.warn('⚠️ Orders analytics API not available in backend');
    
    return Promise.resolve({
      success: true,
      data: {
        total_orders: 342,
        pending_orders: 23,
        processing_orders: 45,
        shipped_orders: 67,
        delivered_orders: 189,
        cancelled_orders: 18,
        refunded_orders: 8,
        order_trends: {
          daily_average: 12.3,
          weekly_growth: 8.7,
          monthly_growth: 15.2
        },
        payment_methods: {
          'credit_card': 145,
          'cash_on_delivery': 123,
          'bank_transfer': 74
        },
        shipping_methods: {
          'standard': 234,
          'express': 89,
          'pickup': 19
        }
      }
    });
  }

  static async getRevenueAnalytics(period: string = '12months'): Promise<APIResponse<any>> {
    console.warn('⚠️ Revenue analytics API not available in backend');
    
    const generateMonthlyData = () => {
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                     'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
      return months.map((month, index) => ({
        month,
        revenue: Math.floor(Math.random() * 15000) + 5000,
        orders: Math.floor(Math.random() * 50) + 20,
        profit: Math.floor(Math.random() * 5000) + 2000
      }));
    };

    return Promise.resolve({
      success: true,
      data: {
        monthly_data: generateMonthlyData(),
        total_revenue: 125430.75,
        total_profit: 35620.45,
        profit_margin: 28.4,
        revenue_growth: 15.8,
        best_month: 'نوفمبر',
        worst_month: 'فبراير'
      }
    });
  }



  // Admin Review Management APIs (Available in backend)
  static async getReviewsStats(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/reviews/stats');
  }

  static async getAdminReviews(params?: any): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/reviews', params);
  }

  static async getReviewAnalytics(params?: any): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/reviews/analytics', params);
  }

  static async getAdminReviewDetails(reviewId: number): Promise<APIResponse<any>> {
    return this.client.get<any>(`/admin/reviews/${reviewId}`);
  }

  static async updateReviewStatus(reviewId: number, status: string, reason?: string): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/reviews/${reviewId}/status`, { status, reason });
  }

  // Admin Customer Management APIs (Available in backend)
  static async getCustomersStats(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/customers/stats');
  }

  static async getAdminCustomers(params?: any): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/customers', params);
  }

  // Admin Contact Messages APIs
  static async getContactMessageStats(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/contact-messages/stats');
  }

  static async getContactMessages(params?: any): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/contact-messages', params);
  }

  static async getContactMessage(messageId: number): Promise<APIResponse<any>> {
    return this.client.get<any>(`/admin/contact-messages/${messageId}`);
  }

  static async updateContactMessageStatus(messageId: number, status: string): Promise<APIResponse<any>> {
    return this.client.patch<any>(`/admin/contact-messages/${messageId}/status`, { status });
  }

  static async deleteContactMessage(messageId: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/contact-messages/${messageId}`);
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
  static async sendContactMessage(contactData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    project_type?: string;
  }): Promise<APIResponse<{
    ticket_id: string;
  }>> {
    return this.client.post('/contact', contactData);
  }

  // Brands APIs
  static async getBrands(params?: { featured?: boolean }): Promise<APIResponse<Brand[]>> {
    return this.client.get<Brand[]>('/brands', params);
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

  // Admin Dashboard APIs
  static async getDashboardStats(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/dashboard/stats');
  }

  static async getRecentActivity(params?: { limit?: number }): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/admin/dashboard/recent-activity', params);
  }

  static async getDashboardOverview(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/dashboard/overview');
  }

  // Suppliers API
  static async getSuppliers(params?: { lang?: string; page?: number; per_page?: number }): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/suppliers', params);
  }

  static async getSupplierDetails(id: number, params?: { lang?: string }): Promise<APIResponse<any>> {
    return this.client.get<any>(`/suppliers/${id}`, params);
  }

  // Admin Products Management APIs
  static async getAdminProducts(params?: any): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/products', params);
  }

  static async getAdminProductsStats(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/products/stats');
  }

  static async getAdminProduct(id: number, params?: { lang?: string }): Promise<APIResponse<any>> {
    console.log('🔍 Admin Product API Call:', `/admin/products/${id}`, params);
    return this.client.get<any>(`/admin/products/${id}`, params);
  }

  static async createProduct(data: any): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/products', data);
  }

  static async createProductWithFiles(formData: FormData): Promise<APIResponse<any>> {
    // إعداد headers خاص للـ FormData
    const url = `${this.client.baseURL}/admin/products`;
    const token = this.getToken();

    const config: RequestInit = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        // لا نضع Content-Type لأن FormData هيحطه تلقائياً
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      console.log('📡 Creating product with FormData to:', url);
      console.log('📡 Token present:', !!token);
      
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Create product with files failed:', response.status, data);
        return {
          success: false,
          message: data.message || `HTTP ${response.status}`,
          data: null
        };
      }

      console.log('✅ Create product with files success:', data);
      return {
        success: true,
        message: data.message || 'Product created successfully',
        data: data.data || data
      };
    } catch (error: any) {
      console.error('❌ Network error in createProductWithFiles:', error);
      return {
        success: false,
        message: error.message || 'Network error occurred',
        data: null
      };
    }
  }

  static async updateProduct(id: number, data: any): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/products/${id}`, data);
  }

  static async updateProductWithFiles(id: number, formData: FormData): Promise<APIResponse<any>> {
    try {
      // ✅ إعداد URL صحيح مع protocol كامل
      const baseUrl = 'http://localhost:8000/api/v1';
      const url = `${baseUrl}/admin/products/${id}`;
      const token = this.getToken();

      console.log('📋 FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
      }

      console.log('📡 Sending FormData to:', url);
      console.log('📡 Token present:', !!token);
      console.log('📡 Method: POST (pure FormData)');
      
      // ✅ طلب مباشر بدون method spoofing
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          // ⚠️ لا نضع Content-Type للـ FormData!
        },
        body: formData,
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP Error:', response.status, errorText);
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      console.log('📡 FormData Upload Response:', data);

      if (data.success) {
        console.log('✅ FormData upload success:', data);
        return {
          success: true,
          message: data.message || 'تم تحديث المنتج بنجاح',
          data: data.data
        };
      } else {
        console.error('🚫 API Error Response:', data);
        if (data.errors) {
          console.error('🚫 Validation Errors:', data.errors);
          Object.entries(data.errors).forEach(([field, messages]) => {
            console.error(`❌ ${field}:`, messages);
          });
        }
        throw new Error(data.message || 'فشل تحديث المنتج');
      }
    } catch (error: any) {
      console.error('❌ FormData Upload Error:', error);
      
      if (error.message?.includes('Failed to fetch')) {
        throw new Error('خطأ في الاتصال بالسيرفر. تأكد من أن Backend يعمل على http://localhost:8000');
      }
      
      throw new Error(error.message || 'حدث خطأ في الشبكة');
    }
  }

  private static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
    }
    return null;
  }

  static async deleteProduct(id: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/products/${id}`);
  }

  static async toggleProductStatus(id: number): Promise<APIResponse<any>> {
    return this.client.patch<any>(`/admin/products/${id}/toggle-status`);
  }

  static async toggleProductFeatured(id: number): Promise<APIResponse<any>> {
    return this.client.patch<any>(`/admin/products/${id}/toggle-featured`);
  }

  // ===================================
  // CONTENT MANAGEMENT APIs
  // ===================================

  // 1. Company Information API
  static async getCompanyInfo(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/company-info');
  }

  static async updateCompanyInfo(data: {
    company_name_ar: string;
    company_name_en: string;
    company_description_ar?: string;
    company_description_en?: string;
    mission_ar?: string;
    mission_en?: string;
    vision_ar?: string;
    vision_en?: string;
    logo_text?: string;
    founded_year?: string;
    employees_count?: string;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>('/admin/company-info', data);
  }

  // 2. Company Statistics API
  static async getCompanyStats(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/company-stats');
  }

  static async updateCompanyStats(data: {
    years_experience: string;
    total_customers: string;
    completed_projects: string;
    support_availability: string;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>('/admin/company-stats', data);
  }

  // 3. Contact Information API
  static async getContactInfo(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/contact-info');
  }

  static async updateContactInfo(data: any): Promise<APIResponse<any>> {
    return this.client.put<any>('/admin/contact-info', data);
  }

  // 4. Departments API
  static async getDepartments(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/admin/departments');
  }

  static async createDepartment(data: {
    name_ar: string;
    name_en: string;
    description_ar?: string;
    description_en?: string;
    phone?: string;
    email?: string;
    icon?: string;
    color?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/departments', data);
  }

  static async updateDepartment(id: number, data: {
    name_ar: string;
    name_en: string;
    description_ar?: string;
    description_en?: string;
    phone?: string;
    email?: string;
    icon?: string;
    color?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/departments/${id}`, data);
  }

  static async deleteDepartment(id: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/departments/${id}`);
  }

  // 5. Social Links API
  static async getSocialLinks(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/admin/social-links');
  }

  static async createSocialLink(data: {
    platform: string;
    url: string;
    icon?: string;
    color?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/social-links', data);
  }

  static async updateSocialLink(id: number, data: {
    platform: string;
    url: string;
    icon?: string;
    color?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/social-links/${id}`, data);
  }

  static async deleteSocialLink(id: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/social-links/${id}`);
  }

  // 6. Team Members API
  static async getTeamMembers(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/admin/team-members');
  }

  static async createTeamMember(data: {
    name_ar: string;
    name_en: string;
    role_ar: string;
    role_en: string;
    experience_ar?: string;
    experience_en?: string;
    email: string;
    phone?: string;
    linkedin?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/team-members', data);
  }

  static async updateTeamMember(id: number, data: {
    name_ar: string;
    name_en: string;
    role_ar: string;
    role_en: string;
    experience_ar?: string;
    experience_en?: string;
    email: string;
    phone?: string;
    linkedin?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/team-members/${id}`, data);
  }

  static async deleteTeamMember(id: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/team-members/${id}`);
  }

  // 7. Company Values API
  static async getCompanyValues(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/admin/company-values');
  }

  static async createCompanyValue(data: {
    title_ar: string;
    title_en: string;
    description_ar?: string;
    description_en?: string;
    icon?: string;
    color?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/company-values', data);
  }

  static async updateCompanyValue(id: number, data: {
    title_ar: string;
    title_en: string;
    description_ar?: string;
    description_en?: string;
    icon?: string;
    color?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/company-values/${id}`, data);
  }

  static async deleteCompanyValue(id: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/company-values/${id}`);
  }

  // 8. Company Milestones API
  static async getCompanyMilestones(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/admin/company-milestones');
  }

  static async createMilestone(data: {
    year: string;
    event_ar: string;
    event_en: string;
    description_ar?: string;
    description_en?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/company-milestones', data);
  }

  static async updateMilestone(id: number, data: {
    year: string;
    event_ar: string;
    event_en: string;
    description_ar?: string;
    description_en?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/company-milestones/${id}`, data);
  }

  static async deleteMilestone(id: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/company-milestones/${id}`);
  }

  // 9. Company Story API
  static async getCompanyStory(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/company-story');
  }

  static async updateCompanyStory(data: {
    paragraph1_ar?: string;
    paragraph1_en?: string;
    paragraph2_ar?: string;
    paragraph2_en?: string;
    paragraph3_ar?: string;
    paragraph3_en?: string;
    features: Array<{
      name_ar: string;
      name_en: string;
    }>;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>('/admin/company-story', data);
  }

  // 10. Page Content API (Static Texts)
  static async getPageContent(): Promise<APIResponse<any>> {
    return this.client.get<any>('/admin/page-content');
  }

  static async updatePageContent(data: {
    about_page?: any;
    contact_page?: any;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>('/admin/page-content', data);
  }

  // 11. FAQ Content API
  static async getFAQs(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/admin/faqs');
  }

  static async createFAQ(data: {
    question_ar: string;
    question_en: string;
    answer_ar: string;
    answer_en: string;
    category?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/faqs', data);
  }

  static async updateFAQ(id: number, data: {
    question_ar: string;
    question_en: string;
    answer_ar: string;
    answer_en: string;
    category?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/faqs/${id}`, data);
  }

  static async deleteFAQ(id: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/faqs/${id}`);
  }

  // 12. Certifications API
  static async getCertifications(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/admin/certifications');
  }

  static async createCertification(formData: FormData): Promise<APIResponse<any>> {
    return this.client.post<any>('/admin/certifications', formData);
  }

  static async updateCertification(id: number, formData: FormData): Promise<APIResponse<any>> {
    return this.client.put<any>(`/admin/certifications/${id}`, formData);
  }

  static async deleteCertification(id: number): Promise<APIResponse<any>> {
    return this.client.delete<any>(`/admin/certifications/${id}`);
  }

  // ===================================
  // PUBLIC APIs (No Authentication Required)
  // ===================================

  // Public Company Information API
  static async getPublicCompanyInfo(): Promise<APIResponse<any>> {
    return this.client.get<any>('/public/company-info');
  }

  // Public Company Statistics API
  static async getPublicCompanyStats(): Promise<APIResponse<any>> {
    return this.client.get<any>('/public/company-stats');
  }

  // Public Contact Information API
  static async getPublicContactInfo(): Promise<APIResponse<any>> {
    return this.client.get<any>('/public/contact-info');
  }

  // Public Social Links API
  static async getPublicSocialLinks(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/public/social-links');
  }

  // Public Page Content API
  static async getPublicPageContent(): Promise<APIResponse<any>> {
    return this.client.get<any>('/public/page-content');
  }

  // Public Company Values API
  static async getPublicCompanyValues(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/public/company-values');
  }

  // Public Company Milestones API
  static async getPublicCompanyMilestones(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/public/company-milestones');
  }

  // Public Company Story API
  static async getPublicCompanyStory(): Promise<APIResponse<any>> {
    return this.client.get<any>('/public/company-story');
  }

  // Public FAQ Content API
  static async getPublicFAQs(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/public/faqs');
  }

  // Public Certifications API
  static async getPublicCertifications(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/public/certifications');
  }

  // Public Team Members API (for About page)
  static async getPublicTeamMembers(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/public/team-members');
  }

  // Public Departments API (for Contact page)
  static async getPublicDepartments(): Promise<APIResponse<any[]>> {
    return this.client.get<any[]>('/public/departments');
  }
}

// Export Language Manager for use in components
export { LanguageManager };

export default ApiService; 