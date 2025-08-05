'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    projectType: 'residential'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        projectType: 'residential'
      });
    }, 2000);
  };

  const contactInfo = [
    {
      title: 'Main Office',
      details: [
        '123 Construction Street',
        'Building District, City 12345',
        'Egypt'
      ],
      icon: '📍',
      color: 'from-red-500 to-orange-500'
    },
    {
      title: 'Phone Numbers',
      details: [
        '+20 123 456 7890',
        '+20 987 654 3210',
        'Toll Free: 800-TOOLS'
      ],
      icon: '📞',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Email Addresses',
      details: [
        'info@bstools.com',
        'sales@bstools.com',
        'support@bstools.com'
      ],
      icon: '✉️',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Business Hours',
      details: [
        'Monday - Friday: 8:00 AM - 6:00 PM',
        'Saturday: 9:00 AM - 4:00 PM',
        'Sunday: Closed'
      ],
      icon: '🕒',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const departments = [
    {
      name: 'Sales Department',
      description: 'Product inquiries, quotes, and orders',
      phone: '+20 123 456 7891',
      email: 'sales@bstools.com',
      icon: '💼',
      color: 'bg-blue-500'
    },
    {
      name: 'Technical Support',
      description: 'Product guidance and technical assistance',
      phone: '+20 123 456 7892',
      email: 'support@bstools.com',
      icon: '🔧',
      color: 'bg-green-500'
    },
    {
      name: 'Customer Service',
      description: 'General inquiries and customer care',
      phone: '+20 123 456 7893',
      email: 'service@bstools.com',
      icon: '👥',
      color: 'bg-purple-500'
    },
    {
      name: 'Partnerships',
      description: 'Business partnerships and collaborations',
      phone: '+20 123 456 7894',
      email: 'partners@bstools.com',
      icon: '🤝',
      color: 'bg-orange-500'
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#', color: 'bg-blue-600' },
    { name: 'Twitter', icon: '🐦', url: '#', color: 'bg-sky-500' },
    { name: 'LinkedIn', icon: '💼', url: '#', color: 'bg-blue-700' },
    { name: 'Instagram', icon: '📷', url: '#', color: 'bg-pink-500' },
    { name: 'YouTube', icon: '📺', url: '#', color: 'bg-red-600' },
    { name: 'WhatsApp', icon: '💬', url: '#', color: 'bg-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
            📞 Contact Us
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Have questions about our products or need expert advice for your project? 
            Our team is here to help you find the perfect tools and solutions.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold mb-1">Quick Response</div>
              <div className="text-sm text-gray-300">Within 2 hours</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-bold mb-1">Expert Advice</div>
              <div className="text-sm text-gray-300">Professional guidance</div>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="font-bold mb-1">Reliable Support</div>
              <div className="text-sm text-gray-300">Always here to help</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a <span className="text-gradient">Message</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible. 
                For urgent matters, please call us directly.
              </p>

              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="+20 123 456 7890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="renovation">Renovation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Tell us about your project requirements..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-md ${
                    isSubmitting
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'gradient-red text-white hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contact <span className="text-gradient">Information</span>
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-start">
                      <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center text-white text-xl mr-4 flex-shrink-0`}>
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600 mb-1">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <div className="text-gray-700 font-semibold">Interactive Map</div>
                  <div className="text-gray-600 text-sm">Find us on the map</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contact by <span className="text-gradient">Department</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reach out to the right department for faster and more specialized assistance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="card-hover bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className={`p-4 ${dept.color} text-white text-center`}>
                  <div className="text-3xl mb-2">{dept.icon}</div>
                  <h3 className="font-bold">{dept.name}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="mr-2">📞</span>
                      <a href={`tel:${dept.phone}`} className="hover:text-red-600">{dept.phone}</a>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="mr-2">✉️</span>
                      <a href={`mailto:${dept.email}`} className="hover:text-red-600">{dept.email}</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about our products and services
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for unused items in original packaging. Professional tools have a 90-day warranty period."
              },
              {
                question: "Do you offer bulk discounts?",
                answer: "Yes, we provide competitive bulk pricing for contractors and businesses. Contact our sales team for custom quotes."
              },
              {
                question: "How long does shipping take?",
                answer: "Standard shipping takes 3-5 business days. Express shipping is available for urgent orders within 1-2 business days."
              },
              {
                question: "Do you provide technical support?",
                answer: "Yes, our technical team provides full support for all products including installation guidance and troubleshooting."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media & Additional Contact */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Connect with <span className="text-gradient">Us</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Follow us on social media for updates, tips, and the latest construction industry news
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className={`${social.color} rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300`}
              >
                <div className="text-4xl mb-3">{social.icon}</div>
                <div className="font-semibold">Follow us on {social.name}</div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Need Immediate Assistance?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+201234567890"
                className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold"
              >
                📞 Call Now: +20 123 456 7890
              </a>
              <a 
                href="mailto:info@bstools.com"
                className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold"
              >
                ✉️ Email: info@bstools.com
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 