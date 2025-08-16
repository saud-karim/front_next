'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
// import { Category } from '../types/api'; // Removed - using any for now

export default function Categories() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      
      if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </section>
    );
  }


  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            🏗️ Product Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('categories.home.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('categories.home.subtitle')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="card-hover group cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white hover:shadow-2xl transition-all duration-500 block"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Card Header */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-3">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-12 h-12 rounded-lg" />
                    ) : (
                      '📦'
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90 text-sm">{category.description || 'Browse our collection'}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">{category.products_count || 0}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>{t('categories.view.all')}</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {category.description || 'Explore quality products in this category'}
                  </p>
                </div>

                {/* Action Button */}
                <button className="w-full mt-6 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
  {t('categories.browse')}
                </button>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t('featured.cant.find')}
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              {t('featured.expert.section')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="gradient-red text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold">
                📞 {t('featured.contact.expert')}
              </button>
              <button className="border-2 border-red-500 text-red-600 px-8 py-3 rounded-xl hover:bg-red-50 transition-all duration-300 font-semibold">
                📋 {t('featured.custom.quote')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}