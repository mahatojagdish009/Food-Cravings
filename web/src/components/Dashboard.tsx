'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Clock, 
  Star, 
  TrendingUp, 
  Globe,
  Zap,
  Award,
  Target,
  Activity
} from 'lucide-react';

interface StatsCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  change: string;
  color: string;
  bgColor: string;
}

function StatsCard({ icon: Icon, title, value, change, color, bgColor }: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-2xl p-6 border-2 border-opacity-20 hover:shadow-lg transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
          <p className={`text-sm mt-2 flex items-center gap-1 ${color.includes('green') ? 'text-green-600' : 'text-orange-600'}`}>
            <TrendingUp className="h-4 w-4" />
            {change}
          </p>
        </div>
        <div className={`${color} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [timeframe, setTimeframe] = useState('24h');

  const stats = [
    {
      icon: Zap,
      title: 'Avg Response Time',
      value: '1.2s',
      change: '+15% faster',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Users,
      title: 'Active Users',
      value: '2,847',
      change: '+23% this week',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Activity,
      title: 'Queries Today',
      value: '8,392',
      change: '+31% vs yesterday',
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Star,
      title: 'Satisfaction Rate',
      value: '97.3%',
      change: '+2.1% improvement',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const popularQueries = [
    { query: 'Italian pasta recipes', count: 1247, trend: '+15%' },
    { query: 'How to cook rice perfectly', count: 892, trend: '+8%' },
    { query: 'Healthy breakfast ideas', count: 756, trend: '+23%' },
    { query: 'Baking bread tips', count: 634, trend: '+12%' },
    { query: 'Asian street food', count: 521, trend: '+19%' }
  ];

  const recentActivities = [
    { time: '2 min ago', action: 'User searched "Thai curry ingredients"', type: 'search' },
    { time: '5 min ago', action: 'Query processed in 0.8s', type: 'performance' },
    { time: '8 min ago', action: 'New user from Japan joined', type: 'user' },
    { time: '12 min ago', action: 'High satisfaction rating received', type: 'feedback' },
    { time: '15 min ago', action: 'System health check passed', type: 'system' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                RAG-Food Analytics
              </h1>
              <p className="text-gray-600 text-lg">
                Real-time insights into your AI-powered food discovery platform
              </p>
            </div>
            
            <div className="flex gap-2">
              {['24h', '7d', '30d'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    timeframe === period
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white/60 text-gray-700 hover:bg-white'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Queries */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-orange-500" />
                Popular Food Queries
              </h2>
              <span className="text-sm text-gray-500">Last {timeframe}</span>
            </div>
            
            <div className="space-y-4">
              {popularQueries.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-orange-50 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.query}</p>
                      <p className="text-sm text-gray-600">{item.count} searches</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                      {item.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              Recent Activity
            </h2>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 hover:bg-white/50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'search' ? 'bg-blue-500' :
                    activity.type === 'performance' ? 'bg-green-500' :
                    activity.type === 'user' ? 'bg-purple-500' :
                    activity.type === 'feedback' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-500" />
            System Performance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-xl">
              <div className="bg-green-500 p-3 rounded-full w-fit mx-auto mb-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">API Response</h3>
              <p className="text-2xl font-bold text-green-600">99.8%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl">
              <div className="bg-blue-500 p-3 rounded-full w-fit mx-auto mb-3">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Global Reach</h3>
              <p className="text-2xl font-bold text-blue-600">47</p>
              <p className="text-sm text-gray-600">Countries</p>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-purple-100 rounded-xl">
              <div className="bg-purple-500 p-3 rounded-full w-fit mx-auto mb-3">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Quality Score</h3>
              <p className="text-2xl font-bold text-purple-600">A+</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}