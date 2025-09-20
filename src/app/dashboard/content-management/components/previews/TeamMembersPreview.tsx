'use client';

import { useLanguage } from '@/app/context/LanguageContext';

interface TeamMember {
  id?: number;
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  experience_ar: string;
  experience_en: string;
  image?: string;
  email: string;
  phone: string;
  linkedin?: string;
  order: number;
  is_active: boolean;
}

interface TeamMembersPreviewProps {
  data: TeamMember[];
}

export default function TeamMembersPreview({ data }: TeamMembersPreviewProps) {
  const { language } = useLanguage();

  const activeTeamMembers = data
    .filter(member => member.is_active)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {language === 'ar' ? 'فريق العمل' : 'Our Team'}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {language === 'ar' 
            ? 'تعرف على الفريق المتخصص الذي يقف خلف نجاح شركتنا وتميزها في السوق'
            : 'Meet the specialized team behind our company\'s success and excellence in the market'
          }
        </p>
      </div>

      {activeTeamMembers.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">👥</div>
          <p className="text-xl text-gray-500">
            {language === 'ar' ? 'لا يوجد أعضاء فريق متاحين' : 'No team members available'}
          </p>
        </div>
      ) : (
        <>
          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {activeTeamMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  {/* Profile Image */}
                  <div className="relative">
                    <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={language === 'ar' ? member.name_ar : member.name_en}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-4xl font-bold text-blue-600">
                            {(language === 'ar' ? member.name_ar : member.name_en).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Order Badge */}
                    <div className="absolute top-4 right-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-gray-600">#{member.order}</span>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {language === 'ar' ? member.name_ar : member.name_en}
                    </h3>
                    <p className="text-blue-600 font-semibold mb-4">
                      {language === 'ar' ? member.role_ar : member.role_en}
                    </p>
                    
                    {/* Experience */}
                    {(language === 'ar' ? member.experience_ar : member.experience_en) && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {language === 'ar' ? member.experience_ar : member.experience_en}
                      </p>
                    )}

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="w-5">📧</span>
                        <a href={`mailto:${member.email}`} className="hover:text-blue-600 transition-colors truncate">
                          {member.email}
                        </a>
                      </div>
                      {member.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="w-5">📞</span>
                          <a href={`tel:${member.phone}`} className="hover:text-blue-600 transition-colors">
                            {member.phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* LinkedIn */}
                    {member.linkedin && (
                      <div className="pt-4 border-t border-gray-200">
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <span>💼</span>
                          <span>{language === 'ar' ? 'الملف الشخصي' : 'LinkedIn Profile'}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Alternative Layout - Leadership Team */}
          <div className="bg-gray-50 rounded-3xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              {language === 'ar' ? 'الفريق القيادي' : 'Leadership Team'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeTeamMembers.slice(0, 3).map((member) => (
                <div key={`leader-${member.id}`} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {(language === 'ar' ? member.name_ar : member.name_en).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {language === 'ar' ? member.name_ar : member.name_en}
                      </h4>
                      <p className="text-blue-600 font-medium">
                        {language === 'ar' ? member.role_ar : member.role_en}
                      </p>
                    </div>
                  </div>
                  
                  {(language === 'ar' ? member.experience_ar : member.experience_en) && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {language === 'ar' ? member.experience_ar : member.experience_en}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold text-center mb-8">
              {language === 'ar' ? 'إحصائيات الفريق' : 'Team Statistics'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">{activeTeamMembers.length}</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'عضو في الفريق' : 'Team Members'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">
                  {activeTeamMembers.filter(m => m.linkedin).length}
                </div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'ملف LinkedIn' : 'LinkedIn Profiles'}
                </div>
              </div>
              
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-blue-100">
                  {language === 'ar' ? 'التزام مهني' : 'Professional Commitment'}
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'تواصل مع فريقنا' : 'Connect with Our Team'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'نحن هنا لمساعدتك في تحقيق أهدافك وتقديم أفضل الحلول لمشاريعك'
                : 'We\'re here to help you achieve your goals and provide the best solutions for your projects'
              }
            </p>
            <button className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </button>
          </div>
        </>
      )}
    </div>
  );
} 