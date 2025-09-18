'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { ApiService } from '../../../services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Category } from '../../../types/api';

interface ProductForm {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: string;
  sale_price: string;
  stock: string;
  category_id: string;
  status: 'active' | 'inactive';
  featured: boolean;
  images: File[];
  features: string[];
  specifications: { key: string; value: string }[];
}

export default function NewProductPage() {
  const { t, language, getLocalizedText } = useLanguage();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  
  const [form, setForm] = useState<ProductForm>({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: '',
    sale_price: '',
    stock: '',
    category_id: '',
    status: 'active',
    featured: false,
    images: [],
    features: [''],
    specifications: [{ key: '', value: '' }]
  });

  // جلب البيانات المرجعية
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesRes = await ApiService.getAdminCategories({ lang: language });
        
        console.log('🏷️ Categories Response:', categoriesRes);
        
        if (categoriesRes.success) {
          console.log('✅ Categories data:', categoriesRes.data);
          setCategories(categoriesRes.data);
        } else {
          console.error('❌ Failed to fetch categories:', categoriesRes);
        }
      } catch (error) {
        console.error(t('admin.product.console.data.error'), ':', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // تنظيف الذاكرة عند الخروج من الصفحة
  useEffect(() => {
    return () => {
      // تنظيف جميع الـ Object URLs عند مغادرة الصفحة
      imagePreview.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
          console.log('🧹 Cleaned up object URL:', url);
        }
      });
    };
  }, [imagePreview]);

  // ✅ Data URL للـ fallback النهائي (صغيرة جداً)
  const getDataUrlPlaceholder = (): string => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiM5Q0EzQUYiPjAx8J+Tpo8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiPtmE2Kcg2KrZiNis2K8g2LXZiNix2KktL3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjY0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Q0EzQUYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
  };

  // تحديث الحقول
  const updateForm = (field: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // معالجة الصور
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert(t('admin.product.image.max.limit'));
      return;
    }

    // تنظيف الـ URLs القديمة أولاً لتجنب memory leaks
    imagePreview.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

    updateForm('images', files);
    
    // إنشاء معاينة للصور
    const previews = files.map((file, index) => {
      try {
        console.log(`🔗 Creating preview URL for file ${index + 1}: ${file.name} (${file.size} bytes)`);
        return URL.createObjectURL(file);
      } catch (error) {
        console.error('❌ Failed to create object URL for file:', file.name, error);
        console.log('🔄 Using placeholder fallback for failed preview');
        return '/placeholder.svg'; // fallback إذا فشل createObjectURL
      }
    });
    setImagePreview(previews);
  };

  // إضافة ميزة جديدة
  const addFeature = () => {
    updateForm('features', [...form.features, '']);
  };

  // حذف ميزة
  const removeFeature = (index: number) => {
    const newFeatures = form.features.filter((_, i) => i !== index);
    updateForm('features', newFeatures);
  };

  // تحديث ميزة
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    updateForm('features', newFeatures);
  };

  // إضافة مواصفة جديدة
  const addSpecification = () => {
    updateForm('specifications', [...form.specifications, { key: '', value: '' }]);
  };

  // حذف مواصفة
  const removeSpecification = (index: number) => {
    const newSpecs = form.specifications.filter((_, i) => i !== index);
    updateForm('specifications', newSpecs);
  };

  // تحديث مواصفة
  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...form.specifications];
    newSpecs[index][field] = value;
    updateForm('specifications', newSpecs);
  };

  // التحقق من صحة النموذج
  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!form.name_ar.trim()) newErrors.name_ar = t('admin.product.validation.name.ar');
    if (!form.name_en.trim()) newErrors.name_en = t('admin.product.validation.name.en');
    if (!form.description_ar.trim()) newErrors.description_ar = t('admin.product.validation.desc.ar');
    if (!form.description_en.trim()) newErrors.description_en = t('admin.product.validation.desc.en');
    if (!form.price.trim()) newErrors.price = t('admin.product.validation.price');
    if (!form.stock.trim()) newErrors.stock = t('admin.product.validation.stock');
    if (!form.category_id) newErrors.category_id = t('admin.product.validation.category');

    // التحقق من الأرقام
    if (form.price && isNaN(Number(form.price))) {
      newErrors.price = t('admin.product.validation.price.number');
    }
    if (form.sale_price && isNaN(Number(form.sale_price))) {
              newErrors.sale_price = t('admin.product.error.sale.price');
    }
    if (form.stock && isNaN(Number(form.stock))) {
              newErrors.stock = t('admin.product.validation.stock.number.new');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      // تحقق من وجود صور واختبر FormData
      const hasImages = form.images.length > 0;
      
      if (hasImages) {
        // محاولة رفع مع FormData
        console.log('📷 Images detected, trying FormData upload...');
        
        const formData = new FormData();
        
        // إضافة البيانات الأساسية
        formData.append('name_ar', form.name_ar);
        formData.append('name_en', form.name_en);
        formData.append('description_ar', form.description_ar);
        formData.append('description_en', form.description_en);
        formData.append('price', form.price);
        formData.append('sale_price', form.sale_price || '');
        formData.append('original_price', ''); // WORKAROUND: Backend forces this despite DB error
        formData.append('stock', form.stock);
        formData.append('category_id', form.category_id);
        formData.append('supplier_id', '6'); // Default supplier_id
        formData.append('brand_id', '1'); // Default brand_id as required by database
        formData.append('status', form.status);
        formData.append('featured', form.featured ? '1' : '0'); // Fixed: Laravel expects '1'/'0' for boolean in FormData
        
        // إضافة features و specifications كـ JSON strings
        formData.append('features', JSON.stringify(form.features.filter(f => f.trim())));
        formData.append('specifications', JSON.stringify(form.specifications.filter(s => s.key.trim() && s.value.trim())));
        
        // إضافة الصور (Fixed: Use indexed format as per API documentation)
        form.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });

        console.log('📤 Sending FormData with images:', form.images.length);
        
        try {
          const response = await ApiService.createProductWithFiles(formData);
          console.log('✅ FormData response:', response);
          
          if (response && response.success) {
            alert(t('admin.product.success.add.with.images'));
            router.push('/dashboard/products');
            return;
          } else {
            throw new Error(response?.message || 'FormData failed');
          }
        } catch (formDataError) {
          console.error('❌ FormData upload failed:', formDataError);
          console.log('⚠️ Falling back to JSON without images...');
          
          // عرض تحذير وإكمال بدون صور
          const proceed = confirm(
            t('admin.product.image.upload.failed') + '\n' +
            t('admin.product.images.later')
          );
          
          if (!proceed) {
            setSubmitLoading(false);
            return;
          }
        }
      }
      
      // JSON fallback (بدون صور أو في حالة فشل FormData)
      const productData = {
        name_ar: form.name_ar,
        name_en: form.name_en,
        description_ar: form.description_ar,
        description_en: form.description_en,
        price: Number(form.price),
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        original_price: null, // WORKAROUND: Backend forces this despite it not existing in DB
        stock: Number(form.stock),
        category_id: Number(form.category_id),
        supplier_id: 6, // Default supplier_id
        brand_id: 1, // Default brand_id as required by database
        status: form.status,
        featured: form.featured,
        features: JSON.stringify(form.features.filter(f => f.trim())),
        specifications: JSON.stringify(form.specifications.filter(s => s.key.trim() && s.value.trim())),
        images: [] // بدون صور
      };

      console.log('📤 Sending JSON data (no images):', {
        ...productData,
        skipped_images: hasImages ? `${form.images.length} images` : '0 images'
      });
      
      const response = await ApiService.createProduct(productData);
      console.log('📥 Create product response:', response);

      if (response && response.success) {
        alert(t('admin.product.success.add'));
        router.push('/dashboard/products');
      } else {
        alert(t('admin.product.error.add') + ': ' + (response.message || t('admin.product.error.unknown')));
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert(t('admin.product.error.add'));
    } finally {
      setSubmitLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.product.add.title')}</h1>
          <p className="text-gray-600 mt-1">{t('admin.product.add.subtitle')}</p>
        </div>
        <Link
          href="/dashboard/products"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
{t('admin.product.back')}
        </Link>
      </div>

      {/* النموذج */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('admin.product.basic.info')}</h2>
            
            {/* اسم المنتج بالعربية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.name.ar')} *
              </label>
              <input
                type="text"
                value={form.name_ar}
                onChange={(e) => updateForm('name_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.name_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('admin.product.placeholder.name.ar.example')}
              />
              {errors.name_ar && <p className="text-red-500 text-sm mt-1">{errors.name_ar}</p>}
            </div>

            {/* اسم المنتج بالإنجليزية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.name.en')} *
              </label>
              <input
                type="text"
                value={form.name_en}
                onChange={(e) => updateForm('name_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.name_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('admin.product.placeholder.name.en.example')}
              />
              {errors.name_en && <p className="text-red-500 text-sm mt-1">{errors.name_en}</p>}
            </div>

            {/* وصف المنتج بالعربية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.desc.ar')} *
              </label>
              <textarea
                value={form.description_ar}
                onChange={(e) => updateForm('description_ar', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.description_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('admin.product.placeholder.desc.detailed')}
              />
              {errors.description_ar && <p className="text-red-500 text-sm mt-1">{errors.description_ar}</p>}
            </div>

            {/* وصف المنتج بالإنجليزية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.desc.en')} *
              </label>
              <textarea
                value={form.description_en}
                onChange={(e) => updateForm('description_en', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.description_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('admin.product.placeholder.desc.detailed')}
              />
              {errors.description_en && <p className="text-red-500 text-sm mt-1">{errors.description_en}</p>}
            </div>
          </div>

          {/* معلومات السعر والمخزون */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('admin.product.price.stock')}</h2>
            
            {/* السعر */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
{t('admin.product.field.price')} *
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => updateForm('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('admin.product.placeholder.price')}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* سعر التخفيض */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.product.field.original.price')}
              </label>
              <input
                type="number"
                step="0.01"
                value={form.sale_price}
                onChange={(e) => updateForm('sale_price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={t('admin.product.price.higher')}
              />
            </div>

            {/* الكمية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
{t('admin.product.field.stock.quantity')} *
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => updateForm('stock', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder={t('admin.product.placeholder.stock')}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>

            {/* الحالة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
{t('admin.product.field.status')}
              </label>
              <select
                value={form.status}
                onChange={(e) => updateForm('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="active">{t('admin.product.status.active')}</option>
                <option value="inactive">{t('admin.product.status.inactive')}</option>
              </select>
            </div>

            {/* مميز */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => updateForm('featured', e.target.checked)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="featured" className="mr-2 text-sm font-medium text-gray-700">
{t('admin.product.field.featured')}
              </label>
            </div>

            {/* الفئة */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
{t('admin.product.field.category')} *
              </label>
              <select
                value={form.category_id}
                onChange={(e) => updateForm('category_id', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.category_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">{t('admin.product.select.category')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {getLocalizedText(category, 'name')}
                  </option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
            </div>
          </div>
        </div>

        {/* الصور */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">{t('admin.product.images')}</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رفع الصور (حد أقصى 5 صور)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* معاينة الصور */}
          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {imagePreview.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                                          alt={t('admin.product.preview.alt').replace('{number}', (index + 1).toString())}
                    className="w-full h-32 object-cover rounded-lg transition-opacity duration-300"
                    loading="lazy"
                    onError={(e) => {
                      console.error('❌ New Product: Failed to load image preview:', src);
                      
                      // محاولة استخدام placeholder.svg أولاً
                      if (e.currentTarget.src !== `${window.location.origin}/placeholder.svg`) {
                        console.log('🔄 Trying placeholder.svg fallback...');
                        e.currentTarget.src = '/placeholder.svg';
                        return;
                      }
                      
                      // إذا فشل placeholder.svg كمان، استخدم HTML fallback
                      console.warn('⚠️ Placeholder.svg also failed, using HTML fallback');
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-32 flex items-center justify-center bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                            <div class="text-center p-4">
                              <div class="text-4xl mb-2">🖼️</div>
                              <div className="text-sm font-medium text-gray-600">{t('admin.product.preview.failed')}</div>
                              <div className="text-xs text-gray-500 mt-1">{language === 'ar' ? 'فشل في المعاينة' : 'Preview failed'}</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                    onLoad={(e) => {
                      const loadedSrc = e.currentTarget.src;
                      
                      if (loadedSrc.includes('placeholder.svg')) {
                        console.log('📦 New Product: Placeholder image loaded (preview failed)');
                        console.log(`🔗 Original failed src: "${src}"`);
                      } else {
                        console.log('✅ New Product: Image preview loaded successfully!');
                        console.log(`🔗 Preview URL: "${src}"`);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = form.images.filter((_, i) => i !== index);
                      const newPreviews = imagePreview.filter((_, i) => i !== index);
                      updateForm('images', newImages);
                      setImagePreview(newPreviews);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* المميزات */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{t('admin.product.features.section')}</h2>
            <button
              type="button"
              onClick={addFeature}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
{t('admin.product.features.add')}
            </button>
          </div>
          
          <div className="space-y-2">
            {form.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={t('admin.product.feature.number').replace('{number}', (index + 1).toString())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                  >
                    {language === 'ar' ? 'حذف' : 'Delete'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* المواصفات */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">{t('admin.product.specs.section')}</h2>
            <button
              type="button"
              onClick={addSpecification}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
{t('admin.product.specs.add')}
            </button>
          </div>
          
          <div className="space-y-2">
            {form.specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                                      placeholder={t('admin.product.placeholder.spec.name.simple')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    placeholder={t('admin.product.placeholder.spec.value.simple')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {form.specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                    >
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* أزرار الحفظ */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/products"
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {t('admin.button.cancel')}
          </Link>
          <button
            type="submit"
            disabled={submitLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
{t('admin.product.saving')}
              </>
            ) : (
              `💾 ${t('admin.product.create')}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 