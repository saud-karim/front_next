'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { useToast } from '@/app/context/ToastContext';
import ApiService from '@/app/services/api';
import PreviewModal from './PreviewModal';
import SocialLinksPreview from './previews/SocialLinksPreview';

interface SocialLink {
  id?: number;
  platform: string;
  url: string;
  icon: string;
  color: string;
  order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// نظام mapping بين الرموز القصيرة (للحفظ في قاعدة البيانات) والفونت أوسوم (للعرض)
const ICON_MAPPING = {
  'FB': 'fab fa-facebook',
  'IG': 'fab fa-instagram', 
  'TW': 'fab fa-twitter',
  'LI': 'fab fa-linkedin',
  'WA': 'fab fa-whatsapp',
  'TG': 'fab fa-telegram',
  'YT': 'fab fa-youtube',
  'TK': 'fab fa-tiktok',
  'SC': 'fab fa-snapchat',
  'PT': 'fab fa-pinterest',
  'WS': 'fas fa-globe',
  'CU': 'fas fa-link'
};

// دالة للحصول على فونت أوسوم من الرمز القصير
const getFontAwesomeIcon = (shortCode: string): string => {
  return ICON_MAPPING[shortCode as keyof typeof ICON_MAPPING] || 'fas fa-question';
};

// دالة للحصول على الرمز القصير من فونت أوسوم (للتوافق مع البيانات القديمة)
const getShortCodeFromFontAwesome = (fontAwesome: string): string => {
  const entry = Object.entries(ICON_MAPPING).find(([, fa]) => fa === fontAwesome);
  return entry ? entry[0] : 'CU'; // افتراضي لـ Custom
};

// قائمة منصات التواصل الاجتماعي مع الرموز القصيرة والألوان الرسمية
const SOCIAL_PLATFORMS = [
  { name: 'facebook', name_ar: 'فيسبوك', icon: 'FB', color: '#1877F2', url_prefix: 'https://facebook.com/' },
  { name: 'instagram', name_ar: 'إنستغرام', icon: 'IG', color: '#E4405F', url_prefix: 'https://instagram.com/' },
  { name: 'twitter', name_ar: 'تويتر', icon: 'TW', color: '#1DA1F2', url_prefix: 'https://twitter.com/' },
  { name: 'linkedin', name_ar: 'لينكد إن', icon: 'LI', color: '#0077B5', url_prefix: 'https://linkedin.com/company/' },
  { name: 'whatsapp', name_ar: 'واتساب', icon: 'WA', color: '#25D366', url_prefix: 'https://wa.me/' },
  { name: 'telegram', name_ar: 'تليغرام', icon: 'TG', color: '#0088CC', url_prefix: 'https://t.me/' },
  { name: 'youtube', name_ar: 'يوتيوب', icon: 'YT', color: '#FF0000', url_prefix: 'https://youtube.com/' },
  { name: 'tiktok', name_ar: 'تيك توك', icon: 'TK', color: '#000000', url_prefix: 'https://tiktok.com/' },
  { name: 'snapchat', name_ar: 'سناب شات', icon: 'SC', color: '#FFFC00', url_prefix: 'https://snapchat.com/add/' },
  { name: 'pinterest', name_ar: 'بينتريست', icon: 'PT', color: '#BD081C', url_prefix: 'https://pinterest.com/' },
  { name: 'website', name_ar: 'الموقع الرسمي', icon: 'WS', color: '#6366F1', url_prefix: 'https://' },
  { name: 'custom', name_ar: 'مخصص', icon: 'CU', color: '#6B7280', url_prefix: '' }
];

export default function SocialLinksTab({ loading, setLoading }: Props) {
  const { language } = useLanguage();
  const toast = useToast();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [newLink, setNewLink] = useState<Partial<SocialLink>>({
    platform: '',
    url: '',
    icon: 'CU', // رمز قصير افتراضي
    color: '#6B7280',
    order: 1,
    is_active: true
  });

  // تحميل الروابط الاجتماعية
  const loadSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getSocialLinks();
      
      if (response.data && Array.isArray(response.data)) {
        // تحويل FontAwesome strings إلى short codes للتوافق مع النظام الجديد
        const normalizedData = response.data.map(link => ({
          ...link,
          icon: link.icon.startsWith('fa') ? getShortCodeFromFontAwesome(link.icon) : link.icon
        }));
        setSocialLinks(normalizedData);
      } else {
        setSocialLinks([]);
      }
    } catch (error) {
      console.error('Error loading social links:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ في تحميل الروابط الاجتماعية';
      toast.error('خطأ', errorMessage);
      setSocialLinks([]);
    } finally {
      setLoading(false);
    }
  };

