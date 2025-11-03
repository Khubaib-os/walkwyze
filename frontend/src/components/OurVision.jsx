import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const OurVisionPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const visionPoints = [
    {
      title: 'Our Mission',
      description: 'To provide high-quality, sustainable fashion that empowers individuals to express their unique style while making conscious choices for our planet.'
    },
    {
      title: 'Our Vision', 
      description: 'To become the leading sustainable fashion brand globally, setting new standards for ethical production, environmental responsibility, and customer satisfaction.'
    },
    {
      title: 'Our Values',
      description: 'Quality, Sustainability, Innovation, and Community. We believe in creating fashion that lasts and makes a positive impact on society and the environment.'
    }
  ];

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleReadMore = () => {
    window.location.href = '/aboutus';
  };

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-black mb-6 tracking-wide uppercase" style={{ letterSpacing: '2px' }}>
            Our Vision
          </h1>
          <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Building a sustainable future through innovative fashion that cares for people and the planet.
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4 mb-12">
          {visionPoints.map((point, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-xl font-medium text-black">
                  {point.title}
                </h3>
                <div className="text-gray-500">
                  {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6 pt-2 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {point.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* READ MORE Button */}
        <div className="text-center">
          <button
            onClick={handleReadMore}
            className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 font-medium"
          >
            READ MORE...
          </button>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-20 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 uppercase tracking-widest">
            Crafting Tomorrow's Fashion Today
          </p>
        </div>

      </div>
    </div>
  );
};

export default OurVisionPage;