import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
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
            Privacy Policy
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
            <p className="text-lg leading-relaxed text-justify">
              Walk Wyze operates this online store and website to provide you with premium sneakers and streetwear shopping experience (the "Services"). Your privacy is important to us, and this Privacy Policy explains how we collect, use, and protect your personal information.
            </p>
          </motion.section>

          {/* Information We Collect */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                We collect information that helps us provide our services:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Contact Information:</strong> Your name, email, phone number, and shipping address</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Order Details:</strong> Products you view, add to cart, purchase, or return</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Payment Information:</strong> Secure payment details for processing transactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Account Information:</strong> Username, password, and preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Device Information:</strong> Browser type, IP address, and device identifiers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Communication Records:</strong> Messages and inquiries you send us</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* How We Use Your Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">How We Use Your Information</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                We use your information to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Process your orders and deliver your purchases</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Provide customer support and respond to your inquiries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Send order confirmations and shipping updates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Personalize your shopping experience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Improve our website and services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Send promotional offers (only with your consent)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Prevent fraud and ensure security</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Information Sharing */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Information Sharing</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                We may share your information with:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Shipping Partners:</strong> To deliver your orders</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Payment Processors:</strong> To securely process payments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Service Providers:</strong> Companies that help us operate our business</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify"><strong>Legal Authorities:</strong> When required by law or to protect our rights</span>
                </li>
              </ul>
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                We never sell your personal information to third parties for marketing purposes.
              </p>
            </div>
          </motion.section>

          {/* Data Security */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Data Security</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                We implement industry-standard security measures to protect your personal information. 
                However, no method of transmission over the internet is 100% secure. We recommend:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Keeping your account password secure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Logging out after using shared devices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Using strong, unique passwords</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Monitoring your account activity regularly</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Your Rights */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Your Rights</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">You have the right to:</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Access the personal information we hold about you</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Correct inaccurate information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Request deletion of your personal information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Opt-out of marketing communications</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">Export your data in a portable format</span>
                </li>
              </ul>
              <p className="text-sm leading-relaxed text-justify">
                To exercise these rights, contact us at{' '}
                <a href="mailto:privacy@walkwyze.com" className="text-black underline">
                  privacy@walkwyze.com
                </a>
              </p>
            </div>
          </motion.section>

          {/* Cookies */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Cookies & Tracking</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                We use cookies and similar technologies to enhance your shopping experience, 
                analyze website traffic, and understand customer preferences.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed text-justify">
                You can control cookie settings through your browser preferences.
              </p>
            </div>
          </motion.section>

          {/* Children's Privacy */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Children's Privacy</h2>
            <p className="leading-relaxed text-justify">
              Our services are not intended for individuals under the age of 16. 
              We do not knowingly collect personal information from children. 
              If you believe a child has provided us with personal information, 
              please contact us immediately.
            </p>
          </motion.section>

          {/* International Transfers */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">International Data Transfers</h2>
            <p className="leading-relaxed text-justify">
              Your information may be transferred to and processed in countries other than your own. 
              We ensure appropriate safeguards are in place to protect your data according to 
              applicable privacy laws.
            </p>
          </motion.section>

          {/* Policy Updates */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Policy Updates</h2>
            <p className="leading-relaxed text-justify">
              We may update this Privacy Policy periodically. We will notify you of significant 
              changes by posting the new policy on our website and updating the "Last updated" date.
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
              <p className="leading-relaxed text-justify">If you have any questions about this Privacy Policy, please contact us:</p>
              <p className="leading-relaxed text-justify"><strong>Email:</strong> privacy@walkwyze.com</p>
              <p className="leading-relaxed text-justify"><strong>Address:</strong> Khyaban E Ali Housing Society, Bahawalpur</p>
              <p className="leading-relaxed text-justify"><strong>Phone:</strong> +92 321 1234567</p>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;