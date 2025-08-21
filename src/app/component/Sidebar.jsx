'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Briefcase,
  FileText,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    setIsOpen(false); // Close mobile sidebar
    router.push(path);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 z-40 transform transition-all duration-500 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-72`}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center group cursor-pointer">
            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
            onClick={() => router.push('/dashboard')}
            
            
            >
              <ShoppingBag className="w-6 h-6 text-white drop-shadow-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                WebUtsav Job Portal
              </span>
              <div className="text-xs text-gray-500 font-medium">Admin Panel</div>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-6 pb-6 overflow-y-auto custom-scrollbar">
          {/* Main Navigation */}
          <div className="px-2">
            <h3 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Job Management
            </h3>
            <div className="space-y-2">

              {/* Post Job Link */}
              <button
                onClick={() => handleNavigation('/post-job')}
                className={`relative flex items-center px-4 py-3.5 transition-all duration-300 rounded-xl mx-3 group overflow-hidden w-full ${
                  pathname === '/post-job'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-[1.01]'
                }`}
              >
                {pathname === '/post-job' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-sm"></div>
                )}
                <Briefcase className={`relative w-5 h-5 mr-3 transition-all duration-300 ${
                  pathname === '/post-job'
                    ? 'text-white drop-shadow-sm'
                    : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                }`} />
                <span className={`relative font-medium transition-all duration-300 ${
                  pathname === '/post-job' ? 'text-white' : 'group-hover:font-semibold'
                }`}>
                  Post Job
                </span>
                {pathname === '/post-job' && (
                  <div className="relative ml-auto flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  </div>
                )}
                {pathname !== '/post-job' && (
                  <ChevronRight className="relative ml-auto w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </button>

              {/* Jobs Link */}
              <button
                onClick={() => handleNavigation('/jobs')}
                className={`relative flex items-center px-4 py-3.5 transition-all duration-300 rounded-xl mx-3 group overflow-hidden w-full ${
                  pathname === '/jobs'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-[1.01]'
                }`}
              >
                {pathname === '/jobs' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-sm"></div>
                )}
                <Briefcase className={`relative w-5 h-5 mr-3 transition-all duration-300 ${
                  pathname === '/jobs'
                    ? 'text-white drop-shadow-sm'
                    : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                }`} />
                <span className={`relative font-medium transition-all duration-300 ${
                  pathname === '/jobs' ? 'text-white' : 'group-hover:font-semibold'
                }`}>
                  All Jobs
                </span>
                {pathname === '/jobs' && (
                  <div className="relative ml-auto flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  </div>
                )}
                {pathname !== '/jobs' && (
                  <ChevronRight className="relative ml-auto w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </button>

              {/* Applications Link */}
              <button
                onClick={() => handleNavigation('/applications')}
                className={`relative flex items-center px-4 py-3.5 transition-all duration-300 rounded-xl mx-3 group overflow-hidden w-full ${
                  pathname === '/applications'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-[1.01]'
                }`}
              >
                {pathname === '/applications' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-sm"></div>
                )}
                <FileText className={`relative w-5 h-5 mr-3 transition-all duration-300 ${
                  pathname === '/applications'
                    ? 'text-white drop-shadow-sm'
                    : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                }`} />
                <span className={`relative font-medium transition-all duration-300 ${
                  pathname === '/applications' ? 'text-white' : 'group-hover:font-semibold'
                }`}>
                  Applications
                </span>
                {pathname === '/applications' && (
                  <div className="relative ml-auto flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  </div>
                )}
                {pathname !== '/applications' && (
                  <ChevronRight className="relative ml-auto w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </button>


              {/* <button
                onClick={() => handleNavigation('/visitors')}
                className={`relative flex items-center px-4 py-3.5 transition-all duration-300 rounded-xl mx-3 group overflow-hidden w-full ${
                  pathname === '/visitors'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-[1.01]'
                }`}
              >
                {pathname === '/visitors' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-xl blur-sm"></div>
                )}
                <Users className={`relative w-5 h-5 mr-3 transition-all duration-300 ${
                  pathname === '/visitors'
                    ? 'text-white drop-shadow-sm'
                    : 'text-gray-500 group-hover:text-blue-600 group-hover:scale-110'
                }`} />
                <span className={`relative font-medium transition-all duration-300 ${
                  pathname === '/visitors' ? 'text-white' : 'group-hover:font-semibold'
                }`}>
                  All Visitors
                </span>
                {pathname === '/visitors' && (
                  <div className="relative ml-auto flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  </div>
                )}
                {pathname !== '/visitors' && (
                  <ChevronRight className="relative ml-auto w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </button> */}             

            </div>
          </div>

        </nav>
        {/* Logout Button */}
        <div className="px-6 pb-6">
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 mt-4"
          >
            <X className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Footer */}
        {/* <div className="p-4 border-t border-gray-200/50">
          <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 border border-blue-100/50 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-indigo-200/30 to-blue-200/30 rounded-full blur-lg"></div>

            <div className="relative">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="ml-3 text-sm font-bold text-gray-800">Premium</span>
              </div>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Unlock advanced features and exclusive benefits with our premium plan
              </p>
              <button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-semibold py-3 px-4 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg shadow-blue-500/25 active:scale-[0.98]">
                <span className="flex items-center justify-center">
                  Upgrade Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Sidebar;