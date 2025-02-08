import { MongoClient } from "mongodb";
import faker from "faker";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "./config.env" });

async function populateDatabase() {
  const uri = process.env.MONGODB_URI; // Use the connection string from .env
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("analog");

    const collections = ["logistics", "production", "tracking", "user"];

    for (const collectionName of collections) {
      const collection = database.collection(collectionName);

      const entries = Array.from({ length: 100 }, () => ({
        productId: faker.datatype.uuid(),
        productName: faker.commerce.productName(),
        quantityProduced: faker.datatype.number({ min: 1, max: 100 }),
        dateProduced: faker.date.past(),
        moduleCode: faker.random.alphaNumeric(5),
        description: faker.lorem.sentence(),
        reportedBy: faker.name.findName(),
      }));

      const result = await collection.insertMany(entries);
      console.log(
        `${result.insertedCount} entries added to ${collectionName}.`
      );
    }
  } finally {
    await client.close();
  }
}

populateDatabase().catch(console.error);
