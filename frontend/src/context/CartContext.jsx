import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      const savedWishlist = localStorage.getItem('wishlistItems');
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading cart/wishlist from localStorage:', error);
    }
  }, []);

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlistItems]);

  const showCartNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Enhanced Cart Functions
  const addToCart = (product) => {
    // Calculate final price with priority: discountedPrice > price > originalPrice
    const finalPrice = product.discountedPrice || product.price || product.originalPrice || 0;
    
    const cartItem = {
      id: product.id,
      title: product.title,
      brand: product.brand,
      size: product.size || "One Size",
      color: product.color || "Standard",
      image: product.image || product.images?.[0],
      price: finalPrice,
      originalPrice: product.originalPrice || product.price || finalPrice,
      discountedPrice: product.discountedPrice || null,
      discountPercent: product.discountPercent || null,
      hasDiscount: product.hasDiscount || false,
      quantity: 1,
      category: product.category || 'Shoes'
    };

    setCartItems(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id && item.size === cartItem.size);
      
      if (existingItem) {
        const updatedCart = prevCart.map(item =>
          item.id === product.id && item.size === cartItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        showCartNotification(`${product.title} quantity updated in cart!`);
        return updatedCart;
      } else {
        showCartNotification(`${product.title} added to cart!`);
        return [...prevCart, cartItem];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const removedItem = prevItems.find(item => item.id === id);
      const updatedItems = prevItems.filter(item => item.id !== id);
      
      if (removedItem) {
        showCartNotification(`${removedItem.title} removed from cart!`);
      }
      
      return updatedItems;
    });
  };

  const updateQuantity = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change)
            }
          : item
      )
    );
  };

  const setQuantity = (id, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.discountedPrice || item.price || item.originalPrice || 0;
      return total + (itemPrice * (item.quantity || 1));
    }, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    showCartNotification('Cart cleared successfully!');
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  // Enhanced Wishlist Functions
  const addToWishlist = (product) => {
    setWishlistItems(prevWishlist => {
      const existingItem = prevWishlist.find(item => item.id === product.id);
      if (existingItem) {
        showCartNotification(`${product.title} removed from wishlist!`);
        return prevWishlist.filter(item => item.id !== product.id);
      } else {
        const wishlistItem = {
          id: product.id,
          title: product.title,
          brand: product.brand,
          price: product.discountedPrice || product.price || product.originalPrice,
          originalPrice: product.originalPrice || product.price,
          discountedPrice: product.discountedPrice,
          discountPercent: product.discountPercent,
          hasDiscount: product.hasDiscount,
          image: product.image || product.images?.[0],
          category: product.category,
          size: product.size,
          color: product.color
        };
        
        showCartNotification(`${product.title} added to wishlist!`);
        return [...prevWishlist, wishlistItem];
      }
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(prevItems => {
      const removedItem = prevItems.find(item => item.id === id);
      const updatedItems = prevItems.filter(item => item.id !== id);
      
      if (removedItem) {
        showCartNotification(`${removedItem.title} removed from wishlist!`);
      }
      
      return updatedItems;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    showCartNotification('Wishlist cleared successfully!');
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  // Move item from wishlist to cart
  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  // Move item from cart to wishlist
  const moveToWishlist = (product) => {
    addToWishlist(product);
    removeFromCart(product.id);
  };

  const value = {
    // Cart
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    setQuantity,
    getCartCount,
    getCartTotal,
    clearCart,
    isInCart,
    
    // Wishlist
    wishlist: wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
    
    // Utility functions
    moveToCart,
    moveToWishlist,
    
    // Notification
    showNotification,
    notificationMessage
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Enhanced Notification Component */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};