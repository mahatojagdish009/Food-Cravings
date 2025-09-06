'use client';

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import HeroSection from '@/components/HeroSection';
import RecipeCard from '@/components/RecipeCard';
import { SimpleChatInterface } from '@/components/SimpleChatInterface';

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
  // Simple message handler
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
  };

  const handleSave = (recipeId: string) => {
    console.log('Saving recipe:', recipeId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
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
              <SimpleChatInterface onSendMessage={handleSendMessage} />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                RAG Food
              </h3>
              <p className="text-gray-400 mb-4">
                AI-powered culinary explorer bringing you authentic recipes and cooking wisdom from around the globe.
              </p>
              <div className="flex space-x-4">
                <span className="text-2xl">🍜</span>
                <span className="text-2xl">🍕</span>
                <span className="text-2xl">🍛</span>
                <span className="text-2xl">🥘</span>
                <span className="text-2xl">🍲</span>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>🤖 AI Recipe Assistant</li>
                <li>🌍 Global Cuisine Database</li>
                <li>📋 Detailed Instructions</li>
                <li>📊 Nutritional Information</li>
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
