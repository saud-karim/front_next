export interface MultilingualText {
  ar: string;
  en: string;
}

export interface Product {
  id: number;
  name: MultilingualText;
  description: MultilingualText;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  features: MultilingualText[];
  badge: MultilingualText;
  badgeColor: string;
  specifications: {
    [key: string]: MultilingualText;
  };
}

export interface Category {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  icon: string;
  count: number;
  color: string;
  bgColor: string;
  items: MultilingualText[];
}

// Helper function to get localized text
export function getLocalizedText(text: MultilingualText, language: 'ar' | 'en'): string {
  return text[language] || text.en;
}

// Example API response structure
export interface APIProductResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface APICategoryResponse {
  data: Category[];
  total: number;
} 