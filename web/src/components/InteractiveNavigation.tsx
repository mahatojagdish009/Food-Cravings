'use client';

import React from 'react';

export default function InteractiveNavigation() {
  // Simple scroll functions
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToChat = () => {
    const chatSection = document.getElementById('ai-chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToRecipes = () => {
    const recipesSection = document.getElementById('featured-recipes-section');
    if (recipesSection) {
      recipesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl">
              <span className="text-white font-bold text-lg">🍽️</span>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              RAG-Food
            </span>
          </button>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <button 
              onClick={scrollToChat}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              💬 AI Chef
            </button>
            <button 
              onClick={scrollToRecipes}
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-orange-50"
            >
              📚 Recipes
            </button>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✨ Online
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}