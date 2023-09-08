import dotenv from 'dotenv'
dotenv.config()
const { DB_CONN_STRING } = process.env;
import { MongoClient, ServerApiVersion } from 'mongodb'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_CONN_STRING, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const connectDB = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
};