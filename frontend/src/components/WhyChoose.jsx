import React from 'react';
import { Truck, TrendingUp, HeadphonesIcon, ShieldCheck } from 'lucide-react';

const WhyChooseUsPage = () => {
  const features = [
    {
      icon: <Truck size={28} />,
      title: 'Lightning Fast Shipping',
      description: 'Get your orders delivered within 2-3 business days. Quick processing and fast delivery guaranteed across all regions.'
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'We Know What\'s Hype',
      description: 'Stay ahead with the latest trends curated by our style experts. We bring you the most sought-after sneakers and jackets before they hit mainstream.'
    },
    {
      icon: <HeadphonesIcon size={28} />,
      title: '24/7 Customer Support',
      description: 'Round-the-clock assistance from our dedicated team. Get instant help with sizing, orders, tracking, and style advice anytime.'
    },
    {
      icon: <ShieldCheck size={28} />,
      title: 'Authenticity Guaranteed',
      description: 'Every product undergoes rigorous verification. We partner directly with brands to ensure 100% genuine, premium quality items.'
    }
  ];

  return (
    <div className="min-h-screen bg-black py-16">
      <div className="max-w-6xl mx-auto px-6"> {/* Increased max-width */}
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
            <span className="text-black text-2xl font-bold">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Why Choose Walk Wyze?
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Experience the difference with our commitment to quality, speed, and customer satisfaction
          </p>
        </div>

        {/* Features Grid - Wider Boxes */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 bg-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-200 w-full"
            >
              <div className="flex items-start space-x-4 w-full">
                <div className="flex-shrink-0 w-12 h-12 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0"> {/* Added min-w-0 for proper text wrapping */}
                  <h3 className="text-xl font-semibold text-black mb-3 group-hover:text-gray-800 transition-colors text-left">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors text-left">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section - Wider and Centered */}
        <div className="bg-white rounded-xl p-4 mb-12 border border-gray-200 max-w-4xl mx-auto"> {/* Centered with max-width */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-black mb-1">10K+</div>
              <div className="text-xs text-gray-600">Happy Customers</div>
            </div>
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-black mb-1">2-3</div>
              <div className="text-xs text-gray-600">Day Delivery</div>
            </div>
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-black mb-1">24/7</div>
              <div className="text-xs text-gray-600">Support</div>
            </div>
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-black mb-1">100%</div>
              <div className="text-xs text-gray-600">Authentic</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button 
            onClick={() => window.location.href = '/products'}
            className="bg-white text-black px-10 py-4 rounded-lg hover:bg-gray-200 transition-all duration-300 font-semibold text-lg shadow-md hover:shadow-lg"
          >
            Explore Our Collection
          </button>
          <p className="text-gray-400 text-sm mt-4">
            Join thousands of satisfied customers worldwide
          </p>
        </div>

      </div>
    </div>
  );
};

export default WhyChooseUsPage;