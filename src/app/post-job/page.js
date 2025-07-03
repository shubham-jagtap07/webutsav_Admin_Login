'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Plus,
  X,
  Save,
  Eye,
  Building,
  IndianRupee
} from 'lucide-react';

export default function PostJob() {
  const [formData, setFormData] = useState({
    jobProfile: '',
    jobRole: '',
    description: '',
    experience: '',
    shift: '',
    department: '',
    employmentType: '',
    isActive: 'true',
    expectedSalary: '',
    postedDate: '',
    vacancy: '',
    keywords: [],
    rolesAndResponsibility: []
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newRole, setNewRole] = useState('');
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Department options
  const departments = [
    'Research & Development',
    'Sales',
    'Digital Marketing',
    'Back Office'
  ];

  // Employment type options
  const employmentTypes = [
    'Full-time',
   
    'Internship',
    
  ];

  // Shift options
  const shifts = [
    'Day Shift',
    'Night Shift',
    
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const addRole = () => {
    if (newRole.trim() && !formData.rolesAndResponsibility.includes(newRole.trim())) {
      setFormData(prev => ({
        ...prev,
        rolesAndResponsibility: [...prev.rolesAndResponsibility, newRole.trim()]
      }));
      setNewRole('');
    }
  };

  const removeRole = (roleToRemove) => {
    setFormData(prev => ({
      ...prev,
      rolesAndResponsibility: prev.rolesAndResponsibility.filter(role => role !== roleToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data for API (remove empty postedDate as backend will set it)
      const jobData = {
        ...formData,
        keyword: formData.keywords, // Rename keywords to keyword to match backend
        postedDate: undefined // Let backend set the date
      };

      // Remove undefined fields
      Object.keys(jobData).forEach(key => {
        if (jobData[key] === undefined) {
          delete jobData[key];
        }
      });

      console.log('Submitting job data:', jobData);

      // Call your backend API
      const response = await fetch('https://api.webutsav.com/job/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        const result = await response.json();

        // Show success message
        setShowSuccessMessage(true);
        console.log('Job created:', result);

        // Reset form
        setFormData({
          jobProfile: '',
          jobRole: '',
          description: '',
          experience: '',
          shift: '',
          department: '',
          employmentType: '',
          isActive: 'true',
          expectedSalary: '',
          vacancy:'',
          postedDate: '',
          keywords: [],
          rolesAndResponsibility: []
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);

      } else {
        throw new Error('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Error posting job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Briefcase className="w-8 h-8 mr-3 text-blue-600" />
            Post New Job
          </h1>
          <p className="text-gray-600">
            Create a new job posting to attract the best candidates for your organization.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            onClick={handlePreview}
            className="bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </button>
          <button
            type="submit"
            form="job-form"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            <Save className="w-5 h-5 mr-2" />
            {isSubmitting ? 'Posting Job...' : 'Post Job'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-green-800">Job Posted Successfully! 🎉</h3>
              <p className="text-green-700 mt-1">
                Your job posting has been created and is now live. Candidates can start applying immediately.
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-600 hover:text-green-800 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 p-8">
        <form id="job-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Building className="w-6 h-6 mr-2 text-blue-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Profile */}
              <div>
                <label htmlFor="jobProfile" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Profile
                </label>
                <input
                  type="text"
                  id="jobProfile"
                  name="jobProfile"
                  value={formData.jobProfile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              {/* Job Role */}
              <div>
                <label htmlFor="jobRole" className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Role
                </label>
                <input
                  type="text"
                  id="jobRole"
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Full Stack Developer"
                />
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employment Type */}
              <div>
                <label htmlFor="employmentType" className="block text-sm font-semibold text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Employment Type</option>
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vacancy */}
              <div>
                <label htmlFor="vacancy" className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Vacancies
                </label>
                <input
                  type="number"
                  id="vacancy"
                  name="vacancy"
                  value={formData.vacancy}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 5"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-600" />
              Job Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience Required
                </label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 3-5 years"
                />
              </div>

              {/* Shift */}
              <div>
                <label htmlFor="shift" className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Shift
                </label>
                <select
                  id="shift"
                  name="shift"
                  value={formData.shift}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Shift</option>
                  {shifts.map((shift) => (
                    <option key={shift} value={shift}>
                      {shift}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expected Salary */}
              <div>
                <label htmlFor="expectedSalary" className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Salary
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="expectedSalary"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., ₹80,000 - ₹100,000"
                  />
                </div>
              </div>

              {/* Posted Date - Auto-generated by backend */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Posted Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value="Auto-generated on submission"
                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Date will be automatically set when the job is posted</p>
              </div>

              {/* Is Active */}
             
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Job Description
            </h2>
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Provide a detailed description of the job role, responsibilities, requirements, and qualifications..."
              />
            </div>
          </div>

          {/* Roles and Responsibilities */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              Roles & Responsibilities
            </h2>
            <div>
              <label htmlFor="rolesAndResponsibility" className="block text-sm font-semibold text-gray-700 mb-2">
                Add Roles & Responsibilities
              </label>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Develop and maintain web applications"
                />
                <button
                  type="button"
                  onClick={addRole}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Roles Display */}
              <div className="space-y-2">
                {formData.rolesAndResponsibility.map((role, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
                  >
                    <span className="text-gray-700 flex-1">{role}</span>
                    <button
                      type="button"
                      onClick={() => removeRole(role)}
                      className="ml-3 text-red-600 hover:text-red-800 flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {formData.rolesAndResponsibility.length === 0 && (
                <p className="text-gray-500 text-sm">No roles and responsibilities added yet. Add key responsibilities for this position.</p>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Keywords & Skills
            </h2>
            <div>
              <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
                Add Keywords
              </label>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., React, JavaScript, Node.js"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 flex items-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Keywords Display */}
              <div className="flex flex-wrap gap-2">
                {formData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              {formData.keywords.length === 0 && (
                <p className="text-gray-500 text-sm">No keywords added yet. Add relevant skills and technologies.</p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-blue-600" />
                Job Preview
              </h2>
              <button
                onClick={closePreview}
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
                  {formData.jobProfile || 'Job Profile'}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {formData.jobRole || 'Job Role'}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                  {formData.department && (
                    <span className="flex items-center">
                      <Building className="w-4 h-4 mr-1" />
                      {formData.department}
                    </span>
                  )}
                  {formData.experience && (
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formData.experience}
                    </span>
                  )}
                  {formData.expectedSalary && (
                    <span className="flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      {formData.expectedSalary}
                    </span>
                  )}
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Employment Type</h3>
                  <p className="text-gray-600">{formData.employmentType || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Work Shift</h3>
                  <p className="text-gray-600">{formData.shift || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Number of Vacancies</h3>
                  <p className="text-gray-600">{formData.vacancy || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.isActive === 'true'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {formData.isActive === 'true' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {formData.description && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Job Description</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                  </div>
                </div>
              )}

              {/* Keywords */}
              {formData.keywords.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Required Skills & Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
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
                onClick={closePreview}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  closePreview();
                  handleSubmit({ preventDefault: () => {} });
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Post Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
