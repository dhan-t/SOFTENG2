// /src/db/connect.js
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config({path: './config.env' }); // Ensure environment variables are loaded

// MongoDB client setup
const client = new MongoClient(process.env.ATLAS_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connect() {
  try {
    await client.connect();
    await client.db("analogs").command({ ping: 1 }); // Test connection
    console.log("Connected to the database!");
    return client; // Return the client to be used in other files
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}
