import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

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
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Runs after all out tests are done running. Here we wanne disconnect
afterAll(async () => {
  await mongoose.connection.close();
  console.log("disconnected to mongodb");
});

export const signinTest = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie as string[];
};
