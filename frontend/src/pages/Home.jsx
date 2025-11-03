import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../supabase';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sliderHeight, setSliderHeight] = useState('80vh');
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch active slides from Supabase
  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_slides')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      // Transform data to handle multiple images
      const transformedSlides = data.map(slide => ({
        ...slide,
        images: slide.images || [slide.image_url].filter(Boolean)
      }));
      
      setSlides(transformedSlides);
    } catch (error) {
      console.error('Error fetching slides:', error);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // Auto slide every 3 seconds (between slides)
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      const currentSlideData = slides[currentSlide];
      
      // If current slide has multiple images, cycle through them
      if (currentSlideData.images.length > 1) {
        setCurrentImageIndex(prev => 
          prev === currentSlideData.images.length - 1 ? 0 : prev + 1
        );
      } else {
        // Move to next slide
        setCurrentSlide(prev => (prev + 1) % slides.length);
        setCurrentImageIndex(0);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [slides.length, currentSlide, slides]);

  // Detect mobile + set height dynamically
  useEffect(() => {
    const updateHeight = () => {
      const isMobile = window.innerWidth <= 768;
      const screenHeight = window.innerHeight;
      const current80vh = (screenHeight * 80) / 100;

      if (isMobile) {
        if (current80vh >= screenHeight * 0.8) {
          setSliderHeight('60vh');
        } else {
          setSliderHeight('80vh');
        }
      } else {
        setSliderHeight('80vh');
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setCurrentImageIndex(0);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setCurrentImageIndex(0);
  };

  // Handle slide click (navigate to button link)
  const handleSlideClick = (slide) => {
    if (slide.button_link) {
      window.location.href = slide.button_link;
    }
  };

  // If no slides and not loading, show default/fallback
  if (!loading && slides.length === 0) {
    return (
      <div className="relative w-full overflow-hidden" style={{ height: sliderHeight }}>
        <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">No slides available</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className={`relative w-full overflow-hidden`} style={{ height: sliderHeight }}>
      {/* Background Images */}
      {currentSlideData && currentSlideData.images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={currentSlideData.title || `Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Text Overlay */}
          {(currentSlideData.title || currentSlideData.subtitle) && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer"
              onClick={() => handleSlideClick(currentSlideData)}
            >
              <div className="text-center text-white max-w-2xl px-4">
                {currentSlideData.title && (
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                    {currentSlideData.title}
                  </h1>
                )}
                {currentSlideData.subtitle && (
                  <p className="text-lg md:text-xl mb-6 drop-shadow-lg">
                    {currentSlideData.subtitle}
                  </p>
                )}
                {currentSlideData.button_text && (
                  <button 
                    onClick={() => handleSlideClick(currentSlideData)}
                    className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 transform hover:scale-105"
                  >
                    {currentSlideData.button_text}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2 z-10">
            <button
              onClick={prevSlide}
              className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-300"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  setCurrentImageIndex(0);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>

          {/* Image Indicators (if current slide has multiple images) */}
          {currentSlideData && currentSlideData.images.length > 1 && (
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10">
              {currentSlideData.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white scale-125'
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Loading slides...</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;