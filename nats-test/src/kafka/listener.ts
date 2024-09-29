import { kafka } from "./kafka";

const listen = async () => {
  const consumer = kafka.consumer({
    groupId: "test-group",
    retry: { retries: 5 },
  });

  await consumer.connect();
  await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

  await consumer.run({
    autoCommit: false,

    eachMessage: async ({ topic, partition, message, heartbeat }) => {
      const value = JSON.parse(message?.value?.toString()!);

      try {
        console.log("Processing message:", value);

        // Simulate processing the message (e.g., database operation)

        // Manually commit the offset only after successful processing
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (parseInt(message.offset) + 1).toString(),
          },
        ]);

        console.log(
          `Message processed and offset committed: ${message.offset}`
        );
      } catch (error) {
        console.error(`Failed to process message: ${error}`);
        // The offset is not committed, so Kafka will resend the message
      }
    },
  });
};

listen().catch(console.error);
