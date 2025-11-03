// src/SearchResults.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { useSearch } from '../context/SearchContext';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchProducts } = useSearch();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { query } = location.state || {};

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    if (!query) return;
    
    setLoading(true);
    try {
      console.log('Performing search with query:', query);
      const searchResults = searchProducts(query);
      console.log('Search results:', searchResults);
      setResults(searchResults);
    } catch (error) {
      console.error('Error performing search:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Search Query</h1>
          <p className="text-gray-600">Please enter a search term to see results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for "{query}"
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {loading ? 'Searching...' : `${results.length} ${results.length === 1 ? 'product' : 'products'} found`}
            </p>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
            <p className="text-gray-600 mt-4">Searching products...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <div
                key={`${product.id}-${product.table}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  // Navigate to the specific brand page
                  const brandPath = product.table.replace('_products', '');
                  navigate(`/${brandPath}`, { 
                    state: { 
                      selectedProduct: product,
                      fromSearch: true 
                    } 
                  });
                }}
              >
                <div className="relative h-48 bg-gray-100">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                  
                  {product.hasDiscount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      SALE
                    </div>
                  )}
                  
                  {product.is_sold_out && (
                    <div className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold">
                      SOLD OUT
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2 capitalize">{product.brand}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {product.hasDiscount ? (
                        <>
                          <span className="font-bold text-gray-900">
                            Rs.{product.discountPrice?.toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-sm line-through">
                            Rs.{product.originalPrice?.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-gray-900">
                          Rs.{product.originalPrice?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 capitalize">
                      {product.gender}'s
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-gray-600 mb-4">
              We couldn't find any products matching "{query}".
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Try these suggestions:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Nike', 'Adidas', 'Shoes', 'Jackets', 'Pants', 'Shirts'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => navigate('/search', { 
                      state: { 
                        query: suggestion
                      } 
                    })}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;