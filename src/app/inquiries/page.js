'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Calendar,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  X,
  User,
  MapPin,
  MessageCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import {
  getAllInquiries,
  getUnreadInquiries,
  getInquiryById,
  markInquiryAsRead,
  deleteInquiry,
  getUnreadInquiryCount,
  getInquiriesByCountry,
  formatInquiryData
} from '../../services/inquiryService';

export default function Inquiries() {
  // State for inquiries data
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [viewInquiry, setViewInquiry] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Get unique countries from inquiries for filter dropdown
  const countries = [...new Set(inquiries.map(inquiry => inquiry.country).filter(Boolean))];

  // Fetch all inquiries from API
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getAllInquiries();
      const formattedData = data.map(formatInquiryData);
      setInquiries(formattedData);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setErrorMessage('Error loading inquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const countData = await getUnreadInquiryCount();
      setUnreadCount(countData.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch unread inquiries only
  const fetchUnreadInquiries = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getUnreadInquiries();
      const formattedData = data.map(formatInquiryData);
      setInquiries(formattedData);
    } catch (error) {
      console.error('Error fetching unread inquiries:', error);
      setErrorMessage('Error loading unread inquiries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load inquiries on component mount
  useEffect(() => {
    fetchInquiries();
    fetchUnreadCount();
  }, []);

  // Handle show unread only toggle
  useEffect(() => {
    if (showUnreadOnly) {
      fetchUnreadInquiries();
    } else {
      fetchInquiries();
    }
  }, [showUnreadOnly]);

  // Show success/error messages temporarily
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Filter inquiries based on search and filters
  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = !filterCountry || inquiry.country === filterCountry;
    const matchesStatus = !filterStatus || 
                         (filterStatus === 'read' && inquiry.isRead) ||
                         (filterStatus === 'unread' && !inquiry.isRead);
    
    return matchesSearch && matchesCountry && matchesStatus;
  });

  // Handle view inquiry
  const handleViewInquiry = async (inquiryId) => {
    try {
      const inquiry = await getInquiryById(inquiryId);
      const formattedInquiry = formatInquiryData(inquiry);
      setViewInquiry(formattedInquiry);
      
      // Mark as read if it's unread
      if (!inquiry.isRead) {
        await markInquiryAsRead(inquiryId);
        // Update local state
        setInquiries(prev => prev.map(inq => 
          inq.id === inquiryId ? { ...inq, isRead: true } : inq
        ));
        fetchUnreadCount(); // Refresh unread count
        setSuccessMessage('Inquiry marked as read');
      }
    } catch (error) {
      console.error('Error viewing inquiry:', error);
      setErrorMessage('Error loading inquiry details.');
    }
  };

  // Handle delete inquiry
  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteInquiry(inquiryId);
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== inquiryId));
      fetchUnreadCount(); // Refresh unread count
      setSuccessMessage('Inquiry deleted successfully');
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      setErrorMessage('Error deleting inquiry. Please try again.');
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (inquiryId) => {
    try {
      await markInquiryAsRead(inquiryId);
      setInquiries(prev => prev.map(inquiry => 
        inquiry.id === inquiryId ? { ...inquiry, isRead: true } : inquiry
      ));
      fetchUnreadCount(); // Refresh unread count
      setSuccessMessage('Inquiry marked as read');
    } catch (error) {
      console.error('Error marking inquiry as read:', error);
      setErrorMessage('Error updating inquiry status.');
    }
  };

  // Close view modal
  const closeViewModal = () => {
    setViewInquiry(null);
  };

  // Refresh inquiries
  const handleRefresh = () => {
    if (showUnreadOnly) {
      fetchUnreadInquiries();
    } else {
      fetchInquiries();
    }
    fetchUnreadCount();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
            Inquiries Management
          </h1>
          <p className="text-gray-600">
            Manage and respond to customer inquiries and messages.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <span className="text-blue-700 font-semibold">
              Total: {inquiries.length}
            </span>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-50 px-4 py-2 rounded-xl">
              <span className="text-red-700 font-semibold">
                Unread: {unreadCount}
              </span>
            </div>
          )}
          <button
            onClick={handleRefresh}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl transition-colors duration-200"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-600 hover:text-green-800 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setErrorMessage('')}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Country Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Show Unread Only Toggle */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                showUnreadOnly ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  showUnreadOnly ? 'transform translate-x-6' : ''
                }`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Unread Only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inquiries...</p>
        </div>
      )}

      {/* Inquiries List */}
      {!loading && (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-200 ${
                !inquiry.isRead ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      inquiry.isRead ? 'bg-gray-400' : 'bg-blue-500'
                    }`}></div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2 text-gray-500" />
                      {inquiry.name || 'Anonymous'}
                    </h3>
                    {!inquiry.isRead && (
                      <span className="ml-3 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">{inquiry.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-sm">{inquiry.phoneNumber || 'No phone'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{inquiry.country || 'No country'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-3">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{inquiry.createdAt}</span>
                  </div>
                  
                  {inquiry.message && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex items-start">
                        <MessageCircle className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {inquiry.message.length > 150 
                            ? `${inquiry.message.substring(0, 150)}...` 
                            : inquiry.message
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewInquiry(inquiry.id)}
                    className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {!inquiry.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(inquiry.id)}
                      className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-sm"
                      title="Mark as Read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDeleteInquiry(inquiry.id)}
                    className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center text-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredInquiries.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterCountry || filterStatus || showUnreadOnly
              ? 'Try adjusting your search criteria or filters.'
              : 'No inquiries have been submitted yet.'
            }
          </p>
        </div>
      )}

      {/* View Inquiry Modal */}
      {viewInquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
                Inquiry Details
              </h2>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Inquiry Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    {viewInquiry.name || 'Anonymous'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      viewInquiry.isRead 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {viewInquiry.isRead ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-3" />
                      <span>{viewInquiry.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-3" />
                      <span>{viewInquiry.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-3" />
                      <span>{viewInquiry.country || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Inquiry Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-3" />
                      <span>Submitted: {viewInquiry.createdAt}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-3" />
                      <span>Time: {viewInquiry.formattedTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              {viewInquiry.message && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {viewInquiry.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Information */}
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    viewInquiry.isRead ? 'bg-gray-400' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-blue-900">
                      Status: {viewInquiry.isRead ? 'Read' : 'Unread'}
                    </p>
                    <p className="text-sm text-blue-600">
                      {viewInquiry.isRead 
                        ? 'This inquiry has been marked as read'
                        : 'This inquiry is awaiting review'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              {!viewInquiry.isRead && (
                <button
                  onClick={() => {
                    handleMarkAsRead(viewInquiry.id);
                    setViewInquiry({ ...viewInquiry, isRead: true });
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => {
                  handleDeleteInquiry(viewInquiry.id);
                  closeViewModal();
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
              <button
                onClick={closeViewModal}
                className="bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}