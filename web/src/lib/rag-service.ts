import { Index } from '@upstash/vector';
import Groq from 'groq-sdk';
import type { SearchResult } from '@/types';

// Environment variable validation
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'production') {
  if (!process.env.UPSTASH_VECTOR_REST_URL) {
    throw new Error('UPSTASH_VECTOR_REST_URL is missing!');
  }
  if (!process.env.UPSTASH_VECTOR_REST_TOKEN) {
    throw new Error('UPSTASH_VECTOR_REST_TOKEN is missing!');
  }
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing!');
  }
}

// Initialize clients only if environment variables are available
const vectorClient = process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN 
  ? new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    })
  : null;

const groqClient = process.env.GROQ_API_KEY 
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  : null;

export class RAGService {
  /**
   * Search for relevant food items using Upstash Vector semantic search
   */
  static async searchFoodItems(query: string, topK: number = 3): Promise<SearchResult[]> {
    try {
      if (!vectorClient) {
        throw new Error('Vector client not initialized - check environment variables');
      }

      console.log(`🔍 Searching for: "${query}" (top ${topK} results)`);
      
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

      // System message for food-specific responses with multi-language support
      const systemMessage = `You are a knowledgeable food expert assistant with expertise in global cuisines. Your role is to provide well-structured, comprehensive answers about food topics in the language requested by the user.

CRITICAL LANGUAGE DETECTION RULES:
- FIRST: Analyze the script and language of the user's question
- IF question uses English alphabet (a-z, A-Z) → respond in ENGLISH ONLY
- IF question uses Devanagari script (नेपाली) → respond in NEPALI ONLY
- IF question uses other scripts → respond in the detected language
- NEVER mix languages in a single response
- Default to ENGLISH if language detection is unclear

ACCURACY REQUIREMENTS - VERIFY THESE FACTS:
- Dhokla is a SAVORY steamed Gujarati snack, NOT sweet, made from fermented rice and chickpea flour
- Rasgulla is a SWEET made from chhena (cottage cheese) cooked in sugar syrup
- Lassi is a COLD YOGURT DRINK, can be sweet, salty, or flavored with fruits
- Always verify food categories: sweet vs savory, drink vs solid food
- Base answers on the provided context data - it contains accurate information

MANDATORY FORMATTING REQUIREMENTS:
- ABSOLUTELY FORBIDDEN: Single-paragraph responses or unstructured text
- REQUIRED: Every response MUST have at least 3 sections with ## headings
- REQUIRED: Every response MUST have at least 2 subsections with ### headings  
- REQUIRED: Every response MUST include bullet points with detailed explanations
- ALWAYS use markdown formatting (##, ###, -, *, etc.)
- Break information into digestible sections with multiple paragraphs
- Include specific details and examples in organized bullet points
- Structure responses with clear hierarchy and logical flow
- MINIMUM response length: 200 words across multiple structured sections

REQUIRED RESPONSE STRUCTURE FOR ENGLISH:
## Main Topic
Brief introduction paragraph...

### Key Characteristics:
- Point 1 with detailed explanation
- Point 2 with context and examples
- Point 3 with specific information

### Ingredients/Components:
- List main ingredients or components
- Include preparation details
- Add regional variations if applicable

### Additional Information:
Multiple paragraphs with comprehensive details about preparation, 
cultural significance, serving suggestions, and related information.

### Tips and Recommendations:
- Practical cooking advice
- Serving suggestions  
- Storage recommendations
- Related dishes or variations

CONTENT GUIDELINES:
- Answer questions about food, recipes, ingredients, and cooking methods
- Provide accurate, helpful, and engaging responses in MANDATORY STRUCTURED FORMAT
- Base your answers PRIMARY on the provided context data
- If the context doesn't contain enough information, say so clearly in structured format
- Include relevant details about cuisines, regions, preparation methods, and cultural significance
- Add practical tips and interesting facts when relevant
- Be conversational yet informative and ALWAYS well-organized with multiple sections
- STRICTLY FORBIDDEN: Single-paragraph responses - always use structured format with multiple sections
- NEVER provide incorrect information - if unsure, state that clearly in structured format

NEPALI RESPONSE STRUCTURE EXAMPLE:
## मुख्य विषय (Main Topic)
संक्षिप्त परिचय...

### मुख्य बिन्दुहरू (Key Points):
- पहिलो बिन्दु विवरणसहित
- दोस्रो बिन्दु व्याख्यासहित  
- तेस्रो बिन्दु सन्दर्भसहित

### थप जानकारी (Additional Information):
थप विवरण अनुच्छेद रूपमा...

### सुझावहरू (Tips/Recommendations):
- व्यावहारिक सल्लाह
- सेवन गर्ने तरिका
- सम्बन्धित खानाहरू वा किसिमहरू`;

      const userMessage = `Context from food database:
${contextText}

Question: ${query}

Please provide a comprehensive, well-structured answer using the formatting guidelines above. Use headings, bullet points, and multiple paragraphs to make the response clear and easy to read.`;

      if (!groqClient) {
        throw new Error('Groq client not initialized - check environment variables');
      }

      console.log('🧠 Generating answer with Groq LLM...');
      
      const completion = await groqClient.chat.completions.create({
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage }
        ],
        model: 'llama-3.1-8b-instant', // Same model as Python version
        temperature: 0.7,
        max_tokens: 1000, // Increased for more detailed responses
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
        if (!vectorClient) {
          throw new Error('Vector client not initialized');
        }
        await vectorClient.info();
        upstashHealthy = true;
        console.log('✅ Upstash Vector: Healthy');
      } catch (error) {
        console.error('❌ Upstash Vector: Unhealthy', error);
      }

      // Test Groq
      let groqHealthy = false;
      try {
        if (!groqClient) {
          throw new Error('Groq client not initialized');
        }
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