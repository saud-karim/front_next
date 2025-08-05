'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  joinDate: string;
  orders: Order[];
  wishlist: WishlistItem[];
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge: string;
  badgeColor: string;
  dateAdded: string;
}

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  addToWishlist: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  placeOrder: (orderData: Omit<Order, 'id' | 'date'>) => string;
  getOrderById: (id: string) => Order | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      // Ensure wishlist and orders are arrays
      const safeUserData = {
        ...userData,
        orders: Array.isArray(userData.orders) ? userData.orders : [],
        wishlist: Array.isArray(userData.wishlist) ? userData.wishlist : []
      };
      setUser(safeUserData);
      setIsLoggedIn(true);
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in mock database
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (existingUser) {
      const userData: User = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        company: existingUser.company,
        address: existingUser.address,
        joinDate: existingUser.joinDate,
        orders: Array.isArray(existingUser.orders) ? existingUser.orders : [],
        wishlist: Array.isArray(existingUser.wishlist) ? existingUser.wishlist : []
      };
      
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    }
    
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = savedUsers.some((u: any) => u.email === userData.email);
    
    if (userExists) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      company: userData.company,
      joinDate: new Date().toISOString(),
      orders: [],
      wishlist: []
    };
    
    // Save to mock database
    const newUserWithPassword = { ...newUser, password: userData.password };
    savedUsers.push(newUserWithPassword);
    localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));
    
    // Set as current user
    setUser(newUser);
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Update in mock database
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = savedUsers.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = { ...savedUsers[userIndex], ...userData };
      localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));
    }
  };

  const addToWishlist = (item: Omit<WishlistItem, 'dateAdded'>) => {
    if (!user) return;
    
    const wishlistItem: WishlistItem = {
      ...item,
      dateAdded: new Date().toISOString()
    };
    
    const currentWishlist = user.wishlist || [];
    const updatedUser = {
      ...user,
      wishlist: [...currentWishlist, wishlistItem]
    };
    
    setUser(updatedUser);
  };

  const removeFromWishlist = (id: number) => {
    if (!user) return;
    
    const currentWishlist = user.wishlist || [];
    const updatedUser = {
      ...user,
      wishlist: currentWishlist.filter(item => item.id !== id)
    };
    
    setUser(updatedUser);
  };

  const isInWishlist = (id: number): boolean => {
    if (!user || !user.wishlist || !Array.isArray(user.wishlist)) return false;
    return user.wishlist.some(item => item.id === id);
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'date'>): string => {
    if (!user) return '';
    
    const orderId = `ORD-${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString(),
      ...orderData
    };
    
    const updatedUser = {
      ...user,
      orders: [newOrder, ...user.orders]
    };
    
    setUser(updatedUser);
    return orderId;
  };

  const getOrderById = (id: string): Order | null => {
    if (!user) return null;
    return user.orders.find(order => order.id === id) || null;
  };

  const value = {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    updateProfile,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    placeOrder,
    getOrderById
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 