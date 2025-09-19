'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';

interface PageContentData {
  id?: number;
  about_page: {
    badge_ar: string;
    badge_en: string;
    title_ar: string;
    title_en: string;
    subtitle_ar: string;
    subtitle_en: string;
  };
  contact_page: {
    badge_ar: string;
    badge_en: string;
    title_ar: string;
    title_en: string;
    subtitle_ar: string;
    subtitle_en: string;
  };
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function PageContentTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [data, setData] = useState<PageContentData>({
    about_page: {
      badge_ar: 'من نحن',
      badge_en: 'About Us',
      title_ar: 'نبني المستقبل معاً',
      title_en: 'Building the Future Together',
      subtitle_ar: 'شركة رائدة في مجال أدوات ومواد البناء',
      subtitle_en: 'A leading company in construction tools and materials'
    },
    contact_page: {
      badge_ar: 'تواصل معنا',
      badge_en: 'Contact Us', 
      title_ar: 'اتصل بنا',
      title_en: 'Contact Us',
      subtitle_ar: 'نحن هنا لمساعدتك. تواصل معنا في أي وقت',
      subtitle_en: 'We\'re here to help you. Contact us anytime'
    }
  });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📄 Loading real Page Content data from API...');
      const response = await ApiService.getPageContent();
      
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل بيانات محتوى الصفحات';
      toast.error('خطأ', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await ApiService.updatePageContent(data);
      
      if (response.success) {
        toast.success(
          language === 'ar' ? 'نجح الحفظ' : 'Success',
          language === 'ar' ? 'تم حفظ محتوى الصفحات بنجاح' : 'Page content saved successfully'
        );
        if (response.data) {
          setData(response.data);
        }
      } else {
        throw new Error(response.message || 'Failed to save page content');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في حفظ البيانات';
      toast.error('خطأ', errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const updatePageField = (page: 'about_page' | 'contact_page', field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* About Page Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📄</span>
            {language === 'ar' ? 'صفحة من نحن' : 'About Us Page'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شارة (عربي)' : 'Badge (Arabic)'}
                </label>
                <input
                  type="text"
                  value={data.about_page.badge_ar}
                  onChange={(e) => updatePageField('about_page', 'badge_ar', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شارة (انجليزي)' : 'Badge (English)'}
                </label>
                <input
                  type="text"
                  value={data.about_page.badge_en}
                  onChange={(e) => updatePageField('about_page', 'badge_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={data.about_page.title_ar}
                  onChange={(e) => updatePageField('about_page', 'title_ar', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (انجليزي)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={data.about_page.title_en}
                  onChange={(e) => updatePageField('about_page', 'title_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}
                </label>
                <textarea
                  value={data.about_page.subtitle_ar}
                  onChange={(e) => updatePageField('about_page', 'subtitle_ar', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان الفرعي (انجليزي)' : 'Subtitle (English)'}
                </label>
                <textarea
                  value={data.about_page.subtitle_en}
                  onChange={(e) => updatePageField('about_page', 'subtitle_en', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Page Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📞</span>
            {language === 'ar' ? 'صفحة اتصل بنا' : 'Contact Us Page'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شارة (عربي)' : 'Badge (Arabic)'}
                </label>
                <input
                  type="text"
                  value={data.contact_page.badge_ar}
                  onChange={(e) => updatePageField('contact_page', 'badge_ar', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'شارة (انجليزي)' : 'Badge (English)'}
                </label>
                <input
                  type="text"
                  value={data.contact_page.badge_en}
                  onChange={(e) => updatePageField('contact_page', 'badge_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={data.contact_page.title_ar}
                  onChange={(e) => updatePageField('contact_page', 'title_ar', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان (انجليزي)' : 'Title (English)'}
                </label>
                <input
                  type="text"
                  value={data.contact_page.title_en}
                  onChange={(e) => updatePageField('contact_page', 'title_en', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}
                </label>
                <textarea
                  value={data.contact_page.subtitle_ar}
                  onChange={(e) => updatePageField('contact_page', 'subtitle_ar', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'العنوان الفرعي (انجليزي)' : 'Subtitle (English)'}
                </label>
                <textarea
                  value={data.contact_page.subtitle_en}
                  onChange={(e) => updatePageField('contact_page', 'subtitle_en', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
            </>
          ) : (
            <>
              💾 {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </>
          )}
        </button>
      </div>
    </div>
  );
} 