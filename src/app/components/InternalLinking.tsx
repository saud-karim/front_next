'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  prefetch?: boolean;
  seoOptimized?: boolean;
}

export default function InternalLinking({
  href,
  children,
  className = '',
  title,
  prefetch = true,
  seoOptimized = true
}: InternalLinkProps) {
  const { language } = useLanguage();

  const getLocalizedHref = () => {
    if (href.startsWith('http')) return href;
    
    const url = new URL(href, 'http://localhost');
    if (language === 'en' && !url.searchParams.has('lang')) {
      url.searchParams.set('lang', 'en');
    }
    
    return url.pathname + url.search + url.hash;
  };

  const isExternal = href.startsWith('http');
  
  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        title={title}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={getLocalizedHref()}
      className={className}
      title={title}
      prefetch={prefetch}
    >
      {children}
    </Link>
  );
}

// SEO Breadcrumb Component
interface BreadcrumbProps {
  items: Array<{
    name: string;
    href?: string;
    current?: boolean;
  }>;
  className?: string;
}

export function SEOBreadcrumb({ items, className = '' }: BreadcrumbProps) {
  const { language } = useLanguage();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com';

  return (
    <>
      <nav className={`breadcrumb ${className}`}>
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              
              {item.href && !item.current ? (
                <InternalLinking href={item.href} className="hover:text-blue-600">
                  {item.name}
                </InternalLinking>
              ) : (
                <span className={item.current ? 'text-gray-900 font-medium' : 'text-gray-600'}>
                  {item.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.name,
              "item": item.href ? `${baseUrl}${item.href}` : undefined
            }))
          })
        }}
      />
    </>
  );
} 