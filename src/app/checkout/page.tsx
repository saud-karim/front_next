'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ApiService } from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ShippingAddress {
  governorate: string;
  city: string;
  district: string;
  street: string;
  building_number?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  postal_code?: string;
  phone: string;
  name: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const toast = useToast();
  const { user } = useAuth();
  const { cart, refreshCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    governorate: '',
    city: '',
    district: '',
    street: '',
    building_number: '',
    floor: '',
    apartment: '',
    landmark: '',
    postal_code: '',
    phone: user?.phone || '',
    name: user?.name || ''
  });

  // Ref to prevent double submission - IMMEDIATE check (no re-render delay)
  const isSubmittingRef = useRef(false);

  // Calculate totals from cart (try multiple sources)
  const calculateSubtotal = () => {
    // Try cart.summary first
    if (cart?.summary?.subtotal) {
      const value = typeof cart.summary.subtotal === 'string' 
        ? parseFloat(cart.summary.subtotal) 
        : cart.summary.subtotal;
      if (!isNaN(value) && value > 0) return value;
    }
    
    // Try cart.subtotal (direct)
    if (cart?.subtotal) {
      const value = typeof cart.subtotal === 'string' 
        ? parseFloat(cart.subtotal) 
        : cart.subtotal;
      if (!isNaN(value) && value > 0) return value;
    }
    
    // Calculate from items - THIS IS THE MAIN CALCULATION!
    if (cart?.items && Array.isArray(cart.items) && cart.items.length > 0) {
      const total = cart.items.reduce((sum: number, item: any) => {
        // Try different price fields
        let itemPrice = 0;
        
        if (item.total_price) {
          itemPrice = typeof item.total_price === 'string' ? parseFloat(item.total_price) : item.total_price;
        } else if (item.unit_price && item.quantity) {
          const unitPrice = typeof item.unit_price === 'string' ? parseFloat(item.unit_price) : item.unit_price;
          itemPrice = unitPrice * item.quantity;
        } else if (item.price && item.quantity) {
          const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
          itemPrice = price * item.quantity;
        }
        
        return sum + (isNaN(itemPrice) ? 0 : itemPrice);
      }, 0);
      
      return total;
    }
    
    return 0;
  };

  const parseCartValue = (value: any, defaultValue: number = 0): number => {
    if (!value) return defaultValue;
    const parsed = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const subtotal = calculateSubtotal();
  const shippingCost = parseCartValue(
    cart?.summary?.estimated_shipping || 
    cart?.summary?.shipping || 
    cart?.shipping, 
    50
  );
  const tax = parseCartValue(
    cart?.summary?.estimated_tax || 
    cart?.summary?.tax || 
    cart?.tax, 
    0
  );
  const discount = parseCartValue(
    cart?.summary?.discount || 
    cart?.discount, 
    0
  );
  const total = parseCartValue(
    cart?.summary?.estimated_total || 
    cart?.summary?.total || 
    cart?.total
  ) || (subtotal + shippingCost + tax - discount);

  // Debug cart calculations
  useEffect(() => {
    if (cart) {
      console.log('🛒 Checkout - Cart Summary:', {
        items_count: cart.items_count,
        summary: cart.summary,
        calculated: {
          subtotal,
          shipping: shippingCost,
          tax,
          discount,
          total
        }
      });
    }
  }, [cart, subtotal, shippingCost, tax, discount, total]);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    // Don't redirect if cart exists (even if items_count is 0, we can still calculate from items)
    if (!cart || (!cart.items || cart.items.length === 0)) {
      // Only redirect if truly no items
      if (!cart?.items?.length) {
        router.push('/cart');
        return;
      }
    }
  }, [user, cart, router]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'أدخل كود الخصم' : 'Enter coupon code'
      );
      return;
    }

    try {
      setApplyingCoupon(true);
      const response = await ApiService.applyCoupon(couponCode);

      if (response.success) {
        toast.success(
          language === 'ar' ? 'نجح' : 'Success',
          language === 'ar' ? 'تم تطبيق الكود بنجاح' : 'Coupon applied successfully'
        );
        await refreshCart();
      }
    } catch (error: any) {
      toast.error(
        language === 'ar' ? 'خطأ' : 'Error',
        error.message || (language === 'ar' ? 'كود خصم غير صالح' : 'Invalid coupon code')
      );
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async () => {
    // 🔒 CRITICAL: Prevent double submission using Ref (IMMEDIATE - no re-render delay)
    if (isSubmittingRef.current) {
      console.log('🚫 Order already being processed, ignoring duplicate click...');
      toast.error(
        language === 'ar' ? 'تنبيه' : 'Warning',
        language === 'ar' ? '⏳ جاري معالجة الطلب، يرجى الانتظار...' : '⏳ Order is being processed, please wait...'
      );
      return;
    }

    // Also check loading state as backup
    if (loading) {
      console.log('⏳ Order already being processed (loading state check)...');
      return;
    }

    // Validate address
    if (!shippingAddress.governorate || !shippingAddress.city || !shippingAddress.street || !shippingAddress.phone || !shippingAddress.name) {
      toast.error(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى إكمال بيانات الشحن' : 'Please complete shipping details'
      );
      return;
    }

    // Validate cart has items
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'السلة فارغة' : 'Cart is empty'
      );
      return;
    }

    try {
      // 🔒 Lock submission IMMEDIATELY (before any async operations)
      isSubmittingRef.current = true;
      setLoading(true);
      
      console.log('🔒 Order submission LOCKED - preventing duplicates');

      // Prepare order items from cart
      const items = cart.items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variant_id: null,
        price: item.unit_price || item.product?.price || 0
      }));

      // Create order with address as OBJECT (as per backend requirements)
      const orderData = {
        shipping_address: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          governorate: shippingAddress.governorate,
          city: shippingAddress.city,
          district: shippingAddress.district || null,
          street: shippingAddress.street,
          building_number: shippingAddress.building_number || null,
          floor: shippingAddress.floor || null,
          apartment: shippingAddress.apartment || null,
          postal_code: shippingAddress.postal_code || null
        },
        payment_method: 'cash_on_delivery', // Backend expects 'cash_on_delivery'
        items: items,
        notes: '',
        coupon_code: null
      };

      console.log('📦 Creating order with data:', orderData);

      console.log('📤 Sending order request...');
      const response = await ApiService.createOrder(orderData);
      console.log('📥 Order response:', response);
      console.log('📊 Response keys:', Object.keys(response));
      console.log('📊 Response.data:', response.data);
      console.log('📊 Response.success:', response.success);
      console.log('📊 Response.message:', response.message);

      // Check if order was created (multiple possible response formats)
      const orderCreated = response.success || 
                          response.data?.id || 
                          response.order?.id ||
                          (response.message && response.message.includes('success'));

      if (orderCreated) {
        console.log('✅ Order created successfully!');
        
        // Clear cart
        await ApiService.clearCart();
        await refreshCart();

        // Clear shipping address form
        setShippingAddress({
          name: '',
          phone: '',
          governorate: '',
          city: '',
          district: '',
          street: '',
          building_number: '',
          floor: '',
          apartment: '',
          postal_code: ''
        });

        // Show success message with order details
        // Try multiple possible response structures
        const orderData = response.data || response.order || response;
        const orderNumber = orderData?.order_number || orderData?.id || 'N/A';
        const totalAmount = orderData?.total_amount || calculateSubtotal() + 50;
        
        console.log('📋 Order Data:', orderData);
        console.log('🔢 Order Number:', orderNumber);
        console.log('💰 Total Amount:', totalAmount);
        
        console.log('🎉 Showing success toast...');
        toast.success(
          '🎉 تم إنشاء الطلب بنجاح!',
          `رقم الطلب: ${orderNumber}\nالمبلغ: ${totalAmount.toFixed(2)} جنيه\nالدفع: عند الاستلام`,
          10000
        );

        // 🔓 Unlock submission BEFORE redirect (allow user to stay on page if needed)
        isSubmittingRef.current = false;
        setLoading(false);
        console.log('🔓 Order submission UNLOCKED');

        // Redirect to order details or orders list after a delay
        console.log('⏳ Redirecting in 3 seconds...');
        setTimeout(() => {
          const orderId = orderData?.id;
          if (orderId) {
            console.log('🔄 Redirecting to order details:', orderId);
            router.push(`/account/orders/${orderId}`);
          } else {
            console.log('🔄 Redirecting to orders list');
            router.push('/account/orders');
          }
        }, 3000);
      } else {
        console.error('❌ Order creation failed - no success flag');
        throw new Error(response.message || 'فشل في إنشاء الطلب');
      }
    } catch (error: any) {
      console.error('❌ Order creation error:', error);
      
      // 🔓 Unlock on error
      isSubmittingRef.current = false;
      setLoading(false);
      
      toast.error(
        'خطأ في الطلب',
        error.message || 'فشل في إنشاء الطلب. حاول مرة أخرى',
        5000
      );
    }
  };

  if (!user || !cart) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            {language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <svg className={`w-5 h-5 mx-2 text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <Link href="/cart" className="text-gray-500 hover:text-gray-700">
            {language === 'ar' ? 'السلة' : 'Cart'}
          </Link>
          <svg className={`w-5 h-5 mx-2 text-gray-400 ${language === 'ar' ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-900">{language === 'ar' ? 'إتمام الطلب' : 'Checkout'}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Address Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'عنوان الشحن' : 'Shipping Address'}
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الاسم' : 'Name'} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone'} *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المحافظة' : 'Governorate'} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.governorate}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, governorate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'المدينة' : 'City'} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الحي' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.district}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الشارع' : 'Street'} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'رقم المبنى' : 'Building Number'}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.building_number}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, building_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الطابق' : 'Floor'}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.floor}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, floor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'الشقة' : 'Apartment'}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.apartment}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, apartment: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'علامة مميزة' : 'Landmark'}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.landmark}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder={language === 'ar' ? 'بجوار...' : 'Near...'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
              </h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'كود الخصم' : 'Coupon Code'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل كود الخصم' : 'Enter coupon code'}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {applyingCoupon 
                      ? (language === 'ar' ? '...' : '...') 
                      : (language === 'ar' ? 'تطبيق' : 'Apply')}
                  </button>
                </div>
              </div>

              {/* Price Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}:</span>
                  <span className="font-medium text-gray-900">
                    {subtotal.toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>{language === 'ar' ? 'الشحن' : 'Shipping'}:</span>
                  <span>{shippingCost > 0 ? `${shippingCost.toFixed(2)} ${language === 'ar' ? 'ج.م' : 'EGP'}` : (language === 'ar' ? 'مجاني' : 'Free')}</span>
                </div>

                {tax > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>{language === 'ar' ? 'الضريبة' : 'Tax'}:</span>
                    <span>{tax.toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{language === 'ar' ? 'الخصم' : 'Discount'}:</span>
                    <span>-{discount.toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </div>
                )}

                <div className="h-px bg-gray-200"></div>

                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>{language === 'ar' ? 'الإجمالي' : 'Total'}:</span>
                  <span>{total.toFixed(2)} {language === 'ar' ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-gray-900">
                    {language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {language === 'ar' 
                    ? '🔒 دفع آمن ومضمون - ادفع عند استلام الطلب'
                    : '🔒 Secure payment - Pay when you receive'}
                </p>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !cart?.items?.length}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{language === 'ar' ? 'جاري إنشاء الطلب...' : 'Creating Order...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'ar' ? '✅ تأكيد الطلب' : '✅ Confirm Order'}</span>
                    <svg className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {language === 'ar' 
                  ? 'بالمتابعة، أنت توافق على الشروط والأحكام'
                  : 'By placing order, you agree to our terms & conditions'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

