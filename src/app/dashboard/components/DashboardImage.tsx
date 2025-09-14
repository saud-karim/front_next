'use client';

import React, { useState } from 'react';
import { getBestImageUrl, getImageFallbacks, createImageFallbackElement } from '../utils/imageUtils';

interface DashboardImageProps {
  src: string;
  alt: string;
  className?: string;
  productId?: number;
  onImageError?: (src: string) => void;
  onImageLoad?: (src: string) => void;
  fallbackClassName?: string;
  maxRetries?: number;
}

export const DashboardImage: React.FC<DashboardImageProps> = ({
  src,
  alt,
  className = '',
  productId,
  onImageError,
  onImageLoad,
  fallbackClassName = '',
  maxRetries = 5
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(getBestImageUrl(src));

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const failedSrc = e.currentTarget.src;
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);

    console.error('❌ Dashboard Image: Failed to load:', src);
    console.error('🔗 Current URL tried:', failedSrc);
    console.log(`🔄 Retry attempt: ${newRetryCount}/${maxRetries}`);

    // إذا تجاوزنا الحد الأقصى للمحاولات
    if (newRetryCount >= maxRetries) {
      console.error('⚠️ Maximum retries reached for image:', src);
      setHasError(true);
      if (onImageError) onImageError(src);
      return;
    }

    // استخدام المسارات البديلة
    const fallbacks = getImageFallbacks(src);
    
    // البحث عن المسار التالي الذي لم يتم تجريبه
    for (const fallbackUrl of fallbacks) {
      if (failedSrc !== fallbackUrl && !failedSrc.includes(fallbackUrl.split('/').pop() || '')) {
        console.log('🔄 Dashboard Image: Trying fallback URL:', fallbackUrl);
        setCurrentSrc(fallbackUrl);
        return;
      }
    }

    // إذا فشل كل شيء
    console.warn('⚠️ Dashboard Image: All fallbacks failed for:', src);
    setHasError(true);
    if (onImageError) onImageError(src);
  };

  const handleImageLoad = () => {
    const message = productId 
      ? `✅ Dashboard Image: Loaded successfully for product #${productId}: ${src}`
      : `✅ Dashboard Image: Loaded successfully: ${src}`;
    console.log(message);
    
    if (onImageLoad) onImageLoad(src);
  };

  // إذا فشل تحميل الصورة نهائياً، عرض HTML fallback
  if (hasError) {
    return (
      <div 
        className={`${className} ${fallbackClassName}`}
        dangerouslySetInnerHTML={{ 
          __html: createImageFallbackElement(fallbackClassName) 
        }}
      />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      loading="lazy"
    />
  );
};

export default DashboardImage; 