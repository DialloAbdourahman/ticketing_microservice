import { rabbitMqWrapper } from "./rabbitmq-wrapper";
import { ExpirationServiceListener } from "./events/listeners/listener";

const start = async () => {
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
    new ExpirationServiceListener(rabbitMqWrapper.client).listen();
  } catch (error) {
    console.log("Error connecting to Rabbitmq");
    console.log(error);

    // Exit if it cannot connect to rabbit mq and then kubernetes will recreate this pod and retry to connect.
    process.exit();
  }
};

start();
