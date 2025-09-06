'use client';

import React, { useState, useEffect } from 'react';

export default function InteractiveNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to different sections
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToChat = () => {
    const chatSection = document.getElementById('ai-chat-section');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToRecipes = () => {
    const recipesSection = document.getElementById('featured-recipes-section');
    recipesSection?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const scrollToAnalytics = () => {
    const statsSection = document.querySelector('[class*="stats"], [class*="analytics"]');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to bottom for stats
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleQuickSearch = () => {
    const chatSection = document.getElementById('ai-chat-section');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      const chatInput = document.querySelector('textarea') as HTMLTextAreaElement;
      if (chatInput) {
        chatInput.focus();
        chatInput.placeholder = '🔍 What would you like to cook today?';
      }
    }, 500);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg border-b border-orange-200 shadow-lg' 
        : 'bg-white/80 backdrop-blur-md border-b border-orange-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <button 
              onClick={scrollToTop}
              className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-xl hover:shadow-lg transition-all group-hover:rotate-12">
                <span className="text-white font-bold text-lg cursor-pointer">🍽️</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent hover:from-orange-700 hover:to-red-700 transition-all">
                RAG-Food
              </span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-6">
              <button 
                onClick={scrollToChat}
                className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105 transform cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-50 flex items-center gap-2"
              >
                💬 <span>AI Chef</span>
              </button>
              <button 
                onClick={scrollToRecipes}
                className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105 transform cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-50 flex items-center gap-2"
              >
                � <span>Recipes</span>
              </button>
              <button 
                onClick={handleQuickSearch}
                className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105 transform cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-50 flex items-center gap-2"
              >
                🔍 <span>Search</span>
              </button>
              <button 
                onClick={scrollToAnalytics}
                className="text-gray-700 hover:text-orange-600 font-medium transition-all hover:scale-105 transform cursor-pointer px-3 py-2 rounded-lg hover:bg-orange-50 flex items-center gap-2"
              >
                📊 <span>Stats</span>
              </button>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button 
                onClick={handleQuickSearch}
                className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-200 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                title="Quick search for recipes"
              >
                🔍 <span className="hidden sm:inline">Search</span>
              </button>
              <button 
                onClick={() => {
                  const chatSection = document.getElementById('ai-chat-section');
                  chatSection?.scrollIntoView({ behavior: 'smooth' });
                  setTimeout(() => {
                    const chatInput = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (chatInput) {
                      chatInput.value = "Surprise me with a random recipe!";
                      chatInput.focus();
                      const event = new Event('input', { bubbles: true });
                      chatInput.dispatchEvent(event);
                    }
                  }, 500);
                }}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                title="Get a random recipe suggestion"
              >
                🎲 <span className="hidden sm:inline">Surprise</span>
              </button>
            </div>
            
            {/* Status Indicator */}
            <button 
              onClick={() => alert('🎉 RAG Food is online and ready to help! Try asking about any cuisine or recipe.')}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 hover:scale-105 transition-all cursor-pointer pulse-green"
            >
              ✨ <span className="hidden sm:inline">Online</span>
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg hover:bg-orange-50 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}></span>
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-orange-100">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={scrollToChat}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors cursor-pointer px-4 py-3 rounded-lg hover:bg-orange-50 flex items-center gap-3 text-left"
              >
                💬 <span>Ask AI Chef</span>
              </button>
              <button 
                onClick={scrollToRecipes}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors cursor-pointer px-4 py-3 rounded-lg hover:bg-orange-50 flex items-center gap-3 text-left"
              >
                📚 <span>Browse Recipes</span>
              </button>
              <button 
                onClick={handleQuickSearch}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors cursor-pointer px-4 py-3 rounded-lg hover:bg-orange-50 flex items-center gap-3 text-left"
              >
                🔍 <span>Quick Search</span>
              </button>
              <button 
                onClick={scrollToAnalytics}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors cursor-pointer px-4 py-3 rounded-lg hover:bg-orange-50 flex items-center gap-3 text-left"
              >
                📊 <span>View Stats</span>
              </button>
              <div className="flex gap-2 px-4 pt-2">
                <button 
                  onClick={() => {
                    const chatSection = document.getElementById('ai-chat-section');
                    chatSection?.scrollIntoView({ behavior: 'smooth' });
                    setTimeout(() => {
                      const chatInput = document.querySelector('textarea') as HTMLTextAreaElement;
                      if (chatInput) {
                        chatInput.value = "Surprise me with a random recipe!";
                        chatInput.focus();
                        const event = new Event('input', { bubbles: true });
                        chatInput.dispatchEvent(event);
                      }
                    }, 500);
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-all cursor-pointer text-center"
                >
                  🎲 Random Recipe
                </button>
                <button 
                  onClick={() => {
                    alert('🎉 RAG Food is online and ready to help!');
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-200 transition-all cursor-pointer text-center"
                >
                  ✨ Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .pulse-green {
          animation: pulse-green 2s infinite;
        }
        
        @keyframes pulse-green {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
        }
      `}</style>
    </nav>
  );
}