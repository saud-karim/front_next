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

  const refreshCart = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await ApiService.getCart();
      
      if (response.data) {
        setCart(response.data);
      } else {
        setCart({
          items: [],
          items_count: 0,
          subtotal: 0,
          shipping: 0,
          total: 0
        });
      }
    } catch (error) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number): Promise<boolean> => {
    if (!isAuthenticated) {
      console.error('User must be authenticated to add to cart');
      return false;
    }

    try {
      const response = await ApiService.addToCart(productId, quantity);
      if (response.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
    }
  };

  const updateCartItem = async (productId: number, quantity: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const response = await ApiService.updateCart(productId, quantity);
      if (response.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      return false;
    }
  };

  const removeFromCart = async (productId: number): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const response = await ApiService.removeFromCart(productId);
      if (response.success) {
        await refreshCart();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
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