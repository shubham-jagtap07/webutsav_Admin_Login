'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  Building,
  IndianRupee
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Jobs() {
  const router = useRouter();

  // State for jobs data
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [viewJob, setViewJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const departments = [
     'Research & Development',
    'Sales',
    'Digital Marketing',
    'Back Office'];

  // Fetch all jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.webutsav.com/job/getAllJob');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        setErrorMessage('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setErrorMessage('Error loading jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchJobs();
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

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.jobProfile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.keyword && job.keyword.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesDepartment = !filterDepartment || job.department === filterDepartment;
    const matchesStatus = !filterStatus || job.isActive === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handlePostJob = () => {
    router.push('/post-job');
  };

  const handleViewJob = (jobId) => {
    const job = jobs.find(j => (j.jobId || j.id) === jobId);
    if (job) {
      setViewJob(job);
    }
  };

  const handleEditJob = (jobId) => {
    const job = jobs.find(j => (j.jobId || j.id) === jobId);
    if (job) {
      setEditJob(job);
      setEditFormData({
        jobProfile: job.jobProfile || '',
        jobRole: job.jobRole || '',
        description: job.description || '',
        experience: job.experience || '',
        shift: job.shift || '',
        department: job.department || '',
        employmentType: job.employmentType || '',
        isActive: job.isActive || 'true',
        expectedSalary: job.expectedSalary || '',
        vacancy: job.vacancy || '',
        keywords: job.keyword || [],
        rolesAndResponsibility: job.rolesAndResponsibility || []
      });
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      try {
        const response = await fetch(`https://api.webutsav.com/job/delete/${jobId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccessMessage('Job deleted successfully!');
          // Refresh the jobs list
          fetchJobs();
        } else {
          setErrorMessage('Failed to delete job. Please try again.');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        setErrorMessage('Error deleting job. Please try again.');
      }
    }
  };

  const handleUpdateJob = async (jobId, updatedJobData) => {
    try {
      const response = await fetch(`https://api.webutsav.com/job/update/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJobData),
      });

      if (response.ok) {
        const updatedJob = await response.json();
        setSuccessMessage('Job updated successfully!');
        // Refresh the jobs list
        fetchJobs();
        return updatedJob;
      } else {
        setErrorMessage('Failed to update job. Please try again.');
        return null;
      }
    } catch (error) {
      console.error('Error updating job:', error);
      setErrorMessage('Error updating job. Please try again.');
      return null;
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    if (editJob) {
      const result = await handleUpdateJob(editJob.jobId || editJob.id, editFormData);
      if (result) {
        setEditJob(null);
        setEditFormData({});
      }
    }
  };

  const closeViewModal = () => {
    setViewJob(null);
  };

  const closeEditModal = () => {
    setEditJob(null);
    setEditFormData({});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-blue-600" />
            Job Listings
          </h1>
          <p className="text-gray-600">
            Manage all job postings and track applications. 
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handlePostJob}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
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
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
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
                placeholder="Search jobs, roles, or skills..."
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
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
          >
            {/* Job Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{job.jobProfile}</h3>
                <p className="text-gray-600 text-sm">{job.jobRole}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                job.isActive === 'true' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {job.isActive === 'true' ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Job Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {job.department}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {job.experience} • {job.shift}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <IndianRupee className="w-4 h-4 mr-2" />
                ₹{job.expectedSalary}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Posted: {new Date(job.postedDate).toLocaleDateString()}
              </div>
            </div>

            {/* Keywords */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {job.keyword && job.keyword.slice(0, 3).map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
                {job.keyword && job.keyword.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{job.keyword.length - 3} more
                  </span>
                )}
                {(!job.keyword || job.keyword.length === 0) && (
                  <span className="text-gray-500 text-xs">No keywords specified</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewJob(job.jobId || job.id)}
                className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button
                onClick={() => handleEditJob(job.jobId || job.id)}
                className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteJob(job.jobId || job.id)}
                className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterDepartment || filterStatus 
              ? 'Try adjusting your search criteria or filters.'
              : 'No job postings available at the moment.'
            }
          </p>
          <button
            onClick={handlePostJob}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            Post Your First Job
          </button>
        </div>
      )}

      {/* View Job Modal */}
      {viewJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-blue-600" />
                Job Details
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
              {/* Job Header */}
              <div className="text-center border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {viewJob.jobProfile}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {viewJob.jobRole}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  {viewJob.department && (
                    <span className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {viewJob.department}
                    </span>
                  )}
                  {viewJob.experience && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {viewJob.experience}
                    </span>
                  )}
                  {viewJob.expectedSalary && (
                    <span className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {viewJob.expectedSalary}
                    </span>
                  )}
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Employment Type</h3>
                  <p className="text-gray-600">{viewJob.employmentType || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Work Shift</h3>
                  <p className="text-gray-600">{viewJob.shift || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Number of Vacancies</h3>
                  <p className="text-gray-600">{viewJob.vacancy || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Posted Date</h3>
                  <p className="text-gray-600">
                    {viewJob.postedDate ? new Date(viewJob.postedDate).toLocaleDateString() : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    viewJob.isActive === 'true' || viewJob.isActive === true
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {viewJob.isActive === 'true' || viewJob.isActive === true ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {viewJob.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{viewJob.description}</p>
                  </div>
                </div>
              )}

              {/* Roles and Responsibilities */}
              {viewJob.rolesAndResponsibility && viewJob.rolesAndResponsibility.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Roles & Responsibilities</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="list-disc list-inside space-y-2">
                      {viewJob.rolesAndResponsibility.map((role, index) => (
                        <li key={index} className="text-gray-700">{role}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Keywords */}
              {viewJob.keyword && viewJob.keyword.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Required Skills & Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewJob.keyword.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeViewModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeViewModal();
                  handleEditJob(viewJob.jobId || viewJob.id);
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editJob && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Edit className="w-6 h-6 mr-2 text-blue-600" />
                Edit Job
              </h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleEditFormSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Profile</label>
                    <input
                      type="text"
                      name="jobProfile"
                      value={editFormData.jobProfile || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
                    <input
                      type="text"
                      name="jobRole"
                      value={editFormData.jobRole || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      name="department"
                      value={editFormData.department || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                    <select
                      name="employmentType"
                      value={editFormData.employmentType || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Employment Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={editFormData.experience || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 3-5 years"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Shift</label>
                    <select
                      name="shift"
                      value={editFormData.shift || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Shift</option>
                      <option value="Day Shift">Day Shift</option>
                      <option value="Night Shift">Night Shift</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
                    <input
                      type="text"
                      name="expectedSalary"
                      value={editFormData.expectedSalary || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., ₹50,000 - ₹80,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Vacancies</label>
                    <input
                      type="number"
                      name="vacancy"
                      value={editFormData.vacancy || ''}
                      onChange={handleEditFormChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea
                  name="description"
                  value={editFormData.description || ''}
                  onChange={handleEditFormChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the job role, responsibilities, and requirements..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Status</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isActive"
                      value="true"
                      checked={editFormData.isActive === 'true' || editFormData.isActive === true}
                      onChange={handleEditFormChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isActive"
                      value="false"
                      checked={editFormData.isActive === 'false' || editFormData.isActive === false}
                      onChange={handleEditFormChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




// 'use client';

// import React, { useState, useEffect } from 'react';
// import {
//   Briefcase,
//   MapPin,
//   Clock,
//   DollarSign,
//   Users,
//   Calendar,
//   Search,
//   Filter,
//   Eye,
//   Edit,
//   Trash2,
//   Plus,
//   X,
//   Building,
//   IndianRupee
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// export default function Jobs() {
//   const router = useRouter();

//   // State for jobs data
//   const [jobs, setJobs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [viewJob, setViewJob] = useState(null);
//   const [editJob, setEditJob] = useState(null);
//   const [editFormData, setEditFormData] = useState({});

//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterDepartment, setFilterDepartment] = useState('');
//   const [filterStatus, setFilterStatus] = useState('');

//   const departments = [
//      'Research & Development',
//     'Sales',
//     'Digital Marketing',
//     'Back Office'];

//   // Fetch all jobs from API
//   const fetchJobs = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('https://api.webutsav.com/job/getAllJob');
//       if (response.ok) {
//         const data = await response.json();
//         setJobs(data);
//       } else {
//         setErrorMessage('Failed to fetch jobs');
//       }
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//       setErrorMessage('Error loading jobs. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Load jobs on component mount
//   useEffect(() => {
//     fetchJobs();
//   }, []);

//   // Show success/error messages temporarily
//   useEffect(() => {
//     if (successMessage || errorMessage) {
//       const timer = setTimeout(() => {
//         setSuccessMessage('');
//         setErrorMessage('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, errorMessage]);

//   const filteredJobs = jobs.filter(job => {
//     const matchesSearch = job.jobProfile?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          job.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          (job.keyword && job.keyword.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase())));

//     const matchesDepartment = !filterDepartment || job.department === filterDepartment;
//     const matchesStatus = !filterStatus || job.isActive === filterStatus;

//     return matchesSearch && matchesDepartment && matchesStatus;
//   });

//   const handlePostJob = () => {
//     router.push('/post-job');
//   };

//   const handleViewJob = (jobId) => {
//     const job = jobs.find(j => (j.jobId || j.id) === jobId);
//     if (job) {
//       setViewJob(job);
//     }
//   };

//   const handleEditJob = (jobId) => {
//     const job = jobs.find(j => (j.jobId || j.id) === jobId);
//     if (job) {
//       setEditJob(job);
//       setEditFormData({
//         jobProfile: job.jobProfile || '',
//         jobRole: job.jobRole || '',
//         description: job.description || '',
//         experience: job.experience || '',
//         shift: job.shift || '',
//         department: job.department || '',
//         employmentType: job.employmentType || '',
//         isActive: job.isActive || 'true',
//         expectedSalary: job.expectedSalary || '',
//         vacancy: job.vacancy || '',
//         keywords: job.keyword || [],
//         rolesAndResponsibility: job.rolesAndResponsibility || []
//       });
//     }
//   };

//   const handleDeleteJob = async (jobId) => {
//     if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
//       try {
//         const response = await fetch(`https://api.webutsav.com/job/delete/${jobId}`, {
//           method: 'DELETE',
//         });

//         if (response.ok) {
//           setSuccessMessage('Job deleted successfully!');
//           // Refresh the jobs list
//           fetchJobs();
//         } else {
//           setErrorMessage('Failed to delete job. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error deleting job:', error);
//         setErrorMessage('Error deleting job. Please try again.');
//       }
//     }
//   };

//   const handleUpdateJob = async (jobId, updatedJobData) => {
//     try {
//       const response = await fetch(`https://api.webutsav.com/job/update/${jobId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedJobData),
//       });

//       if (response.ok) {
//         const updatedJob = await response.json();
//         setSuccessMessage('Job updated successfully!');
//         // Refresh the jobs list
//         fetchJobs();
//         return updatedJob;
//       } else {
//         setErrorMessage('Failed to update job. Please try again.');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error updating job:', error);
//       setErrorMessage('Error updating job. Please try again.');
//       return null;
//     }
//   };

//   const handleEditFormChange = (e) => {
//     const { name, value } = e.target;
//     setEditFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleEditFormSubmit = async (e) => {
//     e.preventDefault();
//     if (editJob) {
//       const result = await handleUpdateJob(editJob.jobId || editJob.id, editFormData);
//       if (result) {
//         setEditJob(null);
//         setEditFormData({});
//       }
//     }
//   };

//   const closeViewModal = () => {
//     setViewJob(null);
//   };

//   const closeEditModal = () => {
//     setEditJob(null);
//     setEditFormData({});
//   };

//   return (
//     <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
//             <Briefcase className="w-8 h-8 mr-3 text-blue-600" />
//             Job Listings
//           </h1>
//           <p className="text-gray-600">
//             Manage all job postings and track applications.
//           </p>
//         </div>
//         <div className="mt-4 sm:mt-0">
//           <button
//             onClick={handlePostJob}
//             className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             Post New Job
//           </button>
//         </div>
//       </div>

//       {/* Success Message */}
//       {successMessage && (
//         <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                 </svg>
//               </div>
//             </div>
//             <div className="ml-3">
//               <p className="text-green-800 font-medium">{successMessage}</p>
//             </div>
//             <div className="ml-auto">
//               <button
//                 onClick={() => setSuccessMessage('')}
//                 className="text-green-600 hover:text-green-800"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Error Message */}
//       {errorMessage && (
//         <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                 </svg>
//               </div>
//             </div>
//             <div className="ml-3">
//               <p className="text-red-800 font-medium">{errorMessage}</p>
//             </div>
//             <div className="ml-auto">
//               <button
//                 onClick={() => setErrorMessage('')}
//                 className="text-red-600 hover:text-red-800"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="md:col-span-2">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search jobs, roles, or skills..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               />
//             </div>
//           </div>

//           {/* Department Filter */}
//           <div>
//             <select
//               value={filterDepartment}
//               onChange={(e) => setFilterDepartment(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//             >
//               <option value="">All Departments</option>
//               {departments.map((dept) => (
//                 <option key={dept} value={dept}>
//                   {dept}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Status Filter */}
//           <div>
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//             >
//               <option value="">All Status</option>
//               <option value="true">Active</option>
//               <option value="false">Inactive</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div className="text-center py-12">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading jobs...</p>
//         </div>
//       )}

//       {/* Jobs Grid */}
//       {!loading && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {filteredJobs.map((job) => (
//           <div
//             key={job.id}
//             className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
//           >
//             {/* Job Header */}
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-900 mb-1">{job.jobProfile}</h3>
//                 <p className="text-gray-600 text-sm">{job.jobRole}</p>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                 job.isActive === 'true' 
//                   ? 'bg-green-100 text-green-700' 
//                   : 'bg-red-100 text-red-700'
//               }`}>
//                 {job.isActive === 'true' ? 'Active' : 'Inactive'}
//               </span>
//             </div>

//             {/* Job Details */}
//             <div className="space-y-3 mb-4">
//               <div className="flex items-center text-sm text-gray-600">
//                 <Users className="w-4 h-4 mr-2" />
//                 {job.department}
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <Clock className="w-4 h-4 mr-2" />
//                 {job.experience} • {job.shift}
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <DollarSign className="w-4 h-4 mr-2" />
//                 {job.expectedSalary}
//               </div>
//               <div className="flex items-center text-sm text-gray-600">
//                 <Calendar className="w-4 h-4 mr-2" />
//                 Posted: {new Date(job.postedDate).toLocaleDateString()}
//               </div>
//             </div>

//             {/* Keywords */}
//             <div className="mb-4">
//               <div className="flex flex-wrap gap-1">
//                 {job.keyword && job.keyword.slice(0, 3).map((keyword, index) => (
//                   <span
//                     key={index}
//                     className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
//                   >
//                     {keyword}
//                   </span>
//                 ))}
//                 {job.keyword && job.keyword.length > 3 && (
//                   <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
//                     +{job.keyword.length - 3} more
//                   </span>
//                 )}
//                 {(!job.keyword || job.keyword.length === 0) && (
//                   <span className="text-gray-500 text-xs">No keywords specified</span>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handleViewJob(job.jobId || job.id)}
//                 className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center text-sm"
//               >
//                 <Eye className="w-4 h-4 mr-1" />
//                 View
//               </button>
//               <button
//                 onClick={() => handleEditJob(job.jobId || job.id)}
//                 className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center text-sm"
//               >
//                 <Edit className="w-4 h-4 mr-1" />
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDeleteJob(job.jobId || job.id)}
//                 className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center text-sm"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//         </div>
//       )}

//       {/* No Results */}
//       {!loading && filteredJobs.length === 0 && (
//         <div className="text-center py-12">
//           <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
//           <p className="text-gray-600 mb-4">
//             {searchTerm || filterDepartment || filterStatus 
//               ? 'Try adjusting your search criteria or filters.'
//               : 'No job postings available at the moment.'
//             }
//           </p>
//           <button
//             onClick={handlePostJob}
//             className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
//           >
//             Post Your First Job
//           </button>
//         </div>
//       )}

//       {/* View Job Modal */}
//       {viewJob && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center">
//                 <Eye className="w-6 h-6 mr-2 text-blue-600" />
//                 Job Details
//               </h2>
//               <button
//                 onClick={closeViewModal}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//               >
//                 <X className="w-6 h-6 text-gray-600" />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 space-y-6">
//               {/* Job Header */}
//               <div className="text-center border-b border-gray-200 pb-6">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                   {viewJob.jobProfile}
//                 </h1>
//                 <p className="text-xl text-gray-600 mb-4">
//                   {viewJob.jobRole}
//                 </p>
//                 <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
//                   {viewJob.department && (
//                     <span className="flex items-center">
//                       <Building className="w-4 h-4 mr-1" />
//                       {viewJob.department}
//                     </span>
//                   )}
//                   {viewJob.experience && (
//                     <span className="flex items-center">
//                       <Clock className="w-4 h-4 mr-1" />
//                       {viewJob.experience}
//                     </span>
//                   )}
//                   {viewJob.expectedSalary && (
//                     <span className="flex items-center">
//                       <IndianRupee className="w-4 h-4 mr-1" />
//                       {viewJob.expectedSalary}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {/* Job Details Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Employment Type</h3>
//                   <p className="text-gray-600">{viewJob.employmentType || 'Not specified'}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Work Shift</h3>
//                   <p className="text-gray-600">{viewJob.shift || 'Not specified'}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Number of Vacancies</h3>
//                   <p className="text-gray-600">{viewJob.vacancy || 'Not specified'}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Posted Date</h3>
//                   <p className="text-gray-600">
//                     {viewJob.postedDate ? new Date(viewJob.postedDate).toLocaleDateString() : 'Not specified'}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
//                   <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                     viewJob.isActive === 'true' || viewJob.isActive === true
//                       ? 'bg-green-100 text-green-700'
//                       : 'bg-red-100 text-red-700'
//                   }`}>
//                     {viewJob.isActive === 'true' || viewJob.isActive === true ? 'Active' : 'Inactive'}
//                   </span>
//                 </div>
//               </div>

//               {/* Description */}
//               {viewJob.description && (
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
//                   <div className="bg-gray-50 rounded-xl p-4">
//                     <p className="text-gray-700 whitespace-pre-wrap">{viewJob.description}</p>
//                   </div>
//                 </div>
//               )}

//               {/* Roles and Responsibilities */}
//               {viewJob.rolesAndResponsibility && viewJob.rolesAndResponsibility.length > 0 && (
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-3">Roles & Responsibilities</h3>
//                   <div className="bg-gray-50 rounded-xl p-4">
//                     <ul className="list-disc list-inside space-y-2">
//                       {viewJob.rolesAndResponsibility.map((role, index) => (
//                         <li key={index} className="text-gray-700">{role}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               )}

//               {/* Keywords */}
//               {viewJob.keyword && viewJob.keyword.length > 0 && (
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-3">Required Skills & Keywords</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {viewJob.keyword.map((keyword, index) => (
//                       <span
//                         key={index}
//                         className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
//                       >
//                         {keyword}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
//               <button
//                 onClick={closeViewModal}
//                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   closeViewModal();
//                   handleEditJob(viewJob.jobId || viewJob.id);
//                 }}
//                 className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center"
//               >
//                 <Edit className="w-4 h-4 mr-2" />
//                 Edit Job
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Job Modal */}
//       {editJob && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             {/* Modal Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-2xl font-bold text-gray-900 flex items-center">
//                 <Edit className="w-6 h-6 mr-2 text-blue-600" />
//                 Edit Job
//               </h2>
//               <button
//                 onClick={closeEditModal}
//                 className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
//               >
//                 <X className="w-6 h-6 text-gray-600" />
//               </button>
//             </div>

//             {/* Edit Form */}
//             <form onSubmit={handleEditFormSubmit} className="p-6 space-y-6">
//               {/* Basic Information */}
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Job Profile</label>
//                     <input
//                       type="text"
//                       name="jobProfile"
//                       value={editFormData.jobProfile || ''}
//                       onChange={handleEditFormChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
//                     <input
//                       type="text"
//                       name="jobRole"
//                       value={editFormData.jobRole || ''}
//                       onChange={handleEditFormChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//                     <select
//                       name="department"
//                       value={editFormData.department || ''}
//                       onChange={handleEditFormChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Select Department</option>
//                       {departments.map((dept) => (
//                         <option key={dept} value={dept}>{dept}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
//                     <select
//                       name="employmentType"
//                       value={editFormData.employmentType || ''}
//                       onChange={handleEditFormChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Select Employment Type</option>
//                       <option value="Full-time">Full-time</option>
//                       <option value="Internship">Internship</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
//                     <input
//                       type="text"
//                       name="experience"
//                       value={editFormData.experience || ''}
//                       onChange={handleEditFormChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="e.g., 3-5 years"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Work Shift</label>
//                     <select
//                       name="shift"
//                       value={editFormData.shift || ''}
//                       onChange={handleEditFormChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Select Shift</option>
//                       <option value="Day Shift">Day Shift</option>
//                       <option value="Night Shift">Night Shift</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
//                     <input
//                       type="text"
//                       name="expectedSalary"
//                       value={editFormData.expectedSalary || ''}
//                       onChange={handleEditFormChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="e.g., ₹50,000 - ₹80,000"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Number of Vacancies</label>
//                     <input
//                       type="number"
//                       name="vacancy"
//                       value={editFormData.vacancy || ''}
//                       onChange={handleEditFormChange}
//                       min="1"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="e.g., 5"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
//                 <textarea
//                   name="description"
//                   value={editFormData.description || ''}
//                   onChange={handleEditFormChange}
//                   rows={4}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Describe the job role, responsibilities, and requirements..."
//                 />
//               </div>

//               {/* Status */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Job Status</label>
//                 <div className="flex space-x-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="isActive"
//                       value="true"
//                       checked={editFormData.isActive === 'true' || editFormData.isActive === true}
//                       onChange={handleEditFormChange}
//                       className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">Active</span>
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="isActive"
//                       value="false"
//                       checked={editFormData.isActive === 'false' || editFormData.isActive === false}
//                       onChange={handleEditFormChange}
//                       className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                     />
//                     <span className="ml-2 text-sm text-gray-700">Inactive</span>
//                   </label>
//                 </div>
//               </div>

//               {/* Modal Footer */}
//               <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={closeEditModal}
//                   className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center"
//                 >
//                   <Edit className="w-4 h-4 mr-2" />
//                   Update Job
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }