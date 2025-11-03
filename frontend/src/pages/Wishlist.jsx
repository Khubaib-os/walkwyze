import React from "react";
import { motion } from "framer-motion";
import { FaHeart, FaShoppingCart, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useCart();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4">
      <div className="max-w-[80%] mx-auto">
        
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button 
              onClick={handleContinueShopping}
              className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors text-sm"
            >
              <FaArrowLeft size={14} />
              <span className="text-xs">Back</span>
            </button>
            <h1 className="text-lg font-bold text-black">Wishlist</h1>
            <div className="w-12"></div>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={handleContinueShopping}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
              >
                <FaArrowLeft />
                <span>Continue Shopping</span>
              </button>
              <h1 className="text-3xl font-bold text-black">My Wishlist</h1>
              <div className="w-24"></div>
            </div>
          </div>

          {/* Wishlist Count */}
          {wishlistItems.length > 0 && (
            <motion.p 
              className="text-gray-600 text-sm md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </motion.p>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          // Empty Wishlist State
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-12 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <FaHeart className="text-pink-500 text-3xl md:text-4xl" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-600 mb-2 md:mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 text-sm md:text-base mb-6 md:mb-8 max-w-md mx-auto">
              Save your favorite items here to easily find them later
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-black text-white px-6 md:px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm md:text-base hover:scale-105 transform duration-200"
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((product, index) => {
                const discountedPrice = product.originalPrice - (product.originalPrice * product.discount) / 100;
                
                return (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 md:h-56 object-cover"
                      />
                      
                      {/* Discount Badge */}
                      <div className="absolute top-3 left-3 bg-black text-white px-2 py-1 rounded text-xs font-bold">
                        {product.discount}% OFF
                      </div>
                      
                      {/* Remove from Wishlist Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-red-50 transition-colors shadow-lg hover:scale-110 transform duration-200"
                        title="Remove from Wishlist"
                      >
                        <FaTrash className="text-red-500" size={14} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-sm md:text-base text-black line-clamp-2 mb-1 leading-tight">
                          {product.title}
                        </h3>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg md:text-xl font-bold text-black">
                            PKR {discountedPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            PKR {product.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Size & Color Info */}
                      <div className="flex items-center space-x-2 mb-4 text-xs text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Size: {product.size}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Color: {product.color}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMoveToCart(product)}
                          className="flex-1 bg-black text-white hover:bg-gray-800 transition-colors font-medium py-2 px-3 rounded text-xs flex items-center justify-center space-x-1"
                        >
                          <FaShoppingCart size={10} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Wishlist Summary */}
            <motion.div
              className="mt-6 md:mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-semibold text-black">
                    {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                  </h3>
                  <p className="text-gray-600 text-sm">Ready to move to cart?</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleContinueShopping}
                    className="bg-gray-100 text-gray-800 px-4 md:px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => {
                      // Add all wishlist items to cart
                      wishlistItems.forEach(product => handleMoveToCart(product));
                    }}
                    className="bg-black text-white px-4 md:px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    Add All to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;