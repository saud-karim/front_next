'use client';

import React from 'react';

interface Product {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  price?: number;
  sale_price?: number;
  image?: string;
  images?: string[];
  category?: {
    id: number;
    name: string;
    name_ar?: string;
    name_en?: string;
  };
  brand?: string;
  sku?: string;
  model?: string;
  availability?: string;
  rating?: number;
  review_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface Organization {
  name: string;
  logo?: string;
  url?: string;
  telephone?: string;
  address?: {
    street_ar?: string;
    street_en?: string;
    city_ar?: string;
    city_en?: string;
    country_ar?: string;
    country_en?: string;
  };
}

interface StructuredDataProps {
  type: 'product' | 'organization' | 'website' | 'breadcrumb';
  data: Product | Organization | any;
  language?: 'ar' | 'en';
}

export default function StructuredData({ type, data, language = 'ar' }: StructuredDataProps) {
  
  const generateProductStructuredData = (product: Product) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com';
    const productName = language === 'ar' 
      ? (product.name_ar || product.name) 
      : (product.name_en || product.name);
    
    const productDescription = language === 'ar'
      ? (product.description_ar || product.description)
      : (product.description_en || product.description);

    const categoryName = product.category 
      ? (language === 'ar' 
          ? (product.category.name_ar || product.category.name)
          : (product.category.name_en || product.category.name))
      : undefined;

    const productImage = product.image 
      ? (product.image.startsWith('http') 
          ? product.image 
          : `${baseUrl}/images/products/${product.image}`)
      : `${baseUrl}/placeholder.svg`;

    const additionalImages = product.images?.map(img => 
      img.startsWith('http') ? img : `${baseUrl}/images/products/${img}`
    ) || [];

    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productName,
      "description": productDescription || productName,
      "image": [productImage, ...additionalImages],
      "url": `${baseUrl}/products/${product.id}`,
      "sku": product.sku || `PROD-${product.id}`,
      "mpn": product.model || product.sku || `MODEL-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "BuildTools BS"
      },
      "category": categoryName || "Construction Tools",
      "offers": {
        "@type": "Offer",
        "url": `${baseUrl}/products/${product.id}`,
        "priceCurrency": "EGP",
        "price": product.sale_price || product.price || 0,
        "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        "availability": product.availability === 'in_stock' 
          ? "https://schema.org/InStock" 
          : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "BuildTools BS",
          "url": baseUrl
        }
      },
      "aggregateRating": product.rating && product.review_count ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.review_count,
        "bestRating": 5,
        "worstRating": 1
      } : undefined,
      "manufacturer": {
        "@type": "Organization",
        "name": product.brand || "BuildTools BS"
      },
      "datePublished": product.created_at,
      "dateModified": product.updated_at
    };

    // Remove undefined values
    return JSON.parse(JSON.stringify(structuredData));
  };

  const generateOrganizationStructuredData = (org: Organization) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com';
    
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": org.name,
      "url": org.url || baseUrl,
      "logo": org.logo || `${baseUrl}/icons/icon-512x512.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": org.telephone || "+20 123 456 7890",
        "contactType": "customer service",
        "availableLanguage": ["Arabic", "English"]
      },
      "address": org.address ? {
        "@type": "PostalAddress",
        "streetAddress": language === 'ar' 
          ? org.address.street_ar 
          : org.address.street_en,
        "addressLocality": language === 'ar'
          ? org.address.city_ar
          : org.address.city_en,
        "addressCountry": language === 'ar'
          ? org.address.country_ar
          : org.address.country_en
      } : undefined,
      "sameAs": [
        // Add social media links here
        // "https://www.facebook.com/buildtools",
        // "https://www.instagram.com/buildtools"
      ]
    };
  };

  const generateWebsiteStructuredData = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com';
    
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": language === 'ar' 
        ? "BuildTools BS - متجر مواد البناء والأدوات"
        : "BuildTools BS - Construction Tools & Materials Store",
      "url": baseUrl,
      "description": language === 'ar'
        ? "متجر مواد البناء والأدوات الاحترافية - أجود أنواع الأسمنت والحديد والأدوات الكهربائية والمعدات المهنية بأفضل الأسعار"
        : "Professional construction tools and materials store - Best quality cement, steel, electrical tools and professional equipment at the best prices",
      "inLanguage": [language],
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/products?search={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };
  };

  const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string, url: string}>) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com';
    
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url.startsWith('http') ? crumb.url : `${baseUrl}${crumb.url}`
      }))
    };
  };

  let structuredData;

  switch (type) {
    case 'product':
      structuredData = generateProductStructuredData(data as Product);
      break;
    case 'organization':
      structuredData = generateOrganizationStructuredData(data as Organization);
      break;
    case 'website':
      structuredData = generateWebsiteStructuredData();
      break;
    case 'breadcrumb':
      structuredData = generateBreadcrumbStructuredData(data);
      break;
    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2)
      }}
    />
  );
} 