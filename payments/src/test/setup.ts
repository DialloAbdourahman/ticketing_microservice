import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Load environment variables from .env file in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Could have also mocked this : TicketCreatedPublisher
jest.mock("../rabbitmq-wrapper.ts");
jest.mock("../stripe.ts");

// Runs before all our tests starts
beforeAll(async () => {
  process.env.JWT_KEY = "ASDFASDF";
  process.env.MONGO_URI = "mongodb://localhost:27017/auth-test";

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb successfully");
  } catch (error) {
    console.log("Database connection error", error);
    // process.exit();
  }
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
  await mongoose.connection.close();
  console.log("disconnected to mongodb");
});

export const signinTest = (id?: string) => {
  // Build a jwt payload. {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
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
