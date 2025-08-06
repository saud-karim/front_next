import { Product, Category, MultilingualText } from '../types/multilingual';

// Mock Products Data (simulating API response)
export const mockProducts: Product[] = [
  {
    id: 1,
    name: {
      ar: "مثقاب ديوالت 20 فولت ماكس لاسلكي",
      en: "DeWalt 20V Max Cordless Drill"
    },
    description: {
      ar: "مثقاب احترافي لاسلكي بمحرك بدون فرش وإضاءة LED",
      en: "Professional cordless drill with brushless motor and LED light"
    },
    category: "power-tools",
    price: 299,
    originalPrice: 349,
    rating: 4.8,
    reviews: 1247,
    image: "🔋",
    features: [
      { ar: "محرك بدون فرش", en: "Brushless Motor" },
      { ar: "بطارية 20 فولت", en: "20V Battery" },
      { ar: "إضاءة LED", en: "LED Light" },
      { ar: "سرعتان", en: "2-Speed" }
    ],
    badge: {
      ar: "الأكثر مبيعاً",
      en: "Best Seller"
    },
    badgeColor: "bg-red-500",
    specifications: {
      voltage: { ar: "20 فولت", en: "20V" },
      torque: { ar: "65 نيوتن متر", en: "65 Nm" },
      chuckSize: { ar: "13 مم", en: "13mm" }
    }
  },
  {
    id: 2,
    name: {
      ar: "طقم أدوات احترافي 150 قطعة",
      en: "Professional Tool Set 150pcs"
    },
    description: {
      ar: "طقم شامل من الأدوات اليدوية عالية الجودة",
      en: "Comprehensive set of high-quality hand tools"
    },
    category: "hand-tools",
    price: 189,
    originalPrice: 229,
    rating: 4.9,
    reviews: 892,
    image: "🧰",
    features: [
      { ar: "كروم فاناديوم", en: "Chrome Vanadium" },
      { ar: "ضمان مدى الحياة", en: "Lifetime Warranty" },
      { ar: "علبة منظمة", en: "Organized Case" },
      { ar: "150 قطعة", en: "150 Pieces" }
    ],
    badge: {
      ar: "مميز",
      en: "Premium"
    },
    badgeColor: "bg-purple-500",
    specifications: {
      material: { ar: "كروم فاناديوم", en: "Chrome Vanadium" },
      pieces: { ar: "150 قطعة", en: "150 pieces" },
      case: { ar: "علبة بلاستيكية", en: "Plastic Case" }
    }
  },
  {
    id: 3,
    name: {
      ar: "خوذة أمان ذكية",
      en: "Smart Safety Helmet"
    },
    description: {
      ar: "خوذة أمان مزودة بمستشعرات ذكية وتقنية بلوتوث",
      en: "Safety helmet with smart sensors and Bluetooth technology"
    },
    category: "safety",
    price: 159,
    originalPrice: 199,
    rating: 4.7,
    reviews: 543,
    image: "🛡️",
    features: [
      { ar: "مستشعرات إنترنت الأشياء", en: "IoT Sensors" },
      { ar: "كشف الصدمات", en: "Impact Detection" },
      { ar: "بلوتوث", en: "Bluetooth" },
      { ar: "مؤشرات LED", en: "LED Indicators" }
    ],
    badge: {
      ar: "تقنية جديدة",
      en: "New Tech"
    },
    badgeColor: "bg-blue-500",
    specifications: {
      connectivity: { ar: "بلوتوث 5.0", en: "Bluetooth 5.0" },
      battery: { ar: "10 ساعات", en: "10 hours" },
      protection: { ar: "IP65", en: "IP65" }
    }
  }
];

// Mock Categories Data (simulating API response)
export const mockCategories: Category[] = [
  {
    id: "power-tools",
    name: {
      ar: "الأدوات الكهربائية",
      en: "Power Tools"
    },
    description: {
      ar: "أدوات كهربائية وبطارية احترافية",
      en: "Professional electric and battery-powered tools"
    },
    icon: "🔋",
    count: 120,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    items: [
      { ar: "مثاقب", en: "Drills" },
      { ar: "منشار", en: "Saws" },
      { ar: "مجالخ", en: "Grinders" },
      { ar: "صنفرة", en: "Sanders" }
    ]
  },
  {
    id: "hand-tools",
    name: {
      ar: "الأدوات اليدوية",
      en: "Hand Tools"
    },
    description: {
      ar: "أدوات يدوية أساسية لكل مشروع",
      en: "Essential manual tools for every project"
    },
    icon: "🔨",
    count: 200,
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50",
    items: [
      { ar: "مطارق", en: "Hammers" },
      { ar: "مفاتيح", en: "Wrenches" },
      { ar: "كماشات", en: "Pliers" },
      { ar: "مفكات", en: "Screwdrivers" }
    ]
  },
  {
    id: "safety",
    name: {
      ar: "معدات الأمان",
      en: "Safety Equipment"
    },
    description: {
      ar: "معدات حماية متقدمة للبناء",
      en: "Advanced protection gear for construction"
    },
    icon: "🛡️",
    count: 80,
    color: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    items: [
      { ar: "خوذات", en: "Helmets" },
      { ar: "قفازات", en: "Gloves" },
      { ar: "نظارات", en: "Goggles" },
      { ar: "أحزمة أمان", en: "Harnesses" }
    ]
  },
  {
    id: "smart-tools",
    name: {
      ar: "الأدوات الذكية",
      en: "Smart Tools"
    },
    description: {
      ar: "معدات بناء مزودة بتقنية إنترنت الأشياء",
      en: "IoT-enabled construction equipment"
    },
    icon: "⚡",
    count: 30,
    color: "from-purple-500 to-indigo-500",
    bgColor: "bg-purple-50",
    items: [
      { ar: "مستشعرات إنترنت الأشياء", en: "IoT Sensors" },
      { ar: "عدادات ذكية", en: "Smart Meters" },
      { ar: "أدوات متصلة", en: "Connected Tools" },
      { ar: "أتمتة", en: "Automation" }
    ]
  },
  {
    id: "precision-tools",
    name: {
      ar: "أدوات الدقة",
      en: "Precision Tools"
    },
    description: {
      ar: "أدوات قياس موجهة بالليزر",
      en: "Laser-guided measuring tools"
    },
    icon: "🎯",
    count: 25,
    color: "from-red-500 to-pink-500",
    bgColor: "bg-red-50",
    items: [
      { ar: "مستويات ليزر", en: "Laser Levels" },
      { ar: "أمتار دقيقة", en: "Precision Meters" },
      { ar: "فرجار رقمي", en: "Digital Calipers" },
      { ar: "مساحة", en: "Surveying" }
    ]
  }
];

// API simulation functions
export const fetchProducts = async (lang: 'ar' | 'en' = 'en'): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockProducts;
};

export const fetchCategories = async (lang: 'ar' | 'en' = 'en'): Promise<Category[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCategories;
}; 