import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "1",
  brokers: ["localhost:9092"],
});

// Test groups well and make sure the load is distributed effectively.
// Make sure that if a message is not acknowledged, kafka will resend it. (While Kafka's behavior can lead to scenarios where unacknowledged messages might seem "lost" until a consumer restart, they are not actually lost—Kafka will reassign and reprocess them after a consumer restart or rebalance. However, without a consumer restart, Kafka assumes the consumer is still processing the message, so it doesn't automatically retry within the same session.)
