'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cart, CartItem } from '../types/api';
import { ApiService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemsCount: number;
  total: number;
  addToCart: (productId: number, quantity: number) => Promise<boolean>;
  updateCartItem: (productId: number, quantity: number) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<boolean>;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  removeCoupon: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, loading: authLoading } = useAuth();

  const itemsCount = cart?.items_count || 0;
  const total = cart?.total || 0;

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      refreshCart();
    } else if (!isAuthenticated) {
      setCart(null);
    }
  }, [isAuthenticated, authLoading]);

  // Silent refresh without loading spinner
  const refreshCartSilent = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const response = await ApiService.getCart();
      
      if (response.success && response.data) {
        const cartData = response.data.cart || response.data;
        
        if (cartData && Array.isArray(cartData.items)) {
          setCart(cartData);
        } else {
          setCart({
            items: [],
            items_count: 0,
            subtotal: '0.00',
            tax: '0.00',
            shipping: '0.00',
            discount: '0.00',
            total: '0.00',
            currency: 'EGP'
          });
        }
      } else {
        setCart({
          items: [],
          items_count: 0,
          subtotal: '0.00',
          tax: '0.00',
          shipping: '0.00',
          discount: '0.00',
          total: '0.00',
          currency: 'EGP'
        });
      }
    } catch (error) {
      console.error('❌ خطأ في تحديث السلة (silent):', error);
      setCart({
        items: [],
        items_count: 0,
        subtotal: '0.00',
        tax: '0.00',
        shipping: '0.00',
        discount: '0.00',
        total: '0.00',
        currency: 'EGP'
      });
    }
  };

  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      console.log('🛒 جاري تحديث السلة...');
      const response = await ApiService.getCart();
      console.log('🛒 استجابة السلة كاملة:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        // Check if cart is nested under 'cart' property
        const cartData = response.data.cart || response.data;
        
        console.log('🛒 بيانات السلة المستخرجة:', JSON.stringify(cartData, null, 2));
        
        if (cartData && Array.isArray(cartData.items)) {
          console.log('✅ تم تحديث السلة بنجاح:', cartData);
          console.log('✅ عدد العناصر:', cartData.items.length);
          setCart(cartData);
        } else {
          console.log('⚪ السلة فارغة أو بدون عناصر صالحة');
          setCart({
            items: [],
            items_count: 0,
            subtotal: '0.00',
            tax: '0.00',
            shipping: '0.00',
            discount: '0.00',
            total: '0.00',
            currency: 'EGP'
          });
        }
      } else {
        console.log('⚪ لا توجد بيانات سلة، إنشاء سلة فارغة');
        setCart({
          items: [],
          items_count: 0,
          subtotal: '0.00',
          tax: '0.00',
          shipping: '0.00',
          discount: '0.00',
          total: '0.00',
          currency: 'EGP'
        });
      }
    } catch (error) {
      console.error('❌ خطأ في تحديث السلة:', error);
      console.error('❌ تفاصيل الخطأ:', JSON.stringify(error, null, 2));
      // Set empty cart instead of null
      setCart({
        items: [],
        items_count: 0,
        subtotal: '0.00',
        tax: '0.00',
        shipping: '0.00',
        discount: '0.00',
        total: '0.00',
        currency: 'EGP'
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number): Promise<boolean> => {
    if (!isAuthenticated) {
      console.error('User must be authenticated to add to cart');
      return false;
    }

    console.log('🛒 محاولة إضافة منتج للسلة:', { productId, quantity });

    try {
      const response = await ApiService.addToCart(productId, quantity);
      console.log('🛒 استجابة إضافة للسلة:', response);
      
      if (response.success) {
        console.log('✅ تمت إضافة المنتج للسلة بنجاح');
        await refreshCartSilent();
        return true;
      } else {
        console.error('❌ فشل في إضافة المنتج للسلة:', response.message);
        return false;
      }
    } catch (error) {
      console.error('❌ خطأ في إضافة المنتج للسلة:', error);
      return false;
    }
  };

  const updateCartItem = async (productId: number, quantity: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    console.log('🔄 محاولة تحديث كمية المنتج:', { productId, quantity });

    try {
      const response = await ApiService.updateCartItem(productId, quantity);
      console.log('🔄 استجابة تحديث السلة كاملة:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('✅ تم تحديث كمية المنتج بنجاح');
        await refreshCartSilent();
        return true;
      } else {
        console.error('❌ فشل في تحديث كمية المنتج:');
        console.error('❌ رسالة الخطأ:', response.message);
        console.error('❌ تفاصيل الاستجابة:', JSON.stringify(response, null, 2));
        
        // Check if it's a stock issue
        if (response.message && response.message.includes('stock')) {
          console.error('📦 مشكلة في المخزن - الكمية المطلوبة غير متوفرة');
        }
        if (response.message && response.message.includes('quantity')) {
          console.error('📊 مشكلة في الكمية - ربما تجاوزت الحد المسموح');
        }
        
        return false;
      }
    } catch (error) {
      console.error('❌ خطأ في تحديث كمية المنتج:', error);
      console.error('❌ نوع الخطأ:', typeof error);
      console.error('❌ تفاصيل الخطأ:', JSON.stringify(error, null, 2));
      return false;
    }
  };

    const removeFromCart = async (productId: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    console.log('🗑️ محاولة حذف منتج من السلة باستخدام product_id:', productId);

    try {
      const response = await ApiService.removeFromCart(productId);
      console.log('🗑️ استجابة حذف من السلة:', response);
      
      if (response.success) {
        console.log('✅ تم حذف المنتج من السلة بنجاح');
        await refreshCartSilent();
        return true;
      } else {
        console.error('❌ فشل في حذف المنتج من السلة:', response.message);
        return false;
      }
    } catch (error) {
      console.error('❌ خطأ في حذف المنتج من السلة:', error);
      return false;
    }
  };

  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const response = await ApiService.applyCoupon(couponCode);
      if (response.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      return false;
    }
  };

  const removeCoupon = async (): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const response = await ApiService.removeCoupon();
      if (response.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove coupon:', error);
      return false;
    }
  };

  const clearCart = (): void => {
    setCart(null);
  };

  const value: CartContextType = {
    cart,
    loading,
    itemsCount,
    total,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    refreshCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 