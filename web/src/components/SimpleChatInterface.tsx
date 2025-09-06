'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface SimpleChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<any>;
}

export interface SimpleChatInterfaceRef {
  sendMessage: (message: string) => void;
}

export const SimpleChatInterface = forwardRef<SimpleChatInterfaceRef, SimpleChatInterfaceProps>(
  function SimpleChatInterface({ onSendMessage }, ref) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [fastMode, setFastMode] = useState(false); // Toggle for instant responses
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    // Use requestAnimationFrame for smoother scrolling
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

  useEffect(() => {
    // Optimized scrolling - only scroll when necessary
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]); // Only trigger on message count change, not content updates

  // Gentle auto-scroll during streaming to prevent shaking
  useEffect(() => {
    if (streamingMessageId) {
      const streamingInterval = setInterval(() => {
        // Check if user has scrolled up, if so don't auto-scroll
        const container = messagesEndRef.current?.parentElement;
        if (container) {
          const isNearBottom = container.scrollTop > container.scrollHeight - container.clientHeight - 100;
          if (isNearBottom) {
            scrollToBottom();
          }
        }
      }, 300); // Reduced frequency to prevent shaking
      
      return () => clearInterval(streamingInterval);
    }
  }, [streamingMessageId]);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Expose sendMessage method to parent
  useImperativeHandle(ref, () => ({
    sendMessage: (message: string) => {
      setInput(message);
      setTimeout(() => {
        handleMessageSubmit(message);
      }, 100);
    }
  }));

  // Optimized streaming text effect
  const streamText = (text: string, messageId: string) => {
    const words = text.split(' ');
    let currentText = '';
    let wordIndex = 0;
    
    setStreamingMessageId(messageId);
    
    const streamInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        
        // Use functional update to prevent unnecessary re-renders
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: currentText, isStreaming: true }
            : msg
        ));
        
        wordIndex++;
      } else {
        // Streaming complete
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: text, isStreaming: false }
            : msg
        ));
        setStreamingMessageId(null);
        clearInterval(streamInterval);
      }
    }, 50); // 50ms per word for smooth streaming
  };

  const handleMessageSubmit = async (messageText?: string) => {
    const finalMessage = messageText || input.trim();
    if (!finalMessage || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: finalMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create placeholder assistant message for streaming
    const assistantMessageId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false); // Stop loading immediately, start streaming

    try {
      // Try API first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: finalMessage,
          topK: 3,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.answer || 'Sorry, I could not generate a response.';
      
      // Check fast mode or if response is short enough for instant display
      const wordCount = responseText.split(' ').length;
      if (fastMode || wordCount < 50) {
        // Show instantly
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: responseText, isStreaming: false }
            : msg
        ));
        setStreamingMessageId(null);
      } else {
        // Stream longer responses
        streamText(responseText, assistantMessageId);
      }
      
    } catch (error) {
      console.log('API failed, using offline response:', error);
      
      // Use fallback response with streaming
      const fallbackContent = getFallbackResponse(finalMessage);
      const wordCount = fallbackContent.split(' ').length;
      
      if (fastMode || wordCount < 50) {
        // Show instantly
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: fallbackContent, isStreaming: false }
            : msg
        ));
        setStreamingMessageId(null);
      } else {
        // Stream the response
        streamText(fallbackContent, assistantMessageId);
      }
    } finally {
      inputRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleMessageSubmit();
  };
  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Navigation-specific responses
    if (lowerMessage.includes('popular recipe suggestions') || lowerMessage.includes('cooking tips')) {
      return `## 🍳 Popular Recipe Suggestions & Cooking Tips

### **🔥 Trending Recipes This Week:**

#### **Quick & Easy (Under 30 mins):**
- 🍜 **Ramen Upgrade** - Transform instant ramen with soft-boiled egg, scallions, and sriracha
- 🥗 **Mediterranean Bowl** - Quinoa, cucumber, tomatoes, olives, and feta cheese
- 🌮 **Fish Tacos** - Pan-seared fish with cabbage slaw and lime crema
- 🍝 **Aglio e Olio** - Simple garlic and olive oil pasta with red pepper flakes

#### **Weekend Specials:**
- 🥘 **Chicken Biryani** - Aromatic spiced rice with tender chicken
- 🍖 **Slow-Cooked Beef Stew** - Rich, hearty comfort food
- 🍰 **Homemade Pizza** - Fresh dough with your favorite toppings
- 🦐 **Pad Thai** - Sweet and tangy Thai noodle dish

### **💡 Pro Cooking Tips:**
✅ **Mise en place** - Prep all ingredients before cooking
✅ **Salt pasta water** like the sea for flavor
✅ **Rest meat** after cooking for juicier results
✅ **Taste as you go** and adjust seasoning
✅ **Sharp knives** are safer and more efficient

### **🌟 Chef's Secrets:**
- 🧄 **Garlic paste** lasts longer than whole cloves
- 🧊 **Ice bath** stops vegetables from overcooking
- 🥄 **Wooden spoon test** - if it stands up, risotto is ready
- 🔥 **High heat** for searing, low heat for braising`;
    }
    
    if (lowerMessage.includes('recipe categories') || lowerMessage.includes('meal ideas')) {
      return `## 📚 Recipe Categories & Meal Ideas

### **🌍 Global Cuisine Categories:**

#### **🇮🇹 Italian Classics:**
- 🍝 **Pasta Dishes** - Carbonara, Bolognese, Cacio e Pepe
- 🍕 **Pizza Varieties** - Margherita, Quattro Stagioni, Marinara
- 🥗 **Antipasti** - Bruschetta, Caprese, Antipasto platters
- 🍮 **Desserts** - Tiramisu, Panna Cotta, Gelato

#### **🇮🇳 Indian Delights:**
- 🍛 **Rice Dishes** - Biryani, Pulao, Fried Rice
- 🥘 **Curries** - Butter Chicken, Dal Makhani, Palak Paneer
- 🫓 **Breads** - Naan, Roti, Paratha, Kulcha
- 🍨 **Sweets** - Gulab Jamun, Rasmalai, Kheer

#### **🇹🇭 Thai Favorites:**
- 🍜 **Noodle Soups** - Tom Yum, Pad Thai, Boat Noodles
- 🥥 **Coconut Curries** - Green, Red, Yellow, Massaman
- 🥗 **Salads** - Som Tam, Larb, Thai Beef Salad
- 🍰 **Desserts** - Mango Sticky Rice, Coconut Ice Cream

### **🕐 Meal Planning Ideas:**

#### **Breakfast Options:**
- 🥞 **Weekend Brunch** - Pancakes, French Toast, Eggs Benedict
- 🥣 **Quick Weekday** - Overnight oats, Smoothie bowls, Greek yogurt

#### **Lunch Solutions:**
- 🥪 **Sandwiches & Wraps** - Club sandwiches, Burritos, Pita pockets
- 🍲 **One-Pot Meals** - Soup, Stew, Pasta bake

#### **Dinner Ideas:**
- 🍗 **Protein + Sides** - Grilled chicken with roasted vegetables
- 🍜 **Comfort Food** - Mac and cheese, Meatloaf, Shepherd's pie`;
    }
    
    if (lowerMessage.includes('biryani')) {
      return `🍛 Chicken Biryani Recipe

Biryani is a fragrant rice dish that's perfect for special occasions. Here's how to make authentic chicken biryani:

1. Ingredients

For the Rice:
- 2 cups basmati rice (aged, long-grain)
- 2 tsp salt for boiling water
- 4 green cardamom pods
- 2 black cardamom pods
- 4 cloves
- 2 bay leaves
- Pinch of saffron soaked in ¼ cup warm milk

For the Chicken:
- 1 kg chicken, cut into medium pieces
- 1 cup thick yogurt
- 2 tbsp ginger-garlic paste
- 1 tsp red chili powder
- ½ tsp turmeric powder
- 1 tsp garam masala
- Salt to taste

For Layering:
- 3 large onions, thinly sliced and fried until golden
- ½ cup fresh mint leaves
- ½ cup fresh coriander leaves
- 4 tbsp ghee

2. Method

Step 1: Marinate the Chicken (30 minutes)
Mix the chicken with yogurt, ginger-garlic paste, and all the spices. Make sure every piece is well coated. Let it marinate for at least 30 minutes - longer marination gives better flavor.

Step 2: Prepare the Rice (15 minutes)
Soak the basmati rice for 30 minutes, then drain. Boil water with whole spices and salt. Add the rice and cook until 70% done (it should still have a slight bite). Drain immediately and set aside.

Step 3: Cook the Chicken (25 minutes)
Heat oil in a heavy-bottomed pot. Add the marinated chicken and cook until 80% done - it should still be slightly pink inside as it will finish cooking during the dum process.

Step 4: Layer the Biryani
This is the most important step! Spread half the rice over the chicken. Sprinkle the fried onions, mint, and coriander leaves. Add the remaining rice as the top layer. Drizzle the saffron milk and ghee evenly. Cover with aluminum foil, then place a tight-fitting lid.

Step 5: Dum Cooking (45 minutes)
Cook on high heat for 3-4 minutes, then reduce to the lowest heat setting. Cook for 45 minutes without opening the lid. Turn off heat and let it rest for 10 minutes. Never open the lid during cooking!

3. Pro Tips

- The rice should be 70% cooked as it will finish cooking during the dum process
- Fried onions are essential for authentic flavor and color
- Use a heavy-bottomed pot to prevent burning
- Seal the pot properly with dough or foil for perfect steam
- Patience is key - don't rush the dum process

4. Serving Suggestions

Serve with cucumber raita (cooling yogurt side dish), kachumber salad (fresh onion-tomato mix), boiled eggs, and mixed pickle. Mint tea makes a great digestive drink after the meal.

Serves: 6-8 people | Prep time: 1 hour | Cook time: 1.5 hours | Total time: 2.5 hours`;
    }
    
    if (lowerMessage.includes('mediterranean')) {
      return `🏛️ Mediterranean Diet Guide

The Mediterranean diet is consistently ranked as one of the world's healthiest eating patterns. It's based on the traditional eating habits of countries bordering the Mediterranean Sea.

1. Core Foods

Daily Staples:
- Olive oil as the primary source of fat
- Fresh vegetables and leafy greens
- Fruits as natural desserts and snacks
- Whole grains like quinoa, brown rice, and whole wheat
- Nuts and seeds for healthy fats and protein
- Herbs and spices for flavor instead of salt

Regular Protein Sources:
- Fish and seafood 2-3 times per week
- Poultry in moderate amounts
- Eggs several times per week
- Legumes and beans frequently

Occasional Foods:
- Red meat in small amounts
- Dairy products, particularly Greek yogurt and cheese
- Red wine in moderation (optional)

2. Health Benefits

Research shows the Mediterranean diet can lead to:
- Improved heart health and reduced cardiovascular disease risk
- Better brain function and memory
- Easier weight management
- Reduced inflammation throughout the body
- Lower risk of type 2 diabetes
- Better digestive health

3. Sample Daily Menu

Breakfast: Greek yogurt with fresh berries, honey, and chopped nuts
Lunch: Mediterranean salad with chickpeas, cucumber, tomatoes, olives, and olive oil dressing
Dinner: Grilled fish with roasted vegetables and a small portion of whole grain rice
Snacks: Fresh fruit, handful of nuts, or vegetables with hummus

4. Getting Started

Start by making small changes like using olive oil instead of butter, eating fish twice a week, snacking on nuts instead of processed foods, and filling half your plate with vegetables at each meal. The diet emphasizes whole, minimally processed foods and the social aspect of sharing meals.`;
    }
    
    if (lowerMessage.includes('vegetarian protein') || lowerMessage.includes('protein sources')) {
      return `## 🌱 Complete Vegetarian Protein Guide

### **High-Protein Plant Foods:**

#### **Legumes & Beans:**
- 🫘 **Lentils** - 18g protein per cup
- 🫛 **Chickpeas** - 15g protein per cup  
- ⚫ **Black beans** - 15g protein per cup
- 🔴 **Kidney beans** - 13g protein per cup

#### **Nuts & Seeds:**
- 🥜 **Almonds** - 6g protein per ounce
- 🌰 **Cashews** - 5g protein per ounce
- 🌻 **Sunflower seeds** - 6g protein per ounce
- 🟤 **Chia seeds** - 5g protein per 2 tbsp

#### **Grains & Cereals:**
- 🌾 **Quinoa** - 8g protein per cup
- 🌾 **Oats** - 6g protein per cup
- 🍞 **Whole wheat** - 16g protein per cup

#### **Complete Protein Combinations:**
🍚 **Rice + Beans** = Complete amino profile
🥜 **Peanut butter + Whole grain bread**
🌾 **Hummus + Pita bread**`;
    }
    
    if (lowerMessage.includes('pasta') || lowerMessage.includes('italian')) {
      return `## 🍝 Italian Pasta Mastery

### **Classic Italian Pasta Types:**

#### **Long Pasta:**
- 🍝 **Spaghetti** - Perfect for oil-based sauces
- 🍜 **Linguine** - Great with seafood
- 🥢 **Angel hair** - Light, delicate sauces

#### **Short Pasta:**
- 🔶 **Penne** - Holds chunky sauces well
- 🌀 **Fusilli** - Spiral shape traps sauce
- 🟫 **Rigatoni** - Large tubes for hearty sauces

### **Authentic Cooking Tips:**
✅ **Salt the water** generously (like sea water)
✅ **Al dente texture** - firm to the bite
✅ **Save pasta water** for sauce consistency
✅ **Never rinse** cooked pasta

### **Classic Sauces:**
🍅 **Marinara** - Simple tomato base
🧄 **Aglio e olio** - Garlic and olive oil  
🧀 **Carbonara** - Eggs, cheese, pancetta
🌿 **Pesto** - Basil, pine nuts, parmesan`;
    }
    
    if (lowerMessage.includes('healthy') || lowerMessage.includes('nutrition')) {
      return `## 🥗 Healthy Eating Fundamentals

### **Balanced Plate Method:**
🥬 **½ Plate:** Non-starchy vegetables
🍠 **¼ Plate:** Complex carbohydrates  
🐟 **¼ Plate:** Lean protein source

### **Essential Nutrients:**

#### **Macronutrients:**
- 💪 **Protein:** 0.8g per kg body weight
- 🧠 **Healthy fats:** 20-35% of calories
- ⚡ **Carbohydrates:** 45-65% of calories

#### **Key Vitamins:**
- 🌞 **Vitamin D:** Sunlight + fortified foods
- 🩸 **Iron:** Leafy greens + citrus
- 🦴 **Calcium:** Dairy + leafy vegetables
- 💊 **B12:** Essential for vegetarians

### **Meal Prep Tips:**
✅ **Batch cook** grains and proteins
✅ **Pre-wash** vegetables and fruits
✅ **Plan meals** for the week
✅ **Stay hydrated** - 8 glasses daily`;
    }
    
    if (lowerMessage.includes('breakfast')) {
      return `## 🌅 Healthy Breakfast Ideas

### **⚡ Quick & Nutritious Options:**

#### **🥛 Protein-Packed Choices:**
• � **Greek yogurt parfait** with fresh berries and granola
• 🍳 **Veggie scrambled eggs** with spinach and avocado toast
• 🥜 **Overnight oats** with protein powder and chia seeds
• 🧀 **Cottage cheese bowl** with sliced fruits and nuts
• 🥓 **Turkey and egg** breakfast wrap with whole wheat tortilla

#### **🏃‍♂️ Grab-and-Go Options:**
• 🍌 **Smoothie bowl** with spinach, banana, and protein powder
• 🥯 **Whole grain toast** with almond butter and banana slices
• 🍎 **Apple slices** with natural peanut butter
• 🥤 **Protein smoothie** with berries, oats, and Greek yogurt
• 🥨 **Energy balls** made with dates, nuts, and oats

#### **🎉 Weekend Special Treats:**
• 🥞 **Whole wheat pancakes** topped with fresh fruit compote
• 🍞 **Avocado toast** with poached egg and everything seasoning
• 🌯 **Breakfast burrito** with black beans, eggs, and salsa
• 🥣 **Chia pudding** with coconut milk and tropical fruits
• 🧇 **Sweet potato hash** with eggs and vegetables

### **💪 Nutritional Benefits:**
• **Sustained energy** - Complex carbs provide long-lasting fuel
• **Better concentration** - Protein helps maintain focus
• **Improved metabolism** - Kickstarts your body's daily functions
• **Essential nutrients** - Vitamins and minerals for optimal health
• **Weight management** - Balanced breakfast reduces cravings

### **⏰ Time-Saving Tips:**
• **Prep the night before** - Overnight oats, chia pudding
• **Batch prepare** - Make energy balls or muffins in advance
• **Keep it simple** - 3-4 ingredients maximum for busy mornings
• **Use frozen fruits** - Just as nutritious and always ready`;
    }
    
    // Default fallback with suggestions
    return `# 🤖 RAG Food AI Assistant

I'm here to help with all your cooking and nutrition questions! I can provide recipes, cooking tips, nutritional guidance, and information about cuisines from around the world.

## What I Can Help With

### Cooking & Recipes
- Step-by-step recipe instructions
- Cooking techniques and tips
- Ingredient substitutions
- Recipe modifications for dietary needs

### Nutrition & Health
- Balanced meal planning
- Nutritional information
- Dietary recommendations
- Healthy eating tips

### Global Cuisines
- Traditional cooking methods
- Regional specialties
- Cultural food traditions
- Authentic flavor profiles

## Popular Topics

Here are some things you might want to ask about:
- "How to make perfect pasta?"
- "What are good protein sources for vegetarians?"
- "Mediterranean diet meal ideas"
- "Healthy breakfast recipes"
- "Traditional biryani recipe"

Just type your food question above and I'll help you out!`;
  };

  // Enhanced content rendering with better formatting
  const renderFormattedContent = (content: string, isStreaming = false) => {
    // Clean up markdown formatting first
    let cleanContent = content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** formatting
      .replace(/\*(.*?)\*/g, '$1')     // Remove *italic* formatting
      .replace(/`(.*?)`/g, '$1')       // Remove `code` formatting
      .replace(/_{2,}/g, '')           // Remove multiple underscores
      .trim();

    // Split content into paragraphs and process each one
    const paragraphs = cleanContent.split('\n\n').filter(p => p.trim());
    
    return (
      <div className="space-y-4 leading-relaxed">
        {paragraphs.map((paragraph, pIndex) => {
          const lines = paragraph.split('\n').filter(line => line.trim());
          
          return (
            <div key={pIndex} className="space-y-2">
              {lines.map((line, lIndex) => {
                const cleanLine = line.trim();
                if (!cleanLine) return null;
                
                // Handle bullet points (-, •, *, or emoji bullets)
                if (cleanLine.match(/^[\-\•\*]\s/) || /^[🔥🌟💡✅🍳🥘🌱]\s/.test(cleanLine)) {
                  const bulletChar = cleanLine.match(/^[\-\•\*]/) ? '•' : cleanLine.charAt(0);
                  const text = cleanLine.replace(/^[\-\•\*]\s*/, '').replace(/^[🔥🌟💡✅🍳🥘🌱]\s*/, '');
                  return (
                    <div key={lIndex} className="flex gap-3 items-start ml-2">
                      <span className="text-orange-500 font-medium mt-1 text-sm">{bulletChar}</span>
                      <p className="text-gray-700 flex-1">{text}</p>
                    </div>
                  );
                }
                
                // Handle numbered lists
                if (cleanLine.match(/^\d+\.\s/)) {
                  const number = cleanLine.match(/^(\d+)\./)?.[1];
                  const text = cleanLine.replace(/^\d+\.\s*/, '');
                  return (
                    <div key={lIndex} className="flex gap-3 items-start ml-2">
                      <span className="text-orange-600 font-semibold mt-1 min-w-[24px] text-sm">{number}.</span>
                      <p className="text-gray-700 flex-1">{text}</p>
                    </div>
                  );
                }
                
                // Handle section headers (short lines ending with :)
                if (cleanLine.length < 80 && cleanLine.endsWith(':') && !cleanLine.includes(',')) {
                  return (
                    <h4 key={lIndex} className="text-lg font-semibold text-gray-800 mt-3 mb-2 border-b border-gray-200 pb-1">
                      {cleanLine.replace(':', '')}
                    </h4>
                  );
                }
                
                // Handle tips and important notes
                if (cleanLine.match(/^(Tip|Note|Important|Pro tip|Chef's secret|Remember):/i)) {
                  return (
                    <div key={lIndex} className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r-lg my-2">
                      <p className="text-amber-800 font-medium text-sm">{cleanLine}</p>
                    </div>
                  );
                }
                
                // Regular paragraphs
                return (
                  <p key={lIndex} className="text-gray-700 leading-relaxed">
                    {cleanLine}
                    {isStreaming && pIndex === paragraphs.length - 1 && lIndex === lines.length - 1 && (
                      <span className="inline-block w-0.5 h-4 bg-orange-500 ml-1 animate-pulse"></span>
                    )}
                  </p>
                );
              }).filter(Boolean)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden chat-container">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              🤖 AI Food Assistant
            </h3>
            <p className="text-orange-100 text-sm">Ask me anything about food, recipes, and cooking!</p>
          </div>
          <button
            onClick={() => setFastMode(!fastMode)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              fastMode 
                ? 'bg-white text-orange-600' 
                : 'bg-orange-400 text-white hover:bg-orange-300'
            }`}
            title={fastMode ? 'Switch to streaming mode' : 'Switch to instant mode'}
          >
            {fastMode ? '⚡ Fast' : '📝 Stream'}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-6xl mb-4">�‍🍳</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Hi there! I'm your AI Chef Friend! 👋</h2>
            <p className="text-lg text-gray-600 mb-2">Ready to explore the wonderful world of food together?</p>
            <p className="text-sm text-gray-500 mb-6">Ask me about recipes, cooking tips, ingredients, or any food question that comes to mind!</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">🔥 Popular Questions:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                <button
                  onClick={() => handleMessageSubmit('How to make perfect chicken biryani?')}
                  className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 px-4 py-3 rounded-xl text-sm font-medium hover:from-orange-200 hover:to-yellow-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  � Perfect Chicken Biryani
                </button>
                <button
                  onClick={() => handleMessageSubmit('What are the best vegetarian protein sources?')}
                  className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-3 rounded-xl text-sm font-medium hover:from-green-200 hover:to-emerald-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  🌱 Vegetarian Proteins
                </button>
                <button
                  onClick={() => handleMessageSubmit('Tell me about Mediterranean diet')}
                  className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-4 py-3 rounded-xl text-sm font-medium hover:from-blue-200 hover:to-cyan-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  🏛️ Mediterranean Diet
                </button>
                <button
                  onClick={() => handleMessageSubmit('How to cook pasta like an Italian chef?')}
                  className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-4 py-3 rounded-xl text-sm font-medium hover:from-red-200 hover:to-pink-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  🍝 Italian Pasta Secrets
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-400">
              💡 Tip: Try asking "What should I cook tonight?" or "Healthy breakfast ideas"
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  👨‍🍳
                </div>
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="text-sm leading-relaxed">
                  {renderFormattedContent(message.content, message.isStreaming)}
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap font-medium">{message.content}</p>
              )}
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-orange-100' : 'text-gray-400'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  👤
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                👨‍🍳
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                <span className="text-sm text-gray-600">Let me cook up an answer for you... 🍳</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like to cook today? Ask me anything! 🍽️"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-sm"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Send</span>
          </button>
        </form>
        <div className="text-xs text-gray-500 mt-2 text-center">
          💡 Try: "What's for dinner?", "Quick breakfast ideas", "How to make perfect rice?"
        </div>
      </div>
    </div>
  );
});