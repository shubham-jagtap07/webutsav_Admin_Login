"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  ArrowUpRight,
  Activity,
  Briefcase,
  Clock,
  MapPin
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch active jobs from API
  const fetchActiveJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('https://api.webutsav.com/job/getAllJob');
      if (response.ok) {
        const data = await response.json();
        // Filter only active jobs and take the latest 5
        const activeJobs = data
          .filter(job => job.isActive === 'true' || job.isActive === true)
          .slice(0, 5)
          .map(job => ({
            id: job.jobId || job.id,
            title: job.jobProfile || 'Job Title',
            company: job.jobRole || 'Company',
            location: job.department || 'Location',
            status: 'Open',
            experience: job.experience || 'Not specified',
            shift: job.shift || 'Not specified',
            salary: job.expectedSalary || 'Not specified',
            postedDate: job.postedDate || new Date().toISOString()
          }));
        setRecentJobs(activeJobs);
      } else {
        setError('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Error loading jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on component mount
  useEffect(() => {
    fetchActiveJobs();
  }, []);

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your job portal today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {/* <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            View Job Analytics
          </button> */}
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Job Postings */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Active Jobs</h2>
            <button 
              onClick={() => router.push('/jobs')}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center transition-colors duration-200"
            >
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 text-sm">Loading active jobs...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-3">{error}</p>
              <button
                onClick={fetchActiveJobs}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Jobs List */}
          {!loading && !error && (
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job, index) => (
                  <div 
                    key={job.id || index} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md cursor-pointer"
                    onClick={() => router.push('/jobs')}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {job.id ? job.id.toString().slice(-2) : (index + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-gray-900">{job.title}</p>
                        <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          {job.experience && job.experience !== 'Not specified' && (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {job.experience}
                            </span>
                          )}
                          {job.shift && job.shift !== 'Not specified' && (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.shift}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {job.status}
                      </span>
                      {job.postedDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(job.postedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No active jobs</h3>
                  <p className="text-gray-600 mb-4">
                    No active job postings available at the moment.
                  </p>
                  <button
                    onClick={() => router.push('/post-job')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200"
                  >
                    Post Your First Job
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              onClick={() => router.push('/post-job')}
            >
              <Package className="w-5 h-5 mr-2" />
              Post a Job
            </button>
            <button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center" 
              onClick={() => router.push('/jobs')}
            >
              <Users className="w-5 h-5 mr-2" />
              All Jobs 
            </button>
            <button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              onClick={() => router.push('/applications')}
            >
              <Activity className="w-5 h-5 mr-2" />
              Applications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}