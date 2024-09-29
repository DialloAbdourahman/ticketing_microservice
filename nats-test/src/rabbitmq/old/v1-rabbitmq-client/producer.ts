import { rabbit } from "./connection";

// Declare a publisher
// See API docs for all options
const pub = rabbit.createPublisher({
  // Enable publish confirmations, similar to consumer acknowledgements
  confirm: true,
  // Enable retries
  maxAttempts: 2,
  // Optionally ensure the existence of an exchange before we use it
  exchanges: [{ exchange: "my-events", type: "topic" }],
});

// // Publish a message to a custom exchange
// await pub.send(
//   { exchange: "my-events", routingKey: "users.visit" }, // metadata
//   { id: 1, name: "Alan Turing" }
// ); // message content

// Or publish directly to a queue
const publish = async () => {
  await pub.send("user-events", { id: 1, name: "Alan Turing" });
  console.log("Message was published.");
};

publish();

// Clean up when you receive a shutdown signal
async function onShutdown() {
  // Waits for pending confirmations and closes the underlying Channel
  await pub.close();
  // Stop consuming. Wait for any pending message handlers to settle.
  await rabbit.close();
}
process.on("SIGINT", onShutdown);
process.on("SIGTERM", onShutdown);
