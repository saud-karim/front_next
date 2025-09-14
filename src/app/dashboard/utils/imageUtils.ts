// ✅ Utility functions لمعالجة الصور في Dashboard

/**
 * دالة للحصول على أفضل مسار للصورة مع fallbacks متعددة
 */
export const getBestImageUrl = (imagePath: string): string => {
  if (!imagePath || typeof imagePath !== 'string') {
    return '/placeholder.svg';
  }

  // إذا كان مسار كامل صحيح
  if (imagePath.startsWith('http') || imagePath.startsWith('/storage/') || imagePath.startsWith('/images/')) {
    return imagePath.startsWith('http') ? imagePath : 
           imagePath.startsWith('/storage/') ? `http://localhost:8000${imagePath}` : imagePath;
  }

  // أولوية للمسارات - جرب Laravel storage أولاً، ثم frontend public
  // سيتم تجريب باقي المسارات في onError handler
  return `http://localhost:8000/storage/products/${imagePath}`;
};

/**
 * دالة للحصول على جميع المسارات البديلة للصورة
 */
export const getImageFallbacks = (originalPath: string): string[] => {
  if (!originalPath) return ['/placeholder.svg'];
  
  return [
    // Backend Laravel storage paths (primary)
    `http://localhost:8000/storage/products/${originalPath}`,
    `http://localhost:8000/images/products/${originalPath}`,
    
    // Frontend public paths (fallback)
    `/images/products/${originalPath}`,
    `/images/${originalPath}`,
    
    // Relative paths without localhost
    `/storage/products/${originalPath}`,
    
    // Ultimate fallback
    '/placeholder.svg'
  ];
};

/**
 * دالة مساعدة لإنشاء onError handler للصور
 */
export const createImageErrorHandler = (
  originalPath: string,
  options?: {
    onAllFailed?: () => void;
    maxRetries?: number;
  }
) => {
  const { onAllFailed, maxRetries = 5 } = options || {};
  let retryCount = 0;

  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const currentSrc = e.currentTarget.src;
    retryCount++;

    console.error('❌ Failed to load image:', originalPath);
    console.error('🔗 Current URL tried:', currentSrc);
    console.log(`🔄 Retry attempt: ${retryCount}/${maxRetries}`);

    // إذا تجاوزنا الحد الأقصى للمحاولات
    if (retryCount >= maxRetries) {
      console.error('⚠️ Maximum retries reached for image:', originalPath);
      if (onAllFailed) onAllFailed();
      return;
    }

    // استخدام المسارات البديلة
    const fallbacks = getImageFallbacks(originalPath);
    
    // البحث عن المسار التالي الذي لم يتم تجريبه
    for (const fallbackUrl of fallbacks) {
      if (currentSrc !== fallbackUrl && !currentSrc.includes(fallbackUrl.split('/').pop() || '')) {
        console.log('🔄 Trying fallback URL:', fallbackUrl);
        e.currentTarget.src = fallbackUrl;
        return;
      }
    }

    // إذا فشل كل شيء، استخدم placeholder
    if (!currentSrc.includes('placeholder.svg')) {
      console.warn('⚠️ All image fallbacks failed, using placeholder');
      e.currentTarget.src = '/placeholder.svg';
      return;
    }

    // إذا فشل حتى placeholder
    console.error('⚠️ Even placeholder failed');
    if (onAllFailed) onAllFailed();
  };
};

/**
 * دالة لإنشاء onLoad handler للصور
 */
export const createImageLoadHandler = (originalPath: string, productId?: number) => {
  return () => {
    const message = productId 
      ? `✅ Image loaded successfully for product #${productId}: ${originalPath}`
      : `✅ Image loaded successfully: ${originalPath}`;
    console.log(message);
  };
};

/**
 * دالة لإنشاء HTML fallback عند فشل كل الصور
 */
export const createImageFallbackElement = (className: string = ''): string => {
  return `
    <div class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg ${className}">
      <div class="text-center p-4">
        <div class="text-5xl mb-2">📦</div>
        <div class="text-sm font-medium text-gray-600">صورة غير متاحة</div>
        <div class="text-xs text-gray-500 mt-1">Image not available</div>
      </div>
    </div>
  `;
};

/**
 * Data URL للـ fallback النهائي
 */
export const getDataUrlPlaceholder = (): string => {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiPtmE2Kcg2KrZiNis2K8g2LXZiNix2KktL3RleHQ+PC9zdmc+';
}; 