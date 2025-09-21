import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://buildtools-bs.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

interface Product {
  id: number;
  name: string;
  slug?: string;
  updated_at?: string;
  created_at?: string;
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/products?per_page=1000&status=active`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

export async function GET() {
  const currentDate = new Date().toISOString();
  
  // Fetch products from API
  const products = await fetchProducts();
  
  const productUrls = products.map(product => {
    const lastmod = product.updated_at || product.created_at || currentDate;
    const productSlug = product.slug || product.id.toString();
    
    return {
      url: `${BASE_URL}/products/${productSlug}`,
      urlEn: `${BASE_URL}/products/${productSlug}?lang=en`,
      lastmod: new Date(lastmod).toISOString(),
      changefreq: 'weekly',
      priority: '0.8'
    };
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${productUrls.map(product => `  <url>
    <loc>${product.url}</loc>
    <lastmod>${product.lastmod}</lastmod>
    <changefreq>${product.changefreq}</changefreq>
    <priority>${product.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${product.urlEn}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${product.url}" />
  </url>
  <url>
    <loc>${product.urlEn}</loc>
    <lastmod>${product.lastmod}</lastmod>
    <changefreq>${product.changefreq}</changefreq>
    <priority>${product.priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${product.url}" />
    <xhtml:link rel="alternate" hreflang="en" href="${product.urlEn}" />
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  });
} 