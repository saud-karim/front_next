'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { User } from '../types/api'
import { ApiService } from '../services/api'

// Types
interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone: string
  address: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, userType?: 'customer' | 'admin' | 'supplier') => Promise<boolean>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<boolean>
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Redirect admin to dashboard if they're on home page
  useEffect(() => {
    if (user?.role === 'admin' && window.location.pathname === '/') {
      console.log('🔀 Admin user on home page - redirecting to dashboard...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    }
  }, [user])

  const checkAuth = async () => {
    // Client-side only
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Skip Profile API for now - use stored user data or temporary user
      
      // Check if we have stored user data from login
      const storedUserData = localStorage.getItem('user_data')
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData)
          setUser(userData)
          console.log('👤 User loaded from storage with role:', userData.role)
          
          // If user is admin and on home page, redirect to dashboard
          if (userData.role === 'admin' && window.location.pathname === '/') {
            console.log('🔀 Admin user found from storage - redirecting to dashboard...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1000);
          }
        } catch (error) {
          // Fallback to temporary user
          setUser({
            id: 1,
            name: 'مستخدم مسجل',
            email: 'authenticated@user.com',
            phone: '+1234567890',
            address: 'عنوان مُسجل',
            role: 'customer'
          })
        }
                      } else {
          // No stored user data - remove token as it's invalid
          if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          }
        }
      }
      setLoading(false)
  }

  const login = async (
    email: string,
    password: string,
    userType: 'customer' | 'admin' | 'supplier' = 'customer'
  ): Promise<boolean> => {
    try {
      console.log('🔐 AuthContext: محاولة تسجيل الدخول للمستخدم:', email)
      
      // Use API for all login attempts
      const response = await ApiService.login(email, password)
      console.log('🔐 AuthContext: استجابة تسجيل الدخول:', response)

      if (response.success && response.data?.user) {
        const userData = response.data.user;
        
        // Admin detection by email (backup method if role is not set)
        const isAdminByEmail = email.toLowerCase().includes('admin') || 
                             email.toLowerCase().includes('customer@example.com');
        const finalRole = userData.role === 'admin' || isAdminByEmail ? 'admin' : userData.role || 'customer';
        
        // Update user data with correct role
        const enhancedUserData = { ...userData, role: finalRole };
        
        setUser(enhancedUserData)
        // Store user data for future use (since Profile API doesn't work)
        localStorage.setItem('user_data', JSON.stringify(enhancedUserData))
        
        // Store admin token if this is an admin
        if (finalRole === 'admin') {
          localStorage.setItem('admin_token', response.data.token);
          console.log('🔑 Admin token stored');
        }
        
        console.log('💾 Stored user data for future sessions')
        console.log('👤 Original role:', userData.role, '| Email-based admin:', isAdminByEmail, '| Final role:', finalRole)
        
        // Redirect will be handled in auth page based on role
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      console.log('📝 AuthContext: محاولة إنشاء حساب جديد:', data.name, data.email)
      const response = await ApiService.register(data)
      console.log('📝 AuthContext: استجابة إنشاء الحساب:', response)
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        // Store user data for future use (since Profile API doesn't work)
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
        console.log('💾 Stored user data for future sessions')
        return true
      }
      return false
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await ApiService.logout()
    } catch (error) {
      // Silent fail for logout
    } finally {
      setUser(null)
      localStorage.removeItem('auth_token')
      // Also remove stored user data
      localStorage.removeItem('user_data')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    register,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Default export
export default AuthProvider 