'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/';

  // If it's the login page, render without sidebar and layout wrapper
  if (isLoginPage) {
    return children;
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