import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined.");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.log("Database connection error.");
    console.error(error);
    process.exit();
  }

  app.listen(3000, () => {
    console.log(`Auth service running on port 3000`);
  });
};

start();
