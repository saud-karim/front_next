import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  slug?: string;
  updated_at?: string;
  created_at?: string;
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/categories?per_page=1000&status=active`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

export async function GET() {
  const currentDate = new Date().toISOString();
  
  // Fetch categories from API
  const categories = await fetchCategories();
  
  const categoryUrls = categories.map(category => {
    const lastmod = category.updated_at || category.created_at || currentDate;
    const categorySlug = category.slug || category.id.toString();
    
    return {
      url: `${BASE_URL}/categories/${categorySlug}`,
      urlEn: `${BASE_URL}/categories/${categorySlug}?lang=en`,
      lastmod: new Date(lastmod).toISOString(),
      changefreq: 'weekly',
      priority: '0.7'
    };
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${categoryUrls.map(category => `  <url>
    <loc>${category.url}</loc>
    <lastmod>${category.lastmod}</lastmod>
    <changefreq>${category.changefreq}</changefreq>
    <priority>${category.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${category.urlEn}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${category.url}" />
  </url>
  <url>
    <loc>${category.urlEn}</loc>
    <lastmod>${category.lastmod}</lastmod>
    <changefreq>${category.changefreq}</changefreq>
    <priority>${category.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${category.url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${category.urlEn}" />
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  });
} 