'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { ApiService } from '../../services/api';
import Link from 'next/link';

interface Category {
  id: number;
  name: string;
  description?: string;
  image?: string;
  status: 'active' | 'inactive';
  sort_order: number;
  products_count: number;
  full_path: string;
  created_at: string;
  updated_at: string;
}

interface CategoryFormData {
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  status: 'active' | 'inactive';
  sort_order: number;
}

export default function CategoriesPage() {
  const { t, language, getLocalizedText } = useLanguage();
  const { success, error, warning } = useToast();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{[key: number]: string}>({});
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form data
  const [formData, setFormData] = useState<CategoryFormData>({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    status: 'active',
    sort_order: 0
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    with_products: 0
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAdminCategories();
      console.log('📂 Categories API Response:', response);
      
      if (response.data && Array.isArray(response.data)) {
        console.log('📂 Categories fetched:', response.data.length, 'items');
        setCategories(response.data);
        
        // Calculate stats
        const total = response.data.length;
        const active = response.data.filter(c => c.status === 'active').length;
        const inactive = response.data.filter(c => c.status === 'inactive').length;
        const with_products = response.data.filter(c => c.products_count > 0).length;
        
        setStats({ total, active, inactive, with_products });
      } else {
        console.warn('⚠️ Categories response format unexpected:', response);
        setCategories([]);
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      error(t('common.error'), t('admin.categories.error.fetch'));
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      setActionLoading({ ...actionLoading, create: 'creating' });
      
      const response = await ApiService.createCategory(formData);
      
      if (response.success) {
        success(t('common.success'), t('admin.categories.success.create'));
        setShowForm(false);
        resetForm();
        fetchCategories();
      }
    } catch (err) {
      console.error('❌ Error creating category:', err);
      error(t('common.error'), t('admin.categories.error.create'));
    } finally {
      setActionLoading({ ...actionLoading, create: '' });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    try {
      setActionLoading({ ...actionLoading, [editingCategory.id]: 'updating' });
      
      const response = await ApiService.updateCategory(editingCategory.id, formData);
      
      if (response.success) {
        success(t('common.success'), t('admin.categories.success.update'));
        setShowForm(false);
        setEditingCategory(null);
        resetForm();
        fetchCategories();
      }
    } catch (err) {
      console.error('❌ Error updating category:', err);
      error(t('common.error'), t('admin.categories.error.update'));
    } finally {
      setActionLoading({ ...actionLoading, [editingCategory.id]: '' });
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm(t('admin.categories.delete.confirm'))) return;
    
    try {
      setActionLoading({ ...actionLoading, [categoryId]: 'deleting' });
      
      const response = await ApiService.deleteCategory(categoryId);
      
      if (response.success) {
        success(t('common.success'), t('admin.categories.success.delete'));
        fetchCategories();
      }
    } catch (err) {
      console.error('❌ Error deleting category:', err);
      error(t('common.error'), t('admin.categories.error.delete'));
    } finally {
      setActionLoading({ ...actionLoading, [categoryId]: '' });
    }
  };

  const toggleCategoryStatus = async (categoryId: number, currentStatus: string) => {
    try {
      setActionLoading({ ...actionLoading, [categoryId]: 'status' });
      
      const response = await ApiService.toggleCategoryStatus(categoryId);
      
      if (response.success) {
        success(t('common.success'), t('admin.categories.success.status'));
        fetchCategories();
      }
    } catch (err) {
      console.error('❌ Error updating category status:', err);
      error(t('common.error'), t('admin.categories.error.status'));
    } finally {
      setActionLoading({ ...actionLoading, [categoryId]: '' });
    }
  };

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      status: 'active',
      sort_order: 0
    });
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name_ar: (category as any).name_ar || category.name || '',
      name_en: (category as any).name_en || category.name || '',
      description_ar: (category as any).description_ar || category.description || '',
      description_en: (category as any).description_en || category.description || '',
      status: category.status,
      sort_order: category.sort_order
    });
    setShowForm(true);
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = searchTerm === '' || 
      getLocalizedText(category, 'name').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || category.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.categories.title')}</h1>
            <p className="text-gray-600 mt-2">{t('admin.categories.subtitle')}</p>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              resetForm();
              setShowForm(true);
            }}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
          >
            ➕ {t('admin.categories.add')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">{t('admin.categories.stats.total')}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">{t('admin.categories.stats.active')}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-red-600">{stats.inactive}</div>
            <div className="text-sm text-gray-600">{t('admin.categories.stats.inactive')}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-purple-600">{stats.with_products}</div>
            <div className="text-sm text-gray-600">{t('admin.categories.stats.with.products')}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.categories.search')}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('admin.categories.search.placeholder')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.categories.status')}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">{t('admin.categories.all.statuses')}</option>
                <option value="active">{t('admin.categories.active.status')}</option>
                <option value="inactive">{t('admin.categories.inactive.status')}</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                🔄 {t('admin.categories.clear.filters')}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('admin.categories.no.categories')}</h3>
            <p className="text-gray-600 mb-6">{t('admin.categories.no.categories.desc')}</p>
            <button
              onClick={() => {
                setEditingCategory(null);
                resetForm();
                setShowForm(true);
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('admin.categories.add.first')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                
                {/* Category Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {getLocalizedText(category, 'name')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ID: {category.id}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      category.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.status === 'active' ? t('admin.categories.active.status') : t('admin.categories.inactive.status')}
                    </span>
                  </div>
                </div>

                {/* Category Description */}
                {getLocalizedText(category, 'description') && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {getLocalizedText(category, 'description')}
                  </p>
                )}

                {/* Category Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{category.products_count}</div>
                    <div className="text-xs text-gray-600">{t('admin.categories.products')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{category.sort_order}</div>
                    <div className="text-xs text-gray-600">{t('admin.categories.sort.order')}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditForm(category)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    ✏️ {t('admin.categories.edit')}
                  </button>
                  <button
                    onClick={() => toggleCategoryStatus(category.id, category.status)}
                    disabled={actionLoading[category.id] === 'status'}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      category.status === 'active'
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {actionLoading[category.id] === 'status' 
                      ? t('admin.categories.loading') 
                      : category.status === 'active' 
                        ? '⏸️' 
                        : '▶️'
                    }
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    disabled={actionLoading[category.id] === 'deleting'}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    {actionLoading[category.id] === 'deleting' ? t('admin.categories.deleting') : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? t('admin.categories.edit.title') : t('admin.categories.add.title')}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Arabic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.categories.name.ar')}
                </label>
                <input
                  type="text"
                  value={formData.name_ar}
                  onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={t('admin.categories.name.ar.placeholder')}
                />
              </div>

              {/* English Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.categories.name.en')}
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={t('admin.categories.name.en.placeholder')}
                />
              </div>

              {/* Arabic Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.categories.description.ar')}
                </label>
                <textarea
                  value={formData.description_ar}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={t('admin.categories.description.ar.placeholder')}
                />
              </div>

              {/* English Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.categories.description.en')}
                </label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={t('admin.categories.description.en.placeholder')}
                />
              </div>

              {/* Status and Sort Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.categories.status')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="active">{t('admin.categories.active.status')}</option>
                    <option value="inactive">{t('admin.categories.inactive.status')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.categories.sort.order')}
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="p-6 border-t border-gray-200 flex space-x-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('admin.categories.cancel')}
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                disabled={!formData.name_ar || !formData.name_en}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingCategory ? t('admin.categories.update') : t('admin.categories.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 