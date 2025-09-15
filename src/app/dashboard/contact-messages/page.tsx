'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { ApiService } from '../../services/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  full_message: string;
  project_type: string;
  project_type_name: string;
  status: string;
  status_name: string;
  admin_notes?: string;
  created_at: string;
  time_ago: string;
}

interface ContactStats {
  total_messages: number;
  new_messages: number;
  in_progress_messages: number;
  resolved_messages: number;
  closed_messages: number;
  this_month_messages: number;
  weekly_growth: number;
}

export default function ContactMessagesPage() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const { t, language } = useLanguage();
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    project_type: 'all',
    search: '',
    page: 1,
    per_page: 20
  });

  // Status colors mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Project type colors
  const getProjectTypeColor = (type: string) => {
    switch (type) {
      case 'residential': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-indigo-100 text-indigo-800';
      case 'industrial': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchMessages();
    }
  }, [user, filters]);

  const fetchStats = async () => {
    try {
      // Using a mock stats call since the API endpoint structure might vary
      const mockStats = {
        total_messages: 25,
        new_messages: 8,
        in_progress_messages: 5,
        resolved_messages: 10,
        closed_messages: 2,
        this_month_messages: 15,
        weekly_growth: 12.5
      };
      setStats(mockStats);
    } catch (err) {
      console.error('❌ Error fetching contact stats:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockMessages: ContactMessage[] = [
        {
          id: 'TKT-2025-001',
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+201234567890',
          company: 'شركة البناء المتطور',
          subject: 'استفسار عن أسعار المواد',
          message: 'أود الاستفسار عن أسعار الأسمنت والحديد...',
          full_message: 'أود الاستفسار عن أسعار الأسمنت والحديد للمشروع السكني الجديد الذي نعمل عليه.',
          project_type: 'residential',
          project_type_name: 'سكني',
          status: 'new',
          status_name: 'جديد',
          created_at: '2025-01-15 10:30:45',
          time_ago: 'منذ 4 ساعات'
        },
        {
          id: 'TKT-2025-002',
          name: 'سارة أحمد',
          email: 'sara@example.com',
          phone: '+201234567891',
          company: 'مؤسسة الإنشاءات',
          subject: 'استفسار عن التوصيل',
          message: 'ما هي مواعيد التوصيل المتاحة؟',
          full_message: 'ما هي مواعيد التوصيل المتاحة للمنطقة الشرقية؟ ونحتاج توصيل عاجل.',
          project_type: 'commercial',
          project_type_name: 'تجاري',
          status: 'in_progress',
          status_name: 'قيد المعالجة',
          admin_notes: 'تم التواصل مع العميل',
          created_at: '2025-01-15 09:15:30',
          time_ago: 'منذ 5 ساعات'
        }
      ];
      
      // Apply filters
      let filteredMessages = mockMessages;
      
      if (filters.status !== 'all') {
        filteredMessages = filteredMessages.filter(msg => msg.status === filters.status);
      }
      
      if (filters.project_type !== 'all') {
        filteredMessages = filteredMessages.filter(msg => msg.project_type === filters.project_type);
      }
      
      if (filters.search) {
        filteredMessages = filteredMessages.filter(msg => 
          msg.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          msg.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          msg.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
          msg.company?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      setMessages(filteredMessages);
    } catch (err) {
      console.error('❌ Error fetching messages:', err);
      error('فشل في جلب الرسائل');
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string, notes?: string) => {
    try {
      // Mock update - replace with actual API call
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status: newStatus, admin_notes: notes }
          : msg
      ));
      
      success('تم تحديث حالة الرسالة بنجاح');
      setShowModal(false);
      setSelectedMessage(null);
    } catch (err) {
      console.error('❌ Error updating message:', err);
      error('فشل في تحديث الرسالة');
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    
    try {
      // Mock delete - replace with actual API call
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      success('تم حذف الرسالة بنجاح');
    } catch (err) {
      console.error('❌ Error deleting message:', err);
      error('فشل في حذف الرسالة');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            غير مصرح لك بالوصول
          </h1>
          <p className="text-gray-600">هذه الصفحة مخصصة للمديرين فقط</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📧 إدارة رسائل الاتصال
          </h1>
          <p className="text-gray-600">
            إدارة ومتابعة جميع رسائل العملاء والاستفسارات
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">إجمالي الرسائل</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_messages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">رسائل جديدة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.new_messages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">تم حلها</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved_messages}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="mr-4">
                  <p className="text-sm text-gray-600">نمو أسبوعي</p>
                  <p className="text-2xl font-bold text-gray-900">+{stats.weekly_growth}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </label>
              <input
                type="text"
                placeholder="ابحث في الاسم، البريد، الموضوع..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحالة
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="new">جديد</option>
                <option value="in_progress">قيد المعالجة</option>
                <option value="resolved">تم الحل</option>
                <option value="closed">مغلق</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع المشروع
              </label>
              <select
                value={filters.project_type}
                onChange={(e) => setFilters(prev => ({ ...prev, project_type: e.target.value, page: 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">جميع الأنواع</option>
                <option value="residential">سكني</option>
                <option value="commercial">تجاري</option>
                <option value="industrial">صناعي</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: 'all', project_type: 'all', search: '', page: 1, per_page: 20 })}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              الرسائل ({messages.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-3 text-gray-600">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <span>جاري تحميل الرسائل...</span>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p>لا توجد رسائل</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم التذكرة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المرسل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الموضوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نوع المشروع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العمليات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {messages.map((message) => (
                    <tr key={message.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {message.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-500">{message.email}</div>
                          {message.company && (
                            <div className="text-xs text-gray-400">{message.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={message.subject}>
                          {message.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProjectTypeColor(message.project_type)}`}>
                          {message.project_type_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(message.status)}`}>
                          {message.status_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {message.time_ago}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            عرض
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  تفاصيل الرسالة: {selectedMessage.id}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الاسم</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMessage.email}</p>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMessage.phone}</p>
                  </div>
                )}

                {selectedMessage.company && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الشركة</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedMessage.company}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">الموضوع</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">الرسالة</label>
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded border">
                    {selectedMessage.full_message}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">نوع المشروع</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProjectTypeColor(selectedMessage.project_type)}`}>
                      {selectedMessage.project_type_name}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الحالة الحالية</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status_name}
                    </span>
                  </div>
                </div>

                {selectedMessage.admin_notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ملاحظات إدارية</label>
                    <p className="mt-1 text-sm text-gray-900 bg-yellow-50 p-3 rounded border">
                      {selectedMessage.admin_notes}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">تاريخ الإرسال</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedMessage.created_at} ({selectedMessage.time_ago})</p>
                </div>
              </div>

              {/* Status Update Form */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">تحديث الحالة</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const newStatus = formData.get('status') as string;
                  const notes = formData.get('notes') as string;
                  updateMessageStatus(selectedMessage.id, newStatus, notes);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">الحالة الجديدة</label>
                      <select
                        name="status"
                        defaultValue={selectedMessage.status}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="new">جديد</option>
                        <option value="in_progress">قيد المعالجة</option>
                        <option value="resolved">تم الحل</option>
                        <option value="closed">مغلق</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">ملاحظات إدارية</label>
                      <textarea
                        name="notes"
                        rows={3}
                        defaultValue={selectedMessage.admin_notes || ''}
                        placeholder="أضف ملاحظات حول حالة الرسالة..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        تحديث الحالة
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 