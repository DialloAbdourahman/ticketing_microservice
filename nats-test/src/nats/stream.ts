// SUBJECT (ticket.*) = CHANNEL (ticket:*) = TOPIC

import { AckPolicy, connect, RetentionPolicy, StorageType } from "nats";

export const connectToNats = async () => {
  const nc = await connect({
    servers: "http://localhost:4222",
    name: "ticketing",
  });
  return nc;
};

async function createStream() {
  try {
    // Connect to the NATS server
    const nc = await connectToNats();

    // Get the JetStreamManager instance
    const jsm = await nc.jetstreamManager();

    // Create a new stream
    await jsm.streams.add({
      name: "tickets",
      subjects: ["ticket.*"],
      storage: StorageType.File,
      retention: RetentionPolicy.Limits,
      max_msgs: -1,
      max_bytes: -1,
    });

    // Create a consumer
    // const consumers = await jsm.consumers.list("tickets").next();

    await jsm.consumers.add("tickets", {
      durable_name: "me",
      ack_policy: AckPolicy.Explicit,
    });

    console.log("Stream 'tickets' created");
  } catch (err) {
    console.error("Error creating stream:", err);
  }
}

createStream();
