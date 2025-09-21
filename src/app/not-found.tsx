'use client';

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useLanguage } from './context/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();
  return (
    <>
      <Head>
        <title>{language === 'ar' ? 'الصفحة غير موجودة - BuildTools BS' : 'Page Not Found - BuildTools BS'}</title>
        <meta name="description" content={language === 'ar' ? 'عذراً، الصفحة التي تبحث عنها غير موجودة.' : 'Sorry, the page you are looking for does not exist.'} />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-500 mb-4">404</div>
          <div className="w-32 h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12c0-4.418-3.582-8-8-8s-8 3.582-8 8c0 2.152.852 4.103 2.238 5.535z" />
            </svg>
          </div>
        </div>

        {/* Arabic Content */}
        <div className="text-right mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            عذراً، الصفحة غير موجودة
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            الصفحة التي تبحث عنها قد تكون نُقلت أو حُذفت أو أن الرابط غير صحيح.
          </p>
        </div>

        {/* English Content */}
        <div className="text-left mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sorry, Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            The page you are looking for might have been moved, deleted, or the link is incorrect.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Popular Pages - Arabic */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-right">
              🔗 صفحات مفيدة
            </h3>
            <ul className="space-y-3 text-right">
              <li>
                <Link href="/" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  🏠 الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  🛠️ جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  📦 الفئات
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  📞 اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Pages - English */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-left">
              🔗 Helpful Pages
            </h3>
            <ul className="space-y-3 text-left">
              <li>
                <Link href="/?lang=en" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  🏠 Homepage
                </Link>
              </li>
              <li>
                <Link href="/products?lang=en" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  🛠️ All Products
                </Link>
              </li>
              <li>
                <Link href="/categories?lang=en" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  📦 Categories
                </Link>
              </li>
              <li>
                <Link href="/contact?lang=en" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  📞 Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🔍 البحث / Search
          </h3>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن المنتجات... / Search products..."
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    if (query.trim()) {
                      window.location.href = `/products?search=${encodeURIComponent(query)}`;
                    }
                  }
                }}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ارجع للخلف / Go Back
          </button>
          
          <Link
            href="/"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            الصفحة الرئيسية / Homepage
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">
            إذا كنت تعتقد أن هذا خطأ، يرجى <Link href="/contact" className="text-blue-600 hover:underline">الاتصال بنا</Link>
          </p>
          <p>
            If you think this is an error, please <Link href="/contact?lang=en" className="text-blue-600 hover:underline">contact us</Link>
          </p>
        </div>
      </div>

      {/* Structured Data for 404 page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 - Page Not Found",
            "description": "The requested page could not be found",
            "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com'}/404`,
            "mainEntity": {
              "@type": "Thing",
              "name": "404 Error",
              "description": "Page not found error"
            }
          })
        }}
      />
    </div>
    </>
  );
} 