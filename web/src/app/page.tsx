'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import HeroSection from '@/components/HeroSection';
import RecipeCard from '@/components/RecipeCard';
import { EnhancedChatInterface } from '@/components/EnhancedChatInterface';

// Sample recipes for demonstration
const sampleRecipes = [
  {
    id: "sample_1",
    name: "Chicken Biryani",
    cuisine: "Indian",
    description: "Aromatic rice dish with tender chicken, fragrant spices, and saffron. A royal dish that's perfect for special occasions.",
    cookTime: 75,
    difficulty: "Medium" as const,
    servings: 6,
    ingredients: [
      "2 cups Basmati rice",
      "1 kg chicken, cut into pieces",
      "2 large onions, thinly sliced",
      "1 cup yogurt",
      "2 tbsp ginger-garlic paste",
      "1/2 tsp turmeric powder",
      "1 tsp garam masala",
      "1/2 cup mint leaves",
      "4 tbsp ghee",
      "Salt to taste"
    ],
    instructions: [
      "Soak basmati rice for 30 minutes, then drain.",
      "Marinate chicken with yogurt, ginger-garlic paste, and spices for 30 minutes.",
      "Cook rice until 70% done. Layer over chicken with fried onions and mint.",
      "Cook on low heat for 45 minutes until perfectly done."
    ],
    nutrition: {
      calories: 485,
      protein: "28g",
      carbs: "52g",
      fat: "18g"
    },
    tags: ["spicy", "aromatic", "festive", "non-vegetarian"]
  },
  {
    id: "sample_2",
    name: "Pad Thai",
    cuisine: "Thai",
    description: "Thailand's most famous noodle dish with sweet, sour, and salty flavors perfectly balanced.",
    cookTime: 25,
    difficulty: "Easy" as const,
    servings: 4,
    ingredients: [
      "200g rice noodles",
      "200g shrimp, peeled",
      "2 eggs",
      "2 tbsp tamarind paste",
      "2 tbsp fish sauce",
      "2 tbsp palm sugar",
      "1/4 cup roasted peanuts",
      "Bean sprouts",
      "Lime wedges"
    ],
    instructions: [
      "Soak rice noodles in warm water until soft.",
      "Mix tamarind paste, fish sauce, and palm sugar for sauce.",
      "Stir-fry shrimp and scramble eggs in wok.",
      "Add noodles, sauce, and toss everything together."
    ],
    nutrition: {
      calories: 340,
      protein: "22g",
      carbs: "42g",
      fat: "12g"
    },
    tags: ["quick", "seafood", "sweet and sour", "street food"]
  }
];

