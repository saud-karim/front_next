'use client';

import Head from 'next/head';
import { useLanguage } from '../context/LanguageContext';

interface MetaOptimizerProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'category';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  brand?: string;
  noIndex?: boolean;
  canonical?: string;
}

export default function MetaOptimizer({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  category,
  price,
  currency = 'EGP',
  availability,
  brand,
  noIndex = false,
  canonical
}: MetaOptimizerProps) {
  const { language } = useLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com';
  
  // Default values based on language
  const defaults = {
    ar: {
      siteName: 'BuildTools BS - متجر مواد البناء والأدوات',
      defaultTitle: 'BuildTools BS - أفضل متجر مواد البناء والأدوات في مصر',
      defaultDescription: 'متجر مواد البناء والأدوات الاحترافية - أجود أنواع الأسمنت والحديد والأدوات الكهربائية والمعدات المهنية بأفضل الأسعار في مصر',
      defaultKeywords: ['مواد البناء', 'أدوات كهربائية', 'أسمنت', 'حديد', 'معدات بناء', 'أدوات مهنية', 'مصر', 'القاهرة']
    },
    en: {
      siteName: 'BuildTools BS - Construction Tools & Materials Store',
      defaultTitle: 'BuildTools BS - Best Construction Tools & Materials Store in Egypt',
      defaultDescription: 'Professional construction tools and materials store - Best quality cement, steel, electrical tools and professional equipment at the best prices in Egypt',
      defaultKeywords: ['construction materials', 'electrical tools', 'cement', 'steel', 'building equipment', 'professional tools', 'Egypt', 'Cairo']
    }
  };

  const currentDefaults = defaults[language];
  
  const optimizedTitle = title 
    ? `${title} | ${currentDefaults.siteName}`
    : currentDefaults.defaultTitle;
  
  const optimizedDescription = description || currentDefaults.defaultDescription;
  
  const allKeywords = [...(keywords || []), ...currentDefaults.defaultKeywords];
  const keywordString = allKeywords.join(', ');
  
  const optimizedImage = image 
    ? (image.startsWith('http') ? image : `${baseUrl}${image}`)
    : `${baseUrl}/images/og-default.jpg`;
  
  const pageUrl = url ? `${baseUrl}${url}` : baseUrl;
  const canonicalUrl = canonical ? `${baseUrl}${canonical}` : pageUrl;

  // Structured data for different content types
  const generateStructuredData = () => {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": type === 'product' ? 'Product' : type === 'article' ? 'Article' : 'WebPage',
      "name": title,
      "description": description,
      "url": pageUrl,
      "image": optimizedImage,
      "inLanguage": language,
      "isPartOf": {
        "@type": "WebSite",
        "name": currentDefaults.siteName,
        "url": baseUrl
      }
    };

    if (type === 'product' && price) {
      return {
        ...baseStructuredData,
        "@type": "Product",
        "offers": {
          "@type": "Offer",
          "price": price,
          "priceCurrency": currency,
          "availability": availability === 'in_stock' 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "BuildTools BS"
          }
        },
        "brand": {
          "@type": "Brand",
          "name": brand || "BuildTools BS"
        }
      };
    }

    if (type === 'article') {
      return {
        ...baseStructuredData,
        "author": {
          "@type": "Person",
          "name": author || "BuildTools BS Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "BuildTools BS",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/icons/icon-512x512.png`
          }
        },
        "datePublished": publishedTime,
        "dateModified": modifiedTime || publishedTime
      };
    }

    return baseStructuredData;
  };

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywordString} />
      <meta name="author" content={author || "BuildTools BS"} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Language Alternatives */}
      <link rel="alternate" hrefLang="ar" href={pageUrl} />
      <link rel="alternate" hrefLang="en" href={`${pageUrl}${pageUrl.includes('?') ? '&' : '?'}lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={pageUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={optimizedImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || currentDefaults.defaultTitle} />
      <meta property="og:site_name" content={currentDefaults.siteName} />
      <meta property="og:locale" content={language === 'ar' ? 'ar_EG' : 'en_US'} />
      
      {/* Article specific OG tags */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author || "BuildTools BS Team"} />
          <meta property="article:section" content={category} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}
      
      {/* Product specific OG tags */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability || 'in_stock'} />
          {brand && <meta property="product:brand" content={brand} />}
        </>
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={optimizedImage} />
      <meta name="twitter:image:alt" content={title || currentDefaults.defaultTitle} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#dc2626" />
      <meta name="msapplication-TileColor" content="#dc2626" />
      <meta name="application-name" content="BuildTools BS" />
      <meta name="apple-mobile-web-app-title" content="BuildTools BS" />
      
      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//google-analytics.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(), null, 2)
        }}
      />
      
      {/* Additional Meta for PWA */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Verification tags (add when ready) */}
      {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}
      {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}
    </>
  );
} 