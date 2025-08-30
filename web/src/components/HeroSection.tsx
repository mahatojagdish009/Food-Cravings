'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  ClockIcon, 
  UserGroupIcon, 
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

export default function HeroSection() {
  const stats = [
    { icon: SparklesIcon, value: '230+', label: 'Global Recipes' },
    { icon: GlobeAltIcon, value: '22+', label: 'Countries' },
    { icon: ClockIcon, value: '< 3s', label: 'AI Response Time' },
    { icon: UserGroupIcon, value: '1000+', label: 'Happy Cooks' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-75"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-150"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Discover
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent"> Global </span>
              Cuisines
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered culinary explorer with detailed recipes, cooking tips, and cultural insights from around the world. 
              <span className="font-semibold text-orange-600"> Cook like a pro, anywhere.</span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🍜 Explore Recipes
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300"
            >
              🤖 Try AI Chef
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
              >
                <div className="flex flex-col items-center">
                  <stat.icon className="h-8 w-8 text-orange-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating Food Emojis */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce delay-100">🍝</div>
        <div className="absolute top-40 right-20 text-3xl animate-bounce delay-300">🍛</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-bounce delay-500">🥘</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-bounce delay-700">🍜</div>
        <div className="absolute top-1/2 left-5 text-2xl animate-bounce delay-200">🥟</div>
        <div className="absolute top-1/3 right-5 text-2xl animate-bounce delay-600">🍲</div>
      </div>
    </section>
  );
}