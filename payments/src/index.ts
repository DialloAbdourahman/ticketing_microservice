import mongoose from "mongoose";
import { app } from "./app";
import { rabbitMqWrapper } from "./rabbitmq-wrapper";
import { PaymentsServiceListener } from "./events/listeners/listener";

const start = async () => {
  console.log("Starting up.....");

  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined.");
  }

  if (!process.env.STRIPE_KEY) {
    throw new Error("STRIPE_KEY must be defined.");
  }

  if (!process.env.WEBHOOK_KEY) {
    throw new Error("WEBHOOK_KEY must be defined.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    console.log("Database connection error.");
    console.error(error);
  }

  try {
    await rabbitMqWrapper.connect();

    // If for what ever reason we disconnect to skaffold like we delete the skaffold pod
    rabbitMqWrapper.client.on("close", () => {
      console.log("Rabbitmq connection closed.");
      process.exit();
    });

    // when the app terminates
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Closing RabbitMQ connection...");
      await rabbitMqWrapper.client.close();
    });

    // when the app terminates
    process.on("SIGINT", async () => {
      console.log("SIGINT received. Closing RabbitMQ connection...");
      await rabbitMqWrapper.client.close();
    });

    // Running the listener
    new PaymentsServiceListener(rabbitMqWrapper.client).listen();
  } catch (error) {
    console.log("Error connecting to Rabbitmq.");
    console.log(error);

    // Exit if it cannot connect to rabbit mq and then kubernetes will recreate this pod and retry to connect.
    process.exit();
  }

  app.listen(3000, () => {
    console.log(`Payments service running on port 3000`);
  });
};

start();
