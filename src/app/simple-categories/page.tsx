'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export default function SimpleCategoriesPage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔥 Loading categories...');
        const response = await ApiService.getCategories();
        
        console.log('🔥 Categories Response full:', response);
        console.log('🔥 Categories Response.data:', response.data);
        console.log('🔥 Is Categories data array?', Array.isArray(response.data));
        
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
          console.log('✅ Categories updated:', response.data.length, 'categories');
        } else {
                      console.log('❌ Problem with response');
          setCategories([]);
        }
      } catch (error) {
        console.error('💥 Error:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-xl">{t('loading.categories')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('categories.from.api')}</h1>
        
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            <strong>{language === 'ar' ? 'عدد الفئات' : 'Categories Count'}:</strong> {categories.length}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="bg-red-100 border border-red-400 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">❌ {t('categories.no.categories')}</h2>
            <p className="text-red-600">{t('categories.no.data')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: any) => (
              <div key={category.id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-600">{category.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">{language === 'ar' ? 'المعرف' : 'ID'}:</span>
                    <span className="text-gray-600">{category.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">{language === 'ar' ? 'معرف الأصل' : 'Parent ID'}:</span>
                                          <span className="text-gray-600">{category.parent_id || (language === 'ar' ? 'لا يوجد' : 'none')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">{language === 'ar' ? 'المسار الكامل' : 'Full Path'}:</span>
                    <span className="text-purple-600">{category.full_path}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">{language === 'ar' ? 'الفئات الفرعية' : 'Children'}:</span>
                    <span className="text-green-600">{category.children?.length || 0} {t('categories.subcategories')}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-2 bg-gray-100 rounded">
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}: {new Date(category.created_at).toLocaleDateString(language === 'ar' ? 'ar' : 'en')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {language === 'ar' ? 'إعادة تحميل البيانات' : 'Reload Data'}
          </button>
        </div>
      </div>
    </div>
  );
} 