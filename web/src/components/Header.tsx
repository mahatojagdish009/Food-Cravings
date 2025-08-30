'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CakeIcon, 
  MagnifyingGlassIcon, 
  HeartIcon, 
  BookmarkIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation actions
  const handleRecipesClick = () => {
    const recipesSection = document.getElementById('featured-recipes-section');
    recipesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    const chatSection = document.getElementById('ai-chat-section');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
    // Focus on chat input after scroll
    setTimeout(() => {
      const chatInput = document.querySelector('textarea, input[type="text"]');
      if (chatInput) {
        (chatInput as HTMLElement).focus();
      }
    }, 500);
  };

  const handleFavoritesClick = () => {
    alert('💖 Favorites feature coming soon! Save your favorite recipes.');
  };

  const handleSavedClick = () => {
    alert('🔖 Saved recipes feature coming soon! Bookmark recipes for later.');
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserProfileClick = () => {
    alert('👤 User profile coming soon! Manage your account and preferences.');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Scroll to chat and pre-fill the query
      const chatSection = document.getElementById('ai-chat-section');
      chatSection?.scrollIntoView({ behavior: 'smooth' });
      
      // Try to fill the chat input with the search query
      setTimeout(() => {
        const chatInput = document.querySelector('textarea, input[type="text"]') as HTMLInputElement;
        if (chatInput) {
          chatInput.value = searchQuery;
          chatInput.focus();
          // Trigger input event to update React state
          const event = new Event('input', { bubbles: true });
          chatInput.dispatchEvent(event);
        }
      }, 500);
      
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: 'Recipes', icon: CakeIcon, onClick: handleRecipesClick, description: 'View featured recipes' },
    { name: 'Search', icon: MagnifyingGlassIcon, onClick: handleSearchClick, description: 'AI-powered search' },
    { name: 'Favorites', icon: HeartIcon, onClick: handleFavoritesClick, description: 'Your favorite recipes' },
    { name: 'Saved', icon: BookmarkIcon, onClick: handleSavedClick, description: 'Bookmarked recipes' },
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg border-b border-orange-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo - Now Clickable! */}
          <motion.button
            onClick={handleLogoClick} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all"
          >
            <div className="relative">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="transition-transform"
              >
                <CakeIcon className="h-8 w-8 text-orange-600" />
              </motion.div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                RAG Food
              </h1>
              <p className="text-xs text-gray-500 -mt-1">AI-Powered Recipes</p>
            </div>
          </motion.button>

          {/* Desktop Navigation - All Clickable! */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={item.onClick}
                  title={item.description}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                >
                  <motion.div whileHover={{ rotate: 5 }}>
                    <item.icon className="h-5 w-5" />
                  </motion.div>
                  <span className="font-medium">{item.name}</span>
                </button>
              </motion.div>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            
            {/* Search Bar - Now Functional! */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64 hover:bg-gray-200 transition-colors">
              <button type="submit" className="hover:scale-110 transition-transform">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
              </button>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes..."
                className="bg-transparent ml-2 flex-1 outline-none text-gray-700 placeholder-gray-400"
              />
            </form>

            {/* User Profile - Now Clickable! */}
            <motion.button
              onClick={handleUserProfileClick}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl transition-all"
              title="User Profile (Coming Soon!)"
            >
              <UserCircleIcon className="h-6 w-6" />
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.onClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left w-full"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* Mobile Search - Now Functional! */}
              <div className="px-4 py-2">
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors">
                  <button type="submit" className="hover:scale-110 transition-transform">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors" />
                  </button>
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="bg-transparent ml-2 flex-1 outline-none text-gray-700 placeholder-gray-400"
                  />
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}