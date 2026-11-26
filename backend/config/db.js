const dns = require('dns');
const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the MONGO_URI environment variable.
 * Returns true if the connection succeeds, or false if it fails.
 */
async function connectDB() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    console.error('MongoDB error: MONGO_URI is missing in your .env file.');
    return false;
  }

  const connectionOptions = {
    serverSelectionTimeoutMS: 5000,
  };

  // Default to the "smartfix" database if the URI ends at "/" without a database name
  try {
    const parsed = new URL(mongoUri);
    if (!parsed.pathname || parsed.pathname === '/') {
      connectionOptions.dbName = 'smartfix';
    }
  } catch {
    // Let Mongoose validate malformed URIs directly
  }

  try {
    const conn = await mongoose.connect(mongoUri, connectionOptions);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    // On some Windows networks, Node's default DNS refuses mongodb+srv SRV queries.
    // Retry once using public DNS servers (Google / Cloudflare) before failing.
    if (
      mongoUri.startsWith('mongodb+srv://') &&
      error.message &&
      error.message.includes('querySrv')
    ) {
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(mongoUri, connectionOptions);
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return true;
      } catch (retryError) {
        console.error(`MongoDB connection failed: ${retryError.message}`);
        return false;
      }
    }

    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
}

module.exports = connectDB;
