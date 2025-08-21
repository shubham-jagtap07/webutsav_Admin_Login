'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isLoginPage = pathname === '/';

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (isLoginPage) {
        setIsLoading(false);
        return;
      }

      // Check if user is authenticated (you can modify this logic based on your auth system)
      const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
      
      if (!isLoggedIn) {
        router.push('/');
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router, isLoginPage]);

  // Show loading spinner while checking authentication
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If it's the login page, render without sidebar and layout wrapper
  if (isLoginPage) {
    return children;
  }

  // If not authenticated and not on login page, don't render anything (redirect will happen)
  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <main className="lg:ml-72 min-h-screen transition-all duration-300 ease-in-out">
        {/* Header/Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm lg:hidden">
          <div className="px-4 py-3">
            <h1 className="text-lg font-semibold text-gray-800">WebUtsav Admin</h1>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-4 pt-20 lg:p-8 lg:pt-8">
          <div className="max-w-7xl mx-auto">
            {/* Content Container with subtle background */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 min-h-[calc(100vh-8rem)] p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;