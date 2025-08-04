'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <div className="w-12 h-12 metallic-effect rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  BS
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 gradient-red rounded transform rotate-45"></div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 gradient-red rounded-full"></div>
                <div className="absolute -bottom-2 left-0 w-6 h-1 gradient-red rounded"></div>
                <div className="absolute -bottom-2 left-2 w-4 h-1 gradient-red rounded"></div>
                <div className="absolute -bottom-2 left-4 w-2 h-1 gradient-red rounded"></div>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-800">Construction Tools</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-800 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-800 hover:text-red-600 p-2 rounded-md transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="text-gray-800 hover:text-red-600 p-2 rounded-md transition-colors relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8" />
              </svg>
              <span className="absolute -top-1 -right-1 gradient-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
            </button>
            <button className="gradient-red text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 shadow-md">
              Get Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-800 hover:text-red-600 p-2 rounded-md transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white rounded-lg mt-2 shadow-lg">
              <Link href="/" className="text-gray-800 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-800 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium">
                Products
              </Link>
              <Link href="/categories" className="text-gray-800 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium">
                Categories
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-800 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium">
                Contact
              </Link>
              <button className="w-full gradient-red text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 shadow-md mt-4">
                Get Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}