'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Clock, Star, ChefHat, Sparkles, Search } from 'lucide-react';
import type { ChatMessage, RAGResponse, SearchResult } from '@/types';
import { generateMessageId, getCurrentTimestamp } from '@/lib/hydration-utils';
import { Timestamp } from '@/components/Timestamp';

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className = '' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions] = useState([
    "What is pasta?",
    "Tell me about Italian cuisine",
    "How do I cook rice?",
    "What are the ingredients in pizza?",
    "Different types of bread"
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

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

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          topK: 3,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RAGResponse = await response.json();

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
      
      // Add error message with hydration-safe ID
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'assistant',
        content: '❌ Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: getCurrentTimestamp(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const formatSources = (sources: SearchResult[]) => {
    return sources.map((source, index) => (
      <div key={source.id} className="text-xs text-gray-600 mt-2 p-2 bg-gray-50 rounded-lg">
        <strong>Source {index + 1}:</strong> {source.metadata.text.substring(0, 100)}...
        {source.metadata.name && (
          <div className="text-gray-500">Name: {source.metadata.name}</div>
        )}
        {source.metadata.cuisine && (
          <div className="text-gray-500">Cuisine: {source.metadata.cuisine}</div>
        )}
      </div>
    ));
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-2 rounded-xl">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RAG-Food AI</h1>
            <p className="text-sm text-gray-600">Ask me anything about food!</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RAG-Food!</h2>
              <p className="text-gray-600 max-w-md">
                I'm your AI food assistant powered by semantic search and intelligent responses. 
                Ask me about recipes, ingredients, cuisines, or cooking techniques!
              </p>
            </div>
            
            {/* Suggestions */}
            <div className="w-full max-w-2xl">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Try asking:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-left p-3 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors text-sm text-gray-700 hover:text-primary-700"
                  >
                    {suggestion}
                  </button>
                ))}
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
                  className={`chat-bubble ${
                    message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'
                  }`}
                >
                  {message.content}
                </div>
                
                {/* Sources for assistant messages */}
                {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                  <div className="mt-2">
                    {formatSources(message.sources)}
                  </div>
                )}
                
                {/* Timestamp */}
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <Timestamp timestamp={message.timestamp} />
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="mr-12">
              <div className="chat-bubble chat-bubble-assistant">
                <div className="loading-dots">
                  <div style={{ '--i': 0 } as React.CSSProperties}></div>
                  <div style={{ '--i': 1 } as React.CSSProperties}></div>
                  <div style={{ '--i': 2 } as React.CSSProperties}></div>
                </div>
                <span className="ml-2 text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about food, recipes, or cooking..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isLoading}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}