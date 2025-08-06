// Example of how product data should be structured for multilingual support
// This represents the format expected from the Laravel backend API

export interface MultilingualText {
  ar: string;
  en: string;
}

export interface MultilingualProduct {
  id: number;
  name: MultilingualText;
  category: string; // Category slug remains the same
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  image: string;
  features: MultilingualText[];
  badge: MultilingualText;
  badgeColor: string;
  description: MultilingualText;
  specifications: {
    [key: string]: MultilingualText;
  };
  images?: string[];
}

export interface MultilingualCategory {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  icon: string;
  productCount: number;
  color: string;
}

// Example of how to use multilingual data
export const sampleMultilingualProducts: MultilingualProduct[] = [
  {
    id: 1,
    name: {
      ar: "مثقاب كهربائي احترافي",
      en: "Professional Electric Drill"
    },
    category: "power-tools",
    price: "$299",
    originalPrice: "$349",
    rating: 4.8,
    reviews: 1247,
    image: "🔋",
    features: [
      {
        ar: "محرك بدون فرش",
        en: "Brushless Motor"
      },
      {
        ar: "إضاءة LED",
        en: "LED Light"
      },
      {
        ar: "بطارية ليثيوم",
        en: "Lithium Battery"
      },
      {
        ar: "ضمان سنتين",
        en: "2-Year Warranty"
      }
    ],
    badge: {
      ar: "الأكثر مبيعاً",
      en: "Best Seller"
    },
    badgeColor: "bg-red-500",
    description: {
      ar: "مثقاب كهربائي احترافي بمحرك بدون فرش وبطارية ليثيوم قوية. مثالي للاستخدام المكثف في مواقع البناء.",
      en: "Professional electric drill with brushless motor and powerful lithium battery. Perfect for heavy-duty use on construction sites."
    },
    specifications: {
      "Power": {
        ar: "18 فولت",
        en: "18V"
      },
      "Battery": {
        ar: "ليثيوم أيون 4.0 أمبير",
        en: "Li-ion 4.0Ah"
      },
      "Chuck Size": {
        ar: "13 مم",
        en: "13mm"
      },
      "Weight": {
        ar: "1.8 كيلوغرام",
        en: "1.8kg"
      }
    }
  }
];

// Utility function to get text based on current language
export const getLocalizedText = (text: MultilingualText, language: 'ar' | 'en'): string => {
  return text[language] || text.en; // Fallback to English if Arabic not available
};

// Example of how Laravel API should structure the response
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message: {
    ar: string;
    en: string;
  };
}

// Example API endpoint responses structure
export interface ProductsAPIResponse extends APIResponse<{
  products: MultilingualProduct[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_more: boolean;
  };
}> {}

export interface CategoriesAPIResponse extends APIResponse<{
  categories: MultilingualCategory[];
}> {}

// Example of how to call the API with language parameter
export const apiExamples = {
  // Products endpoint with language parameter
  products: (language: 'ar' | 'en' = 'ar') => 
    `/api/products?lang=${language}&per_page=12`,
  
  // Category endpoint with language parameter
  categories: (language: 'ar' | 'en' = 'ar') => 
    `/api/categories?lang=${language}`,
  
  // Single product endpoint
  product: (id: number, language: 'ar' | 'en' = 'ar') => 
    `/api/products/${id}?lang=${language}`
};

/*
  Backend Implementation Notes for Laravel:
  
  1. Database Structure:
     - Each translatable field should have both ar_field and en_field columns
     - OR use a separate translations table with language_code, field_name, field_value
  
  2. Model Example:
     protected $casts = [
       'name' => 'array',
       'description' => 'array',
       'features' => 'array'
     ];
  
  3. API Response Example:
     return response()->json([
       'success' => true,
       'data' => [
         'products' => $products->map(function($product) use ($lang) {
           return [
             'id' => $product->id,
             'name' => $product->getTranslation('name', $lang),
             'description' => $product->getTranslation('description', $lang),
             // ... other fields
           ];
         })
       ],
       'message' => __('products.retrieved_successfully')
     ]);
  
  4. Admin Panel:
     - Provide input fields for both Arabic and English
     - Validate that both languages are provided
     - Store in JSON format or separate translation tables
  
  5. Frontend Integration:
     - Always send lang parameter with API requests
     - Update API calls when language changes
     - Cache translations for better performance
*/ 