'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { mockCategories, mockProducts } from '../data/mockData';
import { Category, Product, getLocalizedText } from '../types/multilingual';

export default function CategoriesPage() {
  const { addToCart } = useCart();
  const { t, language } = useLanguage();
  const { success } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [apiCategories, setApiCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Simulate API call - in real app this would fetch from backend
    setApiCategories(mockCategories);
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: getLocalizedText(product.name, language),
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      features: product.features.map(f => getLocalizedText(f, language))
    });
    success(t('toast.cart.added'), t('toast.cart.added.desc'));
  };

  // Get featured products for each category
  const getCategoryProducts = (categoryId: string) => {
    return mockProducts.filter(product => product.category === categoryId).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            📂 Product Categories
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {t('categories.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            {t('categories.subtitle')}
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apiCategories.map((category, index) => (
              <div
                key={category.id}
                className={`card-hover group cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-gray-200 ${category.bgColor} hover:shadow-2xl transition-all duration-500`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
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
                  <Link 
                    href={`/products?category=${category.id}`}
                    className={`block w-full mt-6 bg-gradient-to-r ${category.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-center`}
                  >
                    {t('categories.browse')}
                  </Link>
                </div>

                {/* Expanded Products */}
                {selectedCategory === category.id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-4">{t('categories.featured.products')}</h4>
                    <div className="grid gap-4">
                      {getCategoryProducts(category.id).map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center">
                            <div className="text-2xl mr-3">{product.image}</div>
                            <div>
                              <h5 className="font-medium text-gray-900">{getLocalizedText(product.name, language)}</h5>
                              <div className="flex items-center">
                                <span className="text-lg font-bold text-red-600">${product.price}</span>
                                <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                            className="gradient-red text-white px-4 py-2 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-300"
                          >
                            {t('products.add.cart')}
                          </button>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/products?category=${category.id}`}
                      className="block text-center mt-4 text-red-600 hover:text-red-700 font-medium"
                    >
                      {t('categories.view.all.products')} →
                    </Link>
                  </div>
                )}
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

      <Footer />
    </div>
  );
} 