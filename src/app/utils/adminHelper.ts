// Admin Helper Functions for Debugging

export class AdminHelper {
  
  /**
   * التحقق من حالة admin tokens
   */
  static checkAdminStatus(): {
    hasAuthToken: boolean;
    hasAdminToken: boolean;
    userData: any;
    isAdmin: boolean;
  } {
    if (typeof window === 'undefined') {
      return {
        hasAuthToken: false,
        hasAdminToken: false,
        userData: null,
        isAdmin: false
      };
    }

    const authToken = localStorage.getItem('auth_token');
    const adminToken = localStorage.getItem('admin_token');
    const userDataString = localStorage.getItem('user_data');
    
    let userData = null;
    try {
      userData = userDataString ? JSON.parse(userDataString) : null;
    } catch (e) {
      console.error('❌ خطأ في تحليل user_data:', e);
    }

    return {
      hasAuthToken: !!authToken,
      hasAdminToken: !!adminToken,
      userData,
      isAdmin: userData?.role === 'admin'
    };
  }

  /**
   * طباعة تفاصيل admin للتطوير
   */
  static debugAdminStatus(): void {
    const status = this.checkAdminStatus();
    
    console.group('🔍 Admin Status Debug');
    console.log('📊 Auth Token:', status.hasAuthToken ? '✅ موجود' : '❌ غير موجود');
    console.log('🔑 Admin Token:', status.hasAdminToken ? '✅ موجود' : '❌ غير موجود');
    console.log('👤 User Data:', status.userData);
    console.log('🛡️ Is Admin:', status.isAdmin ? '✅ نعم' : '❌ لا');
    
    if (!status.hasAdminToken) {
      console.warn('⚠️ لا يوجد admin_token في localStorage');
      console.info('💡 قم بتشغيل AdminHelper.fixAdminToken() لإصلاح المشكلة');
    }
    
    console.groupEnd();
  }

  /**
   * إصلاح admin token
   */
  static fixAdminToken(): void {
    const adminToken = 'dev-admin-token-' + Date.now();
    const adminUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      phone: '+201234567890',
      company: 'Admin Company',
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    localStorage.setItem('admin_token', adminToken);
    localStorage.setItem('auth_token', adminToken);
    localStorage.setItem('user_data', JSON.stringify(adminUser));
    
    console.log('✅ تم إصلاح admin token بنجاح!');
    console.log('🔄 سيتم إعادة تحميل الصفحة...');
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  /**
   * مسح جميع tokens
   */
  static clearAllTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_data');
    
    console.log('🗑️ تم مسح جميع tokens');
  }

  /**
   * إضافة console commands للتطوير
   */
  static addGlobalCommands(): void {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.adminHelper = {
        check: () => this.debugAdminStatus(),
        fix: () => this.fixAdminToken(),
        clear: () => this.clearAllTokens(),
        status: () => this.checkAdminStatus()
      };
      
      console.log('🛠️ Admin Helper Commands مُضافة:');
      console.log('📊 adminHelper.check() - تحقق من حالة admin');
      console.log('🚀 adminHelper.fix() - إصلاح admin token');
      console.log('🗑️ adminHelper.clear() - مسح جميع tokens');
      console.log('📋 adminHelper.status() - عرض الحالة');
    }
  }
}

// تشغيل تلقائي للـ global commands في التطوير
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  AdminHelper.addGlobalCommands();
} 