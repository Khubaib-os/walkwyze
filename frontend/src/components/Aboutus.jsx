import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white py-10 pb-26 ">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-black mb-6 tracking-wide uppercase" style={{ letterSpacing: '2px' }}>
            About Us
          </h1>
          <div className="w-24 h-0.5 bg-gray-800 mx-auto mb-8"></div>
          <p className="text-2xl font-light text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Walk Wyze — Where Style Meets Wisdom
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4">
            Your trusted destination for authentic sneakers and premium jackets.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Our Story Section */}
          <div className="border-l-4 border-black pl-8 py-2">
            <h2 className="text-2xl font-medium text-black mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Walk Wyze, The Thrift Store started with a simple yet powerful vision — to make authentic, 
              high-quality sneakers and jackets accessible to everyone who appreciates true style and comfort.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We've always understood what truly matters in streetwear culture: the iconic drops, the timeless 
              classics, and the perfect fit. From limited edition Jordans and Yeezys to premium bomber jackets 
              and denim, we've consistently delivered the pieces people actually want to wear.
            </p>
            <p className="text-gray-600 leading-relaxed">
              No compromises on authenticity. No inflated reseller prices. Just genuine products, carefully 
              curated and delivered straight to your doorstep.
            </p>
          </div>

          {/* What We Offer */}
          <div className="border-l-4 border-black pl-8 py-2">
            <h2 className="text-2xl font-medium text-black mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Sneakers</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• All major brands available</li>
                  <li>• Limited edition releases</li>
                  <li>• Classic and modern styles</li>
                  <li>• Authenticity guaranteed</li>
                  <li>• Competitive pricing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-black mb-4">Jackets</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Premium quality materials</li>
                  <li>• All seasons collection</li>
                  <li>• Various styles and brands</li>
                  <li>• Perfect fit guarantee</li>
                  <li>• Durable and stylish</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Our Promise */}
          <div className="border-l-4 border-black pl-8 py-2">
            <h2 className="text-2xl font-medium text-black mb-6">Our Promise</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              At Walk Wyze, we're not just selling products — we're building a community of style-conscious 
              individuals who value authenticity and quality. Every pair of sneakers and every jacket in our 
              collection is carefully selected to ensure it meets our high standards.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe what you wear should reflect your personality and wisdom in choosing quality over 
              quantity. We're here to help you make smart style choices that last.
            </p>
          </div>

          {/* Brand Philosophy */}
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-medium text-black mb-4 text-center">Walk Wyze Philosophy</h2>
            <p className="text-gray-600 text-center leading-relaxed">
              "Walk with wisdom, dress with purpose. Your style should tell your story — we just provide 
              the authentic pieces to help you tell it better."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUsPage;