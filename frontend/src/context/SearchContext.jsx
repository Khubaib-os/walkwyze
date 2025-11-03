// src/context/SearchContext.jsx (FINAL CLEAN VERSION)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const tables = [
        'nike_products', 'adidas_products', 'puma_products',
        'newbalance_products', 'skechers_products', 'underarmour_products',
        'hoka_products', 'jackets_products', 'shirts_products', 'pants_products'
      ];

      let allProductsData = [];

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('is_active', true);

          if (error) continue;

          if (data && data.length > 0) {
            const transformedProducts = data.map(product => {
              const images = product.images && product.images.length > 0 
                ? product.images 
                : product.image_url ? [product.image_url] : [];
              
              let productType = 'shoes';
              let category = product.category || 'shoes';
              
              if (table === 'jackets_products') {
                productType = 'jackets';
                category = 'jackets';
              } else if (table === 'shirts_products') {
                productType = 'shirts';
                category = 'shirts';
              } else if (table === 'pants_products') {
                productType = 'pants';
                category = 'pants';
              }
              
              return {
                id: product.id,
                title: product.title,
                brand: product.brand || table.replace('_products', '')
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' '),
                originalPrice: product.original_price,
                discountPrice: product.discount_price,
                images: images,
                category: category,
                gender: product.gender || 'Unisex',
                size: product.size,
                hasDiscount: product.has_discount || false,
                is_sold_out: product.is_sold_out || false,
                table: table,
                productType: productType
              };
            });
            
            allProductsData = [...allProductsData, ...transformedProducts];
          }
        } catch (error) {
          continue;
        }
      }

      setAllProducts(allProductsData);
      
    } catch (error) {
      // Silent error - don't show to users
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = (query) => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    
    return allProducts.filter(product => {
      if (!product.title) return false;

      const title = product.title.toLowerCase();
      const brand = product.brand.toLowerCase();
      const category = (product.category || '').toLowerCase();
      const productType = (product.productType || '').toLowerCase();

      return (
        title.includes(searchTerm) ||
        brand.includes(searchTerm) ||
        category.includes(searchTerm) ||
        productType.includes(searchTerm) ||
        title.split(' ').some(word => word.includes(searchTerm)) ||
        brand.split(' ').some(word => word.includes(searchTerm)) ||
        (searchTerm.includes('jacket') && (
          category.includes('jacket') || title.includes('jacket') ||
          productType.includes('jacket') || title.includes('coat')
        )) ||
        (searchTerm.includes('shirt') && (
          category.includes('shirt') || title.includes('shirt') ||
          productType.includes('shirt') || title.includes('tshirt')
        )) ||
        (searchTerm.includes('pant') && (
          category.includes('pant') || title.includes('pant') ||
          productType.includes('pant') || title.includes('trouser')
        )) ||
        (searchTerm.includes('shoe') && (
          category.includes('shoe') || title.includes('shoe') ||
          productType.includes('shoe') || title.includes('sneaker')
        ))
      );
    });
  };

  const getSearchSuggestions = (query) => {
    if (!query.trim()) {
      return [
        'Nike Shoes', 'Adidas Jackets', 'Puma Pants', 'Sports Shirts',
        'Running Shoes', 'Winter Jackets', 'Formal Shirts', 'Jeans Pants'
      ].slice(0, 6);
    }

    const searchTerm = query.toLowerCase();
    const suggestions = new Set();

    allProducts.forEach(product => {
      if (product.title && product.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(product.title);
      }
      if (product.brand && product.brand.toLowerCase().includes(searchTerm)) {
        suggestions.add(product.brand);
      }
      if (product.productType && product.productType.toLowerCase().includes(searchTerm)) {
        suggestions.add(product.productType.charAt(0).toUpperCase() + product.productType.slice(1));
      }
    });

    const genericMap = {
      'jacket': ['Winter Jackets', 'Sports Jackets', 'Leather Jackets', 'Rain Jackets'],
      'shirt': ['Formal Shirts', 'Casual Shirts', 'T-Shirts', 'Polo Shirts'],
      'pant': ['Jeans Pants', 'Sports Pants', 'Cargo Pants', 'Formal Pants'],
      'shoe': ['Running Shoes', 'Sports Shoes', 'Casual Shoes', 'Formal Shoes'],
      'nike': ['Nike Shoes', 'Nike Jackets', 'Nike Pants', 'Nike Shirts'],
      'adidas': ['Adidas Shoes', 'Adidas Jackets', 'Adidas Pants', 'Adidas Shirts'],
      'puma': ['Puma Shoes', 'Puma Jackets', 'Puma Pants', 'Puma Shirts']
    };

    Object.keys(genericMap).forEach(key => {
      if (searchTerm.includes(key)) {
        genericMap[key].forEach(suggestion => suggestions.add(suggestion));
      }
    });

    return Array.from(suggestions).slice(0, 8);
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const value = {
    allProducts,
    loading,
    searchProducts,
    getSearchSuggestions,
    refreshProducts: fetchAllProducts
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};