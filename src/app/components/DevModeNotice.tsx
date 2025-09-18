'use client';

import { useLanguage } from '../context/LanguageContext';

export default function DevModeNotice() {
  const { t } = useLanguage();
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="text-orange-600 text-xl mr-3">🚧</div>
        <div>
          <h3 className="text-orange-800 font-medium">{t('dev.mode.active')}</h3>
          <p className="text-orange-700 text-sm mt-1">
            Laravel Backend غير متصل. يتم استخدام بيانات وهمية للتطوير.
            <br />
            {t('dev.mode.admin.help')}
          </p>
        </div>
      </div>
    </div>
  );
} 