import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white py-8 pb-32 md:pb-20">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 text-sm">
            Last updated: {new Date().getFullYear()}-{(new Date().getMonth() + 1).toString().padStart(2, '0')}-{new Date().getDate().toString().padStart(2, '0')}
          </p>
        </motion.div>

        <div className="text-gray-700 space-y-8">
          
          {/* Introduction */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Welcome to Walk Wyze</h2>
            <p className="leading-relaxed text-justify">
              Welcome to Walk Wyze! The terms "we", "us" and "our" refer to Walk Wyze. 
              We operate this online store to provide you with premium sneakers and streetwear 
              shopping experience. By accessing or using our services, you agree to be bound 
              by these Terms of Service.
            </p>
          </motion.section>

          {/* Account Terms */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Account Registration</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                To use our services, you must be at least 16 years old. When creating an account, 
                you agree to provide accurate and complete information. You are responsible for 
                maintaining the security of your account credentials.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Keep your login information confidential</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Notify us immediately of any unauthorized access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">You may not transfer or sell your account</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Products */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Our Products</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                We strive to accurately represent our products. However, please note that colors 
                and appearance may vary slightly due to device screens and lighting conditions.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Product images are for reference only</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">We reserve the right to update product information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Some items may have limited availability</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Orders */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Order Process</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                When you place an order, you are making an offer to purchase. We reserve the 
                right to accept or decline orders at our discretion.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Orders are confirmed only after payment processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Review your order carefully before submission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Cancellation requests may not be possible after acceptance</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Pricing */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Pricing and Payment</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                All prices are in Pakistani Rupees (PKR) and include applicable taxes unless 
                stated otherwise.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Prices are subject to change without notice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Shipping charges are additional</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Provide accurate payment information</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Shipping */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Shipping and Delivery</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                We aim to deliver orders within 3-4 working days after payment confirmation. 
                Delivery times may vary based on location and circumstances.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">PKR 500 delivery charge applies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">We are not liable for carrier delays</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Provide correct shipping address</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Intellectual Property */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Intellectual Property</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                All content on our website, including logos, text, and images, is owned by 
                Walk Wyze and protected by intellectual property laws.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Content is for personal use only</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">No reproduction without permission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Walk Wyze trademarks are protected</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* User Conduct */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">User Conduct</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                You agree to use our services lawfully and respectfully.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">No fraudulent activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Respect intellectual property rights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">No harassment or abusive behavior</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Provide accurate information</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Limitation of Liability */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Limitation of Liability</h2>
            <p className="leading-relaxed text-justify">
              Walk Wyze shall not be liable for any indirect, incidental, or consequential 
              damages arising from your use of our services. Our total liability shall not 
              exceed the amount you paid for the products in question.
            </p>
          </motion.section>

          {/* Changes to Terms */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Changes to Terms</h2>
            <p className="leading-relaxed text-justify">
              We may update these Terms of Service periodically. Continued use of our services 
              after changes constitutes acceptance of the new terms. We will notify you of 
              significant changes.
            </p>
          </motion.section>

          {/* Contact Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bg-gray-50 rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
            <div className="space-y-2">
              <p className="leading-relaxed text-justify">
                For questions about these Terms of Service, please contact us:
              </p>
              <p className="leading-relaxed text-justify"><strong>Email:</strong> legal@walkwyze.com</p>
              <p className="leading-relaxed text-justify"><strong>Phone:</strong> +92 321 1234567</p>
              <p className="leading-relaxed text-justify"><strong>Address:</strong> Khyaban E Ali Housing Society, Bahawalpur</p>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfService;