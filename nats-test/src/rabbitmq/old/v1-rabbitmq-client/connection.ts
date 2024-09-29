import { Connection } from "rabbitmq-client";

// Initialize:
export const rabbit = new Connection("amqp://user:password@localhost:5672");

rabbit.on("error", (err) => {
  console.log("RabbitMQ connection error", err);
});
rabbit.on("connection", () => {
  console.log("Connection successfully (re)established");
});
