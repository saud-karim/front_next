export default function Categories() {
  const categories = [
    {
      id: 1,
      name: "Power Tools",
      description: "Professional electric and battery-powered tools",
      icon: "🔋",
      count: "120+ Tools",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      items: ["Drills", "Saws", "Grinders", "Sanders"]
    },
    {
      id: 2,
      name: "Hand Tools",
      description: "Essential manual tools for every project",
      icon: "🔨",
      count: "200+ Tools",
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      items: ["Hammers", "Wrenches", "Pliers", "Screwdrivers"]
    },
    {
      id: 3,
      name: "Safety Equipment",
      description: "Advanced protection gear for construction",
      icon: "🛡️",
      count: "80+ Items",
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      items: ["Helmets", "Gloves", "Goggles", "Harnesses"]
    },
    {
      id: 4,
      name: "Measuring Tools",
      description: "Precision instruments for accurate work",
      icon: "📐",
      count: "50+ Tools",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      items: ["Tape Measures", "Levels", "Calipers", "Laser Tools"]
    },
    {
      id: 5,
      name: "Construction Materials",
      description: "Quality materials for building projects",
      icon: "🧱",
      count: "300+ Items",
      color: "from-gray-500 to-gray-700",
      bgColor: "bg-gray-50",
      items: ["Cement", "Steel", "Blocks", "Pipes"]
    },
    {
      id: 6,
      name: "Heavy Machinery",
      description: "Industrial equipment for large projects",
      icon: "🚜",
      count: "40+ Machines",
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      items: ["Excavators", "Cranes", "Loaders", "Mixers"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            🏗️ Product Categories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Our <span className="text-gradient">Tool Categories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From professional power tools to precision instruments, find everything you need 
            for your construction projects in our comprehensive categories.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`card-hover group cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-gray-200 ${category.bgColor} hover:shadow-2xl transition-all duration-500`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Card Header */}
              <div className={`p-6 bg-gradient-to-r ${category.color} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/90 text-sm">{category.description}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">{category.count}</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>View All</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button className={`w-full mt-6 bg-gradient-to-r ${category.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                  Browse Category
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-200">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Our experts are here to help you find the perfect tools for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="gradient-red text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 shadow-md font-semibold">
                📞 Contact Expert
              </button>
              <button className="border-2 border-red-500 text-red-600 px-8 py-3 rounded-xl hover:bg-red-50 transition-all duration-300 font-semibold">
                📋 Custom Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}