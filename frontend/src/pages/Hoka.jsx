import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from "react-icons/fa";
import { useCart } from '../context/CartContext';
import { setDetailPageOpen } from '../App';
import { useNavigate } from "react-router-dom";
import { supabase } from '../supabase';

// Export Hoka products array for use in other components
let hokaProducts = [];

const Hoka = () => {
  const [products, setProducts] = useState([]);
  const [jackets, setJackets] = useState([]);
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [jacketsLoading, setJacketsLoading] = useState(true);
  const { addToWishlist, isInWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  // UK sizes with EU equivalents
  const allSizes = [
    "All", 
    "6 (39)", "6.5 (40)", "7 (41)", "7.5 (42)", "8 (43)", 
    "8.5 (44)", "9 (45)", "9.5 (46)", "10 (47)", "10.5 (48)", 
    "11 (49)", "11.5 (50)", "12 (51)"
  ];

  // Fetch Hoka products from Supabase
  const fetchHokaProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hoka_products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform Supabase data to match frontend format
      const transformedProducts = data.map(product => ({
        id: product.id,
        uniqueId: `hoka-${product.id}`,
        title: product.title,
        originalPrice: product.original_price,
        discountPrice: product.discount_price,
        discountPercent: product.discount_percent,
        images: product.images || [],
        size: product.size,
        gender: product.gender,
        brand: "Hoka",
        description: product.description,
        hasDiscount: product.has_discount,
        is_sold_out: product.is_sold_out || false
      }));
      
      // Update both local state and exported variable
      hokaProducts = transformedProducts;
      setProducts(transformedProducts);
    } catch (error) {
      console.error('Error fetching Hoka products:', error);
      hokaProducts = [];
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Hoka jackets from jackets table
  const fetchHokaJackets = async () => {
    try {
      setJacketsLoading(true);
      const { data, error } = await supabase
        .from('jackets_products')
        .select('*')
        .eq('is_active', true)
        .eq('brand', 'Hoka')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform jackets data
      const transformedJackets = data.map(jacket => ({
        id: jacket.id,
        uniqueId: `jacket-${jacket.id}`,
        title: jacket.title,
        originalPrice: jacket.original_price,
        discountPrice: jacket.discount_price,
        discountPercent: jacket.discount_percent,
        images: jacket.images || [],
        size: jacket.size || "M",
        gender: jacket.gender,
        brand: jacket.brand,
        description: jacket.description,
        hasDiscount: jacket.has_discount,
        is_sold_out: jacket.is_sold_out || false,
        productType: "jackets",
        measurements: jacket.measurements || {
          height: "28 inches",
          width: "22 inches"
        }
      }));
      
      setJackets(transformedJackets);
    } catch (error) {
      console.error('Error fetching Hoka jackets:', error);
      setJackets([]);
    } finally {
      setJacketsLoading(false);
    }
  };

  useEffect(() => {
    fetchHokaProducts();
    fetchHokaJackets();
  }, []);

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

  // Show success message
  const showMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  // Filter products based on size only (gender filter removed)
  const filteredProducts = products.filter(product => {
    const sizeMatch = selectedSize === "All" || product.size === selectedSize.split(' ')[0];
    return sizeMatch;
  });

  // Get recommended products (excluding current selected product)
  const recommendedProducts = selectedProduct 
    ? products.filter(product => product.uniqueId !== selectedProduct.uniqueId).slice(0, 4)
    : [];

  const handleWishlist = (product) => {
    addToWishlist(product);
    showMessage(`${product.title} ${isInWishlist(product.uniqueId) ? 'removed from' : 'added to'} wishlist!`);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setDetailPageOpen(true);
    window.scrollTo(0, 0);
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    setSelectedImageIndex(0);
    setDetailPageOpen(false);
  };

  // Updated handleAddToCart with sold out check
  const handleAddToCart = (product) => {
    if (product.is_sold_out) {
      showMessage('This item is currently sold out!');
      return;
    }

    const finalPrice = product.hasDiscount ? product.discountPrice : product.originalPrice;
    
    const cartProduct = {
      ...product,
      price: finalPrice,
      quantity: 1,
      image: product.images[0]
    };
    addToCart(cartProduct);
    showMessage(`${product.title} added to cart!`);
  };

  // Updated handleBuyNow with sold out check
  const handleBuyNow = (product) => {
    if (product.is_sold_out) {
      showMessage('This item is currently sold out!');
      return;
    }

    const finalPrice = product.hasDiscount ? product.discountPrice : product.originalPrice;
    
    const cartProduct = {
      ...product,
      price: finalPrice,
      quantity: 1,
      image: product.images[0]
    };
    addToCart(cartProduct);
    navigate('/cart');
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  // Handle jacket click to navigate to jackets page
  const handleJacketClick = () => {
    navigate('/jackets?brand=Hoka');
  };

  // Handle jacket product click (open detail page)
  const handleJacketProductClick = (jacket) => {
    // Convert jacket to product format for detail page
    const jacketProduct = {
      ...jacket,
      id: jacket.uniqueId,
      size: "M" // Default size for jackets
    };
    setSelectedProduct(jacketProduct);
    setSelectedImageIndex(0);
    setDetailPageOpen(true);
    window.scrollTo(0, 0);
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
                
                {/* Discount Badge - Only show if product has discount */}
                {selectedProduct.hasDiscount && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {selectedProduct.discountPercent}% OFF
                  </div>
                )}
                
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
                
                {/* Price Section with Discount */}
                <div className="mb-6">
                  {selectedProduct.hasDiscount ? (
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-bold text-black">
                        Rs.{selectedProduct.discountPrice.toLocaleString()}.00
                      </p>
                      <p className="text-lg text-gray-500 line-through">
                        Rs.{selectedProduct.originalPrice.toLocaleString()}.00
                      </p>
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        Save {selectedProduct.discountPercent}%
                      </span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-black">
                      Rs.{selectedProduct.originalPrice.toLocaleString()}.00
                    </p>
                  )}
                </div>

                {/* Size and Gender Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span>UK {selectedProduct.size}</span>
                    <span className="text-gray-300">•</span>
                    <span>{selectedProduct.gender}'s</span>
                  </div>
                </div>

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
                  disabled={selectedProduct.is_sold_out}
                  className={`flex-1 border font-medium py-3 px-4 rounded flex items-center justify-center space-x-2 transition-colors ${
                    selectedProduct.is_sold_out
                      ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-black'
                  }`}
                >
                  <FaShoppingCart size={14} />
                  <span>{selectedProduct.is_sold_out ? 'Sold Out' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={() => handleBuyNow(selectedProduct)}
                  disabled={selectedProduct.is_sold_out}
                  className={`flex-1 font-medium py-3 px-4 rounded flex items-center justify-center space-x-2 transition-colors ${
                    selectedProduct.is_sold_out
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800 hover:scale-105 transform duration-200'
                  }`}
                >
                  <FaBolt size={14} />
                  <span>{selectedProduct.is_sold_out ? 'Sold Out' : 'Buy Now'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* You May Also Like Section with Marquee Animation - FIXED */}
          {recommendedProducts.length > 0 && (
            <div className="border-t border-gray-200 pt-12 pb-8">
              <h2 className="text-2xl font-bold text-black mb-8 text-center">You May Also Like</h2>
              
              {/* Marquee Container - FIXED ANIMATION */}
              <div className="marquee-container relative overflow-hidden w-full">
                <div className="marquee-content flex">
                  {/* First Set - Visible */}
                  <div className="flex animate-marquee flex-shrink-0">
                    {recommendedProducts.map((product) => {
                      const inWishlist = isInWishlist(product.uniqueId);
                      
                      return (
                        <div key={product.uniqueId} className="bg-white border border-gray-200 flex flex-col hover:shadow-lg transition-shadow min-w-[280px] flex-shrink-0 mx-3">
                          {/* Product Image - Clickable */}
                          <div className="relative flex-1 cursor-pointer" onClick={() => handleProductClick(product)}>
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="w-full h-40 object-cover"
                            />
                            
                            {/* Discount Badge - Only show if product has discount */}
                            {product.hasDiscount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                {product.discountPercent}% OFF
                              </div>
                            )}
                            
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
                            <div className="flex justify-center items-center gap-2 mb-1">
                              <p className="text-gray-600 text-xs">UK {product.size}</p>
                              <span className="text-gray-300 text-xs">•</span>
                              <p className="text-gray-600 text-xs">{product.gender}'s</p>
                            </div>
                            
                            {/* Price with Discount */}
                            {product.hasDiscount ? (
                              <div className="mb-2">
                                <p className="text-black font-bold text-sm">
                                  Rs.{product.discountPrice.toLocaleString()}.00
                                </p>
                                <p className="text-gray-500 text-xs line-through">
                                  Rs.{product.originalPrice.toLocaleString()}.00
                                </p>
                              </div>
                            ) : (
                              <p className="text-black font-bold text-sm mb-2">
                                Rs.{product.originalPrice.toLocaleString()}.00
                              </p>
                            )}

                            {/* Action Buttons - Compact */}
                            <div className="flex space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                                disabled={product.is_sold_out}
                                className={`flex-1 border font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors ${
                                  product.is_sold_out
                                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-black'
                                }`}
                              >
                                <FaShoppingCart size={10} />
                                <span>{product.is_sold_out ? 'Sold Out' : 'Cart'}</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyNow(product);
                                }}
                                disabled={product.is_sold_out}
                                className={`flex-1 font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors ${
                                  product.is_sold_out
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800 hover:scale-105 transform duration-200'
                                }`}
                              >
                                <FaBolt size={10} />
                                <span>{product.is_sold_out ? 'Sold Out' : 'Buy'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Second Set - Duplicate for seamless loop */}
                  <div className="flex animate-marquee flex-shrink-0">
                    {recommendedProducts.map((product) => {
                      const inWishlist = isInWishlist(product.uniqueId);
                      
                      return (
                        <div key={`duplicate-${product.uniqueId}`} className="bg-white border border-gray-200 flex flex-col hover:shadow-lg transition-shadow min-w-[280px] flex-shrink-0 mx-3">
                          {/* Product Image - Clickable */}
                          <div className="relative flex-1 cursor-pointer" onClick={() => handleProductClick(product)}>
                            <img 
                              src={product.images[0]} 
                              alt={product.title}
                              className="w-full h-40 object-cover"
                            />
                            
                            {/* Discount Badge - Only show if product has discount */}
                            {product.hasDiscount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                {product.discountPercent}% OFF
                              </div>
                            )}
                            
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
                            <div className="flex justify-center items-center gap-2 mb-1">
                              <p className="text-gray-600 text-xs">UK {product.size}</p>
                              <span className="text-gray-300 text-xs">•</span>
                              <p className="text-gray-600 text-xs">{product.gender}'s</p>
                            </div>
                            
                            {/* Price with Discount */}
                            {product.hasDiscount ? (
                              <div className="mb-2">
                                <p className="text-black font-bold text-sm">
                                  Rs.{product.discountPrice.toLocaleString()}.00
                                </p>
                                <p className="text-gray-500 text-xs line-through">
                                  Rs.{product.originalPrice.toLocaleString()}.00
                                </p>
                              </div>
                            ) : (
                              <p className="text-black font-bold text-sm mb-2">
                                Rs.{product.originalPrice.toLocaleString()}.00
                              </p>
                            )}

                            {/* Action Buttons - Compact */}
                            <div className="flex space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                                disabled={product.is_sold_out}
                                className={`flex-1 border font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors ${
                                  product.is_sold_out
                                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-black'
                                }`}
                              >
                                <FaShoppingCart size={10} />
                                <span>{product.is_sold_out ? 'Sold Out' : 'Cart'}</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyNow(product);
                                }}
                                disabled={product.is_sold_out}
                                className={`flex-1 font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors ${
                                  product.is_sold_out
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800 hover:scale-105 transform duration-200'
                                }`}
                              >
                                <FaBolt size={10} />
                                <span>{product.is_sold_out ? 'Sold Out' : 'Buy'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add custom CSS for marquee animation */}
        <style>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          
          /* Mobile - Full width, faster speed */
          @media (max-width: 768px) {
            .animate-marquee {
              animation: marquee 20s linear infinite;
            }
          }

          /* Pause animation on hover */
          .marquee-container:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    );
  }

  // Main products listing page
  return (
    <>
      <div className="min-h-screen bg-white pt-8 pb-24 md:pb-8">
        <div className="max-w-[90%] lg:max-w-[80%] mx-auto">
          
          {/* Page Header with Description */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-4">Hoka</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Time to Fly. Discover the latest Hoka performance footwear featuring maximal cushioning, 
              lightweight design, and innovative technologies for runners and athletes of all levels.
            </p>
          </div>

          {/* Size Filter Only - Gender Filter Removed */}
          <div className="mb-8 text-center">
            <h3 className="text-lg font-semibold text-black mb-3">Size</h3>
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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading Hoka products...</p>
            </div>
          )}

          {/* Products Grid - Mobile: 2 columns with more width */}
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {filteredProducts.map((product) => {
                const inWishlist = isInWishlist(product.uniqueId);
                
                return (
                  <div key={product.uniqueId} className="bg-white border border-gray-200 flex flex-col hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProductClick(product)}>
                    
                    {/* Product Image - Clickable */}
                    <div className="relative flex-1">
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Discount Badge - Only show if product has discount */}
                      {product.hasDiscount && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {product.discountPercent}% OFF
                        </div>
                      )}
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWishlist(product);
                        }}
                        className="absolute top-2 right-2 bg-black rounded-full p-2 hover:bg-gray-800 transition-colors"
                      >
                        {inWishlist ? (
                          <FaHeart className="text-red-500" size={16} />
                        ) : (
                          <FaRegHeart className="text-white" size={16} />
                        )}
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 text-center flex flex-col justify-center flex-1">
                      <h3 className="font-bold text-black text-lg mb-1">{product.title}</h3>
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <p className="text-gray-600 text-xs">UK {product.size}</p>
                        <span className="text-gray-300 text-xs">•</span>
                        <p className="text-gray-600 text-xs">{product.gender}'s</p>
                      </div>
                      
                      {/* Price with Discount */}
                      {product.hasDiscount ? (
                        <div className="mb-3">
                          <p className="text-black font-bold text-base">
                            Rs.{product.discountPrice.toLocaleString()}.00
                          </p>
                          <p className="text-gray-500 text-sm line-through">
                            Rs.{product.originalPrice.toLocaleString()}.00
                          </p>
                        </div>
                      ) : (
                        <p className="text-black font-bold text-base mb-3">
                          Rs.{product.originalPrice.toLocaleString()}.00
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No products found for {selectedSize !== "All" ? `size ${selectedSize}` : "selected filters"}</p>
              <button
                onClick={() => setSelectedSize("All")}
                className="bg-black text-white px-6 py-2 rounded mt-4"
              >
                Show All Products
              </button>
            </div>
          )}

          {/* Hoka Jackets Section with Marquee Animation - SAME AS OTHER BRANDS */}
          {!jacketsLoading && jackets.length > 0 && (
            <div className="border-t border-gray-200 pt-12 pb-8 mt-12">
              {/* Centered Heading */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-black mb-2">Hoka Jackets</h2>
                <p className="text-gray-600 text-sm">
                  Explore our premium Hoka jacket collection
                </p>
              </div>
              
              {/* Marquee Container */}
              <div className="marquee-container relative overflow-hidden w-full">
                <div className="marquee-content flex">
                  {/* First Set - Visible */}
                  <div className="flex animate-marquee flex-shrink-0">
                    {jackets.slice(0, 4).map((jacket) => {
                      const inWishlist = isInWishlist(jacket.uniqueId);
                      
                      return (
                        <div key={`jacket-${jacket.id}`} className="bg-white border border-gray-200 flex flex-col hover:shadow-lg transition-shadow min-w-[280px] flex-shrink-0 mx-3">
                          {/* Jacket Image - Clickable */}
                          <div className="relative flex-1 cursor-pointer" onClick={() => handleJacketProductClick(jacket)}>
                            <img 
                              src={jacket.images[0]} 
                              alt={jacket.title}
                              className="w-full h-40 object-cover"
                            />
                            
                            {/* Discount Badge - Only show if jacket has discount */}
                            {jacket.hasDiscount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                {jacket.discountPercent}% OFF
                              </div>
                            )}
                            
                            {/* Wishlist Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWishlist(jacket);
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

                          {/* Jacket Info */}
                          <div className="p-3 text-center flex flex-col justify-center flex-1">
                            <h3 className="font-bold text-black text-sm mb-1">{jacket.title}</h3>
                            <div className="flex justify-center items-center gap-2 mb-1">
                              <p className="text-gray-600 text-xs">{jacket.brand}</p>
                              <span className="text-gray-300 text-xs">•</span>
                              <p className="text-gray-600 text-xs">{jacket.gender}'s</p>
                            </div>
                            
                            {/* Measurements Display - SAME AS OTHER BRANDS */}
                            <div className="flex justify-center items-center gap-3 mb-2">
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Height</p>
                                <p className="text-xs font-semibold text-black">{jacket.measurements.height}</p>
                              </div>
                              <span className="text-gray-300 text-xs">|</span>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Width</p>
                                <p className="text-xs font-semibold text-black">{jacket.measurements.width}</p>
                              </div>
                            </div>
                            
                            {/* Price with Discount */}
                            {jacket.hasDiscount ? (
                              <div className="mb-2">
                                <p className="text-black font-bold text-sm">
                                  Rs.{jacket.discountPrice.toLocaleString()}.00
                                </p>
                                <p className="text-gray-500 text-xs line-through">
                                  Rs.{jacket.originalPrice.toLocaleString()}.00
                                </p>
                              </div>
                            ) : (
                              <p className="text-black font-bold text-sm mb-2">
                                Rs.{jacket.originalPrice.toLocaleString()}.00
                              </p>
                            )}

                            {/* Action Buttons - Compact */}
                            <div className="flex space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(jacket);
                                }}
                                disabled={jacket.is_sold_out}
                                className={`flex-1 border font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors ${
                                  jacket.is_sold_out
                                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-black'
                                }`}
                              >
                                <FaShoppingCart size={10} />
                                <span>{jacket.is_sold_out ? 'Sold Out' : 'Cart'}</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyNow(jacket);
                                }}
                                disabled={jacket.is_sold_out}
                                className={`flex-1 font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors ${
                                  jacket.is_sold_out
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800 hover:scale-105 transform duration-200'
                                }`}
                              >
                                <FaBolt size={10} />
                                <span>{jacket.is_sold_out ? 'Sold Out' : 'Buy'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Second Set - Duplicate for seamless loop */}
                  <div className="flex animate-marquee flex-shrink-0">
                    {jackets.slice(0, 4).map((jacket) => {
                      const inWishlist = isInWishlist(jacket.uniqueId);
                      
                      return (
                        <div key={`jacket-duplicate-${jacket.id}`} className="bg-white border border-gray-200 flex flex-col hover:shadow-lg transition-shadow min-w-[280px] flex-shrink-0 mx-3">
                          {/* Jacket Image - Clickable */}
                          <div className="relative flex-1 cursor-pointer" onClick={() => handleJacketProductClick(jacket)}>
                            <img 
                              src={jacket.images[0]} 
                              alt={jacket.title}
                              className="w-full h-40 object-cover"
                            />
                            
                            {/* Discount Badge - Only show if jacket has discount */}
                            {jacket.hasDiscount && (
                              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                                {jacket.discountPercent}% OFF
                              </div>
                            )}
                            
                            {/* Wishlist Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWishlist(jacket);
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

                          {/* Jacket Info */}
                          <div className="p-3 text-center flex flex-col justify-center flex-1">
                            <h3 className="font-bold text-black text-sm mb-1">{jacket.title}</h3>
                            <div className="flex justify-center items-center gap-2 mb-1">
                              <p className="text-gray-600 text-xs">{jacket.brand}</p>
                              <span className="text-gray-300 text-xs">•</span>
                              <p className="text-gray-600 text-xs">{jacket.gender}'s</p>
                            </div>
                            
                            {/* Measurements Display - SAME AS OTHER BRANDS */}
                            <div className="flex justify-center items-center gap-3 mb-2">
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Height</p>
                                <p className="text-xs font-semibold text-black">{jacket.measurements.height}</p>
                              </div>
                              <span className="text-gray-300 text-xs">|</span>
                              <div className="text-center">
                                <p className="text-xs text-gray-500">Width</p>
                                <p className="text-xs font-semibold text-black">{jacket.measurements.width}</p>
                              </div>
                            </div>
                            
                            {/* Price with Discount */}
                            {jacket.hasDiscount ? (
                              <div className="mb-2">
                                <p className="text-black font-bold text-sm">
                                  Rs.{jacket.discountPrice.toLocaleString()}.00
                                </p>
                                <p className="text-gray-500 text-xs line-through">
                                  Rs.{jacket.originalPrice.toLocaleString()}.00
                                </p>
                              </div>
                            ) : (
                              <p className="text-black font-bold text-sm mb-2">
                                Rs.{jacket.originalPrice.toLocaleString()}.00
                              </p>
                            )}

                            {/* Action Buttons - Compact */}
                            <div className="flex space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(jacket);
                                }}
                                disabled={jacket.is_sold_out}
                                className={`flex-1 border font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors ${
                                  jacket.is_sold_out
                                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                    : 'bg-white text-black border-gray-300 hover:bg-gray-50 hover:border-black'
                                }`}
                              >
                                <FaShoppingCart size={10} />
                                <span>{jacket.is_sold_out ? 'Sold Out' : 'Cart'}</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBuyNow(jacket);
                                }}
                                disabled={jacket.is_sold_out}
                                className={`flex-1 font-medium py-1 px-1 rounded text-xs flex items-center justify-center space-x-1 transition-colors ${
                                  jacket.is_sold_out
                                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-gray-800 hover:scale-105 transform duration-200'
                                }`}
                              >
                                <FaBolt size={10} />
                                <span>{jacket.is_sold_out ? 'Sold Out' : 'Buy'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* View All Button - Centered */}
              <div className="text-center mt-6">
                <button
                  onClick={handleJacketClick}
                  className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
                >
                  View All Jackets
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Message Popup */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {successMessage}
        </div>
      )}

      {/* Add custom CSS for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        /* Mobile - Full width, faster speed */
        @media (max-width: 768px) {
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        }

        /* Pause animation on hover */
        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
};

export { hokaProducts };
export default Hoka;