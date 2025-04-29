const { Client } = require('pg');

async function testConnection(connectionString, dbName) {
  const client = new Client({
    connectionString,
  });

  try {
    console.log(`Testing connection to ${dbName}...`);
    await client.connect();
    console.log('Connection successful!');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('Database time:', result.rows[0].current_time);
    
    await client.end();
    return true;
  } catch (error) {
    console.error('Connection failed:', error.message);
    try {
      await client.end();
    } catch (endError) {}
    return false;
  }
}

async function run() {
  const connectionString1 = 'postgresql://postgres:[PASSWORD_REMOVED]@34.47.193.104:5432/medcon?sslmode=require';
  const connectionString2 = 'postgres://avnadmin:[PASSWORD_REMOVED]@medconnect-medconnect.h.aivencloud.com:10789/defaultdb?sslmode=require';
  
  try {
    console.log("Trying with SSL verification enabled:");
    const result1 = await testConnection(connectionString1, 'GCP PostgreSQL');
    console.log();
    const result2 = await testConnection(connectionString2, 'Aiven PostgreSQL');
    
    if (result1 && result2) {
      console.log("\n✅ All database connections successful.");
    } else {
      console.log("\n❌ Some connections failed.");
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

run();