  // اختيار منصة جاهزة
  const handlePlatformSelect = (platformName: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.name === platformName);
    if (platform) {
      setSelectedPlatform(platformName);
      setNewLink(prev => ({
        ...prev,
        platform: platform.name,
        icon: platform.icon,
        color: platform.color,
        url: platform.url_prefix
      }));
    }
  };

  // إضافة رابط جديد
  const handleAddLink = async () => {
    try {
      if (!newLink.platform || !newLink.url || !newLink.icon || !newLink.color) {
        toast.error('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
        return;
    }

      setSaving(true);
      const linkData = {
        platform: newLink.platform,
        url: newLink.url,
        icon: newLink.icon,
        color: newLink.color,
        order: newLink.order || 1,
        is_active: newLink.is_active || true
      };
      await ApiService.createSocialLink(linkData);
      
      toast.success('نجح', 'تم إضافة الرابط بنجاح');
      setShowAddForm(false);
      resetForm();
      await loadSocialLinks();
    } catch (error: any) {
      console.error('Error creating social link:', error);
      toast.error('خطأ', error.message || 'خطأ في إضافة الرابط');
    } finally {
      setSaving(false);
    }
  };

  // حذف رابط
  const handleDeleteLink = async (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا الرابط؟' : 'Are you sure you want to delete this link?')) {
      return;
    }

    try {
      setSaving(true);
      await ApiService.deleteSocialLink(id);
      
      toast.success('نجح', 'تم حذف الرابط بنجاح');
      await loadSocialLinks();
    } catch (error: any) {
      console.error('Error deleting social link:', error);
      toast.error('خطأ', error.message || 'خطأ في حذف الرابط');
    } finally {
      setSaving(false);
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setSelectedPlatform('');
    setNewLink({
      platform: '',
      url: '',
      icon: 'CU', // رمز قصير افتراضي
      color: '#6B7280',
      order: socialLinks.length + 1,
      is_active: true
    });
  };

  useEffect(() => {
    loadSocialLinks();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {language === 'ar' ? 'الروابط الاجتماعية' : 'Social Links'}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {language === 'ar' ? 'إدارة روابط مواقع التواصل الاجتماعي' : 'Manage social media links'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <span>👁️</span>
            <span>{language === 'ar' ? 'معاينة' : 'Preview'}</span>
          </button>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          + {language === 'ar' ? 'إضافة رابط' : 'Add Link'}
        </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🔗</span>
            <div>
              <div className="text-2xl font-bold text-blue-600">{socialLinks.length}</div>
              <div className="text-sm text-blue-600">{language === 'ar' ? 'إجمالي الروابط' : 'Total Links'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {socialLinks.filter(link => link.is_active).length}
              </div>
              <div className="text-sm text-green-600">{language === 'ar' ? 'نشطة' : 'Active'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🌟</span>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {new Set(socialLinks.map(link => link.platform)).size}
              </div>
              <div className="text-sm text-purple-600">{language === 'ar' ? 'منصات مختلفة' : 'Platforms'}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-3">📊</span>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {socialLinks.filter(link => link.order <= 3).length}
              </div>
              <div className="text-sm text-orange-600">{language === 'ar' ? 'مميزة' : 'Featured'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {language === 'ar' ? 'إضافة رابط جديد' : 'Add New Link'}
          </h3>

          {/* Platform Selection */}
          <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'المنصة' : 'Platform'}
              </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {SOCIAL_PLATFORMS.slice(0, 9).map((platform) => (
                <button
                  key={platform.name}
                  type="button"
                  onClick={() => handlePlatformSelect(platform.name)}
                  className={`flex items-center space-x-2 p-3 rounded-md border transition-colors ${
                    selectedPlatform === platform.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: selectedPlatform === platform.name ? undefined : platform.color + '10' }}
                >
                                     <i className={`${getFontAwesomeIcon(platform.icon)} text-lg`} style={{ color: platform.color }}></i>
                  <span className="text-sm">{language === 'ar' ? platform.name_ar : platform.name}</span>
                </button>
              ))}
            </div>
            <select
              value={selectedPlatform}
              onChange={(e) => handlePlatformSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{language === 'ar' ? 'اختر منصة...' : 'Select platform...'}</option>
              {SOCIAL_PLATFORMS.map((platform) => (
                <option key={platform.name} value={platform.name}>
                  {language === 'ar' ? platform.name_ar : platform.name}
                </option>
              ))}
            </select>
          </div>

          {/* URL Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رابط URL' : 'URL'}
              </label>
              <input
                type="url"
                value={newLink.url || ''}
                onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الترتيب' : 'Order'}
              </label>
              <input
                type="number"
                value={newLink.order || 0}
                onChange={(e) => setNewLink(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => {
                setShowAddForm(false);
                resetForm();
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={() => resetForm()}
              className="px-4 py-2 text-blue-600 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 transition-colors"
            >
              {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
            </button>
            <button
              onClick={handleAddLink}
              disabled={saving || !newLink.platform || !newLink.url}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? 'حفظ' : 'Save')}
            </button>
          </div>
        </div>
      )}

      {/* Social Links List */}
      <div className="bg-white rounded-lg border">
        {socialLinks.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">🔗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'لا توجد روابط اجتماعية' : 'No social links'}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {language === 'ar' ? 'ابدأ بإضافة أول رابط اجتماعي' : 'Start by adding your first social link'}
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialLinks
                .sort((a, b) => a.order - b.order)
                .map((link) => (
                <div key={link.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: link.color }}
                      >
                        <i className={`${getFontAwesomeIcon(link.icon)} text-lg`}></i>
                      </div>
                  <div>
                        <h4 className="font-medium text-gray-900 capitalize">{link.platform}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        link.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {link.is_active ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                      </span>
                          <span className="text-xs text-gray-500">#{link.order}</span>
                    </div>
                  </div>
                </div>
                  <button
                    onClick={() => handleDeleteLink(link.id!)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title={language === 'ar' ? 'حذف' : 'Delete'}
                  >
                      🗑️
                  </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 truncate" title={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      {link.url}
                    </a>
                  </div>
                </div>
              ))}
              </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={language === 'ar' ? 'معاينة الروابط الاجتماعية' : 'Social Links Preview'}
      >
        <SocialLinksPreview data={socialLinks} />
      </PreviewModal>
    </div>
  );
} 