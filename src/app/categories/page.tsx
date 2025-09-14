'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { ApiService } from '../services/api';
// Removed types import - using any for now

export default function CategoriesPage() {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, language, getLocalizedText } = useLanguage();
  const { success, warning } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, [language]);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(selectedCategory);
    }
  }, [selectedCategory, language]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCategories();
      
      if (response.data && Array.isArray(response.data)) {
        // العدد موجود مباشرة في الـ response! 🎉
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

  const fetchCategoryProducts = async (categoryId: number) => {
    try {
      const response = await ApiService.getProducts({ category: categoryId, per_page: 6 });
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      setProducts([]);
    }
  };

  const handleAddToCart = async (product: any) => {
    if (!isAuthenticated) {
      warning(t('toast.login.required'), t('toast.login.required.desc'));
      return;
    }
    
    const success_cart = await addToCart(product.id, 1);
    if (success_cart) {
    success(t('toast.cart.added'), t('toast.cart.added.desc'));
    }
  };

  // Get featured products for each category
  const getCategoryProducts = (categoryId: number) => {
    return products.filter(product => product.category.id === categoryId).slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gray-50 to-transparent rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-3xl opacity-25" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
      <Header />
      
        {/* Modern Hero Section */}
        <section className="hero-modern relative pt-28 pb-16">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-20 w-20 h-20 bg-red-500 bg-opacity-5 rounded-full animate-float" />
            <div className="absolute top-48 right-32 w-16 h-16 bg-red-500 bg-opacity-10 rounded-full animate-pulse-modern" />
            <div className="absolute bottom-32 left-1/4 w-24 h-24 bg-gray-500 bg-opacity-5 rounded-full animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-48 right-1/3 w-18 h-18 bg-red-500 bg-opacity-7 rounded-full animate-pulse-modern" style={{animationDelay: '2s'}} />
          </div>
          
          <div className="container-modern relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              {/* Badge */}
              <div className="animate-slide-modern">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-8">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {t('categories.badge')}
                  </span>
                </div>
              </div>
              
              {/* Main Heading */}
              <div className="animate-slide-modern" style={{animationDelay: '0.2s'}}>
                <h1 className="text-modern-heading mb-8">
            {t('categories.title')}
                  <span className="block text-modern-accent mt-2">
                    Complete Collection
                  </span>
          </h1>
              </div>
              
              {/* Description */}
              <div className="animate-slide-modern mb-12" style={{animationDelay: '0.4s'}}>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('categories.subtitle')}
          </p>
              </div>

              {/* Stats */}
              <div className="animate-slide-modern" style={{animationDelay: '0.6s'}}>
                <div className="inline-flex items-center gap-8 px-8 py-4 glass-modern rounded-2xl">
                  <div className="text-center">
                    <div className="stat-number-modern">{categories.length}</div>
                    <div className="text-gray-600 text-sm font-medium">{t('categories.available')}</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center">
                    <div className="stat-number-modern">
                      {categories.reduce((total, cat) => total + (cat.products_count || 0), 0)}
                    </div>
                    <div className="text-gray-600 text-sm font-medium">{t('categories.total')}</div>
                  </div>
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                  <div className="text-center">
                    <div className="stat-number-modern">24/7</div>
                    <div className="text-gray-600 text-sm font-medium">{t('categories.support')}</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Categories Grid */}
        <section className="section-modern bg-gradient-subtle">
          <div className="container-modern">
          {loading ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center gap-4 glass-modern px-8 py-6 rounded-2xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-500 border-t-transparent"></div>
                  <span className="text-gray-600 font-medium">{t('categories.loading')}</span>
                </div>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => (
              <div
                key={category.id}
                    className="card-modern-2030 group overflow-hidden animate-slide-modern cursor-pointer"
                    style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                {/* Card Header */}
                    <div className="relative p-8 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600" />
                      </div>
                      
                    <div className="relative flex items-center gap-4">
                        <div className="flex-shrink-0">
                        {category.image ? (
                            <div className="w-16 h-16 rounded-2xl overflow-hidden group-hover:scale-110 transition-transform">
                          <img 
                            src={category.image} 
                            alt={getLocalizedText(category, 'name') || category.name} 
                                className="w-full h-full object-cover" 
                          />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                              📂
                            </div>
                        )}
                      </div>
                        <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {getLocalizedText(category, 'name') || category.name}
                      </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {getLocalizedText(category, 'description') || category.description || t('categories.no.description')}
                      </p>
                        </div>
                  </div>
                </div>

                {/* Card Body */}
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="text-center">
                          <div className="stat-number-modern text-3xl">{category.products_count || 0}</div>
                          <div className="text-gray-600 text-sm font-medium">{t('categories.product.single')} {t('categories.available.text')}</div>
                        </div>
                      <div className="flex items-center text-red-600 font-medium group-hover:gap-3 transition-all">
                      <span>{t('categories.view.all')}</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    href={`/categories/${category.id}`}
                      className="block w-full btn-modern-primary py-4 text-center group/btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {t('categories.browse')} ({category.products_count || 0})
                      </span>
                  </Link>
                </div>

                {/* Expanded Products */}
                {selectedCategory === category.id && (
                    <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white animate-slide-modern">
                      <div className="p-8">
                        <div className="flex items-center gap-2 mb-6">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <h4 className="font-bold text-gray-900">{t('categories.featured.products')}</h4>
                        </div>
                    <div className="grid gap-4">
                          {getCategoryProducts(category.id).map((product, productIndex) => (
                            <div
                              key={product.id}
                              onClick={() => window.location.href = `/products/${product.id}`}
                              className="card-floating p-4 group/product animate-slide-modern cursor-pointer hover:scale-105 transition-all"
                              style={{animationDelay: `${productIndex * 0.1}s`}}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center flex-1">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 mr-4 group-hover/product:scale-110 transition-transform">
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={getLocalizedText(product, 'name') || product.name}
                                        className="w-full h-full object-cover"
                                />
                              ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                              )}
                            </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900 group-hover/product:text-red-600 transition-colors line-clamp-1">
                                {getLocalizedText(product, 'name') || product.name}
                              </h5>
                                    <div className="flex items-center gap-3 mt-1">
                                <span className="text-lg font-bold text-red-600">${product.price}</span>
                                      <span className="text-sm text-gray-500">{t('categories.stock')}: {product.stock}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleAddToCart(product);
                            }}
                                  className="btn-modern-primary px-4 py-2 text-sm"
                          >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L7 13m0 0h10M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                                  </svg>
                          </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {getCategoryProducts(category.id).length === 0 && (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="text-gray-600">{t('categories.no.products')}</p>
                          </div>
                        )}
                      </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}

          {/* CTA Section */}
            {!loading && categories.length > 0 && (
              <div className="mt-20 text-center animate-slide-modern" style={{animationDelay: '1s'}}>
                <div className="glass-modern p-12 rounded-3xl">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    {t('products.no.found.title')}
              </h3>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    {t('products.no.found.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/products"
                      className="btn-modern-primary inline-flex items-center gap-2"
                    >
                      <span>{t('products.browse.all')}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link 
                      href="/contact"
                      className="btn-modern-outline inline-flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{t('products.contact.us')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        </div>

      <Footer />
    </div>
  );
} 