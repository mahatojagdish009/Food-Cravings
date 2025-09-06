'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Loader2, 
  Search, 
  Sparkles, 
  ChefHat, 
  Menu,
  Star,
  Clock,
  Users,
  Globe,
  Utensils,
  Coffee,
  Pizza,
  Cake,
  Fish,
  Apple,
  Flame
} from 'lucide-react';
import type { ChatMessage, RAGResponse, SearchResult } from '@/types';
import { generateMessageId, getCurrentTimestamp } from '@/lib/hydration-utils';
import { Timestamp } from '@/components/Timestamp';

interface EnhancedChatInterfaceProps {
  className?: string;
  onSendMessage?: (message: string) => Promise<any>;
}

export function EnhancedChatInterface({ className = '', onSendMessage }: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced suggestion categories with beautiful icons
  const foodCategories = [
    { 
      icon: Pizza, 
      name: 'Italian', 
      color: 'bg-red-500', 
      queries: ['Authentic Italian pasta recipes', 'Classic pizza margherita guide', 'Italian cooking techniques and tips']
    },
    { 
      icon: Coffee, 
      name: 'Asian', 
      color: 'bg-orange-500', 
      queries: ['Traditional ramen from scratch', 'Stir-fry techniques and wok cooking', 'Authentic Thai curry recipes']
    },
    { 
      icon: Cake, 
      name: 'Desserts', 
      color: 'bg-pink-500', 
      queries: ['French pastry techniques', 'Chocolate dessert recipes', 'Homemade ice cream guide']
    },
    { 
      icon: Fish, 
      name: 'Seafood', 
      color: 'bg-blue-500', 
      queries: ['Fresh fish cooking methods', 'Seafood pasta dishes', 'Grilled salmon techniques']
    },
    { 
      icon: Apple, 
      name: 'Healthy', 
      color: 'bg-green-500', 
      queries: ['Nutritious meal prep ideas', 'Low-calorie recipe options', 'Vegetarian protein sources']
    },
    { 
      icon: Flame, 
      name: 'Spicy', 
      color: 'bg-red-600', 
      queries: ['Spicy Indian curry recipes', 'Hot sauce making guide', 'Mexican jalapeño dishes']
    }
  ];

  // Quick starter prompts for better UX
  const quickStarters = [
    '🍝 Show me a quick pasta recipe',
    '🍛 I want to learn about curry',
    '🥗 Healthy meal ideas for today',
    '🍕 How to make pizza dough',
    '🍜 Authentic ramen recipe',
    '🧁 Easy dessert for beginners'
  ];

  const quickSearches = [
    'What is pasta?',
    'Tell me about Indian spices',
    'How do I cook rice perfectly?',
    'Different types of bread',
    'Vegetarian protein sources',
    'Mediterranean diet basics'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message with hydration-safe ID
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: input,
      timestamp: getCurrentTimestamp(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowMenu(false);

    try {
      let data: RAGResponse;
      
      if (onSendMessage) {
        // Use custom onSendMessage function if provided
        data = await onSendMessage(messageText);
      } else {
        // Default API call
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            topK: 3,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
      }

      // Add assistant response with hydration-safe ID
      const assistantMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: data.answer,
        timestamp: data.timestamp,
        sources: data.sources,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      let errorMessage = '❌ Sorry, I encountered an error while processing your request. Please try again.';
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = '🌐 Connection error. Please check your internet and try again.';
        } else if (error.message.includes('500')) {
          errorMessage = '⚙️ Server error. Our AI chef is taking a quick break. Please try again in a moment.';
        } else if (error.message.includes('timeout')) {
          errorMessage = '⏱️ Request timed out. Please try a shorter question or try again.';
        }
      }
      
      // Add error message with hydration-safe ID
      const errorChatMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: errorMessage,
        timestamp: getCurrentTimestamp(),
      };

      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickSearch = (query: string) => {
    setInput(query);
    inputRef.current?.focus();
  };

  const handleCategoryQuery = (query: string) => {
    sendMessage(query);
  };

  const formatSources = (sources: SearchResult[]) => {
    return sources.map((source, index) => (
      <div key={source.id} className="text-xs bg-gradient-to-r from-orange-50 to-green-50 border border-orange-200 rounded-lg p-3 mt-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          <strong className="text-orange-800">Source {index + 1}</strong>
        </div>
        <p className="text-gray-700 mb-2">{source.metadata.text.substring(0, 120)}...</p>
        {source.metadata.name && (
          <div className="flex items-center gap-2 text-orange-600">
            <Utensils className="h-3 w-3" />
            <span className="font-medium">{source.metadata.name}</span>
          </div>
        )}
        {source.metadata.cuisine && (
          <div className="flex items-center gap-2 text-green-600 mt-1">
            <Globe className="h-3 w-3" />
            <span>{source.metadata.cuisine}</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 ${className}`}>
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl shadow-lg">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  RAG-Food AI
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  Your intelligent culinary companion
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>~2s responses</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span>75+ food items</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>AI-Powered</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-xl bg-orange-100 hover:bg-orange-200 transition-colors"
              >
                <Menu className="h-5 w-5 text-orange-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Menu Overlay */}
      {showMenu && (
        <div className="absolute top-20 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-orange-200 p-6 w-80">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-orange-500" />
            Explore Cuisines
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {foodCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`${category.color} p-2 rounded-lg`}>
                    <category.icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{category.name}</span>
                </div>
                <div className="space-y-1">
                  {category.queries.slice(0, 1).map((query, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCategoryQuery(query)}
                      className="w-full text-left text-xs text-gray-600 hover:text-orange-600 transition-colors p-1 rounded hover:bg-orange-50"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-8 py-12">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 rounded-3xl shadow-2xl mx-auto w-fit">
                  <Sparkles className="h-16 w-16 text-white mx-auto animate-pulse" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                  Welcome to RAG-Food AI!
                </h2>
                <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">
                  Discover the world of food with AI-powered semantic search and intelligent responses. 
                  From recipes to culinary traditions, I'm your personal food knowledge companion!
                </p>
              </div>
              
              {/* Quick Search Buttons */}
              <div className="w-full max-w-3xl space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
                  <Search className="h-5 w-5 text-orange-500" />
                  Quick Searches
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {quickSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="group p-4 bg-white/60 backdrop-blur-sm hover:bg-white border border-orange-200 hover:border-orange-300 rounded-2xl transition-all duration-300 text-left shadow-sm hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-orange-400 to-red-400 p-2 rounded-lg group-hover:scale-110 transition-transform">
                          <Search className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-gray-700 group-hover:text-orange-700 font-medium">
                          {search}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-sm">
                  <div className="bg-green-500 p-3 rounded-xl w-fit mb-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Lightning Fast</h4>
                  <p className="text-gray-600 text-sm">Get comprehensive food answers in under 2 seconds with our optimized AI pipeline.</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-200 shadow-sm">
                  <div className="bg-blue-500 p-3 rounded-xl w-fit mb-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">Global Cuisine</h4>
                  <p className="text-gray-600 text-sm">Explore food knowledge from around the world with semantic search technology.</p>
                </div>
                
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-200 shadow-sm">
                  <div className="bg-purple-500 p-3 rounded-xl w-fit mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800 mb-2">AI-Powered</h4>
                  <p className="text-gray-600 text-sm">Advanced RAG technology provides accurate, contextual answers with source citations.</p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                  <div
                    className={`rounded-3xl px-6 py-4 shadow-lg ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                        : 'bg-white/80 backdrop-blur-sm text-gray-800 border border-orange-200'
                    }`}
                  >
                    {message.content}
                  </div>
                  
                  {/* Enhanced Sources Display */}
                  {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Sources & References
                      </h4>
                      {formatSources(message.sources)}
                    </div>
                  )}
                  
                  {/* Timestamp with hydration-safe rendering */}
                  <div
                    className={`text-xs text-gray-500 mt-2 flex items-center gap-1 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    <Timestamp timestamp={message.timestamp} />
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Enhanced Loading State */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="mr-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-6 py-4 border border-orange-200 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-orange-400 to-red-400 p-2 rounded-full">
                      <ChefHat className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <div className="loading-dots">
                      <div style={{ '--i': 0 } as React.CSSProperties}></div>
                      <div style={{ '--i': 1 } as React.CSSProperties}></div>
                      <div style={{ '--i': 2 } as React.CSSProperties}></div>
                    </div>
                    <span className="ml-2 text-gray-600 font-medium">Cooking up an answer...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="bg-white/80 backdrop-blur-lg border-t border-orange-200">
        <div className="max-w-4xl mx-auto p-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about food, recipes, or cooking... 🍽️"
                className="w-full px-6 py-4 pr-14 bg-white/80 backdrop-blur-sm border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-lg placeholder-gray-500"
                disabled={isLoading}
              />
              <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}