// Inquiry API Service
// Base URL for inquiry API
const BASE_URL = 'https://api.webutsav.com/api/inquiries';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to handle API errors
const handleError = (error) => {
  console.error('API Error:', error);
  throw error;
};

// Submit a new inquiry
export const submitInquiry = async (inquiryData) => {
  try {
    const response = await fetch(`${BASE_URL}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inquiryData),
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Get all inquiries
export const getAllInquiries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Get unread inquiries
export const getUnreadInquiries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/unread`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Get inquiry by ID
export const getInquiryById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Mark inquiry as read
export const markInquiryAsRead = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/mark-read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Get unread inquiry count
export const getUnreadInquiryCount = async () => {
  try {
    const response = await fetch(`${BASE_URL}/unread/count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Delete inquiry
export const deleteInquiry = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Get inquiries by country
export const getInquiriesByCountry = async (country) => {
  try {
    const response = await fetch(`${BASE_URL}/country/${encodeURIComponent(country)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

// Utility function to format inquiry data for display
export const formatInquiryData = (inquiry) => {
  return {
    ...inquiry,
    createdAt: inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleString() : 'N/A',
    formattedDate: inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : 'N/A',
    formattedTime: inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleTimeString() : 'N/A',
  };
};

// Utility function to validate inquiry data before submission
export const validateInquiryData = (data) => {
  const errors = [];
  
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!data.email || data.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!data.phoneNumber || data.phoneNumber.trim().length === 0) {
    errors.push('Phone number is required');
  }
  
  if (!data.country || data.country.trim().length === 0) {
    errors.push('Country is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};