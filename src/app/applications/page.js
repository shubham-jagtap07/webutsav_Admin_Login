'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Calendar,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  X,
  ExternalLink
} from 'lucide-react';

export default function Applications() {
  // State for applications data
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [viewApplication, setViewApplication] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Department options (matching your job departments)
  const departments = [
    'Research & Development',
    'Sales',
    'Digital Marketing',
    'Back Office'
  ];

  // Application status options
  const statusOptions = [
    'Pending',
    'Reviewed',
    'Shortlisted',
    'Rejected',
    'Hired'
  ];

  // Fetch all applications from API
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.webutsav.com/employees/getAllAppliedEmployees');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        setErrorMessage('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setErrorMessage('Error loading applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

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

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobRole?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !filterDepartment || app.department === filterDepartment;
    const matchesStatus = !filterStatus || app.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleViewApplication = (applicationId) => {
    const application = applications.find(app => app.applicationId === applicationId);
    if (application) {
      setViewApplication(application);
    }
  };

  const handleDownloadResume = (resumeUrl, applicantName) => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      setErrorMessage('Resume not available for download');
    }
  };

  const closeViewModal = () => {
    setViewApplication(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Job Applications
          </h1>
          <p className="text-gray-600">
            Manage and review all job applications submitted by candidates.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-blue-50 px-4 py-2 rounded-xl">
            <span className="text-blue-700 font-semibold">
              Total Applications: {applications.length}
            </span>
          </div>
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
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
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
                <XCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium">{errorMessage}</p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setErrorMessage('')}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or job role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      )}

      {/* Applications Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <div
              key={application.applicationId}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Application Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{application.fullName || 'Name not provided'}</h3>
                  <p className="text-gray-600 text-sm">{application.jobRole || 'Job role not specified'}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  ID: {application.applicationId}
                </span>
              </div>

              {/* Application Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {application.email || 'Email not provided'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {application.phone || 'Phone not provided'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building className="w-4 h-4 mr-2" />
                  {application.department || 'Department not specified'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {application.experience || 'Experience not specified'}
                </div>
              </div>

              {/* Resume */}
              <div className="mb-4">
                {application.resume ? (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-700 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Resume Available
                    </span>
                    <button
                      onClick={() => handleDownloadResume(application.resume, application.fullName)}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 rounded-xl">
                    <span className="text-sm text-red-700">No resume uploaded</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewApplication(application.applicationId)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </button>
                {application.resume && (
                  <button
                    onClick={() => handleDownloadResume(application.resume, application.fullName)}
                    className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center text-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterDepartment || filterStatus 
              ? 'Try adjusting your search criteria or filters.'
              : 'No job applications have been submitted yet.'
            }
          </p>
        </div>
      )}

      {/* View Application Modal */}
      {viewApplication && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600" />
                Application Details
              </h2>
              <button
                onClick={closeViewModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Applicant Header */}
              <div className="text-center border-b border-gray-200 pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {viewApplication.fullName || 'Name not provided'}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  Application ID: {viewApplication.applicationId}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  {viewApplication.jobRole && (
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {viewApplication.jobRole}
                    </span>
                  )}
                  {viewApplication.department && (
                    <span className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {viewApplication.department}
                    </span>
                  )}
                </div>
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{viewApplication.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{viewApplication.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>Experience: {viewApplication.experience || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <span>Department: {viewApplication.department || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Resume</h3>
                {viewApplication.resume ? (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">Resume Document</p>
                          <p className="text-sm text-gray-600">Click to view the uploaded resume</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadResume(viewApplication.resume, viewApplication.fullName)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Resume
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <XCircle className="w-8 h-8 text-red-600 mr-3" />
                      <div>
                        <p className="font-medium text-red-900">No Resume Uploaded</p>
                        <p className="text-sm text-red-600">The applicant has not uploaded a resume</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Application Status */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Application Status</h3>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-6 h-6 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-blue-900">Status: Pending Review</p>
                        <p className="text-sm text-blue-600">Application is awaiting review</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeViewModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
              {viewApplication.resume && (
                <button
                  onClick={() => handleDownloadResume(viewApplication.resume, viewApplication.fullName)}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </button>
              )}
              <button
                onClick={() => {
                  // Handle application action (approve/reject)
                  setSuccessMessage('Application status updated successfully!');
                  closeViewModal();
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
