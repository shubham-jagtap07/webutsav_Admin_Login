"use client";

import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  ArrowUpRight,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  // Job posting platform stats
  const stats = [
    { label: "Total Jobs", value: "1,250", change: "+12.4%", icon: Package, color: "text-blue-600" },
    { label: "Active Jobs", value: "320", change: "+5.2%", icon: TrendingUp, color: "text-green-600" },
    { label: "Applications", value: "4,560", change: "+18.7%", icon: Users, color: "text-purple-600" },
    { label: "Companies", value: "85", change: "+2.1%", icon: DollarSign, color: "text-orange-600" },
  ];

  // Recent job postings
  const recentJobs = [
    { id: "#J1021", title: "Frontend Developer", company: "TechNova", location: "Remote", status: "Open" },
    { id: "#J1020", title: "UI/UX Designer", company: "Designify", location: "Bangalore", status: "Closed" },
    { id: "#J1019", title: "Backend Engineer", company: "CloudBase", location: "Hyderabad", status: "Open" },
  ];

  return (
    <div className="space-y-8">
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
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            View Job Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-semibold ${stat.color} flex items-center`}>
                  {stat.change}
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Job Postings */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center">
              View All
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors duration-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                    {job.id.slice(-2)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-gray-600 text-sm">{job.company} &bull; {job.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    job.status === 'Open' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
              onClick={() => router.push('/post-job')}
            >
              <Package className="w-5 h-5 mr-2" />
              Post a Job
            </button>
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center" 
              onClick={() => router.push('/jobs')}
            >
              <Users className="w-5 h-5 mr-2" />
              All Jobs 
            </button>
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
            onClick={() => router.push('/applications')}>
              <Activity className="w-5 h-5 mr-2" />
              Applications

            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
