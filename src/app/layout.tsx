import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";
import { headers } from "next/headers";
import StructuredData from "./components/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Function to get language from headers or cookies
async function getLanguageFromRequest(): Promise<'ar' | 'en'> {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const cookieHeader = headersList.get('cookie') || '';
    
    // Check if language is stored in cookie
    const languageMatch = cookieHeader.match(/language=([^;]+)/);
    if (languageMatch && languageMatch[1] === 'en') {
      return 'en';
    }
    
    // Check accept-language header
    if (acceptLanguage.includes('en') && acceptLanguage.indexOf('en') < acceptLanguage.indexOf('ar')) {
      return 'en';
    }
    
    // Default to Arabic
    return 'ar';
  } catch {
    // Fallback to Arabic
    return 'ar';
  }
}

// Dynamic metadata based on language
export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguageFromRequest();
  
  const metadataContent = {
    ar: {
      title: "BuildTools BS - متجر مواد البناء والأدوات",
      description: "متجر مواد البناء والأدوات الاحترافية - أجود أنواع الأسمنت والحديد والأدوات الكهربائية والمعدات المهنية بأفضل الأسعار",
      keywords: "مواد البناء، أدوات كهربائية، أسمنت، حديد، معدات بناء، أدوات مهنية، مصر"
    },
    en: {
      title: "BuildTools BS - Construction Tools & Materials Store",
      description: "Professional construction tools and materials store - Best quality cement, steel, electrical tools and professional equipment at the best prices",
      keywords: "construction materials, electrical tools, cement, steel, building equipment, professional tools, Egypt"
    }
  };

  const content = metadataContent[language];

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    robots: "index, follow",
    openGraph: {
      title: content.title,
      description: content.description,
      type: "website",
      locale: language === 'ar' ? 'ar_EG' : 'en_US',
      siteName: "BuildTools BS"
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
    },
    alternates: {
      languages: {
        'ar-EG': '/',
        'en-US': '/?lang=en'
      }
    },
    manifest: '/manifest.json',
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
      themeColor: '#dc2626'
    },
    icons: {
      icon: [
        { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' }
      ],
      apple: [
        { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' }
      ]
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: content.title
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get language for HTML lang attribute
  const language = await getLanguageFromRequest();
  
  return (
    <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        <StructuredData 
          type="website" 
          data={{}} 
          language={language} 
        />
        <StructuredData 
          type="organization" 
          data={{
            name: "BuildTools BS",
            telephone: "+20 123 456 7890",
            address: {
              street_ar: "شارع التحرير، المعادي",
              street_en: "Tahrir Street, Maadi",
              city_ar: "القاهرة",
              city_en: "Cairo",
              country_ar: "مصر",
              country_en: "Egypt"
            }
          }} 
          language={language} 
        />
        <LanguageProvider>
          <ToastProvider>
            <AuthProvider>
              <CartProvider>
        {children}
              </CartProvider>
            </AuthProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
