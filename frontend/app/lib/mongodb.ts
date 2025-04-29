import { MongoClient } from 'mongodb';

// If there's no cached client, create a new one
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const primaryUri = process.env.MONGODB_URI;
const fallbackUri = process.env.MONGODB_ATLAS_URI;
let activeUri = primaryUri;

// Extract database name from the URI
const getDbNameFromUri = (uri: string) => {
  if (uri.includes('mongodb+srv')) {
    return uri.split('/').pop()?.split('?')[0] || 'medconnect';
  }
  return 'medconnect';
};

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    // Return cached connection
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // First try the primary connection
    const client = new MongoClient(activeUri);
    await client.connect();
    
    const dbName = getDbNameFromUri(activeUri);
    const db = client.db(dbName);
    
    // Cache the client and db connections
    cachedClient = client;
    cachedDb = db;
    
    console.log('Connected to MongoDB successfully');
    return { client, db };
  } catch (primaryError) {
    console.error('Error connecting to primary MongoDB:', primaryError);
    
    // If we're already using the fallback, or there is no fallback, throw the error
    if (activeUri === fallbackUri || !fallbackUri) {
      throw primaryError;
    }
    
    console.log('Trying fallback MongoDB connection...');
    try {
      // Try the fallback connection
      activeUri = fallbackUri;
      const client = new MongoClient(activeUri);
      await client.connect();
      
      const dbName = getDbNameFromUri(activeUri);
      const db = client.db(dbName);
      
      // Cache the client and db connections
      cachedClient = client;
      cachedDb = db;
      
      console.log('Connected to fallback MongoDB successfully');
      return { client, db };
    } catch (fallbackError) {
      console.error('Error connecting to fallback MongoDB:', fallbackError);
      throw fallbackError;
    }
  }
}

export async function disconnectFromDatabase() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('Disconnected from MongoDB');
  }
}

export default { connectToDatabase, disconnectFromDatabase }; 