'use client';

import { 
  Utensils, 
  Globe, 
  Star, 
  Clock,
  ChefHat,
  Coffee,
  Pizza,
  Fish,
  Cake,
  Apple,
  Leaf,
  Flame,
  Heart
} from 'lucide-react';

interface CategoryMenuProps {
  onCategorySelect: (query: string) => void;
}

export function CategoryMenu({ onCategorySelect }: CategoryMenuProps) {
  const categories = [
    {
      name: 'Italian',
      icon: Pizza,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      description: 'Pasta, pizza, and Mediterranean flavors',
      queries: [
        'Authentic Italian pasta recipes',
        'How to make pizza dough from scratch',
        'Italian cooking techniques and tips',
        'Traditional Italian desserts'
      ]
    },
    {
      name: 'Asian',
      icon: Coffee,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Chinese, Japanese, Thai, and Indian cuisine',
      queries: [
        'How to make perfect sushi rice',
        'Chinese stir-fry techniques',
        'Thai curry ingredient guide',
        'Japanese cooking fundamentals'
      ]
    },
    {
      name: 'Desserts',
      icon: Cake,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      description: 'Sweet treats and baking essentials',
      queries: [
        'How to bake perfect chocolate cake',
        'French pastry techniques',
        'Homemade ice cream recipes',
        'Cookie baking tips and tricks'
      ]
    },
    {
      name: 'Seafood',
      icon: Fish,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Fresh fish, shellfish, and ocean flavors',
      queries: [
        'How to cook salmon perfectly',
        'Best fish for grilling',
        'Shellfish preparation guide',
        'Seafood seasoning combinations'
      ]
    },
    {
      name: 'Healthy',
      icon: Apple,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: 'Nutritious meals and superfoods',
      queries: [
        'Nutritious breakfast ideas',
        'Superfood benefits and recipes',
        'Low-calorie meal planning',
        'Healthy protein sources'
      ]
    },
    {
      name: 'Vegetarian',
      icon: Leaf,
      color: 'from-lime-500 to-lime-600',
      bgColor: 'bg-lime-50',
      borderColor: 'border-lime-200',
      description: 'Plant-based meals and ingredients',
      queries: [
        'Vegetarian protein sources',
        'Plant-based meal ideas',
        'Vegan substitutes guide',
        'Vegetable cooking techniques'
      ]
    },
    {
      name: 'Spicy',
      icon: Flame,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      description: 'Hot peppers and spicy dishes',
      queries: [
        'Hottest peppers in the world',
        'Spicy Indian dish recipes',
        'How to handle chili heat',
        'Hot sauce making guide'
      ]
    },
    {
      name: 'Comfort Food',
      icon: Heart,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Soul-warming traditional dishes',
      queries: [
        'Classic comfort food recipes',
        'Hearty winter meal ideas',
        'Traditional family dishes',
        'Soul food cooking tips'
      ]
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
          Explore Culinary Categories
        </h2>
        <p className="text-gray-600">
          Discover recipes, techniques, and knowledge from cuisines around the world
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.name}
            className={`${category.bgColor} ${category.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer`}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`bg-gradient-to-r ${category.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            </div>

            {/* Quick Queries */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                Popular Queries
              </h4>
              {category.queries.slice(0, 2).map((query, index) => (
                <button
                  key={index}
                  onClick={() => onCategorySelect(query)}
                  className="w-full text-left p-2 rounded-lg hover:bg-white/80 transition-colors text-sm text-gray-700 hover:text-gray-900 border border-transparent hover:border-gray-200"
                >
                  {query}
                </button>
              ))}
              
              {/* View More Button */}
              <button className="w-full text-center p-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                + {category.queries.length - 2} more topics
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ChefHat className="h-3 w-3" />
                <span>Expert knowledge</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>~2s response</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}