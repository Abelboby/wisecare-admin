'use client';

import { useState } from 'react';
import { Users, Smartphone, Bell, Zap } from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '1,234', icon: Users },
  { name: 'Active Devices', value: '987', icon: Smartphone },
  { name: 'Alerts (24h)', value: '15', icon: Bell },
  { name: 'SOS Activations', value: '3', icon: Zap },
];

const recentActivity = [
  {
    title: 'New User Registration',
    time: '2 minutes ago',
    description: 'John Doe (Family Member) registered a new account.',
  },
  {
    title: 'Device Activated',
    time: '15 minutes ago',
    description: 'Fall detector activated for user Jane Smith.',
  },
  {
    title: 'Alert Triggered',
    time: '1 hour ago',
    description: 'Abnormal heart rate detected for user Robert Johnson.',
  },
];

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="bg-stats-icon p-3 rounded-full">
                  <Icon className="w-6 h-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  </div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Add New User
              </button>
              <button className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Register New Device
              </button>
              <button className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                View Pending Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 