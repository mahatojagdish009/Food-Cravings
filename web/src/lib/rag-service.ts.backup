import { Index } from '@upstash/vector';
import Groq from 'groq-sdk';
import type { SearchResult } from '@/types';

// Lazy initialization functions
function getVectorClient() {
  if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
    throw new Error('Upstash Vector environment variables are missing!');
  }
  return new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });
}

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing!');
  }
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

export class RAGService {
  /**
   * Search for relevant food items using Upstash Vector semantic search
   */
  static async searchFoodItems(query: string, topK: number = 3): Promise<SearchResult[]> {
    try {
      console.log(`🔍 Searching for: "${query}" (top ${topK} results)`);
      
      const vectorClient = getVectorClient();
      const results = await vectorClient.query({
        data: query, // Auto-embedding with mixedbread-ai/mxbai-embed-large-v1
        topK,
        includeMetadata: true,
      });

      if (!results || results.length === 0) {
        console.log('❌ No results found from vector search');
        return [];
      }

      console.log(`✅ Found ${results.length} relevant food items`);
      
      // Transform results to match our SearchResult interface
      const searchResults: SearchResult[] = results.map((result) => ({
        id: String(result.id), // Ensure ID is always a string
        score: result.score || 0,
        metadata: {
          text: String(result.metadata?.text || ''), // Ensure text is always a string
          name: result.metadata?.name as string | undefined,
          cuisine: result.metadata?.cuisine as string | undefined,
          category: result.metadata?.category as string | undefined,
          description: result.metadata?.description as string | undefined,
        },
      }));

      return searchResults;
    } catch (error) {
      console.error('❌ Vector search failed:', error);
      throw new Error(`Vector search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate answer using Groq LLM with retrieved context
   */
  static async generateAnswer(
    query: string, 
    context: SearchResult[]
  ): Promise<{ answer: string; usage?: any }> {
    try {
      if (context.length === 0) {
        return {
          answer: "❌ I couldn't find any relevant food information for your question. Try asking about specific foods, cuisines, or cooking methods."
        };
      }

      // Build context from retrieved documents
      const contextText = context
        .map(doc => doc.metadata.text)
        .join('\n');

      // System message for food-specific responses with structured formatting
      const systemMessage = `You are a knowledgeable and friendly food expert! Provide helpful responses about food, recipes, and cooking.

IMPORTANT: Only answer food-related questions. If asked about non-food topics (like "robot", "weather", "sports"), politely say: "I'm a food expert! I'd love to help you with cooking, recipes, or nutrition questions instead. Try asking me about your favorite dishes or cooking techniques!"

FORMATTING RULES:
- Use regular paragraphs for explanations
- Use bullet points (-) for lists, ingredients, steps, or tips
- NO markdown formatting (no **, *, #) - use plain text only
- Keep responses conversational and friendly
- Include practical cooking tips when relevant

Keep responses between 200-400 words.`;

      const userMessage = `Context from food database:
${contextText}

Question: ${query}

Please provide a well-structured response that combines paragraphs with bullet points. Use paragraphs for explanations and bullet points for lists, ingredients, steps, or key points. Make it informative and easy to read.`;

RESPONSE FORMAT - Mix of paragraphs and bullet points:
1. Start with 1-2 introductory paragraphs explaining the topic
2. Use bullet points for lists, steps, ingredients, or key points  
3. End with 1-2 concluding paragraphs with tips or encouragement

FORMATTING RULES:
- Use regular paragraphs for explanations and stories
- Use bullet points (-) for ingredients, steps, tips, or list items
- Use numbered lists (1., 2., 3.) for sequential steps
- Keep bullet points concise but informative
- End with practical tips or encouragement

Keep responses informative but conversational, between 200-400 words.

PERSONALITY & TONE:
- Be warm, enthusiastic, and encouraging like a helpful friend
- Use natural, conversational language - no formal structure
- Show genuine excitement about food and cooking
- Be supportive and make cooking feel approachable
- Use food emojis sparingly and naturally �✨
- Write like you're having a friendly chat, not giving a lecture

LANGUAGE DETECTION:
- IF question uses English alphabet → respond in ENGLISH
- IF question uses Devanagari script (नेपाली) → respond in NEPALI
- Default to ENGLISH if unclear
- Never mix languages in one response

FOOD ACCURACY (Critical Facts):
- Dhokla: SAVORY steamed Gujarati snack (fermented rice/chickpea flour)
- Rasgulla: SWEET dessert (chhena in sugar syrup)
- Lassi: COLD yogurt drink (sweet/salty/flavored)
- Always verify: sweet vs savory, drink vs solid food categories
- Base answers on provided context data

RESPONSE STYLE - NATURAL CONVERSATION:
Write responses as flowing, natural paragraphs like you're chatting with a friend. Include:

🎯 Start with enthusiasm: "Oh, I'm so excited you asked about [topic]!" or "[Food item] is absolutely one of my favorites!"

� Main explanation: Write 2-3 natural paragraphs explaining the dish/topic conversationally, sharing interesting details, preparation tips, and cultural background naturally within the flow.

💡 Practical tips: Weave in helpful cooking tips and chef secrets naturally in the conversation. Share personal touches like "Here's something I love about this dish..." or "A little secret that makes all the difference..."

🌟 Encouraging closing: End with something encouraging like "You're going to love making this!" or "I can't wait for you to try this!"

CRITICAL FORMATTING RULES:
- Write in natural paragraphs, NOT bullet points or rigid sections
- NO markdown formatting (no **, -, #, ###, etc.)
- NO structured headings or bullet lists
- Write conversationally like natural speech
- Use simple line breaks between paragraphs
- Include practical tips within natural conversation flow
- Keep responses between 150-250 words for easy reading

AVOID COMPLETELY:
- Any ** or * markdown formatting
- Bullet points or dashes for lists
- Formal headings with # or ###
- Rigid structure with sections
- Academic or cookbook-style writing
- Making it sound robotic or formal

Write like you're texting a friend who asked you about food - natural, flowing, conversational, and helpful!`;

      const userMessage = `Context from food database:
${contextText}

Question: ${query}

Please provide a well-structured response that combines paragraphs with bullet points. Use paragraphs for explanations and bullet points for lists, ingredients, steps, or key points. Make it informative and easy to read.`;

      console.log('🧠 Generating answer with Groq LLM...');
      
      const groqClient = getGroqClient();
      const completion = await groqClient.chat.completions.create({
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        model: 'llama-3.1-8b-instant', // Same model as Python version
        temperature: 0.7,
        max_tokens: 1500, // Increased for more detailed structured responses
        stream: false, // Explicitly set to false to ensure we get ChatCompletion type
      });

      const answer = (completion as any).choices[0]?.message?.content || '';
      console.log(`✅ Generated answer (${answer.length} chars)`);

      return {
        answer,
        usage: (completion as any).usage,
      };
    } catch (error) {
      console.error('❌ Answer generation failed:', error);
      throw new Error(`Answer generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Complete RAG pipeline: search + generate answer
   */
  static async ragQuery(query: string, topK: number = 3): Promise<{
    answer: string;
    sources: SearchResult[];
    usage?: any;
  }> {
    try {
      console.log(`🎯 Processing RAG query: "${query}"`);
      
      // Step 1: Search for relevant food items
      const sources = await this.searchFoodItems(query, topK);
      
      // Step 2: Generate answer using context
      const { answer, usage } = await this.generateAnswer(query, sources);
      
      console.log('✅ RAG query completed successfully');
      
      return {
        answer,
        sources,
        usage,
      };
    } catch (error) {
      console.error('❌ RAG query failed:', error);
      throw error;
    }
  }

  /**
   * Health check for both services
   */
  static async healthCheck(): Promise<{
    upstash: boolean;
    groq: boolean;
    overall: boolean;
  }> {
    try {
      // Test Upstash Vector
      let upstashHealthy = false;
      try {
        const vectorClient = getVectorClient();
        await vectorClient.info();
        upstashHealthy = true;
        console.log('✅ Upstash Vector: Healthy');
      } catch (error) {
        console.error('❌ Upstash Vector: Unhealthy', error);
      }

      // Test Groq
      let groqHealthy = false;
      try {
        const groqClient = getGroqClient();
        await groqClient.chat.completions.create({
          messages: [{ role: 'user', content: 'Hello' }],
          model: 'llama-3.1-8b-instant',
          max_tokens: 5,
        });
        groqHealthy = true;
        console.log('✅ Groq LLM: Healthy');
      } catch (error) {
        console.error('❌ Groq LLM: Unhealthy', error);
      }

      return {
        upstash: upstashHealthy,
        groq: groqHealthy,
        overall: upstashHealthy && groqHealthy,
      };
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return {
        upstash: false,
        groq: false,
        overall: false,
      };
    }
  }
}