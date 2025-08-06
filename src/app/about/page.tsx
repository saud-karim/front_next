'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AboutPage() {
  const stats = [
    { value: '15+', label: 'Years Experience', icon: '🏆' },
    { value: '50K+', label: 'Happy Customers', icon: '👥' },
    { value: '1000+', label: 'Projects Completed', icon: '🏗️' },
    { value: '24/7', label: 'Customer Support', icon: '🛟' }
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We source only the finest construction tools from trusted manufacturers worldwide.',
      icon: '⭐',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Expert Support',
      description: 'Our team of construction professionals provides expert guidance for all your projects.',
      icon: '🎯',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Innovation',
      description: 'We stay ahead of industry trends, bringing you the latest in construction technology.',
      icon: '🚀',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Reliability',
      description: 'Count on us for consistent quality, timely delivery, and dependable service.',
      icon: '🛡️',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const team = [
    {
      name: 'Ahmed Hassan',
      role: 'Founder & CEO',
      experience: '20+ years in construction',
      image: '👨‍💼',
      specialty: 'Heavy Machinery Expert'
    },
    {
      name: 'Sarah Mohammed',
      role: 'Head of Operations',
      experience: '15+ years in logistics',
      image: '👩‍💼',
      specialty: 'Supply Chain Management'
    },
    {
      name: 'Omar Ali',
      role: 'Technical Director',
      experience: '18+ years in engineering',
      image: '👨‍🔧',
      specialty: 'Power Tools Specialist'
    },
    {
      name: 'Fatima Ahmed',
      role: 'Customer Success Manager',
      experience: '12+ years in customer service',
      image: '👩‍💻',
      specialty: 'Client Relations'
    }
  ];

  const milestones = [
    { year: '2009', event: 'BS Construction Tools founded', description: 'Started as a small family business' },
    { year: '2012', event: 'First major contract', description: 'Supplied tools for mega construction project' },
    { year: '2015', event: 'Expanded product line', description: 'Added safety equipment and measuring tools' },
    { year: '2018', event: 'Digital transformation', description: 'Launched online platform and e-commerce' },
    { year: '2021', event: 'International expansion', description: 'Started serving customers across the region' },
    { year: '2024', event: 'Innovation hub launch', description: 'Opened R&D center for new technologies' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-6">
                🏢 About BS Construction Tools
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Building <span className="text-gradient">Excellence</span> Together
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                For over 15 years, we've been the trusted partner for construction professionals, 
                providing premium tools and equipment that power the world's most ambitious projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/products"
                  className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-center"
                >
                  Explore Our Products
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 font-semibold">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏗️</div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-gray-300">
                    To empower builders and contractors with world-class tools and exceptional service, 
                    enabling them to create remarkable structures that stand the test of time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-4">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our <span className="text-gradient">Story</span>
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2009 by a team of construction industry veterans, BS Construction Tools 
                  began with a simple vision: to provide builders with access to the highest quality 
                  tools and equipment available.
                </p>
                <p>
                  What started as a small family business has grown into a leading supplier of 
                  construction tools, serving thousands of contractors, builders, and DIY enthusiasts 
                  across the region.
                </p>
                <p>
                  Today, we continue to uphold our founding principles of quality, reliability, and 
                  exceptional customer service while embracing innovation and new technologies that 
                  help our customers work more efficiently and safely.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">🔨</div>
                  <div className="font-semibold text-gray-900">Premium Tools</div>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <div className="font-semibold text-gray-900">Safety First</div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-semibold text-gray-900">Innovation</div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="font-semibold text-gray-900">Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-gradient">Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape our relationships with customers, 
              partners, and the communities we serve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card-hover group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className={`p-6 bg-gradient-to-r ${value.color} text-white text-center`}>
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key milestones that have shaped our company and defined our path to excellence
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-red-500 to-orange-500"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <div className="text-red-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.event}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced professionals dedicated to providing you with the best tools and service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card-hover group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-red-600 font-semibold mb-2">{member.role}</div>
                  <div className="text-sm text-gray-600 mb-3">{member.experience}</div>
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {member.specialty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Partnerships */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Certifications & <span className="text-gradient">Partnerships</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We maintain the highest industry standards and partner with leading manufacturers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'ISO 9001:2015', description: 'Quality Management', icon: '🏅' },
              { name: 'OSHA Certified', description: 'Safety Standards', icon: '🛡️' },
              { name: 'DeWalt Partner', description: 'Authorized Dealer', icon: '🤝' },
              { name: 'Industry Leader', description: 'Excellence Award', icon: '⭐' }
            ].map((cert, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
                <div className="text-4xl mb-3">{cert.icon}</div>
                <h3 className="text-lg font-bold mb-2">{cert.name}</h3>
                <p className="text-gray-300 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of satisfied customers who trust BS Construction Tools for their projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold"
            >
              Shop Now
            </Link>
            <Link 
              href="/categories"
              className="border-2 border-red-500 text-red-600 px-8 py-4 rounded-xl hover:bg-red-50 transition-all duration-300 font-semibold"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 