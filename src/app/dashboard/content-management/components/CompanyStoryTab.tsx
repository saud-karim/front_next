'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';
import PreviewModal from './PreviewModal';
import CompanyStoryPreview from './previews/CompanyStoryPreview';

interface CompanyStoryData {
  id?: number;
  paragraph1_ar: string;
  paragraph1_en: string;
  paragraph2_ar: string;
  paragraph2_en: string;
  paragraph3_ar: string;
  paragraph3_en: string;
  features: Array<{
    name_ar: string;
    name_en: string;
  }>;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function CompanyStoryTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [data, setData] = useState<CompanyStoryData>({
    paragraph1_ar: 'تأسست شركتنا في عام 2009 بهدف تقديم أفضل أدوات ومواد البناء',
    paragraph1_en: 'Our company was founded in 2009 with the goal of providing the best construction tools and materials',
    paragraph2_ar: 'على مدار السنوات، نمت الشركة وتطورت لتصبح واحدة من الشركات الرائدة',
    paragraph2_en: 'Over the years, the company has grown and evolved to become one of the leading companies',
    paragraph3_ar: 'اليوم، نخدم آلاف العملاء ونفتخر بالثقة التي وضعوها فينا',
    paragraph3_en: 'Today, we serve thousands of customers and take pride in the trust they have placed in us',
    features: [
      { name_ar: 'جودة عالية', name_en: 'High Quality' },
      { name_ar: 'خدمة مميزة', name_en: 'Excellent Service' }
    ]
  });
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log('📖 Loading real Company Story data from API...');
      const response = await ApiService.getCompanyStory();
      
      if (response.success && response.data) {
        setData(response.data);
      }
    } catch (error: any) {
      toast.error('خطأ', error.message || 'خطأ في تحميل قصة الشركة');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await ApiService.updateCompanyStory(data);
      
      if (response.success) {
        toast.success(
          language === 'ar' ? 'نجح الحفظ' : 'Success',
          language === 'ar' ? 'تم حفظ قصة الشركة بنجاح' : 'Company story saved successfully'
        );
        if (response.data) {
          setData(response.data);
        }
      } else {
        throw new Error(response.message || 'Failed to save company story');
      }
    } catch (error: any) {
      toast.error('خطأ', error.message || 'خطأ في حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CompanyStoryData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateFeature = (index: number, field: 'name_ar' | 'name_en', value: string) => {
    setData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const addFeature = () => {
    setData(prev => ({
      ...prev,
      features: [...prev.features, { name_ar: '', name_en: '' }]
    }));
  };

  const removeFeature = (index: number) => {
    setData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Story Paragraphs */}
      <div className="space-y-6">
        {/* Paragraph 1 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ar' ? 'الفقرة الأولى' : 'First Paragraph'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بالعربية' : 'In Arabic'}
              </label>
              <textarea
                value={data.paragraph1_ar}
                onChange={(e) => updateField('paragraph1_ar', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بالإنجليزية' : 'In English'}
              </label>
              <textarea
                value={data.paragraph1_en}
                onChange={(e) => updateField('paragraph1_en', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Paragraph 2 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ar' ? 'الفقرة الثانية' : 'Second Paragraph'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بالعربية' : 'In Arabic'}
              </label>
              <textarea
                value={data.paragraph2_ar}
                onChange={(e) => updateField('paragraph2_ar', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بالإنجليزية' : 'In English'}
              </label>
              <textarea
                value={data.paragraph2_en}
                onChange={(e) => updateField('paragraph2_en', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Paragraph 3 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'ar' ? 'الفقرة الثالثة' : 'Third Paragraph'}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بالعربية' : 'In Arabic'}
              </label>
              <textarea
                value={data.paragraph3_ar}
                onChange={(e) => updateField('paragraph3_ar', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بالإنجليزية' : 'In English'}
              </label>
              <textarea
                value={data.paragraph3_en}
                onChange={(e) => updateField('paragraph3_en', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'ar' ? 'المميزات' : 'Features'}
            </h3>
            <button
              onClick={addFeature}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              + {language === 'ar' ? 'إضافة مميزة' : 'Add Feature'}
            </button>
          </div>
          <div className="space-y-4">
            {data.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-md border">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'}
                    value={feature.name_ar}
                    onChange={(e) => updateFeature(index, 'name_ar', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder={language === 'ar' ? 'الاسم بالإنجليزية' : 'Name in English'}
                    value={feature.name_en}
                    onChange={(e) => updateFeature(index, 'name_en', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end space-x-3">
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          <span>👁️</span>
          <span>{language === 'ar' ? 'معاينة' : 'Preview'}</span>
        </button>
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

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={language === 'ar' ? 'معاينة قصة الشركة' : 'Company Story Preview'}
      >
        <CompanyStoryPreview data={[]} />
      </PreviewModal>
    </div>
  );
} 