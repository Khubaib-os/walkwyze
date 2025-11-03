import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);

  // Customer Care Links
  const customerCareLinks = [
    { name: 'Search', path: 'search' },
    { name: 'About Us', path: '/aboutus' },
    { name: 'Contact Us', path: '/contact' }
  ];

  // Policy Links
  const policyLinks = [
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Shipping Policy', path: '/shipping' },
    { name: 'Terms of Service', path: '/terms' }
  ];

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Function to handle search click
  const handleSearchClick = () => {
    // Dispatch a custom event that Navbar can listen to
    const searchEvent = new CustomEvent('focusSearch', {
      detail: { shouldFocus: true }
    });
    window.dispatchEvent(searchEvent);
    
    // If we're not on home page, navigate to home first
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  // Function to handle link clicks
  const handleLinkClick = (item) => {
    if (item.name === 'Search') {
      handleSearchClick();
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="bg-white w-full pt-20 pb-32 md:pb-8 px-4 md:px-0">
      
      {/* Main Footer Container with responsive width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto w-full md:w-[90%] bg-black rounded-2xl p-6 md:p-8 shadow-xl relative"
      >
        {/* Main Footer Content */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Desktop/Tab View - Original Layout */}
          {/* Customer Care Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 md:mb-5 text-white border-b border-gray-600 pb-2 transition-colors duration-300 cursor-default">Customer Care</h3>
            <ul className="space-y-2 md:space-y-3">
              {customerCareLinks.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    onClick={() => handleLinkClick(item)}
                    className="w-full text-left"
                  >
                    <span className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center w-full text-left group">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                      {item.name}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Policies Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 md:mb-5 text-white border-b border-gray-600 pb-2 transition-colors duration-300 cursor-default">Our Policies</h3>
            <ul className="space-y-2 md:space-y-3">
              {policyLinks.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <a href={item.path}>
                    <span className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center w-full text-left group">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                      {item.name}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 md:mb-5 text-white border-b border-gray-600 pb-2 transition-colors duration-300 cursor-default">Contact Info</h3>
            
            {/* Contact Information */}
            <div className="text-gray-300 text-sm space-y-3 mb-4">
              <div className="flex items-start">
                <svg className="h-4 w-4 text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>Khyaban E Ali Housing Society, Bahawalpur</p>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p>+92 321 1234567</p>
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p>info@company.com</p>
              </div>
            </div>

            {/* Simple Instagram Button */}
            <motion.a
              href="https://instagram.com/walkwyze"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white text-black px-4 py-2 rounded text-sm transition-all duration-300 flex items-center gap-2 w-full justify-center border border-gray-300 hover:bg-gray-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Follow on Instagram
            </motion.a>
          </div>
        </div>

        {/* Mobile View - Accordion Style */}
        <div className="md:hidden space-y-4">
          {/* Customer Care Accordion */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => toggleSection('customerCare')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white">Customer Care</h3>
              <motion.svg
                animate={{ rotate: openSection === 'customerCare' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            <motion.div
              initial={false}
              animate={{ 
                height: openSection === 'customerCare' ? 'auto' : 0,
                opacity: openSection === 'customerCare' ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="space-y-3 mt-4 pl-4">
                {customerCareLinks.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(item)}
                      className="w-full text-left"
                    >
                      <span className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                        {item.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Policies Accordion */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => toggleSection('policies')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white">Our Policies</h3>
              <motion.svg
                animate={{ rotate: openSection === 'policies' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            <motion.div
              initial={false}
              animate={{ 
                height: openSection === 'policies' ? 'auto' : 0,
                opacity: openSection === 'policies' ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <ul className="space-y-3 mt-4 pl-4">
                {policyLinks.map((item, index) => (
                  <li key={index}>
                    <a href={item.path}>
                      <span className="text-gray-300 hover:text-white transition-colors duration-300 text-sm flex items-center group">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                        {item.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info Accordion */}
          <div className="border-b border-gray-700 pb-4">
            <button
              onClick={() => toggleSection('contactInfo')}
              className="flex justify-between items-center w-full text-left"
            >
              <h3 className="text-lg font-semibold text-white">Contact Info</h3>
              <motion.svg
                animate={{ rotate: openSection === 'contactInfo' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>
            <motion.div
              initial={false}
              animate={{ 
                height: openSection === 'contactInfo' ? 'auto' : 0,
                opacity: openSection === 'contactInfo' ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="text-gray-300 text-sm space-y-3 mt-4 pl-4">
                <div className="flex items-start">
                  <svg className="h-4 w-4 text-gray-400 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>Khyaban E Ali Housing Society, Bahawalpur</p>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <p>+92 321 1234567</p>
                </div>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p>info@company.com</p>
                </div>
              </div>
              
              <motion.a
                href="https://instagram.com/walkwyze"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white text-black px-4 py-2 rounded text-sm transition-all duration-300 flex items-center gap-2 w-full justify-center border border-gray-300 hover:bg-gray-100 mt-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                Follow on Instagram
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar - Centered Copyright Only */}
        <div className="border-t border-gray-700 pt-4 md:pt-6 mt-6 md:mt-0">
          <div className="flex justify-center">
            <p className="text-gray-400 text-sm transition-colors duration-300 cursor-default text-center">
              Copyright © 2023 - 2025 WalkWyze® Global Inc. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Footer;