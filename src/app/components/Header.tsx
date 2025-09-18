'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const { itemsCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }
  }, [isAuthenticated]);

  const fetchWishlistCount = async () => {
    try {
      const response = await ApiService.getWishlist();
      if (response.success && response.data) {
        let count = 0;
        if ((response.data as any).wishlist && Array.isArray((response.data as any).wishlist)) {
          count = (response.data as any).total_items || (response.data as any).wishlist.length;
        } else if (Array.isArray(response.data)) {
          count = response.data.length;
        }
        setWishlistCount(count);
      }
    } catch (error) {
      console.error('❌ Header: Error fetching wishlist:', error);
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLanguage);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm mr-3">
              BS
            </div>
            <span className="text-lg font-semibold text-black">Construction Tools</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-red-500 transition-colors">
                <span suppressHydrationWarning>{isHydrated ? t('nav.home') : (language === 'ar' ? 'الرئيسية' : 'Home')}</span>
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-red-500 transition-colors">
                <span suppressHydrationWarning>{isHydrated ? t('nav.products') : (language === 'ar' ? 'المنتجات' : 'Products')}</span>
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-red-500 transition-colors">
                <span suppressHydrationWarning>{isHydrated ? t('nav.categories') : (language === 'ar' ? 'الفئات' : 'Categories')}</span>
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-red-500 transition-colors">
                {t('nav.about')}
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-red-500 transition-colors">
                {t('nav.contact')}
              </Link>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-red-500 transition-colors"
              title={t('language.switch')}
            >
                  {language === 'ar' ? 'EN' : 'عر'}
            </button>
            
            <Link href="/products?focus=search" className="text-gray-700 hover:text-red-500 p-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            
            <Link href="/wishlist" className="text-gray-700 hover:text-red-500 p-2 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/cart" className="text-gray-700 hover:text-red-500 p-2 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/>
              </svg>
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  <span suppressHydrationWarning>{isHydrated ? itemsCount : '0'}</span>
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
                >
                  <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span suppressHydrationWarning className="text-sm">{isHydrated ? user?.name : 'مستخدم'}</span>
            </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded border border-gray-200 py-1 z-10">
                    <Link href="/account" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                      {t('account.title')}
                    </Link>
                    <Link href="/account/orders" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                      {t('account.orders.title')}
                    </Link>
                    {user?.role === 'admin' && (
                      <Link href="/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setIsUserMenuOpen(false)}>
                        {t('nav.admin')}
                    </Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {t('account.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth" className="btn-primary">
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-500 p-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-3 space-y-1">
            <Link href="/" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
                <span suppressHydrationWarning>{isHydrated ? t('nav.home') : (language === 'ar' ? 'الرئيسية' : 'Home')}</span>
              </Link>
            <Link href="/products" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
              <span suppressHydrationWarning>{isHydrated ? t('nav.products') : (language === 'ar' ? 'المنتجات' : 'Products')}</span>
              </Link>
            <Link href="/categories" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
              <span suppressHydrationWarning>{isHydrated ? t('nav.categories') : (language === 'ar' ? 'الفئات' : 'Categories')}</span>
              </Link>
            <Link href="/about" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
                {t('nav.about')}
              </Link>
            <Link href="/contact" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
                {t('nav.contact')}
              </Link>

            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link href="/profile" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
                    {t('nav.profile')}
                  </Link>
                  <Link href="/orders" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
                    {t('nav.orders')}
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/dashboard" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
                      {t('nav.admin')}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left text-gray-700 hover:text-red-500 py-2 transition-colors">
                    {t('account.logout')}
                  </button>
                </div>
              ) : (
                <Link href="/auth" className="block text-gray-700 hover:text-red-500 py-2 transition-colors">
                  {t('nav.login')}
                </Link>
              )}
            </div>
            </div>
          </div>
        )}
    </header>
  );
}