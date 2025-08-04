export default function About() {
  const stats = [
    { number: "25+", label: "Years Experience", icon: "🏆" },
    { number: "50K+", label: "Happy Customers", icon: "😊" },
    { number: "500+", label: "Premium Tools", icon: "🔧" },
    { number: "24/7", label: "Customer Support", icon: "📞" }
  ];

  const features = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Same-day delivery available for orders placed before 2 PM"
    },
    {
      icon: "🛡️",
      title: "Quality Guarantee",
      description: "All tools come with manufacturer warranty and our quality promise"
    },
    {
      icon: "💳",
      title: "Flexible Payment",
      description: "Multiple payment options including installments for bulk orders"
    },
    {
      icon: "🔧",
      title: "Expert Support",
      description: "Professional consultation and technical support from our experts"
    }
  ];

  return (
    <section className="py-20 gradient-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6 backdrop-blur-sm">
              🏗️ About BuildTools BS
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Building Tomorrow with 
                          <span className="block text-transparent bg-gradient-to-r from-red-300 to-red-500 bg-clip-text">
              Professional Excellence
            </span>
            </h2>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              For over 25 years, we've been the trusted partner for construction professionals 
              across the Middle East and North Africa. Our commitment to quality, innovation, 
              and customer satisfaction drives everything we do.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center text-white/90">
                <div className="w-6 h-6 gradient-red rounded-full flex items-center justify-center mr-4">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span>Premium quality tools from leading global brands</span>
              </div>
              <div className="flex items-center text-white/90">
                <div className="w-6 h-6 gradient-red rounded-full flex items-center justify-center mr-4">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span>Competitive pricing with flexible payment options</span>
              </div>
              <div className="flex items-center text-white/90">
                <div className="w-6 h-6 gradient-red rounded-full flex items-center justify-center mr-4">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span>Expert technical support and consultation services</span>
              </div>
            </div>

            <button className="gradient-red text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold text-lg">
              Learn More About Us
            </button>
          </div>

          {/* Right Content - Stats */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="card-hover bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                  style={{
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-white/80 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="card-hover bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex items-start space-x-4"
                  style={{
                    animationDelay: `${(index + 4) * 200}ms`
                  }}
                >
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partnership Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">
            Trusted by Leading Construction Companies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {["🏢", "🏗️", "🏭", "🏬"].map((icon, index) => (
              <div
                key={index}
                className="card-hover bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
              >
                <div className="text-4xl mb-2">{icon}</div>
                <div className="text-white/80 text-sm">Partner {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}