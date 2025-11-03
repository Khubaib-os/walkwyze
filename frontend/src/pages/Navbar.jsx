import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search,
  X,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { getCartCount, getWishlistCount } = useCart();
  const { searchProducts, getSearchSuggestions, loading } = useSearch();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Mini navbar categories with icons
  const miniNavItems = [
    { name: 'Shoes', icon: '👟', path: '/shoes' },
    { name: 'Jackets', icon: '🧥', path: '/jackets' },
    { name: 'Pants', icon: '👖', path: '/pants' },
    { name: 'Shirts', icon: '👔', path: '/shirts' }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save search to recent searches
  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query,
      ...recentSearches.filter(search => search !== query)
    ].slice(0, 5); // Keep only 5 most recent
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveToRecentSearches(searchQuery.trim());
      
      // Navigate to search results page
      navigate('/search', { 
        state: { 
          query: searchQuery.trim(),
          results: searchProducts(searchQuery.trim())
        }
      });
      
      setSearchFocused(false);
      setIsSearchExpanded(false);
      setSearchQuery('');
    }
  };

  const handleQuickSearch = (suggestion) => {
    setSearchQuery(suggestion);
    saveToRecentSearches(suggestion);
    
    navigate('/search', { 
      state: { 
        query: suggestion,
        results: searchProducts(suggestion)
      }
    });
    
    setSearchFocused(false);
    setIsSearchExpanded(false);
  };

  const toggleSearchExpand = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setSearchFocused(true);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Redirect functions using React Router
  const handleProfileLogin = () => {
    navigate('/login');
  };

  const handleCartRedirect = () => {
    navigate('/cart');
  };

  const handleFavouriteRedirect = () => {
    navigate('/favourites');
  };

  const handleNavigation = (item) => {
    const route = item.toLowerCase();
    navigate(`/${route}`);
  };

  const handleMiniNavClick = (path) => {
    navigate(path);
  };

  const handleHomeRedirect = () => {
    navigate('/');
  };

  // Get actual search suggestions
  const searchSuggestions = getSearchSuggestions(searchQuery);

  // Search dropdown component
  const renderSearchDropdown = () => (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-40 overflow-hidden">
      {/* Recent Searches */}
      {recentSearches.length > 0 && !searchQuery && (
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-500" />
              <p className="text-xs font-medium text-gray-700">Recent Searches</p>
            </div>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) => (
              <div 
                key={index}
                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors group"
                onClick={() => handleQuickSearch(search)}
              >
                <Clock size={14} className="text-gray-400 mr-2" />
                <span className="text-sm flex-1">{search}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = recentSearches.filter((_, i) => i !== index);
                    setRecentSearches(updated);
                    localStorage.setItem('recentSearches', JSON.stringify(updated));
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popular Searches when no query */}
      {!searchQuery && recentSearches.length === 0 && (
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-gray-500" />
            <p className="text-xs font-medium text-gray-700">Popular Searches</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Nike Shoes', 'Adidas Jackets', 'Puma Pants', 'Sports Shirts', 'Running Shoes'].map((item, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(item)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-700 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {searchQuery && (
        <>
          <div className="p-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 font-medium">
              Search Suggestions
            </p>
          </div>
          <div className="p-1 max-h-60 overflow-y-auto">
            {searchSuggestions.length > 0 ? (
              searchSuggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                  onClick={() => handleQuickSearch(suggestion)}
                >
                  <Search className="text-gray-400 mr-2" size={14} />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No suggestions found for "{searchQuery}"
              </div>
            )}
          </div>
        </>
      )}

      {/* Search Button for Mobile */}
      {searchQuery && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleSearch}
            className="w-full bg-black text-white py-2 px-4 rounded text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Search size={16} />
            Search for "{searchQuery}"
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="w-full font-sans">
        {/* Mobile Top Section */}
        <div className="md:hidden bg-white">
          {/* Expanded Search Bar - Top when active */}
          {isSearchExpanded && (
            <div className="w-full bg-white px-4 py-3 border-b border-gray-200" ref={searchRef}>
              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <div className="flex rounded-full bg-gray-100 overflow-hidden shadow-sm border border-transparent focus-within:border-gray-300">
                      {/* Search Input - Simple without category dropdown */}
                      <div className="flex-1 flex items-center">
                        <input
                          type="text"
                          placeholder="Search products, brands, categories..."
                          className="flex-1 pl-4 pr-4 py-2 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm w-full"
                          onFocus={() => setSearchFocused(true)}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch();
                            }
                          }}
                          autoFocus
                        />
                      </div>
                      
                      {/* Search Button */}
                      <button
                        onClick={handleSearch}
                        className="px-4 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
                      >
                        <Search size={16} />
                      </button>
                    </div>

                    {/* Search Suggestions Dropdown */}
                    {searchFocused && renderSearchDropdown()}
                  </div>
                </div>
                
                {/* Close Search Button */}
                <button
                  onClick={toggleSearchExpand}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>
            </div>
          )}

          {/* Normal Mobile Layout when search is not expanded */}
          {!isSearchExpanded && (
            <>
              {/* Full Width Logo Section */}
              <div className="w-full bg-black py-4">
                <div className="flex justify-center">
                  <div 
                    className="cursor-pointer"
                    onClick={handleHomeRedirect}
                  >
                    <img 
                      src="/Walk.png" 
                      alt="Show Store" 
                      className="h-12 w-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons - Full Width */}
              <div className="w-full bg-black">
                <div className="flex justify-between items-center px-2 py-2">
                  {['Mens', 'Womens', 'Kids', 'Sale'].map((item) => (
                    <div
                      key={item}
                      className="text-white text-sm font-medium uppercase tracking-wide hover:text-gray-300 transition-colors cursor-pointer text-center flex-1 px-1 relative group"
                      onClick={() => handleNavigation(item)}
                    >
                      {item}
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-3/4"></span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed Bottom Icons Bar - Mobile Only with White Background */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50 shadow-lg">
          <div className="flex items-center justify-around px-2 py-3">
            {/* Search Icon */}
            <button
              onClick={toggleSearchExpand}
              className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 transition-colors flex-1"
              title="Search"
            >
              <Search size={20} className="text-gray-700 mb-1" />
              <span className="text-xs text-gray-600">Search</span>
            </button>

            {/* Profile Icon */}
            <div 
              className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors flex-1"
              onClick={handleProfileLogin}
              title="Account"
            >
              <User size={20} className="text-gray-700 mb-1" />
              <span className="text-xs text-gray-600">Account</span>
            </div>
            
            {/* Wishlist Icon */}
            <div 
              className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors flex-1 relative"
              onClick={handleFavouriteRedirect}
              title="Wishlist"
            >
              <Heart size={20} className="text-gray-700 mb-1" />
              <span className="text-xs text-gray-600">Wishlist</span>
              <span className={`absolute top-0 right-2 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium ${
                wishlistCount > 0 ? 'bg-red-500' : 'bg-gray-500'
              }`}>
                {wishlistCount}
              </span>
            </div>
            
            {/* Cart Icon */}
            <div 
              className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors flex-1 relative"
              onClick={handleCartRedirect}
              title="Cart"
            >
              <ShoppingCart size={20} className="text-gray-700 mb-1" />
              <span className="text-xs text-gray-600">Cart</span>
              <span className={`absolute top-0 right-2 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium ${
                cartCount > 0 ? 'bg-red-500' : 'bg-gray-500'
              }`}>
                {cartCount}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Section - With Labels */}
        <div className="hidden md:block bg-white border-b border-gray-200">
          <div className="mx-auto w-[80%] py-4">
            <div className="flex items-center justify-between">
              {/* Logo - Increased Width */}
              <div 
                className="cursor-pointer flex items-center"
                onClick={handleHomeRedirect}
              >
                <img 
                  src="/Walk.png" 
                  alt="Show Store" 
                  className="h-16 w-24 bg-black p-3 rounded-lg"
                />
              </div>

              {/* Search Bar - Center - Simple without categories */}
              <div className="flex-1 max-w-md mx-8">
                <div className="relative" ref={searchRef}>
                  <div className="flex rounded-full bg-gray-100 overflow-hidden shadow-sm border border-transparent focus-within:border-gray-300">
                    {/* Search Input */}
                    <div className="flex-1 flex items-center">
                      <input
                        type="text"
                        placeholder="Search products, brands, categories..."
                        className="flex-1 pl-4 pr-4 py-2 bg-transparent text-black placeholder-gray-500 focus:outline-none text-sm w-full"
                        onFocus={() => setSearchFocused(true)}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                      />
                    </div>
                    
                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      className="px-4 bg-black text-white hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                      <Search size={16} />
                    </button>
                  </div>

                  {/* Search Suggestions Dropdown */}
                  {searchFocused && renderSearchDropdown()}
                </div>
              </div>

              {/* Icons - Right with Labels */}
              <div className="flex items-center space-x-6">
                {/* Account with Label */}
                <div 
                  className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={handleProfileLogin}
                  title="Account"
                >
                  <User size={22} className="text-gray-700 mb-1" />
                  <span className="text-xs text-gray-600">Account</span>
                </div>
                
                {/* Wishlist with Label and Count */}
                <div 
                  className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors relative"
                  onClick={handleFavouriteRedirect}
                  title="Wishlist"
                >
                  <Heart size={22} className="text-gray-700 mb-1" />
                  <span className="text-xs text-gray-600">Wishlist</span>
                  <span className={`absolute top-0 right-0 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium ${
                    wishlistCount > 0 ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {wishlistCount}
                  </span>
                </div>
                
                {/* Cart with Label and Count */}
                <div 
                  className="flex flex-col items-center p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors relative"
                  onClick={handleCartRedirect}
                  title="Cart"
                >
                  <ShoppingCart size={22} className="text-gray-700 mb-1" />
                  <span className="text-xs text-gray-600">Cart</span>
                  <span className={`absolute top-0 right-0 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium ${
                    cartCount > 0 ? 'bg-red-500' : 'bg-gray-500'
                  }`}>
                    {cartCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Bottom Navigation - Combined with Mini Nav */}
        <div className="hidden md:block bg-black text-white">
          <div className="max-w-[80%] mx-auto">
            <div className="flex items-center justify-between py-3">
              {/* Left Side - Main Categories */}
              <div className="flex items-center space-x-8">
                {['Mens', 'Womens', 'Kids', 'Sale'].map((item) => (
                  <div
                    key={item}
                    className="text-sm font-medium uppercase tracking-wide hover:text-gray-300 transition-colors py-2 relative group cursor-pointer"
                    onClick={() => handleNavigation(item)}
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </div>
                ))}
              </div>

              {/* Right Side - Mini Nav Items with Hover Lines */}
              <div className="flex items-center space-x-8">
                {miniNavItems.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col items-center cursor-pointer group relative"
                    onClick={() => handleMiniNavClick(item.path)}
                  >
                    <span className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium uppercase tracking-wide hover:text-gray-300 transition-colors">
                      {item.name}
                    </span>
                    {/* Hover Line */}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Mini Navbar - Much Better Design */}
      <div className="md:hidden bg-white border-b border-gray-200 py-4">
        <div className="max-w-[95%] mx-auto">
          <div className="flex justify-between items-center px-2">
            {miniNavItems.map((item) => (
              <div
                key={item.name}
                className="flex flex-col items-center cursor-pointer group flex-1 mx-1 relative"
                onClick={() => handleMiniNavClick(item.path)}
              >
                <div className="bg-gray-100 rounded-2xl p-4 mb-2 group-hover:bg-gray-200 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md w-14 h-14 flex items-center justify-center">
                  <span className="text-2xl">
                    {item.icon}
                  </span>
                </div>
                <span className="text-xs font-semibold text-gray-800 uppercase tracking-wide text-center">
                  {item.name}
                </span>
                {/* Hover Line for Mobile */}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-8"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;