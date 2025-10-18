'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/context/LanguageContext';

interface ShippingField {
  id: string;
  label_en: string;
  label_ar: string;
  category: 'order' | 'customer' | 'items' | 'address' | 'payment';
  field_path: string; // e.g., "order.order_number", "customer.name", "items[].product.name"
  enabled: boolean;
  required: boolean;
}

interface ShippingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ShippingConfiguration) => void;
  currentConfig?: ShippingConfiguration;
}

export interface ShippingConfiguration {
  company: string; // 'bosta', 'aramex', 'dhl', 'custom'
  custom_api_url?: string; // للشركات المخصصة
  custom_api_key?: string;
  fields: ShippingField[];
}

const AVAILABLE_FIELDS: ShippingField[] = [
  // 📦 Order Fields
  {
    id: 'order_id',
    label_en: 'Order ID',
    label_ar: 'معرف الطلب',
    category: 'order',
    field_path: 'order.id',
    enabled: true,
    required: true,
  },
  {
    id: 'order_number',
    label_en: 'Order Number',
    label_ar: 'رقم الطلب',
    category: 'order',
    field_path: 'order.order_number',
    enabled: true,
    required: true,
  },
  {
    id: 'order_total',
    label_en: 'Total Amount',
    label_ar: 'الإجمالي',
    category: 'order',
    field_path: 'order.total_amount',
    enabled: true,
    required: false,
  },
  {
    id: 'order_subtotal',
    label_en: 'Subtotal',
    label_ar: 'المجموع الفرعي',
    category: 'order',
    field_path: 'order.subtotal',
    enabled: false,
    required: false,
  },
  {
    id: 'order_shipping_cost',
    label_en: 'Shipping Cost',
    label_ar: 'تكلفة الشحن',
    category: 'order',
    field_path: 'order.shipping_cost',
    enabled: false,
    required: false,
  },
  {
    id: 'order_tax',
    label_en: 'Tax Amount',
    label_ar: 'قيمة الضريبة',
    category: 'order',
    field_path: 'order.tax_amount',
    enabled: false,
    required: false,
  },
  {
    id: 'order_discount',
    label_en: 'Discount Amount',
    label_ar: 'قيمة الخصم',
    category: 'order',
    field_path: 'order.discount_amount',
    enabled: false,
    required: false,
  },
  {
    id: 'order_notes',
    label_en: 'Order Notes',
    label_ar: 'ملاحظات الطلب',
    category: 'order',
    field_path: 'order.notes',
    enabled: false,
    required: false,
  },
  {
    id: 'order_created_at',
    label_en: 'Order Date',
    label_ar: 'تاريخ الطلب',
    category: 'order',
    field_path: 'order.created_at',
    enabled: false,
    required: false,
  },

  // 👤 Customer Fields
  {
    id: 'customer_name',
    label_en: 'Customer Name',
    label_ar: 'اسم العميل',
    category: 'customer',
    field_path: 'customer.name',
    enabled: true,
    required: true,
  },
  {
    id: 'customer_phone',
    label_en: 'Customer Phone',
    label_ar: 'هاتف العميل',
    category: 'customer',
    field_path: 'customer.phone',
    enabled: true,
    required: true,
  },
  {
    id: 'customer_email',
    label_en: 'Customer Email',
    label_ar: 'بريد العميل',
    category: 'customer',
    field_path: 'customer.email',
    enabled: false,
    required: false,
  },

  // 📦 Items Fields
  {
    id: 'items_product_name',
    label_en: 'Product Name',
    label_ar: 'اسم المنتج',
    category: 'items',
    field_path: 'items[].product.name',
    enabled: true,
    required: false,
  },
  {
    id: 'items_product_sku',
    label_en: 'Product SKU',
    label_ar: 'كود المنتج',
    category: 'items',
    field_path: 'items[].product.sku',
    enabled: false,
    required: false,
  },
  {
    id: 'items_quantity',
    label_en: 'Quantity',
    label_ar: 'الكمية',
    category: 'items',
    field_path: 'items[].quantity',
    enabled: true,
    required: false,
  },
  {
    id: 'items_unit_price',
    label_en: 'Unit Price',
    label_ar: 'سعر الوحدة',
    category: 'items',
    field_path: 'items[].unit_price',
    enabled: false,
    required: false,
  },
  {
    id: 'items_subtotal',
    label_en: 'Item Subtotal',
    label_ar: 'إجمالي المنتج',
    category: 'items',
    field_path: 'items[].subtotal',
    enabled: false,
    required: false,
  },
  {
    id: 'items_variant',
    label_en: 'Variant Name',
    label_ar: 'اسم النسخة',
    category: 'items',
    field_path: 'items[].variant_name',
    enabled: false,
    required: false,
  },
  {
    id: 'items_weight',
    label_en: 'Product Weight',
    label_ar: 'وزن المنتج',
    category: 'items',
    field_path: 'items[].product.weight',
    enabled: false,
    required: false,
  },

  // 📍 Address Fields
  {
    id: 'address_street',
    label_en: 'Street Address',
    label_ar: 'الشارع',
    category: 'address',
    field_path: 'shipping_address.street',
    enabled: true,
    required: true,
  },
  {
    id: 'address_city',
    label_en: 'City',
    label_ar: 'المدينة',
    category: 'address',
    field_path: 'shipping_address.city',
    enabled: true,
    required: true,
  },
  {
    id: 'address_governorate',
    label_en: 'Governorate',
    label_ar: 'المحافظة',
    category: 'address',
    field_path: 'shipping_address.governorate',
    enabled: true,
    required: true,
  },
  {
    id: 'address_district',
    label_en: 'District',
    label_ar: 'الحي',
    category: 'address',
    field_path: 'shipping_address.district',
    enabled: false,
    required: false,
  },
  {
    id: 'address_building',
    label_en: 'Building Number',
    label_ar: 'رقم المبنى',
    category: 'address',
    field_path: 'shipping_address.building_number',
    enabled: false,
    required: false,
  },
  {
    id: 'address_floor',
    label_en: 'Floor',
    label_ar: 'الطابق',
    category: 'address',
    field_path: 'shipping_address.floor',
    enabled: false,
    required: false,
  },
  {
    id: 'address_apartment',
    label_en: 'Apartment',
    label_ar: 'الشقة',
    category: 'address',
    field_path: 'shipping_address.apartment',
    enabled: false,
    required: false,
  },
  {
    id: 'address_postal_code',
    label_en: 'Postal Code',
    label_ar: 'الرمز البريدي',
    category: 'address',
    field_path: 'shipping_address.postal_code',
    enabled: false,
    required: false,
  },

  // 💰 Payment Fields
  {
    id: 'payment_method',
    label_en: 'Payment Method',
    label_ar: 'طريقة الدفع',
    category: 'payment',
    field_path: 'order.payment_method',
    enabled: true,
    required: false,
  },
  {
    id: 'payment_status',
    label_en: 'Payment Status',
    label_ar: 'حالة الدفع',
    category: 'payment',
    field_path: 'order.payment_status',
    enabled: false,
    required: false,
  },
];

