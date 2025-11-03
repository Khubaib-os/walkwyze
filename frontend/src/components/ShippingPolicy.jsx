import React from 'react';
import { motion } from 'framer-motion';

const ShippingPolicy = () => {
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
            Shipping Policy
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
              At Walk Wyze, we strive to make your shopping experience smooth and reliable. 
              Please read our shipping policy carefully before placing your order.
            </p>
          </motion.section>

          {/* Advance Payment */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Advance Payment for Delivery</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                To confirm your order, a delivery charge of <strong>PKR 500</strong> must be paid in advance. 
                Once we receive this payment, your order will be processed and dispatched. 
                This step helps us ensure faster and more secure delivery for all our customers.
              </p>
            </div>
          </motion.section>

          {/* Delivery Timeframe */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Delivery Timeframe</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                We aim to deliver your order within <strong>3 to 4 working days</strong> after payment confirmation. 
                Delivery times may vary slightly depending on your location or during high-demand seasons, 
                but we always work hard to deliver as quickly as possible.
              </p>
            </div>
          </motion.section>

          {/* Delivery Confirmation Call */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Delivery Confirmation Call</h2>
            <div className="space-y-4">
              <p className="leading-relaxed text-justify">
                Once your parcel reaches your city, you will receive a confirmation call from our team 
                to make sure your package is delivered safely and on time. 
                Please ensure your provided contact number is active to avoid any delays.
              </p>
            </div>
          </motion.section>

          {/* Additional Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-black mb-4">Additional Information</h2>
            <div className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">
                    <strong>Order Tracking:</strong> You will receive tracking information once your order is shipped
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">
                    <strong>Delivery Areas:</strong> We currently deliver to all major cities across Pakistan
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">
                    <strong>Shipping Partners:</strong> We work with trusted courier services for reliable delivery
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mr-2">•</span>
                  <span className="leading-relaxed text-justify">
                    <strong>Contact Information:</strong> Please ensure your shipping address and phone number are correct
                  </span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Important Notes */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-yellow-50 rounded-lg p-6 border border-yellow-200"
          >
            <h2 className="text-xl font-bold text-black mb-4">Important Notes</h2>
            <div className="space-y-3">
              <p className="leading-relaxed text-justify text-sm">
                • Delivery times are estimates and may be affected by weather conditions, public holidays, or unforeseen circumstances
              </p>
              <p className="leading-relaxed text-justify text-sm">
                • For urgent deliveries, please contact our customer support team for special arrangements
              </p>
              <p className="leading-relaxed text-justify text-sm">
                • Failed delivery attempts due to incorrect address or unavailable recipient may incur additional charges
              </p>
            </div>
          </motion.section>

          {/* Contact Information */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gray-50 rounded-lg p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-black mb-4">Need Help?</h2>
            <div className="space-y-2">
              <p className="leading-relaxed text-justify">
                If you have any questions about shipping or need assistance with your order, 
                please don't hesitate to contact us:
              </p>
              <p className="leading-relaxed text-justify"><strong>Email:</strong> support@walkwyze.com</p>
              <p className="leading-relaxed text-justify"><strong>Phone:</strong> +92 321 1234567</p>
              <p className="leading-relaxed text-justify"><strong>Hours:</strong> Monday - Saturday, 10 AM - 7 PM</p>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;