import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

let mongo: MongoMemoryServer;

// Could have also mocked this : TicketCreatedPublisher
jest.mock("../rabbitmq-wrapper.ts");

// Runs before all our tests starts
beforeAll(async () => {
  process.env.JWT_KEY = "ASDFASDF";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
  console.log("Connected to the in-memory test mongodb");
});

// Runs before each or our test starts. Here we are cleaning the db.
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Runs after all out tests are done running. Here we wanne disconnect
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
  console.log("disconnected to the in-memory test mongodb");
});

export const signinTest = () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  // Build a jwt payload. {id, email}
  const payload = {
    id,
    email: "test@test.com",
  };

  // Create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: "1h" }); // Add expiration if needed

  // Build a session object. {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Return the string
  return [`session=${base64}`];
};
