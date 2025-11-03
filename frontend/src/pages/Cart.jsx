import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaTruck, FaArrowLeft, FaUpload } from "react-icons/fa";
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryForm, setDeliveryForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    paymentMethod: "", // Empty by default
    specialInstructions: ""
  });

  const [paymentProof, setPaymentProof] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showFormError, setShowFormError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate totals - FIXED: Proper price calculation with discount priority
  const subtotal = cartItems.reduce((total, item) => {
    // Priority: discountedPrice > price > originalPrice
    const itemPrice = item.discountedPrice || item.price || item.originalPrice || 0;
    const itemQuantity = item.quantity || 1;
    return total + (itemPrice * itemQuantity);
  }, 0);
  
  // Calculate shipping fee based on payment method
  const shippingFee = cartItems.length > 0 ? 
    (deliveryForm.paymentMethod === "cash" ? 299 : 0) : 0;
  const tax = 0;
  const total = subtotal + shippingFee + tax;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Maximum size is 5MB.');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPEG, PNG, etc.)');
        return;
      }
      
      setPaymentProof(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!deliveryForm.fullName.trim()) errors.fullName = "Full name is required";
    if (!deliveryForm.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(deliveryForm.email)) errors.email = "Email is invalid";
    if (!deliveryForm.phone.trim()) errors.phone = "Phone number is required";
    if (!deliveryForm.address.trim()) errors.address = "Address is required";
    if (!deliveryForm.city.trim()) errors.city = "City is required";
    if (!deliveryForm.paymentMethod) errors.paymentMethod = "Payment method is required";
    
    // Validate payment proof for ALL payment methods (including cash)
    if (deliveryForm.paymentMethod && !paymentProof) {
      errors.paymentProof = "Payment proof is required for all payment methods";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission with Supabase integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items to proceed.");
      return;
    }

    if (!validateForm()) {
      setShowFormError(true);
      setTimeout(() => {
        setShowFormError(false);
      }, 3000);
      return;
    }

    try {
      setLoading(true);

      // Upload payment proof to Supabase Storage
      let paymentProofUrl = null;
      if (paymentProof) {
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `payment-proofs/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, paymentProof);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload payment proof: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);

        paymentProofUrl = publicUrl;
      }

      // Generate order number
      const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;

      // Prepare order data for Supabase
      const orderData = {
        order_number: orderNumber,
        customer_name: deliveryForm.fullName.trim(),
        customer_email: deliveryForm.email.trim(),
        customer_phone: deliveryForm.phone.trim(),
        customer_address: deliveryForm.address.trim(),
        customer_city: deliveryForm.city.trim(),
        customer_postal_code: deliveryForm.postalCode.trim() || null,
        customer_country: deliveryForm.country,
        payment_method: deliveryForm.paymentMethod,
        payment_proof_url: paymentProofUrl,
        special_instructions: deliveryForm.specialInstructions.trim() || null,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          brand: item.brand || 'Unknown',
          size: item.size || 'N/A',
          color: item.color || 'Default',
          quantity: item.quantity || 1,
          price: item.discountedPrice || item.price || item.originalPrice || 0,
          originalPrice: item.originalPrice || item.price || 0,
          discountedPrice: item.discountedPrice || null,
          image: item.image || item.images?.[0] || '',
          category: item.category || 'Shoes',
          hasDiscount: item.hasDiscount || false,
          discountPercent: item.discountPercent || null
        })),
        subtotal: subtotal,
        shipping_fee: shippingFee,
        tax: tax,
        total_amount: total,
        status: 'pending',
        payment_status: 'pending'
      };

      console.log('Submitting order:', orderData);

      // Save order to Supabase
      const { data, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      if (orderError) {
        console.error('Order error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // Success - clear cart and show confirmation
      const successMessage = `Order placed successfully! 🎉\n\nOrder Number: ${orderNumber}\nTotal Amount: Rs. ${total.toLocaleString()}\n\nWe will contact you shortly for confirmation.`;
      alert(successMessage);
      
      // Clear cart
      clearCart();
      
      // Reset form
      setDeliveryForm({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Pakistan",
        paymentMethod: "",
        specialInstructions: ""
      });
      setPaymentProof(null);

      // Redirect to home page
      navigate('/');

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Continue shopping function
  const continueShopping = () => {
    navigate(-1);
  };

  // Payment method details
  const getPaymentDetails = () => {
    switch (deliveryForm.paymentMethod) {
      case "sadapay":
        return {
          name: "SadaPay",
          details: [
            "IBAN: PK36SADA0000001234567890",
            "Account Number: 1234567890",
            "Account Title: Your Store Name",
            "Bank: SadaPay",
            "Please upload screenshot of full payment confirmation"
          ],
          uploadText: "Upload full payment screenshot"
        };
      case "nayapay":
        return {
          name: "NayaPay",
          details: [
            "IBAN: PK01NAYA0000009876543210",
            "Account Number: 9876543210",
            "Account Title: Your Store Name", 
            "Bank: NayaPay",
            "Please upload screenshot of full payment confirmation"
          ],
          uploadText: "Upload full payment screenshot"
        };
      case "cash":
        return {
          name: "Cash on Delivery",
          details: [
            "₨299 advance payment required",
            "Remaining amount payable at delivery",
            "Please upload screenshot of ₨299 advance payment"
          ],
          uploadText: "Upload ₨299 advance payment screenshot"
        };
      default:
        return null;
    }
  };

  const paymentDetails = getPaymentDetails();

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8 px-4 pb-24 md:pb-8">
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto">
        
        {/* Form Error Notification */}
        {showFormError && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-8 duration-500">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Please fill all required fields and upload payment proof to proceed</span>
            </div>
          </div>
        )}

        {/* Simple Shipping Info Banner */}
        {cartItems.length > 0 && (
          <motion.div 
            className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-green-800 font-medium text-sm">
              🚚 <span className="font-bold">Online Payment:</span> Free Shipping • 
              <span className="font-bold"> Cash on Delivery:</span> ₨299 Advance Required
            </p>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <button 
              onClick={continueShopping}
              className="flex items-center space-x-1 text-gray-600 hover:text-black transition-colors text-sm"
            >
              <FaArrowLeft size={14} />
              <span className="text-xs">Back</span>
            </button>
            <h1 className="text-lg font-bold text-black">Cart</h1>
            <div className="w-12"></div>
          </div>
          
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={continueShopping}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
              >
                <FaArrowLeft />
                <span>Continue Shopping</span>
              </button>
              <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="space-y-4">
            {/* Cart Items */}
            <motion.div
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-black flex items-center space-x-2">
                  <FaShoppingBag size={14} />
                  <span>Items ({cartItems.length})</span>
                </h2>
              </div>

              <div className="space-y-3">
                {cartItems.map((item, index) => {
                  // FIXED: Proper price calculation with discount priority
                  const itemPrice = item.discountedPrice || item.price || item.originalPrice || 0;
                  const originalPrice = item.originalPrice || item.price || 0;
                  const itemQuantity = item.quantity || 1;
                  const itemTotal = itemPrice * itemQuantity;
                  const originalTotal = originalPrice * itemQuantity;
                  const hasDiscount = itemPrice < originalPrice;

                  return (
                    <motion.div
                      key={item.id}
                      className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.title}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className="font-medium text-black text-xs mb-1">{item.title}</h3>
                        <p className="text-[10px] text-gray-500">{item.category || 'Shoes'}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-[10px] text-gray-600">Size: {item.size}</span>
                          <span className="text-[10px] text-gray-600">•</span>
                          <span className="text-[10px] text-gray-600">Color: {item.color || 'Default'}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] hover:bg-gray-300"
                            >
                              <FaMinus size={8} />
                            </button>
                            <span className="text-xs font-medium w-6 text-center">{itemQuantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[10px] hover:bg-gray-300"
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-black text-xs">PKR {itemTotal.toLocaleString()}</p>
                            {hasDiscount && (
                              <p className="text-[10px] text-gray-500 line-through">
                                PKR {originalTotal.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTrash size={12} />
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {cartItems.length === 0 && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaShoppingBag className="text-gray-400 text-lg" />
                  </div>
                  <p className="text-gray-500 text-sm mb-2">Your cart is empty</p>
                  <button
                    onClick={continueShopping}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium text-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </motion.div>

            {/* Delivery Form */}
            {cartItems.length > 0 && (
              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className="text-base font-semibold text-black mb-3 flex items-center space-x-2">
                  <FaTruck size={14} />
                  <span>Delivery Info</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={deliveryForm.fullName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-[10px] mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={deliveryForm.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-[10px] mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={deliveryForm.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="03XX-XXXXXXX"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-[10px] mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={deliveryForm.city}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your city"
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-[10px] mt-1">{formErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        name="address"
                        value={deliveryForm.address}
                        onChange={handleInputChange}
                        required
                        rows="2"
                        className={`w-full px-3 py-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter complete address"
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-[10px] mt-1">{formErrors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Payment Method *
                      </label>
                      <select
                        name="paymentMethod"
                        value={deliveryForm.paymentMethod}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash on Delivery</option>
                        <option value="sadapay">SadaPay</option>
                        <option value="nayapay">NayaPay</option>
                      </select>
                      {formErrors.paymentMethod && (
                        <p className="text-red-500 text-[10px] mt-1">{formErrors.paymentMethod}</p>
                      )}
                    </div>

                    {/* Payment Details Box */}
                    {paymentDetails && (
                      <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                        <h3 className="font-semibold text-xs mb-2">{paymentDetails.name} Details:</h3>
                        <ul className="text-[10px] text-gray-600 space-y-1">
                          {paymentDetails.details.map((detail, index) => (
                            <li key={index}>{detail}</li>
                          ))}
                        </ul>
                        
                        {/* Payment Proof Upload for ALL methods */}
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Upload Payment Proof *
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="payment-proof-mobile"
                            />
                            <label 
                              htmlFor="payment-proof-mobile" 
                              className="cursor-pointer flex flex-col items-center space-y-1"
                            >
                              <FaUpload className="text-gray-400 text-sm" />
                              <span className="text-[10px] text-gray-600">
                                {paymentProof ? paymentProof.name : paymentDetails.uploadText}
                              </span>
                            </label>
                          </div>
                          {formErrors.paymentProof && (
                            <p className="text-red-500 text-[10px] mt-1">{formErrors.paymentProof}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            {/* Order Summary - Shipping Fee Removed */}
            {cartItems.length > 0 && (
              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-base font-semibold text-black mb-3">Order Summary</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">PKR {subtotal.toLocaleString()}</span>
                  </div>

                  {shippingFee > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className="font-medium">PKR {shippingFee.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total Amount</span>
                      <span className="text-black">PKR {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-md font-semibold text-sm transition-colors ${
                    loading 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Placing Order...' : `Place Order - PKR ${total.toLocaleString()}`}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          {cartItems.length === 0 ? (
            <motion.div 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="text-gray-400 text-2xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-600 mb-3">Your cart is empty</h2>
              <p className="text-gray-500 text-base mb-8">Add some items to your cart to continue shopping</p>
              <button
                onClick={continueShopping}
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors font-medium text-base"
              >
                Start Shopping
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items Section */}
              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-semibold text-black mb-4 flex items-center space-x-2">
                  <FaShoppingBag size={18} />
                  <span>Cart Items ({cartItems.length})</span>
                </h2>

                <div className="space-y-4">
                  {cartItems.map((item, index) => {
                    // FIXED: Proper price calculation with discount priority
                    const itemPrice = item.discountedPrice || item.price || item.originalPrice || 0;
                    const originalPrice = item.originalPrice || item.price || 0;
                    const itemQuantity = item.quantity || 1;
                    const itemTotal = itemPrice * itemQuantity;
                    const originalTotal = originalPrice * itemQuantity;
                    const hasDiscount = itemPrice < originalPrice;

                    return (
                      <motion.div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || item.images?.[0]}
                            alt={item.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                          <h3 className="font-semibold text-base text-black mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-500 mb-1">{item.category || 'Shoes'}</p>
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-xs text-gray-600">Size: {item.size}</span>
                            <span className="text-xs text-gray-600">Color: {item.color || 'Default'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-300 transition-colors"
                              >
                                <FaMinus size={10} />
                              </button>
                              <span className="font-medium text-sm w-6 text-center">{itemQuantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs hover:bg-gray-300 transition-colors"
                              >
                                <FaPlus size={10} />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-black text-base">
                                PKR {itemTotal.toLocaleString()}
                              </p>
                              {hasDiscount && (
                                <p className="text-xs text-gray-500 line-through">
                                  PKR {originalTotal.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex-shrink-0 text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full transition-colors"
                          title="Remove from cart"
                        >
                          <FaTrash size={14} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Delivery Form Section */}
              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-black mb-4 flex items-center space-x-2">
                  <FaTruck size={18} />
                  <span>Delivery Information</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={deliveryForm.fullName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={deliveryForm.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={deliveryForm.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="03XX-XXXXXXX"
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={deliveryForm.city}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your city"
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      name="address"
                      value={deliveryForm.address}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter complete delivery address with house number, street, area, etc."
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={deliveryForm.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                        placeholder="Enter postal code"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method *
                      </label>
                      <select
                        name="paymentMethod"
                        value={deliveryForm.paymentMethod}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent ${
                          formErrors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash on Delivery</option>
                        <option value="sadapay">SadaPay</option>
                        <option value="nayapay">NayaPay</option>
                      </select>
                      {formErrors.paymentMethod && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.paymentMethod}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Details Box */}
                  {paymentDetails && (
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <h3 className="font-semibold text-base mb-3">{paymentDetails.name} Payment Details:</h3>
                      <ul className="text-sm text-gray-600 space-y-2 mb-4">
                        {paymentDetails.details.map((detail, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Payment Proof Upload for ALL methods */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Payment Proof *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="payment-proof"
                          />
                          <label 
                            htmlFor="payment-proof" 
                            className="cursor-pointer flex flex-col items-center space-y-2"
                          >
                            <FaUpload className="text-gray-400 text-xl" />
                            <span className="text-sm text-gray-600">
                              {paymentProof ? paymentProof.name : paymentDetails.uploadText}
                            </span>
                            <span className="text-xs text-gray-500">
                              {deliveryForm.paymentMethod === 'cash' 
                                ? 'Upload screenshot of ₨299 advance payment' 
                                : 'Upload screenshot of your payment confirmation'
                              }
                            </span>
                          </label>
                        </div>
                        {formErrors.paymentProof && (
                          <p className="text-red-500 text-xs mt-2">{formErrors.paymentProof}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={deliveryForm.specialInstructions}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                      placeholder="Any special delivery instructions, security codes, or notes for the delivery person..."
                    />
                  </div>
                </form>
              </motion.div>

              {/* Order Summary & Proceed Button Section - Shipping Fee Removed */}
              <motion.div
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-black mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">PKR {subtotal.toLocaleString()}</span>
                  </div>

                  {shippingFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className="font-medium">PKR {shippingFee.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount</span>
                      <span className="text-black">PKR {total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-base transition-colors hover:scale-105 transform duration-200 ${
                    loading 
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Placing Order...' : `Place Order - PKR ${total.toLocaleString()}`}
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;