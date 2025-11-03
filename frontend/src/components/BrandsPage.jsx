import React from 'react';

const BrandsPage = () => {
  // First 4 static brands
  const staticBrands = [
    { 
      name: 'Nike', 
      logo: '/Nike.png', 
      path: '/nike' 
    },
    { 
      name: 'Adidas', 
      logo: '/adidas.png', 
      path: '/adidas' 
    },
    { 
      name: 'Puma', 
      logo: '/puma.png', 
      path: '/puma' 
    },
    { 
      name: 'Reebok', 
      logo: '/NewB.png', 
      path: '/newbalance' 
    }
  ];

  // Additional 4 brands for marquee only
  const marqueeBrands = [
    { 
      name: 'Under Armour', 
      logo: '/under.png', 
      path: '/under-armour' 
    },
    { 
      name: 'Fila', 
      logo: '/fila.png', 
      path: '/fila' 
    },
    { 
      name: 'Hoka', 
      logo: '/hoka.png', 
      path: '/hoka' 
    },
    { 
      name: 'Skechers', 
      logo: '/skechers.png', 
      path: '/skechers' 
    }
  ];

  const handleBrandClick = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-32 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Brands</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover products from your favorite brands
          </p>
        </div>

        {/* Static Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-16">
          {staticBrands.map((brand, index) => (
            <div
              key={index}
              onClick={() => handleBrandClick(brand.path)}
              className="bg-black rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-800 aspect-square overflow-hidden"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-cover p-4"
              />
            </div>
          ))}
        </div>

        {/* Marquee Animation Section - 80% Width on Desktop */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">More Brands</h2>
          <div className="relative overflow-hidden w-full md:w-4/5 mx-auto">
            {/* Marquee Container */}
            <div className="flex">
              {/* First Set - Visible */}
              <div className="flex animate-marquee-desktop flex-shrink-0">
                {marqueeBrands.map((brand, index) => (
                  <div
                    key={`marquee-${index}`}
                    onClick={() => handleBrandClick(brand.path)}
                    className="inline-flex bg-black rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-800 w-40 h-40 md:w-48 md:h-48 overflow-hidden flex-shrink-0 mx-3"
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-cover p-6"
                    />
                  </div>
                ))}
              </div>
              
              {/* Second Set - Duplicate for seamless loop */}
              <div className="flex animate-marquee-desktop flex-shrink-0">
                {marqueeBrands.map((brand, index) => (
                  <div
                    key={`marquee-duplicate-${index}`}
                    onClick={() => handleBrandClick(brand.path)}
                    className="inline-flex bg-black rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer border border-gray-800 w-40 h-40 md:w-48 md:h-48 overflow-hidden flex-shrink-0 mx-3"
                  >
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-cover p-6"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content - Moved up for mobile */}
        <div className="text-center mt-8 md:mt-16">
          <p className="text-gray-700 text-sm">
            Click on any brand to explore their products
          </p>
        </div>
      </div>

      {/* Add custom CSS for seamless marquee animation */}
      <style>{`
        @keyframes marqueeDesktop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-marquee-desktop {
          animation: marqueeDesktop 25s linear infinite;
        }
        
        /* Mobile - Full width, faster speed */
        @media (max-width: 768px) {
          @keyframes marqueeMobile {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .animate-marquee-desktop {
            animation: marqueeMobile 15s linear infinite;
          }
        }

        /* Pause animation on hover */
        .flex:hover .animate-marquee-desktop {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default BrandsPage;