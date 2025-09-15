'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarItem {
  id: string;
  labelKey: string;
  icon: string;
  href: string;
  badge?: number;
}

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      labelKey: 'admin.sidebar.dashboard',
      icon: '📊',
      href: '/dashboard',
    },
    {
      id: 'products',
      labelKey: 'admin.sidebar.products',
      icon: '📦',
      href: '/dashboard/products',
    },
    {
      id: 'categories',
      labelKey: 'admin.sidebar.categories',
      icon: '📂',
      href: '/dashboard/categories',
    },
    {
      id: 'orders',
      labelKey: 'admin.sidebar.orders',
      icon: '🛒',
      href: '/dashboard/orders',
      badge: 5, // This would come from API
    },
    {
      id: 'customers',
      labelKey: 'admin.sidebar.customers',
      icon: '👥',
      href: '/dashboard/customers',
    },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-auto bg-white shadow-2xl z-30 transition-all duration-300 ease-in-out
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'w-52'}
        lg:relative lg:translate-x-0 lg:h-auto lg:rounded-2xl lg:m-4
      `}>
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  {t('admin.sidebar.title')}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  {t('admin.sidebar.subtitle')}
                </p>
              </div>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors hidden lg:block"
            >
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || t('admin.user.name')}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@buildtools.com'}
                </p>
                                 <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                  👑 {t('admin.user.role')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Language Switcher */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setLanguage('ar')}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${language === 'ar' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isCollapsed ? 'px-2' : ''}
              `}
            >
              <span>🇸🇦</span>
              {!isCollapsed && <span>العربية</span>}
            </button>
            
            <button
              onClick={() => setLanguage('en')}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${language === 'en' 
                  ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
                ${isCollapsed ? 'px-2' : ''}
              `}
            >
              <span>🇺🇸</span>
              {!isCollapsed && <span>English</span>}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || 
                (pathname.startsWith(item.href) && item.href !== '/dashboard');
              
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200
                      ${isActive 
                         ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-md shadow-red-500/20' 
                         : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                       }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{t(item.labelKey)}</span>
                        {item.badge && (
                          <span className={`
                             inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full
                             ${isActive 
                               ? 'bg-white text-red-600' 
                               : 'bg-red-100 text-red-600'
                             }
                           `}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-gray-200">
          <ul className="space-y-1">
            {/* View Site */}
            <li>
              <Link
                href="/"
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200
                  text-gray-700 hover:bg-gray-100 hover:text-gray-900
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                target="_blank"
              >
                <span className="text-lg">🌐</span>
                {!isCollapsed && <span className="flex-1">{t('admin.sidebar.view.site')}</span>}
              </Link>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200
                  text-red-600 hover:bg-red-50 hover:text-red-700
                  ${isCollapsed ? 'justify-center' : ''}
                `}
              >
                <span className="text-lg">🚪</span>
                {!isCollapsed && <span className="flex-1 text-left">{t('admin.sidebar.logout')}</span>}
              </button>
            </li>
          </ul>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsCollapsed(false)}
        className={`
          fixed top-4 left-4 z-40 p-3 bg-white rounded-xl shadow-lg lg:hidden
          ${isCollapsed ? 'block' : 'hidden'}
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
} 