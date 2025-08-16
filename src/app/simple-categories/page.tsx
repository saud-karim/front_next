'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

export default function SimpleCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔥 جاري جلب الفئات...');
        const response = await ApiService.getCategories();
        
        console.log('🔥 Categories Response كامل:', response);
        console.log('🔥 Categories Response.data:', response.data);
        console.log('🔥 هل Categories data array?', Array.isArray(response.data));
        
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
          console.log('✅ تم تحديث categories:', response.data.length, 'فئة');
        } else {
          console.log('❌ مشكلة في الاستجابة');
          setCategories([]);
        }
      } catch (error) {
        console.error('💥 خطأ:', error);
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
          <p className="mt-4 text-xl">جاري تحميل الفئات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">الفئات من API</h1>
        
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-8">
          <p className="text-yellow-800">
            <strong>عدد الفئات:</strong> {categories.length}
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="bg-red-100 border border-red-400 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-800 mb-4">❌ لا توجد فئات</h2>
            <p className="text-red-600">البيانات لم تصل من API</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: any) => (
              <div key={category.id} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-600">{category.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">ID:</span>
                    <span className="text-gray-600">{category.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Parent ID:</span>
                    <span className="text-gray-600">{category.parent_id || 'none'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Full Path:</span>
                    <span className="text-purple-600">{category.full_path}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-semibold">Children:</span>
                    <span className="text-green-600">{category.children?.length || 0} فئة فرعية</span>
                  </div>
                </div>
                
                <div className="mt-4 p-2 bg-gray-100 rounded">
                  <p className="text-xs text-gray-500">
                    تاريخ الإنشاء: {new Date(category.created_at).toLocaleDateString('ar')}
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
            إعادة تحميل البيانات
          </button>
        </div>
      </div>
    </div>
  );
} 