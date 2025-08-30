// TypeScript types for RAG-Food application
export interface FoodItem {
  id: string;
  text: string;
  metadata?: {
    name?: string;
    cuisine?: string;
    category?: string;
    description?: string;
  };
}

export interface SearchResult {
  id: string;
  score: number;
  metadata: {
    text: string;
    name?: string;
    cuisine?: string;
    category?: string;
    description?: string;
  };
}

export interface RAGResponse {
  answer: string;
  sources: SearchResult[];
  query: string;
  timestamp: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: SearchResult[];
}

export interface StreamingResponse {
  type: 'token' | 'sources' | 'complete' | 'error';
  content?: string;
  sources?: SearchResult[];
  error?: string;
}