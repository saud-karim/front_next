'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/api';
import { Category } from '../types/api';

export default function Categories() {
  const { t, language, getLocalizedText } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Default gradients for categories
  const categoryGradients = [
    'from-yellow-400 to-orange-500',
    'from-blue-400 to-blue-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-red-400 to-red-600',
    'from-gray-400 to-gray-600',
    'from-indigo-400 to-indigo-600',
    'from-pink-400 to-pink-600',
  ];

  useEffect(() => {
    fetchCategories();
  }, [language]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCategories({ 
        per_page: 12, // Get more to filter and sort
        status: 'active' 
      });
      
      if (response.data && Array.isArray(response.data)) {
        // Filter categories with products and sort by products_count descending
        const categoriesWithProducts = response.data
          .filter(category => category.products_count && category.products_count > 0)
          .sort((a, b) => (b.products_count || 0) - (a.products_count || 0))
          .slice(0, 4); // Take only top 4
        
        setCategories(categoriesWithProducts);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('❌ فشل في جلب الفئات:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section-modern">
        <div className="container-modern">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <span>{t('categories.loading')}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-modern">
      <div className="container-modern">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-modern">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {t('categories.badge')}
          </div>
          <h2 className="text-modern-heading mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const gradient = categoryGradients[index % categoryGradients.length];
            return (
            <Link
              key={category.id}
                href={`/products?category=${category.id}`}
                className="group animate-slide-modern"
                style={{animationDelay: `${index * 0.1}s`}}
            >
                <div className="card-floating p-8 text-center h-full relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity">
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                  </div>
                  
                  {/* Image Only (if available) */}
                  {category.image && (
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                        <img 
                          src={category.image} 
                          alt={getLocalizedText(category, 'name')}
                          className="w-full h-full object-cover rounded-xl"
                        />
                </div>
              </div>
                  )}

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                      {getLocalizedText(category, 'name')}
                    </h3>
                    
                    {/* Description */}
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {getLocalizedText(category, 'description')}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                      <span className="text-sm font-medium">
                        {category.products_count || 0} {t('categories.products.count')}
                      </span>
                      <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    </div>
                    
                    <div className="inline-flex items-center text-red-600 font-medium group-hover:gap-3 transition-all">
                      <span>{t('common.browse.products')}</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16 animate-slide-modern" style={{animationDelay: '0.8s'}}>
          <Link href="/categories" className="btn-modern-outline inline-flex items-center gap-2">
            <span>{t('categories.view.all')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}