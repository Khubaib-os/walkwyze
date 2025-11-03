import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      review: "Mocha 1s ka suede bohot smooth tha, pair biikul legit tha. Highly satisfied bro 💺",
      name: "Ahsan Iqbal",
      city: "Islamabad"
    },
    {
      id: 2,
      review: "Lightning fast delivery! Ordered on Friday, received on Sunday. Quality is exceptional!",
      name: "Ali Raza",
      city: "Lahore"
    },
    {
      id: 3,
      review: "100% authentic products. Customer support team is very helpful and responsive.",
      name: "Sara Khan",
      city: "Karachi"
    },
    {
      id: 4,
      review: "Best place for hype sneakers. Always get the latest drops before anyone else!",
      name: "Bilal Ahmed",
      city: "Islamabad"
    },
    {
      id: 5,
      review: "Quality exceeds expectations. Prices are very reasonable for such premium products.",
      name: "Fatima Noor",
      city: "Rawalpindi"
    },
    {
      id: 6,
      review: "24/7 support actually works! Got help with sizing at 2 AM. Amazing service!",
      name: "Usman Malik",
      city: "Faisalabad"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Mobile auto-slide effect
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  return (
    <div className="bg-white py-12 mb-16"> {/* Added bottom margin */}
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-3">
            Customer Reviews
          </h2>
          <p className="text-gray-600">
            See what our customers are saying about us
          </p>
        </div>

        {/* Desktop - Marquee Animation */}
        <div className="hidden md:block relative overflow-hidden py-2">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10" />
          
          {/* Marquee Content */}
          <div className="flex space-x-4 animate-marquee-fast whitespace-nowrap">
            {/* First Set */}
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="inline-flex flex-col bg-white rounded-lg p-4 w-[300px] flex-shrink-0 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Star Rating */}
                <div className="flex justify-center mb-3">
                  <span className="text-yellow-500 text-sm">★★★★★</span>
                </div>
                
                {/* Review Text with proper line breaks */}
                <p className="text-gray-700 text-sm leading-relaxed mb-3 text-center whitespace-normal break-words">
                  "{testimonial.review}"
                </p>
                
                {/* Customer Info */}
                <div className="text-center mt-auto">
                  <p className="text-black font-semibold text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {testimonial.city}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Duplicate Set for Seamless Loop */}
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id + testimonials.length}
                className="inline-flex flex-col bg-white rounded-lg p-4 w-[300px] flex-shrink-0 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-3">
                  <span className="text-yellow-500 text-sm">★★★★★</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-3 text-center whitespace-normal break-words">
                  "{testimonial.review}"
                </p>
                <div className="text-center mt-auto">
                  <p className="text-black font-semibold text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {testimonial.city}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile - Single Card Carousel */}
        <div className="md:hidden">
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-[320px] border border-gray-200 shadow-sm">
              {/* Star Rating */}
              <div className="flex justify-center mb-4">
                <span className="text-yellow-500 text-lg">★★★★★</span>
              </div>
              
              {/* Review Text */}
              <p className="text-gray-700 text-base leading-relaxed mb-4 text-center whitespace-normal break-words">
                "{testimonials[currentIndex].review}"
              </p>
              
              {/* Customer Info */}
              <div className="text-center">
                <p className="text-black font-semibold text-base">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-gray-500 text-sm">
                  {testimonials[currentIndex].city}
                </p>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-4 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-black' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add custom CSS for marquee animation */}
      <style>{`
        @keyframes marquee-fast {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee-fast {
          animation: marquee-fast 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;