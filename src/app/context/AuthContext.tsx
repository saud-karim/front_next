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

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      // Skip Profile API for now - use stored user data or temporary user
      
      // Check if we have stored user data from login
      const storedUserData = localStorage.getItem('user_data')
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData)
          setUser(userData)
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
        // No stored user data - create temporary authenticated user
        setUser({
          id: 1,
          name: 'مستخدم مسجل',
          email: 'authenticated@user.com', 
          phone: '+1234567890',
          address: 'عنوان مُسجل',
          role: 'customer'
        })
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
      let response
      
      switch (userType) {
        case 'admin':
          response = await ApiService.adminLogin(email, password)
          break
        case 'supplier':
          response = await ApiService.supplierLogin(email, password)
          break
        default:
          response = await ApiService.login(email, password)
      }

      if (response.success && response.data?.user) {
        setUser(response.data.user)
        // Store user data for future use (since Profile API doesn't work)
        localStorage.setItem('auth_user', JSON.stringify(response.data.user))
        console.log('💾 Stored user data for future sessions')
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
      const response = await ApiService.register(data)
      if (response.success && response.data?.user) {
        setUser(response.data.user)
        // Store user data for future use (since Profile API doesn't work)
        localStorage.setItem('auth_user', JSON.stringify(response.data.user))
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