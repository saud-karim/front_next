'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { mockCategories } from '../data/mockData';
import { Category, getLocalizedText } from '../types/multilingual';

export default function Categories() {
  const { t, language } = useLanguage();
  
  // Use mockCategories directly for now to debug
  const apiCategories = mockCategories;


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
          {apiCategories.map((category, index) => (
            <div
              key={category.id}
              className={`card-hover group cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-gray-200 ${category.bgColor} hover:shadow-2xl transition-all duration-500`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Card Header */}
              <div className={`p-6 bg-gradient-to-r ${category.color} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{getLocalizedText(category.name, language)}</h3>
                  <p className="text-white/90 text-sm">{getLocalizedText(category.description, language)}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">{category.count}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>{t('categories.view.all')}</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm">{getLocalizedText(item, language)}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button className={`w-full mt-6 bg-gradient-to-r ${category.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
  {t('categories.browse')}
                </button>
              </div>
            </div>
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