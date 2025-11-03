// src/dashboard/NikeMgt.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const NikeMgt = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    original_price: '',
    discount_percent: '',
    size: '',
    gender: 'Men',
    description: '',
    has_discount: false,
    is_sold_out: false,
    images: [],
    category: 'shoes'
  });

  // Toast State
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const calculateDiscountPrice = (originalPrice, discountPercent) => {
    if (!originalPrice || !discountPercent) return '';
    const discountAmount = (originalPrice * discountPercent) / 100;
    return Math.round(originalPrice - discountAmount);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('nike_products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      showToast('Error fetching products: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (event) => {
    try {
      setUploading(true);
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const uploadedImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 10 * 1024 * 1024) {
          showToast(`File ${file.name} is too large. Max 10MB.`, 'error');
          continue;
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('nike')
          .upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('nike')
          .getPublicUrl(filePath);
        uploadedImages.push(publicUrl);
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));
      showToast('Images uploaded successfully!', 'success');
    } catch (error) {
      showToast('Error uploading images: ' + error.message, 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    if ((name === 'original_price' || name === 'discount_percent') && updatedFormData.has_discount) {
      const originalPrice = parseInt(updatedFormData.original_price) || 0;
      const discountPercent = parseInt(updatedFormData.discount_percent) || 0;
      if (originalPrice > 0 && discountPercent > 0) {
        updatedFormData.discount_price = calculateDiscountPrice(originalPrice, discountPercent);
      }
    }
    setFormData(updatedFormData);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      original_price: '',
      discount_price: '',
      discount_percent: '',
      size: '',
      gender: 'Men',
      description: '',
      has_discount: false,
      is_sold_out: false,
      images: [],
      category: 'shoes'
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.images.length === 0) {
        showToast('Please upload at least one image', 'error');
        setLoading(false);
        return;
      }
      if (!formData.title || !formData.original_price || !formData.size) {
        showToast('Please fill all required fields', 'error');
        setLoading(false);
        return;
      }

      const productData = {
        title: formData.title,
        original_price: parseInt(formData.original_price),
        size: formData.size,
        gender: formData.gender,
        description: formData.description,
        category: formData.category,
        images: formData.images,
        has_discount: formData.has_discount,
        is_sold_out: formData.is_sold_out,
        is_active: true
      };

      if (formData.has_discount) {
        productData.discount_price = parseInt(formData.discount_price);
        productData.discount_percent = parseInt(formData.discount_percent);
      } else {
        productData.discount_price = null;
        productData.discount_percent = null;
      }

      if (editingProduct) {
        const { error } = await supabase
          .from('nike_products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
        showToast('Product updated successfully!', 'success');
      } else {
        const { error } = await supabase
          .from('nike_products')
          .insert([productData]);
        if (error) throw error;
        showToast('Product added successfully!', 'success');
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      showToast('Error saving product: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      original_price: product.original_price.toString(),
      discount_price: product.discount_price?.toString() || '',
      discount_percent: product.discount_percent?.toString() || '',
      size: product.size,
      gender: product.gender,
      description: product.description || '',
      has_discount: product.has_discount,
      is_sold_out: product.is_sold_out || false,
      images: product.images || [],
      category: product.category || 'shoes'
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase
        .from('nike_products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Product deleted successfully!', 'success');
      fetchProducts();
    } catch (error) {
      showToast('Error deleting product: ' + error.message, 'error');
    }
  };

  const toggleProductStatus = async (product) => {
    try {
      const { error } = await supabase
        .from('nike_products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);
      if (error) throw error;
      showToast(`Product ${!product.is_active ? 'activated' : 'deactivated'}!`, 'success');
      fetchProducts();
    } catch (error) {
      showToast('Error updating status: ' + error.message, 'error');
    }
  };

  const toggleSoldOutStatus = async (product) => {
    try {
      const { error } = await supabase
        .from('nike_products')
        .update({ is_sold_out: !product.is_sold_out })
        .eq('id', product.id);
      if (error) throw error;
      showToast(`Product marked as ${!product.is_sold_out ? 'Sold Out' : 'Available'}!`, 'success');
      fetchProducts();
    } catch (error) {
      showToast('Error updating stock: ' + error.message, 'error');
    }
  };

  return (
    <div className="p-4 mt-2 lg:mt-8 relative">
      <h2 className="text-xl font-bold text-black mb-4">Nike Products Management</h2>

      {/* Toast Message */}
      {toast.message && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className={`px-6 py-3 rounded-full shadow-lg text-white font-medium text-sm animate-pulse transition-all ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-blue-600'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Product Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-base font-semibold mb-3">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Original Price (Rs) *</label>
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Size *</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="e.g., 6, 7.5, M, L"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                required
              >
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="has_discount"
                  checked={formData.has_discount}
                  onChange={handleInputChange}
                  className="mr-2 w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">Has Discount</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_sold_out"
                  checked={formData.is_sold_out}
                  onChange={handleInputChange}
                  className="mr-2 w-4 h-4"
                />
                <label className="text-sm font-medium text-gray-700">Sold Out</label>
              </div>
            </div>
          </div>

          {/* Discount & Images */}
          <div className="space-y-3">
            {formData.has_discount && (
              <div className="space-y-3 p-3 bg-gray-50 rounded border">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Discount Percent *</label>
                  <input
                    type="number"
                    name="discount_percent"
                    value={formData.discount_percent}
                    onChange={handleInputChange}
                    max="100"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Calculated Discount Price</label>
                  <input
                    type="number"
                    name="discount_price"
                    value={formData.discount_price || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded text-sm"
                  />
                  {formData.discount_price && (
                    <p className="text-xs text-green-600 mt-1">
                      Customer will pay: Rs. {formData.discount_price} (Save {formData.discount_percent}%)
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Upload Product Images (Max 10MB each) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload-nike"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload-nike"
                  className="cursor-pointer bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors inline-block"
                >
                  {uploading ? 'Uploading...' : 'Choose Images'}
                </label>
                <p className="text-xs text-gray-500 mt-2">Click to select multiple images</p>
              </div>

              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Uploaded Images ({formData.images.length}):</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative border rounded-lg overflow-hidden group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                        >
                          x
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
              placeholder="Enter product description..."
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded text-sm hover:bg-gray-400 transition-colors"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Products List ({products.length})</h3>
          <button
            onClick={fetchProducts}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-sm text-center py-8">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No products found. Add your first product above.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="flex items-center space-x-3">
                          {product.images && product.images[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded border"
                            />
                          )}
                          <div>
                            <p className="font-medium text-black text-sm">{product.title}</p>
                            <div className="flex space-x-1 mt-1">
                              {product.has_discount && (
                                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">SALE</span>
                              )}
                              {product.is_sold_out && (
                                <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">SOLD OUT</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm">
                          <div className="font-medium">Rs.{product.original_price}</div>
                          {product.has_discount && (
                            <div className="text-green-600 text-xs">
                              Rs.{product.discount_price} ({product.discount_percent}% off)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm">{product.size}</td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => toggleProductStatus(product)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            product.is_active
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => toggleSoldOutStatus(product)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            product.is_sold_out
                              ? 'bg-gray-100 text-gray-800 border border-gray-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {product.is_sold_out ? 'Sold Out' : 'In Stock'}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex gap-3">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded border flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-black text-sm truncate">{product.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.has_discount && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">SALE</span>
                        )}
                        {product.is_sold_out && (
                          <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">SOLD OUT</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium">Rs.{product.original_price}</p>
                      {product.has_discount && (
                        <p className="text-green-600 text-xs">
                          Rs.{product.discount_price} ({product.discount_percent}% off)
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-gray-500">Size</p>
                      <p className="font-medium">{product.size}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleProductStatus(product)}
                      className={`flex-1 min-w-fit px-3 py-1.5 rounded text-xs font-medium text-center ${
                        product.is_active
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => toggleSoldOutStatus(product)}
                      className={`flex-1 min-w-fit px-3 py-1.5 rounded text-xs font-medium text-center ${
                        product.is_sold_out
                          ? 'bg-gray-100 text-gray-800 border border-gray-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {product.is_sold_out ? 'Sold Out' : 'In Stock'}
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t flex gap-3 text-sm font-medium">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 text-blue-600 hover:text-blue-800 text-center"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 text-red-600 hover:text-red-800 text-center"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NikeMgt;