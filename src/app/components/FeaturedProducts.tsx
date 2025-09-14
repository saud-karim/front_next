'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { ApiService } from '../services/api';
import { Product } from '../types/api';
import { getBestImageUrl, getImageFallbacks } from '../dashboard/utils/imageUtils';

export default function FeaturedProducts() {
  const { t, language, getLocalizedText } = useLanguage();
  const { success, error } = useToast();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [language]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProducts({ featured: true, per_page: 6 });
      
      if (response.data && Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    const success_add = await addToCart(productId, 1);
    if (success_add) {
      success(t('common.product.added'));
    } else {
      error(t('common.product.failed'));
    }
  };

  if (loading) {
    return (
      <section className="section-modern">
        <div className="container-modern">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <span>{t('common.loading.featured')}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-modern bg-gradient-subtle">
      <div className="container-modern">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-modern">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t('featured.badge')}
          </div>
          <h2 className="text-modern-heading mb-4">
            {t('featured.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('featured.subtitle')}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid-modern">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group animate-slide-modern"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="card-modern-2030 overflow-hidden h-full">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  {(() => {
                    let productImage;
                    let originalImage = '';
                    
                    if (Array.isArray(product.images) && product.images.length > 0) {
                      originalImage = product.images[0];
                      productImage = getBestImageUrl(product.images[0]);
                    } else if (typeof product.images === 'string') {
                      try {
                        const parsed = JSON.parse(product.images);
                        const imageSource = Array.isArray(parsed) ? parsed[0] : parsed;
                        originalImage = imageSource;
                        productImage = getBestImageUrl(imageSource);
                      } catch {
                        originalImage = product.images;
                        productImage = getBestImageUrl(product.images);
                      }
                    }
                    
                    return productImage ? (
                      <img 
                        src={productImage} 
                        alt={getLocalizedText(product, 'name')}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const currentSrc = e.currentTarget.src;
                          if (originalImage) {
                            const fallbacks = getImageFallbacks(originalImage);
                        for (const fallbackUrl of fallbacks) {
                          if (currentSrc !== fallbackUrl && !currentSrc.includes('placeholder')) {
                            e.currentTarget.src = fallbackUrl;
                            return;
                          }
                        }
                          }
                        if (!currentSrc.includes('placeholder.svg')) {
                          e.currentTarget.src = '/placeholder.svg';
                        }
                      }}
                    />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl text-gray-400">
                        📦
                      </div>
                    );
                  })()}
                  
                  {/* Product Badge */}
                  {product.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-accent text-white text-xs font-medium rounded-full">
                      مميز
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-2">
                      <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                        <svg className="w-5 h-5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                        <svg className="w-5 h-5 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                    </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                    {getLocalizedText(product, 'name')}
                  </h3>

                {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.8)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {parseFloat(product.sale_price || product.price).toFixed(0)} ج.م
                    </span>
                    {product.sale_price && parseFloat(product.sale_price) !== parseFloat(product.price) && (
                      <span className="text-sm text-gray-500 line-through">
                        {parseFloat(product.price).toFixed(0)} ج.م
                      </span>
                    )}
                </div>

                  {/* Add to Cart Button */}
                  <div className="flex gap-2">
                  <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 btn-modern-primary text-sm py-3 group/btn"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L7 13m0 0h10M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                        </svg>
                        <span>{t('common.add.to.cart')}</span>
                      </span>
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                      className="px-4 py-3 border border-gray-300 rounded-lg hover:border-red-500 transition-colors flex items-center justify-center"
                  >
                      <svg className="w-4 h-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-16 animate-slide-modern" style={{animationDelay: '0.8s'}}>
          <Link href="/products" className="btn-modern-outline inline-flex items-center gap-2">
            <span>
              {t('categories.view.all.products')}
            </span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}