'use client';

import { useEffect, useState } from 'react';
import { Users, Smartphone, Bell, Zap } from 'lucide-react';
import { SOSAlert, listenToActiveSOSAlerts, get24HourAlerts } from '@/services/sos.service';
import SOSAlertModal from '@/components/sos/sos-alert-modal';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: '1,234',
    activeDevices: '987',
    alerts24h: '0',
    sosActivations: '0'
  });

  const [activeAlerts, setActiveAlerts] = useState<SOSAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<SOSAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Listen to active SOS alerts
    const unsubscribe = listenToActiveSOSAlerts((alerts) => {
      setActiveAlerts(alerts);
      setStats(prev => ({
        ...prev,
        sosActivations: alerts.length.toString()
      }));
    });

    // Get 24-hour alert count
    const fetch24HourAlerts = async () => {
      const alerts = await get24HourAlerts();
      setStats(prev => ({
        ...prev,
        alerts24h: alerts.length.toString()
      }));
    };

    fetch24HourAlerts();

    return () => unsubscribe();
  }, []);

  const handleAlertClick = (alert: SOSAlert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const statsConfig = [
    { name: 'Total Users', value: stats.totalUsers, icon: Users },
    { name: 'Active Devices', value: stats.activeDevices, icon: Smartphone },
    { name: 'Alerts (24h)', value: stats.alerts24h, icon: Bell },
    { name: 'Active SOS', value: stats.sosActivations, icon: Zap },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsConfig.map((stat) => {
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

      {/* Active SOS Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-700 mb-4">Active SOS Alerts</h2>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white p-4 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAlertClick(alert)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">User ID: {alert.userId}</p>
                      <p className="text-sm text-gray-500">
                        Location: {alert.location.latitude}, {alert.location.longitude}
                      </p>
                      {alert.deviceInfo && (
                        <p className="text-sm text-gray-500">
                          Device: {alert.deviceInfo.model} (Battery: {alert.deviceInfo.batteryLevel}%)
                        </p>
                      )}
                    </div>
                    <button
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAlertClick(alert);
                      }}
                    >
                      Respond
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
              View All Alerts
            </button>
          </div>
        </div>
      </div>

      {/* SOS Alert Modal */}
      {selectedAlert && (
        <SOSAlertModal
          alert={selectedAlert}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAlert(null);
          }}
          adminId="admin-1" // Replace with actual admin ID from auth
        />
      )}
    </div>
  );
} 