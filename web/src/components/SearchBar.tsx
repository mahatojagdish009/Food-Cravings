'use client';

import { useState } from 'react';
import { Search, TrendingUp, Clock, Star } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({ onSearch, isLoading = false, placeholder = "Search for food, recipes, ingredients..." }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
      setQuery('');
    }
  };

  const trendingSearches = [
    { query: 'Italian pasta recipes', trend: '+15%' },
    { query: 'Healthy breakfast ideas', trend: '+23%' },
    { query: 'Asian street food', trend: '+8%' },
    { query: 'Vegan protein sources', trend: '+31%' }
  ];

  const recentSearches = [
    'How to make sourdough bread',
    'Mediterranean diet benefits',
    'Spicy Thai curry recipes',
    'French pastry techniques'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-2 border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all outline-none text-lg"
            disabled={isLoading}
          />
        </div>
        
        {/* Search Suggestions Dropdown */}
        {query.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-4 space-y-2">
              <div className="text-sm font-medium text-gray-500">Suggestions</div>
              {['Italian', 'Asian', 'Healthy', 'Desserts'].filter(cat => 
                cat.toLowerCase().includes(query.toLowerCase())
              ).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(suggestion + ' food recipes');
                    onSearch(suggestion + ' food recipes');
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors text-gray-700"
                >
                  {suggestion} food recipes
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Trending & Recent Searches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trending Searches */}
        <div className="bg-white/60 rounded-xl p-4 border border-orange-200">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            Trending Now
          </h3>
          <div className="space-y-2">
            {trendingSearches.map((item, index) => (
              <button
                key={index}
                onClick={() => onSearch(item.query)}
                className="w-full flex items-center justify-between p-2 hover:bg-orange-50 rounded-lg transition-colors group"
              >
                <span className="text-gray-700 text-sm group-hover:text-orange-700">{item.query}</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">{item.trend}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        <div className="bg-white/60 rounded-xl p-4 border border-green-200">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
            <Clock className="h-4 w-4 text-green-500" />
            Popular Searches
          </h3>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => onSearch(search)}
                className="w-full text-left p-2 hover:bg-green-50 rounded-lg transition-colors text-gray-700 text-sm hover:text-green-700"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}