'use client';

import React from 'react';

export default function InteractiveNavigation() {
  // Scroll to different sections
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToChat = () => {
    const chatSection = document.getElementById('ai-chat-section');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAnalytics = () => {
    const statsSection = document.querySelector('[class*="stats"], [class*="analytics"]');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to bottom for stats
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-8">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl hover:shadow-lg transition-all">
                <span className="text-white font-bold text-lg cursor-pointer">🍽️</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent hover:from-orange-700 hover:to-red-700 transition-all">
                RAG-Food
              </span>
            </button>
            
            <div className="hidden md:flex gap-6">
              <button 
                onClick={scrollToChat}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors hover:scale-105 transform cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                💬 Chat
              </button>
              <button 
                onClick={scrollToAnalytics}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors hover:scale-105 transform cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-50"
              >
                📊 Analytics
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => alert('🎉 RAG Food is online and ready to help!')}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 hover:scale-105 transition-all cursor-pointer"
            >
              ✨ Online
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}