export default function ShippingConfigModal({
  isOpen,
  onClose,
  onSave,
  currentConfig,
}: ShippingConfigModalProps) {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const [company, setCompany] = useState<string>(currentConfig?.company || 'bosta');
  const [customApiUrl, setCustomApiUrl] = useState<string>(currentConfig?.custom_api_url || '');
  const [customApiKey, setCustomApiKey] = useState<string>(currentConfig?.custom_api_key || '');
  const [fields, setFields] = useState<ShippingField[]>(
    currentConfig?.fields || AVAILABLE_FIELDS
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const translations = {
    title: {
      en: 'Shipping Configuration',
      ar: 'إعدادات الشحن',
    },
    company_label: {
      en: 'Shipping Company',
      ar: 'شركة الشحن',
    },
    custom_api_url: {
      en: 'Custom API URL',
      ar: 'رابط API المخصص',
    },
    custom_api_key: {
      en: 'API Key',
      ar: 'مفتاح API',
    },
    select_fields: {
      en: 'Select Data Fields to Send',
      ar: 'اختر البيانات المراد إرسالها',
    },
    categories: {
      all: { en: 'All Fields', ar: 'كل الحقول' },
      order: { en: 'Order Info', ar: 'بيانات الطلب' },
      customer: { en: 'Customer Info', ar: 'بيانات العميل' },
      items: { en: 'Products', ar: 'المنتجات' },
      address: { en: 'Shipping Address', ar: 'عنوان الشحن' },
      payment: { en: 'Payment', ar: 'الدفع' },
    },
    save: {
      en: 'Save Configuration',
      ar: 'حفظ الإعدادات',
    },
    cancel: {
      en: 'Cancel',
      ar: 'إلغاء',
    },
    select_all: {
      en: 'Select All',
      ar: 'تحديد الكل',
    },
    deselect_all: {
      en: 'Deselect All',
      ar: 'إلغاء التحديد',
    },
    field_required: {
      en: '(Required)',
      ar: '(مطلوب)',
    },
  };

  const handleToggleField = (fieldId: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId && !field.required
          ? { ...field, enabled: !field.enabled }
          : field
      )
    );
  };

  const handleSelectAll = () => {
    setFields((prev) => prev.map((field) => ({ ...field, enabled: true })));
  };

  const handleDeselectAll = () => {
    setFields((prev) =>
      prev.map((field) => ({
        ...field,
        enabled: field.required ? true : false,
      }))
    );
  };

  const handleSave = () => {
    // Validation 1: Company name is REQUIRED
    if (!company || company.trim() === '') {
      alert(isRTL 
        ? '⚠️ يجب إدخال اسم شركة الشحن' 
        : '⚠️ You must enter the shipping company name'
      );
      return;
    }

    // Validation 2: custom_api_url is REQUIRED
    if (!customApiUrl || customApiUrl.trim() === '') {
      alert(isRTL 
        ? '⚠️ يجب إدخال API URL لشركة الشحن' 
        : '⚠️ You must enter the shipping company API URL'
      );
      return;
    }

    // Validation 3: Validate URL format
    try {
      new URL(customApiUrl);
    } catch {
      alert(isRTL 
        ? '⚠️ الرجاء إدخال URL صحيح (مثل: https://api.example.com/v1/shipments)' 
        : '⚠️ Please enter a valid URL (e.g., https://api.example.com/v1/shipments)'
      );
      return;
    }

    const config: ShippingConfiguration = {
      company,
      custom_api_url: customApiUrl,  // Always save (REQUIRED)
      custom_api_key: customApiKey || undefined,  // Optional
      fields: fields.filter((f) => f.enabled),
    };

    // Save to localStorage for persistence
    localStorage.setItem('shipping_config', JSON.stringify(config));

    onSave(config);
    onClose();
  };

  const filteredFields =
    activeCategory === 'all'
      ? fields
      : fields.filter((f) => f.category === activeCategory);

  const getFieldLabel = (field: ShippingField) => {
    return isRTL ? field.label_ar : field.label_en;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {translations.title[language]}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Shipping Company Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {translations.company_label[language]} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={isRTL ? 'مثال: Bosta, Aramex, DHL, أو أي شركة أخرى' : 'e.g., Bosta, Aramex, DHL, or any other company'}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              {isRTL 
                ? 'اكتب اسم شركة الشحن (مثل: Bosta, Aramex, DHL, FedEx, أو اسم مخصص)'
                : 'Enter the shipping company name (e.g., Bosta, Aramex, DHL, FedEx, or custom name)'}
            </p>
          </div>

          {/* Custom API Configuration (Optional) */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {isRTL ? 'إعدادات API مخصص (اختياري)' : 'Custom API Settings (Optional)'}
              </label>
              <button
                type="button"
                onClick={() => {
                  if (customApiUrl || customApiKey) {
                    setCustomApiUrl('');
                    setCustomApiKey('');
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {(customApiUrl || customApiKey) 
                  ? (isRTL ? 'مسح' : 'Clear') 
                  : (isRTL ? 'للشركات ذات API خاص' : 'For custom API companies')}
              </button>
            </div>
            <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {translations.custom_api_url[language]} <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  placeholder="https://api.example.com/v1/shipments"
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {translations.custom_api_key[language]}
                </label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="sk_live_••••••••••••••••"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-xs text-red-500 font-medium">
                {isRTL 
                  ? '⚠️ مطلوب: يجب إدخال API URL لشركة الشحن'
                  : '⚠️ Required: You must enter the shipping company API URL'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isRTL 
                  ? 'أمثلة: https://app.bosta.co/api/v2/deliveries أو https://api.aramex.com/v1/shipments'
                  : 'Examples: https://app.bosta.co/api/v2/deliveries or https://api.aramex.com/v1/shipments'}
              </p>
            </div>
          </div>

          {/* Field Selection Header */}
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {translations.select_fields[language]}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                {translations.select_all[language]}
              </button>
              <button
                onClick={handleDeselectAll}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                {translations.deselect_all[language]}
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-200 pb-2">
            {Object.entries(translations.categories).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                  activeCategory === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {value[language]}
              </button>
            ))}
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFields.map((field) => (
              <div
                key={field.id}
                className={`p-3 border rounded-lg transition-all ${
                  field.enabled
                    ? 'bg-blue-50 border-blue-300'
                    : 'bg-gray-50 border-gray-200'
                } ${field.required ? 'opacity-75' : 'cursor-pointer hover:shadow-md'}`}
                onClick={() => !field.required && handleToggleField(field.id)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={field.enabled}
                    disabled={field.required}
                    onChange={() => handleToggleField(field.id)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      {getFieldLabel(field)}
                      {field.required && (
                        <span className="text-xs text-red-600 font-normal">
                          {translations.field_required[language]}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 font-mono">
                      {field.field_path}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                {isRTL
                  ? `تم تحديد ${fields.filter((f) => f.enabled).length} حقل من ${fields.length}`
                  : `Selected ${fields.filter((f) => f.enabled).length} of ${fields.length} fields`}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {translations.cancel[language]}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {translations.save[language]}
          </button>
        </div>
      </div>
    </div>
  );
}

