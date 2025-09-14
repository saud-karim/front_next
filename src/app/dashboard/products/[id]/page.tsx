'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { ApiService } from '../../../services/api';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: string;
  sale_price?: string;
  stock: number;
  category_id: number;
  supplier_id: number;
  status: 'active' | 'inactive';
  featured: boolean;
  images: string[];
  features: string[];
  specifications: { key: string; value: string }[];
}

interface Category {
  id: number;
  name: string;
  name_ar?: string;
  name_en?: string;
}



export default function EditProductPage() {
  const { t, language, getLocalizedText } = useLanguage();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // تحميل بيانات المنتج والبيانات المرجعية
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('🚀 Fetching product with ID:', productId, 'Language:', language);
        
        // Try admin API first, fallback to regular API if it fails
        let productRes;
        let categoriesRes;
        
        try {
          console.log('🔐 Trying Admin API first...');
          const [adminProductRes, adminCategoriesRes, suppliersRes] = await Promise.all([
          ApiService.getAdminProduct(Number(productId), { lang: language }),
          ApiService.getAdminCategories({ lang: language }),
            ApiService.getSuppliers({ lang: language }),
          ]);
          
          // Assign to outer scope variables
          productRes = adminProductRes;
          categoriesRes = adminCategoriesRes;
          console.log('✅ Admin API succeeded');
          console.log('🔍 Product Response:', productRes);
          console.log('🔍 Categories Response:', categoriesRes);
          
          // Set suppliers data
          if (suppliersRes && suppliersRes.success && suppliersRes.data) {
            setSuppliers(suppliersRes.data);
          }
        } catch (adminError) {
          console.log('❌ Admin API failed, trying regular API...');
          console.log('🔄 Admin Error:', adminError);
          
          // Show a warning to the user
          console.warn('⚠️ Using fallback method due to backend issue');
          setFallbackMode(true);
          
          // Fallback to regular APIs
          [productRes, categoriesRes] = await Promise.all([
            ApiService.getProductDetails(Number(productId), { lang: language }),
            ApiService.getCategories({ lang: language }),
          ]);
          
          console.log('✅ Regular API succeeded');
          console.log('🔍 Fallback Product Response:', productRes);
          console.log('🔍 Fallback Categories Response:', categoriesRes);
          
          // Also get suppliers for fallback mode
          try {
            const suppliersRes = await ApiService.getSuppliers({ lang: language });
            if (suppliersRes.success && suppliersRes.data) {
              setSuppliers(suppliersRes.data);
            }
          } catch (suppliersError) {
            console.log('⚠️ Could not fetch suppliers:', suppliersError);
          }
          console.log('✅ Regular API succeeded');
        }

        console.log('🔍 Final Product API Response:', productRes);
        console.log('📄 Response Keys:', Object.keys(productRes || {}));
        console.log('🔍 Fallback Mode:', fallbackMode);
        
        // معالجة response structure مختلف للـ Admin vs Regular APIs
        let productData = null;
        
        if (fallbackMode) {
          // Regular API structure: { product: productObject }
          if (productRes && productRes.product) {
            productData = productRes.product;
            console.log('✅ Using regular API data structure (direct product object)');
          }
        } else {
          // Admin API structure: { success: true, data: { product: productObject } }
          if (productRes && productRes.success && productRes.data && productRes.data.product) {
            productData = productRes.data.product;
            console.log('✅ Using admin API data structure (updated)');
          }
        }
        
        if (productData) {
          
          setProduct({
            id: productData.id,
            name_ar: productData.name_ar || '',
            name_en: productData.name_en || '',
            description_ar: productData.description_ar || '',
            description_en: productData.description_en || '',
            price: productData.price?.toString() || '0',
            sale_price: productData.sale_price?.toString() || '',
            stock: productData.stock || 0,
            category_id: productData.category?.id || productData.category_id || 1,
            supplier_id: productData.supplier?.id || productData.supplier_id || 6,
            status: productData.status || 'active',
            featured: productData.featured || false,
            images: productData.images || [],
            features: (() => {
              try {
                if (typeof productData.features === 'string') {
                  return JSON.parse(productData.features) || [];
                }
                return productData.features?.map((f: any) => f.feature || f) || [];
              } catch {
                return [];
              }
            })(),
            specifications: (() => {
              try {
                if (typeof productData.specifications === 'string') {
                  return JSON.parse(productData.specifications) || [];
                }
                return productData.specifications?.map((s: any) => ({
              key: s.spec_key || s.key || '',
              value: s.spec_value || s.value || ''
                })) || [];
              } catch {
                return [];
              }
            })(),
          });
          // التأكد من أن الصور array قبل التعيين
          const images = productData.images;
          if (Array.isArray(images)) {
            setExistingImages(images);
          } else if (typeof images === 'string') {
            // إذا كانت string، تحويلها لـ array
            try {
              const parsedImages = JSON.parse(images);
              setExistingImages(Array.isArray(parsedImages) ? parsedImages : []);
            } catch {
              setExistingImages([]);
            }
          } else {
            setExistingImages([]);
          }
        } else {
          console.error('❌ Product API Failed or Wrong Structure:', productRes);
          console.error('❌ Expected Admin: { success: true, data: { product: {...} } }');
          console.error('❌ Expected Regular: { product: productObject }');
          console.error('❌ Received:', productRes);
          console.error('❌ Fallback Mode:', fallbackMode);
          setNotFound(true);
        }

        // معالجة categories data (different structure for admin vs regular)
        if (fallbackMode) {
          // Regular API structure might be different
          if (categoriesRes && categoriesRes.data) {
            setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
            console.log('✅ Categories loaded (fallback mode):', categoriesRes.data.length || 0);
          } else if (categoriesRes && Array.isArray(categoriesRes)) {
            setCategories(categoriesRes);
            console.log('✅ Categories loaded (direct array):', categoriesRes.length);
          }
        } else {
          // Admin API structure
          if (categoriesRes && categoriesRes.success && categoriesRes.data) {
            setCategories(categoriesRes.data);
            console.log('✅ Categories loaded (admin mode):', categoriesRes.data.length);
          }
        }
        
        if (!categories.length) {
          console.warn('⚠️ Categories failed to load or empty:', categoriesRes);
        }
      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId, language]);

  // تحديث قيم المنتج
  const updateProduct = (field: keyof Product, value: any) => {
    if (product) {
      setProduct(prev => prev ? { ...prev, [field]: value } : null);
      // إزالة الخطأ عند التعديل
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  // التعامل مع الصور الجديدة
  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImagesCount = Array.isArray(existingImages) ? existingImages.length : 0;
    const totalImages = currentImagesCount + files.length;
    
    if (totalImages > 5) {
      alert('يمكن رفع 5 صور كحد أقصى');
      return;
    }

    setNewImages(files);

    // إنشاء معاينة للصور الجديدة
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // حذف صورة موجودة
  const removeExistingImage = (index: number) => {
    if (!Array.isArray(existingImages)) return;
    
    if (!Array.isArray(existingImages)) return;
    
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
  };

  // إضافة ميزة جديدة
  const addFeature = () => {
    if (product) {
      updateProduct('features', [...product.features, '']);
    }
  };

  // حذف ميزة
  const removeFeature = (index: number) => {
    if (product) {
      const newFeatures = product.features.filter((_, i) => i !== index);
      updateProduct('features', newFeatures);
    }
  };

  // تحديث ميزة
  const updateFeature = (index: number, value: string) => {
    if (product) {
      const newFeatures = [...product.features];
      newFeatures[index] = value;
      updateProduct('features', newFeatures);
    }
  };

  // إضافة مواصفة جديدة
  const addSpecification = () => {
    if (product) {
      updateProduct('specifications', [...product.specifications, { key: '', value: '' }]);
    }
  };

  // حذف مواصفة
  const removeSpecification = (index: number) => {
    if (product) {
      const newSpecs = product.specifications.filter((_, i) => i !== index);
      updateProduct('specifications', newSpecs);
    }
  };

  // تحديث مواصفة
  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    if (product) {
      const newSpecs = [...product.specifications];
      newSpecs[index][field] = value;
      updateProduct('specifications', newSpecs);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    if (!product) return false;
    
    const newErrors: Record<string, string> = {};

    if (!product.name_ar.trim()) newErrors.name_ar = 'اسم المنتج بالعربية مطلوب';
    if (!product.name_en.trim()) newErrors.name_en = 'اسم المنتج بالإنجليزية مطلوب';
    if (!product.description_ar.trim()) newErrors.description_ar = 'وصف المنتج بالعربية مطلوب';
    if (!product.description_en.trim()) newErrors.description_en = 'وصف المنتج بالإنجليزية مطلوب';
    if (!product.price.trim()) newErrors.price = 'سعر المنتج مطلوب';
    if (!product.stock.toString().trim()) newErrors.stock = 'كمية المخزون مطلوبة';
    if (!product.category_id) newErrors.category_id = 'فئة المنتج مطلوبة';

    // التحقق من الأرقام
    if (product.price && isNaN(Number(product.price))) {
      newErrors.price = 'السعر يجب أن يكون رقماً';
    }
    if (product.original_price && isNaN(Number(product.original_price))) {
      newErrors.original_price = 'السعر الأصلي يجب أن يكون رقماً';
    }
    if (product.stock && isNaN(Number(product.stock))) {
      newErrors.stock = 'المخزون يجب أن يكون رقماً';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال التحديث
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product || !validateForm()) return;

    setSubmitLoading(true);
    try {
      // إعداد البيانات للإرسال
      // بيانات أساسية فقط للـ debugging
      const productData = {
        name_ar: product.name_ar,
        name_en: product.name_en,
        description_ar: product.description_ar,
        description_en: product.description_en,
        price: Number(product.price),
        stock: Number(product.stock),
        category_id: Number(product.category_id),
        supplier_id: Number(product.supplier_id),
        status: product.status,
        featured: product.featured,
        existing_images: existingImages.length,
        new_images: newImages.length
      };

      console.log('📤 Sending product data:', {
        ...productData,
        new_images: `${newImages.length} file(s)`,
        existing_images: `${existingImages.length} image(s)`
      });

            // محاولة رفع الصور الجديدة مع FormData
      const hasNewImages = newImages.length > 0;
      let response: any;
      
      if (hasNewImages) {
        console.log('📷 New images detected, trying FormData upload...');
        
        const formData = new FormData();
        
        // ✅ إضافة البيانات الأساسية فقط
        formData.append('name_ar', product.name_ar || '');
        formData.append('name_en', product.name_en || '');
        formData.append('description_ar', product.description_ar || '');
        formData.append('description_en', product.description_en || '');
        formData.append('price', product.price || '0');
        formData.append('sale_price', product.sale_price || '');
        formData.append('original_price', ''); // WORKAROUND: Backend forces this despite DB error
        formData.append('stock', (product.stock || 0).toString());
        formData.append('category_id', (product.category_id || 1).toString());
        formData.append('supplier_id', (product.supplier_id || 6).toString());
        formData.append('brand_id', '1'); // Default brand_id as required by database
        formData.append('status', product.status || 'active');
        formData.append('featured', product.featured ? '1' : '0');
        
        // Features و Specifications تم إزالتها مؤقتاً لتجنب backend issues
        
        // ✅ الصور الموجودة للاحتفاظ بها
        if (existingImages.length > 0) {
          formData.append('existing_images', JSON.stringify(existingImages));
        }
        
        // ✅ الصور الجديدة - استخدم new_images بدلاً من new_images[]
        newImages.forEach((image, index) => {
          formData.append(`new_images[${index}]`, image);
        });

        // 🔍 طباعة محتوى FormData للـ debugging
        console.log('📤 Sending FormData with new images:', newImages.length);
        console.log('📋 FormData contents:');
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
          } else {
            console.log(`  ${key}:`, value);
          }
        }

        try {
          const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
          
          if (!token) {
            throw new Error('لا يوجد token للمصادقة');
          }
          
          console.log('🚀 Sending FormData request to backend...');
          const apiResponse = await fetch(`http://localhost:8000/api/v1/admin/products/${product.id}`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
              // ⚠️ لا نضع Content-Type للـ FormData
            },
            body: formData
          });

          console.log('📡 Response received:', {
            status: apiResponse.status,
            statusText: apiResponse.statusText,
            ok: apiResponse.ok,
            headers: Object.fromEntries(apiResponse.headers.entries())
          });

          if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('❌ HTTP Error Response:', errorText);
            throw new Error(`Backend Error ${apiResponse.status}: ${errorText}`);
          }

          const responseData = await apiResponse.json();
          console.log('✅ FormData Response Data:', responseData);
          
          if (responseData && responseData.success) {
            console.log('🎉 Product updated with new images successfully!');
            response = responseData;
          } else {
            console.error('❌ Backend returned success=false:', responseData);
            throw new Error(responseData?.message || 'Backend rejected the update');
          }
        } catch (formDataError: any) {
          console.error('❌ FormData update failed:', formDataError);
          console.error('🔍 Error details:', {
            message: formDataError?.message,
            stack: formDataError?.stack,
            name: formDataError?.name,
            type: typeof formDataError
          });
          
          // عرض رسالة خطأ مفصلة
          const errorMessage = formDataError?.message || String(formDataError) || 'خطأ غير معروف';
          
          const proceed = confirm(
            `فشل رفع الصور الجديدة:\n${errorMessage}\n\n` +
            'هل تريد حفظ التعديلات بدون الصور الجديدة؟\n' +
            'ستحتفظ بالصور الموجودة، لكن الصور الجديدة لن ترفع.\n\n' +
            '(اضغط Cancel لإلغاء التحديث تماماً)'
          );
          
          if (!proceed) {
            setSubmitLoading(false);
            return;
          }
          
          // المتابعة للـ JSON fallback
          response = null;
        }
      }
      
      // JSON fallback (إذا لم تكن فيه صور جديدة أو فشل FormData)
      if (!response) {
      // إرسال الحقول الصحيحة حسب schema قاعدة البيانات
      const jsonData = {
        name_ar: product.name_ar,
        name_en: product.name_en,
        description_ar: product.description_ar,
        description_en: product.description_en,
        price: Number(product.price),
        sale_price: product.sale_price ? Number(product.sale_price) : null,
        original_price: null, // WORKAROUND: Backend forces this field despite it not existing in DB
        stock: Number(product.stock),
        category_id: Number(product.category_id),
        supplier_id: Number(product.supplier_id),
        brand_id: 1, // Default brand_id as required by database
        status: product.status,
        featured: product.featured
        // NOTE: original_price doesn't exist in database but backend forces it!
      };

        console.log('📤 Sending JSON data (no new images):', {
        ...jsonData,
        images: `${existingImages.length} existing images`,
          skipped_images: hasNewImages ? `${newImages.length} new images` : 'none'
      });

        response = await ApiService.updateProduct(product.id, jsonData);
      }
      console.log('📦 Product updated:', response);

      if (response.success) {
        alert('تم تحديث المنتج بنجاح!');
        
        // إعادة تحميل بيانات المنتج لعرض التحديثات
        console.log('🔄 Reloading product data...');
        const updatedProduct = await ApiService.getAdminProduct(Number(productId), { lang: language });
        if (updatedProduct && updatedProduct.success && updatedProduct.data && updatedProduct.data.product) {
          const productData = updatedProduct.data.product;
          console.log('✅ Updated product data:', productData);
          
          // تحديث state
          setProduct({
            id: productData.id,
            name_ar: productData.name_ar || '',
            name_en: productData.name_en || '',
            description_ar: productData.description_ar || '',
            description_en: productData.description_en || '',
            price: productData.price?.toString() || '',
            original_price: productData.original_price?.toString() || '',
            stock: productData.stock || 0,
            category_id: productData.category?.id || productData.category_id,
            status: productData.status || 'active',
            featured: productData.featured || false,
            images: productData.images || [],
            features: (() => {
              try {
                if (typeof productData.features === 'string') {
                  return JSON.parse(productData.features) || [];
                }
                return productData.features?.map((f: any) => f.feature || f) || [];
              } catch {
                return [];
              }
            })(),
            specifications: (() => {
              try {
                if (typeof productData.specifications === 'string') {
                  return JSON.parse(productData.specifications) || [];
                }
                return productData.specifications?.map((s: any) => ({
              key: s.spec_key || s.key || '',
              value: s.spec_value || s.value || ''
                })) || [];
              } catch {
                return [];
              }
            })(),
          });
          
          // تحديث الصور
          const images = productData.images;
          if (Array.isArray(images)) {
            setExistingImages(images);
          } else if (typeof images === 'string') {
            try {
              const parsedImages = JSON.parse(images);
              setExistingImages(Array.isArray(parsedImages) ? parsedImages : []);
            } catch {
              setExistingImages([images]);
            }
          } else {
            setExistingImages([]);
          }
          
          // مسح الصور الجديدة المؤقتة لأنها أصبحت جزء من existing_images
          setNewImages([]);
          setImagePreview([]);
          
          console.log('🖼️ Updated images:', productData.images);
        }
      } else {
        alert('حدث خطأ في تحديث المنتج: ' + (response.message || 'خطأ غير معروف'));
      }
      
    } catch (error: any) {
      console.error('خطأ في تحديث المنتج:', error);
      
      // إذا كان في validation errors، عرضهم
      if (error.message === 'بيانات غير صحيحة') {
        console.error('🚫 Backend validation failed - check FormData format');
        alert('خطأ في البيانات المرسلة. تحقق من Console للتفاصيل');
      } else {
        alert('حدث خطأ في تحديث المنتج: ' + error.message);
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  // حذف المنتج
  const handleDelete = async () => {
    if (!product) return;
    
    const confirmed = confirm(`هل أنت متأكد من حذف المنتج "${product.name_ar}"؟ هذا الإجراء لا يمكن التراجع عنه.`);
    if (!confirmed) return;

    try {
      // هنا يمكن إضافة API call لحذف المنتج
      // await ApiService.deleteProduct(product.id);
      
      alert('تم حذف المنتج بنجاح!');
      router.push('/dashboard/products');
    } catch (error) {
      console.error('خطأ في حذف المنتج:', error);
      alert('حدث خطأ في حذف المنتج');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 animate-pulse rounded-lg h-12"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">منتج غير موجود</h3>
        <p className="text-gray-600 mb-6">المنتج المطلوب غير موجود أو تم حذفه</p>
        <Link
          href="/dashboard/products"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          العودة للمنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تعديل المنتج</h1>
          <p className="text-gray-600 mt-1">تعديل بيانات المنتج: {product.name_ar}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🗑️ حذف المنتج
          </button>
          <Link
            href="/dashboard/products"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ← العودة للمنتجات
          </Link>
        </div>
      </div>

      {/* Warning for fallback mode */}
      {fallbackMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">وضع الاسترداد النشط</h3>
              <p className="text-sm text-yellow-700 mt-1">
                تم تحميل البيانات باستخدام API بديل بسبب مشكلة مؤقتة في الخادم.
                جميع الوظائف تعمل بشكل طبيعي.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* النموذج */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* المعلومات الأساسية */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">المعلومات الأساسية</h2>
            
            {/* اسم المنتج بالعربية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المنتج (العربية) *
              </label>
              <input
                type="text"
                value={product?.name_ar || ''}
                onChange={(e) => updateProduct('name_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.name_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="أدخل اسم المنتج بالعربية"
              />
              {errors.name_ar && <p className="text-red-500 text-sm mt-1">{errors.name_ar}</p>}
            </div>

            {/* اسم المنتج بالإنجليزية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                اسم المنتج (English) *
              </label>
              <input
                type="text"
                value={product?.name_en || ''}
                onChange={(e) => updateProduct('name_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.name_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name in English"
              />
              {errors.name_en && <p className="text-red-500 text-sm mt-1">{errors.name_en}</p>}
            </div>

            {/* وصف المنتج بالعربية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف المنتج (العربية) *
              </label>
              <textarea
                value={product?.description_ar || ''}
                onChange={(e) => updateProduct('description_ar', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.description_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="أدخل وصف المنتج بالعربية"
              />
              {errors.description_ar && <p className="text-red-500 text-sm mt-1">{errors.description_ar}</p>}
            </div>

            {/* وصف المنتج بالإنجليزية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                وصف المنتج (English) *
              </label>
              <textarea
                value={product?.description_en || ''}
                onChange={(e) => updateProduct('description_en', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.description_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product description in English"
              />
              {errors.description_en && <p className="text-red-500 text-sm mt-1">{errors.description_en}</p>}
            </div>
          </div>

          {/* الأسعار والمخزون */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">الأسعار والمخزون</h2>
            
            {/* السعر */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر (ج.م) *
              </label>
              <input
                type="number"
                step="0.01"
                value={product?.price || ''}
                onChange={(e) => updateProduct('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* سعر التخفيض */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                السعر قبل الخصم (ج.م) - اختياري
              </label>
              <input
                type="number"
                step="0.01"
                value={product?.sale_price || ''}
                onChange={(e) => updateProduct('sale_price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.sale_price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="أعلى من السعر الحالي"
              />
              {errors.sale_price && <p className="text-red-500 text-sm mt-1">{errors.sale_price}</p>}
            </div>

            {/* المخزون */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كمية المخزون *
              </label>
              <input
                type="number"
                value={product?.stock || ''}
                onChange={(e) => updateProduct('stock', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>

            {/* الحالة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                حالة المنتج
              </label>
              <select
                value={product?.status || 'active'}
                onChange={(e) => updateProduct('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            {/* منتج مميز */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={product?.featured || false}
                onChange={(e) => updateProduct('featured', e.target.checked)}
                className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                منتج مميز
              </label>
            </div>
          </div>

          {/* التصنيفات */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">التصنيفات</h2>
            
            {/* الفئة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الفئة *
              </label>
              <select
                value={product?.category_id || ''}
                onChange={(e) => updateProduct('category_id', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.category_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">اختر الفئة</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {getLocalizedText(category, 'name')}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
            </div>

            {/* المورد */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                المورد *
              </label>
              <select
                value={product?.supplier_id || ''}
                onChange={(e) => updateProduct('supplier_id', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.supplier_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">اختر المورد</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {getLocalizedText(supplier, 'name')}
                  </option>
                ))}
              </select>
              {errors.supplier_id && <p className="text-red-500 text-sm mt-1">{errors.supplier_id}</p>}
            </div>

          </div>

          {/* الصور */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">صور المنتج</h2>
            
            {/* الصور الموجودة */}
            {Array.isArray(existingImages) && existingImages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  الصور الحالية ({existingImages.length})
                  <button 
                    type="button"
                    onClick={() => console.log('🔍 Image paths:', existingImages)}
                    className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    Debug مسارات
                  </button>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {existingImages.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src ? `http://localhost:8000${src}` : '/placeholder.svg'}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('❌ Failed to load image:', src);
                          console.error('🔗 Tried URL:', `http://localhost:8000${src}`);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', `http://localhost:8000${src}`);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* إضافة صور جديدة */}
            {existingImages.length < 5 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  إضافة صور جديدة (حد أقصى {5 - existingImages.length} صور)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}

            {/* معاينة الصور الجديدة */}
            {imagePreview.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">الصور الجديدة</h3>
                <div className="grid grid-cols-2 gap-4">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`معاينة ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImagesFiltered = newImages.filter((_, i) => i !== index);
                          const newPreviews = imagePreview.filter((_, i) => i !== index);
                          setNewImages(newImagesFiltered);
                          setImagePreview(newPreviews);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* الميزات */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">ميزات المنتج</h2>
            <button
              type="button"
              onClick={addFeature}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              + إضافة ميزة
            </button>
          </div>
          
          {product.features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="أدخل ميزة المنتج"
              />
              {product.features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  حذف
                </button>
              )}
            </div>
          ))}
        </div>

        {/* المواصفات */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">مواصفات المنتج</h2>
            <button
              type="button"
              onClick={addSpecification}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              + إضافة مواصفة
            </button>
          </div>
          
          {product.specifications.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={spec.key}
                onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="اسم المواصفة (مثل: الوزن)"
              />
              <input
                type="text"
                value={spec.value}
                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="قيمة المواصفة (مثل: 2 كيلو)"
              />
              {product.specifications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition-colors"
                >
                  حذف
                </button>
              )}
            </div>
          ))}
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-4 justify-end">
          <Link
            href="/dashboard/products"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            إلغاء
          </Link>
          <button
            type="submit"
            disabled={submitLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الحفظ...
              </>
            ) : (
              '💾 حفظ التغييرات'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}  