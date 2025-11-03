// src/dashboard/CartMgt.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { FaSearch, FaEye, FaTrash, FaDownload, FaFilePdf, FaTimesCircle } from 'react-icons/fa';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CartMgt = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  // Date filter options
  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate = new Date();

        switch (dateFilter) {
          case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(now.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);
            break;
          case 'year':
            startDate.setFullYear(now.getFullYear(), 0, 1);
            startDate.setHours(0, 0, 0, 0);
            break;
          default:
            break;
        }

        query = query.gte('created_at', startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Error fetching orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateFilter]);

  // Search orders
  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_phone.includes(searchTerm)
  );

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      showToast(`Order status updated to ${newStatus}`);
      fetchOrders();
      setShowOrderModal(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      showToast('Error updating order status', 'error');
    }
  };

  // Update payment status
  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;
      
      showToast(`Payment status updated to ${newPaymentStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      showToast('Error updating payment status', 'error');
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      showToast('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      showToast('Error deleting order', 'error');
    }
  };

  // Generate PDF from scratch
  const generatePDFFromScratch = () => {
    if (!selectedOrder) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      let yPosition = 20;
      const lineHeight = 6;
      const margin = 20;
      const pageHeight = 295;

      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.text('ORDER INVOICE', 105, yPosition, { align: 'center' });
      yPosition += lineHeight * 2;

      pdf.setFontSize(12);
      pdf.text(`Order #: ${selectedOrder.order_number}`, margin, yPosition);
      pdf.text(`Date: ${new Date(selectedOrder.created_at).toLocaleDateString()}`, 150, yPosition);
      yPosition += lineHeight * 2;

      // Two column layout for customer and order info
      const col1 = margin;
      const col2 = 110;

      // Customer Information
      pdf.setFontSize(14);
      pdf.text('CUSTOMER INFORMATION', col1, yPosition);
      yPosition += lineHeight;
      pdf.setFontSize(10);
      pdf.text(`Name: ${selectedOrder.customer_name}`, col1, yPosition);
      yPosition += lineHeight;
      pdf.text(`Email: ${selectedOrder.customer_email}`, col1, yPosition);
      yPosition += lineHeight;
      pdf.text(`Phone: ${selectedOrder.customer_phone}`, col1, yPosition);
      yPosition += lineHeight;
      pdf.text(`Address: ${selectedOrder.customer_address}`, col1, yPosition);
      yPosition += lineHeight;
      pdf.text(`City: ${selectedOrder.customer_city}`, col1, yPosition);
      
      // Order Information (right column)
      let yRight = yPosition - (lineHeight * 4);
      pdf.setFontSize(14);
      pdf.text('ORDER INFORMATION', col2, yRight);
      yRight += lineHeight;
      pdf.setFontSize(10);
      pdf.text(`Status: ${selectedOrder.status.toUpperCase()}`, col2, yRight);
      yRight += lineHeight;
      pdf.text(`Payment: ${selectedOrder.payment_status.toUpperCase()}`, col2, yRight);
      yRight += lineHeight;
      pdf.text(`Method: ${selectedOrder.payment_method}`, col2, yRight);
      yRight += lineHeight;
      if (selectedOrder.tracking_number) {
        pdf.text(`Tracking: ${selectedOrder.tracking_number}`, col2, yRight);
      }

      yPosition = Math.max(yPosition, yRight) + lineHeight * 2;

      // Order Items Table
      pdf.setFontSize(14);
      pdf.text('ORDER ITEMS', margin, yPosition);
      yPosition += lineHeight;

      // Table header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPosition, 170, 8, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Product', margin + 2, yPosition + 5);
      pdf.text('Qty', margin + 120, yPosition + 5);
      pdf.text('Price', margin + 140, yPosition + 5);
      pdf.text('Total', margin + 160, yPosition + 5);
      yPosition += 10;

      if (Array.isArray(selectedOrder.items)) {
        selectedOrder.items.forEach((item) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
            pdf.setFillColor(240, 240, 240);
            pdf.rect(margin, yPosition, 170, 8, 'F');
            pdf.text('Product', margin + 2, yPosition + 5);
            pdf.text('Qty', margin + 120, yPosition + 5);
            pdf.text('Price', margin + 140, yPosition + 5);
            pdf.text('Total', margin + 160, yPosition + 5);
            yPosition += 10;
          }

          const itemName = item.title || 'Unknown Item';
          const truncatedName = itemName.length > 50 ? itemName.substring(0, 50) + '...' : itemName;
          const quantity = item.quantity || 1;
          const price = item.price || item.discountedPrice || item.originalPrice || 0;
          const total = price * quantity;

          pdf.text(truncatedName, margin + 2, yPosition + 4);
          pdf.text(quantity.toString(), margin + 120, yPosition + 4);
          pdf.text(formatCurrency(price), margin + 140, yPosition + 4);
          pdf.text(formatCurrency(total), margin + 160, yPosition + 4);
          
          yPosition += lineHeight;
        });
      }

      yPosition += lineHeight;

      // Order Summary
      pdf.setDrawColor(0, 0, 0);
      pdf.line(margin, yPosition, 190, yPosition);
      yPosition += lineHeight;

      pdf.setFontSize(12);
      pdf.text('ORDER SUMMARY', margin, yPosition);
      yPosition += lineHeight;

      pdf.setFontSize(10);
      pdf.text(`Subtotal: ${formatCurrency(selectedOrder.subtotal)}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`Shipping: ${formatCurrency(selectedOrder.shipping_fee)}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`Tax: ${formatCurrency(selectedOrder.tax)}`, margin, yPosition);
      yPosition += lineHeight;

      pdf.setDrawColor(0, 0, 0);
      pdf.line(margin, yPosition, 190, yPosition);
      yPosition += lineHeight;

      pdf.setFontSize(12);
      pdf.setFont(undefined, 'bold');
      pdf.text(`TOTAL: ${formatCurrency(selectedOrder.total_amount)}`, margin, yPosition);

      // Special Instructions
      if (selectedOrder.special_instructions) {
        yPosition += lineHeight * 2;
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        pdf.text('Special Instructions:', margin, yPosition);
        yPosition += lineHeight;
        
        const instructions = selectedOrder.special_instructions;
        const maxWidth = 170;
        const splitInstructions = pdf.splitTextToSize(instructions, maxWidth);
        pdf.text(splitInstructions, margin, yPosition);
      }

      pdf.save(`order-${selectedOrder.order_number}.pdf`);
      showToast('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Error downloading PDF', 'error');
    }
  };

  const downloadOrderPDF = async () => {
    generatePDFFromScratch();
  };

  // Export orders to CSV with date filter
  const exportToCSV = () => {
    try {
      const headers = ['Order Number', 'Customer Name', 'Phone', 'Email', 'City', 'Amount', 'Status', 'Payment Status', 'Date'];
      const csvData = filteredOrders.map(order => [
        order.order_number,
        order.customer_name,
        order.customer_phone,
        order.customer_email,
        order.customer_city,
        `Rs. ${order.total_amount}`,
        order.status,
        order.payment_status,
        new Date(order.created_at).toLocaleDateString()
      ]);

      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const dateLabel = dateOptions.find(opt => opt.value === dateFilter)?.label || 'All';
      link.download = `orders-${dateLabel.toLowerCase().replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.csv`;
      
      link.click();
      window.URL.revokeObjectURL(url);
      showToast('CSV exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showToast('Error exporting CSV', 'error');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString() || '0'}`;
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusInfo = statusOptions.find(opt => opt.value === status);
    return statusInfo ? statusInfo.color : 'bg-gray-100 text-gray-800';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusInfo = statusOptions.find(opt => opt.value === status);
    return statusInfo ? statusInfo.label : status;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 sm:px-4 lg:px-8">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
          toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 pt-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track all customer orders</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4">
          <div className="flex flex-col gap-3">
            {/* Search */}
            <div className="w-full">
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by order number, name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export Button */}
              <div>
                <button
                  onClick={exportToCSV}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <FaDownload size={14} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List - Mobile Friendly */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.order_number}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {order.payment_method}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer_phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer_city}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <FaEye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <FaTrash size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4 p-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
                        <p className="text-sm text-gray-500 capitalize">{order.payment_method}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-sm text-gray-600">{order.customer_phone}</p>
                        <p className="text-sm text-gray-600">{order.customer_city}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(order.total_amount)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.payment_status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <FaEye size={12} />
                        View
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <FaTrash size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order - {selectedOrder.order_number}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={downloadOrderPDF}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <FaFilePdf size={12} />
                    <span className="hidden sm:inline">Download PDF</span>
                  </button>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimesCircle size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Order Header */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Invoice</h2>
                  <p className="text-gray-600 text-sm">Order #: {selectedOrder.order_number}</p>
                  <p className="text-gray-600 text-sm">Date: {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                </div>

                {/* Customer & Order Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {selectedOrder.customer_name}</p>
                      <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                      <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                      <p><strong>Address:</strong> {selectedOrder.customer_address}</p>
                      <p><strong>City:</strong> {selectedOrder.customer_city}</p>
                      {selectedOrder.customer_postal_code && (
                        <p><strong>Postal Code:</strong> {selectedOrder.customer_postal_code}</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">Order Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                      <p><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>
                      <p className="flex items-center gap-2">
                        <strong>Payment Status:</strong> 
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedOrder.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                          selectedOrder.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedOrder.payment_status}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <strong>Order Status:</strong> 
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>
                          {getStatusLabel(selectedOrder.status)}
                        </span>
                      </p>
                      {selectedOrder.tracking_number && (
                        <p><strong>Tracking:</strong> {selectedOrder.tracking_number} ({selectedOrder.shipping_carrier})</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">Order Items</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Product</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Size</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Price</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.title}
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                  )}
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{item.title}</p>
                                    <p className="text-xs text-gray-500">{item.brand || 'N/A'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-sm">{item.size || 'N/A'}</td>
                              <td className="px-3 py-2 text-sm">{item.quantity || 1}</td>
                              <td className="px-3 py-2 text-sm">{formatCurrency(item.price || item.discountedPrice || item.originalPrice)}</td>
                              <td className="px-3 py-2 text-sm font-semibold">
                                {formatCurrency((item.price || item.discountedPrice || item.originalPrice) * (item.quantity || 1))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Fee:</span>
                      <span>{formatCurrency(selectedOrder.shipping_fee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-300 pt-2 font-semibold text-base">
                      <span>Total Amount:</span>
                      <span>{formatCurrency(selectedOrder.total_amount)}</span>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.special_instructions && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-1 text-lg">Special Instructions</h4>
                    <p className="text-sm text-gray-700">{selectedOrder.special_instructions}</p>
                  </div>
                )}

                {/* Payment Proof */}
                {selectedOrder.payment_proof_url && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">Payment Proof</h4>
                    <img
                      src={selectedOrder.payment_proof_url}
                      alt="Payment Proof"
                      className="max-w-full border border-gray-200 rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Status Update Section */}
              <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">Update Order Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={selectedOrder.payment_status}
                      onChange={(e) => updatePaymentStatus(selectedOrder.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="pending">Payment Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartMgt;