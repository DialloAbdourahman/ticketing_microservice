import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

let mongo: MongoMemoryServer;

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
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Runs after all out tests are done running. Here we wanne disconnect
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
  console.log("disconnected to the in-memory test mongodb");
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
