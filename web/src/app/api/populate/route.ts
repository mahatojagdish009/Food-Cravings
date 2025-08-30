import { NextRequest, NextResponse } from 'next/server';
import { Index } from '@upstash/vector';
import fs from 'fs';
import path from 'path';

// Lazy initialization function for vector client
function getVectorClient() {
  return new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
  });
}

interface FoodItem {
  id: string;
  text: string;
  region: string;
  type: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting database population...');
    
    // Read the foods.json file from the parent directory
    const foodsPath = path.join(process.cwd(), '..', 'foods.json');
    
    if (!fs.existsSync(foodsPath)) {
      return NextResponse.json({
        error: 'foods.json file not found',
        message: 'Please ensure foods.json exists in the parent directory'
      }, { status: 404 });
    }

    const foodsData = fs.readFileSync(foodsPath, 'utf8');
    const foods: FoodItem[] = JSON.parse(foodsData);

    console.log(`📚 Found ${foods.length} food items to upload`);

    // Prepare vectors for batch upload
    const vectors = foods.map((food) => ({
      id: `food_${food.id}`,
      data: food.text, // Upstash will auto-embed this text
      metadata: {
        text: food.text,
        region: food.region,
        type: food.type,
        name: extractFoodName(food.text),
        cuisine: mapRegionToCuisine(food.region),
        category: food.type,
        description: food.text,
      },
    }));

    // Upload in batches (Upstash has limits on batch size)
    const batchSize = 100;
    let uploaded = 0;
    
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      
      try {
        const vectorClient = getVectorClient();
        await vectorClient.upsert(batch);
        uploaded += batch.length;
        console.log(`✅ Uploaded batch: ${uploaded}/${vectors.length} items`);
      } catch (error) {
        console.error(`❌ Failed to upload batch starting at index ${i}:`, error);
        throw error;
      }
    }

    console.log(`🎉 Successfully populated database with ${uploaded} food items!`);

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploaded} food items to vector database`,
      totalItems: foods.length,
      uploaded: uploaded,
    });

  } catch (error) {
    console.error('❌ Database population failed:', error);
    
    return NextResponse.json({
      error: 'Database population failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { status: 500 });
  }
}

// Helper function to extract food name from text
function extractFoodName(text: string): string {
  const sentences = text.split('.');
  const firstSentence = sentences[0].trim();
  
  // Extract the food name (usually the first part before "is")
  const match = firstSentence.match(/^(.+?)\s+is\s+/i);
  if (match) {
    return match[1].trim();
  }
  
  // Fallback: take first few words
  return firstSentence.split(' ').slice(0, 3).join(' ');
}

// Helper function to map regions to cuisine types
function mapRegionToCuisine(region: string): string {
  const cuisineMap: Record<string, string> = {
    'India': 'Indian',
    'North India': 'Indian',
    'South India': 'Indian',
    'Punjab': 'Indian',
    'Bengal': 'Indian',
    'Gujarat': 'Indian',
    'Delhi': 'Indian',
    'Mumbai': 'Indian',
    'Hyderabad': 'Indian',
    'China': 'Chinese',
    'Shanghai': 'Chinese',
    'Sichuan, China': 'Chinese',
    'Cantonese, China': 'Chinese',
    'Japan': 'Japanese',
    'Korea': 'Korean',
    'Thailand': 'Thai',
    'Vietnam': 'Vietnamese',
    'Indonesia': 'Indonesian',
    'Malaysia': 'Malaysian',
    'Philippines': 'Filipino',
    'Taiwan': 'Taiwanese',
    'Hong Kong': 'Cantonese',
    'Italy': 'Italian',
    'Northern Italy': 'Italian',
    'Rome, Italy': 'Italian',
    'Naples, Italy': 'Italian',
    'Veneto, Italy': 'Italian',
    'France': 'French',
    'Burgundy, France': 'French',
    'Marseille, France': 'French',
    'Spain': 'Spanish',
    'Andalusia, Spain': 'Spanish',
    'Mexico': 'Mexican',
    'Spain/Mexico': 'Spanish/Mexican',
    'Greece': 'Greek',
    'Turkey': 'Turkish',
    'Middle East': 'Middle Eastern',
    'Morocco': 'Moroccan',
    'North Africa': 'North African',
    'West Africa': 'West African',
    'West/Central Africa': 'African',
    'Ethiopia': 'Ethiopian',
    'South Africa': 'South African',
    'United States': 'American',
    'Southern United States': 'Southern American',
    'New England, USA': 'American',
    'Hawaii, USA': 'Hawaiian',
    'Canada': 'Canadian',
    'Quebec, Canada': 'Canadian',
    'Brazil': 'Brazilian',
    'Argentina': 'Argentinian',
    'Peru': 'Peruvian',
    'United Kingdom': 'British',
    'Scotland': 'Scottish',
    'Yorkshire, England': 'British',
    'Germany': 'German',
    'Black Forest, Germany': 'German',
    'Rhineland, Germany': 'German',
    'Hungary': 'Hungarian',
    'Poland': 'Polish',
    'Ukraine': 'Ukrainian',
    'Russia': 'Russian',
    'Mongolia': 'Mongolian',
    'Nepal': 'Nepalese',
    'Bangladesh': 'Bangladeshi',
    'Pakistan': 'Pakistani',
    'Australia': 'Australian',
    'New Zealand': 'New Zealand',
    'Samoa, South Pacific': 'Polynesian',
    'Fiji, South Pacific': 'Fijian',
    'Finland': 'Finnish',
    'Scandinavia': 'Scandinavian',
    'Norway': 'Norwegian',
    'Sweden': 'Swedish',
    'Denmark': 'Danish',
  };
  
  return cuisineMap[region] || region;
}

// GET method for info
export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to populate the database with food items from foods.json',
    endpoints: {
      populate: 'POST /api/populate - Upload all foods to vector database',
      chat: 'POST /api/chat - Query the RAG system',
      health: 'GET /api/chat - Check system health',
    }
  });
}