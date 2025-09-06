'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    upstash: string;
    groq: string;
  };
}

export default function HealthMonitor() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const data = await response.json();
          setHealth(data);
          setError(null);
        } else {
          setError('Health check failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <ClockIcon className="h-5 w-5 animate-spin" />
        <span>Checking system health...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <XCircleIcon className="h-5 w-5" />
        <span>Health check failed: {error}</span>
      </div>
    );
  }

  const isHealthy = health?.status === 'healthy';
  const uptimeHours = health ? Math.floor(health.uptime / 3600) : 0;
  const uptimeMinutes = health ? Math.floor((health.uptime % 3600) / 60) : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        <div className={`flex items-center gap-2 ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
          {isHealthy ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <XCircleIcon className="h-5 w-5" />
          )}
          <span className="font-medium capitalize">{health?.status}</span>
        </div>
      </div>

      {health && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Environment:</span>
              <span className="ml-2 font-medium">{health.environment}</span>
            </div>
            <div>
              <span className="text-gray-500">Version:</span>
              <span className="ml-2 font-medium">{health.version}</span>
            </div>
            <div>
              <span className="text-gray-500">Uptime:</span>
              <span className="ml-2 font-medium">
                {uptimeHours}h {uptimeMinutes}m
              </span>
            </div>
            <div>
              <span className="text-gray-500">Last Check:</span>
              <span className="ml-2 font-medium">
                {new Date(health.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="border-t pt-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Services</h4>
            <div className="space-y-1">
              {Object.entries(health.services).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 capitalize">{service}:</span>
                  <span className={`font-medium ${
                    status === 'configured' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}