export default function HomePage() {
  // Breadcrumb navigation state
  const [currentSection, setCurrentSection] = React.useState('Home');

  // Track which section is in view
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === 'ai-chat-section') setCurrentSection('AI Chef');
            else if (id === 'featured-recipes-section') setCurrentSection('Recipes');
            else if (id.includes('stats')) setCurrentSection('Stats');
            else setCurrentSection('Home');
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = ['ai-chat-section', 'featured-recipes-section'];
    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Quick action buttons
  const quickActions = [
    {
      emoji: '🍕',
      label: 'Pizza Recipes',
      action: () => triggerSearch('Show me authentic pizza recipes from Italy')
    },
    {
      emoji: '🍛',
      label: 'Curry Dishes',
      action: () => triggerSearch('Tell me about different curry recipes from around the world')
    },
    {
      emoji: '🍜',
      label: 'Ramen Guide',
      action: () => triggerSearch('How to make authentic ramen from scratch')
    },
    {
      emoji: '🥘',
      label: 'Stew Recipes',
      action: () => triggerSearch('Give me hearty stew recipes for cold weather')
    }
  ];

  const triggerSearch = (query: string) => {
    const chatSection = document.getElementById('ai-chat-section');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      const chatInput = document.querySelector('textarea') as HTMLTextAreaElement;
      if (chatInput) {
        chatInput.value = query;
        chatInput.focus();
        const event = new Event('input', { bubbles: true });
        chatInput.dispatchEvent(event);
      }
    }, 500);
  };

  // Footer emoji click handlers
  const handleFoodEmojiClick = (foodType: string, emoji: string) => {
    const messages = {
      'ramen': 'Tell me about ramen recipes!',
      'pizza': 'Show me authentic pizza recipes',
      'curry': 'I want to learn about curry dishes',
      'stew': 'What are some hearty stew recipes?',
      'soup': 'Give me comforting soup recipes'
    };
    
    // Scroll to chat and pre-fill with food query
    const chatSection = document.getElementById('ai-chat-section');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      const chatInput = document.querySelector('textarea') as HTMLTextAreaElement;
      if (chatInput) {
        chatInput.value = messages[foodType as keyof typeof messages] || `Tell me about ${foodType} recipes!`;
        chatInput.focus();
        // Trigger React state update
        const event = new Event('input', { bubbles: true });
        chatInput.dispatchEvent(event);
      }
    }, 500);
  };

  const handleFeatureClick = (feature: string) => {
    const actions: { [key: string]: () => void } = {
      'AI Recipe Assistant': () => {
        const chatSection = document.getElementById('ai-chat-section');
        chatSection?.scrollIntoView({ behavior: 'smooth' });
      },
      'Global Cuisine Database': () => {
        const recipesSection = document.getElementById('featured-recipes-section');
        recipesSection?.scrollIntoView({ behavior: 'smooth' });
      },
      'Detailed Instructions': () => {
        alert('🍳 Each recipe includes step-by-step instructions, ingredients, and cooking tips!');
      },
      'Nutritional Information': () => {
        alert('🥗 Get detailed nutritional facts including calories, protein, carbs, and fats!');
      }
    };
    
    const action = actions[feature];
    if (action) {
      action();
    }
  };

  const handleCuisineClick = (cuisine: string) => {
    const chatSection = document.getElementById('ai-chat-section');
    chatSection?.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
      const chatInput = document.querySelector('textarea') as HTMLTextAreaElement;
      if (chatInput) {
        chatInput.value = `Show me authentic ${cuisine} recipes and cooking techniques`;
        chatInput.focus();
        const event = new Event('input', { bubbles: true });
        chatInput.dispatchEvent(event);
      }
    }, 500);
  };
  const handleSendMessage = async (message: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const handleFavorite = (recipeId: string) => {
    console.log('Favoriting recipe:', recipeId);
    // Implementation for favoriting
  };

  const handleSave = (recipeId: string) => {
    console.log('Saving recipe:', recipeId);
    // Implementation for saving
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Breadcrumb Navigation */}
      <motion.div 
        className="fixed top-20 left-4 z-40 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-orange-100"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="text-orange-600">📍</span>
          <span className="text-gray-600">You're in:</span>
          <span className="font-semibold text-orange-700">{currentSection}</span>
        </div>
      </motion.div>

      {/* Quick Actions Floating Menu */}
      <motion.div 
        className="fixed bottom-6 right-6 z-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              onClick={action.action}
              className="bg-white hover:bg-orange-50 text-gray-700 p-3 rounded-full shadow-lg border border-orange-200 hover:border-orange-300 transition-all duration-300 group"
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              title={action.label}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              <span className="text-xl group-hover:scale-110 transition-transform inline-block">
                {action.emoji}
              </span>
            </motion.button>
          ))}
          
          {/* Back to Top Button */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Back to top"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6 }}
          >
            <span className="text-xl">⬆️</span>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* AI Chat Section */}
        <motion.section
          id="ai-chat-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ask Your AI 
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Chef </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get instant recipes, cooking tips, and culinary guidance from our AI-powered assistant trained on global cuisines.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={
              <div className="flex justify-center items-center h-96 bg-white rounded-2xl shadow-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            }>
              <EnhancedChatInterface onSendMessage={handleSendMessage} />
            </Suspense>
          </div>
        </motion.section>

        {/* Featured Recipes Section */}
        <motion.section
          id="featured-recipes-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured 
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Recipes </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover detailed recipes with step-by-step instructions, ingredient lists, and nutritional information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {sampleRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <RecipeCard 
                  recipe={recipe}
                  onFavorite={handleFavorite}
                  onSave={handleSave}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-12 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Trusted by Food Enthusiasts Worldwide
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "230+", label: "Global Recipes" },
              { value: "22+", label: "Countries" },
              { value: "1000+", label: "Happy Users" },
              { value: "<3s", label: "AI Response Time" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="text-3xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                RAG Food
              </h3>
              <p className="text-gray-400 mb-4">
                AI-powered culinary explorer bringing you authentic recipes and cooking wisdom from around the globe.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleFoodEmojiClick('ramen', '🍜')}
                  className="text-2xl hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer hover:drop-shadow-lg"
                  title="Find ramen recipes!"
                >
                  🍜
                </button>
                <button 
                  onClick={() => handleFoodEmojiClick('pizza', '🍕')}
                  className="text-2xl hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer hover:drop-shadow-lg"
                  title="Discover pizza recipes!"
                >
                  🍕
                </button>
                <button 
                  onClick={() => handleFoodEmojiClick('curry', '🍛')}
                  className="text-2xl hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer hover:drop-shadow-lg"
                  title="Explore curry dishes!"
                >
                  🍛
                </button>
                <button 
                  onClick={() => handleFoodEmojiClick('stew', '🥘')}
                  className="text-2xl hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer hover:drop-shadow-lg"
                  title="Learn stew recipes!"
                >
                  🥘
                </button>
                <button 
                  onClick={() => handleFoodEmojiClick('soup', '🍲')}
                  className="text-2xl hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-pointer hover:drop-shadow-lg"
                  title="Get soup recipes!"
                >
                  🍲
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => handleFeatureClick('AI Recipe Assistant')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    🤖 AI Recipe Assistant
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFeatureClick('Global Cuisine Database')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    🌍 Global Cuisine Database
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFeatureClick('Detailed Instructions')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    📋 Detailed Instructions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleFeatureClick('Nutritional Information')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    📊 Nutritional Information
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Cuisines</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => handleCuisineClick('Italian')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    🇮🇹 Italian
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCuisineClick('Indian')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    🇮🇳 Indian
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCuisineClick('Thai')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    🇹🇭 Thai
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleCuisineClick('Mexican')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    🇲🇽 Mexican
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert('🌍 Explore 18+ more cuisines! Try asking our AI about any cuisine.')}
                    className="hover:text-orange-400 transition-colors cursor-pointer hover:translate-x-1 transform duration-200"
                  >
                    🌎 + 18 more countries
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RAG Food. Made with ❤️ using Groq AI, Upstash, and Next.js 15.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
