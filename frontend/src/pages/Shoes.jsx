import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from "react-icons/fa";
import { useCart } from '../context/CartContext';

// Import data from ALL brand pages
import { nikeProducts } from './Nike';
import { adidasProducts } from './Adidas';
import { newBalanceProducts } from './NewBalance';
import { pumaProducts } from './Puma';
import { filaProducts } from './Fila';
import { underArmourProducts } from './UnderArmour';
import { hokaProducts } from './Hoka';
import { skechersProducts } from './Skechers';

const Shoes = () => {
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToWishlist, isInWishlist, addToCart } = useCart();

  // Combine ALL products from ALL brands with unique IDs
  const allShoesProducts = [
    ...nikeProducts.map(product => ({
      ...product,
      uniqueId: `nike-${product.id}`,
      brand: "Nike"
    })),
    ...adidasProducts.map(product => ({
      ...product,
      uniqueId: `adidas-${product.id}`,
      brand: "Adidas"
    })),
    ...newBalanceProducts.map(product => ({
      ...product,
      uniqueId: `nb-${product.id}`,
      brand: "New Balance"
    })),
    ...pumaProducts.map(product => ({
      ...product,
      uniqueId: `puma-${product.id}`,
      brand: "Puma"
    })),
    ...filaProducts.map(product => ({
      ...product,
      uniqueId: `fila-${product.id}`,
      brand: "Fila"
    })),
    ...underArmourProducts.map(product => ({
      ...product,
      uniqueId: `ua-${product.id}`,
      brand: "Under Armour"
    })),
    ...hokaProducts.map(product => ({
      ...product,
      uniqueId: `hoka-${product.id}`,
      brand: "Hoka"
    })),
    ...skechersProducts.map(product => ({
      ...product,
      uniqueId: `skechers-${product.id}`,
      brand: "Skechers"
    }))
  ];

  // UK sizes with EU equivalents
  const allSizes = [
    "All", 
    "6 (39)", "6.5 (40)", "7 (41)", "7.5 (42)", "8 (43)", 
    "8.5 (44)", "9 (45)", "9.5 (46)", "10 (47)", "10.5 (48)", 
    "11 (49)", "11.5 (50)", "12 (51)"
  ];

  // Auto slide effect for product detail page
  useEffect(() => {
    if (selectedProduct) {
      const interval = setInterval(() => {
        setSelectedImageIndex((prevIndex) => 
          prevIndex === selectedProduct.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [selectedProduct]);

  // Filter products based on size only
  const filteredProducts = selectedSize === "All" 
    ? allShoesProducts 
    : allShoesProducts.filter(product => {
        const selectedUKSize = selectedSize.split(' ')[0];
        return product.size === selectedUKSize;
      });

  // Get recommended products (excluding current selected product)
  const recommendedProducts = selectedProduct 
    ? allShoesProducts.filter(product => product.uniqueId !== selectedProduct.uniqueId).slice(0, 4)
    : [];

  const handleWishlist = (product) => {
    addToWishlist(product);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    window.scrollTo(0, 0);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setSelectedImageIndex(0);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.title} added to cart successfully!`);
  };

  const handleBuyNow = (product) => {
    addToCart(product);
    alert(`Proceeding to checkout with ${product.title}`);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  // If product detail page is open
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-white pt-8 pb-24 md:pb-8">
        <div className="max-w-[90%] lg:max-w-[80%] mx-auto">
          
          {/* Back Button */}
          <button
            onClick={closeProductDetail}
            className="flex items-center text-gray-600 hover:text-black mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Images Section */}
            <div>
              {/* Main Image with Auto Slide */}
              <div className="mb-4 relative">
                <img
                  src={selectedProduct.images[selectedImageIndex]}
                  alt={selectedProduct.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg transition-opacity duration-500"
                />
                
                {/* Image Counter */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {selectedImageIndex + 1} / {selectedProduct.images.length}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {selectedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImageIndex === index ? 'border-black scale-105' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${selectedProduct.title} ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-black mb-4">
                  {selectedProduct.title}
                </h2>
                
                <p className="text-2xl font-bold text-black mb-6">
                  Rs.{selectedProduct.originalPrice.toLocaleString()}.00
                </p>

                {/* Product Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-black mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons - Compact */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="flex-1 bg-white text-black border border-gray-300 hover:bg-gray-50 transition-colors font-medium py-3 px-4 rounded flex items-center justify-center space-x-2 hover:border-black"
                >
                  <FaShoppingCart size={14} />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => handleBuyNow(selectedProduct)}
                  className="flex-1 bg-black text-white hover:bg-gray-800 transition-colors font-medium py-3 px-4 rounded flex items-center justify-center space-x-2 hover:scale-105 transform duration-200"
                >
                  <FaBolt size={14} />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* You May Also Like Section with Marquee Animation */}
          {recommendedProducts.length > 0 && (
            <div className="border-t border-gray-200 pt-12 pb-8">
              <h2 className="text-2xl font-bold text-black mb-8 text-center">You May Also Like</h2>
              
              {/* Marquee Container */}
              <div className="relative overflow-hidden">
                <div className="flex animate-marquee space-x-4">
                  {recommendedProducts.map((product) => {
                    const inWishlist = isInWishlist(product.uniqueId);
                    
                    return (
                      <div key={product.uniqueId} className="bg-white border border-gray-200 flex flex-col hover:shadow-lg transition-shadow min-w-[280px] flex-shrink-0">
                        {/* Product Image - Clickable */}
                        <div className="relative flex-1 cursor-pointer" onClick={() => handleProductClick(product)}>
                          <img 
                            src={product.images[0]} 
                            alt={product.title}
                            className="w-full h-40 object-cover"
                          />
                          
                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWishlist(product);
                            }}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
                          >
                            {inWishlist ? (
                              <FaHeart className="text-red-500" size={14} />
                            ) : (
                              <FaRegHeart className="text-white" size={14} />
                            )}
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-3 text-center flex flex-col justify-center flex-1">
                          <h3 className="font-bold text-black text-sm mb-1">{product.title}</h3>
                          <p className="text-gray-600 text-xs mb-1">UK {product.size}</p>
                          <p className="text-black font-bold text-sm mb-2">Rs.{product.originalPrice.toLocaleString()}.00</p>

                          {/* Action Buttons - Compact */}
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              className="flex-1 bg-white text-black border border-gray-300 hover:bg-gray-50 transition-colors font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 hover:border-black"
                            >
                              <FaShoppingCart size={10} />
                              <span>Cart</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyNow(product);
                              }}
                              className="flex-1 bg-black text-white hover:bg-gray-800 transition-colors font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 hover:scale-105 transform duration-200"
                            >
                              <FaBolt size={10} />
                              <span>Buy</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main products listing page (1st page - WITHOUT action buttons)
  return (
    <div className="min-h-screen bg-white pt-8 pb-24 md:pb-8">
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto">
        
        {/* Page Header with Description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">All Shoes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the complete collection of footwear from all top brands. 
            From running shoes to casual sneakers, find your perfect pair from our extensive selection.
          </p>
        </div>

        {/* Size Filter Only - NO GENDER FILTER */}
        <div className="mb-8 text-center">
          <h3 className="text-lg font-semibold text-black mb-3">Filter by Size</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {allSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-3 py-2 rounded border text-sm ${
                  selectedSize === size
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-300'
                }`}
              >
                {size === "All" ? "All Sizes" : size}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - WITHOUT ACTION BUTTONS - Mobile: 2 columns */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredProducts.map((product) => {
            const inWishlist = isInWishlist(product.uniqueId);
            
            return (
              <div key={product.uniqueId} className="bg-white border border-gray-200 flex flex-col">
                {/* Product Image - Clickable */}
                <div className="relative flex-1 cursor-pointer" onClick={() => handleProductClick(product)}>
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlist(product);
                    }}
                    className="absolute top-2 right-2 bg-black rounded-full p-2"
                  >
                    {inWishlist ? (
                      <FaHeart className="text-red-500" size={16} />
                    ) : (
                      <FaRegHeart className="text-white" size={16} />
                    )}
                  </button>
                </div>

                {/* Product Info - WITHOUT ACTION BUTTONS */}
                <div className="p-4 text-center flex flex-col justify-center flex-1">
                  <h3 className="font-bold text-black text-lg mb-1">{product.title}</h3>
                  <div className="flex justify-center items-center gap-2 mb-2">
                    <p className="text-gray-600 text-xs">UK {product.size}</p>
                    <span className="text-gray-300 text-xs">•</span>
                    <p className="text-gray-600 text-xs">{product.gender}'s</p>
                  </div>
                  <p className="text-black font-bold text-base">Rs.{product.originalPrice.toLocaleString()}.00</p>
                  {/* NO ACTION BUTTONS HERE - Just like other pages 1st page */}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No shoes found for {selectedSize !== "All" ? `size ${selectedSize}` : "selected filters"}</p>
            <button
              onClick={() => setSelectedSize("All")}
              className="bg-black text-white px-6 py-2 rounded mt-4"
            >
              Show All Shoes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shoes;