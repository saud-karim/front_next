import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Products",
      links: [
        { name: "Power Tools", href: "/products/power-tools" },
        { name: "Hand Tools", href: "/products/hand-tools" },
        { name: "Safety Equipment", href: "/products/safety" },
        { name: "Measuring Tools", href: "/products/measuring" },
        { name: "Construction Materials", href: "/products/materials" }
      ]
    },
    {
      title: "Services",
      links: [
        { name: "Tool Rental", href: "/services/rental" },
        { name: "Equipment Maintenance", href: "/services/maintenance" },
        { name: "Technical Support", href: "/services/support" },
        { name: "Training Programs", href: "/services/training" },
        { name: "Custom Solutions", href: "/services/custom" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Story", href: "/story" },
        { name: "Careers", href: "/careers" },
        { name: "News & Updates", href: "/news" },
        { name: "Partnerships", href: "/partnerships" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "Help Center", href: "/help" },
        { name: "Returns & Exchanges", href: "/returns" },
        { name: "Warranty Claims", href: "/warranty" },
        { name: "Track Your Order", href: "/track" }
      ]
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", href: "#" },
    { name: "Instagram", icon: "📷", href: "#" },
    { name: "Twitter", icon: "🐦", href: "#" },
    { name: "LinkedIn", icon: "💼", href: "#" },
    { name: "YouTube", icon: "📺", href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="gradient-bg py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4 text-white">Stay Updated</h3>
              <p className="text-white/90 text-lg">
                Get the latest updates on new products, special offers, and industry insights.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="gradient-red text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-12 h-12 metallic-effect rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    BS
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 gradient-red rounded transform rotate-45"></div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 gradient-red rounded-full"></div>
                  <div className="absolute -bottom-2 left-0 w-6 h-1 gradient-red rounded"></div>
                  <div className="absolute -bottom-2 left-2 w-4 h-1 gradient-red rounded"></div>
                  <div className="absolute -bottom-2 left-4 w-2 h-1 gradient-red rounded"></div>
                </div>
                <span className="ml-3 text-2xl font-bold">BuildTools</span>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted partner for professional construction tools and equipment. 
                Building excellence, one project at a time since 1998.
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <span className="text-xl mr-3">📍</span>
                  <span>123 Construction Blvd, Industrial City</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-xl mr-3">📞</span>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="text-xl mr-3">✉️</span>
                  <span>info@buildtools-bs.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                  >
                    <span className="text-lg">{social.icon}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-semibold mb-6 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-red-400 transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} BuildTools BS. All rights reserved.
            </div>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-red-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-red-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-red-400 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-red-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 gradient-red text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group">
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </footer>
  );
}