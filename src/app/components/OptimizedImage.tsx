'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
  webpSupport?: boolean;
  productId?: string | number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError,
  lazy = true,
  webpSupport = true,
  productId
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejVjqkOzgfaKZhOJjV/o6oqmqpRNnoXHa5JNTwb8ioWIpKGhTl5xo16K2kMlKiWaNJZlYZPuE8HjGXfqLWlp1EQBVqRe7BBRR/d/lQAi3N+wWu2ZPGhXqYwTi0FHZOlU8jdF3VAAOEe1LpPB6lMf/9k=";

  // Generate multiple fallback URLs
  const getFallbackUrls = (originalSrc: string): string[] => {
    if (!originalSrc) return ['/placeholder.svg'];
    
    const fallbacks = [];
    
    // If it's already a full URL, use as is
    if (originalSrc.startsWith('http')) {
      fallbacks.push(originalSrc);
    } else {
      // Try different paths for local images
      fallbacks.push(`http://localhost:8000/storage/products/${originalSrc}`);
      fallbacks.push(`http://localhost:8000/images/products/${originalSrc}`);
      fallbacks.push(`/images/products/${originalSrc}`);
      fallbacks.push(`/images/${originalSrc}`);
    }
    
    // Ultimate fallback
    fallbacks.push('/placeholder.svg');
    
    return fallbacks;
  };

  const [currentSrc, setCurrentSrc] = useState(src);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const fallbackUrls = getFallbackUrls(src);

  const handleImageError = () => {
    console.error(`❌ Image failed to load: ${currentSrc}`);
    
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < fallbackUrls.length) {
      console.log(`🔄 Trying fallback ${nextIndex}: ${fallbackUrls[nextIndex]}`);
      setFallbackIndex(nextIndex);
      setCurrentSrc(fallbackUrls[nextIndex]);
    } else {
      console.error('⚠️ All image fallbacks failed');
      setImageError(true);
    }
    
    if (onError) onError();
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    console.log(`✅ Image loaded successfully: ${currentSrc}`);
    if (onLoad) onLoad();
  };

  // SEO optimized alt text
  const optimizedAlt = alt || `BuildTools BS - ${productId ? `Product ${productId}` : 'Image'}`;

  // If image completely failed, show placeholder
  if (imageError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
        role="img"
        aria-label={optimizedAlt}
      >
        <div className="text-center text-gray-400 p-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs">الصورة غير متاحة</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={style}>
      {/* Loading indicator */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400">
            <svg
              className="animate-spin h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </div>
      )}

      <Image
        src={currentSrc}
        alt={optimizedAlt}
        width={width}
        height={height}
        fill={fill}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={lazy ? 'lazy' : 'eager'}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        
        // SEO attributes
        itemProp="image"
        
        // Accessibility improvements
        role="img"
        
        // Performance hints
        fetchPriority={priority ? 'high' : 'auto'}
      />
      
      {/* Schema markup for product images */}
      {productId && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageObject",
              "url": currentSrc,
              "description": optimizedAlt,
              "width": width,
              "height": height
            })
          }}
        />
      )}
    </div>
  );
} 