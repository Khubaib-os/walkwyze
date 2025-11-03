// src/dashboard/HomePageMgt.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ChevronUp, ChevronDown, Eye, EyeOff, X, Plus } from 'lucide-react';

const HomePageMgt = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    display_order: 0,
    is_active: true,
    images: []
  });

  // Toast State
  const [toast, setToast] = useState({ message: '', type: '' });
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('homepage_slides')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;

      const transformedSlides = data.map(slide => ({
        ...slide,
        images: slide.images && slide.images.length > 0
          ? slide.images
          : slide.image_url ? [slide.image_url] : []
      }));

      setSlides(transformedSlides);
    } catch (error) {
      showToast('Error fetching slides: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSingleImageUpload = async (event, index = null) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        showToast('File is too large. Max 10MB.', 'error');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('homepage')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('homepage')
        .getPublicUrl(filePath);

      if (index !== null) {
        const updatedImages = [...formData.images];
        updatedImages[index] = publicUrl;
        setFormData(prev => ({ ...prev, images: updatedImages }));
      } else {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, publicUrl]
        }));
      }
      showToast('Image uploaded successfully!', 'success');
    } catch (error) {
      showToast('Error uploading image: ' + error.message, 'error');
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

  const moveImage = (fromIndex, toIndex) => {
    const updatedImages = [...formData.images];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      display_order: slides.length > 0 ? Math.max(...slides.map(s => s.display_order)) + 1 : 0,
      is_active: true,
      images: []
    });
    setEditingSlide(null);
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

      const slideData = {
        images: formData.images,
        image_url: formData.images[0],
        display_order: parseInt(formData.display_order),
        is_active: formData.is_active
      };

      if (editingSlide) {
        const { error } = await supabase
          .from('homepage_slides')
          .update(slideData)
          .eq('id', editingSlide.id);
        if (error) throw error;
        showToast('Slide updated successfully!', 'success');
      } else {
        const { error } = await supabase
          .from('homepage_slides')
          .insert([slideData]);
        if (error) throw error;
        showToast('Slide added successfully!', 'success');
      }
      resetForm();
      fetchSlides();
    } catch (error) {
      showToast('Error saving slide: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      display_order: slide.display_order,
      is_active: slide.is_active,
      images: slide.images && slide.images.length > 0
        ? slide.images
        : slide.image_url ? [slide.image_url] : []
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const { error } = await supabase
        .from('homepage_slides')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Slide deleted successfully!', 'success');
      fetchSlides();
    } catch (error) {
      showToast('Error deleting slide: ' + error.message, 'error');
    }
  };

  const moveSlideOrder = async (slide, direction) => {
    try {
      const currentOrder = slide.display_order;
      const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
      const targetSlide = slides.find(s => s.display_order === targetOrder);

      if (targetSlide) {
        await supabase
          .from('homepage_slides')
          .update({ display_order: currentOrder })
          .eq('id', targetSlide.id);
      }

      const { error } = await supabase
        .from('homepage_slides')
        .update({ display_order: targetOrder })
        .eq('id', slide.id);
      if (error) throw error;

      showToast(`Slide moved ${direction === 'up' ? 'up' : 'down'}!`, 'success');
      fetchSlides();
    } catch (error) {
      showToast('Error moving slide: ' + error.message, 'error');
    }
  };

  const toggleSlideStatus = async (slide) => {
    try {
      const { error } = await supabase
        .from('homepage_slides')
        .update({ is_active: !slide.is_active })
        .eq('id', slide.id);
      if (error) throw error;
      showToast(`Slide ${!slide.is_active ? 'activated' : 'deactivated'}!`, 'success');
      fetchSlides();
    } catch (error) {
      showToast('Error updating status: ' + error.message, 'error');
    }
  };

  return (
    <div className="p-4 mt-2 lg:mt-8 relative">
      <h2 className="text-xl font-bold text-black mb-4">Homepage Slider Management</h2>

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

      {/* Slide Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-base font-semibold mb-3">
          {editingSlide ? 'Edit Slide' : 'Add New Slide'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Simple Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="mr-2 w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Upload Slide Images (Max 10MB each) *
            </label>

            {/* Add New Image Button */}
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSingleImageUpload(e)}
                className="hidden"
                id="add-image"
                disabled={uploading}
              />
              <label
                htmlFor="add-image"
                className="cursor-pointer bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={16} />
                {uploading ? 'Uploading...' : 'Add New Image'}
              </label>
            </div>

            {/* Images Grid with Index Numbers */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                    {/* Image with Index */}
                    <div className="relative mb-3">
                      <div className="absolute -top-2 -left-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10">
                        {index + 1}
                      </div>
                      <img
                        src={image}
                        alt={`Slide Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                    {/* Image Controls */}
                    <div className="flex flex-col gap-2">
                      {/* Replace Image */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSingleImageUpload(e, index)}
                          className="hidden"
                          id={`replace-image-${index}`}
                          disabled={uploading}
                        />
                        <label
                          htmlFor={`replace-image-${index}`}
                          className="cursor-pointer bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors inline-flex items-center justify-center w-full"
                        >
                          Replace Image
                        </label>
                      </div>
                      {/* Move Controls */}
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(index, index - 1)}
                          disabled={index === 0}
                          className="flex-1 bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, index + 1)}
                          disabled={index === formData.images.length - 1}
                          className="flex-1 bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Down
                        </button>
                      </div>
                      {/* Remove Image */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                      >
                        <X size={12} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {formData.images.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-sm">No images added yet. Click "Add New Image" to start.</p>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading || uploading || formData.images.length === 0}
              className="bg-black text-white px-6 py-2 rounded text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (editingSlide ? 'Update Slide' : 'Add Slide')}
            </button>
            {editingSlide && (
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

      {/* Slides List */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold">Slides List ({slides.length})</h3>
          <button
            onClick={fetchSlides}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600 text-sm text-center py-8">Loading slides...</p>
        ) : slides.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No slides found. Add your first slide above.</p>
        ) : (
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div key={slide.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Images with Index */}
                  <div className="flex-shrink-0">
                    <div className="flex gap-2 flex-wrap">
                      {slide.images.slice(0, 4).map((image, imgIndex) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-16 h-12 object-cover rounded border"
                          />
                          <div className="absolute -top-1 -left-1 bg-black text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            {imgIndex + 1}
                          </div>
                          {imgIndex === 3 && slide.images.length > 4 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                              +{slide.images.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500">Order: {slide.display_order}</span>
                          <span className="text-xs text-gray-500">Images: {slide.images.length}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSlideStatus(slide)}
                          className={`p-1 rounded ${
                            slide.is_active
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                          title={slide.is_active ? 'Active' : 'Inactive'}
                        >
                          {slide.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Order Controls */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveSlideOrder(slide, 'up')}
                        disabled={index === 0}
                        className="p-1 bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => moveSlideOrder(slide, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1 bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    {/* Edit/Delete */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePageMgt;